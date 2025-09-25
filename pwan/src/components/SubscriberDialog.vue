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
        <q-form>
          <div class="page-container">
            <q-input
              filled
              bottom-slots
              v-model="subscriberData.lastName"
              label="Last Name"
              :dense="dense"
              :rules="[requiredRule]"
            />
            <q-input
              filled
              bottom-slots
              v-model="subscriberData.firstName"
              label="First Name"
              :dense="dense"
              :rules="[requiredRule]"
            />
            <q-input
              filled
              bottom-slots
              v-model="subscriberData.middleName"
              label="Middle Name"
              :dense="dense"
            />
            <q-select
              filled
              bottom-slots
              v-model="subscriberData.gender"
              :options="genderList"
              label="Select Gender"
              :dense="dense"
            />
            <q-input
              filled
              bottom-slots
              v-model="subscriberData.phoneNumber"
              label="Subscriber Phone Number"
              :dense="dense"
              :rules="[requiredRule]"
            />
            <q-input
              filled
              bottom-slots
              v-model="subscriberData.emailAddress"
              label="Subscriber Email"
              :readonly="isReadonly"
              :dense="dense"
              :rules="[requiredRule]"
            />
            <div class="q-pa-md">
              <DatePicker
                v-model="subscriberData.dateOfBirth"
                label="Date of Birth"
                @setDate="setDateOfBirth"
                ref="subscriberBirthDate"
              />
            </div>

            <div class="row">
              <div class="col-8">
                <q-file
                  bottom-slots
                  filled
                  v-model="subscriberData.imageByte"
                  @update:model-value="onFileChange"
                  label="User Image"
                >
                  <template v-slot:append>
                    <q-icon name="attachment" />
                  </template>
                </q-file>
              </div>
              <div
                v-if="imageFile"
                class="col-4"
                style="display: flex; justify-content: flex-end"
              >
                <img
                  :src="imageFile"
                  alt="Preview"
                  style="max-width: 100px"
                  width="150px"
                  height="100px"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-8">
                <q-file
                  bottom-slots
                  filled
                  v-model="subscriberData.signature"
                  label="Subscrimer signature"
                >
                  <template v-slot:append>
                    <q-icon name="attachment" />
                  </template>
                </q-file>
              </div>
              <div
                v-if="signature"
                class="col-4"
                style="display: flex; justify-content: flex-end"
              >
                <img
                  :src="signature"
                  alt="Preview"
                  style="max-width: 100px"
                  width="150px"
                  height="100px"
                />
              </div>
            </div>
            <q-select
              filled
              bottom-slots
              v-model="subscriberData.maritalStatus"
              :options="maritalStatusList"
              label="Select Marital Status"
              :dense="dense"
            />
            <q-select
              filled
              bottom-slots
              v-model="subscriberData.occupation"
              :options="occupationList"
              label="Select Occupation"
              :dense="dense"
            />

            <q-input
              filled
              bottom-slots
              v-model="subscriberData.address"
              label="Street"
              type="textarea"
              rows="2"
              maxlength="1000"
            />

            <q-select
              filled
              bottom-slots
              v-model="subscriberData.country"
              :options="countries"
              label="Select Country"
              @update:model-value="handleCountryUpdate"
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
              v-model="subscriberData.state"
              :options="stateList"
              label="Select State"
              @update:model-value="handleStateUpdate"
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
              v-model="subscriberData.county"
              :options="counties"
              label="Select County"
              :dense="dense"
              :rules="[requiredRule]"
              use-input
              input-debounce="200"
              clearable
              @filter="filterCounties"
            />
            <q-input type="hidden" v-model="nextOfKinData.id" />
            <q-input
              filled
              bottom-slots
              v-model="subscriberData.nextOfKinFullName"
              @keyup="handleInput"
              @keydown.enter="handleEnter"
              placeholder="Search for Next of Kin"
              :dense="dense"
            >
              <template v-slot:append>
                <q-icon
                  name="create"
                  class="cursor-pointer"
                  @click="createNextOfKin"
                />
              </template>
            </q-input>
            <q-select
              filled
              bottom-slots
              v-model="subscriberData.relationShipType"
              :options="relationshipList"
              label="Select RelationShip Type"
              :dense="dense"
            />
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
          <NextOfKinDialog
            v-model="showNextofKinFormDialog"
            @formDataSubmitted="saveNextOfKin"
            label="Next Of Kin"
            :searchValue="nextOfKinSearchValue"
            :action="nextOfKinAction"
            :urlLink="nextOfKinurlLink"
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
              id="closeSubscriberForm"
              rounded
              size="md"
              color="primary"
              label="Cancel"
              v-close-popup
            />
            <q-btn
              label="Create Subscriber"
              color="secondary"
              @click="saveSubScriber"
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
import NextOfKinDialog from "src/components/NextOfKinDialog.vue";

