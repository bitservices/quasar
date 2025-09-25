<template>
  <q-dialog v-model="showDialog" persistent width="1229px" height="600px">
    <q-card
      class="card-flex-display"
      :style="{ width: form.width, height: form.height }"
    >
      <q-card-section class="pwan-blue text-white">
        <HeaderPage :label="pageName" :hint="hint" />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="saveRecord" ref="subscriptionForm">
          <div class="page-container">
            <q-select
              filled
              bottom-slots
              v-model="formData.client"
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
              v-model="formData.subscribedProduct"
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
              v-model="formData.amount"
              label="Enter Subscribed Amount"
              type="text"
              step="0.01"
              @blur="formatAmount"
              @change="formatAmount"
              @keypress="onlyNumberKey"
            />

            <q-select
              filled
              bottom-slots
              v-model="formData.salesStatus"
              :options="salesStatusList"
              label="Select Payment Plans"
              :dense="dense"
              :readonly="isReadonly"
              :rules="[requiredRule]"
            />
            <q-input
              filled
              bottom-slots
              v-model="formData.quantity"
              label="Enter Quantity"
              type="number"
              :readonly="isReadonly"
              :rules="[numberFieldRequired]"
            />
            <div class="q-pa-md">
              <DatePicker
                v-model="formData.subscriptionDate"
                label="SubScription Date"
                @setDate="setSubscriptionDate"
                ref="subscriptionDate"
              />
            </div>
            <q-file
              bottom-slots
              filled
              v-model="formData.paymentEvidence"
              label="Payment Evidence"
            >
              <template v-slot:append>
                <q-icon name="attachment" />
              </template>
            </q-file>

            <q-input type="hidden" v-model="subscriberData.id" />
            <q-input
              filled
              bottom-slots
              v-model="subscriberData.fullName"
              @keyup="handleInput"
              @keydown.enter="handleEnter"
              placeholder="Search for Subscriber"
              :dense="dense"
              :readonly="isReadonly"
              :rules="[inputRequiredRule]"
            >
              <template v-slot:append>
                <q-icon
                  name="create"
                  class="cursor-pointer"
                  @click="createSubscriber"
                />
              </template>
            </q-input>
            <q-list v-if="showSuggestions && filteredSuggestions.length > 0">
              <q-item
                clickable
                v-for="item in filteredSuggestions"
                :key="item.id"
                @click="selectRecord(item)"
              >
                <q-item-section>{{ item.name }}</q-item-section>
                <q-item-section side>
                  <!-- Side content -->
                  <q-item-label caption lines="1">
                    <img :src="item.image" />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <SubscriberDialog
            v-model="showSubscriberFormDialog"
            @formDataSubmitted="saveSubScriber"
            label="Subscriber"
            :searchValue="subscribersearchValue"
            :action="subscriberAction"
            :urlLink="subscriberurlLink"
          />
          <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
          <q-card-actions align="center">
            <q-btn
              id="closeBtn"
              rounded
              size="md"
              color="primary"
              label="Cancel"
              v-close-popup
            />
            <q-btn
              :label="actionLabel"
              color="secondary"
              type="submit"
              size="md"
              rounded
              :disable="isDisabled"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import { ref, computed } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import { useI18n } from "vue-i18n";
import HeaderPage from "src/components/HeaderPage.vue";
import debug from "src/router/debugger";
import DatePicker from "src/components/DatePicker.vue";
import SubscriberDialog from "src/components/SubscriberDialog.vue";
import ResponseDialog from "src/components/ResponseDialog.vue";
import {
  isRequired,
  inputFieldRequired,
  numberInputFieldRequired,
} from "src/validation/validation";

