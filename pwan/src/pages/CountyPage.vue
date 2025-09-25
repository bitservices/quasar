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
          @update:model-value="handleStateUpdate"
          :dense="dense"
          use-input
          input-debounce="200"
          clearable
          @filter="filterCountries"
        />

        <q-select
          filled
          bottom-slots
          v-model="formData.stateCode"
          :options="stateList"
          label="State"
          @update:model-value="handleStateChange"
          :dense="dense"
          use-input
          input-debounce="200"
          clearable
          @filter="filterStates"
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

      <!--q-table
        class='my-sticky-header-table'
        flat
        bordered
        title='County'
        :rows='rows'
        :columns='columns'
        row-key='name'
        :selected-rows='getSelectedString'
        selection='multiple'
        v-model:selected='selected'
      >
        <template v-slot:top>
          <q-label>County</q-label>
          <q-space />
          <q-btn rounded color='green' icon='add' size='sm' @click='addItem' />
          <q-btn rounded color='blue' icon='edit' size='sm' @click='editItem' />
          <q-btn
            rounded
            color='info'
            icon='visibility'
            size='sm'
            @click='viewItem'
          />
          <CountyFormDialog
            v-model='showFormDialog'
            :onClick='saveRecord'
            @formDataSubmitted='saveRecord'
            label='County'
            :searchValue='searchValue'
            :action='action'
            :actionLabel='actionLabel'
            :urlLink='urlLink'
          />
          <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />
          <q-btn
            rounded
            color='red'
            icon='delete'
            size='sm'
            @click='showDialog'
          >
            <q-dialog v-model='medium_dialog'>
              <q-card style='width: 700px' class='bg-info text-white'>
                <q-card-section>
                  <div class='text-h6'>Delete Item(s)</div>
                </q-card-section>

                <q-card-section class='q-pt-none'>
                  Are you sure you want to delete selected item(s)
                </q-card-section>
                <q-card-actions align='center' class='bg-white text-teal'>
                  <q-btn
                    @click='deleteItem'
                    flat
                    label='Yes'
                    v-close-popup
                    class='bg-negative text-white'
                    rounded
                  />
                  <q-btn
                    flat
                    label='No'
                    class='bg-secondary text-white'
                    v-close-popup
                    rounded
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-btn>
        </template>
      </q-table-->
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
import debug from "src/router/debugger";
import HeaderPage from "src/components/HeaderPage.vue";
import BaseTable from "src/components/consumables/BaseTable.vue";
import { useCountyStore } from "src/stores/countyStore";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export default {
  name: "CountyPage",
  components: {
    ResponseDialog,
    Done,
    BaseTable,
    HeaderPage,
  },

  data() {
    const { t } = useI18n();
    const pageName = computed(() => t("county.pagename"));
    const hint = computed(() => t("county.hint"));
    const countyStore = useCountyStore();
    const router = useRouter();
    const headers = SessionStorage.getItem("headers");
    const title = ref("Country");
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
        name: "state",
        align: "center",
        label: "State",
        field: (row) => row.stateCode.name,
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
    const urlLink = ref(path.COUNTY_SEARCH);
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const action = ref("");
    const searchValue = ref("");
    const rows = ref([]);
    const selected = ref([]);
    const actionLabel = ref("Submit");
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
        countryCode: "Select Country",
        stateCode: "select State",
      },
      childRef,
      selected,
      columns,
      rows,
      headers,
      medium_dialog,
      action,
      showFormDialog,
      selection,
      title,
      pagination,
      countyStore,
      router,
      pageName,
      hint,
      countries: [],
      allCountries: [],
      stateList: [],
      allStates: [],
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

    filterStates(val, update) {
      console.log(">>>>val>>>>>>", val);
      if (val === "") {
        update(() => {
          this.stateList = this.allStates;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.stateList = this.allStates.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },
    fetchData() {
      try {
        axios.get(path.COUNTY_ALL, this.headers).then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          if (response.data) {
            this.countyStore.data = [...response.data];
            this.rows = response.data;
            this.$refs.tableRef.selected = [];
          }
        });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    addItem() {
      this.countyStore.reset();
      const defaultState = { label: "Select State", value: "" };
      const defaultCountry = { label: "Select Country", value: "" };
      this.countyStore.formData.countryCode = defaultCountry;
      this.countyStore.formData.stateCode = defaultState;
      this.countyStore.reload = false;
      this.countyStore.mode = "create";
      this.countyStore.data = this.rows;

      this.router.push("/county/form");
    },
    editItem() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log("Selected Record >>>>", record);
        const state = {
          label: record.stateCode.name,
          value: record.stateCode.code,
        };
        const country = {
          label: record.countryCode.name,
          value: record.countryCode.code,
        };
        this.countyStore.formData = record;
        this.countyStore.formData.stateCode = state;
        this.countyStore.formData.countryCode = country;
        this.countyStore.reload = false;
        this.countyStore.mode = "update";
        this.router.push("/county/form");
      }
    },
    viewItem() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log("Selected Record >>>>", record);
        const state = {
          label: record.stateCode.name,
          value: record.stateCode.code,
        };
        const country = {
          label: record.countryCode.name,
          value: record.countryCode.code,
        };
        this.countyStore.formData = record;
        this.countyStore.formData.stateCode = state;
        this.countyStore.formData.countryCode = country;
        this.countyStore.reload = false;
        this.countyStore.mode = "view";
        this.router.push("/county/form");
      }
    },
    deleteItem() {
      console.log(">>>>>calling delete item >>>>>>>>>>>");
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log("Selected Record >>>>", record);
        const state = {
          label: record.stateCode.name,
          value: record.stateCode.code,
        };
        const country = {
          label: record.countryCode.name,
          value: record.countryCode.code,
        };
        this.countyStore.formData = record;
        this.countyStore.formData.stateCode = state;
        this.countyStore.formData.countryCode = country;
        this.countyStore.reload = false;
        this.countyStore.mode = "delete";
        this.router.push("/county/form");
      }
    },

    getSelectedString() {
      try {
        return null;
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    handleStateUpdate(value) {
      this.formData.stateCode = {
        value: "",
        label: "Select State",
      };
      this.handleCountryChange(value);
    },
    handleCountryChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: selectedItem.value,
        },
      };
      axios
        .get(path.STATE_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.stateList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allStates = this.stateList;
          console.log("this.stateList >>>>>>>>>>>>", this.stateList);
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    handleStateChange(selectedItem) {
      console.log(">>>>>selectedItem>>>>>>>>", selectedItem);
      const requestParams = {
        params: {
          countryCode: this.formData.countryCode.value,
          stateCode: selectedItem.value,
        },
      };
      axios
        .get(path.COUNTY_SEARCH, requestParams, this.headers)
        .then((response) => {
          this.countyStore.data = [...response.data.data];
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
    console.log(
      "this.countyStore.formData.reload>>>>>",
      this.countyStore.reload
    );
    if (!this.countyStore.reload && this.countyStore.data.length > 0) {
      this.rows = [...this.countyStore.data];
    } else {
      console.log("Try to reload");
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
    console.log(
      ">>>>>>this.countyStore.reload>>>>>>>>",
      this.countyStore.reload
    );
    if (!this.countyStore.reload && this.countyStore.data.length > 0) {
      this.rows = [...this.countyStore.data];
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
