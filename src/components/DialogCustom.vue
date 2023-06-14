<script setup>
import ButtonCustom from "./ButtonCustom.vue";
const props = defineProps({
    icon: String,
    textTooltip: String,
    useButton: { type: Boolean, default: true },
    dialogName: String,
    textReplaceButton: String,
});
</script>

<template>
    <v-dialog
        transition="scroll-x-reverse-transition"
        persistent
        content-class="right-dialog"
    >
        <template v-slot:activator="{ on, attrs }">
            <button-custom
                :icon="props.icon"
                :textTooltip="props.textTooltip"
                :activator="{ on, attrs }"
                v-if="useButton"
            ></button-custom>
            <div text @click="on.click" v-if="!useButton">
                {{ textReplaceButton }}
            </div>
        </template>
        <template v-slot:default="dialog">
            <div class="px-4 d-flex flex-column" :style="{ height: '100vh' }">
                <div
                    class="dialog__header px-0 py-2 d-flex justify-space-between align-center"
                    :style="{ fontSize: '2rem' }"
                >
                    <p class="mb-0 font-weight-bold">{{ dialogName }}</p>
                    <v-btn icon @click="dialog.value = false"
                        ><v-icon>mdi-close</v-icon></v-btn
                    >
                </div>
                <v-divider></v-divider>

                <slot name="dialogContent"></slot>
                <v-spacer></v-spacer>
                <v-divider></v-divider>
                <div class="dialog__action py-2 d-flex">
                    <slot name="dialogAction"></slot>
                </div>
            </div>
        </template>
    </v-dialog>
</template>

<style>
.right-dialog {
    max-width: 500px !important;
    min-height: 100%;
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
</style>
