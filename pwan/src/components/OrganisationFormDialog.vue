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
          <q-input
            filled
            bottom-slots
            v-model="formData.code"
            label="Code"
            :dense="dense"
            :readonly="isReadonly" 
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.name"
            label="Name"
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.client"
            :options="clients"
            label="Select client" 
            :dense="dense"
            :readonly="isReadonly"
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
          />
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
          />
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
import { LocalStorage,SessionStorage } from "quasar";
import { onUnmounted, ref } from "vue";
import axios from "axios";
import path from "src/router/urlpath"; 
export default {
  name: "OrganisationFormDialog",
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
    const userEmail = LocalStorage.getItem("userEmail");
    const headers = SessionStorage.getItem("headers");
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
      clients: [],
      userEmail,
      headers,
      countries: [],
      stateList: [],
      counties: [],
      dense:true,      
      isReadonly: false,
    };
  },
  methods: {
    saveRecord() {   
      this.formData.client = this.formData.client.value;   
      this.formData.county = this.formData.county.value;
      this.formData.country = this.formData.country.value;
      this.formData.state = this.formData.state.value;
      this.formData.status = this.formData.status.code; 
      this.$emit("formDataSubmitted", this.formData);
      this.showDialog = true;
      console.log(this.showDialog);
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
        console.log("country Response >>>>>>>>>>>>", response.data); 
        this.clients = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        console.log("this.countries >>>>>>>>>>>>", this.clients);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

      axios
      .get(path.COUNTRY_ALL)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.countries = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })

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
        this.isReadonly = true
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
              }
              this.formData.country = {
                value: result.data[0].country.code,
                label: result.data[0].country.name,
              }
              this.formData.state = {
                value: result.data[0].state.code,
                label: result.data[0].state.name,
              };
              this.formData.county = {
                value: result.data[0].county.code,
                label: result.data[0].county.name,
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
      this.isReadonly = false
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
