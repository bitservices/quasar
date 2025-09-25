<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card>
        <q-card-section class="pwan-blue text-white">
          <HeaderPage :label="pageName" :hint="hint" />
        </q-card-section>
      </q-card>
      <BaseTable
        ref="tableRef"
        :columns="columns"
        :data="rows"
        :rowKey="(row) => row.id"
        :selection="selection"
        :title="title"
        :pagination="pagination"
        :max-height-offset="260"
      >
        <template #top-right>
          <q-space />
          <q-btn rounded color="green" icon="add" size="sm" @click="addItem" />
          <q-btn rounded color="blue" icon="edit" size="sm" @click="editItem" />
          <q-btn
            rounded
            color="info"
            icon="visibility"
            size="sm"
            @click="viewItem"
          />
          <q-btn
            rounded
            color="red"
            icon="delete"
            size="sm"
            @click="deleteItem"
          />
        </template>
      </BaseTable>
      <ResponseDialog
        v-model="showMessageDialog"
        :cardClass="childRef.cardClass"
        :textClass="childRef.textClass"
        :label="childRef.label"
        :message="childRef.message"
        :buttonClass="childRef.buttonClass"
      />

      <Done />
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref, computed } from "vue";
import ResponseDialog from "src/components/ResponseDialog.vue";
import Done from "src/components/Done.vue";
import path from "src/router/urlpath";
import HeaderPage from "src/components/HeaderPage.vue";
import BaseTable from "src/components/consumables/BaseTable.vue";
import { useProductTypeDefinitionStore } from "src/stores/productTypeDefinitionStore";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { format } from "date-fns";

export default {
  name: "OrganisationPage",
  components: {
    ResponseDialog,
    Done,
    BaseTable,
    HeaderPage,
  },

  data() {
    const { t } = useI18n();
    const pageName = computed(() => t("producttypedef.pagename"));
    const hint = computed(() => t("producttypedef.hint"));
    const useStore = useProductTypeDefinitionStore();
    const router = useRouter();
    const headers = SessionStorage.getItem("headers");
    const title = ref("Product Type Definaition");
    const selection = ref("single");
    const turnelParams = LocalStorage.getItem("turnelParams");

    const pagination = ref({
      // sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 50,
      rowsNumber: 50,
      keyword: "",
    });
    const columns = [
      {
        name: "code",
        required: false,
        label: "Code",
        align: "left",
        field: (row) => row.code,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "name",
        align: "center",
        label: "Name",
        field: (row) => row.name,
        sortable: true,
      },
      {
        name: "amount",
        align: "center",
        label: "Amount",
        field: (row) => row.amount,
        sortable: true,
      },
      {
        name: "productStatus",
        align: "center",
        label: "Product Status",
        field: (row) => row.productStatus.name,
        sortable: true,
      },
      {
        name: "status",
        align: "center",
        label: "Status",
        field: (row) => row.status.name,
        sortable: true,
      },
    ];
    const showFormDialog = ref(false);
    const action = ref("");
    const rows = ref([]);
    const medium_dialog = ref(false);
    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });

    return {
      formData: {
        stateCode: "select State",
      },
      childRef,
      columns,
      rows,
      headers,
      medium_dialog,
      action,
      showFormDialog,
      selection,
      title,
      pagination,
      useStore,
      router,
      pageName,
      hint,
      clients: [],
      allClients: [],
      dense: "true",
      turnelParams,
    };
  },
  methods: {
    fetchData() {
      try {
        const requestParams = {
          params: {
            client: this.turnelParams.client,
            organisation: this.turnelParams.organisation,
            productStatus: "A",
          },
        };

        axios
          .get(path.PRODUCTDEF_SEARCH, requestParams, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            console.log(">>>>>>>>>response.data>>>>>>>>>", response.data.data);
            if (response.data.data) {
              this.useStore.data = [...response.data.data];
              this.rows = response.data.data;
              this.$refs.tableRef.selected = [];
            }
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    addItem() {
      this.setRecord(null);
      this.useStore.reload = false;
      this.useStore.mode = "create";
      this.useStore.data = this.rows;
    },
    editItem() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        this.setRecord(record);
        this.useStore.mode = "update";
      }
    },
    viewItem() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);

        this.setRecord(record);
        this.useStore.mode = "view";
      }
    },

    deleteItem() {
      console.log(">>>>>calling delete item >>>>>>>>>>>");
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        this.useStore.mode = "delete";
        this.setRecord(record);
      }
    },
    setRecord(record) {
      if (record == null) {
        this.useStore.reset();
        this.useStore.formData.country = { label: "Select Country", value: "" };
        this.useStore.formData.state = { label: "Select State", value: "" };
        this.useStore.formData.county = { label: "Select County", value: "" };
        this.useStore.formData.dimension = {
          label: "Select Dimension",
          value: "",
        };

        this.useStore.formData.productStatus = {
          label: "Select Product Status",
          value: "",
        };
        this.useStore.formData.productType = {
          label: "Select Product Type",
          value: "",
        };
      } else {
        const country = {
          label: record.country.name,
          value: record.country.code,
        };
        console.log("setting record ti usesotreformdata >>>>>>>>", record);
        this.useStore.formData = record;
        this.useStore.formData.country = country;
        this.useStore.formData.state = {
          label: record.state.name,
          value: record.state.code,
        };
        this.useStore.formData.county = {
          label: record.county.name,
          value: record.county.code,
        };
        this.useStore.formData.status = {
          label: record.status.name,
          value: record.status.code,
        };

        this.useStore.formData.dimension = {
          label: record.dimension.name,
          value: record.dimension.code,
        };

        this.useStore.formData.productStatus = {
          label: record.productStatus.name,
          value: record.productStatus.code,
        };
        this.useStore.formData.productType = {
          label: record.productType.name,
          value: record.productType.code,
        };

        this.useStore.reload = false;
      }

      this.router.push("/productdef/form");
    },
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log(">>>>>>>>>>>>>>beforeMount>>>>>>>>>>>>>");
  },
  mounted() {
    console.log("this.useStore.formData.reload>>>>>", this.useStore.reload);
    if (!this.useStore.reload && this.useStore.data.length > 0) {
      this.rows = [...this.useStore.data];
    } else {
      console.log("Try to reload");
      this.fetchData();
    }
  },
  updated() {
    console.log(">>>>>>this.useStore.reload>>>>>>>>", this.useStore.reload);
    if (!this.useStore.reload && this.useStore.data.length > 0) {
      this.rows = [...this.useStore.data];
    } else {
      console.log("Try to reload");
      this.formData.client = { label: "Select Client", value: "" };
      this.fetchData();
    }
  },
};
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #0c0144
    -webkit-text-fill-color: white

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
  tbody tr:nth-child(even)
</style>
