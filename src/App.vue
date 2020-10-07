<template>
    <router-view />
    <div class="footer_box">
        <a href="https://alekeagle.com" class="footer_text"
            >© 2019-2020 AlekEagle</a
        >
    </div>
    <div id="snackbar"></div>
</template>

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

.subtitle {
    font-size: 20px;
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
    overflow: overlay;
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

button.button:hover {
    background-color: #0094ff;
    color: lightgray;
    font-weight: 400;
    box-shadow: 5px 5px 5px #141414c2;
}

.main {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
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

.project {
    font-size: 16px;
    margin: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    background: #1d1d1d;
    border-radius: 10px;
    border: 1px solid #1d1d1d;
    float: left;
    transition: 0.3s;
    cursor: pointer;
    outline: none;
    align-self: stretch;
    position: relative;
}

.footer_box .loadmore,
.footer_box .cpyrit {
    margin: 0px;
}

.loadmore {
    overflow: hidden;
}

.project * {
    transition: 0.3s;
}

.project:focus:not(.float):not(.sink):not(.disabled) {
    background: #252525;
    box-shadow: 13px 13px 5px #141414b0;
    border: 1px solid #505050;
    transform: translate(-7px, -7px);
}

.project:hover:not(.float):not(.sink):not(.disabled) {
    background: #252525;
    box-shadow: 13px 13px 5px #141414b0;
    border: 1px solid #505050;
    transform: translate(-7px, -7px);
}

.project_link {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    z-index: 1;

    /* fixes overlap error in IE7/8, 
       make sure you have an empty gif */
    background-image: url('/assets/images/empty.gif');
}

.project_icon {
    height: 64px;
    float: left;
    margin: 15px;
}

.project_title {
    font-size: 1.2em;
    text-align: left;
    margin-bottom: 10px;
    margin-top: 15px;
}

.project_description {
    font-size: 0.9em;
    color: #9c9c9c;
    text-align: left;
    overflow-x: hidden;
    word-wrap: break-word;
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

.subtitle {
    margin-top: 30px;
    margin-bottom: 20px;
    margin-left: 25px;
    margin-right: 25px;
}

.footer_text {
    color: #a8a8a8;
    font-size: 20px;
    margin-bottom: 0px;
    margin-top: 20px;
    margin-left: 5px;
    margin-right: 5px;
    text-decoration: none;
    transition-property: color;
    transition-duration: 0.3s;
}

.footer_text:hover {
    transition-property: color;
    transition-duration: 0.3s;
    color: #1199ff;
}

.footer_box {
    width: 100%;
    position: relative;
    float: left;
    z-index: 1;
    margin-top: 10px;
    margin-bottom: 10px;
}

.auth .project_title {
    margin-left: 7px;
}

.auth .project_description {
    text-align: center;
}

.auth .project_description select {
    width: 100%;
    margin: 5px 0px;
}

.auth .project_description .darktextbox {
    width: 95%;
    margin: 5px 0px;
}

.project.auth {
    padding-right: 0;
}

.header_button {
    margin-left: 5px;
    margin-right: 5px;
}

.error_text {
    color: #ec1a1a;
}

.uploadfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.uploadfile + label {
    font-size: 25px;
    font-weight: 700;
    color: white;
    background-color: #161616;
    display: block;
    border-radius: 10px;
    padding: 50px;
    margin: 10px;
    cursor: pointer;
    overflow-x: hidden;
    overflow-wrap: break-word;
    max-width: inherit;
}

.uploadfile + label:hover {
    background-color: #1f1f1f;
}

@media screen and (max-width: 589px) {
    .project {
        width: calc((100% - (32px * 1)) / 1);
    }
}

@media screen and (min-width: 590px) and (max-width: 1152px) {
    .project {
        width: calc((100% - (32px * 2)) / 2);
    }
}

@media screen and (min-width: 1153px) and (max-width: 1366px) {
    .project {
        width: calc((100% - (32px * 3)) / 3);
    }
}

@media screen and (min-width: 1367px) and (max-width: 1699px) {
    .project {
        width: calc((100% - (32px * 4)) / 4);
    }
}

@media screen and (min-width: 1700px) and (max-width: 2099px) {
    .project {
        width: calc((100% - (32px * 5)) / 5);
    }
}

@media screen and (min-width: 2100px) {
    .project {
        width: calc((100% - (32px * 6)) / 6);
    }
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

.project.float:hover:not(.disabled) {
    background: #202020;
    box-shadow: 13px 13px 5px #141414b0;
    border: 1px solid #505050;
    transform: translate(-7px, -7px);
}

.project.sink:hover:not(.disabled) {
    box-shadow: inset 13px 13px 5px #141414b0;
    border: 1px solid #505050;
}

.project.sink:hover:not(.disabled) * {
    transform: translate(7px, 7px);
}

.project.float:focus:not(.disabled) {
    background: #252525;
    box-shadow: 13px 13px 5px #141414b0;
    border: 1px solid #505050;
}

.project.project.sink:focus:not(.disabled) * {
    transform: translate(7px, 7px);
}

.project.sink:focus:not(.disabled) {
    box-shadow: inset 13px 13px 5px #141414b0;
    border: 1px solid #505050;
}

#strangebutton {
    margin-top: 10px;
}

#snackbar {
    max-width: 80%;
    overflow: hidden;
    word-wrap: break-word;
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    background-color: #333333;
    color: #fff;
    text-align: center;
    border-radius: 10px;
    padding: 16px;
    position: fixed;
    z-index: 1;
    right: 40px;
    bottom: 30px;
    box-shadow: 13px 13px 5px #141414, inset 0px 0px 5px #2c2c2c;
}

#snackbar.show {
    visibility: visible;
    -webkit-animation: fadein 0.5s, fadeout 0.5s 6.5s;
    animation: fadein 0.5s, fadeout 0.5s 6.5s;
}

@-webkit-keyframes fadein {
    from {
        bottom: 0;
        opacity: 0;
    }

    to {
        bottom: 30px;
        opacity: 1;
    }
}

@keyframes fadein {
    from {
        bottom: 0;
        opacity: 0;
    }

    to {
        bottom: 30px;
        opacity: 1;
    }
}

@-webkit-keyframes fadeout {
    from {
        bottom: 30px;
        opacity: 1;
    }

    to {
        bottom: 0;
        opacity: 0;
    }
}

@keyframes fadeout {
    from {
        bottom: 30px;
        opacity: 1;
    }

    to {
        bottom: 0;
        opacity: 0;
    }
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

.project_link.disabled {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    cursor: not-allowed;
    background: #00000099;
    border-radius: 10px;
    border: 1px solid #1d1d1d;

    z-index: 2;

    /* fixes overlap error in IE7/8, 
         make sure you have an empty gif */
    background-image: url('/assets/images/empty.gif');
}
</style>