export default {
  components: {
    HeaderPage,
    debug,
    DatePicker,
    SubscriberDialog,
    ResponseDialog,
  },
  name: "SalesTransactionFormDialog",
  props: {
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
    const { t } = useI18n();
    const pageName = computed(() => t("subscription.pagename"));
    const hint = computed(() => t("subscription.hint"));
    const headers = SessionStorage.getItem("headers");
    const userEmail = LocalStorage.getItem("userEmail");

    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + "px";
    const dialogHeight = controlHeight + "px";

    const subscribersearchValue = ref("");
    const subscriberAction = ref("");
    const subscriberurlLink = ref(path.SUBSCRIBER_SEARCH);

    const subscriberData = ref({
      id: "",
      lastName: "",
      firstName: "",
      middleName: "",
    });

    const nextOfKinData = ref({
      id: "",
      lastName: "",
      firstName: "",
      middleName: "",
    });
    const formData = ref({
      createdBy: "",
      salesDate: new Date(),
    });
    const form = ref({
      label: "",
      width: "10px",
      height: "10px",
    });
    const showDialog = ref(false);
    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });

    return {
      formData,
      subscriberData,
      showDialog,
      showSpinner: false,
      form,
      dialogWidth,
      dialogHeight,
      headers,
      dense: true,
      salesStatusList: [],
      paymentStatusList: [],
      suggestions: [],
      filteredSuggestions: [],
      showSuggestions: false,
      userEmail,
      clients: [],
      productList: [],
      pageName,
      hint,
      allClients: [],
      dense: true,
      maritalStatusList: [],
      occupationList: [],
      countries: [],
      allCountries: [],
      stateList: [],
      allStates: [],
      counties: [],
      allCounties: [],
      signature: null,
      imageFile: null,
      showFormDialog: false,
      showMessageDialog: false,
      childRef,
      isReadonly: false,
      balanceAmount: 0.0,
      isDisabled: false,
      requiredRule: (value) => isRequired(value),
      inputRequiredRule: (value) => inputFieldRequired(value),
      numberFieldRequired: (value) => numberInputFieldRequired(value),
      subscribersearchValue,
      subscriberAction,
      subscriberurlLink,
      showSubscriberFormDialog: false,
    };
  },
  methods: {
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
      console.log(">>>>>>>>this.formData.amount>>>>>>>", this.formData.amount);

      const amount = this.formData.amount;
      console.log(">>>>>>>>amount>>>>>>>", amount);
      let cleanAmount = this.formData.amount;
      try {
        cleanAmount = amount.replace(/,/g, "");
        console.log(">>>>>>>>cleanAmount>>>>>>>", cleanAmount);
      } catch (e) {
        console.log("Error >>>>>", e);
      }

      console.log(">>>>>>>>this.balanceAmount>>>>>>>", this.balanceAmount);
      if (parseFloat(cleanAmount) > this.balanceAmount) {
        this.formData.amount = this.balanceAmount;
      }
      if (this.formData.amount) {
        let value = parseFloat(
          this.formData.amount.toString().replace(/,/g, "")
        );
        this.formData.amount = value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });
      }
    },
    saveRecord() {
      console.log(">>>>>inside save record >>>>>>>>>>");
      if (this.$refs.subscriptionForm.validate()) {
        this.showSpinner = true;
        this.formData.client = this.formData.client.value;
        this.formData.subscribedProduct = this.formData.subscribedProduct.value;
        this.formData.paymentPlan = this.formData.salesStatus.value;
        this.formData.subscriber = this.subscriberData.id;
        this.formData.createdBy = this.userEmail;
        this.formData.realtor = this.userEmail;
        this.formData.amount = this.formData.amount.replace(/,/g, "");
        this.$emit("formDataSubmitted", this.formData);
        document.getElementById("closeBtn").click();
        this.showDialog = true;
        this.showSpinner = false;
      }
    },
    filterAffilates(val, update) {
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
            console.log(response.data.data);
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
    handleClientChange(selectedItem) {
      try {
        const requestParam = {
          params: {
            client: selectedItem.value,
          },
        };
        axios
          .get(path.PRODUCTDEF_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log(
              "PRODUCT dEFINITIN Response >>>>>>>>>>>>",
              response.data.data
            );
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.productList = response.data.data.map((option) => ({
              label: option.name,
              value: option.id,
              amount: option.amount,
            }));
            console.log("this.productList >>>>>>>>>>>>", this.productList);
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    handleProductChange(selectedItem) {
      console.log(">>>>>>>product Item >>>>>>>>>", selectedItem);
      this.formData.amount = selectedItem.amount;
      this.balanceAmount = selectedItem.amount;
      this.formatAmount();
    },
    handleInput() {
      console.log(">>>>>calling auto completer>>>>>>>>");
      this.filteredSuggestions = [];
      if (
        this.subscriberData.fullName === "" ||
        this.subscriberData.fullName.length < 4
      ) {
        this.showSuggestions = false;
      } else {
        const filter = {
          params: {
            term: this.subscriberData.fullName,
            email: this.userEmail,
          },
        };
        axios
          .get(path.SUBSCRIBER_AUTOCOMPLETER, filter, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            console.log("search of Subscriber", response.data.data);
            this.filteredSuggestions = response.data.data.map((option) => ({
              name:
                option.lastName +
                " " +
                option.firstName +
                " " +
                option.middleName,
              email: option.email,
              image: option.imageUrl,
              id: option.id,
            }));
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
        // this.filteredSuggestions = this.suggestions.filter((item) =>
        //   item.toLowerCase().includes(this.inputValue.toLowerCase())
        // );
        this.showSuggestions = true;
      }
    },
    handleEnter() {
      if (this.filteredSuggestions.length > 0) {
        this.selectRecord(this.filteredSuggestions[0]);
      }
    },
    selectRecord(value) {
      this.subscriberData.fullName = value.name;
      this.subscriberData.id = value.id;
      this.showSuggestions = false;
    },
    saveSubScriber(record) {
      console.log(">>>>>>saving Next of Kin>>>>>>>");
      try {
        const requestData = new FormData();
        for (let key in record) {
          requestData.append(key, record[key]);
        }

        const promise = axios.post(
          path.SUBSCRIBER_CREATE,
          requestData,
          this.headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(">>>>>>>>>result>>>>>>", result);
            if (result.success) {
              this.subscriberData.id = result.data.id;
              this.subscriberData.fullName =
                result.data.lastName +
                " " +
                result.data.firstName +
                " " +
                result.data.middleName;

              this.childRef = {
                message: result.message,
                label: "Success",
                cardClass: "bg-positive text-white",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal",
              };
            } else {
              this.childRef = {
                message: result.message,
                label: "Error",
                cardClass: "bg-negative text-white error",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal",
              };
            }
            this.showMessageDialog = true;
            // You can access properties of the response data as needed
          })
          .catch((error) => {
            this.childRef = {
              message: error.message,
              label: "Error",
              cardClass: "bg-negative text-white error",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            this.showMessageDialog = true;
          });
      } catch (error) {
        console.error("Error:", error);
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

    loadMaritalStatus() {
      axios
        .get(path.MARITALSTATUS_SEARCH)
        .then((response) => {
          console.log(">>>>>sales status response>>>>>>>", response.data.data);
          this.maritalStatusList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    loadOccupation() {
      axios
        .get(path.OCCUPATION_SEARCH)
        .then((response) => {
          console.log(
            ">>>>>sales occupationList response>>>>>>>",
            response.data.data
          );
          this.occupationList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
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
          console.log(">>>response.data>>>", response.data);
          this.counties = response.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allCounties = this.counties;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    setSubscriptionDate(value) {
      this.formData.subscriptionDate = value;
    },

    createSubscriber() {
      console.log(
        ">>>>>>>>>>>>About to create Subscriber>>>>>>>>>>>",
        this.subscriberData.id
      );

      if (
        this.subscriberData.id != "" &&
        this.subscriberData.id != null &&
        this.subscriberData.id != undefined
      ) {
        console.log(
          "setting the searchValue and action of subscruiber>>>>>>>>"
        );
        this.subscribersearchValue = this.subscriberData.id;
        this.subscriberAction = "view";
      }
      this.showSubscriberFormDialog = true;
      console.log(">>>>>>this.showFormDialog>>>>>>>", this.showFormDialog);
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
    this.isReadonly = false;
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
    this.loadMaritalStatus();
    this.loadOccupation();
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
            id: this.searchValue,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, this.headers);
        promise
          .then((response) => {
            // Extract data from the response
            console.log("response data >>>>>", response.data);
            const result = response.data;
            if (result.success) {
              console.log(">>>>>result.data[0]>>>>>", result.data[0]);
              this.balanceAmount =
                parseFloat(result.data[0].subscribedProduct.amount) -
                parseFloat(result.data[0].totalAmount);
              console.log("Balance amount >>>>>>", this.balanceAmount);

              this.formData = result.data[0];
              this.formData.client = {
                value: result.data[0].client.code,
                label: result.data[0].client.name,
              };
              this.formData.subscribedProduct = {
                label: result.data[0].subscribedProduct.name,
                value: result.data[0].subscribedProduct.id,
              };
              this.subscriberData.id = result.data[0].subscriber.id;
              this.subscriberData.fullName =
                result.data[0].subscriber.lastName +
                " " +
                result.data[0].subscriber.firstName +
                " " +
                result.data[0].subscriber.middleName;
              this.formData.salesStatus = {
                value: result.data[0].paymentPlans.code,
                label: result.data[0].paymentPlans.name,
              };
              this.formData.amount = this.balanceAmount;
              if (this.balanceAmount <= 0) {
                this.isDisabled = true;
                this.formData.amount = 0.0;
              }
              this.formatAmount();
              this.isReadonly = true;
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
        createdBy: this.userEmail,
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
