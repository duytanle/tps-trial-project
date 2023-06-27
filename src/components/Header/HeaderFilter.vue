<script>
import BottomSheetCustom from "../BottomSheetCustom.vue";
import SearchComponent from "../SearchComponent.vue";
import { mapActions, mapGetters } from "vuex";
import ButtonCustom from "../ButtonCustom.vue";
import DialogCreateEdit from "../DialogCreateEdit.vue";
import DialogCustom from "../DialogCustom.vue";
import MenuCustom from "../MenuCustom.vue";
import draggable from "vuedraggable";
import allDepColumns from "../../utils/allDepColums";
export default {
    components: {
        BottomSheetCustom,
        SearchComponent,
        ButtonCustom,
        DialogCreateEdit,
        DialogCustom,
        MenuCustom,
        draggable,
    },
    data() {
        return {
            depChosen: null,
            loading: false,
            controller: null,
            settingData: {
                settingName: [
                    { id: 0, name: "Default" },
                    { id: 1, name: "Custom 1" },
                    { id: 3, name: "Custom 2" },
                ],
                settingFreezeColumn: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            },
            columnChecked: [],
            isAllColumn: [],
            settingChosen: {
                settingName: ["Default"],
                settingFreezeColumn: [2],
            },

            drag: false,
        };
    },
    computed: {
        ...mapGetters({
            depTypes: "getDepTypes",
            listEditNumber: "getListEditNumber",
            detailDep: "getDetailDepartment",
            infoEditDep: "getInfoEditDep",
            projectId: "getProjectId",
        }),
        depTypesName() {
            return this.depTypes.map((item) => item.text);
        },
        columnArray() {
            return Object.entries(allDepColumns).map(([item, value]) => {
                return { id: item, name: value };
            });
        },
    },

    watch: {
        async depChosen(newValue) {
            const { pageSize, sortBy } = this.$route.query;
            if (newValue) {
                await this.fetchDepartments({
                    pageSize: pageSize || 10,
                    page: 1,
                    sort: sortBy || "name",
                    projectId: this.projectId,
                    state: "ACTIVE",
                    departmentType: newValue.id,
                });
            } else {
                await this.fetchDepartments({
                    pageSize: pageSize || 10,
                    page: 1,
                    sort: sortBy || "name",
                    projectId: this.projectId,
                    state: "ACTIVE",
                });
            }
        },
        myArray(newValue) {
            console.log(newValue);
        },
        isAllColumn() {
            this.columnChecked =
                this.isAllColumn.length > 0 ? this.columnArray : [];
        },
    },
    methods: {
        ...mapActions([
            "fetchDetailDepartment",
            "fetchDepartments",
            "fetchSortDepartment",
        ]),
        async handleEditDepartment() {
            this.loading = true;
            await this.fetchDetailDepartment(this.infoEditDep.id);
            this.loading = false;
        },
        clearFilter() {
            this.depChosen = null;
        },
        async handleSearchDep(searchValue) {
            if (this.controller) {
                this.controller.abort();
            }
            this.controller = new AbortController();
            const signal = this.controller.signal;
            let query = this.$route.query;
            let queryObject = {
                page: 1,
                pageSize: 10,
                sortBy: "name",
                desc: false,
                search: searchValue,
            };
            let queryObjectAPI = {
                page: 1,
                page_size: 10,
                sort: "name",
                project: this.projectId,
                search: searchValue,
                state: "ACTIVE",
            };

            if (Object.keys(query).length > 0) {
                queryObject = { ...queryObject, ...query, search: searchValue };
                console.log(queryObject);
                queryObjectAPI = {
                    page: query.page || 1,
                    page_size: query.pageSize || 10,
                    sort: query.sort
                        ? `${
                              query.desc === "true"
                                  ? `-${query.sort}`
                                  : query.sort
                          }`
                        : "name",
                    project: this.projectId,
                    search: searchValue,
                };
            }
            const querySortString =
                "?" + new URLSearchParams(queryObjectAPI).toString();

            this.$router.push({
                query: queryObject,
            });

            await this.fetchSortDepartment({ querySortString, signal });
        },
    },
};
</script>

