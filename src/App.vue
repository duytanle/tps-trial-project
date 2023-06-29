<script setup></script>

<template>
    <v-app class="pa-0">
        <v-main class="pa-5">
            <router-view></router-view>
            <v-data-table
                item-key="name"
                class="elevation-1"
                loading
                loading-text="Loading... Please wait"
            ></v-data-table>
        </v-main>
    </v-app>
</template>

<style scoped></style>
