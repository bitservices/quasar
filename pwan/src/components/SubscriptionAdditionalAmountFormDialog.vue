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
          <p>Subscribed product Detail</p>
          <hr />
        </div>

        <q-form @submit.prevent="validateInfo" ref="productInfoForm">
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.client"
            :options="clients"
            label="Affilate/Client"
            :dense="dense"
            use-input
            input-debounce="200"
            clearable
            @filter="filterAffilates"
            @update:model-value="handleClientChange"
            :readonly="isReadonly"
            :rules="[requiredRule]"
          />

          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.subscribedProduct"
            :options="productList"
            label="Select Products"
            :dense="dense"
            map-options
            use-input
            stack-label
            class="q-mb-md"
            @update:model-value="handleProductChange"
            :readonly="isReadonly"
            :rules="[requiredRule]"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.quantity"
            label="Enter Quantity"
            type="number"
            :readonly="isReadonly"
            :rules="[numberFieldRequired]"
          />

          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.amount"
            label="Enter Amount"
            type="text"
            step="0.01"
            @blur="formatAmount"
            @change="formatAmount()"
            @keypress="onlyNumberKey"
          />

          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.salesStatus"
            :options="salesStatusList"
            label="Select Payment Plans"
            :dense="dense"
            :readonly="isReadonly"
            :rules="[requiredRule]"
          />
          <div class="q-pa-md">
            <DatePicker
              v-model="useStore.formData.subscriptionDate"
              label="SubScription Date"
              @setDate="setSubscriptionDate"
              ref="subscriptionDateRef"
              :rules="[(val) => !!val || 'Subscriber Image File is required']"
            />
          </div>
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
      <q-step
        :name="2"
        :title="$q.screen.lt.md ? '' : 'Payment Evidence'"
        icon="person"
      >
        <div v-if="$q.screen.lt.md">
          <p>Payment Evidence</p>
          <hr />
        </div>
        <q-form @submit.prevent="submitForm" ref="paymentEvidencefoForm">
          <div class="row">
            <div class="cols-6 col-12">
              <div class="row">
                <div class="col-8">
                  <q-file
                    bottom-slots
                    filled
                    v-model="useStore.formData.paymentEvidence"
                    label="Upload Payment Evidence"
                    clearable
                    accept=".jpg,.jpeg,.png"
                    @update:model-value="validatePaymentEvidenceFile"
                    :rules="[
                      (val) => !!val || 'Payment Evidence File is required',
                      (val) =>
                        (val && val.size < 2000000) ||
                        'Payment Evidence File must be < 2MB',
                    ]"
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
                    v-if="previewEvidenceUrl"
                    :src="previewEvidenceUrl"
                    spinner-color="primary"
                    style="width: 100%; height: 50%"
                  />
                </div>
              </div>
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
              <q-btn @click="step = 1" label="Back" />
              <q-btn
                v-if="showButton"
                type="submit"
                label="Add Amount"
                color="primary"
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
import { ref, computed, nextTick } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import { useSubscriptionStore } from "src/stores/subscriptionStore";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import HeaderPage from "src/components/HeaderPage.vue";
import { isRequired, inputFieldRequired } from "src/validation/validation";
import DatePicker from "src/components/DatePicker.vue";

