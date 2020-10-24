<template>
    <Header
        title="Cool Admin Town"
        subtitle="The cool place for the cool admins"
        :buttons="[
            {
                title: 'Head back to the normal Dashboard',
                to: '/me/',
                text: 'Back'
            }
        ]"
    />

    <div class="projects">
        <Project
            title="All users"
            :classes="['float']"
            icon="/img/circle.png"
            to="/admin/users/"
        >
            Click here to see all of the users.
        </Project>
        <Project
            title="All files"
            :classes="['float']"
            icon="/img/circle.png"
            to="/admin/files/"
        >
            Click here to see all the files uploaded.
        </Project>
        <Project
            title="General Statistics"
            :classes="['float']"
            icon="/img/circle.png"
            to="/admin/stats/"
        >
            Click here to see general statistics about the server.
        </Project>
    </div>

    <Footer />
</template>

<script>
import Header from '@/components/Header.vue';
import Project from '@/components/Project.vue';
import Footer from '@/components/Footer.vue';

export default {
    name: 'AdminDash',
    components: {
        Header,
        Project,
        Footer
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
