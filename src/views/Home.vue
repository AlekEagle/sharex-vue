<template>
    <Header
        headerTitle="AlekEagle ShareX Server"
        subtitle="A Server that
        can host your ShareX uploads"
        :buttons="[
            {
                title: 'Manage Your Account',
                action: '/me/',
                text: 'My Dashboard'
            },
            {
                title: 'What is this even for?',
                action: '/about/',
                text: 'About'
            }
        ]"
    />
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue';
export default {
    name: 'Home',
    components: {
        Header
    }
};
</script>
