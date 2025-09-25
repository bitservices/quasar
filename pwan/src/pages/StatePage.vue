<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card>
        <q-card-section class="pwan-blue text-white">
          <HeaderPage :label="pageName" :hint="hint" />
        </q-card-section>
      </q-card>
      <q-form>
        <q-select
          filled
          bottom-slots
          v-model="formData.countryCode"
          :options="countries"
          label="Select Country"
          @update:model-value="handleCountryChange"
          :dense="dense"
          use-input
          input-debounce="200"
          clearable
          @filter="filterCountries"
        />
      </q-form>
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
      <!--<CountyFormDialog
        v-model="showFormDialog"
        :onClick="saveRecord"
        @formDataSubmitted="saveRecord"
        label="County"
        :searchValue="searchValue"
        :action="action"
        :actionLabel="actionLabel"
        :urlLink="urlLink"
      />-->
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
import { SessionStorage } from "quasar";
import axios from "axios";
import { ref, computed } from "vue";
import ResponseDialog from "src/components/ResponseDialog.vue";
import Done from "src/components/Done.vue";
import path from "src/router/urlpath";
import HeaderPage from "src/components/HeaderPage.vue";
import BaseTable from "src/components/consumables/BaseTable.vue";
import { useStateStore } from "src/stores/stateStore";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export default {
  name: "StatePage",
  components: {
    ResponseDialog,
    Done,
    BaseTable,
    HeaderPage,
  },

  data() {
    const { t } = useI18n();
    const pageName = computed(() => t("state.pagename"));
    const hint = computed(() => t("state.hint"));
    const stateStore = useStateStore();
    const router = useRouter();
    const headers = SessionStorage.getItem("headers");
    const title = ref("State");
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
        required: false,
        label: "Name",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },

      {
        name: "country",
        align: "center",
        label: "Country",
        field: (row) => row.countryCode.name,
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
      stateStore,
      router,
      pageName,
      hint,
      countries: [],
      allCountries: [],
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
        axios.get(path.STATE_ALL, this.headers).then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          console.log(">>>>>>>>>response.data>>>>>>>>>", response.data);
          if (response.data) {
            this.stateStore.data = [...response.data];
            this.rows = response.data;
            this.$refs.tableRef.selected = [];
          }
        });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    addItem() {
      const defaultCountry = { label: "Select Country", value: "" };
      this.stateStore.formData.countryCode = defaultCountry;
      this.stateStore.reload = false;
      this.stateStore.mode = "create";
      this.stateStore.data = this.rows;

      this.router.push("/state/form");
    },
    editItem() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log("Selected Record >>>>", record);

        const country = {
          label: record.countryCode.name,
          value: record.countryCode.code,
        };
        this.stateStore.formData = record;
        this.stateStore.formData.countryCode = country;
        this.stateStore.reload = false;
        this.stateStore.mode = "update";
        this.router.push("/state/form");
      }
    },
    viewItem() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log("Selected Record >>>>", record);

        const country = {
          label: record.countryCode.name,
          value: record.countryCode.code,
        };
        this.stateStore.formData = record;
        this.stateStore.formData.countryCode = country;
        this.stateStore.reload = false;
        this.stateStore.mode = "view";
        this.router.push("/state/form");
      }
    },
    deleteItem() {
      console.log(">>>>>calling delete item >>>>>>>>>>>");
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log("Selected Record >>>>", record);

        const country = {
          label: record.countryCode.name,
          value: record.countryCode.code,
        };
        this.stateStore.formData = record;
        this.stateStore.formData.countryCode = country;
        this.stateStore.reload = false;
        this.stateStore.mode = "delete";
        this.router.push("/state/form");
      }
    },

    getSelectedString() {
      try {
        return null;
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    handleCountryChange(selectedItem) {
      console.log(">>>>>selectedItem>>>>>>>>", selectedItem);

      const requestParams = {
        params: {
          countryCode: this.formData.countryCode.value,
        },
      };
      axios
        .get(path.STATE_SEARCH, requestParams, this.headers)
        .then((response) => {
          this.stateStore.data = [...response.data.data];
          this.rows = response.data.data;

          this.$refs.tableRef.selected = [];
        })
        .catch((error) => {
          console.log(error);
        });
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
    console.log("this.stateStore.formData.reload>>>>>", this.stateStore.reload);
    if (!this.stateStore.reload && this.stateStore.data.length > 0) {
      this.rows = [...this.stateStore.data];
    } else {
      console.log("Try to reload");
      this.stateStore.$reset();
      this.fetchData();
    }
    axios
      .get(path.COUNTRY_ALL)
      .then((response) => {
        this.countries = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        this.allCountries = this.countries;
        console.log("this.countries >>>>>>>>>>>>", this.countries);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  },
  updated() {
    console.log(">>>>>>this.stateStore.reload>>>>>>>>", this.stateStore.reload);
    if (!this.stateStore.reload && this.stateStore.data.length > 0) {
      this.rows = [...this.stateStore.data];
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
