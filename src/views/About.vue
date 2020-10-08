<template>
    <Header
        headerTitle="What is This?"
        subtitle="All about what this server is."
        :buttons="[
            {
                title: 'Head back Home',
                to: '/',
                text: 'Back Home'
            }
        ]"
    />
</template>

<script>
import Header from '@/components/Header.vue';
export default {
    name: 'Home',
    components: {
        Header
    }
};
</script>
