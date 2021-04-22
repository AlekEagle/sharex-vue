<template>
  <Header
    title="Coffee Center"
    subtitle="Need some coffee to jumpstart your day? Get a cup brewing easily and conviently! (ALPHA)"
    :buttons="[
      {
        title: 'Go Back',
        to: '/me/',
        text: 'Back'
      }
    ]"
  />

  <div class="projects" v-if="user.id !== ''">
    <Project
      title="Get some!"
      :classes="['float']"
      :disabled="coffeeStatus.status === 0"
      :action="beginBrew"
      icon="/img/coffee.png"
    >
      Click me to get your coffee brewing!
    </Project>
    <Project
      v-if="coffeeStatus.status !== -1"
      :title="coffeeStatus.title"
      :classes="['auth', 'float']"
      :noSpan="true"
      :icon="coffeeStatus.status === 418 ? '/img/warning.png' : null"
    >
      <div v-if="coffeeStatus.status === 0" class="lds-ellipsis"
        ><div></div><div></div><div></div><div></div
      ></div>
      <div
        v-else
        class="project_description
      "
        v-text="coffeeStatus.desc"
      />
    </Project>
  </div>
  <div v-else class="lds-ellipsis">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>

  <Footer>
    <p class="footer_text"
      >This feature is in early alpha and is subject to change.</p
    >
  </Footer>
</template>

<script>
  import Header from '@/components/Header.vue';
  import Project from '@/components/Project.vue';
  import Footer from '@/components/Footer.vue';
  export default {
    title: 'Coffee Center',
    name: 'Coffee',
    components: {
      Header,
      Project,
      Footer
    },
    data() {
      return {
        coffeeStatus: {
          status: -1,
          desc: '',
          title: 'Getting things started..'
        },
        user: {
          id: 'lol',
          username: '',
          displayName: '',
          email: '',
          staff: '',
          apiToken: '',
          domain: '',
          subdomain: '',
          bannedAt: null,
          pushSubCredentials: null,
          createdAt: '',
          updatedAt: ''
        }
      };
    },
    beforeCreate() {
      fetch('/api/user/', {
        headers: {
          Authorization: `${window.localStorage.getItem('token')}`
        }
      }).then(res => {
        switch (res.status) {
          case 200:
            res.json().then(json => {
              this.user = json;
            });
            break;
          case 429:
            this.$parent.$parent.temporaryToast(
              `Woah, slow down! Please wait ${Math.floor(
                (res.headers.get('x-ratelimit-reset') * 1000 - Date.now()) /
                  1000 /
                  60
              )} minutes ${
                Math.floor(
                  ((res.headers.get('x-ratelimit-reset') * 1000 - Date.now()) /
                    1000) %
                    60
                ) !== 0
                  ? `and ${Math.floor(
                      ((res.headers.get('x-ratelimit-reset') * 1000 -
                        Date.now()) /
                        1000) %
                        60
                    )} seconds`
                  : ''
              } before trying again!`
            );
            break;
          default:
            this.$router.push(`/auth/?redirect=${window.location.pathname}`);
            break;
        }
      });
    },
    methods: {
      async beginBrew() {
        this.coffeeStatus.status = 0;
        let res = await fetch('/api/brew-coffee/');
        let json = await res.json();
        this.coffeeStatus.status = res.status;
        this.coffeeStatus.title = json.error;
        this.coffeeStatus.desc = `${json.body}\n${json.addInfo}`;
      }
    }
  };
</script>
