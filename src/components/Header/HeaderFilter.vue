<script>
import BottomSheetCustom from "../BottomSheetCustom.vue";
import SearchComponent from "../SearchComponent.vue";
import { mapActions, mapGetters } from "vuex";
import ButtonCustom from "../ButtonCustom.vue";
import DialogCreateEdit from "../DialogCreateEdit.vue";
import DialogCustom from "../DialogCustom.vue";
import MenuCustom from "../MenuCustom.vue";
export default {
    components: {
        BottomSheetCustom,
        SearchComponent,
        ButtonCustom,
        DialogCreateEdit,
        DialogCustom,
        MenuCustom,
    },
    data() {
        return {
            depChosen: null,
            loading: false,
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
            let query = this.$route.query;
            let querySortRouter = "";
            let pageSize = query.pageSize;
            delete query.pageSize;
            query.page_size = pageSize;
            query.search = searchValue;

            if (query.sort) {
                querySortRouter = query.sort;
                query.sort = `${
                    query.desc ? `-${query.sort}` : `${query.sort}`
                }`;
            }

            const querySortString =
                "?" +
                new URLSearchParams({
                    ...query,
                    page_size: pageSize,
                }).toString();

            query.sort = querySortRouter;

            this.$router.push({
                query,
            });

            await this.fetchSortDepartment(querySortString);
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
