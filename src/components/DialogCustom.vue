<script>
import DialogConfirm from "./DialogConfirm.vue";
export default {
    components: {
        DialogConfirm,
    },
    props: {
        isConfirm: { type: Boolean, default: false },
        dialogName: { type: String },
        cssLink: { type: String },
    },
    data() {
        return {
            dialog: false,
        };
    },
    methods: {},
};
</script>
<template>
    <v-dialog
        transition="scroll-x-reverse-transition"
        persistent
        :activator="'.' + cssLink"
        content-class="right-dialog"
    >
        <template v-slot:default="dialog">
            <div class="px-4 d-flex flex-column" :style="{ height: '100vh' }">
                <div class="dialog__header">
                    <div
                        class="dialog__title px-0 py-2 d-flex justify-space-between align-center"
                        :style="{ fontSize: '2rem' }"
                    >
                        <p class="mb-0 font-weight-bold">
                            {{ dialogName }}
                        </p>

                        <dialog-confirm
                            v-if="isConfirm"
                            @update:close="($event) => (dialog.value = $event)"
                        >
                            <template v-slot:openConfirmDialog="{ activator }">
                                <v-btn
                                    icon
                                    v-bind="activator.attrs"
                                    v-on="activator.on"
                                    ><v-icon>mdi-close</v-icon></v-btn
                                >
                            </template>
                        </dialog-confirm>
                        <v-btn v-else icon @click="dialog.value = false"
                            ><v-icon>mdi-close</v-icon></v-btn
                        >
                    </div>
                    <slot name="dialogHeader"></slot>
                </div>
                <v-divider></v-divider>

                <slot name="dialogContent"></slot>

                <v-spacer></v-spacer>
                <div class="dialog__action">
                    <v-divider></v-divider>
                    <slot
                        name="dialogAction"
                        :closeDialog="
                            () => {
                                dialog.value = false;
                            }
                        "
                    ></slot>
                </div>
            </div>
        </template>
    </v-dialog>
</template>
<style>
.right-dialog {
    max-width: 500px !important;
    min-height: 100vh;
    background: white;
    border-radius: 0 !important;
    right: 0 !important;
    top: 0;
    margin: 0 !important;
    position: fixed;
}
.v-btn__content {
    font-weight: 500 !important;
    font-size: 1.4rem !important;
}

/*.dialog__header {
    position: sticky;
    top: 0;
    z-index: 9999999;
    background-color: white;
}

.dialog__action {
    position: sticky;
    bottom: 0;
    z-index: 9999;
    background-color: white;
}
*/
</style>