export default {
  components: {
    HeaderPage,
    DatePicker,
  },
  name: "ProductTypeFormDialog",

  data() {
    const useStore = useSubscriptionStore();
    const router = useRouter();
    const $q = useQuasar();
    const { t } = useI18n();
    const pageName = computed(() => t("subscription.pagename"));
    const hint = computed(() => t("subscription.maintain.hint"));
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
    const step = ref(1);

    const file = ref(null);
    const previewEvidenceUrl = ref(null);
    const imgError = ref(null);

    return {
      file,
      previewEvidenceUrl,
      imgError,
      dialogWidth,
      dialogHeight,
      clients: [],
      allClients: [],
      userEmail,
      headers,
      salesStatusList: [],
      dense: true,
      isReadonly: true,
      pageName,
      hint,
      requiredRule: (value) => isRequired(value),
      inputFieldRule: (value) => inputFieldRequired(value),
      productTypes: [],
      useStore,
      router,
      $q,
      balanceAmount: 0.0,
      productList: [],
      showButton: true,
      step,
    };
  },

  watch: {
    step: {
      async handler(newVal, oldVal) {
        await nextTick();

        const subscriptionDateEl = this.$refs.subscriptionDateRef;
        if (subscriptionDateEl) {
          subscriptionDateEl.onChangeDate(
            this.useStore.formData.subscriptionDate
          );
        }
      },
    },
  },
  methods: {
    setSubscriptionDate(value) {
      this.useStore.formData.subscriptionDate = value;
    },

    validateInfo() {
      if (this.$refs.productInfoForm.validate()) {
        this.step = 2;
      }
    },
    onlyNumberKey(e) {
      const charCode = e.which ? e.which : e.keyCode;
      // Allow only 0-9 and dot (.)
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        e.preventDefault();
      }
    },
    formatAmount() {
      let cleanAmount = this.useStore.formData.amount;
      try {
        cleanAmount = cleanAmount.replace(/,/g, "");
        this.useStore.formData.amount = cleanAmount;
      } catch (e) {
        console.log("Error >>>>>", e);
      }

      if (this.useStore.formData.amount) {
        let value = parseFloat(
          this.useStore.formData.amount.toString().replace(/,/g, "")
        );
        this.useStore.formData.amount = value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });
      }
    },

    loadUserClients() {
      const requestParam = {
        params: {
          isAnAffilate: true,
          status: "A",
        },
      };
      try {
        axios
          .get(path.CLIENT_SEARCH, requestParam, this.headers)
          .then((response) => {
            this.clients = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            }));

            this.allClients = this.clients;
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    submitForm() {
      if (this.$refs.paymentEvidencefoForm.validate()) {
        let data = Object.assign({}, this.useStore.formData);
        data.amount = data.amount.replace(/,/g, "");
        data.createdBy = this.userEmail;
        const record = new FormData();
        for (let key in data) {
          record.append(key, data[key]);
        }

        const promise = axios.post(
          path.SUBSCRIPTION_ADDPAYMENT,
          record,
          this.headers
        );

        promise
          .then((response) => {
            const result = response.data;
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

            this.router.push("/subscription");
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

    loadSaleStatus() {
      axios
        .get(path.SALESSTATUS_SEARCH)
        .then((response) => {
          console.log(">>>>>sales status response>>>>>>>", response.data.data);
          this.salesStatusList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    cancel() {
      this.useStore.reload = false;
      this.router.push("/subscription");
    },

    validatePaymentEvidenceFile(files) {
      this.imgError = null;
      this.previewEvidenceUrl = null;

      const f = files[0] || files;
      console.log(">>>>>>>file >>>>>>>>>>", f);
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
        this.previewEvidenceUrl = URL.createObjectURL(f);
        console.log(
          ">>>>>this.previewEvidenceUrl>>>>>>>",
          this.previewEvidenceUrl
        );
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
        email: this.userEmail,
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
      .get(path.GENDER_SEARCH_ALL)
      .then((response) => {
        this.genderList = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    this.loadUserClients();
    this.loadSaleStatus();

    this.balanceAmount =
      parseFloat(this.useStore.formData.subscribedProduct.amount) *
        parseFloat(this.useStore.formData.quantity) -
      parseFloat(this.useStore.formData.totalAmount);
    console.log("Balance amount at the updated >>>>>>", this.balanceAmount);
    this.useStore.formData.amount = this.balanceAmount;
    this.formatAmount();

    if (this.balanceAmount <= 0) {
      this.showButton = false;
    } else {
      this.showButton = true;
    }
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
  },
  updated() {
    this.balanceAmount =
      parseFloat(this.useStore.formData.subscribedProduct.amount) *
        parseFloat(this.useStore.formData.quantity) -
      parseFloat(this.useStore.formData.totalAmount);
    console.log("Balance amount at the updated >>>>>>", this.balanceAmount);
    this.useStore.formData.amount = this.balanceAmount;
    this.formatAmount();

    if (this.balanceAmount <= 0) {
      this.showButton = false;
    } else {
      this.showButton = true;
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
