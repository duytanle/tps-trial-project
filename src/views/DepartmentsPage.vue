<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import HeaderFilter from "../components/Header/HeaderFilter.vue";
import api from "../api/index";
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
            pagination: {
                page: 1,
                itemsPerPage: 10,
            },
            selectedDep: [],
            refIdEdit: "",
            departmentTypeEdit: null,
            directlyEdit: false,
        };
    },
    computed: {
        ...mapGetters({
            depTypes: "getDepTypes",
            depColumns: "getDepColumns",
            departments: "getDepartments",
            metaDepartment: "getMetaDepartment",
            listEditNumber: "getListEditNumber",
        }),
    },
    watch: {
        pagination: {
            handler: async function (newValue) {
                this.$router.push({
                    query: {
                        pageSize: newValue.itemsPerPage,
                        page: newValue.page,
                    },
                });
                await this.fetchDepartments({
                    pageSize: newValue.itemsPerPage,
                    page: newValue.page,
                    sort: "name",
                    projectId: this.id,
                    state: "ACTIVE",
                });
                this.setDesserts();
            },
            deep: true,
        },
        selectedDep: function () {
            this.setListEditDep(this.selectedDep);
        },
        departments: function () {
            this.setDesserts();
        },
    },

    methods: {
        ...mapActions(["fetchDepColumns", "fetchDepartments", "fetchDepTypes"]),
        ...mapMutations(["setListEditDep", "setProjectId"]),
        handlePagination(pagination) {
            if (
                this.pagination.itemsPerPage !== pagination.itemsPerPage ||
                this.pagination.page !== pagination.page
            ) {
                // this.selectedPage = pagination.page;
                this.pagination.page = pagination.page;
                this.pagination.itemsPerPage = pagination.itemsPerPage;
            }
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
                    id: department.id,
                    department_type_id: department.department_type.id,
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

        customSort(items, index, sortBy, isDesc) {
            console.log(items, sortBy, isDesc);
            items.sort((a, b) => {
                if (index[0] == "date") {
                    if (!isDesc[0]) {
                        return new Date(b[index]) - new Date(a[index]);
                    } else {
                        return new Date(a[index]) - new Date(b[index]);
                    }
                } else {
                    if (typeof a[index] !== "undefined") {
                        if (!isDesc[0]) {
                            return a[index]
                                .toLowerCase()
                                .localeCompare(b[index].toLowerCase());
                        } else {
                            return b[index]
                                .toLowerCase()
                                .localeCompare(a[index].toLowerCase());
                        }
                    }
                }
            });
            return items;
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

        resizableGrid(table) {
            let row = table.querySelectorAll("tr")[0];
            let cols = row ? row.children : undefined;
            console.log(cols);
            if (!cols) return;

            table.style.overflow = "hidden";
            let tableHeight = table.offsetHeight;

            for (const element of cols) {
                console.log(element);
                let div = this.createDiv(tableHeight);
                element.appendChild(div);
                element.style.position = "relative";
                this.setListeners(div);
            }
        },

        setListeners(div) {
            let pageX, curCol, nxtCol, curColWidth, nxtColWidth;
            let temp = this.paddingDiff;
            div.addEventListener("mousedown", function (e) {
                curCol = e.target.parentElement;
                nxtCol = curCol.nextElementSibling;
                pageX = e.pageX;

                let padding = temp(curCol);

                curColWidth = curCol.offsetWidth - padding;
                if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
            });

            div.addEventListener("mouseover", function (e) {
                e.target.style.borderRight = "2px solid #0000ff";
            });

            div.addEventListener("mouseout", function (e) {
                e.target.style.borderRight = "";
            });

            document.addEventListener("mousemove", function (e) {
                if (curCol) {
                    let diffX = e.pageX - pageX;

                    if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

                    curCol.style.width = curColWidth + diffX + "px";
                }
            });

            document.addEventListener("mouseup", function (e) {
                curCol = undefined;
                nxtCol = undefined;
                pageX = undefined;
                nxtColWidth = undefined;
                curColWidth = undefined;
            });
        },

        createDiv(height) {
            let div = document.createElement("div");
            div.style.top = 0;
            div.style.right = 0;
            div.style.width = "5px";
            div.style.position = "absolute";
            div.style.cursor = "col-resize";
            div.style.userSelect = "none";
            div.style.height = height + "px";
            return div;
        },

        paddingDiff(col) {
            if (this.getStyleVal(col, "box-sizing") == "border-box") {
                return 0;
            }

            let padLeft = this.getStyleVal(col, "padding-left");
            let padRight = this.getStyleVal(col, "padding-right");
            return parseInt(padLeft) + parseInt(padRight);
        },

        getStyleVal(elm, css) {
            return window.getComputedStyle(elm, null).getPropertyValue(css);
        },
    },
    async created() {
        this.setProjectId(this.id);
        let query = this.$route.query;
        if (query) {
            this.pagination.page = +query.page || 1;
            this.pagination.itemsPerPage = +query.pageSize || 10;
        }
        await this.fetchDepTypes({ pageSize: 5000, projectId: this.id });

        await this.fetchDepColumns(this.id);
        await this.fetchDepartments({
            pageSize: this.$route.query.pageSize || 10,
            page: this.$route.query.page || 1,
            sort: "name",
            projectId: this.id,
            state: "ACTIVE",
        });

        this.headers = this.depColumns.map((item) => ({
            text: item,
            align: "start",
            sortable: true,
            value: item,
            divider: true,
        }));
        this.setDesserts();
    },

    mounted() {
        const tableWrapper = document.querySelector(".v-data-table__wrapper");
        tableWrapper.addEventListener("scroll", this.handleWrapperScroll);
    },
    updated() {
        const table = document.getElementsByTagName("table");
        console.log(table[0]);
        this.resizableGrid(table[0]);
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
                    :server-items-length="metaDepartment.total_results"
                    @pagination="handlePagination"
                    :items-per-page="itemsPerPage"
                >
                    <template v-slot:[`header.ref_id`]="{ header }">
                        <span>{{ header.text }} </span>
                        <v-icon small>mdi-pencil</v-icon>
                    </template>

                    <template v-slot:[`header.department_type`]="{ header }">
                        <span>{{ header.text }} </span>
                        <v-icon small>mdi-pencil</v-icon>
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
                                item.state
                                    .toLowerCase()
                                    .charAt(0)
                                    .toUpperCase() +
                                item.state.toLowerCase().slice(1)
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
</style>