export default {
  components: {
    HeaderPage,
    debug,
    DatePicker,
    NextOfKinDialog,
  },
  name: "SubscriberDialog",
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
    const pageName = computed(() => t("subscriber.pagename"));
    const hint = computed(() => t("subscriber.hint"));
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
    const nextOfKinSearchValue = ref("");
    const nextOfKinAction = ref("");
    const nextOfKinurlLink = ref(path.NEXTOFKIN_SEARCH);
    const subscriberData = ref({
      id: "",
      lastName: "",
      firstName: "",
      middleName: "",
      createdBy: this.userEmail,
    });

    const nextOfKinData = ref({
      id: "",
      lastName: "",
      firstName: "",
      middleName: "",
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
      subscriberData,
      nextOfKinData,
      showDialog,
      form,
      dialogWidth,
      dialogHeight,
      headers,
      dense: true,
      suggestions: [],
      filteredSuggestions: [],
      showSuggestions: false,
      userEmail,
      clients: [],
      productList: [],
      pageName,
      hint,
      allClients: [],
      maritalStatusList: [],
      occupationList: [],
      relationshipList: [],
      countries: [],
      allCountries: [],
      stateList: [],
      allStates: [],
      counties: [],
      allCounties: [],
      imageFile: null,
      signature: null,
      showNextofKinFormDialog: false,
      showMessageDialog: false,
      childRef,
      isDisabled: false,
      nextOfKinSearchValue,
      nextOfKinAction,
      nextOfKinurlLink,
    };
  },
  methods: {
    handleCountryUpdate(value) {
      this.subscriberData.county = { value: "", label: "" };
      this.subscriberData.state = { value: "", label: "" };
      this.handleCountryChange(value);
    },
    handleStateUpdate(value) {
      this.subscriberData.county = { value: "", label: "" };
      this.handleStateChange(value);
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
              value: option.code,
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
      this.subscriberData.amount = selectedItem.amount;
    },
    handleInput() {
      this.filteredSuggestions = [];
      if (
        this.subscriberData.nextOfKinFullName === "" ||
        this.subscriberData.nextOfKinFullName.length < 4
      ) {
        this.showSuggestions = false;
      } else {
        const filter = {
          params: {
            term: this.subscriberData.nextOfKinFullName,
            email: this.userEmail,
          },
        };
        axios
          .get(path.NEXTOFKIN_AUTOCOMPLETER, filter, this.headers)
          .then((response) => {
            console.log(
              ">>>>>>>>>response.data.data>>>>>>>",
              response.data.data
            );
            this.filteredSuggestions = response.data.data.map((option) => ({
              name:
                option.lastName +
                " " +
                option.firstName +
                " " +
                option.middleName,
              email: option.emailAddress,
              id: option.id,
              image: option.imageUrl,
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
      console.log(">>>>>>>value>>>>>>>", value);
      this.subscriberData.nextOfKinFullName = value.name;
      this.nextOfKinData.id = value.id;
      this.showSuggestions = false;
    },
    saveNextOfKin(record) {
      console.log(">>>>>>saving Next of Kin>>>>>>>");
      try {
        const requestData = new FormData();
        for (let key in record) {
          requestData.append(key, record[key]);
        }
        const promise = axios.post(
          path.NEXTOFKIN_CREATE,
          requestData,
          this.headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(
              ">>>>>>>>>result>>>>>>",
              result,
              ">>>result.success>>>>>>",
              result.success
            );
            if (result.success) {
              this.nextOfKinData.id = result.data.id;
              this.subscriberData.nextOfKinFullName =
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
              this.showMessageDialog = true;
            } else {
              this.childRef = {
                message: result.message,
                label: "Error",
                cardClass: "bg-negative text-white error",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal",
              };
              this.showMessageDialog = true;
            }

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
    saveSubScriber() {
      this.subscriberData.country = this.subscriberData.country.value;
      this.subscriberData.state = this.subscriberData.state.value;
      this.subscriberData.county = this.subscriberData.county.value;
      this.subscriberData.gender = this.subscriberData.gender.value;
      this.subscriberData.maritalStatus =
        this.subscriberData.maritalStatus.value;
      this.subscriberData.occupation = this.subscriberData.occupation.value;
      this.subscriberData.relationShipType =
        this.subscriberData.relationShipType.value;
      this.subscriberData.nextOfKin = this.nextOfKinData.id;
      this.subscriberData.createdBy = this.userEmail;
      console.log(">>>>>>this.subscriberData>>>>>>", this.subscriberData);
      this.$emit("formDataSubmitted", this.subscriberData);
      document.getElementById("closeSubscriberForm").click();
      this.showDialog = true;
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

    loadRelationShipTypes() {
      axios
        .get(path.RELATIONSHIPTYPE_SEARCH)
        .then((response) => {
          console.log(
            ">>>>>sales occupationList response>>>>>>>",
            response.data.data
          );
          this.relationshipList = response.data.data.map((option) => ({
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
          console.log(
            "this.handleCountryChange List >>>>>>>>>>>>",
            this.stateList
          );
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    handleStateChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: this.subscriberData.country.value,
          stateCode: selectedItem.value,
        },
      };
      console.log(">>>>handleStateChange requestParams>>>>>", requestParams);
      axios
        .get(path.COUNTY_SEARCH, requestParams, this.headers)
        .then((response) => {
          console.log(">>>response state data.data>>>", response.data);
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

    createNextOfKin() {
      console.log(">>>>>>>>>>>>About to next of Kin>>>>>>>>>>>");
      if (
        this.nextOfKinData.id != "" &&
        this.nextOfKinData.id != null &&
        this.nextOfKinData.id != undefined
      ) {
        console.log(
          "setting the searchValue and action of subscruiber>>>>>>>>"
        );
        this.nextOfKinSearchValue = this.nextOfKinData.id;
        this.nextOfKinAction = "view";
      }
      this.showNextofKinFormDialog = true;
    },
    setDateOfBirth(value) {
      this.subscriberData.dateOfBirth = value;
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
    this.subscriberData = {
      lastName: "",
      createdBy: this.userEmail,
    };
    this.isDisabled = false;
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

    this.loadMaritalStatus();
    this.loadOccupation();
    this.loadRelationShipTypes();
  },
  unmounted() {},
  updated() {
    console.log(
      ">>>>>>update Subscriber this.action>>>>>>>>",
      this.action,
      this.searchValue,
      this.urlLink
    );
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == "edit" || this.action == "view") {
      if (this.action == "view") this.isDisabled = true;
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
            const result = response.data;
            console.log("Subscriber data retrieved >>>>>>>", result.data[0]);
            if (result.success) {
              this.subscriberData = result.data[0];
              this.subscriberData.gender = {
                value: result.data[0].gender.code,
                label: result.data[0].gender.name,
              };
              this.subscriberData.maritalStatus = {
                value: result.data[0].maritalStatus.code,
                label: result.data[0].maritalStatus.name,
              };
              this.subscriberData.occupation = {
                value: result.data[0].occupation.code,
                label: result.data[0].occupation.name,
              };
              this.subscriberData.country = {
                value: result.data[0].country.code,
                label: result.data[0].country.name,
              };
              this.subscriberData.relationShipType = {
                value: result.data[0].relationshipType.code,
                label: result.data[0].relationshipType.name,
              };
              this.nextOfKinData.id = result.data[0].nextOfKin.id;
              this.subscriberData.nextOfKinFullName =
                result.data[0].nextOfKin.lastName +
                " " +
                result.data[0].nextOfKin.firstName +
                " " +
                result.data[0].nextOfKin.middleName;
              this.$refs.subscriberBirthDate.onChangeDate(
                result.data[0].dateOfBirth
              );

              this.subscriberData.state = {
                value: result.data[0].state.code,
                label: result.data[0].state.name,
              };
              this.subscriberData.county = {
                value: result.data[0].county.code,
                label: result.data[0].county.name,
              };

              this.handleCountryChange(this.subscriberData.country);
              this.handleStateChange(this.subscriberData.state);
              this.imageFile =
                "data:image/jpeg;base64," + result.data[0].imageUrl;
              this.signature =
                "data:image/jpeg;base64," + result.data[0].signature;
            }
          })
          .catch((error) => {
            debug(error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      this.subscriberData = {
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
