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
            v-if="issuperuser"
            rounded
            color="red"
            icon="done"
            size="sm"
            @click="activate"
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
import { useClientStore } from "src/stores/clientStore";
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
    const pageName = computed(() => t("client.pagename"));
    const hint = computed(() => t("client.hint"));
    const useStore = useClientStore();
    const router = useRouter();
    const headers = SessionStorage.getItem("headers");
    const title = ref("Client(s)");
    const selection = ref("single");
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
        name: "isAnAffilate",
        align: "center",
        label: "Is An Affilate",
        field: (row) => row.isAnAffilate,
        sortable: true,
      },
      {
        name: "website",
        align: "center",
        label: "Web Site",
        field: (row) => row.website,
        sortable: true,
      },
    ];
    const showFormDialog = ref(false);
    const action = ref("");
    const rows = ref([]);
    const medium_dialog = ref(false);

    return {
      formData: {
        stateCode: "select State",
      },
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
      issuperuser: false,
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
        const requestParam = {
          params: {
            createdBy: LocalStorage.getItem("userEmail"),
          },
        };
        axios
          .get(path.CLIENT_FIND_BY_CREATOR, requestParam, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            console.log(">>>>>>>>>response.data>>>>>>>>>", response.data);
            if (response.data) {
              this.useStore.data = [...response.data];
              this.rows = response.data;
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
    activate() {
      console.log(">>>>>calling delete item >>>>>>>>>>>");
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log("Selected Record >>>>", record);

        this.useStore.mode = "activate";
        this.setStoreCallRouter(record);
      }
    },

    setStoreCallRouter(record) {
      if (record != null) {
        this.useStore.formData = record;
      }
      this.useStore.reload = false;
      this.router.push("/client/form");
    },
    loadUser() {
      try {
        const requestParam = {
          params: {
            email: LocalStorage.getItem("userEmail"),
          },
        };
        const promise = axios
          .get(path.USER_SEARCH_BY_EMAIL, requestParam, this.$headers)
          .then((response) => {
            this.issuperuser = response.data.data.is_superuser;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
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

    this.loadUser();
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
