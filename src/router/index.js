import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    base: import.meta.env.BASE_URL,
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginPage.vue"),
        },
        {
            path: "/project",
            name: "project",
            component: () => import("../views/ProjectPage.vue"),
        },
        {
            path: "/department/:id",
            name: "department",
            component: () => import("../views/DepartmentsPage.vue"),
            props: true,
        },
    ],
});

export default router;
