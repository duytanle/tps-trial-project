<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import HeaderFilter from "../components/Header/HeaderFilter.vue";
import api from "../api/index";
import allDepColumns from "../utils/allDepColums";
export default {
    components: { HeaderFilter },
    props: ["id"],
    data() {
        return {
            singleSelect: false,
            selected: [],
            headers: [],
            desserts: [],
            offsetTop: 0,
            selectedPage: 1,
            itemsPerPage: 10,
            toTopBtn: false,
            pagination: false,
            queryPagination: null,
            selectedDep: [],
            refIdEdit: "",
            departmentTypeEdit: null,
            directlyEdit: false,
            tableNode: null,
            resizeColumn: {},
        };
    },
    computed: {
        ...mapGetters({
            depTypes: "getDepTypes",
            depColumns: "getDepColumns",
            departments: "getDepartments",
            metaDepartment: "getMetaDepartment",
            listEditNumber: "getListEditNumber",
            loading: "getLoading",
        }),
    },
    watch: {
        // pagination: {
        //     handler: async function (newValue) {
        //         console.log("pagination", newValue);
        //         this.$router.push({
        //             query: {
        //                 pageSize: newValue.itemsPerPage,
        //                 page: newValue.page,
        //             },
        //         });
        //         await this.fetchDepartments({
        //             pageSize: newValue.itemsPerPage,
        //             page: newValue.page,
        //             sort: "name",
        //             projectId: this.id,
        //             state: "ACTIVE",
        //         });
        //     },
        //     deep: true,
        // },
        selectedDep: function () {
            this.setListEditDep(this.selectedDep);
        },
        departments() {
            this.setDesserts();
        },
        depColumns(newValue) {
            this.headers = newValue.map((item, index) => ({
                text: allDepColumns[item],
                key: item,
                align: "start",
                sortable: true,
                value: item,
                divider: true,
                editable: item === "ref_id" || item === "department_type",
                cellClass: index < 1 ? "freeze" : "",
            }));
        },
    },

    methods: {
        ...mapActions([
            "fetchDepColumns",
            "fetchDepartments",
            "fetchDepTypes",
            "fetchSortDepartment",
        ]),
        ...mapMutations(["setListEditDep", "setProjectId", "setLoading"]),
        handlePagination() {
            // if (
            //     this.pagination.itemsPerPage !== pagination.itemsPerPage ||
            //     this.pagination.page !== pagination.page
            // ) {
            //     // this.pagination.page = this.selectedPage;
            //     this.pagination.page = pagination.page;
            //     this.pagination.itemsPerPage = pagination.itemsPerPage;
            // }
        },

        footerPagination() {
            let { page_size, page, total_results } = this.metaDepartment;
            if (total_results === 0) return "-";
            else {
                let numStart = +page * page_size - (page_size - 1);
                let numEnd =
                    page_size > total_results
                        ? total_results
                        : numStart + page_size - 1;
                return numStart + "-" + numEnd + " of " + total_results;
            }
        },

        setDesserts() {
            this.desserts = this.departments.map((department) => {
                let tempDesserts = {
                    id: department?.id,
                    department_type_id: department?.department_type?.id,
                };

                for (const depColumn of this.depColumns) {
                    if (depColumn === "department_type") {
                        tempDesserts[depColumn] =
                            department.department_type.option_name;
                    } else {
                        tempDesserts[depColumn] = department[depColumn];
                    }
                }

                return tempDesserts;
            });
        },
        handleWrapperScroll(e) {
            e.target.scrollTop > 0
                ? (this.toTopBtn = true)
                : (this.toTopBtn = false);
        },
        handleToTop() {
            const tableWrapper = document.querySelector(
                ".v-data-table__wrapper"
            );
            tableWrapper.scrollTop = 0;
        },

        async handleCloseEditTextField(valueEdit, itemEdit, headerItem) {
            if (this.directlyEdit) {
                itemEdit[headerItem.value] = valueEdit;
                await api.updateDepartment(itemEdit.id, {
                    [headerItem.text]: valueEdit,
                });
                this.directlyEdit = false;
            }
            console.log(itemEdit, headerItem);
        },

        handleChangeTextField(data) {
            if (data.trim() != this.refIdEdit.trim()) {
                this.refIdEdit = data.trim();
                this.directlyEdit = true;
            }
        },

        async handleCloseEditCombobox(itemEdit, headerItem) {
            itemEdit[headerItem.value] = this.departmentTypeEdit.name;

            if (this.directlyEdit) {
                await api.updateDepartment(itemEdit.id, {
                    [headerItem.text]: this.departmentTypeEdit.id,
                });
                this.directlyEdit = false;
            }
        },

        handleChangeCombobox(newValue, itemEdit, headerItem) {
            const valueBeforeEdit = itemEdit[headerItem.value];
            itemEdit[headerItem.value] = newValue.name;
            this.departmentTypeEdit = { id: newValue.id, name: newValue.name };
            if (valueBeforeEdit !== newValue.name) {
                this.directlyEdit = true;
            }
        },

        handleMouseDownResize(e) {
            this.resizeColumn.tableWidth =
                document.getElementsByTagName("table")[0].offsetWidth;
            console.log(this.resizeColumn.tableWidth);

            this.resizeColumn.curCol = e.target.parentElement;
            console.log(this.resizeColumn.curCol);

            this.resizeColumn.pageX = e.pageX;

            this.resizeColumn.curColWidth =
                this.resizeColumn.curCol.offsetWidth - 20;
        },
        handleMouseMoveResize(e) {
            if (this.resizeColumn.curCol) {
                console.log(this.resizeColumn.curCol);
                let diffX = e.pageX - this.resizeColumn.pageX;

                this.resizeColumn.curCol.style.width =
                    this.resizeColumn.curColWidth + diffX + "px";

                document.getElementsByTagName("table")[0].style.width =
                    this.resizeColumn.tableWidth + diffX + "px";
            }
        },
        handleMouseUpResize() {
            this.resizeColumn.curCol = undefined;
            this.resizeColumn.pageX = undefined;
            this.resizeColumn.curColWidth = undefined;
        },

        async handleSortDepartment({ sortBy, sortDesc, ...item }) {
            this.setLoading(true);
            let querySortObject = {
                page_size: item.itemsPerPage,
                page: item.page,
                sort: "name",
                project: this.id,
                state: "ACTIVE",
            };

            if (sortBy.length > 0) {
                querySortObject.sort =
                    sortBy[0] === "department_type"
                        ? sortDesc[0] === true
                            ? "-department_type__option_name"
                            : "department_type__option_name"
                        : `${sortDesc[0] === true ? "-" : ""}${sortBy[0]}`;
            }

            const querySortString =
                "?" + new URLSearchParams(querySortObject).toString();
            await this.fetchSortDepartment({ querySortString });
            if (this.pagination) {
                this.$router.push({
                    query: {
                        pageSize: this.itemsPerPage,
                        page: this.selectedPage,
                        sort:
                            querySortObject.sort.charAt(0) === "-"
                                ? querySortObject.sort.slice(1)
                                : querySortObject.sort,
                        desc: sortDesc.length > 0 ? sortDesc[0].toString() : "",
                    },
                });
            } else {
                this.pagination = true;
            }
            this.setLoading(false);
        },
    },
    async created() {
        this.setLoading(true);
        this.setProjectId(this.id);

        let query = this.$route.query;
        if (Object.keys(query).length > 0) {
            this.selectedPage = +query.page;
            this.itemsPerPage = +query.pageSize;
        }
        await this.fetchDepTypes({ pageSize: 5000, projectId: this.id });
        await this.fetchDepColumns(this.id);
        await this.fetchDepartments({
            pageSize: +this.$route.query.pageSize || 10,
            page: +this.$route.query.page || 1,
            sort: "name",
            projectId: this.id,
            state: "ACTIVE",
        });
        this.setLoading(false);
        this.resizeColumn.tableWidth =
            document.getElementsByTagName("table")[0].offsetWidth;
    },

    mounted() {
        const tableWrapper = document.querySelector(".v-data-table__wrapper");
        tableWrapper.addEventListener("scroll", this.handleWrapperScroll);
        document.addEventListener("mousemove", this.handleMouseMoveResize);
        document.addEventListener("mouseup", this.handleMouseUpResize);
    },
};
</script>

