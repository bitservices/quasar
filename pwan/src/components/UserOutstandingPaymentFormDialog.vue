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
        <div class="row">
          <div
            v-if="imageFile"
            class="col-4"
            style="display: flex; justify-content: flex-center"
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
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.userId"
            :options="orgUsers"
            label="Select Member"
            @update:model-value="onChangeUser"
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.paymentType"
            :options="paymentTypes"
            label="Select Payment Type"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.openingDebit"
            label="Enter OPening Debit"
            type="number"
            step="0.01"
          />

          <q-input
            filled
            bottom-slots
            v-model="formData.currentDebit"
            label="Enter Current Debit"
            type="number"
            step="0.01"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.year"
            :options="years"
            label="Select Year"
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

export default {
  name: "OrgAnnualPaymentFormDialog",
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
    console.log(">>>>>>>profile>>>>>>>>",profile)
    const headers = SessionStorage.getItem("headers");

    const formData = ref({
      userId: "",
      openingDebit: 0.0,
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
      orgUsers: [],
      dense: true,
      profile,
      headers,
      imageFile: null,
      years: [],
      paymentTypes:[],
    };
  },
  methods: {
    saveRecord() {
      console.log(">>>>>>>thisis inside handle Save,", this.formData.paymentType.value);
      this.formData.paymentType = this.formData.paymentType.value;
      this.formData.client = this.profile.client;
      this.formData.organisation = this.profile.organisation;
      this.formData.createdBy = this.profile.email;
      this.formData.year = this.formData.year.value;
      this.formData.userId = this.formData.userId.value; 

      //this.onClick(formData.value); 
      this.$emit("formDataSubmitted", this.formData);
      this.showDialog = true;
      console.log(this.showDialog);
    },
    onChangeUser(value) {
      console.log(value);
      this.imageFile = "data:image/jpeg;base64," + value.imageSrc;
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
    console.log("mounted>>>>>>>>>>>>",this.profile);
    const requestParams = {
      params: {
        client: this.profile.client,
        organisation: this.profile.organisation,
      },
    };
    axios
      .get(path.ORGUSER_SEARCH, requestParams, this.headers)
      .then((response) => {
        console.log("organisation Users>>>>>>>", response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.orgUsers = response.data.data.map((option) => (
          {
          label:
            option.userId.last_name +
            " " +
            option.userId.first_name +
            " " +
            option.userId.middle_name,
          value: option.userId.id,
          imageSrc: option.userId.imageByte,
        }));
        console.log("orgUsers>>>>>>>>>", orgUsers);
      })
      .catch((error) => {}); 
     
    axios
      .get(path.PAYMENTTYPE_SEARCH, requestParams, this.headers)
      .then((response) => {
        console.log("Payment Type Response >>>>>>>>>>>>", response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.paymentTypes = response.data.data.map((option) => ({
          label: option.name,
          value: option.id,
        }));
        console.log("this.Payment Type >>>>>>>>>>>>", this.paymentTypes);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });


    axios
      .get(path.ORG_ANNUAL_PAYMENT_YEARS, requestParams, this.headers)
      .then((response) => {  
        const currentYear = new Date().getFullYear()  
        let hasCuurentYear = false

        for (let i = 0; i < response.data.data.length; i++) {
          console.log(response.data.data[i]);
          if(response.data.data[i]['year']==currentYear){
            hasCuurentYear = true
          }
        }   

        if(!hasCuurentYear){ 
          
          response.data.data.push({"year":currentYear})  
        } 
        this.years = response.data.data.map((option) => ({
          label: option.year,
          value: option.year,
        }));
           
      })
      .catch((error) => {});
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
    this.formData = { paymentType: "", amount: "" };
  },
  updated() {
    const headers = SessionStorage.getItem("headers");
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
        const promise = axios.get(this.urlLink, requestParams, headers);
        console.log(">>>>>>>>>>promise>>>>>>>>", promise);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(">>>>>>>>result>xxxxxxxxxx>>>>>>", result.data);
            if (result.success) {
              this.formData = result.data[0];
              this.formData.paymentType = {
                value: result.data[0].paymentType.id,
                label: result.data[0].paymentType.name,
              };

               this.formData.userId = {
                value: result.data[0].userId.id,
                label: result.data[0].userId.last_name + " "+result.data[0].userId.first_name + result.data[0].userId.middle_name ,
                imageSrc: result.data[0].userId.imageByte,
              };
              this.onChangeUser(result.data[0].userId);

            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      this.formData = { paymentType: "", amount: 0.0 };
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
