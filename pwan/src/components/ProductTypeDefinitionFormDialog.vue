<template>
  <q-dialog v-model="showDialog" persistent width="1229px" height="600px">
    <q-card
      class="card-flex-display"
      :style="{ width: form.width, height: form.height }"
    >
      <q-card-section>
        <div class="text-h6">{{ form.label }}</div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.productType"
            :options="productTypes"
            label="Select Product Type"
            :dense="dense"
          />

          <q-input
            filled
            bottom-slots
            v-model="formData.name"
            label="Name"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.address"
            label="Address"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.amount"
            label="Enter Amount"
            type="number"
            step="0.01"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.description"
            label="Description"
            type="textarea"
            rows="2"
            maxlength="200"
            counter
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.landmark"
            label="Landmark"
            type="textarea"
            rows="3"
            maxlength="300"
            counter
          />
          <q-checkbox
            v-model="formData.allowedPartialPayment"
            label="Allowed Parital Payment"
            color="primary"
          />
          <q-checkbox
            v-model="formData.allowedInspection"
            label="Allowed Inspection"
            color="secondary"
          />

          <q-file
            bottom-slots
            filled
            v-model="formData.imageUrl"
            label="Product Image"
          >
            <template v-slot:append>
              <q-icon name="attachment" />
            </template>
          </q-file>
          <q-file
            bottom-slots
            filled
            v-model="formData.videoUrl"
            label="Product Video"
          >
            <template v-slot:append>
              <q-icon name="attachment" />
            </template>
          </q-file>
          <q-time
            v-model="formData.inspectionTime"
            format24h
            mask="HH:mm:ss"
            bordered
            model-value="formData.inspectionTime"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.productStatus"
            :options="productStatusList"
            label="Select Product Status"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.totalMeasurement"
            label="Enter Total Size"
            type="number"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.dimension"
            :options="dimensions"
            label="Select Dimension"
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.country"
            :options="countries"
            label="Select Country"
            @input="handleCountryChange"
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.state"
            :options="states"
            label="Select State"
            @input="handleStateChange"
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.county"
            :options="counties"
            label="Select County"
            :dense="dense"
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
            v-close-popup
          />
          <q-btn
            :label="actionLabel"
            color="secondary"
            @click="saveRecord"
            size="md"
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { SessionStorage } from "quasar";
import { onUnmounted, ref } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import debug from "src/router/debugger";

export default {
  name: "ProductTypeFormDialog",
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

    const profile = SessionStorage.getItem("turnelParams");
    const headers = SessionStorage.getItem("headers");
    const formData = ref({
      code: "",
      name: "",
      client: "",
      organisation: "",
      createdBy: "",
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
      profile,
      headers,
      time: "10:00",
      dense: true,
      countries: [],
      states: [],
      counties: [],
    };
  },
  methods: {
    showTimePopup() {
      this.$refs.timePopup.show();
    },
    hideTimePopup() {
      this.$refs.timePopup.hide();
    },
    handleCountryChange(value) {
      debug(">>>>>>counry value>>>>>>>", value);
    },
    handleStateChange(value) {},
    saveRecord() {
      //this.onClick(formData.value);
      let productType = this.formData.productType.value;
      this.formData.client = this.profile.client;
      this.formData.organisation = this.profile.organisation;
      this.formData.createdBy = this.profile.email;
      this.formData.productType = productType;
      this.formData.dimension = this.formData.dimension.value;
      this.formData.code = productType; //this.formData.productType.value;
      this.formData.productStatus = this.formData.productStatus.value;
      this.formData.county = this.formData.county.value;
      this.formData.country = this.formData.country.value;
      this.formData.state = this.formData.state.value;
      this.formData.inspectionTime = this.time;
      const requestData = new FormData();
      for (let key in this.formData) {
        console.log(key, this.formData[key]);
        requestData.append(key, this.formData[key]);
      }
      debug(">>>>>>>>>>>>request Data >>>>>>>>>>>", requestData);

      debug(">>>>>>>>>formData>>>>>>>", this.formData);
      this.$emit("formDataSubmitted", requestData);
      this.showDialog = true;
      debug(this.showDialog);
    },
  },
  beforeCreate() {
    debug("beforeCreate");
  },
  created() {
    debug("created");
  },
  beforeMount() {
    console.log("before Mount");
  },
  mounted() {
    const turnelParams = SessionStorage.getItem("turnelParams");
    const requestParams = {
      params: {
        client: turnelParams.client,
        organisation: turnelParams.organisation,
        email: turnelParams.email,
      },
    };

    axios
      .get(path.COUNTRY_ALL)
      .then((response) => {
        debug("country Response >>>>>>>>>>>>", response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.countries = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        debug("this.countries >>>>>>>>>>>>", this.countries);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    axios
      .get(path.STATE_ALL)
      .then((response) => {
        debug("country Response >>>>>>>>>>>>", response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.states = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        debug("this.countries >>>>>>>>>>>>", this.states);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    axios
      .get(path.COUNTY_ALL)
      .then((response) => {
        debug("country Response >>>>>>>>>>>>", response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.counties = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        debug("this.countries >>>>>>>>>>>>", this.counties);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    axios
      .get(path.PRODUCTTYPE_SEARCH, requestParams, this.headers)
      .then((response) => {
        debug("Product Type Response >>>>>>>>>>>>", response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.productTypes = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        debug("this.Product Type >>>>>>>>>>>>", this.productTypes);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    axios
      .get(path.PRODUCTSTATUS_SEARCH_ALL, this.headers)
      .then((response) => {
        debug("productStatusList Response >>>>>>>>>>>>", response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.productStatusList = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        debug("this.productStatusList >>>>>>>>>>>>", this.productStatusList);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    axios
      .get(path.DIMENSION_SEARCH_ALL, this.headers)
      .then((response) => {
        debug("productStatusList Response >>>>>>>>>>>>", response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.dimensions = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        debug("this.dimensions >>>>>>>>>>>>", this.dimensions);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  },
  unmounted() {
    debug("Calling unmounted>>>>>>>>>>");
    this.formData = { code: "", name: "" };
  },
  updated() {
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == "edit" || this.action == "view") {
      try {
        const requestParams = {
          params: {
            code: this.searchValue,
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, this.headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            if (result.success) {
              this.formData = result.data[0];
              debug("formData>>>>>>>", this.formData);
            }
          })
          .catch((error) => {
            debug(error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      this.formData = {
        code: "",
        name: "",
        client: "",
        organisation: "",
        createdBy: "",
      };
    }
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
