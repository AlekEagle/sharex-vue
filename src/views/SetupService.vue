<template>
    <Header
        title="Get Setup"
        subtitle="Just a few steps away!"
        :buttons="[
            {
                text: 'Back',
                to: '/set-up/',
                title: 'Back to setup instructions!'
            }
        ]"
    />
    <div class="projects" v-if="service.name !== ''">
        <template v-for="(step, index) in service.steps" :key="index">
            <Project
                v-if="index === 0"
                :action="downloadConfigFile"
                :title="'Step ' + (index + 1)"
                :classes="['float', 'auth']"
                >{{ step }}</Project
            >
            <Project
                v-else
                :title="'Step ' + (index + 1)"
                :classes="['float', 'auth']"
                >{{ step }}</Project
            >
        </template>
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
    title: 'Get Set Up',
    name: 'SetupService',
    components: {
        Header,
        Project,
        Footer
    },
    data() {
        return {
            service: {
                name: '',
                description: '',
                displayName: '',
                fileContent: '',
                filename: '',
                steps: [],
                createdAt: '',
                updatedAt: ''
            }
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
                    fetch(`/api/setup/${this.$route.params.name}`, {
                        headers: {
                            Authorization: window.localStorage.getItem('token')
                        }
                    }).then(ser => {
                        switch (ser.status) {
                            case 200:
                                ser.json().then(json => {
                                    this.service = { ...json };
                                });
                                break;
                            case 429:
                                this.$parent.$parent.temporaryToast(
                                    `Woah, slow down! Please wait ${Math.floor(
                                        (ser.headers.get('x-ratelimit-reset') *
                                            1000 -
                                            Date.now()) /
                                            1000 /
                                            60
                                    )} minutes ${
                                        Math.floor(
                                            ((ser.headers.get(
                                                'x-ratelimit-reset'
                                            ) *
                                                1000 -
                                                Date.now()) /
                                                1000) %
                                                60
                                        ) !== 0
                                            ? `and ${Math.floor(
                                                  ((ser.headers.get(
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
        downloadConfigFile() {
            fetch(`/api/setup/save/${this.service.name}`, {
                headers: {
                    Authorization: window.localStorage.getItem('token')
                }
            }).then(res => {
                res.blob().then(slime => {
                    let url = window.URL.createObjectURL(slime);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = this.service.filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            });
        }
    }
};
</script>
