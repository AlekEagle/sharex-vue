<template>
  <Header
    title="Cumulonimbus"
    subtitle="The only file sharing service.*"
    :buttons="[
      {
        title: 'Manage Your Account',
        to: '/me/',
        text: 'My Dashboard'
      }
    ]"
  />
  <div class="projects">
    <Project
      title="Easy and Free"
      :classes="['float']"
      icon="/img/circle.png"
      :disabled="false"
    >
      Super easy to use and configure, all you need is an account.
    </Project>
    <Project
      title="Wide Support"
      :classes="['float']"
      icon="/img/circle.png"
      :disabled="false"
    >
      Not just screenshots, just about any file type. (with a few exceptions)
    </Project>
    <Project
      title="Fast and Secure"
      :classes="['float']"
      icon="/img/circle.png"
      :disabled="false"
    >
      We encrypt your data, and our database is inaccessible without going
      through our API.
    </Project>
    <Project
      title="More Features Constantly"
      :classes="['float']"
      icon="/img/circle.png"
      :disabled="false"
    >
      Actively worked on and quickly updated with new features all the time!
    </Project>
    <Project
      title="Contact Me"
      :classes="['float']"
      icon="/img/me_irl.webp"
      :disabled="false"
      :action="openDiscord"
    >
      Contact me in the discord server if you have any questions!
    </Project>
    <Project
      title="Public API Documentation"
      :classes="['float']"
      icon="/img/circle.png"
      :disabled="false"
      :action="openDocs"
    >
      Public (WIP) API Documentation means anyone can create things that
      interact with the API! Click me to check them out!
    </Project>
  </div>

  <Footer>
    <p class="footer_text">*Not the only file sharing service out there.</p>
  </Footer>
</template>

<script>
  import Header from '@/components/Header.vue';
  import Project from '@/components/Project.vue';
  import Footer from '@/components/Footer.vue';
  export default {
    title: 'Cumulonimbus',
    name: 'Home',
    components: {
      Header,
      Project,
      Footer
    },
    methods: {
      openDiscord() {
        window.open('https://alekeagle.com/d', '_blank');
      },
      openDocs() {
        window.open('https://docs.alekeagle.me', '_blank');
      }
    }
  };
</script>
