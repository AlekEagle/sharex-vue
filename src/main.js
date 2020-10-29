import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import titleMixin from "./mixins/titleMixin";
import VueGtag from "vue-gtag-next";

const app = createApp(App);

app.use(VueGtag, {
    property: {
        id: "UA-135044771-3",
        params: {
            send_page_view: true
        }
    }
});

app.mixin(titleMixin);

app.use(router);

app.mount("#app");
