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
            :readonly="isReadonly"
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
          <div class="row">
            <div class="col-6">
              <q-file
                bottom-slots
                filled
                v-model="formData.imageByte"
                label="Product Image"
              >
                <template v-slot:append>
                  <q-icon name="attachment" />
                </template>
              </q-file>
            </div>
            <div v-if="imageFile" class="col-6 q-mt-md">
              <img :src="imageFile" alt="Preview" style="max-width: 100%" />
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <q-file filled v-model="formData.videoByte" label="Product Video">
                <template v-slot:append>
                  <q-icon name="attachment" />
                </template>
              </q-file>
            </div>
            <div v-if="videoFile" class="col-6 q-mt-md">
              <q-video
                :src="videoFile"
                autoplay="false"
                controls
                class="my-video"
              />
            </div>
          </div>
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
            @update:model-value="handleCountryChange"
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.state"
            :options="stateList"
            label="Select State"
            @update:model-value="handleStateChange"
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
      stateList: [],
      counties: [],
      isReadonly: false,
      imageFile: null,
      videoFile: null,
    };
  },
  methods: {
    showTimePopup() {
      this.$refs.timePopup.show();
    },
    hideTimePopup() {
      this.$refs.timePopup.hide();
    },

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
      this.formData.status = this.formData.status.value;
      this.formData.inspectionTime = this.time;
      const requestData = new FormData();
      for (let key in this.formData) {
        requestData.append(key, this.formData[key]);
      }

      this.$emit("formDataSubmitted", requestData);
      this.showDialog = true;
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
          this.stateList = response.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          console.log("this.state List >>>>>>>>>>>>", this.stateList);
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    handleStateChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: this.formData.country.value,
          stateCode: selectedItem.value,
        },
      };
      axios
        .get(path.COUNTY_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.counties = response.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
        })
        .catch((error) => {});
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
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.countries = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {});
    axios
      .get(path.PRODUCTTYPE_SEARCH, requestParams, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.productTypes = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {});

    axios
      .get(path.PRODUCTSTATUS_SEARCH_ALL, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.productStatusList = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    axios
      .get(path.DIMENSION_SEARCH_ALL, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.dimensions = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {});
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
      this.isReadonly = true;
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
              debug("fetched product Type Definition>>>>>>", result.data[0]);
              this.formData = result.data[0];
              this.formData.country = {
                value: result.data[0].country.code,
                label: result.data[0].country.name,
              };
              this.formData.state = {
                value: result.data[0].state.code,
                label: result.data[0].state.name,
              };
              this.formData.county = {
                value: result.data[0].county.code,
                label: result.data[0].county.name,
              };

              this.formData.dimension = {
                value: result.data[0].dimension.code,
                label: result.data[0].dimension.name,
              };

              this.formData.productStatus = {
                value: result.data[0].productStatus.code,
                label: result.data[0].productStatus.name,
              };

              this.formData.productType = {
                value: result.data[0].productType.code,
                label: result.data[0].productType.name,
              };
              this.formData.status = {
                value: result.data[0].status.code,
                label: result.data[0].status.name,
              };
              this.imageFile =
                "data:image/jpeg;base64," + result.data[0].imageByte;
              //const blob = new Blob([result.data[0].videoByte], { type: 'video/mp4' });

              //this.videoFile = URL.createObjectURL(blob);
              const byteCharacters = atob(result.data[0].videoByte); // Extract Base64 part
              const byteArrays = [];
              for (
                let offset = 0;
                offset < byteCharacters.length;
                offset += 512
              ) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
                }
                byteArrays.push(new Uint8Array(byteNumbers));
              }
              const blob = new Blob(byteArrays, { type: "video/mp4" }); // Create Blob with MIME type
              // Create Object URL and set as video source
              this.videoFile = URL.createObjectURL(blob);
            }
          })
          .catch((error) => {
            debug(error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      this.isReadonly = false;
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
