<template>
    <Header
        ref="header"
        title="Generic Error Page v2.9.4"
        subtitle="You found an error 404 page!"
    />
    <div class="projects">
        <Project
            :classes="['float']"
            icon="/img/circle.png"
            title="Retrace Your Steps"
            :action="goBack"
        >
            Click here to go to the previous page.
        </Project>
        <Project
            :classes="['float']"
            icon="/img/circle.png"
            title="Go Home"
            to="/"
        >
            Click to go back to the home page.
        </Project>
    </div>

    <Footer />
</template>

<script>
import Header from '@/components/Header.vue';
import Project from '@/components/Project.vue';
import Footer from '@/components/Footer.vue';
export default {
    title: 'Error!?!?!11?!/',
    name: 'Not Found',
    components: {
        Header,
        Footer,
        Project
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>

<style></style>
