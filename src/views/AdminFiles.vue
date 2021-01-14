<template>
  <Header
    ref="header"
    title="Files"
    subtitle="Everything uploaded is right here."
    :buttons="[
      {
        text: 'Back',
        action: back,
        title: 'Head back.'
      }
    ]"
  />
  <div ref="files" class="projects">
    <Project
      v-for="file in files"
      :key="file.filename"
      :classes="['auth', 'float']"
      :to="`/admin/file/${file.filename}/`"
      :title="file.filename"
    >
      Click me to look at info about the file {{ file.filename }}
    </Project>
  </div>
  <Footer>
    <div v-if="!loading && !hideLoadMore" class="loadmore">
      <p class="footer_text" @click="loadMore">
        Load More
      </p>
    </div>
    <div v-else-if="!hideLoadMore" class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </Footer>
</template>

<script>
  import Header from '@/components/Header.vue';
  import Project from '@/components/Project.vue';
  import Footer from '@/components/Footer.vue';
  export default {
    name: 'AdminFiles',
    title: 'Files',
    components: {
      Header,
      Project,
      Footer
    },
    data() {
      return {
        loading: true,
        hideLoadMore: false,
        offset: 0,
        files: []
      };
    },
    beforeCreate() {
      fetch('/api/user/', {
        headers: {
          Authorization: `${window.localStorage.getItem('token')}`
        }
      }).then(
        res => {
          switch (res.status) {
            case 200:
              fetch(
                this.$route.params.user
                  ? `/api/files/${this.$route.params.user}/?offset=${this.offset}`
                  : `/api/files/all/?offset=${this.offset}`,
                {
                  headers: {
                    Authorization: window.localStorage.getItem('token')
                  }
                }
              ).then(uploads => {
                if (uploads.status === 200) {
                  uploads.json().then(json => {
                    this.$refs.header.sharedState.subtitle =
                      this.$refs.header.sharedState.subtitle +
                      `\nThere are ${json.count} files.`;
                    this.offset += json.files.length;
                    this.files.push(...json.files);
                    this.loading = false;
                  });
                } else {
                  this.$parent.$parent.temporaryToast(
                    'An unknown error occurred, if this issue persists contact AlekEagle.'
                  );
                }
              });
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
          this.uploading = false;
          this.$parent.$parent.temporaryToast(
            'An unknown error occurred, if this issue persists contact AlekEagle.',
            10 * 1000
          );
          console.error(err);
        }
      );
    },
    methods: {
      loadMore() {
        this.loading = true;
        fetch(
          this.$route.params.user
            ? `/api/files/${this.$route.params.user}/?offset=${this.offset}`
            : `/api/files/all/?offset=${this.offset}`,
          {
            headers: {
              Authorization: window.localStorage.getItem('token')
            }
          }
        ).then(
          uploads => {
            switch (uploads.status) {
              case 200:
                uploads.json().then(json => {
                  this.offset += json.files.length;
                  if (json.files.length < 1) {
                    this.hideLoadMore = true;
                  }
                  this.files.push(...json.files);
                  this.loading = false;
                });
                break;
              case 429:
                this.$parent.$parent.temporaryToast(
                  `Woah, slow down! Please wait ${Math.floor(
                    (uploads.headers.get('x-ratelimit-reset') * 1000 -
                      Date.now()) /
                      1000 /
                      60
                  )} minutes ${
                    Math.floor(
                      ((uploads.headers.get('x-ratelimit-reset') * 1000 -
                        Date.now()) /
                        1000) %
                        60
                    ) !== 0
                      ? `and ${Math.floor(
                          ((uploads.headers.get('x-ratelimit-reset') * 1000 -
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
                  'An unknown error occurred, if this issue persists contact AlekEagle.'
                );
                break;
            }
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
      back() {
        this.$router.push(
          this.$route.params.user
            ? `/admin/users/${this.$route.params.user}/`
            : '/admin/'
        );
      }
    }
  };
</script>

<style>
  .loadmore {
    padding-bottom: 23px;
  }
  .loadmore p {
    cursor: pointer;
  }
</style>
