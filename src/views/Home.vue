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
    <Project title="Test" :classes="['float']" icon="/images/mombot.png" :disabled="false" :action="classes.push('auth')">
        <div class="project_description">hi</div>
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
