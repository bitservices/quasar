<template>
  <q-page padding>
    <HeaderPage :label="pageName" :hint="hint" />
    <q-stepper v-model="step" flat animated>
      <!-- Step 1 -->
      <q-step
        :name="1"
        :title="$q.screen.lt.md ? '' : 'Organisation Detail'"
        icon="person"
      >
        <div v-if="$q.screen.lt.md">
          <p>Organisation Detail</p>
          <hr />
        </div>

        <q-form
          @submit.prevent="validateOrganisationInfo"
          ref="organisationForm"
        >
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.code"
            label="Code"
            :dense="dense"
            :readonly="isReadonly"
            :rules="[inputRequiredRule]"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.name"
            label="Name"
            :dense="dense"
            :rules="[inputRequiredRule]"
          />
          <q-select
            filled
            bottom-slots
            v-model="useStore.formData.client"
            :options="clients"
            label="Select client"
            :dense="dense"
            :readonly="isReadonly"
            use-input
            input-debounce="200"
            clearable
            @filter="filterClients"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.website"
            label="website"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.slogan"
            label="slogan"
            :dense="dense"
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
            label="address"
            type="textarea"
            rows="3"
            maxlength="300"
            counter
            :rules="[inputRequiredRule]"
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
        :title="$q.screen.lt.md ? '' : 'Meetings & Location'"
        icon="person"
      >
        <div v-if="$q.screen.lt.md">
          <p>Meetings & Location Settings</p>
          <hr />
        </div>
        <q-form @submit.prevent="submitForm" ref="meetingForm">
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.longitude"
            label="longitude"
            :dense="dense"
            type="number"
          />

          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.latitude"
            label="latitude"
            :dense="dense"
            type="number"
          >
            <template v-slot:append>
              <q-icon name="edit" @click="getPosition" class="cursor-pointer" />
            </template>
          </q-input>
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.radius"
            label="radius"
            :dense="dense"
            type="number"
          />

          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.meetingDays"
            label="Meeting Days"
            type="textarea"
            rows="2"
            maxlength="200"
            counter
            :readonly="dense"
          >
            <template v-slot:append>
              <q-icon
                name="edit"
                @click="loadMeetingDays(useStore)"
                class="cursor-pointer"
              />
            </template>
          </q-input>
          <q-checkbox
            v-model="useStore.formData.allowSeatAllocation"
            label="Allowed Seet Allocation"
            color="primary"
          />
          <q-checkbox
            v-model="useStore.formData.validateMeetingStartTime"
            label="Validate Meeting Start Time"
            color="primary"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.reservedSeats"
            label="Number of Seats For Reservation"
            :dense="dense"
            type="number"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.seatPrefix"
            label="Seat Prefix"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.seatSufix"
            label="Seat Surffix"
            :dense="dense"
          />
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

      <!--<div class="row justify-center q-gutter-sm">
            <q-btn
              id="closeBtn"
              rounded
              label="Close"
              icon="close"
              @click="cancel"
              class="pwan-blue top-margin"
            />
            <q-btn
              :label="actionLabel"
              rounded
              type="submit"
              icon="save"
              class="pwan-button top-margin"
            />
          </div>-->
    </q-stepper>
    <div v-if="showMeetingDialog">
      <q-dialog v-model="showMeetingDialog" width="1229px" height="600px">
        <q-card style="width: 1229px">
          <q-card-actions align="right">
            <q-btn
              rounded
              color="green"
              icon="add"
              size="sm"
              @click="addMeetingDays"
            />
            <q-btn
              rounded
              color="red"
              icon="delete"
              size="sm"
              @click="removeMeetingDays"
            />
          </q-card-actions>
          <q-card-section class="q-pt-none">
            <div v-if="meetingDays" class="row full-width" ref="meetingDaysDiv">
              <div v-for="(item, index) in meetingDays" :key="index">
                <div class="row meetingdays">
                  <div class="col-3">
                    <q-select
                      filled
                      bottom-slots
                      v-model="item.day"
                      :options="daysOfWeek"
                      label="Select Day"
                      :dense="dense"
                      :ref="'meetingday' + index"
                    />
                  </div>
                  <div class="col-3">
                    <q-input
                      filled
                      bottom-slots
                      v-model="item.meetingName"
                      label="Meeting Name"
                      :dense="dense"
                      :ref="'meetingName' + index"
                    />
                  </div>
                  <div class="col-3">
                    <q-input
                      filled
                      bottom-slots
                      v-model="item.startTime"
                      type="time"
                      label="Start  Time"
                      :dense="dense"
                      :ref="'starttime' + index"
                    />
                  </div>
                  <div class="col-3">
                    <q-input
                      filled
                      bottom-slots
                      v-model="item.endTime"
                      type="time"
                      label="End Time"
                      :dense="dense"
                      :ref="'endtime' + index"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Cancle"
              class="pwan-blue text-white"
              v-close-popup
              rounded
            />
            <q-btn
              @click="saveMeetingDays(useStore)"
              flat
              label="Save"
              class="pwan-button text-white"
              rounded
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import { useOrganisationStore } from "src/stores/organisationStore";
import { useRouter } from "vue-router";
import helper from "src/utils/helper";
import { useQuasar } from "quasar";
import HeaderPage from "src/components/HeaderPage.vue";
import { isRequired, inputFieldRequired } from "src/validation/validation";

