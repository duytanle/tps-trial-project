import api from "../../api";
const addEditModule = {
    state: {
        infoAddDep: {},
        listEditDep: [],
        detailDepartment: {},
    },
    getters: {
        getInfoAddDep: (state) => {
            return state.infoAddDep;
        },
        getInfoEditDep: (state) => {
            return state.listEditDep.length === 1 ? state.listEditDep[0] : [];
        },
        getListEditNumber: (state) => {
            return state.listEditDep.length;
        },

        getDetailDepartment: (state) => {
            return state.detailDepartment;
        },
    },
    mutations: {
        setInfoAddDep: (state, payload) => {
            state.infoAddDep = payload;
        },

        setListEditDep: (state, payload) => {
            state.listEditDep = payload;
        },

        setDetailDepartment: (state, payload) => {
            state.detailDepartment = payload;
        },
    },
    actions: {
        async fetchDetailDepartment({ commit }, depId) {
            const res = await api.getDetailDepartment(depId);
            commit("setDetailDepartment", res);
        },
        async fetchEditDepartment({ commit }, { depId, editInfo }) {
            await api.editDepartment(depId, editInfo);
        },
    },
};

export default addEditModule;
