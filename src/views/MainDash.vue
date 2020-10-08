<template>
    <Header
        headerTitle="Your Profile"
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
    title: 'Test',
    name: 'Dashboard',
    components: {
        Header
    },
    methods: {
        logout(that) {
            that.$parent.$parent.$parent.temporaryToast("//TODO: Add logout function", 10 * 1000);
        }
    }
};
</script>