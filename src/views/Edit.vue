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

    <div class="projects">
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
            Password: Hashed and Salted (We can't show you it because we don't
            know what it is)
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
                    text: 'Submit',
                    action: updateProfile
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
                    maxlength="30"
                    type="text"
                    class="darktextbox"
                />
                <br />
                <input
                    name="email"
                    placeholder="New Email"
                    autocomplete="email"
                    maxlength="30"
                    type="email"
                    class="darktextbox"
                />
                <br />
                <input
                    name="newPassword"
                    placeholder="New Password"
                    autocomplete="new-password"
                    maxlength="30"
                    type="password"
                    class="darktextbox"
                />
                <br />
                <input
                    name="password"
                    placeholder="Current Password"
                    autocomplete="password"
                    maxlength="30"
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
                    text: 'Submit',
                    action: submitDomain
                }
            ]"
            :cancelable="true"
        >
            <form @submit.prevent="submitDomain">
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
                credentials: 'include',
                method: 'PATCH',
                body: domainData
            }).then(res => {
                switch (res.status) {
                    case 200:
                        res.json().then(json => {
                            this.$parent.$parent.temporaryToast(
                                `Success! Your file link is now ${
                                    json.subdomain
                                }${json.subdomain !== '' ? '.' : ''}${
                                    json.domain
                                }`
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
                        fetch('/api/domains/', { credentials: 'include' }).then(
                            domains => {
                                domains.json().then(json => {
                                    this.domains = json;
                                });
                            }
                        );
                        break;
                    default:
                        this.$parent.$parent.temporaryToast(
                            'An unknown error occurred, if this issue persists contact AlekEagle.'
                        );
                        break;
                }
            });
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
            fetch('/api/user/update/', {
                credentials: 'include',
                method: 'PATCH',
                body: profileData
            }).then(res => {
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
                    default:
                        this.$parent.$parent.temporaryToast(
                            'An unknown error occurred, if this issue persists contact AlekEagle.'
                        );
                        break;
                }
            });
        }
    },
    beforeMount() {
        fetch('/api/authenticate/', {
            credentials: 'include'
        }).then(res => {
            if (res.status !== 200) {
                this.$router.push(
                    `/auth/?redirect=${window.location.pathname}`
                );
            } else {
                fetch('/api/self/', {
                    credentials: 'include'
                }).then(data => {
                    data.json().then(
                        json => {
                            this.user = json;
                        },
                        () => {
                            this.$parent.$parent.temporaryToast(
                                'Development lol'
                            );
                        }
                    );
                });
                fetch('/api/domains/', { credentials: 'include' }).then(
                    domains => {
                        domains.json().then(json => {
                            this.domains = json;
                        });
                    }
                );
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
