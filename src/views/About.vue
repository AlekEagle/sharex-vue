<template>
    <Header
        title="What is This?"
        subtitle="All about what this server is."
        :buttons="[
            {
                title: 'Head back Home',
                to: '/',
                text: 'Back Home'
            }
        ]"
    />
    <Footer />
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
export default {
    name: 'Home',
    components: {
        Header,
        Footer
    }
};
</script>