<template>
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

        <search-component
            customClass="dep__search flex-grow-1"
            :handleSearch="handleSearchDep"
        ></search-component>

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
                                <span class="add-empty-dialog">
                                    Empty Department
                                </span>

                                <dialog-create-edit
                                    cssLink="add-empty-dialog"
                                    dialogName="Create Department"
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
                <button-custom
                    icon="mdi-pencil"
                    textTooltip="Edit"
                    cssLink="edit-dialog"
                    type="edit"
                    :disabled="listEditNumber !== 1"
                    :handleClick="handleEditDepartment"
                ></button-custom>
                <dialog-create-edit
                    cssLink="edit-dialog"
                    dialogName="Edit Department"
                    type="edit"
                ></dialog-create-edit>
            </div>

            <div class="dep__filter">
                <button-custom
                    icon="mdi-filter-variant"
                    textTooltip="Filter"
                    cssLink="filter-dialog"
                >
                </button-custom>
                <dialog-custom cssLink="filter-dialog" dialogName="Filter">
                    <template v-slot:dialogHeader>
                        <search-component customClass="flex-grow-1 mb-1">
                        </search-component>
                    </template>
                    <template v-slot:dialogContent>
                        <div class="dialog__content mx-n4">
                            <v-expansion-panels accordion>
                                <v-expansion-panel>
                                    <v-expansion-panel-header>
                                        <div
                                            class="title d-flex align-center text-h5"
                                        >
                                            <v-icon
                                                text
                                                color="green"
                                                v-if="depChosen"
                                                >mdi-check</v-icon
                                            >Department Type
                                        </div>
                                    </v-expansion-panel-header>

                                    <v-expansion-panel-content>
                                        <v-combobox
                                            v-model="depChosen"
                                            :items="depTypes"
                                            item-text="name"
                                            item-value="id"
                                            label="Department Type"
                                            color="primary"
                                            class="px-3"
                                            clearable
                                            chips
                                            return-object
                                        >
                                        </v-combobox>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </div>
                    </template>
                    <template #dialogAction="{ closeDialog }">
                        <div class="py-2 d-flex">
                            <div class="pr-2 pl-0 py-0 col col-6">
                                <v-btn
                                    outlined
                                    color="primary"
                                    class="text-capitalize"
                                    :style="{ width: '100%' }"
                                    @click="() => clearFilter()"
                                >
                                    Clear Filter
                                </v-btn>
                            </div>
                            <div class="pl-2 pr-0 py-0 col col-6">
                                <v-btn
                                    depressed
                                    color="primary"
                                    class="text-capitalize"
                                    :style="{ width: '100%' }"
                                    @click="() => closeDialog()"
                                >
                                    Done
                                </v-btn>
                            </div>
                        </div>
                    </template>
                </dialog-custom>
            </div>

            <div class="dep__settings">
                <button-custom
                    cssLink="settings-dialog"
                    icon="mdi-cog"
                    textTooltip="Settings"
                >
                </button-custom>
                <dialog-custom dialogName="Settings" cssLink="settings-dialog">
                    <template v-slot:dialogContent>
                        <div
                            class="settings__content py-4"
                            style="
                                max-height: 90vh;
                                overflow-y: scroll;
                                overflow-x: hidden;
                            "
                        >
                            <div class="settings__setting">
                                <div
                                    class="font-weight-bold"
                                    style="font-size: 1.7rem"
                                >
                                    Setting
                                </div>
                                <v-container fluid>
                                    <v-row class="py-4">
                                        <v-col cols="8" class="pa-0">
                                            <v-combobox
                                                v-model="
                                                    settingChosen.settingName
                                                "
                                                :items="settingData.settingName"
                                                item-text="name"
                                                item-value="id"
                                                label="Setting Names"
                                                color="primary"
                                                class="pa-0"
                                                clearable
                                                return-object
                                            >
                                                <template
                                                    v-slot:item="{ item }"
                                                >
                                                    <div
                                                        class="d-flex align-center flex-grow-1"
                                                    >
                                                        <p class="mb-0">
                                                            {{ item.name }}
                                                        </p>
                                                        <v-btn
                                                            text
                                                            color="red"
                                                            class="text-capitalize ml-auto"
                                                            >Remove</v-btn
                                                        >
                                                    </div>
                                                </template>
                                            </v-combobox>
                                        </v-col>
                                        <v-col cols="4" class="py-0">
                                            <v-btn
                                                class="col-4 text-capitalize"
                                                color="primary"
                                                min-width="100%"
                                            >
                                                <v-icon>mdi-plus</v-icon>
                                                Add New
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </div>
                            <div class="settings__visibility">
                                <div
                                    class="font-weight-bold"
                                    style="font-size: 1.7rem"
                                >
                                    Visibility
                                </div>
                                <div class="check-box pl-2">
                                    <v-checkbox
                                        label="Show Redacted Departments"
                                        hide-details
                                    ></v-checkbox>
                                    <v-checkbox
                                        label="Show Inactive Departments"
                                        hide-details
                                    ></v-checkbox>
                                </div>
                                <v-combobox
                                    v-model="settingChosen.settingFreezeColumn"
                                    :items="settingData.settingFreezeColumn"
                                    label="Freeze Lefthand column"
                                    color="primary"
                                    class="pa-0 col col-8 mt-8"
                                    clearable
                                >
                                </v-combobox>
                            </div>
                            <div
                                class="settings__column"
                                style="min-height: 500px"
                            >
                                <div class="title">
                                    <div
                                        class="font-weight-bold"
                                        style="font-size: 1.7rem"
                                    >
                                        Columns
                                    </div>
                                    <div
                                        class="sub__title"
                                        style="font-size: 1.4rem"
                                    >
                                        Choose which columns to display, and
                                        define their order.
                                    </div>
                                </div>
                                <div
                                    class="row my-1"
                                    style="border-top: 2px solid grey"
                                >
                                    <div
                                        class="col col-6 pr-0"
                                        style="border-right: 2px solid grey"
                                    >
                                        <div class="title">
                                            <div
                                                class="font-weight-bold"
                                                style="font-size: 1.4rem"
                                            >
                                                Available columns
                                            </div>
                                            <div
                                                class="sub__title"
                                                style="font-size: 1.4rem"
                                            >
                                                Select columns to add
                                            </div>
                                        </div>
                                        <div class="search mt-4">
                                            <search-component></search-component>
                                        </div>
                                        <v-list class="list column">
                                            <v-list-item
                                                class="select-all px-2"
                                            >
                                                <v-list-item-action
                                                    class="mr-3"
                                                >
                                                    <v-checkbox
                                                        v-model="isAllColumn"
                                                        hide-details
                                                        class="mt-0"
                                                        value="all"
                                                        :indeterminate="
                                                            columnChecked.length <
                                                            columnArray.length
                                                        "
                                                        color="primary"
                                                    >
                                                    </v-checkbox>
                                                </v-list-item-action>
                                                <v-list-item-content>
                                                    Select All
                                                </v-list-item-content>
                                            </v-list-item>
                                            <v-list-item
                                                v-for="column in columnArray"
                                                :key="column.id"
                                                class="pl-2 pr-0"
                                            >
                                                <v-list-item-action
                                                    class="mr-3"
                                                >
                                                    <v-checkbox
                                                        v-model="columnChecked"
                                                        :value="column"
                                                        hide-details
                                                        class="mt-0"
                                                    >
                                                    </v-checkbox>
                                                </v-list-item-action>
                                                <v-list-item-content>
                                                    <v-list-item-title
                                                        style="
                                                            white-space: nowrap;
                                                            overflow: hidden;
                                                            text-overflow: ellipsis;
                                                        "
                                                    >
                                                        {{ column.name }}
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </div>
                                    <div class="col col-6">
                                        <div class="title">
                                            <div
                                                class="font-weight-bold"
                                                style="font-size: 1.4rem"
                                            >
                                                Selected Columns
                                            </div>
                                            <div
                                                class="sub__title"
                                                style="font-size: 1.4rem"
                                            >
                                                Drag and drop to reorder
                                            </div>
                                        </div>
                                        <div
                                            class="drag-column mt-6"
                                            style="cursor: move"
                                        >
                                            <draggable
                                                v-model="columnChecked"
                                                group="people"
                                                @start="drag = true"
                                                @end="drag = false"
                                            >
                                                <div
                                                    v-for="element in columnChecked"
                                                    :key="element.id"
                                                    class="row align-center"
                                                >
                                                    <div class="col-2">
                                                        <v-icon>
                                                            mdi-drag-horizontal-variant
                                                        </v-icon>
                                                    </div>
                                                    <p class="col-10 mb-0">
                                                        {{ element.name }}
                                                    </p>
                                                </div>
                                            </draggable>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #dialogAction="{ closeDialog }">
                        <div class="py-2 d-flex">
                            <div class="pr-2 pl-0 py-0 col col-6">
                                <v-btn
                                    outlined
                                    color="primary"
                                    class="text-capitalize"
                                    :style="{ width: '100%' }"
                                    @click="() => clearFilter()"
                                >
                                    Clear Filter
                                </v-btn>
                            </div>
                            <div class="pl-2 pr-0 py-0 col col-6">
                                <v-btn
                                    depressed
                                    color="primary"
                                    class="text-capitalize"
                                    :style="{ width: '100%' }"
                                    @click="() => closeDialog()"
                                >
                                    Done
                                </v-btn>
                            </div>
                        </div>
                    </template>
                </dialog-custom>
            </div>
            <div class="dep__more">
                <menu-custom icon="mdi-dots-vertical" textTooltip="More(Menu)">
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
</template>

<style scoped>
.dep__title {
    font-size: 20px;
    font-weight: bold;
}
</style>
