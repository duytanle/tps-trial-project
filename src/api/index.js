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

    async getDepTypes(pageSize, projectId) {
        const res = await axios.get(
            `/api/custom-columns/?page_size=${pageSize}&sort=&project_id=${projectId}&section=DEPARTMENT&status=ACTIVE&status=MANDATORY`
        );
        return res.data;
    },
    async getFieldsName(projectId) {
        const res = await axios.get(`/api/projects/${projectId}/?fields=name`);
        return res.data;
    },

    async getDepartmentsColumns(ownerId) {
        const res = await axios.get(
            `/api/org-members/${ownerId}/preferences/departmentsColumns/`
        );
        return res.data;
    },

    async getDepartments(
        pageSize,
        page,
        sort,
        projectId,
        state,
        departmentType
    ) {
        const res = await axios.get(
            `/api/departments/?page_size=${pageSize}&page=${page}&sort=${sort}&project=${projectId}&state=${state}${
                departmentType ? `&department_type=${departmentType}` : ""
            }`
        );
        return res.data;
    },
    async getDetailDepartment(depId) {
        const res = await axios.get(`/api/departments/${depId}/`);
        return res.data;
    },

    async editDepartment(depId, editInfo) {
        const res = await axios.patch(`/api/departments/${depId}/`, editInfo);
        return res;
    },

    async createDepartment(createInfo) {
        await axios.post(`/api/departments/`, createInfo, {
            headers: {
                "x-camelcase": 1,
            },
        });
    },

    async updateDepartment(depId, valueUpdate) {
        await axios.patch(`/api/departments/${depId}`, valueUpdate);
    },
};

export default api;
