<template>
  <Header
    title="File Info"
    subtitle="Info about this file."
    :buttons="[
      {
        title: 'Go back to the file list.',
        text: 'Back',
        to: '/me/files/'
      }
    ]"
  />
  <div class="projects" v-if="user.id !== undefined">
    <Project title="File Info" :classes="['float', 'auth']" :action="openFile">
      Filename: {{ file.filename }}
      <br />
      File size: {{ memory(file.size) }}
      <br />
      Uploaded on: {{ new Date(file.createdAt).toLocaleString() }}
      <br />
      Uploaded by:
      {{ user.displayName !== undefined ? user.displayName : 'Loading...' }}
      <br />
      Click on me to view the file!
    </Project>
    <Project
      title="Delete the File"
      :classes="['float', 'auth']"
      :action="deleteFile"
    >
      Click on me to delete the file, FOREVER.
    </Project>
  </div>
  <div v-else class="lds-ellipsis">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <Modal
    ref="modal"
    title="Delete the File"
    :buttons="[
      {
        title: 'Confirm that you want to permanently delete the file.',
        action: confirmDelete,
        text: 'I\'m sure, delete it.'
      }
    ]"
    :cancelable="true"
  >
    By confirming you want to delete this file, you agree that you CANNOT
    recover this file, ever.
  </Modal>
  <Footer />
</template>

<script>
  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';
  import Project from '@/components/Project.vue';
  import Modal from '@/components/Modal.vue';
  export default {
    name: 'FileInfo',
    title: 'Your Files',
    components: {
      Header,
      Footer,
      Project,
      Modal
    },
    methods: {
      memory(mem) {
        if (mem / 1024 / 1024 / 1024 > 1024)
          return `${(mem / 1024 / 1024 / 1024 / 1024)
            .toString()
            .slice(
              0,
              (mem / 1024 / 1024 / 1024 / 1024).toString().indexOf('.') + 3
            )}TB`;
        else if (mem / 1024 / 1024 > 1024)
          return `${(mem / 1024 / 1024 / 1024)
            .toString()
            .slice(
              0,
              (mem / 1024 / 1024 / 1024).toString().indexOf('.') + 3
            )}GB`;
        else if (mem / 1024 > 1024)
          return `${(mem / 1024 / 1024)
            .toString()
            .slice(0, (mem / 1024 / 1024).toString().indexOf('.') + 3)}MB`;
        else if (mem > 1024)
          return `${(mem / 1024)
            .toString()
            .slice(0, (mem / 1024).toString().indexOf('.') + 3)}KB`;
        else return `${mem}B`;
      },
      openFile() {
        window.open(`/${this.file.filename}`, '_blank');
      },
      deleteFile() {
        this.$refs.modal.showModal();
      },
      confirmDelete() {
        fetch(`/api/file/${this.file.filename}/`, {
          headers: {
            Authorization: window.localStorage.getItem('token')
          },
          method: 'DELETE'
        }).then(res => {
          switch (res.status) {
            case 204:
              this.$refs.modal.hideModal();
              this.$router.go(-1);
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
          }
        });
      }
    },
    beforeMount() {
      fetch('/api/user/', {
        headers: {
          Authorization: `${window.localStorage.getItem('token')}`
        }
      }).then(res => {
        switch (res.status) {
          case 200:
            fetch(`/api/file/${this.$route.params.file}/`, {
              headers: {
                Authorization: window.localStorage.getItem('token')
              }
            }).then(
              res => {
                switch (res.status) {
                  case 200:
                    res.json().then(json => {
                      this.file = json;
                      fetch(`/api/user/${this.file.userid}/`, {
                        headers: {
                          Authorization: window.localStorage.getItem('token')
                        }
                      }).then(
                        res => {
                          switch (res.status) {
                            case 200:
                              res.json().then(json => {
                                this.user = json;
                              });
                              break;
                            case 429:
                              this.$parent.$parent.temporaryToast(
                                `Woah, slow down! Please wait ${Math.floor(
                                  (res.headers.get('x-ratelimit-reset') * 1000 -
                                    Date.now()) /
                                    1000 /
                                    60
                                )} minutes ${
                                  Math.floor(
                                    ((res.headers.get('x-ratelimit-reset') *
                                      1000 -
                                      Date.now()) /
                                      1000) %
                                      60
                                  ) !== 0
                                    ? `and ${Math.floor(
                                        ((res.headers.get('x-ratelimit-reset') *
                                          1000 -
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
                    });
                    break;
                  case 403:
                    this.$parent.$parent.temporaryToast(
                      "That's strange, but this file isn't yours."
                    );
                    this.$router.push('/me/files/');
                    break;
                  case 429:
                    this.$parent.$parent.temporaryToast(
                      `Woah, slow down! Please wait ${Math.floor(
                        (res.headers.get('x-ratelimit-reset') * 1000 -
                          Date.now()) /
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
            break;
          case 429:
            this.$parent.$parent.temporaryToast(
              `Woah, slow down! Please wait ${Math.floor(
                (res.headers.get('x-ratelimit-reset') * 1000 - Date.now()) /
                  1000 /
                  60
              )} minutes ${
                Math.floor(
                  ((res.headers.get('x-ratelimit-reset') * 1000 - Date.now()) /
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
      });
    },
    data() {
      return {
        file: {},
        user: {}
      };
    }
  };
</script>
