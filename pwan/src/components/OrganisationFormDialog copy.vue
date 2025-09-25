<template>
  <q-card
    class="card-flex-display"
    :style="{ width: form.width, height: form.height }"
  >
    <q-card-section class="pwan-blue text-white">
      <HeaderPage :label="pageName" :hint="hint" />
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="saveRecord" ref="organisationForm">
        <div class="text-center">
          <q-spinner v-if="showSpinner" color="primary" size="60px" />
        </div>
        <q-input
          filled
          bottom-slots
          v-model="formData.code"
          label="Code"
          :dense="dense"
          :readonly="isReadonly"
          :rules="[inputRequiredRule]"
        />
        <q-input
          filled
          bottom-slots
          v-model="formData.name"
          label="Name"
          :dense="dense"
          :rules="[inputRequiredRule]"
        />
        <q-select
          filled
          bottom-slots
          v-model="formData.client"
          :options="clients"
          label="Select client"
          :dense="dense"
          :readonly="isReadonly"
          use-input
          input-debounce="200"
          clearable
          @filter="filterClients"
        />
        <q-select
          filled
          bottom-slots
          v-model="formData.country"
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
          v-model="formData.state"
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
          v-model="formData.county"
          :options="counties"
          label="Select County"
          :dense="dense"
          :rules="[requiredRule]"
          use-input
          input-debounce="200"
          clearable
          @filter="filterCounties"
        />

        <q-input
          filled
          bottom-slots
          v-model="formData.website"
          label="website"
          :dense="dense"
        />
        <q-input
          filled
          bottom-slots
          v-model="formData.address"
          label="address"
          type="textarea"
          rows="3"
          maxlength="300"
          counter
          :rules="[inputRequiredRule]"
        />
        <q-input
          filled
          bottom-slots
          v-model="formData.longitude"
          label="longitude"
          :dense="dense"
          type="number"
        />

        <q-input
          filled
          bottom-slots
          v-model="formData.latitude"
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
          v-model="formData.radius"
          label="radius"
          :dense="dense"
          type="number"
        />
        <q-input
          filled
          bottom-slots
          v-model="formData.slogan"
          label="slogan"
          :dense="dense"
        />
        <q-input
          filled
          bottom-slots
          v-model="formData.meetingDays"
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
              @click="loadMeetingDays"
              class="cursor-pointer"
            />
          </template>
        </q-input>
        <q-checkbox
          v-model="formData.allowSeatAllocation"
          label="Allowed Seet Allocation"
          color="primary"
        />
        <q-checkbox
          v-model="formData.validateMeetingStartTime"
          label="Validate Meeting Start Time"
          color="primary"
        />
        <q-input
          filled
          bottom-slots
          v-model="formData.reservedSeats"
          label="Number of Seats For Reservation"
          :dense="dense"
          type="number"
        />
        <q-input
          filled
          bottom-slots
          v-model="formData.seatPrefix"
          label="Seat Prefix"
          :dense="dense"
        />
        <q-input
          filled
          bottom-slots
          v-model="formData.seatSufix"
          label="Seat Surffix"
          :dense="dense"
        />

        <div class="row">
          <q-btn
            id="closeBtn"
            rounded
            label="Close"
            icon="close"
            v-close-popup
            class="pwan-blue top-margin full-width"
          />
          <q-btn
            :label="actionLabel"
            rounded
            type="submit"
            icon="save"
            class="pwan-button top-margin full-width"
          />
        </div>
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
                <div
                  v-if="meetingDays"
                  class="row full-width"
                  ref="meetingDaysDiv"
                >
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
                  @click="saveMeetingDays"
                  flat
                  label="Save"
                  class="pwan-button text-white"
                  rounded
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import path from "src/router/urlpath";
import HeaderPage from "src/components/HeaderPage.vue";
import { isRequired, inputFieldRequired } from "src/validation/validation";
export default {
  components: {
    HeaderPage,
  },
  name: "OrganisationFormDialog",
  data() {
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
              this.formData.latitude = position.coords.latitude;
              this.formData.longitude = position.coords.longitude;
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
    saveRecord() {
      if (this.$refs.organisationForm.validate()) {
        console.log(">>>>meetingDays >>>>>>", this.formData);
        let days = this.formData.meetingDays.replace(/\\/g, "");
        this.formData.meetingDays = days
          .replace(/\\/g, "")
          .slice(days.indexOf("["), days.indexOf("]") + 1);
        this.formData.status =
          this.formData.status != null ? this.formData.status.value : "I";
        this.formData.client = this.formData.client.value;
        this.formData.county = this.formData.county.value;
        this.formData.country = this.formData.country.value;
        this.formData.state = this.formData.state.value;
        this.formData.createdBy = this.userEmail;
        this.$emit("formDataSubmitted", this.formData);
        this.showDialog = true;
        document.getElementById("closeBtn").click();
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
          this.allCounties = this.counties;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadMeetingDays() {
      this.showMeetingDialog = true;
      if (
        this.formData.meetingDays == null ||
        this.formData.meetingDays.trim() == "" ||
        this.formData.meetingDays == "null" ||
        this.formData.meetingDays == "nan"
      ) {
        this.meetingDays = [
          { day: "", meetingName: "", startTime: "", endTime: "" },
        ];
      } else {
        try {
          const meetingDaysStr = this.formData.meetingDays;
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
    saveMeetingDays() {
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
      this.formData.meetingDays = JSON.stringify(meetingDaysArray);

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
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
    this.formData = { code: "", name: "" };
  },
  updated() {
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == "edit" || this.action == "view") {
      try {
        this.isReadonly = true;
        const requestParams = {
          params: {
            id: this.searchValue,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, this.headers);
        console.log(">>>>>>>>>>promise>ssssssssss>>>>>>>", promise);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(">>>>>>>>resultsssssssss>>>>>>>", result.data);
            if (result.success) {
              this.formData = result.data[0];
              this.formData.client = {
                value: result.data[0].client.code,
                label: result.data[0].client.name,
              };
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
              this.formData.status = {
                value: result.data[0].status.code,
                label: result.data[0].status.name,
              };
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      this.formData = { code: "", name: "" };
      this.isReadonly = false;
      this.getPosition();
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
