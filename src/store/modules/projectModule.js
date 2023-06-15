const project = {
    state: {
        projects: [],
    },
    getters: {
        getProjects: (state) => {
            return state.projects;
        },
    },
    mutations: {
        setProjects: (state, payload) => {
            state.projects = payload;
        },
    },
    actions: {},
};

export default project;
