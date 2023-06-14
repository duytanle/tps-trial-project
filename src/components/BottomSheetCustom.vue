<script setup>
import ButtonCustom from "./ButtonCustom.vue";

import { ref } from "vue";

const props = defineProps({
    icon: String,
    textTooltip: String,
    heightSheet: String,
});

const sheet = ref(false);

const items = ref(["Check", "Data", "Test"]);

let comboboxData = ref([]);
</script>
<template>
    <div class="bottom-sheet text-center">
        <v-bottom-sheet v-model="sheet" persistent>
            <template v-slot:activator="{ on, attrs }">
                <button-custom
                    :icon="props.icon"
                    :textTooltip="props.textTooltip"
                    :activator="{ on, attrs }"
                ></button-custom>
            </template>
            <v-sheet class="" :height="heightSheet">
                <!-- <div
                    class="sheet__header d-flex justify-space-between align-center elevation-6 px-5 py-2"
                >
                    <div class="sheet__name text-h4 font-weight-bold">
                        Task Visualization
                    </div>
                    <div class="sheet__action">
                        <v-btn text color="error" @click="sheet = !sheet">
                            close
                        </v-btn>
                    </div>
                </div> -->
                <v-toolbar dense>
                    <v-toolbar-title class="text-h4 font-weight-bold"
                        >Title</v-toolbar-title
                    >

                    <v-spacer></v-spacer>
                    <div class="sheet__action d-flex">
                        <v-btn icon>
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                        <v-combobox
                            v-model="comboboxData"
                            :items="items"
                            multiple
                            chips
                            hide-details
                            placeholder="Object Type Filter"
                        ></v-combobox>
                        <v-btn @click="sheet = !sheet" icon>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-toolbar>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>

<style scoped></style>
