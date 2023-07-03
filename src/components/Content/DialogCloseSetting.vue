<script>
export default {
    props: {
        item: { type: Object, required: true },
        settingNames: { type: Array, required: true },
        currentActiveIndex: { type: Number, required: true },
    },
    data() {
        return {
            dialog: false,
            settingReplace: [],
        };
    },
    computed: {
        listSettingNames() {
            return this.settingNames.filter(
                (setting) => setting.id !== this.item.id
            );
        },
    },
    created() {
        this.settingReplace =
            this.item.id === this.settingNames[this.currentActiveIndex].id
                ? this.settingNames[0]
                : this.settingNames[this.currentActiveIndex];
    },
    methods: {
        handleCloseSettingConfirm(type) {
            this.$emit("update:close", {
                id: type,
                itemDeleted: this.item.id,
                itemReplaced: this.settingReplace.id,
            });
            this.dialog = false;
        },
    },
};
</script>
<template>
    <v-dialog v-model="dialog" width="600">
        <template v-slot:activator="{ on, attrs }">
            <slot name="openConfirmDialog" :activator="{ on, attrs }"></slot>
        </template>
        <v-card>
            <v-card-title style="font-size: 2.5rem" class="pt-4 pb-3">
                Remove Table Setting
            </v-card-title>

            <v-card-text class="text-h5">
                You are about to remove {{ item.name }} for this table. Removing
                selected table setting will delete that configuration from your
                table setting and will no longer be available for selection.
            </v-card-text>

            <v-card-text>
                <v-combobox
                    v-model="settingReplace"
                    label="Select Table Setting to Apply"
                    :items="listSettingNames"
                    item-text="name"
                    item-value="id"
                    return-object
                >
                </v-combobox>
            </v-card-text>
            <v-card-actions
                class="pt-2 pb-4 flex-column align-center justify-content-center"
            >
                <v-btn
                    color="red"
                    class="text-capitalize"
                    width="100%"
                    outlined
                    @click="
                        () => {
                            handleCloseSettingConfirm('RC');
                        }
                    "
                >
                    Remove And Close Table Settings
                </v-btn>

                <v-btn
                    color="red"
                    class="text-capitalize ml-0 mt-5 text--white"
                    width="100%"
                    @click="
                        () => {
                            handleCloseSettingConfirm('RT');
                        }
                    "
                >
                    Remove And Return To Settings
                </v-btn>
                <v-btn
                    color="primary"
                    outlined
                    class="text-capitalize ml-0 mt-5"
                    width="100%"
                    @click="
                        () => {
                            handleCloseSettingConfirm('CC');
                        }
                    "
                >
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style scoped></style>
