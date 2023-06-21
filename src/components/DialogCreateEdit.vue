<script>
import DialogCustom from "./DialogCustom.vue";
import { mapGetters } from "vuex";
export default {
    components: { DialogCustom },
    props: {
        dialogName: String,
        cssLink: String,
        type: String,
    },
    data() {
        return {
            rules: {
                name: [],
                dep: [],
            },
            dep: {
                name: "",
                type: null,
                id: "",
                state: ["Active"],
                notes: "",
            },
            snackbar: false,
        };
    },
    computed: {
        ...mapGetters({
            depTypes: "getDepTypes",
            infoEditDep: "getInfoEditDep",
            detailDep: "getDetailDepartment",
        }),
    },
    watch: {
        "dep.name"() {
            this.rules.name = [];
        },
        "dep.type"() {
            this.rules.type = [];
        },
        detailDep(newValue) {
            this.dep.name = newValue.name;
            this.dep.id = newValue.id;
            this.dep.notes = newValue.notes;
            this.dep.state = [newValue.state];
        },
    },
    methods: {
        save() {
            this.rules.name = [(v) => !!v || "This field is required"];
            this.rules.type = [(v) => !!v || "This field is required"];
            let self = this;
            setTimeout(function () {
                if (!self.$refs.addEditForm.validate()) {
                    self.snackbar = true;
                }
            });
        },
    },
};
</script>

<template>
    <dialog-custom
        :dialogName="dialogName"
        :isConfirm="true"
        :cssLink="cssLink"
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
                        v-model="dep.name"
                        :rules="rules.name"
                        required
                    ></v-text-field>
                    <v-combobox
                        :items="depTypes"
                        item-text="name"
                        item-value="id"
                        :rules="rules.type"
                        label="Department Type*"
                        required
                        color="primary"
                        v-model="dep.type"
                    ></v-combobox>
                    <v-text-field
                        v-model="dep.id"
                        label="Department ID"
                        class="pa-0 mt-4"
                    ></v-text-field>
                    <v-combobox
                        v-model="dep.state"
                        :items="['Active', 'Inactive', 'Redacted']"
                        label="Active*"
                        color="primary"
                    ></v-combobox>
                    <v-text-field
                        v-model="dep.notes"
                        label="Note"
                        class="pa-0 mt-4"
                    ></v-text-field>
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
            <v-snackbar
                v-model="snackbar"
                color="rgb(184, 15, 0)"
                content-class="text-h6"
                class="py-16"
            >
                Please correct the errors highlighted above and try again.

                <template v-slot:action="{ attrs }">
                    <v-btn icon v-bind="attrs" @click="snackbar = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
            </v-snackbar>
        </template>
    </dialog-custom>
</template>

<style scoped></style>
