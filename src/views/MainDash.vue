<template>
    <Header
        title="Your Profile"
        subtitle="Welcome back."
        :buttons="[
            {
                title: 'This will log you out. Who knew?',
                action: this.logout,
                text: 'Logout'
            }
        ]"
    />
</template>

<script>
import Header from '@/components/Header.vue';
export default {
    title: 'User Dashboard',
    name: 'Dashboard',
    components: {
        Header
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
            if (res.status === 401) {
                this.$router.push(
                    `/auth/?redirect=${window.location.pathname}`
                );
            }
        });
    }
};
</script>
