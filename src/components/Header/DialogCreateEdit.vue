<script setup>
import { ref } from "vue";
import DialogCustom from "../DialogCustom.vue";
const props = defineProps({
    useButton: { type: Boolean, default: true },
    dialogName: String,
    textReplaceButton: { type: String, default: "" },
    icon: String,
    textTooltip: String,
    type: String,
});
let rules = ref({
    name: [(val) => (val || "").length > 0 || "This field is required"],
});
</script>

<template>
    <dialog-custom
        :useButton="useButton"
        :dialogName="dialogName"
        :textReplaceButton="textReplaceButton"
        :icon="icon"
        :textTooltip="textTooltip"
    >
        <template #dialogContent
            ><v-form
                class="dialog__content justify-content-flex-end pt-4 pb-2 px-0"
                ref="addEditForm"
            >
                <div class="pb-3">
                    <v-text-field
                        label="Name*"
                        class="pa-0 mt-4"
                        v-model="text"
                        :rules="rules.name"
                        required
                    ></v-text-field>
                    <v-combobox
                        :items="items"
                        :rules="rules.name"
                        label="Department Type*"
                        required
                        color="primary"
                    ></v-combobox>
                    <v-text-field
                        label="Department ID"
                        class="pa-0 mt-4"
                    ></v-text-field>
                    <v-combobox
                        :items="items"
                        label="Active*"
                        color="primary"
                    ></v-combobox>
                    <v-text-field label="Note" class="pa-0 mt-4"></v-text-field>
                </div>
                <div class="form-note" :style="{ fontSize: '1.2rem' }">
                    *indicates required field
                </div>
            </v-form>
        </template>
        <template #dialogAction>
            <div class="pr-2 pl-0 py-0 col col-6">
                <v-btn
                    outlined
                    color="primary"
                    class="font-button"
                    v-if="type === 'create'"
                >
                    Save and Create Another
                </v-btn>
                <v-btn
                    outlined
                    color="primary"
                    class="font-button"
                    :style="{ width: '100%' }"
                    v-else
                >
                    Cancel
                </v-btn>
            </div>
            <div class="pl-2 pr-0 py-0 col col-6">
                <v-btn
                    depressed
                    color="primary"
                    class="font-button"
                    :style="{ width: '100%' }"
                    @click="save"
                >
                    Save
                </v-btn>
            </div>
        </template>
    </dialog-custom>
</template>

<style scoped></style>
