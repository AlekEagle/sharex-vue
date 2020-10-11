<template>
    <Header
        ref="header"
        title="AlekEagle ShareX Server"
        subtitle="Welcome back!"
        :buttons="[
            {
                text: 'I don\'t have an account',
                action: switchBetweenLoginAndRegister
            }
        ]"
    />

    <div class="projects">
        <Project
            title="Login"
            :noSpan="true"
            :classes="['float', 'auth']"
            v-if="hasAccount"
        >
            <form @submit.prevent="login">
                <input
                    class="darktextbox"
                    type="text"
                    autocomplete="username"
                    name="name"
                    maxlength="30"
                    placeholder="Username"
                />
                <input
                    class="darktextbox"
                    type="password"
                    autocomplete="password"
                    name="password"
                    maxlength="30"
                    placeholder="Password"
                />
                <button class="button">Login</button>
            </form>
        </Project>
        <Project
            title="Register"
            :noSpan="true"
            :classes="['float', 'auth']"
            v-if="!hasAccount"
        >
            <form @submit.prevent="register">
                <input
                    class="darktextbox"
                    type="text"
                    autocomplete="username"
                    name="name"
                    maxlength="30"
                    placeholder="Username"
                />
                <input
                    class="darktextbox"
                    type="email"
                    autocomplete="email"
                    name="email"
                    maxlength="30"
                    placeholder="E-mail"
                />
                <input
                    class="darktextbox"
                    type="password"
                    autocomplete="new-password"
                    name="password"
                    maxlength="30"
                    placeholder="Password"
                />
                <input
                    class="darktextbox"
                    type="password"
                    autocomplete="new-password"
                    name="password-conf"
                    maxlength="30"
                    placeholder="Confirm Password"
                />
                <button class="button">Register</button>
            </form>
        </Project>
    </div>
</template>

<script>
import Project from '@/components/Project.vue';
import Header from '@/components/Header.vue';
function parseQueryString(qs, sep, eq) {
    let parsed = {};
    qs.split(sep || '&').forEach(p => {
        let ps = p.split(eq || '=');
        parsed[unescape(ps[0])] = ps[1] ? unescape(ps[1]) : true;
    });
    return parsed;
}
export default {
    title: 'Login',
    name: 'Auth',
    components: {
        Header,
        Project
    },
    methods: {
        switchBetweenLoginAndRegister() {
            this.hasAccount = !this.hasAccount;
            if (!this.hasAccount) {
                this.$refs.header.sharedState.buttons[0].text =
                    'I already have an account';
                this.$refs.header.sharedState.subtitle =
                    'Hi, hope you enjoy your stay!';
                document.title = 'Register';
            } else {
                this.$refs.header.sharedState.buttons[0].text =
                    "I don't have an account";
                this.$refs.header.sharedState.subtitle = 'Welcome back!';
                document.title = 'Login';
            }
        },
        login(e) {
            let data = new FormData(e.target);
            fetch('http://localhost:3000/api/user/login/', {
                credentials: 'include',
                method: 'POST',
                body: data
            }).then(res => {
                switch (res.status) {
                    case 200:
                        this.$router.push(
                            window.location.href.split('?').length > 1
                                ? parseQueryString(
                                      window.location.href.split('?')[1]
                                  ).redirect
                                : '/me/'
                        );
                        break;
                    default:
                        this.$parent.$parent.temporaryToast(
                            'An unknown error occurred, if this issue persists contact AlekEagle.',
                            10 * 1000
                        );
                }
            });
        },
        register(e) {
            let data = new FormData(e.target);
            data.delete('password-conf');
            fetch('/api/user/create/', {
                credentials: 'include',
                method: 'POST',
                body: data
            }).then(res => {
                switch (res.status) {
                    case 200:
                        this.$router.push(
                            window.location.href.split('?').length > 1
                                ? parseQueryString(
                                      window.location.href.split('?')[1]
                                  ).redirect
                                : '/me/'
                        );
                        break;
                    default:
                        this.$parent.$parent.temporaryToast(
                            'An unknown error occurred, if this issue persists contact AlekEagle.',
                            10 * 1000
                        );
                }
            });
        }
    },
    data() {
        return {
            hasAccount: true
        };
    }
};
</script>
