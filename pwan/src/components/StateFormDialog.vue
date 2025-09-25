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
            v-model="stateStore.formData.code"
            label="Code"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="stateStore.formData.name"
            label="Name"
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="stateStore.formData.countryCode"
            :options="countries"
            label="Select Country"
            @update:model-value="handleStateUpdate"
            :dense="dense"
            use-input
            input-debounce="200"
            clearable
            @filter="filterCountries"
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
import { useStateStore } from "src/stores/stateStore";
import { useRouter } from "vue-router";
import helper from "src/utils/helper";
import { useQuasar } from "quasar";

export default {
  name: "StateFormDialog",
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
    const stateStore = useStateStore();
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
      dense: true,
      headers,
      stateStore,
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

    executeRecord() {
      console.log(
        ">>>>>>>thisis inside handle Save,",
        this.stateStore.formData
      );
      let record = this.stateStore.formData;
      record.countryCode = this.stateStore.formData.countryCode.value;
      console.log("record>>>>>>>>", record);
      let promise = "";
      if (this.stateStore.mode == "create") {
        record.status = "A";
        promise = axios.post(path.STATE_CREATE, record, this.headers);
      }
      if (this.stateStore.mode == "update") {
        promise = axios.put(path.STATE_UPDATE, record, this.headers);
      } else if (this.stateStore.mode == "delete") {
        promise = axios.post(path.STATE_REMOVE, record, this.headers);
      }
      console.log(">>>>>>promise>>>>>", promise);

      promise
        .then((response) => {
          const result = response.data;
          console.log(">>>>>>result>>>>>>>>", result);
          if (result.success) {
            this.stateStore.reload = true;
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

          this.router.push("/state");
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
      // this.formData.countryCode = this.stateStore.formData.countryCode.value;
      // this.formData.stateCode = this.stateStore.formData.stateCode.value;
      // this.$emit("formDataSubmitted", this.formData);
      // this.showDialog = true;
      // console.log(this.showDialog);
    },

    handleStateUpdate(value) {
      this.stateStore.formData.stateCode = {
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
      this.stateStore.reload = false;
      this.router.push("/state");
    },
    updateData() {
      if (this.stateStore.mode == "view") {
        this.showButton = false;
      } else {
        this.showButton = true;
      }
      this.actionLabel = this.stateStore.mode;
      if (this.stateStore.mode == "delete") {
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
    if (this.stateStore.formData.countryCode) {
      this.handleCountryChange(this.stateStore.formData.countryCode);
    }
    this.updateData();
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
    this.stateStore = useStateStore();
    console.log(">>>>>>>unmounting >>>>>>>>>>", this.stateStore);
  },
  updated() {
    console.log(">>>>>>>>updated >>>>>>>>>>>>>>>", this.stateStore.mode);
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
