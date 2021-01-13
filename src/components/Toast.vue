<template>
    <transition name="toast">
        <div class="toast-message" v-if="sharedState.show">
            {{ sharedState.message }}
        </div>
    </transition>
</template>
<script>
import { reactive } from 'vue';
const store = {
    debug: false,

    state: reactive({
        message: '',
        show: false
    }),

    setMessageAction(newVal) {
        if (this.debug) {
            console.log(`setMessageAction triggered with: ${newVal}`);
        }

        this.state.message = newVal;
    },

    setDisplayState(newVal) {
        if (this.debug) {
            console.log(`setDisplayState triggered with ${newVal}`);
        }

        this.state.show = newVal !== undefined ? newVal : !this.state.show;
    }
};

export default {
    name: 'Toast',
    data() {
        return {
            privateState: {
                timeout: null,
                usesTimeout: true
            },
            sharedState: store.state
        };
    },
    methods: {
        showToast(text, duration) {
            store.setMessageAction(text);
            if (
                (this.privateState.usesTimeout &&
                    this.privateState.timeout !== null) ||
                (!this.privateState.usesTimeout && store.state.show)
            ) {
                store.setDisplayState(false);
                clearTimeout(this.privateState.timeout);
                this.privateState.timeout = null;
                setTimeout(() => store.setDisplayState(true), 500);
            } else {
                store.setDisplayState(true);
            }
            if (
                typeof duration === 'number' ||
                (typeof duration === 'boolean' && duration)
            ) {
                this.privateState.usesTimeout = true;
                this.privateState.timeout = setTimeout(
                    () => {
                        store.setDisplayState(false);
                        this.privateState.timeout = null;
                    },
                    typeof duration === 'number' ? duration : 5000
                );
            } else this.privateState.usesTimeout = false;
        },
        hideToast() {
            store.setDisplayState(false);
        }
    }
};
</script>
<style>
.toast-message {
    max-width: 80%;
    overflow: hidden;
    word-wrap: break-word;
    min-width: 250px;
    margin-left: -125px;
    background-color: #333333;
    color: #fff;
    text-align: center;
    border-radius: 10px;
    padding: 16px;
    position: fixed;
    z-index: 10000;
    right: 40px;
    bottom: 30px;
    box-shadow: 13px 13px 5px #141414, inset 0px 0px 5px #2c2c2c;
}

.toast-enter-active {
    animation: fadein 0.5s;
}

.toast-leave-active {
    animation: fadeout 0.5s;
}

@keyframes fadein {
    from {
        bottom: -45px;
        opacity: 0;
    }

    to {
        bottom: 30px;
        opacity: 1;
    }
}

@keyframes fadeout {
    from {
        bottom: 30px;
        opacity: 1;
    }

    to {
        bottom: -45px;
        opacity: 0;
    }
}
</style>
