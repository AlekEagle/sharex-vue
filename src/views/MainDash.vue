<template>
    <Header
        title="Your Profile"
        subtitle="Checking who you are.."
        :buttons="[
            {
                title: 'This will log you out. Who knew?',
                action: logout,
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
        <Project
            icon="/img/circle.png"
            title="Get Set Up"
            to="/set-up/"
            :classes="['float']"
        >
            Get instructions on how to set up with popular services like ShareX
            for Windows{{
                Math.random() > 0.98 ? ' (more like stupid am I right?) ' : ' '
            }}or ShareNiX for linux!
        </Project>
        <Project
            icon="/img/circle.png"
            title="Upload From Browser"
            to="/me/upload/"
            :classes="['float']"
        >
            Upload files directly from your browser! (or share text or a file
            from any app to here via the native share menu on mobile!)
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
            window.localStorage.removeItem('token');
            this.$router.push(`/auth/?redirect=${window.location.pathname}`);
        }
    },
    beforeCreate() {
        fetch('/api/user/', {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            }
        }).then(res => {
            switch (res.status) {
                case 200:
                    res.json().then(json => {
                        this.$refs.header.sharedState.subtitle = `Welcome Back, ${json.displayName}!`;
                        if (json.staff !== null && json.staff !== '') {
                            this.$refs.header.sharedState.buttons.push({
                                title:
                                    'As a cool person, you get to visit the cool people place.',
                                text: 'Cool admin zone.',
                                to: '/admin/'
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
    }
};
</script>
