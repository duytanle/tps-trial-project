<!-- <script setup>
import store from "../store/index.js";
import axios from "axios";
import { computed } from "vue";

const setProjects = (payload) => {
    store.commit("setProjects", payload);
};

const projects = computed(() => {
    return store.getters.getProjects;
});

const callListProject = async () => {
    const res = await axios.get(
        "/api/projects/?page_size=50&page=1&sort=name&status=ACTIVE&status=ALTERNATE&status=BUDGET%20ONLY&status=CLOSED&status=COPY%2FBACKUP&status=DELETING&status=ON%20HOLD&status=PRELIMINARY"
    );
    setProjects(res.data.results);
};
callListProject();
</script> -->

<script>
import axios from "axios";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
    computed: {
        ...mapGetters({ projects: "getProjects", depTypes: "getDepTypes" }),
    },
    methods: {
        ...mapMutations(["setProjects"]),
        ...mapActions(["fetchDepTypes"]),
        async allListProject() {
            const res = await axios.get(
                "/api/projects/?page_size=50&page=1&sort=name&status=ACTIVE&status=ALTERNATE&status=BUDGET%20ONLY&status=CLOSED&status=COPY%2FBACKUP&status=DELETING&status=ON%20HOLD&status=PRELIMINARY"
            );
            this.setProjects(res.data.results);
        },
    },
    created() {
        this.allListProject();
        this.fetchDepTypes();
    },
};
</script>
<template>
    <div>
        <p>Project Page</p>
        <div v-for="project in projects" :key="project.id">
            <router-link
                :to="{ name: 'department', params: { id: project.id } }"
                >{{ project.name }}</router-link
            >
        </div>
    </div>
</template>

<style scoped></style>
