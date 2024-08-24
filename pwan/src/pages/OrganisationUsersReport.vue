<template>
  <q-page padding>
    <q-card
      class="card-flex-display" 
    > 
      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.status"
            :options="statuses"
            label="Select Status" 
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
            @click="searchUsers"
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
        title="Organisation User's Report"
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:selected="selected"
      > 
        <template v-slot:top>
          <q-label>Organisation User's Report</q-label>
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
        name: "name",
        required: false,
        label: "Name",
        align: "left",
        field: (row) =>
          row.userId.last_name + " "+ row.userId.first_name + " "+row.userId.middle_name,
        format: (val) => `${val}`,
        sortable: true,
      },
     
      {
        name: "status",
        align: "left",
        label: "Status",
        field: (row) => row.status.name,
        sortable: true,
      },
       
      {
        name: "registrationDate",
        align: "left",
        label: "Registration Date",
        field: (row) => format(row.createdDate, 'yyyy-MM-dd'),
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
      statuses: [], 
      dense:true, 
    };
  },
  methods: {
     
    searchUsers() {
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
         if(this.formData.status != null && this.formData.status.value != null &&  this.formData.status.value != ""){
          requestParams["params"]["status"] = this.formData.status.value
        } 
      try {
        console.log(">>>>>requestParams>>>>>>>>",requestParams)
        const promise = axios.get(
          path.ORG_USER_SEARCH,
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
         if(this.formData.status != null && this.formData.status.value != null &&  this.formData.status.value != ""){
          requestParams["params"]["status"] = this.formData.status.value
        } 
      try { 
        const promise = axios.get(
          path.ORG_USER_REPORT,
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
          a.download = 'organisation_members_report.pdf'; // Set the filename for download
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
    console.log(">>>>>>>>>mounted>>>>>>>>>>");
    try {
       
      const promise = axios.get(
        path.STATUS_ALL, 
        this.headers
      );
      console.log(">>>>>>>>promise>>>>>>>", promise);
      promise
        .then((response) => {
          
        console.log(">>>>>>>>response>>>>>>>", response.data);
          this.statuses = response.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
           console.log(">>>>>>>>statuses>>>>>>>", this.statuses);
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
