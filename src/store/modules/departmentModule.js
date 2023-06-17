import api from "../../api";

const department = {
    state: {
        depChosen: [],
        depTypes: {},
        depColumns: [],
        depColumnsSize: [],
        departments: [],
        metaDepartment: {},
        pagination: {},
    },
    getters: {
        getDepChosen: (state) => {
            return state.depChosen;
        },

        getDepTypes: (state) => {
            return state.depTypes;
        },

        getDepColumns: (state) => {
            return state.depColumns;
        },

        getDepColumnsSize: (state) => {
            return state.depColumnsSize;
        },

        getDepartments: (state) => {
            return state.departments;
        },
        getMetaDepartment: (state) => {
            return state.metaDepartment;
        },
        getPagination: (state) => {
            return state.pagination;
        },
    },
    mutations: {
        setDepChosen: (state, payload) => {
            state.depChosen = payload;
        },

        setDepTypes: (state, payload) => {
            state.depTypes = payload;
        },

        setDepColumns: (state, payload) => {
            state.depColumns = payload;
        },

        setDepColumnsSize: (state, payload) => {
            state.depColumnsSize = payload;
        },

        setDepartments: (state, payload) => {
            state.departments = payload;
        },

        setMetaDepartment: (state, payload) => {
            state.metaDepartment = payload;
        },

        setPagination: (state, payload) => {
            state.pagination = { ...state.pagination, ...payload };
        },
    },
    actions: {
        async fetchDepTypes({ commit }) {
            const res = await api.getMap();
            commit("setDepTypes", res.choices["department_type"]);
        },

        async fetchDepColumns({ commit }, projectId) {
            const resOwnerId = await api.getFieldsName(projectId);
            const res = await api.getDepartmentsColumns(resOwnerId.owner_id);
            const indexSettings = res.value.active_idx;

            if (indexSettings === -1) {
                commit("setDepColumns", res.value.default_columns.columns);
                commit(
                    "setDepColumnsSize",
                    res.value.default_columns.column_sizes
                );
            } else {
                commit(
                    "setDepColumns",
                    res.value.table_settings[indexSettings].columns
                );
            }
        },

        async fetchDepartments(
            { commit },
            { pageSize, page, sort, projectId, state }
        ) {
            const res = await api.getDepartments(
                pageSize,
                page,
                sort,
                projectId,
                state
            );
            commit("setMetaDepartment", res.meta);
            commit("setDepartments", res.results);
        },
    },
};

export default department;
