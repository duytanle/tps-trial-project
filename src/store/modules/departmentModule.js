import api from "../../api";

const department = {
    state: {
        depChosen: [],
        depTypes: [],
        depColumns: [],
        depColumnsSize: [],
        departments: [],
        metaDepartment: {},
        pagination: {},
        projectId: null,
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

        getProjectId: (state) => {
            return state.projectId;
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

        setProjectId: (state, payload) => {
            state.projectId = payload;
        },
    },
    actions: {
        async fetchDepTypes({ commit }, { pageSize, projectId }) {
            const res = await api.getDepTypes(pageSize, projectId);
            const columnChoices = res.results[0].column_choices;
            const depTypes = columnChoices.map((item) => ({
                name: item.option_name,
                id: item.id,
            }));

            commit("setDepTypes", depTypes);
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
            { pageSize, page, sort, projectId, state, departmentType }
        ) {
            const res = await api.getDepartments(
                pageSize,
                page,
                sort,
                projectId,
                state,
                departmentType
            );
            commit("setMetaDepartment", res.meta);
            commit("setDepartments", res.results);
        },

        async fetchSortDepartment({ commit }, { querySortString, signal }) {
            const res = await api.sortDepartment(querySortString, signal);
            commit("setMetaDepartment", res.meta);
            commit("setDepartments", res.results);
        },
    },
};

export default department;
