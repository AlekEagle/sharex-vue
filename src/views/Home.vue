<template>
    <Header
        headerTitle="AlekEagle ShareX Server"
        subtitle="A Server that
        can host your ShareX uploads"
        :buttons="[
            {
                title: 'Manage Your Account',
                to: '/me/',
                text: 'My Dashboard'
            },
            {
                title: 'What is this even for?',
                to: '/about/',
                text: 'About'
            }
        ]"
    />
    <div class="projects">
    <Project title="Test" :classes="['float', 'auth']" icon="@/assets/images/dad.png">
        <p class="project_description">hi</p>
    </Project>
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Project from '@/components/Project.vue';
export default {
    title: 'AlekEagle ShareX Dashboard',
    name: 'Home',
    components: {
        Header,
        Project
    }
};
</script>
