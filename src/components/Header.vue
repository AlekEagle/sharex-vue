<template>
    <header class="header">
        <div class="header__inner">
            <router-link to="/">
                <img
                    class="header__logo"
                    src="/images/me_irl.webp"
                    alt="AlekEagle"
                    width="90"
                />
                <h1 class="header__title">{{ headerTitle }}</h1>
            </router-link>
        </div>
        <div v-if="buttons">
            <template v-for="(button, index) in buttons">
                <router-link v-if="button.to" :key="button.to" :to="button.to">
                <button class="button header_button" :title="button.title">
                    {{ button.text }}
                </button>
                </router-link>
                <button v-else class="button header_button" :key="index" :title="button.title" @click="btnFunction(index)">{{ button.text }}</button>
            </template>
        </div>
    </header>
    <div class="under_header"></div>
    <p class="subtitle" v-text="subtitle"></p>
</template>
<script>
export default {
    name: 'Header', 
    props: {
        headerTitle: String,
        subtitle: String,
        buttons: Array,
        action: Function,
        to: [String, Location]
    },
    methods: {
        btnFunction(index) {
            this.buttons[index].action(this);
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