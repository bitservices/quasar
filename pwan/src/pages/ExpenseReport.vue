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
            v-model="formData.vendorCode"
            :options="vendors"
            label="Select Vendor" 
            :dense="dense"
          />  
           <q-input
              filled
              bottom-slots
              v-model="formData.amount"
              placeholder="Payable Amount"
              type="number"
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
            @click="searchExpenseReportData"
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
        title="Vendor Payments"
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:selected="selected"
      > 
        <template v-slot:top>
          <q-label>Expense Report</q-label>
          <q-space /> 
        </template> 
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref,computed } from "vue"; 
import path from "src/router/urlpath"; 
import { useI18n } from 'vue-i18n'
 import HeaderPage from "src/components/HeaderPage.vue";

export default {
  components: { 
    HeaderPage,
  },
  data() {
    const { t } = useI18n();
    const pageName = computed(()=> t('expensereport.pagename'))
    const hint = computed(()=> t('expensereport.hint'))
    const headers = SessionStorage.getItem("headers"); 
    const profile = LocalStorage.getItem("turnelParams");
    const userEmail = ""; 
    const columns = [
      {
        name: "vendor",
        required: false,
        label: "Vendor",
        align: "left",
        field: (row) =>
          row.vendorCode.name,
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
        name: "paymentMode",
        align: "left",
        label: "Payment Mode",
        field: (row) => row.paymentMode.name,
        sortable: true,
      },
      {
        name: "payemntDate",
        align: "left",
        label: "Payment Date",
        field: (row) => row.paymentDate,
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
      vendors: [],
      paymentModes: [],
      dense:true, 
      totalAmount:0,
      pageName,
      hint,
    };
  },
  methods: {
     
    searchExpenseReportData() {
      this.totalAmount = 0
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
         if(this.formData.vendorCode != null && this.formData.vendorCode.value != null &&  this.formData.vendorCode.value != ""){
          requestParams["params"]["vendorCode"] = this.formData.vendorCode.value
        }
        if(this.formData.paymentMode != null && this.formData.paymentMode.value != null &&  this.formData.paymentMode.value != ""){
          requestParams["params"]["paymentMode"] = this.formData.paymentMode.value
        } 
        if(this.formData.amount != null &&   this.formData.amount != "" && parseFloat(this.formData.amount) > 0 ){
          requestParams["params"]["amount"] = this.formData.amount
        } 
      try { 
        const promise = axios.get(
          path.VENDOR_PAYMENT_TRANSACTION_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response 
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
         if(this.formData.vendorCode != null && this.formData.vendorCode.value != null &&  this.formData.vendorCode.value != ""){
          requestParams["params"]["vendorCode"] = this.formData.vendorCode.value
        }
        if(this.formData.paymentMode != null && this.formData.paymentMode.value != null &&  this.formData.paymentMode.value != ""){
          requestParams["params"]["paymentMode"] = this.formData.paymentMode.value
        } 
        if(this.formData.amount != null &&   this.formData.amount != "" && parseFloat(this.formData.amount) > 0 ){
          requestParams["params"]["amount"] = this.formData.amount
        } 
      try { 
        const promise = axios.get(
          path.VENDOR_PAYMENT_TRANSACTION_REPORT,
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
          a.download = 'vendor_payment_report.pdf'; // Set the filename for download
          a.textContent = 'Download File';
          document.body.appendChild(a);
          a.click();
            
          })
          .catch((error) => {
             
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
     
    
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
    console.log(">>>>>>>>>Expwnse Report mounted>>>>>>>>>>");
    try {
      const requestParams = {
        params: {
          client: this.profile.client,
          organisation: this.profile.organisation,
        },
      };
      const promise = axios.get(
        path.VENDOR_SEARCH,
        requestParams,
        this.headers
      );
      console.log(">>>>>>>>promise>>>>>>>", promise);
      promise
        .then((response) => {
          this.vendors = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
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
