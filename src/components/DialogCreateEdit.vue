<script>
import DialogCustom from "./DialogCustom.vue";
import DialogConfirm from "./DialogConfirm.vue";
import api from "../api/index";
import { mapActions, mapGetters } from "vuex";
export default {
    components: { DialogCustom, DialogConfirm },
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
            loading: "getLoading",
            projectId: "getProjectId",
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
            this.dep.id = newValue.ref_id;
            this.dep.notes = newValue.notes;
            this.dep.state = [
                newValue.state.toLowerCase().charAt(0).toUpperCase() +
                    newValue.state.toLowerCase().slice(1),
            ];
            this.dep.type = {
                id: newValue.department_type.id,
                name: newValue.department_type.option_name,
            };
        },
    },
    methods: {
        ...mapActions(["fetchEditDepartment"]),
        async save(closeDialog) {
            this.rules.name = [(v) => !!v || "This field is required"];
            this.rules.type = [(v) => !!v || "This field is required"];

            if (!this.$refs.addEditForm.validate()) {
                this.snackbar = true;
            } else {
                if (this.type === "edit") {
                    let editInfo = {
                        ...this.detailDep,
                        modified_at: new Date().toISOString(),
                        name: this.dep.name,
                        ref_id: this.dep.id,
                        notes: this.dep.notes,
                        state: this.dep.state[0].toUpperCase(),
                        department_type: this.dep.type.id,
                    };
                    await this.fetchEditDepartment({
                        depId: this.detailDep.id,
                        editInfo,
                    });
                    closeDialog();
                } else {
                    console.log(this.dep.name);
                    let createInfo = {
                        projectId: this.projectId,
                        name: this.dep.name,
                        refId: this.dep.id,
                        state: this.dep.state[0].toLocaleUpperCase(),
                        notes: this.dep.notes,
                        costCenter: null,
                        division: null,
                        departmentType: this.dep.type.id,
                    };

                    await api.createDepartment(createInfo);
                    closeDialog();
                }
            }
        },
        async saveAndCreateAnother() {
            await this.save(() => {});
            this.dep.name = "";
            this.dep.type = null;
            this.dep.id = "";
            this.dep.state = ["Active"];
            this.dep.notes = "";
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
                        :loading="loading"
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
                        :loading="loading"
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
        <template #dialogAction="{ closeDialog }">
            <div class="pr-2 pl-0 py-0 col col-6">
                <v-btn
                    outlined
                    color="primary"
                    class="text-capitalize"
                    v-if="type === 'create'"
                    @click="saveAndCreateAnother"
                >
                    Save and Create Another
                </v-btn>
                <dialog-confirm
                    v-else
                    @update:close="($event) => (!$event ? closeDialog() : null)"
                >
                    <template v-slot:openConfirmDialog="{ activator }">
                        <v-btn
                            outlined
                            color="primary"
                            class="text-capitalize"
                            :style="{ width: '100%' }"
                            v-bind="activator.attrs"
                            v-on="activator.on"
                        >
                            Cancel
                        </v-btn>
                    </template>
                </dialog-confirm>
            </div>
            <div class="pl-2 pr-0 py-0 col col-6">
                <v-btn
                    depressed
                    color="primary"
                    class="text-capitalize"
                    :style="{ width: '100%' }"
                    @click="() => save(closeDialog)"
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
