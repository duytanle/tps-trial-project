import { createStore } from "vuex";
import common from "./modules/commonModule";
import department from "./modules/departmentModule";
const store = createStore({
    modules: {
        common,
        department,
    },
});

export default store;
