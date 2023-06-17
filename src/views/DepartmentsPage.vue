<script>
import { mapActions, mapGetters } from "vuex";
import HeaderFilter from "../components/Header/HeaderFilter.vue";
export default {
    components: { HeaderFilter },
    props: ["id"],
    data() {
        return {
            singleSelect: false,
            selected: [],
            headers: [],
            desserts: [],
            options: {
                page: 1,
                itemsPerPage: 10,
                sortBy: [],
                sortDesc: [],
                groupBy: [],
                groupDesc: [],
                multiSort: false,
                mustSort: false,
            },
            selectedPage: 1,
        };
    },
    computed: {
        ...mapGetters({
            depTypes: "getDepTypes",
            depColumns: "getDepColumns",
            departments: "getDepartments",
            metaDepartment: "getMetaDepartment",
        }),
    },
    watch: {
        selectedPage(newPage) {
            this.options.page = newPage;
        },
    },
    methods: {
        ...mapActions(["fetchDepColumns", "fetchDepartments"]),
        async handlePagination(pagination) {
            console.log(pagination);
            await this.fetchDepartments({
                pageSize: pagination.itemsPerPage,
                page: pagination.page,
                sort: "name",
                projectId: this.id,
                state: "ACTIVE",
            });
            this.setDesserts();
        },
        footerPagination() {
            let { page_size, page, total_results } = this.metaDepartment;
            if (total_results === 0) return "-";
            else {
                let numStart = +page * page_size - (page_size - 1);
                let numEnd =
                    page_size > total_results
                        ? total_results
                        : numStart + page_size;
                return numStart + "-" + numEnd + " of " + total_results;
            }
        },
        setDesserts() {
            this.desserts = this.departments.map((department) => {
                let tempDesserts = {};

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
    },

    async created() {
        await this.fetchDepColumns(this.id);
        await this.fetchDepartments({
            pageSize: 10,
            page: 1,
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

    mounted() {},
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

            <v-data-table
                v-model="selected"
                :headers="headers"
                :items="desserts"
                :single-select="singleSelect"
                item-key="name"
                show-select
                class="elevation-1 custom-table"
                :options.sync="options"
                @pagination="handlePagination"
                fixed-header
                :footer-props="{
                    pagination: {
                        pageCount: this.metaDepartment.total_pages,
                        itemsLength: this.metaDepartment.total_results,
                    },
                }"
            >
                <template slot="footer.prepend">
                    <v-btn color="primary" class="ml-auto">Button mới</v-btn>
                </template>
                <template slot="footer.page-text">
                    <div
                        class="d-flex align-center"
                        :style="{ width: '300px' }"
                    >
                        <div class="v-data-footer__select">
                            Go to page:
                            <v-select
                                :items="[1, 2]"
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
