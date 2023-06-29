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
        activeIndex: null,
        currentActiveIndex: null,
        tableSettings: [],
        rawTableSettings: null,
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

        getActiveIndex: (state) => {
            return state.activeIndex;
        },

        getCurrentActiveIndex: (state) => {
            return state.currentActiveIndex;
        },
        getTableSettings: (state) => {
            return state.tableSettings;
        },

        getTableSettingActive: (state, getters) => {
            return state.tableSettings[getters.getCurrentActiveIndex];
        },

        getTableSettingDefault: (state) => {
            return state.tableSettings[0];
        },

        getSettingNames: (state) => {
            return state.tableSettings.map((item, index) => {
                return { id: index, name: item.name };
            });
        },

        getRawTableSettings: (state) => {
            return state.rawTableSettings;
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

        setActiveIndex: (state, payload) => {
            state.activeIndex = payload;
        },

        setCurrentActiveIndex: (state, payload) => {
            state.currentActiveIndex = payload;
        },

        setTableSettings: (state, payload) => {
            state.tableSettings = payload;
        },

        setRawTableSettings: (state, payload) => {
            state.rawTableSettings = payload;
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

            commit("setRawTableSettings", res.value);
            let preTableSettings = [];
            preTableSettings.push(res.value.default_columns);
            preTableSettings.push(...res.value.table_settings);

            let tableSettings = preTableSettings.map((item, index) => {
                delete item.column_sizes;
                delete item.is_in_use;
                if (index === 0) {
                    item.name = "Default";
                    item.show_inactive_state = false;
                    item.show_redacted_state = false;
                    item.fixed_number = 2;
                }
                if (!Object.prototype.hasOwnProperty.call(item, "name")) {
                    item.name = `Custom ${index}`;
                }
                return item;
            });
            commit("setTableSettings", tableSettings);
            commit("setActiveIndex", indexSettings + 1);
            commit("setCurrentActiveIndex", indexSettings + 1);
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
