<template>
    <Header
        title="Your Profile"
        subtitle="Checking who you are.."
        :buttons="[
            {
                title: 'This will log you out. Who knew?',
                action: this.logout,
                text: 'Logout'
            }
        ]"
        ref="header"
    />
    <div class="projects">
        <Project
            icon="/img/circle.png"
            title="Edit profile"
            to="/me/edit/"
            :classes="['float']"
        >
            Edit your profile here!
        </Project>
        <Project
            icon="/img/circle.png"
            title="View Files"
            to="/me/files/"
            :classes="['float']"
        >
            See all of the files you've uploaded.
        </Project>
    </div>

    <Footer />
</template>

<script>
import Header from '@/components/Header.vue';
import Project from '@/components/Project.vue';
import Footer from '@/components/Footer.vue';
export default {
    title: 'User Dashboard',
    name: 'Dashboard',
    components: {
        Header,
        Project,
        Footer
    },
    methods: {
        logout() {
            fetch('/api/user/logout/', {
                credentials: 'include'
            }).then(() => {
                this.$router.push(
                    `/auth/?redirect=${window.location.pathname}`
                );
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
                            this.$refs.header.sharedState.subtitle = `Welcome Back, ${json.displayName}!`;
                            if (json.staff !== null) {
                                this.$refs.header.sharedState.buttons.push({
                                    title:
                                        'As a cool person, you get to visit the cool people place.',
                                    text: 'Cool admin zone.',
                                    to: '/admin/'
                                });
                            }
                        },
                        () => {
                            this.$parent.$parent.temporaryToast(
                                'Development lol'
                            );
                        }
                    );
                });
            }
        });
    }
};
</script>
