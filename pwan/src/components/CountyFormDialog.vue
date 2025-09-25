<template>
  <q-page padding>
    <q-card class="card-flex-display">
      <q-card-section>
        <div class="text-h6">{{ form.label }}</div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-input
            filled
            bottom-slots
            v-model="countyStore.formData.code"
            label="Code"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="countyStore.formData.name"
            label="Name"
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="countyStore.formData.countryCode"
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
            v-model="countyStore.formData.stateCode"
            :options="stateList"
            label="State"
            :dense="dense"
            use-input
            input-debounce="200"
            clearable
            @filter="filterStates"
          />
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="center">
          <q-btn
            rounded
            size="md"
            color="primary"
            label="Cancel"
            @click="cancel"
          />
          <q-btn
            v-if="showButton"
            :label="actionLabel"
            :color="colourLabel"
            @click="executeRecord"
            size="md"
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { SessionStorage } from "quasar";
import { ref } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import { useCountyStore } from "src/stores/countyStore";
import { useRouter } from "vue-router";
import helper from "src/utils/helper";
import { useQuasar } from "quasar";

export default {
  name: "CountyFormDialog",
  props: {
    onClick: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    searchValue: {
      type: String, // Specify the data type of the prop
      required: true, // Indicates whether the prop is required or not
    },
    action: {
      type: String,
      required: true,
    },
    actionLabel: {
      type: String,
      required: true,
    },
    urlLink: {
      type: String,
      required: true,
    },
  },
  data() {
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + "px";
    const dialogHeight = controlHeight + "px";
    const headers = SessionStorage.getItem("headers");
    const countyStore = useCountyStore();
    const router = useRouter();
    const $q = useQuasar();

    const formData = ref({
      code: "",
      name: "",
    });
    const form = ref({
      label: "",
      width: "10px",
      height: "10px",
    });
    const showDialog = ref(false);

    return {
      formData,
      showDialog,
      form,
      dialogWidth,
      dialogHeight,
      countries: [],
      allCountries: [],
      stateList: [],
      allStates: [],
      dense: true,
      headers,
      countyStore,
      router,
      helper,
      showButton: true,
      actionLabel: "Create",
      colourLabel: "secondary",
      $q,
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
    executeRecord() {
      console.log(
        ">>>>>>>thisis inside handle Save,",
        this.countyStore.formData
      );
      let record = this.countyStore.formData;
      record.countryCode = this.countyStore.formData.countryCode.value;
      record.stateCode = this.countyStore.formData.stateCode.value;
      console.log("record>>>>>>>>", record);
      let promise = "";
      if (this.countyStore.mode == "create") {
        record.status = "A";
        promise = axios.post(path.COUNTY_CREATE, record, this.headers);
      }
      if (this.countyStore.mode == "update") {
        promise = axios.put(path.COUNTY_UPDATE, record, this.headers);
      } else if (this.countyStore.mode == "delete") {
        promise = axios.post(path.COUNTY_REMOVE, record, this.headers);
      }
      console.log(">>>>>>promise>>>>>", promise);

      promise
        .then((response) => {
          const result = response.data;
          console.log(">>>>>>result>>>>>>>>", result);
          if (result.success) {
            this.countyStore.reload = true;
            this.$q.notify({
              type: "positive",
              message: result.message,
              position: "center",
            });
          } else {
            this.$q.notify({
              type: "negative",
              message: result.message,
              position: "center",
            });
          }

          this.router.push("/county");
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
          this.$q.notify({
            type: "negative",
            message: error.message,
            position: "center",
          });
        });
      //this.onClick(formData.value);
      // this.formData.countryCode = this.countyStore.formData.countryCode.value;
      // this.formData.stateCode = this.countyStore.formData.stateCode.value;
      // this.$emit("formDataSubmitted", this.formData);
      // this.showDialog = true;
      // console.log(this.showDialog);
    },

    handleStateUpdate(value) {
      this.countyStore.formData.stateCode = {
        value: "",
        label: "Select State",
      };
      this.handleCountryChange(value);
    },
    handleCountryChange(selectedItem) {
      console.log("calling country change", selectedItem.value);
      const requestParams = {
        params: {
          countryCode: selectedItem.value,
        },
      };
      console.log(">>>>>>this.headers>>>>>>>", this.headers);
      axios
        .get(path.STATE_SEARCH, requestParams, this.headers)
        .then((response) => {
          console.log("State Response >>>>>>>>>>>>", response.data);
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
    cancel() {
      this.countyStore.reload = false;
      this.router.push("/county");
    },
    updateData() {
      if (this.countyStore.mode == "view") {
        this.showButton = false;
      } else {
        this.showButton = true;
      }
      this.actionLabel = this.countyStore.mode;
      if (this.countyStore.mode == "delete") {
        this.colourLabel = "red";
      } else {
        this.colourLabel = "secondary";
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
    console.log("before Mount");
  },
  mounted() {
    console.log("mounted");
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
    if (this.countyStore.formData.countryCode) {
      this.handleCountryChange(this.countyStore.formData.countryCode);
    }
    this.updateData();
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
    this.formData = { code: "", name: "" };
  },
  updated() {
    console.log(">>>>>>>>updated >>>>>>>>>>>>>>>", this.countyStore.mode);
    this.updateData();
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
