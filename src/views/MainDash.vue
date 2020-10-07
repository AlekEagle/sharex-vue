<template>
    <Header
        headerTitle="Your Profile"
        subtitle="Welcome back."
        :buttons="[
            {
                title: 'This will log you out. Who knew?',
                action: 'javascript:logout()',
                text: 'Logout'
            }
        ]"
    />
</template>

<script>
import Header from '@/components/Header.vue';
export default {
    name: 'Dashboard',
    components: {
        Header
    },
    methods: []
};
</script>

<style></style>
