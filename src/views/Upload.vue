<template>
  <Header
    title="Upload Files"
    subtitle="Upload files directly from your browser!"
    :buttons="[
      {
        title: 'Back to Dashboard',
        to: '/me/',
        text: 'Back'
      }
    ]"
  />
  <div class="projects">
    <Project title="File to Upload" :noSpan="true" :classes="['float', 'auth']">
      <form @submit.prevent="uploadFile">
        <input
          type="file"
          name="file"
          @change.prevent="fileAdded"
          id="file"
          class="uploadfile"
        />
        <label
          v-text="file && state === 'default' ? file.name : text[state]"
          @dragover.prevent.stop="state = 'dragover'"
          @dragleave.prevent.stop="state = 'default'"
          @drop.prevent.stop="drop"
          for="file"
        ></label>
        <button class="button" v-if="file">Beam it up, Scotty</button>
        <button class="button" v-else disabled>
          Beam it up, Scotty
        </button>
      </form>
    </Project>
    <Project
      v-if="link && !uploading"
      title="Success!"
      @click="copyLink"
      :classes="['float', 'auth']"
    >
      Click me to copy the link to your clipboard again!
    </Project>
    <Project
      v-if="uploading"
      title="Uploading..."
      :classes="['float', 'auth']"
      :disabled="true"
    >
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Project>
  </div>

  <Footer />
</template>

<script>
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  import Project from '@/components/Project.vue';

  function parseQueryString(qs, sep, eq) {
    let parsed = {};
    qs.split(sep || '&').forEach(p => {
      let ps = p.split(eq || '=');
      parsed[unescape(ps[0])] = ps[1] ? unescape(ps[1]) : true;
    });
    return parsed;
  }

  export default {
    name: 'Upload',
    components: {
      Header,
      Footer,
      Project
    },
    beforeMount() {
      fetch('/api/user/', {
        headers: {
          Authorization: `${window.localStorage.getItem('token')}`
        }
      }).then(
        res => {
          switch (res.status) {
            case 200:
              if (window.location.href.split('?').length > 1) {
                fetch(
                  `/tmp/${
                    parseQueryString(window.location.href.split('?')[1]).file
                  }`
                ).then(res => {
                  if (res.headers.get('X-Filename') === null) return;
                  res.blob().then(slime => {
                    this.file = new File(
                      [slime],
                      res.headers.get('X-Filename')
                    );
                    this.uploadFile();
                  });
                });
              }
              break;
            case 429:
              this.$parent.$parent.temporaryToast(
                `Woah, slow down! Please wait ${Math.floor(
                  (res.headers.get('x-ratelimit-reset') * 1000 - Date.now()) /
                    1000 /
                    60
                )} minutes ${
                  Math.floor(
                    ((res.headers.get('x-ratelimit-reset') * 1000 -
                      Date.now()) /
                      1000) %
                      60
                  ) !== 0
                    ? `and ${Math.floor(
                        ((res.headers.get('x-ratelimit-reset') * 1000 -
                          Date.now()) /
                          1000) %
                          60
                      )} seconds`
                    : ''
                } before trying again!`
              );
              break;
            default:
              this.$router.push(`/auth/?redirect=${window.location.pathname}`);
              break;
          }
        },
        err => {
          this.$parent.$parent.temporaryToast(
            'An unknown error occurred, if this issue persists contact AlekEagle.',
            10 * 1000
          );
          console.error(err);
        }
      );
    },
    data() {
      return {
        file: undefined,
        text: {
          dragover: 'Drop it right here!',
          manyFiles: "That's too many files for me!",
          default: 'Your file here.'
        },
        state: 'default',
        link: undefined,
        uploading: false
      };
    },
    methods: {
      drop(e) {
        if (e.dataTransfer.files.length > 1) {
          this.state = 'manyFiles';
          setTimeout(() => {
            this.state = 'default';
          }, 5000);
          return;
        }
        this.state = 'default';
        this.file = e.dataTransfer.files[0];
      },
      fileAdded(e) {
        if (e.target.files.length > 1) {
          this.state = 'manyFiles';
          setTimeout(() => {
            this.state = 'default';
          }, 5000);
          return;
        }
        this.state = 'default';
        this.file = e.target.files[0];
      },
      uploadFile() {
        if (this.uploading) {
          this.$parent.$parent.temporaryToast(
            'You can only upload one thing at a time!'
          );
          return;
        }
        this.uploading = true;
        this.link = null;
        let data = new FormData();
        data.append('file', this.file);
        fetch('/api/upload/', {
          headers: {
            Authorization: window.localStorage.getItem('token')
          },
          method: 'POST',
          body: data
        }).then(
          res => {
            switch (res.status) {
              case 201:
                res.text().then(link => {
                  this.file = undefined;
                  this.link = link;
                  navigator.clipboard.writeText(link).then(
                    () => {
                      this.$parent.$parent.temporaryToast(
                        'Upload successful, link was automatically copied to your clipboard!'
                      );
                    },
                    err => {
                      this.$parent.$parent.temporaryToast(
                        "Upload successful, I wasn't able to copy the link to your clipboard though. Click that button to copy it!"
                      );
                      console.error(err);
                    }
                  );
                });
                break;
              case 413:
                this.$parent.$parent.temporaryToast(
                  'The file is too big, The maximum file size is 100MB!'
                );
                break;
              case 429:
                this.$parent.$parent.temporaryToast(
                  `Woah, slow down! Please wait ${Math.floor(
                    (res.headers.get('x-ratelimit-reset') * 1000 - Date.now()) /
                      1000 /
                      60
                  )} minutes ${
                    Math.floor(
                      ((res.headers.get('x-ratelimit-reset') * 1000 -
                        Date.now()) /
                        1000) %
                        60
                    ) !== 0
                      ? `and ${Math.floor(
                          ((res.headers.get('x-ratelimit-reset') * 1000 -
                            Date.now()) /
                            1000) %
                            60
                        )} seconds`
                      : ''
                  } before trying again!`
                );
                break;
              default:
                this.$parent.$parent.temporaryToast(
                  'An unknown error occurred, if this issue persists contact AlekEagle.',
                  10 * 1000
                );
                break;
            }
            this.uploading = false;
          },
          err => {
            this.uploading = false;
            this.$parent.$parent.temporaryToast(
              'An unknown error occurred, if this issue persists contact AlekEagle.',
              10 * 1000
            );
            console.error(err);
          }
        );
      },
      copyLinkToast() {
        this.$parent.$parent.temporaryToast('Link copied to clipboard!');
        navigator.clipboard.writeText(this.link).then(
          () => {
            this.$parent.$parent.temporaryToast('Link copied to clipboard!');
          },
          err => {
            this.$parent.$parent.temporaryToast(
              "I wasn't able to copy the link to your clipboard, if this issue persists contact AlekEagle."
            );
            console.error(err);
          }
        );
      }
    }
  };
</script>

<style></style>