export default {
  components: {
    HeaderPage,
  },
  name: "OrganisationFormDialog",

  data() {
    const useStore = useOrganisationStore();
    const router = useRouter();
    const $q = useQuasar();
    const { t } = useI18n();
    const pageName = computed(() => t("organisationform.pagename"));
    const hint = computed(() => t("organisationform.hint"));
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
    const meetingDaysCount = ref(1);
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
      meeting,
      meetingDaysCount,
      showSpinner: false,
      requiredRule: (value) => isRequired(value),
      inputRequiredRule: (value) => inputFieldRequired(value),
      showMeetingDialog: false,
      meetingDays: null,
      daysOfWeek: [
        { value: "Sunday", label: "Sunday" },
        { value: "Monday", label: "Monday" },
        { value: "Tuesday", label: "Tuesday" },
        { value: "Wednesday", label: "Wednesday" },
        { value: "Thursday", label: "Thursday" },
        { value: "Friday", label: "Friday" },
        { value: "Saturday", label: "Saturday" },
      ],
      useStore,
      actionLabel: "Create",
      colourLabel: "posotive",
      router,
      $q,
      step,
      showButton: true,
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
    validateOrganisationInfo() {
      if (this.$refs.organisationForm.validate()) {
        this.step = 2;
      }
    },
    validateAddressInfo() {
      if (this.$refs.addressfoForm.validate()) {
        this.step = 3;
      }
    },
    submitForm() {
      if (this.$refs.meetingForm.validate()) {
        let record = Object.assign({}, this.useStore.formData);
        console.log(">>>>meetingDays >>>>>>", this.useStore.formData);
        let days = this.useStore.formData.meetingDays.replace(/\\/g, "");
        this.useStore.formData.meetingDays = days
          .replace(/\\/g, "")
          .slice(days.indexOf("["), days.indexOf("]") + 1);

        record.client = record.client.value;
        record.county = record.county.value;
        record.country = record.country.value;
        record.state = record.state.value;
        record.createdBy = this.userEmail;

        console.log("record>>>>>>>>", record);
        let promise = "";
        if (this.useStore.mode == "create") {
          record.status = "A";
          promise = axios.post(path.ORGANISATION_CREATE, record, this.headers);
        }
        if (this.useStore.mode == "update") {
          record.status =
            this.useStore.formData.status != null
              ? this.useStore.formData.status.value
              : "I";
          promise = axios.put(path.ORGANISATION_UPDATE, record, this.headers);
        } else if (this.useStore.mode == "activate") {
          console.log(
            "this.useStore.formData >>>>>>>>>>>>>",
            this.useStore.formData
          );
          if (this.useStore.formData.status.value == "A") {
            console.log("calling deactivate >>>>>>>>>>>>>");
            promise = axios.post(
              path.ORGANISATION_DEACTIVATE,
              record,
              this.headers
            );
          } else {
            console.log("calling activating >>>>>>>>>>>>>");
            promise = axios.post(
              path.ORGANISATION_ACTIVATE,
              record,
              this.headers
            );
          }
        }
        console.log(">>>>>>promise>>>>>", promise);

        promise
          .then((response) => {
            const result = response.data;
            console.log(">>>>>>result>>>>>>>>", result);
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

            this.router.push("/organisation");
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
    loadMeetingDays(orgStore) {
      this.showMeetingDialog = true;
      console.log(">>>>>>>this.useeStore>>>>>>>>>>>>", orgStore);
      if (
        orgStore.formData.meetingDays == null ||
        orgStore.formData.meetingDays.trim() == "" ||
        orgStore.formData.meetingDays == "null" ||
        orgStore.formData.meetingDays == "nan"
      ) {
        this.meetingDays = [
          { day: "", meetingName: "", startTime: "", endTime: "" },
        ];
      } else {
        try {
          const meetingDaysStr = orgStore.formData.meetingDays;
          let days = meetingDaysStr.replace(/\\/g, "");

          days = meetingDaysStr
            .replace(/\\/g, "")
            .slice(days.indexOf("["), days.indexOf("]") + 1);
          days = JSON.parse(days);
          this.meetingDays = days;
        } catch (error) {
          console.error("Invalid JSON string:", error);
        }

        //   meetingDays.forEach(obj => {
        //     console.log(obj);
        // });
      }
    },
    saveMeetingDays(orgStore) {
      let meetingDaysArray = [];

      for (let i = 0; i < this.meetingDays.length; i++) {
        console.log("day: ", this.$refs["meetingday" + i][0]);
        console.log("meetingName: ", this.$refs["meetingName" + i][0]);
        console.log("starttime: ", this.$refs["starttime" + i][0]);
        console.log("endtime: ", this.$refs["endtime" + i][0]);

        let day = this.$refs["meetingday" + i][0].modelValue;
        let meetingName = this.$refs["meetingName" + i][0].modelValue;
        let startTime = this.$refs["starttime" + i][0].modelValue;
        let endTime = this.$refs["endtime" + i][0].modelValue;
        let resolvedDay = day.value;
        if (
          day.value == null ||
          day.value == undefined ||
          day.value == "undefined"
        ) {
          resolvedDay = day;
        }
        console.log(
          "day",
          day.value,
          "meetingName",
          meetingName,
          "startTime",
          startTime,
          "endTime",
          endTime
        );
        let meetingObj = {
          day: resolvedDay,
          meetingName: meetingName,
          startTime: startTime,
          endTime: endTime,
        };
        meetingDaysArray.push(meetingObj);
      }
      console.log(">>>>>meetingDaysArray>>>>>>>", meetingDaysArray);
      orgStore.formData.meetingDays = JSON.stringify(meetingDaysArray);

      this.showMeetingDialog = false;
    },
    validateTime() {
      const regex = /^(2[0-3]|[01]?[0-9]):[0-5][0-9]$/; // HH:MM format
      if (regex.test(this.time)) {
        this.submittedTime = this.time; // Set the submitted time if valid
      } else {
        this.submittedTime = "Invalid time format";
      }
    },
    validateTimeRule(val) {
      return (
        /^(2[0-3]|[01]?[0-9]):[0-5][0-9]$/.test(val) ||
        "Time must be in HH:MM format"
      );
    },
    addMeetingDays() {
      if (this.meetingDaysCount < 7) {
        this.meetingDays.push({
          day: "",
          meetingName: "",
          startTime: "",
          endTime: "",
        });
        this.meetingDaysCount++;
      }
    },
    removeMeetingDays() {
      if (this.meetingDaysCount > 0) {
        this.meetingDays.pop();
        this.meetingDaysCount--;
      }
    },
    cancel() {
      this.useStore.reload = false;
      this.router.push("/organisation");
    },
    updateData() {
      this.isReadonly = false;
      this.showButton = true;
      if (this.useStore.mode == "view") {
        this.showButton = false;
      }
      this.actionLabel = this.useStore.mode;
      if (this.useStore.mode == "activate") {
        if (this.useStore.formData.status.value == "A") {
          this.colourLabel = "red";
          this.actionLabel = "De-Activate";
        } else {
          this.colourLabel = "secondary";
        }
      } else {
        this.colourLabel = "secondary";
      }
      if (this.useStore.mode != "create") {
        this.isReadonly = true;
      }
      if (this.useStore.formData.logo) {
        this.previewUrl =
          "data:image/jpeg;base64," + this.useStore.formData.logo;
      } else {
        this.previewUrl = null;
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
    console.log("mounted 1111111", this.useStore.formData);
    const requestParam = {
      params: {
        createdBy: this.userEmail,
      },
    };
    axios
      .get(path.CLIENT_FIND_BY_CREATOR, requestParam, this.headers)
      .then((response) => {
        console.log("client Response >>>>>>>>>>>>", response.data);
        this.clients = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        this.allClients = this.clients;
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    axios.get(path.COUNTRY_ALL).then((response) => {
      // Assuming the response data is an array of objects with 'value' and 'label' properties
      this.countries = response.data.map((option) => ({
        label: option.name,
        value: option.code,
      }));
      this.allCountries = this.countries;
    });

    console.log(">>>>>>>>updated >>>>>>>>>>>>>>>", this.useStore);
    this.updateData();
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
    this.useeStore.formData = { code: "", name: "" };
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
