<template>
  <q-page padding>
    <q-card
      class="card-flex-display" 
    > 
       <q-card-section>
        <div class="row">
          <div class="col-8 text-h6">Uuser Pofile</div>
          <div v-if="imageFile" class="col-4" style="display: flex; justify-content: flex-end">
                  <img :src="imageFile" alt="Preview" style="max-width: 100px" width="150px"  height="100px" />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.payerId"
            :options="orgUsers"
            label="Select Member" 
            @update:model-value="loadUserImage"
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
           <q-select
            filled
            bottom-slots
            v-model="formData.paymentMode"
            :options="paymentModes"
            label="Select Payment Mode" 
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
            label="Search"
            @click="searchAttendanceData"
            v-close-popup
          />
          <q-btn
            label="Download"
            color="secondary"
            @click="downloadReport"
            size="md"
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="User Outstanding Payments"
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:selected="selected"
      > 
        <template v-slot:top>
          <q-label>User Payment Report</q-label>
          <q-space /> 
        </template> 
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref } from "vue"; 
import path from "src/router/urlpath";
import { format } from 'date-fns';
export default {
   
  data() {
    const headers = SessionStorage.getItem("headers"); 
    const profile = LocalStorage.getItem("turnelParams");
    const userEmail = ""; 
    const columns = [
      {
        name: "userName",
        required: false,
        label: "User",
        align: "left",
        field: (row) =>
          row.payerId.last_name +
          " " +
          row.payerId.first_name +
          " " +
          row.payerId.middle_name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "description",
        align: "left",
        label: "Description",
        field: (row) => row.description, 
        sortable: true,
      },
      {
        name: "amount",
        align: "left",
        label: "Amount",
        field: (row) => row.amount,
        sortable: true,
      },
      {
        name: "payemntDate",
        align: "left",
        label: "Payment Date",
        field: (row) => format(row.paymentDate, 'yyyy-MM-dd'),
        sortable: true,
      }, 
      {
        name: "organisation",
        align: "left",
        label: "Organisation",
        field: (row) => row.organisation.name,
        sortable: true,
      },
       
    ]; 
    const rows = ref([]);
    const selected = ref([]);
    const formData = ref({});

    return {  
      selected,
      columns,
      rows,
      userEmail,
      headers, 
      formData,
      profile,
      dense:true, 
      orgUsers:[], 
      paymentModes:[], 
      paymentTypes:[],
      imageFile:null,
    };
  },
  methods: {
     
    searchAttendanceData() {
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
        console.log(">>>>>this.formData.payerId.values>>>>>>>>",this.formData.payerId)
         if(this.formData.payerId != null && this.formData.payerId.value != null &&  this.formData.payerId.value != ""){
          requestParams["params"]["payerId"] = this.formData.payerId.value
        }
         if(this.formData.paymentType != null && this.formData.paymentType.value != null &&  this.formData.paymentType.value != ""){
          requestParams["params"]["paymentType"] = this.formData.paymentType.value
        }
         if(this.formData.paymentMode != null && this.formData.paymentMode.value != null &&  this.formData.paymentMode.value != ""){
          requestParams["params"]["paymentMode"] = this.formData.paymentMode.value
        } 
      try {
        console.log(">>>>>requestParam 11111111111s>>>>>>>>",requestParams)
        const promise = axios.get(
          path.USR_PAYMENT_TRANSACTION_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log("response data>>>>>>>", response.data);
            this.rows = response.data.data;  
            this.selected = [];
          })
          .catch((error) => {
             
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    downloadReport(){ 
           const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
          if(this.formData.payerId != null && this.formData.payerId.value != null &&  this.formData.payerId.value != ""){
          requestParams["params"]["payerId"] = this.formData.payerId.value
        }
         if(this.formData.paymentType != null && this.formData.paymentType.value != null &&  this.formData.paymentType.value != ""){
          requestParams["params"]["paymentType"] = this.formData.paymentType.value
        }
         if(this.formData.paymentMode != null && this.formData.paymentMode.value != null &&  this.formData.paymentMode.value != ""){
          requestParams["params"]["paymentMode"] = this.formData.paymentMode.value
        } 
      try { 
        const promise = axios.get(
          path.USR_PAYMENT_TRANSACTION_REPORT,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response 
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

          // Create a URL for the Blob (useful for download or preview)
          const blobUrl = URL.createObjectURL(blob);

          // Create a link element to trigger the download
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'example.pdf'; // Set the filename for download
          a.textContent = 'Download File';
          document.body.appendChild(a);
          a.click();
            
          })
          .catch((error) => {
             
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
     loadUserImage(userObj){
      console.log(">>>>>>>inside loadUserImage>>>>>>>>>")
       const requestParam = {
        params: {
          userId: userObj.value, 
        },
      };  
      const promise =  axios.get(
          path.USER_IMAGE,
          requestParam,
          this.headers
        );  
         promise
          .then((response) => {
 
            this.imageFile = "data:image/jpeg;base64," + response.data.data.imageByte;
          })
          .catch((error) => {
            console.log(error);
          }); 
    },
     
    
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("beforeMount");
    console.log(">>>>>>>>>user Email >>>>>", this.userEmail);
  },
 
 mounted() {
    console.log(">>>>>>>>>mounted>>>>>>>>>>");
    try {
      console.log(">>>>>>this.profile>>>>>",this.profile)
      const requestParams = {
        params: {
          client: this.profile.client,
          organisation: this.profile.organisation,
        },
      };
      const promise = axios.get(
        path.ORGUSER_SEARCH,
        requestParams,
        this.headers
      );
      console.log(">>>>>>>>promise>>>>>>>", promise);
      promise
        .then((response) => {
          console.log(">>>>>>>>>>>>response.data.data>>>>>>>>>>>>>>>>",response.data.data)
          this.orgUsers = response.data.data.map((option) => ({
            label: option.userId.last_name +
          " " +
          option.userId.first_name +
          " " +
          option.userId.middle_name,
            value: option.userId.id,
          }));
        })
        .catch((error) => {
          console.log(error);
        });

      const paymentModePromise = axios.get(
        path.PAYMENTMODE_SEARCH,
        this.headers
      );
      console.log(">>>>>>>>paymentModePromise>>>>>>>", paymentModePromise);
      paymentModePromise
        .then((response) => {
          this.paymentModes = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          console.log("paymentModes>>>>>>>>>", this.paymentModes);
        })
        .catch((error) => {
          console.log(error);
        });

        axios
        .get(path.PAYMENTTYPE_SEARCH, requestParams, this.headers)
        .then((response) => {
          console.log("Payment Type Response >>>>>>>>>>>>", response.data); 
          this.paymentTypes = response.data.data.map((option) => ({
            label: option.name,
            value: option.id,
          }));
          console.log("this.Payment Type >>>>>>>>>>>>", this.PaymentTypes);
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });

    } catch (error) {
      console.error("Error:", error);
    }
  },
  updated() {},
};
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #0c0144
    -webkit-text-fill-color: white

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
  tbody tr:nth-child(even)
</style>
