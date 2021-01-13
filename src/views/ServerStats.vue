<template>
    <Header
        title="Server Stats"
        subtitle="All of the server's stats in one place.
(yes, more stats will be coming in the future)"
        :buttons="[
            {
                title: 'Head back to the admin dashboard',
                to: '/admin/',
                text: 'Back'
            },
            {
                title: 'Update all of the data!',
                action: updateData,
                text: 'Update'
            }
        ]"
    />
    <div class="projects" v-if="loaded">
        <Project title="Basic Stats" :classes="['auth', 'float']">
            User count: {{ userCount }}
            <br />
            File count: {{ fileCount }}
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
import Footer from '@/components/Footer.vue';
export default {
    name: 'ServerStats',
    title: 'Server Statistics',
    components: {
        Header,
        Project,
        Footer
    },
    data() {
        return {
            loaded: false,
            userCount: null,
            fileCount: null
        };
    },
    beforeMount() {
        fetch('/api/user/', {
            headers: {
                Authorization: `${window.localStorage.getItem('token')}`
            }
        }).then(
            res => {
                res.json().then(json => {
                    if (json.staff === '') {
                        this.$parent.$parent.temporaryToast(
                            "Woah there buddy! You aren't an admin! You aren't supposed to be there!"
                        );
                        this.$router.push('/me/');
                    } else {
                        switch (res.status) {
                            case 200:
                                fetch('/api/users/', {
                                    headers: {
                                        Authorization: `${window.localStorage.getItem(
                                            'token'
                                        )}`
                                    }
                                }).then(res => {
                                    switch (res.status) {
                                        case 200:
                                            res.json().then(json => {
                                                this.userCount = json.count;
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
                                fetch('/api/files/all/', {
                                    headers: {
                                        Authorization: `${window.localStorage.getItem(
                                            'token'
                                        )}`
                                    }
                                }).then(res => {
                                    switch (res.status) {
                                        case 200:
                                            res.json().then(json => {
                                                this.fileCount = json.count;
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
                                this.loaded = true;
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
                    }
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
    }
};
</script>
