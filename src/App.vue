<template>
    <router-view /> // Toast
    <Toast ref="toast"></Toast>
</template>

<script>
import Toast from '@/components/Toast.vue';
export default {
    name: 'App',
    methods: {
        temporaryToast(text, duration) {
            this.$refs.toast.showToast(
                text,
                typeof duration === 'number' ? duration : true
            );
        },
        permanentToast(text) {
            this.$refs.toast.showToast(text);
        },
        hideToast() {
            this.$refs.toast.hideToast();
        }
    },
    mounted() {},
    components: {
        Toast
    }
};
</script>

<style>
body {
    padding: 0px;
    margin: 0px;
}

#title-bar {
    -webkit-app-region: drag;
    -webkit-user-select: none;
    height: 35px;
    padding: none;
    margin: 0px;
    background-color: #1a1919;
    border-bottom-width: 0.5px;
    border-bottom-color: #c2c2c2d8;
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 3;
    box-shadow: 0px 5px 35px rgb(20, 20, 20);
}

.title-bar {
    height: 50px;
    background-color: #00000000;
    position: relative;
    top: 0px;
    width: 100%;
}

.nopad {
    padding-top: 0px;
    padding-bottom: 0px;
    padding-right: 0px;
    padding-left: 0px;
}

.nomar {
    margin-top: 0px;
    margin-bottom: 0px;
    margin-right: 0px;
    margin-left: 0px;
}

#title-img {
    position: fixed;
    top: 6px;
    left: 3px;
    z-index: 4;
}

#title {
    position: fixed;
    top: 4px;
    left: 30px;
    font-weight: 400;
    font-size: 20px;
    z-index: 4;
}

#title-bar-btns {
    -webkit-app-region: no-drag;
    position: fixed;
    top: 0px;
    right: 0px;
    z-index: 4;
}

.control-button {
    background-color: transparent;
    width: 50px;
    height: 35px;
    color: #c2c2c2d8;
    border-bottom: none;
    border-top: none;
    border-left: none;
    border-right: none;
    padding: 0px;
    margin: 0px;
    float: right;
    line-height: 0px;
    transition: 0.5s;
}

#max-btn:hover {
    background-color: #444444c2;
}

#min-btn:hover {
    background-color: #444444c2;
}

#close-btn:hover {
    background-color: #960000c2;
}

.control-button:focus {
    outline: none;
}

* {
    font-family: K2D, Halvetica, Arial, sans-serif;
    font-weight: bold;
    color: #d6d6d6;
    text-align: center;
    word-spacing: 2px;
}

option {
    color: #c5c5c5;
    background-color: black;
}

option:focus {
    outline: none;
}

select:focus {
    outline: none;
}

select {
    color: #c5c5c5;
    border: none;
    border-radius: 5px;
    background-color: black;
    outline: none;
    padding: 6px 0;
}

a {
    color: #888888;
    text-decoration: none !important;
}

body {
    background-color: #252525;
    color: #1199ff;
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
    overflow: hidden overlay;
}

button.button {
    width: fit-content;
    color: white;
    margin: 5px 3px;
    padding: 4px 18px;
    font-size: 20px;
    border-radius: 10px;
    transition: 0.3s;
    background-color: #272727;
    border: 0;
    font-weight: 400;
    outline: none;
    cursor: pointer;
}

button.button:hover:not(:disabled) {
    background-color: #0094ff;
    color: lightgray;
    font-weight: 400;
    box-shadow: 5px 5px 5px #141414c2;
}

button.button:disabled {
    background-color: #101010;
    color: grey;
    cursor: not-allowed;
}

.main {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
}

#bgCanvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
}

img,
embed,
object,
video {
    max-width: 100%;
    -webkit-user-select: none;
}

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background-color: transparent;
}

::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:active {
    background: #292929;
}

.container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 0;
    height: 25px;
    width: 25px;
    background-color: #292929;
    transition-duration: 0.25s;
    border-radius: 5px;
}

.container input:disabled ~ .checkmark {
    background-color: #141414;
}

.checkbox_align {
    padding: none;
    margin: none;
    display: inline;
    color: transparent;
}

