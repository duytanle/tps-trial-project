<script setup>
import axios from "axios";
import router from "../router/index.js";
const handleLogin = async () => {
    try {
        await axios.post("/api/auth/login/", {
            email: "local.development@attainia.com",
            password: "password",
            is_impersonator: false,
            dossier_auth_token: null,
            dossier_jsessionid: null,
            folder_auth_token: null,
            folder_jsessionid: null,
        });
        router.push("/project");
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <v-btn text @click="handleLogin"> Login</v-btn>
</template>

<style scoped></style>
