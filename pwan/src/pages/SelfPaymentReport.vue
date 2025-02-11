<template>
  <q-page padding>
    <q-card>
        <q-card-section class="pwan-blue text-white">
          <HeaderPage  
              :label="pageName"
              :hint="hint"  
            />
        </q-card-section>
      </q-card>
    <q-card
      class="card-flex-display" 
    > 
      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.client"
            :options="clients"
            label="Select Client" 
            :dense="dense"
            @update:model-value="handleClientChange"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.organisation"
            :options="organisations"
            label="Select Organisation"
            :dense="dense" 
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.amount"
            label="Enter Amount"
            type="number"
            step="0.01"
          />   
            <DatePicker v-model="selectedFRomData" label="Payment Date From" @setDate="setFromDate"/> - <DatePicker v-model="selectedToData" label="PaymentDate To"  @setDate="setToDate"/>
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="center">
          <q-btn
            rounded
            size="md"
            color="primary"
            label="Search"
            @click="searchData"
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
import { ref, computed } from "vue"; 
import path from "src/router/urlpath";
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n'
import HeaderPage from "src/components/HeaderPage.vue";  
import DatePicker from "src/components/DatePicker.vue"; 
export default {
  components: { 
    HeaderPage, 
    DatePicker,
  },
  data() {
    const { t } = useI18n();
    const pageName = computed(()=> t('selfpaymentereport.pagename'))
    const hint = computed(()=> t('selfpaymentereport.hint'))
    const headers = SessionStorage.getItem("headers"); 
    const userEmail = LocalStorage.getItem("userEmail"); 
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
      profileUserId:null,
      headers, 
      formData, 
      dense:true, 
      clients:[],
      organisations:[],  
      pageName,
      hint,
      selectedFromDate: null,
      selectedToDate: null,
    };
  },
  methods: {
     loadUserClients() {
      try {
        console.log(">>>>>calling LoadUserClients>>>>>>>>>", this.userEmail);
        const requestParam = {
          params: {
            email: this.userEmail,
          },
        };
        axios
          .get(path.ACTIVE_USER_CLIENT_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log("client Response >>>>>>>>>>>>", response.data.data);
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.clients = response.data.data.map((option) => ({
              label: option.client.name,
              value: option.client.code,
            }));
            console.log("this.clients >>>>>>>>>>>>", this.clients);
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
        console.log(">>>>>calling handleClientChange>>>>>>>>>", selectedItem);
        const requestParam = {
          params: {
            client: selectedItem.value,
            email: this.userEmail,
          },
        };
        axios
          .get(path.ACTIVE_ORG_USER_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log(
              "organisations Response >>>>>>>>>>>>",
              response.data.data
            );
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.organisations = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            }));
            console.log("this.organisation >>>>>>>>>>>>", this.organisations);
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    searchData() {
         const requestParams = {
          params: { 
            payerId: this.profileUserId, 
          },
        };
         if(this.formData.client != null && this.formData.client.value != null &&  this.formData.client.value != ""){
          requestParams["params"]["client"] = this.formData.client.value
        }
         if(this.formData.organisation != null && this.formData.organisation.value != null &&  this.formData.organisation.value != ""){
          requestParams["params"]["organisation"] = this.formData.organisation.value
        }
        if(this.formData.amount != null && this.formData.amount != null &&  this.formData.amount != ""){
          requestParams["params"]["amount"] = this.formData.amount
        }
        if(this.selectedFromDate != null && this.selectedFromDate != null &&  this.selectedFromDate != ""){
          requestParams["params"]["fromDate"] = this.selectedFromDate;
        }
        if(this.selectedToDate != null && this.selectedToDate != null &&  this.selectedToDate != ""){
          requestParams["params"]["toDate"] = this.selectedToDate;
        }
         
      try {
        console.log(">>>>>requestParams>>>>>>>>",requestParams)

         
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
            payerId: this.profileUserId, 
          },
        };
         if(this.formData.client != null && this.formData.client.value != null &&  this.formData.client.value != ""){
          requestParams["params"]["client"] = this.formData.client.value
        }
         if(this.formData.organisation != null && this.formData.organisation.value != null &&  this.formData.organisation.value != ""){
          requestParams["params"]["organisation"] = this.formData.organisation.value
        }
        if(this.formData.amount != null && this.formData.amount != null &&  this.formData.amount != ""){
          requestParams["params"]["amount"] = this.formData.amount
        }
         if(this.selectedFromDate != null && this.selectedFromDate != null &&  this.selectedFromDate != ""){
          requestParams["params"]["fromDate"] = this.selectedFromDate;
        }
        if(this.selectedToDate != null && this.selectedToDate != null &&  this.selectedToDate != ""){
          requestParams["params"]["toDate"] = this.selectedToDate;
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
            console.log(">>>>>>>>response.data>>>>>>>>",response.data)
            const blob = new Blob([response.data], { type: 'application/pdf','Content-Disposition': 'attachment; filename="user_payment_report.pdf"'  });

          // Create a URL for the Blob (useful for download or preview)
          const blobUrl = URL.createObjectURL(blob);

          // Create a link element to trigger the download
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'user_payment_report.pdf'; // Set the filename for download
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
    setFromDate(value){ 
      this.selectedFromDate = value;
    },
    setToDate(value){ 
      this.selectedToDate = value;
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
    this.loadUserClients()

     const requestParam = {
          params: {
            email: this.userEmail,
          },
        };
        console.log(">>>>>>>>requestParam>>>>>>>>",requestParam)
     axios
          .get(path.FIND_USER_BY_EMAIL, requestParam, this.headers)
          .then((response) => {
             const result = response.data; 
            console.log("eresult.data.id>>>>>>>>>>>",result.data.id)
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.profileUserId = result.data.id  
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });

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
