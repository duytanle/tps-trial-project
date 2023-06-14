<script setup>
const props = defineProps({
    icon: String,
    textTooltip: String,
    activator: Object,
});
</script>

<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip, attrs: tooltipAttrs }">
            <v-btn
                class="mx-2"
                fab
                light
                small
                icon
                v-bind="props.activator ? props.activator.attrs : tooltipAttrs"
                v-on="
                    props.activator
                        ? { ...tooltip, ...props.activator.on }
                        : tooltip
                "
            >
                <v-icon dark color="black"> {{ props.icon }} </v-icon>
            </v-btn>
        </template>
        <span>{{ props.textTooltip }}</span>
    </v-tooltip>
</template>

<style></style>
