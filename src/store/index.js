import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import common from "./modules/commonModule";
import department from "./modules/departmentModule";
import project from "./modules/projectModule";
import addEditModule from "./modules/addEditModule";
const store = new Vuex.Store({
    modules: {
        common,
        department,
        project,
        addEditModule,
    },
});

export default store;
