<template>
    <Header
        title="User Info"
        subtitle="Stuff"
        :buttons="[
            {
                title: 'Head Back to the user list',
                to: '/admin/users/',
                text: 'Back'
            }
        ]"
    />

    <div class="projects" v-if="user.id !== undefined">
        <Project
            :title="user.displayName"
            :classes="['float', 'auth']"
            :noSpan="true"
        >
            ID: {{ user.id }}
            <br />
            Username [Display Name]: {{ user.username }} [{{
                user.displayName
            }}]
            <br />
            Created at: {{ new Date(user.createdAt).toLocaleString() }}
            <br />
            Last updated at: {{ new Date(user.updatedAt).toLocaleString() }}
            <br />
            Domain: {{ user.subdomain }}{{ user.subdomain ? '.' : ''
            }}{{ user.domain }}
            <br />
            Banned:
            {{
                user.bannedAt ? new Date(user.bannedAt).toLocaleString() : 'No'
            }}
        </Project>
        <Project
            :title="`${user.bannedAt ? 'Unban' : 'Ban'} ${user.username}`"
            :action="showHandleBanModal"
            :classes="['auth', 'float']"
        >
            {{
                user.bannedAt
                    ? 'Bring them out of gay baby jail.'
                    : 'Drop the ban hammer!'
            }}
        </Project>
        <Modal
            ref="handleBanModal"
            :title="`${user.bannedAt ? 'Unban' : 'Ban'} ${user.username}`"
            :buttons="[
                {
                    title: 'Yes, let\'s do it',
                    action: handleBan,
                    text: user.bannedAt
                        ? 'Release them!'
                        : 'Knock \'em into next year!'
                }
            ]"
            :cancelable="true"
        >
            {{
                user.bannedAt
                    ? 'By unbanning them, they will be able to use the server freely again and make changes to their files and themselves.'
                    : 'By banning them, they will be essentially suspended from using the service, all of their files will still be accessible, but they will not be able to upload, edit, or remove files from the server.'
            }}
        </Modal>
        <Project
            title="Edit user"
            :classes="['auth', 'project']"
            :action="showEditUserModal"
        >
            Click to forcefully edit {{ user.username }}.
        </Project>
        <Modal
            ref="editUser"
            title="Edit Your Information"
            :buttons="[
                {
                    text: 'Change it',
                    action: editUser,
                    title: 'Confirm the changes to your profile.'
                }
            ]"
            :cancelable="true"
        >
            <form @submit.prevent="editUser">
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
            </form>
        </Modal>
        <Project
            title="Change Domain"
            :classes="['float', 'auth']"
            :action="showDomainModal"
        >
            Click to edit {{ user.username }}'s domain selection.
        </Project>
        <Modal
            ref="domainModal"
            title="Change Their Domain"
            :buttons="[
                {
                    text: 'That one',
                    action: submitDomain,
                    title: 'Confirm your choice for their domain.'
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
                    <select
                        name="domain"
                        :value="user.domain"
                        @change="domainChange"
                    >
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
            :title="`Delete ${user.username}'s account`"
            :classes="['float', 'auth']"
            :action="showDeleteUserModal"
        >
            Permanently delete {{ user.username }}.
        </Project>
        <Modal
            ref="deleteUserModal"
            title="Delete Their Account"
            :buttons="[
                {
                    text: 'Bye bye!',
                    action: confirmDeleteUser,
                    title:
                        'Send them off, they won\'t be back (well, not this account)'
                }
            ]"
        >
            By deleting their account, they will NEVER be able to access this
            account again, and ALL of their files will be deleted. If you're
            absolutely sure you want to do this, press confirm.
        </Modal>
        <Project
            title="View their files"
            :classes="['float', 'auth']"
            :action="viewUserFiles"
        >
            View {{ user.username }}'s files.
        </Project>
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
import Header from '@/components/Header.vue';
import Project from '@/components/Project.vue';
import Modal from '@/components/Modal.vue';
import Footer from '@/components/Footer.vue';
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
export default {
    title: 'User Info',
    name: 'UserInfo',
    components: {
        Header,
        Project,
        Modal,
        Footer
    },
    data() {
        return {
            user: {},
            domains: []
        };
    },
    beforeMount() {
        fetch('/api/user/', {
            headers: {
                Authorization: `${window.localStorage.getItem('token')}`
            }
        }).then(res => {
            switch (res.status) {
                case 200:
                    res.json().then(json => {
                        if (json.staff === '') {
                            this.$parent.$parent.temporaryToast(
                                "Woah there buddy! You aren't an admin! You aren't supposed to be there!"
                            );
                            this.$router.push('/me/');
                        } else {
                            fetch(`/api/user/${this.$route.params.user}/`, {
                                headers: {
                                    Authorization: `${window.localStorage.getItem(
                                        'token'
                                    )}`
                                }
                            }).then(res => {
                                switch (res.status) {
                                    case 200:
                                        res.json().then(json => {
                                            this.user = json;
                                        });
                                        break;
                                    case 403:
                                        this.$parent.$parent.temporaryToast(
                                            "Woah, you aren't staff anymore! Get outta here!"
                                        );
                                        this.$router.push('/me/');
                                        break;
                                    case 429:
                                        this.$parent.$parent.temporaryToast(
                                            `Woah, slow down! Please wait ${Math.floor(
                                                (res.headers.get(
                                                    'x-ratelimit-reset'
                                                ) *
                                                    1000 -
                                                    Date.now()) /
                                                    1000 /
                                                    60
                                            )} minutes ${
                                                Math.floor(
                                                    ((res.headers.get(
                                                        'x-ratelimit-reset'
                                                    ) *
                                                        1000 -
                                                        Date.now()) /
                                                        1000) %
                                                        60
                                                ) !== 0
                                                    ? `and ${Math.floor(
                                                          ((res.headers.get(
                                                              'x-ratelimit-reset'
                                                          ) *
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
                                        break;
                                }
                            });
                            fetch('/api/domains/', {
                                headers: {
                                    Authorization: window.localStorage.getItem(
                                        'token'
                                    )
                                }
                            }).then(res => {
                                switch (res.status) {
                                    case 200:
                                        res.json().then(json => {
                                            this.domains = json;
                                        });
                                        break;
                                    case 403:
                                        this.$parent.$parent.temporaryToast(
                                            "Woah, you aren't staff anymore! Get outta here!"
                                        );
                                        this.$router.push('/me/');
                                        break;
                                    case 429:
                                        this.$parent.$parent.temporaryToast(
                                            `Woah, slow down! Please wait ${Math.floor(
                                                (res.headers.get(
                                                    'x-ratelimit-reset'
                                                ) *
                                                    1000 -
                                                    Date.now()) /
                                                    1000 /
                                                    60
                                            )} minutes ${
                                                Math.floor(
                                                    ((res.headers.get(
                                                        'x-ratelimit-reset'
                                                    ) *
                                                        1000 -
                                                        Date.now()) /
                                                        1000) %
                                                        60
                                                ) !== 0
                                                    ? `and ${Math.floor(
                                                          ((res.headers.get(
                                                              'x-ratelimit-reset'
                                                          ) *
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
                                        break;
                                }
                            });
                        }
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
                                ((res.headers.get('x-ratelimit-reset') * 1000 -
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
                    this.$router.push(
                        `/auth/?redirect=${window.location.pathname}`
                    );
                    break;
            }
        });
    },
    methods: {
        showHandleBanModal() {
            this.$refs.handleBanModal.showModal();
        },
        handleBan() {
            fetch(`/api/user/${this.user.id}/ban/`, {
                headers: {
                    Authorization: `${window.localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({
                    banned: !this.user.bannedAt
                })
            }).then(res => {
                switch (res.status) {
                    case 200:
                        this.$parent.$parent.temporaryToast('Done!');
                        this.$router.push('/admin/users/');
                        break;
                    case 401:
                        this.$parent.$parent.temporaryToast(
                            "Looks like you've been signed out, please log back in!"
                        );
                        break;
                    case 403:
                        this.$parent.$parent.temporaryToast(
                            "Woah, you aren't staff anymore! Get outta here!"
                        );
                        this.$router.push('/me/');
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
                                          ((res.headers.get(
                                              'x-ratelimit-reset'
                                          ) *
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
                        break;
                }
            });
        },
        showEditUserModal() {
            this.$refs.editUser.showModal();
        },
        editUser() {
            let formData = new FormData(
                document.querySelector('div.modal-content > form')
            );
            fetch(`/api/user/${this.user.id}/`, {
                headers: {
                    Authorization: `${window.localStorage.getItem('token')}`
                },
                method: 'PATCH',
                body: formData
            }).then(res => {
                switch (res.status) {
                    case 200:
                        this.$parent.$parent.temporaryToast('Done!');
                        this.$router.push('/admin/users/');
                        break;
                    case 400:
                        this.$parent.$parent.temporaryToast(
                            'Please fill out at least one field.'
                        );
                        break;
                    case 401:
                        this.$parent.$parent.temporaryToast(
                            "Looks like you've been signed out, please log back in!"
                        );
                        break;
                    case 403:
                        this.$parent.$parent.temporaryToast(
                            "Woah, you aren't staff anymore! Get outta here!"
                        );
                        this.$router.push('/me/');
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
                                          ((res.headers.get(
                                              'x-ratelimit-reset'
                                          ) *
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
                        break;
                }
            });
        },
        allowsSubdomains() {
            return this.domains.filter(
                domain => domain.domain === this.user.domain
            )[0].allowsSubdomains;
        },
        showDomainModal() {
            this.$refs.domainModal.showModal();
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
        submitDomain() {
            let domainData = new FormData(
                document.querySelector('div.modal-content > form')
            );
            domainData.set(
                'domain',
                document.querySelector('#domain > select').value
            );
            fetch(`/api/user/${this.user.id}/domain/`, {
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
                                    `Success! ${
                                        this.user.username
                                    }'s file link is now ${json.subdomain}${
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
                        case 401:
                            this.$parent.$parent.temporaryToast(
                                "Looks like you've been signed out, please log back in!"
                            );
                            break;
                        case 403:
                            this.$parent.$parent.temporaryToast(
                                "Woah, you aren't staff anymore! Get outta here!"
                            );
                            this.$router.push('/me/');
                            break;
                        case 404:
                            this.$parent.$parent.temporaryToast(
                                "It seems like you just missed that domain, I'm going to go ahead and reload the list of domains so you can see what you have access to.",
                                10 * 1000
                            );
                            fetch('/api/domains/', {
                                headers: {
                                    Authorization: window.localStorage.getItem(
                                        'token'
                                    )
                                }
                            }).then(
                                domains => {
                                    domains.json().then(json => {
                                        this.domains = json;
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
                                    (res.headers.get('x-ratelimit-reset') *
                                        1000 -
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
                                              ((res.headers.get(
                                                  'x-ratelimit-reset'
                                              ) *
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
        confirmDeleteUser() {
            fetch(`/api/user/${this.user.id}`, {
                headers: {
                    Authorization: window.localStorage.getItem('token')
                },
                method: 'DELETE'
            }).then(
                res => {
                    switch (res.status) {
                        case 200:
                            this.$parent.$parent.temporaryToast('Done!');
                            this.$router.push('/admin/users/');
                            break;
                        case 403:
                            this.$parent.$parent.temporaryToast(
                                "Woah, you aren't staff anymore! Get outta here!"
                            );
                            this.$router.push('/me/');
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
        showDeleteUserModal() {
            this.$refs.deleteUserModal.showModal();
        },
        viewUserFiles() {
            this.$router.push(`/admin/files/${this.user.id}/`);
        }
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
