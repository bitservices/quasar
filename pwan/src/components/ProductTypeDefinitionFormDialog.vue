<template>
  <q-page padding>
    <HeaderPage :label="pageName" :hint="hint" />
    <q-stepper v-model="step" flat animated>
      <!-- Step 1 -->
      <q-step
        :name="1"
        :title="$q.screen.lt.md ? '' : 'Product Type Definition Detail'"
        icon="person"
      >
        <div v-if="$q.screen.lt.md">
          <p>Product Type Definition Detail</p>
          <hr />
        </div>

        <q-form @submit.prevent="validateInfo" ref="productInfoForm">
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.productType"
            :options="productTypes"
            label="Select Product Type"
            :readonly="isReadonly"
            :dense="dense"
            :rules="[requiredRule]"
          />

          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.name"
            label="Name"
            :dense="dense"
            :rules="[inputFieldRule]"
          />

          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.amount"
            label="Enter Amount"
            type="number"
            step="0.01"
            :rules="[inputFieldRule]"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.description"
            label="Description"
            type="textarea"
            rows="2"
            maxlength="200"
            counter
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.landmark"
            label="Landmark"
            type="textarea"
            rows="3"
            maxlength="300"
            counter
          />
          <q-checkbox
            v-model="useStore.formData.allowedPartialPayment"
            label="Allowed Parital Payment"
            color="primary"
          />
          <q-checkbox
            v-model="useStore.formData.allowedInspection"
            label="Allowed Inspection"
            color="secondary"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.inspectionTime"
            type="time"
            label="Inspection Time"
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.productStatus"
            :options="productStatusList"
            label="Select Product Status"
            :dense="dense"
            :rules="[requiredRule]"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.measurement"
            label="Enter Measurement"
            type="number"
            :rules="[inputFieldRule]"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.dimension"
            :options="dimensions"
            label="Select Dimension"
            :dense="dense"
            :rules="[requiredRule]"
          />
          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn type="submit" label="Continue" color="primary" />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>
      <q-step :name="2" :title="$q.screen.lt.md ? '' : 'Address'" icon="info">
        <div v-if="$q.screen.lt.md">
          <p>Address'</p>
          <hr />
        </div>
        <q-form @submit.prevent="validateAddressInfo" ref="addressfoForm">
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.address"
            label="Address"
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.country"
            :options="countries"
            label="Select Country"
            @update:model-value="handleCountryChange"
            :dense="dense"
            :rules="[requiredRule]"
            use-input
            input-debounce="200"
            clearable
            @filter="filterCountries"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.state"
            :options="stateList"
            label="Select State"
            @update:model-value="handleStateChange"
            :dense="dense"
            :rules="[requiredRule]"
            use-input
            input-debounce="200"
            clearable
            @filter="filterStates"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.county"
            :options="counties"
            label="Select County"
            :dense="dense"
            :rules="[requiredRule]"
            use-input
            input-debounce="200"
            clearable
            @filter="filterCounties"
          />
          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn @click="step = 1" label="Back" />
              <q-btn type="submit" label="Continue" color="primary" />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>
      <q-step
        :name="3"
        :title="$q.screen.lt.md ? '' : 'Image and Video'"
        icon="person"
      >
        <div v-if="$q.screen.lt.md">
          <p>Flyer, Subscription Form and Video'</p>
          <hr />
        </div>
        <q-form @submit.prevent="submitForm" ref="uploadForm">
          <div class="row">
            <div class="cols-6 col-12">
              <q-file
                bottom-slots
                filled
                v-model="useStore.formData.imageByte"
                label="Product Flyer"
                clearable
                accept=".jpg,.jpeg,.png"
                @update:model-value="validateImageFile"
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <!-- Error message -->
            <div v-if="imgError" class="text-negative text-caption q-mt-sm">
              {{ imgError }}
            </div>

            <!-- Preview for images -->
            <div class="cols-6 col-12 q-mt-md">
              <q-img
                v-if="previewImageUrl"
                :src="previewImageUrl"
                spinner-color="primary"
                style="width: 100%; height: 50%"
              />
            </div>
          </div>

          <br />
          <hr />

          <div class="row">
            <div class="cols-6 col-12">
              <q-file
                bottom-slots
                filled
                v-model="useStore.formData.subscriptionFormByte"
                label="Subscription Form"
                clearable
                accept=".pdf"
                @update:model-value="validatePdfFile"
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <!-- Error message -->
            <div v-if="pdfError" class="text-negative text-caption q-mt-sm">
              {{ pdfError }}
            </div>

            <!-- PDF Preview -->
            <div v-if="previewPdfUrl" class="cols-6 col-12 q-mt-md">
              <object
                :data="previewPdfUrl"
                type="application/pdf"
                width="100%"
                height="400px"
              >
                <p>
                  Your browser does not support PDF preview.
                  <a :href="previewPdfUrl" target="_blank">Download PDF</a>
                </p>
              </object>
            </div>
          </div>
          <br />
          <hr />
          <div class="row">
            <div class="cols-6 col-12">
              <q-file
                bottom-slots
                filled
                v-model="useStore.formData.videoByte"
                label="Product video"
                clearable
                accept="video/*"
                @update:model-value="validateVideoFile"
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <!-- Error message -->
            <div v-if="videoError" class="text-negative text-caption q-mt-sm">
              {{ videoError }}
            </div>

            <!-- Preview for videos -->
            <div v-if="previewVideoUrl" class="cols-6 col-12 q-mt-md">
              <video
                :src="previewVideoUrl"
                spinner-color="primary"
                style="width: 100%; height: 400px"
                autoplay="false"
                controls
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <q-stepper-navigation>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                size="md"
                color="negative"
                label="Cancel"
                @click="cancel"
              />
              <q-btn @click="step = 2" label="Back" />
              <q-btn
                v-if="showButton"
                :label="actionLabel"
                :color="colourLabel"
                type="submit"
              />
            </div>
          </q-stepper-navigation>
        </q-form>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage, Loading, QSpinnerGears } from "quasar";
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import { useProductTypeDefinitionStore } from "src/stores/productTypeDefinitionStore";
import { useRouter } from "vue-router";
import helper from "src/utils/helper";
import { useQuasar } from "quasar";
import HeaderPage from "src/components/HeaderPage.vue";
import { isRequired, inputFieldRequired } from "src/validation/validation";

