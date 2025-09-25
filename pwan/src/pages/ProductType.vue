<template>
  <q-page padding :class="{ 'flex flex-center full-height': $q.screen.gt.sm }">
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
        :rowKey="(row) => row.code"
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

      <Done />
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref, computed } from "vue";
import Done from "src/components/Done.vue";
import path from "src/router/urlpath";
import HeaderPage from "src/components/HeaderPage.vue";
import BaseTable from "src/components/consumables/BaseTable.vue";
import { useProductTypeStore } from "src/stores/productTypeStore";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export default {
  name: "StatePage",
  components: {
    Done,
    BaseTable,
    HeaderPage,
  },

  data() {
    const { t } = useI18n();
    const pageName = computed(() => t("producttype.pagename"));
    const hint = computed(() => t("producttype.hint"));
    const useStore = useProductTypeStore();
    const router = useRouter();
    const headers = SessionStorage.getItem("headers");
    const title = ref("Product Type(s)");
    const selection = ref("single");
    const profile = LocalStorage.getItem("turnelParams");
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
    ];
    const showFormDialog = ref(false);
    const action = ref("");
    const rows = ref([]);
    const medium_dialog = ref(false);

    return {
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
      profile,
    };
  },
  methods: {
    filterCountries(val, update) {
      console.log(">>>>val>>>>>>", val);
      if (val === "") {
        update(() => {
          this.countries = this.allCountries;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.countries = this.allCountries.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },

    fetchData() {
      try {
        const requestParams = {
          params: {
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
        axios
          .get(path.PRODUCTTYPE_SEARCH, requestParams, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            console.log(">>>>>>>>>response.data>>>>>>>>>", response.data);
            if (response.data) {
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
      this.useStore.data = this.rows;
      this.useStore.mode = "create";
      this.setStoreCallRouter(null);
    },
    editItem() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log("Selected Record >>>>", record);
        this.useStore.mode = "update";
        this.setStoreCallRouter(record);
      }
    },
    viewItem() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log("Selected Record >>>>", record);

        this.useStore.mode = "view";
        this.setStoreCallRouter(record);
      }
    },
    deleteItem() {
      console.log(">>>>>calling delete item >>>>>>>>>>>");
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        this.useStore.mode = "delete";
        this.setStoreCallRouter(record);
      }
    },

    setStoreCallRouter(record) {
      if (record != null) {
        this.useStore.formData = record;
      } else {
        this.useStore.reset();
      }
      this.useStore.reload = false;
      this.router.push("/producttype/form");
    },
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("beforeMount");
  },
  mounted() {
    console.log("this.useStore.formData.reload>>>>>", this.useStore.reload);

    if (!this.useStore.reload && this.useStore.data.length > 0) {
      this.rows = [...this.useStore.data];
    } else {
      console.log("Try to reload");
      this.useStore.$reset();
      this.fetchData();
    }
  },
  updated() {
    console.log(">>>>>>this.useStore.reload>>>>>>>>", this.useStore.reload);
    if (!this.useStore.reload && this.useStore.data.length > 0) {
      this.rows = [...this.useStore.data];
    } else {
      console.log("Try to reload");
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
