<script>
export default {
    props: {
        customClass: String,
    },
};
</script>

<template>
    <div :class="customClass">
        <v-text-field
            prepend-inner-icon="mdi-magnify"
            hide-details
            light
            solo
            flat
            dense
            background-color="#F0F0F0"
            label="Search Results..."
            clearable
        ></v-text-field>
    </div>
</template>

<style scoped></style>
