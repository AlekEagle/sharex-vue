<template>
    <Header
        title="Get Setup"
        subtitle="Link this service to your favorite screenshot application!"
        :buttons="[
            {
                text: 'Back',
                title: 'Back to the dashboard',
                to: '/me/'
            }
        ]"
    />
    <div class="projects">
        <Project
            :classes="['float']"
            title="ShareX"
            to="/set-up/sharex"
            icon="/img/circle.png"
        >
            Get set up for ShareX on Windows.
        </Project>
    </div>
    <Footer />
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import Project from '@/components/Project.vue';
export default {
    title: 'Get Set Up',
    name: 'Setup',
    components: {
        Header,
        Footer,
        Project
    },
    beforeMount() {
        fetch('/api/authenticate/', { credentials: 'include' }).then(res => {
            if (res.status !== 200) {
                this.$router.push('/auth/?redirect=/set-up/');
            }
        });
    }
};
</script>
