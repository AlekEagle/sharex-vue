<template>
    <Header
        title="Get Setup"
        subtitle="Link this service to your favorite screenshot application!"
        :buttons="[
            {
                text: 'Back',
                title: 'Back to the dashboard',
                to: '/me/'
            }
        ]"
    />
    <div class="projects">
        <Project
            v-for="service in services"
            :key="service.name"
            :classes="['float']"
            :title="service.displayName"
            :to="'/set-up/' + service.name"
            icon="/img/circle.png"
        >
            {{ service.description }}
        </Project>
        <Project
            :classes="['float']"
            title="Not listed here?"
            :action="openDiscord"
            icon="/img/circle.png"
        >
            Join the discord server and ask AlekEagle if he can add it!
        </Project>
    </div>
    <Footer />
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Project from '@/components/Project.vue';
export default {
    title: 'Get Set Up',
    name: 'Setup',
    components: {
        Header,
        Footer,
        Project
    },
    beforeMount() {
        fetch('/api/authenticate/', { credentials: 'include' }).then(res => {
            switch (res.status) {
                case 200:
                    fetch('/api/setup/', { credentials: 'include' }).then(
                        ins => {
                            switch (ins.status) {
                                case 200:
                                    ins.json().then(json => {
                                        this.services = json;
                                    });
                                    break;
                                case 429:
                                    this.$parent.$parent.temporaryToast(
                                        `Woah, slow down! Please wait ${Math.floor(
                                            (ins.headers.get(
                                                'x-ratelimit-reset'
                                            ) *
                                                1000 -
                                                Date.now()) /
                                                1000 /
                                                60
                                        )} minutes ${
                                            Math.floor(
                                                ((ins.headers.get(
                                                    'x-ratelimit-reset'
                                                ) *
                                                    1000 -
                                                    Date.now()) /
                                                    1000) %
                                                    60
                                            ) !== 0
                                                ? `and ${Math.floor(
                                                      ((ins.headers.get(
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
                        }
                    );
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
    data() {
        return {
            services: []
        };
    },
    methods: {
        openDiscord() {
            window.open('https://alekeagle.com/d', '_blank');
        }
    }
};
</script>
