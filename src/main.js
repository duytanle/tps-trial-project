import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";
import "./assets/main.css";

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
