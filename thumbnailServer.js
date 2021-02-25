const Stream = require('stream'),
  worker = require('worker_threads'),
  express = require('express'),
  app = express(),
  instance = process.env.NODE_APP_INSTANCE || 0,
  port = parseInt(`810${instance}`);

app.get('/preview/:file/', async (req, res) => {
  let thumbWorker = new worker.Worker('./thumbnailGenerator.js', {
    workerData: {
      file: req.params.file
    }
  });
  thumbWorker.on('online', () => {
    console.debug('Generating...');
  });
  thumbWorker.on('exit', () => {
    console.debug('Done');
  });
  thumbWorker.on('message', data => {
    if (data.status === 404) res.status(404).json({ error: 'Not found' });
    else if (data.status === 500)
      res.status(500).json({ error: 'Internal Server Error' });
    else {
      let stream = new Stream.Readable();
      stream._read = () => {};
      stream.push(Buffer.from(data.file));
      stream.push(null);
      stream.pipe(res.status(data.status));
    }
  });
});

app.listen(port);
console.log(`Listening on ${port}`);
