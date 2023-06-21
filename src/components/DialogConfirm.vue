<script>
export default {
    data() {
        return {
            dialog: false,
        };
    },
    methods: {
        handleCloseConfirm(type) {
            this.$emit("update:close", !type);
            this.dialog = false;
        },
    },
};
</script>
<template>
    <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
            <slot name="openConfirmDialog" :activator="{ on, attrs }"></slot>
        </template>
        <v-card>
            <v-card-title style="font-size: 2.5rem" class="pt-4 pb-3">
                Unsaved Changes
            </v-card-title>

            <v-card-text class="text-h5">
                You have unsaved changes, are you sure you want to cancel?
            </v-card-text>

            <v-card-actions class="pt-2 pb-4">
                <v-btn
                    color="primary"
                    class="ml-auto text-capitalize"
                    outlined
                    @click="
                        () => {
                            handleCloseConfirm(false);
                        }
                    "
                >
                    No, Return
                </v-btn>
                <v-btn
                    color="primary"
                    class="text-capitalize"
                    style="width: 180px"
                    @click="
                        () => {
                            handleCloseConfirm(true);
                        }
                    "
                >
                    Yes, Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style scoped></style>
