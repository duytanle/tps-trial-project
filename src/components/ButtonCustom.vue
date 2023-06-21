<script>
import { mapGetters } from "vuex";

export default {
    props: {
        activator: Object,
        cssLink: String,
        disabled: Boolean,
        textTooltip: String,
        icon: String,
        handleClick: { type: Function, default: function () {} },
    },
    computed: { ...mapGetters({ listEditNumber: "getListEditNumber" }) },
};
</script>

<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip, attrs: tooltipAttrs }">
            <v-btn
                :class="'mx-2 ' + cssLink"
                fab
                light
                small
                icon
                :disabled="disabled"
                v-bind="activator ? activator.attrs : tooltipAttrs"
                v-on="activator ? { ...tooltip, ...activator.on } : tooltip"
                @click="
                    () => {
                        handleClick();
                    }
                "
            >
                <v-icon dark color="black"> {{ icon }} </v-icon>
            </v-btn>
        </template>
        <span>{{ textTooltip }}</span>
    </v-tooltip>
</template>

<style></style>