<template>
    <div class="departments" :style="{ height: '100%' }">
        <header-filter></header-filter>
        <div class="dep__content mt-16">
            <div class="table__info pa-2">
                <div class="d-flex">
                    <div class="info--total d-flex align-center mr-5">
                        <v-icon text class="text-h6">mdi-pound</v-icon>
                        <span class="font-weight-bold"
                            >Total Departments Quantity: &nbsp;</span
                        >
                        <span> {{ this.departments.length }} Departments</span>
                    </div>
                    <div class="info--total d-flex align-center mr-5">
                        <v-icon
                            text
                            class="text-h5 grey rounded-circle"
                            color="white"
                            >mdi-currency-usd</v-icon
                        >
                        <span class="font-weight-bold"
                            >Total costs: &nbsp;</span
                        >
                        <p class="mb-0">
                            <v-icon text class="text-h5"
                                >mdi-currency-usd</v-icon
                            >
                            0.00
                        </p>
                    </div>
                    <div class="info--area d-flex align-center mr-5">
                        <v-icon text class="text-h5">mdi-memory</v-icon>
                        <span class="font-weight-bold">Total area: &nbsp;</span>
                        <p class="mb-0">
                            <v-icon text class="text-h5"
                                >mdi-currency-usd</v-icon
                            >
                            0 sq ft
                        </p>
                    </div>
                    <div class="info--tooltip d-flex align-center">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                    color="white"
                                    class="text-h5 grey rounded-circle"
                                    v-bind="attrs"
                                    v-on="on"
                                    >mdi-alpha-i</v-icon
                                >
                            </template>
                            <span
                                >These value do not include Redact or inactive
                                object
                            </span>
                        </v-tooltip>
                    </div>
                </div>
            </div>
            <div>
                <v-data-table
                    item-key="name"
                    show-select
                    fixed-header
                    class="elevation-1 custom-table"
                    v-model="selectedDep"
                    :headers="headers"
                    :items="desserts"
                    :single-select="singleSelect"
                    :page.sync="selectedPage"
                    :items-per-page="itemsPerPage"
                    :server-items-length="metaDepartment.total_results"
                    :options="{
                        page: this.selectedPage,
                        itemsPerPage: this.itemsPerPage,
                    }"
                    @pagination="handlePagination"
                    @update:options="handleSortDepartment"
                    :loading="loading"
                    calculate-widths
                >
                    <template
                        v-for="header in headers"
                        v-slot:[`header.${header.key}`]
                    >
                        <span :key="header.key">{{ header.text }} </span>
                        <v-icon
                            small
                            :key="header.key + `icon`"
                            v-if="header.editable"
                            >mdi-pencil</v-icon
                        >
                        <div
                            :key="header.key + `div`"
                            class="resize-column"
                            @mousedown="handleMouseDownResize"
                        ></div>
                    </template>

                    <template v-slot:[`item.ref_id`]="{ item, header }">
                        <v-edit-dialog
                            :key="header.value"
                            :return-value.sync="item[header.value]"
                            @open="
                                () => {
                                    refIdEdit = item[header.value];
                                }
                            "
                            @close="
                                () => {
                                    handleCloseEditTextField(
                                        refIdEdit,
                                        item,
                                        header
                                    );
                                }
                            "
                        >
                            {{ item[header.value] }}
                            <template v-slot:input>
                                <v-text-field
                                    v-model="item[header.value]"
                                    label="Edit"
                                    single-line
                                    @change="handleChangeTextField"
                                ></v-text-field>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template
                        v-slot:[`item.department_type`]="{ item, header }"
                    >
                        <v-edit-dialog
                            :key="header.value"
                            :return-value.sync="item[header.value]"
                            @open="
                                () => {
                                    departmentTypeEdit = {
                                        id: item.department_type.id,
                                        name: item[header.value],
                                    };
                                }
                            "
                            @close="
                                () => {
                                    handleCloseEditCombobox(item, header);
                                }
                            "
                        >
                            {{ item[header.value] }}
                            <template v-slot:input>
                                <v-combobox
                                    v-model="item[header.value]"
                                    y
                                    :items="depTypes"
                                    item-text="name"
                                    item-value="id"
                                    label="Department Type"
                                    color="primary"
                                    class="px-3"
                                    clearable
                                    return-object
                                    @change="
                                        (newValue) => {
                                            handleChangeCombobox(
                                                newValue,
                                                item,
                                                header
                                            );
                                        }
                                    "
                                >
                                </v-combobox>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.state`]="{ item }">
                        <v-chip color="green" dark small>
                            {{
                                item?.state
                                    ?.toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                item?.state?.toLowerCase().slice(1)
                            }}
                        </v-chip>
                    </template>
                    <template slot="footer.prepend">
                        <div class="ml-auto"></div>
                        <v-btn
                            text
                            color="primary"
                            v-if="toTopBtn"
                            @click="handleToTop"
                        >
                            <v-icon>mdi-chevron-up</v-icon> TO TOP OF TABLE
                        </v-btn>
                    </template>
                    <template slot="footer.page-text">
                        <div
                            class="d-flex align-center"
                            :style="{ width: '300px' }"
                        >
                            <div class="v-data-footer__select">
                                Go to page:
                                <v-select
                                    :items="
                                        Array.from(
                                            {
                                                length: this.metaDepartment
                                                    .total_pages,
                                            },
                                            (_, i) => i + 1
                                        )
                                    "
                                    class="my-0"
                                    hide-details
                                    v-model="selectedPage"
                                ></v-select>
                            </div>
                            <div class="v-data-footer__pagination">
                                {{ footerPagination() }}
                            </div>
                        </div>
                    </template>
                </v-data-table>
            </div>
        </div>
    </div>
</template>

<style>
.custom-table.v-data-table
    > .v-data-table__wrapper
    > table
    > thead
    > tr
    > th
    span {
    font-size: 1.2rem;
    font-weight: 800;
}
.custom-table.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    font-size: 1.4rem;
}
.custom-table .v-data-footer {
    font-size: 1.4rem !important;
}
.v-data-footer__select .v-select__selections .v-select__selection--comma {
    font-size: 1.4rem;
}

.dep__content .table__info {
    background-color: #e3e3e3;
    border: solid 1px #e0e0e0;
}
tbody tr:nth-of-type(odd) {
    background-color: #f5f5f5;
}
tbody tr:hover {
    background-color: #e0e0e0 !important;
}
.v-data-footer__select {
    margin-left: 14px !important;
}

.v-data-table__wrapper {
    max-height: 60vh;
}

.resize-column {
    width: 20px;
    height: 48px;
    position: absolute;
    right: 0px;
    top: 0px;

    cursor: col-resize;
}

.resize-column:hover {
    border-right: 2px solid blue;
}
.v-progress-linear__indeterminate {
    height: 50px;
}

.freeze {
}
</style>
