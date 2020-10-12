<template>
    <Header
        ref="header"
        title="Generic Error Page v2.9.4"
        subtitle="You found an error 404 page!"
    />
    <div></div>

    <Footer />
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
export default {
    title: 'Error!?!?!11?!/',
    name: 'Not Found',
    components: {
        Header,
        Footer
    }
};
</script>

<style></style>
