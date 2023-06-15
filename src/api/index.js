import axios from "axios";
const api = {
    async getProject(pageSize, page) {
        const res = await axios.get(
            `/api/projects/?page_size=${pageSize}&page=${page}&sort=name&status=ACTIVE&status=ALTERNATE&status=BUDGET%20ONLY&status=CLOSED&status=COPY%2FBACKUP&status=DELETING&status=ON%20HOLD&status=PRELIMINARY`
        );
        return res.data;
    },

    async getMap() {
        const res = await axios.get("/api/choices/map/");
        return res.data;
    },

    async getFieldsName(projectId) {
        const res = await axios.get(`/api/projects/${projectId}/?fields=name`);
        return res.data;
    },

    async getDepartmentsColumns(ownerId) {
        const res = await axios.get(`/api/org-members`);
        ///${ownerId}/preferences/departmentsColumns/
        return res.data;
    },

    async getDepartments(pageSize, page, sort, projectId, state) {
        const res = await axios.get(`/api/departments`);
        ///?page_size=${pageSize}&page=${page}&sort=${sort}&project=${projectId}&state=${state}
        return res.data;
    },
};

export default api;
