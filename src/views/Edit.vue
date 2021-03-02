<template>
  <Header
    title="Edit Your Profile"
    subtitle="Change all of the aspects of your profile here!"
    :buttons="[
      {
        text: 'Back',
        title: 'Back to your main dashboard.',
        to: '/me/'
      }
    ]"
  />

  <div class="projects" v-if="user.id !== ''">
    <Project
      title="Your Profile Info"
      :classes="['auth', 'float']"
      :noSpan="true"
    >
      Username: {{ user.displayName }}
      <br />
      Email: {{ user.email }}
      <br />
      ID: {{ user.id }}
      <br />
      Password: ¯\_(ツ)_/¯
      <br />
      Domain: {{ user.subdomain }}{{ user.subdomain ? '.' : ''
      }}{{ user.domain }}
      <br />
      Staff?: {{ user.staff !== '' ? user.staff : 'No' }}
    </Project>
    <Project
      title="Change your account info"
      :classes="['auth', 'float']"
      :action="showAccInfoModal"
    >
      Click me to change your profile information.
    </Project>
    <Modal
      ref="accInfoModal"
      title="Edit Your Information"
      :buttons="[
        {
          text: 'Change it',
          action: updateProfile,
          title: 'Confirm the changes to your profile.'
        }
      ]"
      :cancelable="true"
    >
      <p>The only field that is required is "Current Password"</p>
      <form @submit.prevent="updateProfile">
        <input
          name="name"
          placeholder="New Username"
          autocomplete="off"
          maxlength="60"
          type="text"
          class="darktextbox"
        />
        <br />
        <input
          name="email"
          placeholder="New Email"
          autocomplete="email"
          maxlength="60"
          type="email"
          class="darktextbox"
        />
        <br />
        <input
          name="newPassword"
          placeholder="New Password"
          autocomplete="new-password"
          type="password"
          class="darktextbox"
        />
        <br />
        <input
          name="password"
          placeholder="Current Password"
          autocomplete="password"
          type="password"
          required
          class="darktextbox"
        />
      </form>
    </Modal>
    <Project
      title="Edit your domain"
      :classes="['auth', 'float']"
      :action="showDomainModal"
    >
      Click here to edit your domain and subdomain combination!
    </Project>
    <Modal
      ref="domainModal"
      title="Change Your Domain"
      :buttons="[
        {
          text: 'That one',
          action: submitDomain,
          title: 'Confirm your choice for your domain.'
        }
      ]"
      :cancelable="true"
    >
      <form @submit.prevent="submitDomain" ref="domainForm">
        <div id="domain">
          <input
            v-if="allowsSubdomains()"
            name="subdomain"
            class="darktextbox"
            :value="user.subdomain"
            placeholder="Subdomain"
          />
          <input
            v-else
            name="subdomain"
            class="darktextbox"
            :value="''"
            placeholder="Subdomain"
            disabled
            title="This domain doesn't support subdomains, sorry!"
          />
          <p id="dotseperator">.</p>
          <select name="domain" :value="user.domain" @change="domainChange">
            <option
              v-for="(domain, index) in domains"
              :data-index="index"
              :key="domain.domain"
              :name="domain.domain"
              >{{ domain.domain }}</option
            >
          </select>
        </div>
      </form>
    </Modal>
    <Project
      title="Regenerate API Token"
      :classes="['auth', 'float']"
      :action="showRegenTokenModal"
    >
      Regenerate your API Token here!
    </Project>
    <Modal
      ref="regenTokenModal"
      title="Regenerate Your API Token"
      :buttons="[
        {
          text: 'I\'m sure, let\'s do it',
          action: regenerateToken
        }
      ]"
      :cancelable="true"
    >
      <form @submit.prevent="regenerateToken">
        <p>
          Regenerating your token will invalidate your previous token! Your
          token is used for API calls and for uploading images to the server, if
          you are 100% sure you want to do this, enter your current password and
          hit the button.
        </p>
        <input
          placeholder="Current Password"
          class="darktextbox"
          name="password"
          type="password"
          autocomplete="password"
          required
        />
      </form>
    </Modal>
    <Modal
      ref="showTokenModal"
      title="Your Token"
      :buttons="[
        {
          text: 'Alright, I got it',
          action: hideShowTokenModal
        }
      ]"
      :cancelable="true"
    >
      Alright, here's your API token, this is PRIVATE INFORMATION, AKA, people
      can do bad stuff with it if you give it to someone else!
      <br />
      <br />
      <code>{{ user.apiToken }}</code>
      <br />
      <br />
    </Modal>
    <Project
      title="Delete your account"
      :classes="['auth', 'float']"
      :action="showDeleteAccountModal"
    >
      Click here to delete your account.
    </Project>
    <Modal
      ref="deleteAccountModal"
      title="Delete Your Account"
      :buttons="[
        {
          title:
            'Confirm the deletion of your account, this can\'t be taken back!',
          text: 'I\'m sure, let\'s do it.',
          action: deleteAccount
        }
      ]"
      :cancelable="true"
    >
      <p>
        Deleting your account is a very serious and irreversible process as all
        of your files will be PERMANENTLY deleted, so we want a little bit of
        extra confirmation that you want to delete your account. So not only do
        you need to confirm your password, but you also need to enter your
        username
        <code>{{ user.username }}</code> in the username box.
      </p>
      <form @submit.prevent="deleteAccount">
        <input
          type="text"
          name="username"
          class="darktextbox"
          autocomplete="username"
          required
          placeholder="Username"
        />
        <br />
        <input
          type="password"
          name="password"
          class="darktextbox"
          autocomplete="password"
          required
          placeholder="Confirm Password"
        />
      </form>
    </Modal>
    <Project
      title="Download all files"
      :classes="['auth', 'float']"
      :action="showDownloadZipModal"
      :disabled="true"
      >Download everything you've uploaded in a zip file.</Project
    >
    <Modal
      ref="downloadZipModal"
      title="Download all files"
      :buttons="[
        {
          title: 'Haha, download button go bRRRRRRRRRRRRRRRRRRR',
          text: 'Give me it!',
          action: downloadZip
        }
      ]"
      :cancelable="true"
    >
      <p>
        This will download <b>EVERYTHING</b> you have uploaded to Cumulonimbus
        in a zip file. Depending on how much you've uploaded and how big
        everything is, this could take a very long time. You can only do this
        once every week. Are you sure you want to do this?
      </p>
    </Modal>
    <Modal
      ref="progressModal"
      title="Downloading, please wait..."
      :cancelable="false"
    >
      This might take a while, please be patient and don't close the tab!
      <br />
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Modal>
  </div>
  <div v-else class="lds-ellipsis">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <Footer />
