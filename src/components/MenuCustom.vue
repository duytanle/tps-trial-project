<script setup>
const props = defineProps({
    items: Object,
    icon: String,
    textTooltip: String,
});
</script>
<template>
    <v-menu offset-y bottom left>
        <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                        class="mx-2"
                        fab
                        light
                        small
                        icon
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
                    >
                        <v-icon dark color="black">{{ props.icon }}</v-icon>
                    </v-btn>
                </template>
                <span>{{ props.textTooltip }}</span>
            </v-tooltip>
        </template>
        <v-list>
            <slot name="menu-content" />
        </v-list>
    </v-menu>
</template>
<style>
.v-list-item__title {
    font-size: 1.6rem !important;
}

.v-list-item__content {
    padding: 0 !important;
}
</style>
