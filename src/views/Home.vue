<template>
    <Header
        title="AlekEagle ShareX Server"
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
        <Project
            title="Test"
            :classes="['float']"
            icon="/img/mombot.png"
            :disabled="false"
            :action="showModal"
        >
            <div class="project_description">
                hi
            </div>
        </Project>

        <Modal
            title="Modal"
            :buttons="[
                {
                    text: 'Show Toast for 10 seconds',
                    action: temporaryToast
                },
                {
                    text: 'Show toast permanently',
                    action: permanentToast
                },
                {
                    text: 'Get rid of toast',
                    action: hideToast
                }
            ]"
            :cancelable="true"
            ref="modal"
        >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
            consequuntur, ex nobis laudantium id similique nisi error fugit
            deleniti cum officia distinctio obcaecati nostrum. Voluptatibus
            optio ipsum obcaecati architecto error.
        </Modal>
    </div>

    <Footer />
</template>

<script>
import Header from '@/components/Header.vue';
import Project from '@/components/Project.vue';
import Modal from '@/components/Modal.vue';
import Footer from '@/components/Footer.vue';
export default {
    title: 'AlekEagle ShareX Dashboard',
    name: 'Home',
    components: {
        Header,
        Project,
        Modal,
        Footer
    },
    methods: {
        showModal() {
            this.$refs.modal.showModal();
        },
        temporaryToast() {
            this.$parent.$parent.temporaryToast(
                'This will disappear in 10 seconds!',
                10 * 1000
            );
        },
        permanentToast() {
            this.$parent.$parent.permanentToast(
                "This won't disappear until you hit the hide toast button!"
            );
        },
        hideToast() {
            this.$parent.$parent.hideToast();
        }
    }
};
</script>
