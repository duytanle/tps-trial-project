const department = {
    state: {
        depChosen: [],
    },
    getters: {
        getDepChosen: (state) => {
            return state.depChosen;
        },
    },
    mutations: {
        setDepChosen: (state, payload) => {
            state.depChosen = payload;
        },
    },
    actions: {},
};

export default department;
