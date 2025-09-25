<template>
  <q-page padding>
    <HeaderPage :label="pageName" :hint="hint" />

    <div v-if="$q.screen.lt.md">
      <p>Subscribed product Detail</p>
      <hr />
    </div>

    <q-form ref="productInfoForm">
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
        v-model="useStore.formData.totalAmount"
        label="Enter Amount"
        type="text"
        step="0.01"
        @blur="formatAmount"
        @change="formatAmount()"
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

      <BaseTable
        ref="tableRef"
        :columns="columns"
        :data="rows"
        :rowKey="(row) => row.id"
        :selection="selection"
        :title="title"
        :pagination="pagination"
        :max-height-offset="120"
      >
        <template #top-right>
          <q-space />
          <q-btn
            rounded
            color="blue"
            label="Payment Evidence"
            size="sm"
            @click="viewEvidence"
          />
          <q-btn
            rounded
            color="red"
            label="GET Receipt"
            size="sm"
            @click="getReceipt"
          />
        </template>
      </BaseTable>

      <div class="row justify-end q-gutter-sm">
        <q-btn size="md" color="negative" label="Back" @click="cancel" />
      </div>
    </q-form>
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
import BaseTable from "src/components/consumables/BaseTable.vue";
import { format } from "date-fns";

export default {
  components: {
    HeaderPage,
    DatePicker,
    BaseTable,
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

    const selection = ref("single");

    const file = ref(null);
    const previewEvidenceUrl = ref(null);
    const imgError = ref(null);
    const rows = ref([]);

    const columns = [
      {
        name: "amount",
        align: "center",
        label: "Amount Paid so Far",
        field: (row) =>
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(row.amount),
        sortable: true,
      },

      {
        name: "paymentDate",
        align: "center",
        label: "Payment Date",
        field: (row) => format(row.paymentDate, "yyyy-MM-dd"),
        sortable: true,
      },
      {
        name: "paymentStatus",
        align: "center",
        label: "Status",
        field: (row) => row.paymentStatus.name,
        sortable: true,
      },
    ];

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
      columns,
      rows,
      selection,
    };
  },

  methods: {
    viewEvidence() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        console.log(">>>>>>>>>>record>>>>>>>>>>>>>>", record);
        this.useStore.formData.payment = record;
        this.router.push("/subscription/viewpaymentevidence");
      } else {
        this.$q.notify({
          type: "negative",
          message: "No Record Selected",
          position: "center",
        });
      }
    },
    getReceipt() {
      if (this.$refs.tableRef.selected.length > 0) {
        const record = Object.assign({}, this.$refs.tableRef.selected[0]);
        if (record.paymentStatus.code != "A") {
          this.$q.notify({
            type: "negative",
            message:
              "Receipt not yet Available as the Transaction has not been Approved",
            position: "center",
          });
          return;
        }
        //SUBSCRIPTION_PMT_RECEIPT

        try {
          const requestParam = {
            params: {
              id: record.id,
            },
          };
          axios
            .get(path.SUBSCRIPTION_PMT_RECEIPT, requestParam, this.headers)
            .then((response) => {
              console.log(response.data);
              const result = response.data.data;
              console.log(">>>>>>>>>result>>>>>>>>>>>>", result);
              this.useStore.formData.payment = result;
              this.router.push("/subscription/getpaymentreceipt");
            })
            .catch((error) => {
              console.error("Error fetching options:", error);
            });
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      } else {
        this.$q.notify({
          type: "negative",
          message: "No Record Selected",
          position: "center",
        });
      }
    },
    formatAmount() {
      let cleanAmount = this.useStore.formData.totalAmount;
      try {
        cleanAmount = cleanAmount.replace(/,/g, "");
        this.useStore.formData.totalAmount = cleanAmount;
      } catch (e) {
        console.log("Error >>>>>", e);
      }

      if (this.useStore.formData.totalAmount) {
        let value = parseFloat(
          this.useStore.formData.totalAmount.toString().replace(/,/g, "")
        );
        this.useStore.formData.totalAmount = value.toLocaleString("en-US", {
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
    this.formatAmount();
    this.rows = this.useStore.formData.subscriptionPayments;
    if (
      this.useStore.formData.subscriptionDate &&
      this.$refs.subscriptionDateRef
    ) {
      this.$refs.subscriptionDateRef.onChangeDate(
        this.useStore.formData.subscriptionDate
      );
      this.$refs.subscriptionDateRef.disabled = true;
    }
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
  },
  updated() {
    this.formatAmount();
    this.rows = this.useStore.formData.subscriptionPayments;
    if (
      this.useStore.formData.subscriptionDate &&
      this.$refs.subscriptionDateRef
    ) {
      this.$refs.subscriptionDateRef.onChangeDate(
        this.useStore.formData.subscriptionDate
      );
      this.$refs.subscriptionDateRef.disabled = true;
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
