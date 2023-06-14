<script setup>
// import { ref } from "vue";
// import ButtonCustom from "../components/ButtonCustom.vue";
import DialogCustom from "../components/DialogCustom.vue";
import BottomSheetCustom from "../components/BottomSheetCustom.vue";
import MenuCustom from "../components/MenuCustom.vue";
import DialogCreateEdit from "../components/Header/DialogCreateEdit.vue";
</script>

<template>
    <div class="departments">
        <div class="dep__filter no-print d-flex align-center flex-wrap">
            <p class="dep__title mb-0">Departments</p>
            <v-spacer></v-spacer>

            <div class="dep__tasks">
                <bottom-sheet-custom
                    icon="mdi-check-circle"
                    textTooltip="There are currently no running department task"
                    heightSheet="50vh"
                >
                    <template> </template>
                </bottom-sheet-custom>
            </div>
            <div class="dep__search flex-grow-1">
                <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                    light
                    solo
                    flat
                    dense
                    background-color="#F0F0F0"
                    label="Search Results..."
                    clearable
                ></v-text-field>
            </div>
            <div class="dep__actions d-flex ml-auto">
                <div class="dep__add">
                    <menu-custom icon="mdi-plus" textTooltip="Add/Create">
                        <template #menu-content>
                            <p
                                class="font-weight-bold px-4 my-0"
                                :style="{
                                    fontSize: '1.6rem',
                                }"
                            >
                                Title
                            </p>
                            <v-list-item-group>
                                <v-list-item>
                                    <dialog-create-edit
                                        :useButton="false"
                                        dialogName="Create Department"
                                        textReplaceButton="Empty Department"
                                        type="create"
                                    ></dialog-create-edit>
                                </v-list-item>
                                <v-list-item
                                    >Room/Department from Template</v-list-item
                                >
                            </v-list-item-group>
                        </template>
                    </menu-custom>
                </div>
                <div class="dep__edit">
                    <dialog-create-edit
                        icon="mdi-pencil"
                        textTooltip="Edit"
                        dialogName="Edit Department"
                        type="edit"
                    ></dialog-create-edit>
                </div>
                <div class="dep__filter">
                    <dialog-custom
                        icon="mdi-filter-variant"
                        textTooltip="Filter"
                        dialogName="Filter"
                    ></dialog-custom>
                </div>

                <div class="dep__settings">
                    <dialog-custom
                        icon="mdi-cog"
                        textTooltip="Settings"
                        dialogName="Settings"
                    >
                    </dialog-custom>
                </div>
                <div class="dep__more">
                    <menu-custom
                        icon="mdi-dots-vertical"
                        textTooltip="More(Menu)"
                    >
                        <template #menu-content>
                            <p
                                class="font-weight-bold px-4 my-0"
                                :style="{
                                    fontSize: '1.6rem',
                                }"
                            >
                                Title
                            </p>
                            <v-list-item-group>
                                <v-list-item>Content 1</v-list-item>
                                <v-list-item>Content 2</v-list-item>
                                <v-list-item>Content 3</v-list-item>
                                <v-list-item>Content 4</v-list-item>
                            </v-list-item-group>
                        </template>
                    </menu-custom>
                    <!-- <v-menu
                        offset-y
                        bottom
                        left
                        content-class="custom-position"
                    >
                        <template v-slot:activator="{ on: menu, attrs }"> -->
                    <!-- <button-custom
                                icon="mdi-dots-vertical"
                                textTooltip="More(Menu)"
                                :activator="{ on: menu, attrs }"
                            ></button-custom> -->
                    <!-- <v-tooltip bottom>
                                <template v-slot:activator="{ on: tooltip }">
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        light
                                        small
                                        icon
                                        v-bind="attrs"
                                        v-on="{ ...tooltip, ...menu }"
                                    >
                                        <v-icon dark color="black"
                                            >mdi-dots-vertical</v-icon
                                        >
                                    </v-btn>
                                </template>
                                <span>More(Menu)</span>
                            </v-tooltip>
                        </template> -->
                    <!-- <v-list>
                            <v-list-item
                                v-for="(item, index) in items"
                                :key="index"
                            >
                                <v-list-item-title>{{
                                    item.title
                                }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu> -->
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dep__title {
    font-size: 20px;
    font-weight: bold;
}
</style>