.container:hover input ~ .checkmark {
    background-color: rgb(59, 59, 59);
    box-shadow: 5px 5px 5px #14141485;
}

.container:focus input ~ .checkmark {
    box-shadow: 5px 5px 5px #14141485;
}

.container:hover input:disabled ~ .checkmark {
    background-color: #141414;
    box-shadow: none;
}

.container:focus input:disabled ~ .checkmark {
    background-color: #141414;
    box-shadow: none;
}

.container input:checked ~ .checkmark {
    background-color: #2196f3;
}

.checkmark:after {
    content: '';
    position: absolute;
    display: none;
}

.container input:checked ~ .checkmark:after {
    display: block;
}

.container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}

input {
    color: black;
}

code {
    font-family: 'Source Code Pro', monospace;
    background: #1d1d1d;
    border-radius: 3px;
    padding: 5px 3.5px;
}

#folderpath {
    cursor: pointer;
    color: #5151ce;
}

.logEntry {
    display: inline;
}

.slider {
    -webkit-appearance: none;
    width: 30%;
    height: 15px;
    border-radius: 5px;
    background: #303030;
    outline: none;
    opacity: 0.6;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
    cursor: pointer;
}

.slider:hover {
    opacity: 1;
}

.slider:focus {
    opacity: 1;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: rgb(62, 168, 187);
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
}

.progressbar {
    position: relative;
    overflow: hidden;
    margin: 0 10px 0 10px;
    background-color: #1d1d1d;
    width: 50vw;
    display: inline-block;
    height: 20px;
    border-radius: 10px;
}

.activebar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    height: 20px;
    transition: width 0.5s ease;
    background-color: #3ea8bb;
}

.darktextbox {
    background-color: #272727;
    color: #d6d6d6;
    border: 0;
    outline: none;
    border-radius: 5px;
    transition: 0.3s;
    font-size: 20px;
    padding: 6px 0;
}

select {
    font-size: 20px;
}

.darktextbox:hover:not(:disabled) {
    background-color: #2c2c2c;
    box-shadow: 5px 5px 5px #14141485;
}

.darktextbox:disabled {
    background-color: #141414;
    color: #8b8b8b;
    border: 0;
    outline: none;
    cursor: not-allowed;
}

input#subdomain {
    width: 45%;
}

select#domain {
    width: 45%;
}

p#dotseperator {
    display: inline;
    margin: 0;
    padding: 0 5px;
}

.darktextbox:focus {
    background-color: #2c2c2c;
    box-shadow: 5px 5px 5px #14141485;
}

.footer_box .loadmore,
.footer_box .cpyrit {
    margin: 0px;
}

.loadmore {
    overflow: hidden;
}

.projects {
    width: 100%;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.titanic {
    float: none;
}

@keyframes glow {
    from {
        box-shadow: 13px 13px 5px #141414b0, inset 0px 0px 5px 1px #424242;
    }

    50% {
        box-shadow: 13px 13px 5px #141414b0, inset 0px 0px 5px 1px #252525;
    }

    to {
        box-shadow: 13px 13px 5px #141414b0, inset 0px 0px 5px 1px #424242;
    }
}

@-webkit-keyframes glow {
    from {
        box-shadow: 13px 13px 5px #141414b0, inset 0px 0px 5px 1px #424242;
    }

    50% {
        box-shadow: 13px 13px 5px #141414b0, inset 0px 0px 5px 1px #252525;
    }

    to {
        box-shadow: 13px 13px 5px #141414b0, inset 0px 0px 5px 1px #424242;
    }
}

#strangebutton {
    margin-top: 10px;
}

.lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
}

.lds-ellipsis div {
    position: absolute;
    top: 27px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis div:nth-child(1) {
    left: 6px;
    animation: lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis div:nth-child(2) {
    left: 6px;
    animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(3) {
    left: 26px;
    animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(4) {
    left: 45px;
    animation: lds-ellipsis3 0.6s infinite;
}

@keyframes lds-ellipsis1 {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes lds-ellipsis3 {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(0);
    }
}

@keyframes lds-ellipsis2 {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(19px, 0);
    }
}
</style>
