<template>
    <header class="header">
        <div class="header__inner">
            <a href="/">
                <img
                    class="header__logo"
                    src="../assets/images/me_irl.webp"
                    alt="AlekEagle"
                    width="90"
                />
                <h1 class="header__title">{{ headerTitle }}</h1>
            </a>
        </div>
        <div v-if="buttons">
            <router-link
                v-for="(button, index) in buttons"
                :key="index"
                :to="button.action"
            >
                <button class="button header_button" :title="button.title">
                    {{ button.text }}
                </button>
            </router-link>
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
        action: String
    }
};
</script>
