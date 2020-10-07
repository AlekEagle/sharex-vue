<template>
    <Header
        headerTitle="What is This?"
        subtitle="All about what this server is."
        :buttons="[
            {
                title: 'Head back Home',
                action: '/',
                text: 'Back Home'
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
