const worker = require('worker_threads'),
  Stream = require('stream'),
  gm = require('gm'),
  fs = require('fs'),
  fileType = require('file-type'),
  child_process = require('child_process');

if (worker.isMainThread) throw new Error("can't be ran as main thread");
(async function() {
  if (!fs.existsSync('/tmp/sharex-previews'))
    fs.mkdirSync('/tmp/sharex-previews');

  if (fs.existsSync(`uploads/${worker.workerData.file}`)) {
    if (
      fs.existsSync(
        `/tmp/sharex-previews/${worker.workerData.file.split('.')[0]}.webp`
      )
    ) {
      console.log('file already exists, serving existing file');
      worker.parentPort.postMessage({
        status: 200,
        file: fs
          .readFileSync(
            `/tmp/sharex-previews/${worker.workerData.file.split('.')[0]}.webp`
          )
          .toJSON().data
      });
      process.exit(0);
    } else {
      let ft = await fileType.fromStream(
        fs.createReadStream(`uploads/${worker.workerData.file}`)
      );
      if (!ft || (!ft.mime.includes('image/') && !ft.mime.includes('video/'))) {
        worker.parentPort.postMessage({
          status: 415,
          file: fs.readFileSync('public/img/nopv.png').toJSON().data
        });
      } else if (ft.mime.includes('image/')) {
        let cacheFileStream = fs.createWriteStream(
          `/tmp/sharex-previews/${worker.workerData.file.split('.')[0]}.webp`
        );
        let fileStream = new Stream.PassThrough(),
          resultStream = new Stream.PassThrough(),
          chunks = [],
          resultBuffer;

        let previewStream = gm(`uploads/${worker.workerData.file}`)
          .resize('256', '256', '^')
          .gravity('Center')
          .crop('200', '200')
          .setFormat('webp')
          .stream();
        previewStream.pipe(fileStream);
        previewStream.pipe(resultStream);
        fileStream.pipe(cacheFileStream);
        resultStream.on('data', chunk => chunks.push(chunk));
        resultStream.on('end', () => {
          resultBuffer = Buffer.concat(chunks);
          worker.parentPort.postMessage({
            status: 201,
            file: resultBuffer.toJSON().data
          });
        });
      } else if (ft.mime.includes('video/')) {
        child_process.exec(
          `ffmpeg -i uploads/${
            worker.workerData.file
          } -vf "crop=w='min(iw\,ih)':h='min(iw\,ih)',scale=256:256,setsar=1" -vframes 1 /tmp/sharex-previews/${
            worker.workerData.file.split('.')[0]
          }.webp`,
          (err, stdout, stderr) => {
            if (err) {
              worker.parentPort.postMessage({
                status: 500,
                file: null
              });
              console.error(err, stderr);
              process.exit(0);
            } else {
              worker.parentPort.postMessage({
                status: 201,
                file: fs
                  .readFileSync(
                    `/tmp/sharex-previews/${
                      worker.workerData.file.split('.')[0]
                    }.webp`
                  )
                  .toJSON().data
              });
              process.exit(0);
            }
          }
        );
      }
    }
  } else {
    worker.parentPort.postMessage({
      status: 404,
      file: null
    });
    process.exit(0);
  }
})();
