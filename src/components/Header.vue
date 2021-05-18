<template>
  <header class="header">
    <div v-if="!sharedState.action" class="header__inner">
      <router-link v-if="sharedState.to" :to="sharedState.to">
        <img
          v-if="!sharedState.icon"
          class="header__logo"
          src="/img/Cumulonimbus.webp"
          alt="Header Logo"
          width="90"
        />
        <img
          v-else
          class="header__logo"
          :src="sharedState.icon"
          alt="Header Logo"
          width="90"
        />
        <h1 class="header__title">{{ sharedState.title }}</h1>
      </router-link>
      <router-link v-else to="/">
        <img
          v-if="!sharedState.icon"
          class="header__logo"
          src="/img/Cumulonimbus.webp"
          alt="Header Logo"
          width="90"
        />
        <img
          v-else
          class="header__logo"
          :src="sharedState.icon"
          alt="Header Logo"
          width="90"
        />
        <h1 class="header__title">{{ sharedState.title }}</h1>
      </router-link>
    </div>
    <div v-else class="header__inner" @click="sharedState.action">
      <img
        v-if="!sharedState.icon"
        class="header__logo"
        src="/img/Cumulonimbus.webp"
        alt="Header Logo"
        width="90"
      />
      <img
        v-else
        class="header__logo"
        :src="sharedState.icon"
        alt="Header Logo"
        width="90"
      />
      <h1 class="header__title">{{ sharedState.title }}</h1>
    </div>
    <div v-if="sharedState.buttons">
      <template v-for="(button, index) in sharedState.buttons">
        <router-link v-if="button.to" :key="button.to" :to="button.to">
          <button class="button header_button" :title="button.title">
            {{ button.text }}
          </button>
        </router-link>
        <button
          v-else
          class="button header_button"
          :key="index"
          :title="button.title"
          @click="btnFunction(index)"
        >
          {{ button.text }}
        </button>
      </template>
    </div>
  </header>
  <div class="under_header"></div>
  <p class="subtitle" v-text="sharedState.subtitle"></p>
</template>
<script>
  export default {
    name: 'Header',
    data() {
      return {
        privateState: {},
        sharedState: {
          title: '',
          subtitle: '',
          buttons: [],
          to: '',
          action: null,
          icon: ''
        }
      };
    },
    props: {
      title: String,
      subtitle: String,
      buttons: Array,
      to: [String, Location],
      action: Function,
      icon: String
    },
    mounted() {
      this.sharedState.title = this.title;
      this.sharedState.subtitle = this.subtitle;
      this.sharedState.buttons = this.buttons;
      this.sharedState.to = this.to;
      this.sharedState.action = this.action;
      this.sharedState.icon = this.icon;
    },
    methods: {
      btnFunction(index) {
        this.sharedState.buttons[index].action(this);
      }
    }
  };
</script>

<style>
  .subtitle {
    font-size: 20px;
    margin-top: 30px;
    margin-bottom: 20px;
    margin-left: 25px;
    margin-right: 25px;
    white-space: pre;
  }

  .header {
    box-shadow: 0px 5px 20px 15px rgb(58, 58, 58);
    min-height: 56px;
    transition: min-height 0.3s;
    background-color: #3a3a3a;
    text-decoration: none;
  }

  .header__inner {
    min-width: 80px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 1px;
  }

  .header__logo {
    border-radius: 50%;
    height: 90px;
    margin-right: 10px;
    vertical-align: top;
    margin-top: 10px;
  }

  .header__title {
    font-weight: 300;
    font-size: 4em !important;
    margin: 0.35em 0.35em;
    display: inline-block;
    color: #b3b3b3;
    margin-bottom: 2px;
    margin-left: 2px;
    margin-top: 12px;
  }

  .header_button {
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