</template>

<script>
  function getSelectedOption(sel) {
    var opt;
    for (var i = 0, len = sel.options.length; i < len; i++) {
      opt = sel.options[i];
      if (opt.selected === true) {
        break;
      }
    }
    return opt;
  }

  import Header from '@/components/Header.vue';
  import Project from '@/components/Project.vue';
  import Footer from '@/components/Footer.vue';
  import Modal from '@/components/Modal.vue';
  export default {
    name: 'Edit',
    title: 'Edit Your Profile',
    components: {
      Header,
      Project,
      Footer,
      Modal
    },
    data() {
      return {
        user: {
          id: '',
          username: '',
          displayName: '',
          email: '',
          staff: '',
          apiToken: '',
          domain: '',
          subdomain: '',
          bannedAt: null,
          pushSubCredentials: null,
          createdAt: '',
          updatedAt: ''
        },
        domains: []
      };
    },
    methods: {
      showAccInfoModal() {
        this.$refs.accInfoModal.showModal();
      },
      showDomainModal() {
        this.$refs.domainModal.showModal();
      },
      submitDomain() {
        let domainData = new FormData(
          document.querySelector('div.modal-content > form')
        );
        domainData.set(
          'domain',
          document.querySelector('#domain > select').value
        );
        fetch('/api/user/domain/', {
          headers: {
            Authorization: window.localStorage.getItem('token')
          },
          method: 'PATCH',
          body: domainData
        }).then(
          res => {
            switch (res.status) {
              case 200:
                res.json().then(json => {
                  this.$parent.$parent.temporaryToast(
                    `Success! Your file link is now ${json.subdomain}${
                      json.subdomain !== '' ? '.' : ''
                    }${json.domain}`
                  );
                  this.user.domain = json.domain;
                  this.user.subdomain = json.subdomain;
                  this.$refs.domainModal.hideModal();
                });
                break;
              case 400:
                this.$parent.$parent.temporaryToast(
                  "You somehow tried to get a subdomain with a domain that doesn't support subdomains!"
                );
                break;
              case 404:
                this.$parent.$parent.temporaryToast(
                  "It seems like you just missed that domain, I'm going to go ahead and reload the list of domains so you can see what you have access to.",
                  10 * 1000
                );
                fetch('/api/domains/', {
                  headers: {
                    Authorization: window.localStorage.getItem('token')
                  }
                }).then(
                  domains => {
                    domains.json().then(json => {
                      this.domains = json.domains;
                    });
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
                  'An unknown error occurred, if this issue persists contact AlekEagle.'
                );
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
      domainChange() {
        if (
          this.domains[
            Number(
              getSelectedOption(
                document.querySelector('#domain > select')
              ).getAttribute('data-index')
            )
          ].allowsSubdomains
        ) {
          document.querySelector('#domain > input').disabled = false;
          document.querySelector('#domain > input').title = '';
        } else {
          this.$parent.$parent.temporaryToast(
            "This domain doesn't support subdomains, sorry!"
          );
          document.querySelector('#domain > input').disabled = true;
          document.querySelector('#domain > input').title =
            "This domain doesn't support subdomains, sorry!";

          document.querySelector('#domain > input').value = '';
        }
      },
      allowsSubdomains() {
        return this.domains.filter(
          domain => domain.domain === this.user.domain
        )[0].allowsSubdomains;
      },
      updateProfile() {
        let profileData = new FormData(
          document.querySelector('div.modal-content > form')
        );
        fetch('/api/user/', {
          headers: {
            Authorization: window.localStorage.getItem('token')
          },
          method: 'PATCH',
          body: profileData
        }).then(
          res => {
            document
              .querySelectorAll('div.modal-content > form > input')
              .forEach(e => {
                e.value = '';
              });
            switch (res.status) {
              case 200:
                res.json().then(json => {
                  this.user = json;
                  this.$parent.$parent.temporaryToast(
                    'Successfully updated your profile!'
                  );
                  this.$refs.accInfoModal.hideModal();
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
                this.$parent.$parent.temporaryToast(
                  'An unknown error occurred, if this issue persists contact AlekEagle.'
                );
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
      showRegenTokenModal() {
        this.$refs.regenTokenModal.showModal();
      },
      showShowTokenModal() {
        this.$refs.showTokenModal.showModal();
      },
      regenerateToken() {
        let tokenData = new FormData(
          document.querySelector('div.modal-content > form')
        );
        fetch('/api/user/token/', {
          headers: {
            Authorization: window.localStorage.getItem('token')
          },
          method: 'PATCH',
          body: tokenData
        }).then(
          res => {
            document
              .querySelectorAll('div.modal-content > form > input')
              .forEach(e => {
                e.value = '';
              });
            switch (res.status) {
              case 201:
                res.json().then(json => {
                  this.user.apiToken = json.token;
                  this.$refs.regenTokenModal.hideModal();
                  this.$refs.showTokenModal.showModal();
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
                this.$parent.$parent.temporaryToast(
                  'An unknown error occurred, if this issue persists contact AlekEagle.'
                );
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
      hideShowTokenModal() {
        this.$refs.showTokenModal.hideModal();
      },
      showDeleteAccountModal() {
        this.$refs.deleteAccountModal.showModal();
      },
      deleteAccount() {
        let delAccData = new FormData(
          document.querySelector('div.modal-content > form')
        );
        if (delAccData.get('username') !== this.user.username) {
          this.$parent.$parent.temporaryToast(
            "Username provided doesn't match required input!"
          );
          return;
        }
        delAccData.delete('username');
        fetch('/api/user/', {
          headers: {
            Authorization: window.localStorage.getItem('token')
          },
          method: 'DELETE',
          body: delAccData
        }).then(
          res => {
            document
              .querySelectorAll('div.modal-content > form > input')
              .forEach(e => {
                e.value = '';
              });
            switch (res.status) {
              case 204:
                this.$refs.deleteAccountModal.hideModal();
                this.$parent.$parent.temporaryToast(
                  "It's been done, your account has been deleted, you will be redirected to the homepage momentarily."
                );
                setTimeout(() => this.$router.push('/'), 5000);
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
                  'An unknown error occurred, if this issue persists contact AlekEagle.'
                );
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
      showDownloadZipModal() {
        this.$parent.$parent.temporaryToast(
          'This feature has been disabled until properly implemented, sorry!',
          10 * 1000
        );
        //this.$refs.downloadZipModal.showModal();
      },
      downloadZip() {
        this.$refs.downloadZipModal.hideModal();
        this.$refs.progressModal.showModal();
        fetch('/api/files/zip/', {
          headers: {
            Authorization: `${window.localStorage.getItem('token')}`
          }
        }).then(res => {
          if (res.status === 201) {
            res.blob().then(slime => {
              let url = window.URL.createObjectURL(slime);
              let a = document.createElement('a');
              a.href = url;
              a.download = 'all uploads.zip';
              document.body.appendChild(a);
              a.click();
              a.remove();
            });
          } else if (res.status === 429) {
            this.$parent.$parent.temporaryToast(
              "Looks like you've already downloaded your zip for the week, sorry!",
              10 * 1000
            );
          } else {
            this.$parent.$parent.temporaryToast(
              'An unknown error occurred, if this issue persists contact AlekEagle.',
              10 * 1000
            );
          }
          this.$refs.progressModal.hideModal();
        });
      }
    },
    beforeCreate() {
      fetch('/api/user/', {
        headers: {
          Authorization: `${window.localStorage.getItem('token')}`
        }
      }).then(res => {
        switch (res.status) {
          case 200:
            res.json().then(json => {
              this.user = json;
            });
            fetch('/api/domains/', {
              headers: {
                Authorization: window.localStorage.getItem('token')
              }
            }).then(domains => {
              domains.json().then(json => {
                this.domains = json.domains;
              });
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
            this.$router.push(`/auth/?redirect=${window.location.pathname}`);
            break;
        }
      });
    }
  };
</script>

<style>
  .modal-content input {
    margin: 5px 0;
  }

  #domain input,
  #domain select {
    width: 30vw;
  }

  #domain input {
    text-align: right;
    padding-right: 5px;
  }
</style>
