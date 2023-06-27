<script>
export default {
    props: {
        customClass: String,
        handleSearch: Function,
    },
    data() {
        return {
            debounce: null,
        };
    },
    methods: {
        handleDebounce(searchValue) {
            clearTimeout(this.debounce);
            this.debounce = setTimeout(() => {
                this.handleSearch(searchValue);
            }, 700);
        },
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
            @input="handleDebounce"
        ></v-text-field>
    </div>
</template>

<style scoped></style>
