// src/plugins/vuetify.js
import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: "mdi",
    },
    // theme: {
    //     themes: {
    //         light: {
    //             primary: "#0D47A1",
    //             secondary: "#FDF644",
    //         },
    //     },
    // },
});