export default {
  components: {
    HeaderPage,
  },
  name: "ProductTypeFormDialog",

  data() {
    const useStore = useProductTypeDefinitionStore();
    const router = useRouter();
    const $q = useQuasar();
    const { t } = useI18n();
    const pageName = computed(() => t("producttypedef.pagename"));
    const hint = computed(() => t("producttypedef.hint"));
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + "px";
    const dialogHeight = controlHeight + "px";
    const userEmail = LocalStorage.getItem("userEmail");
    const headers = SessionStorage.getItem("headers");
    const profile = LocalStorage.getItem("turnelParams");

    const file = ref(null);
    const previewImageUrl = ref(null);
    const previewVideoUrl = ref(null);
    const previewPdfUrl = ref(null);

    const imgError = ref(null);
    const videoError = ref(null);
    const pdfError = ref(null);

    const formData = ref({
      code: "",
      name: "",
    });
    const form = ref({
      label: "",
      width: "10px",
      height: "10px",
    });
    const meeting = ref({
      day: "",
      startTime: "",
      endTime: "",
      meetingName: "",
    });
    const showDialog = ref(false);
    const step = ref(1);

    return {
      formData,
      showDialog,
      form,
      dialogWidth,
      dialogHeight,
      clients: [],
      allClients: [],
      userEmail,
      headers,
      countries: [],
      allCountries: [],
      stateList: [],
      allStates: [],
      counties: [],
      allCounties: [],
      dense: true,
      isReadonly: false,
      pageName,
      hint,
      profile,
      requiredRule: (value) => isRequired(value),
      inputFieldRule: (value) => inputFieldRequired(value),
      productTypes: [],
      useStore,
      actionLabel: "Create",
      colourLabel: "posotive",
      router,
      $q,
      step,
      showButton: true,
      dimensions: [],
      previewImageUrl,
      previewVideoUrl,
      file,
      imgError,
      videoError,
      previewPdfUrl,
      pdfError,
    };
  },
  methods: {
    filterClients(val, update) {
      console.log(">>>>val>>>>>>", val);
      if (val === "") {
        update(() => {
          this.clients = this.allClients;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.clients = this.allClients.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },
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
    filterCounties(val, update) {
      console.log(">>>>val>>>>>>", val);
      if (val === "") {
        update(() => {
          this.counties = this.allCounties;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.counties = this.allCounties.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },
    getPosition() {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // Success callbac
              this.useStore.formData.latitude = position.coords.latitude;
              this.useStore.formData.longitude = position.coords.longitude;
            },
            (error) => {
              // Error callback
              console.log(error);
            }
          );
        } else {
          console.log("Geolocation is not supported by this browser");
        }
      } catch (error) {
        console.log(">>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>", error);
      }
    },
    validateInfo() {
      if (this.$refs.productInfoForm.validate()) {
        this.step = 2;
      }
    },
    validateAddressInfo() {
      if (this.$refs.addressfoForm.validate()) {
        this.step = 3;
      }
    },
    submitForm() {
      if (this.$refs.uploadForm.validate()) {
        Loading.show({
          message: "Application is processing, please wait...",
          spinner: QSpinnerGears, // You can use other spinners

          spinnerColor: "secondary",
          spinnerSize: 60,
        });
        let data = Object.assign({}, this.useStore.formData);
        console.log(">>>>meetingDays >>>>>>", data);

        data.county = data.county.value;
        data.country = data.country.value;
        data.state = data.state.value;
        data.status = "A";
        data.createdBy = this.profile.email;
        data.client = this.profile.client;
        data.organisation = this.profile.organisation;
        data.destination = path.UPLOAD_DESINATION;
        data.productType = data.productType.value;
        data.dimension = data.dimension.value;

        data.productStatus = data.productStatus.value;
        const record = new FormData();
        for (let key in data) {
          record.append(key, data[key]);
        }

        console.log(">>>>>>>>>>>rrecord 111111 >>>>>>>>", record);
        let promise = "";
        if (this.useStore.mode == "create") {
          record.status = "A";
          promise = axios.post(path.PRODUCTDEF_CREATE, record, this.headers);
        }
        if (this.useStore.mode == "update") {
          promise = axios.put(path.PRODUCTDEF_UPDATE, record, this.headers);
        } else if (this.useStore.mode == "delete") {
          console.log("calling deactivate >>>>>>>>>>>>>");
          promise = axios.post(path.PRODUCTDEF_REMOVE, record, this.headers);
        }
        console.log(">>>>>>promise>>>>>", promise);

        promise
          .then((response) => {
            const result = response.data;
            console.log(">>>>>>result>>>>>>>>", result);
            //Loading.hide();
            if (result.success) {
              this.useStore.reload = true;
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

            this.router.push("/productdef");
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
            this.$q.notify({
              type: "negative",
              message: error.message,
              position: "center",
            });
          });
      }
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
          console.log("stateList>>", response.data);
          this.stateList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allStates = this.stateList;
          console.log("this.state List >>>>>>>>>>>>", this.stateList);
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    handleStateChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: this.useStore.formData.country.value,
          stateCode: selectedItem.value,
        },
      };
      axios
        .get(path.COUNTY_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.counties = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allCounties = this.counties;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    cancel() {
      this.useStore.reload = false;
      this.router.push("/productdef");
    },
    validateImageFile(files) {
      console.log(">>>>>>>inside validte File>>>>>>>>>>", files);
      this.imgError = null;
      this.previewImageUrl = null;

      const f = files[0] || files;
      console.log(">>>>>>>f>>>>>>>>>>", f);
      if (!f) return;

      // 1. Check size (e.g. max 2MB)
      const maxSize = 5 * 1024 * 1024;
      console.log(">>>>>f size >>>>>>>>", f.size);
      if (f.size > maxSize) {
        this.imgError = "File size must be less than 2MB";
        this.file = null;
        return;
      }

      // 2. Check type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(f.type)) {
        this.imgError = "Only JPG, PNG, and PDF files are allowed";
        this.file = null;
        return;
      }

      // 3. Generate preview if it's an image
      if (f.type.startsWith("image/")) {
        this.previewImageUrl = URL.createObjectURL(f);
        console.log(">>>>>this.previewImageUrl>>>>>>>", this.previewImageUrl);
      }
    },

    validateVideoFile(files) {
      console.log(">>>>>>>inside video validate File>>>>>>>>>>", files);
      this.videoError = null;
      this.previewVideoUrl = null;

      const f = files[0] || files;
      console.log(">>>>>>>f>>>>>>>>>>", f);
      if (!f) return;

      // 1. Check size (e.g. max 2MB)
      const maxSize = 20 * 1024 * 1024;
      console.log(">>>>>f size >>>>>>>>", f.size);
      if (f.size > maxSize) {
        this.videoError = "File size must be less than 10MB";
        this.file = null;
        return;
      }

      // 2. Check type
      const allowedTypes = ["video/mp3", "video/mp4", "application/pdf"];
      if (!allowedTypes.includes(f.type)) {
        this.videoError = "Only mp3, mp4, and vlc files are allowed";
        this.file = null;
        return;
      }

      // 3. Generate preview if it's an image
      if (f.type.startsWith("video/")) {
        this.previewVideoUrl = URL.createObjectURL(f);
        console.log(">>>>>this.previewVideoUrl>>>>>>>", this.previewVideoUrl);
      }
    },
    validatePdfFile(files) {
      console.log(">>>>>>>inside video validate File>>>>>>>>>>", files);
      this.pdfError = null;
      this.previewPdfUrl = null;

      const f = files[0] || files;
      console.log(">>>>>>>f>>>>>>>>>>", f);
      if (!f) return;

      // 1. Check size (e.g. max 2MB)
      const maxSize = 5 * 1024 * 1024;
      console.log(">>>>>f size >>>>>>>>", f.size);
      if (f.size > maxSize) {
        this.pdfError = "File size must be less than 10MB";
        this.file = null;
        return;
      }

      // 2. Check type
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(f.type)) {
        this.pdfError = "Only pdf files are allowed";
        this.file = null;
        return;
      }

      // 3. Generate preview if it's an image
      if (f.type.startsWith("application/")) {
        this.previewPdfUrl = URL.createObjectURL(f);
        console.log(">>>>>this.previewPdfUrl>>>>>>>", this.previewPdfUrl);
      }
    },
    updateData() {
      console.log(">>>>>>at updated value >>>>>>>>>", this.useStore.formData);
      this.isReadonly = false;
      if (this.useStore.mode == "view") {
        this.showButton = false;
      } else {
        this.showButton = true;
      }
      this.actionLabel = this.useStore.mode;
      if (this.useStore.mode == "delete") {
        this.colourLabel = "negative";
      } else {
        this.colourLabel = "secondary";
      }
      if (this.useStore.mode != "create") {
        this.isReadonly = true;
      }
      if (this.useStore.formData.imageUrl) {
        this.previewImageUrl = this.useStore.formData.imageUrl;
      } else {
        this.previewImageUrl = null;
      }

      if (this.useStore.formData.subscriptionFormUrl) {
        this.previewPdfUrl = this.useStore.formData.subscriptionFormUrl;
      } else {
        this.previewPdfUrl = null;
      }

      if (this.useStore.formData.videoUrl) {
        this.previewVideoUrl = this.useStore.formData.videoUrl;
      } else {
        this.previewVideoUrl = null;
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
    const requestParams = {
      params: {
        client: this.profile.client,
        organisation: this.profile.organisation,
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
        this.allCountries = this.countries;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(path.PRODUCTTYPE_SEARCH, requestParams, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        console.log(
          ">>>>>>>product type response>>>>>>>>>",
          response.data.data
        );
        this.productTypes = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {
        console.log(error);
      });

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
      .catch((error) => {
        console.log(error);
      });
    this.updateData();
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
  },
  updated() {
    console.log(">>>>>>>>updated >>>>>>>>>>>>>>>", this.useStore);
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
