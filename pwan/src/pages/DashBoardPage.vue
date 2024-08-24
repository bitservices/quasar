<template>
  <q-page padding>
    <div class="q-pa-md">Dash Board</div>
 
      <div class="q-pa-md row items-start q-gutter-md">
         
        <q-card
          class="my-card text-white"
          style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
        v-if="outstanding.length > 0">
          <q-card-section>
            <div class="text-h6">OutStanding Payment(s)</div> 
          </q-card-section>  
          <q-separator dark inset /> 
            <q-card-section v-for="(field, index) in outstanding" :key="index"> 
                <div class="col-3">{{field.organisation__name}}</div>  
                <hr>
                <div class="col-3">Current Debit: <b>N {{field.currentDebit}}</b> | Paid: <b>N {{field.paid}}</b> </div>  
            
            </q-card-section>
        </q-card>

        <q-card dark bordered class="bg-red-9 my-card text-white"  v-if="contributions.length > 0">
          <q-card-section>
            <div class="text-h6">Total Contribution(s)</div> 
          </q-card-section>
          <q-separator dark inset /> 
            <q-card-section v-for="(field, index) in contributions" :key="index"> 
                <div class="col-3">{{field.organisation__name}}: <b>N {{field.transactionAmount}}</b></div>  
            </q-card-section>
        </q-card>
        <q-card dark bordered class="bg-green-9 my-card text-white"  v-if="attendance.length > 0">
          <q-card-section>
            <div class="text-h6">Attendance</div> 
          </q-card-section>
          <q-separator dark inset /> 
            <q-card-section v-for="(field, index) in attendance" :key="index"> 
                <div class="col-3">{{field.organisation__name}}: <b>N{{field.transactionAmount}}</b></div>  
            </q-card-section>
        </q-card>
        <q-card dark bordered class="bg-green-9 my-card text-white"  v-if="benefits.length > 0">
          <q-card-section>
            <div class="text-h6">Total Receivable(s)</div> 
          </q-card-section>
          <q-separator dark inset /> 
            <q-card-section v-for="(field, index) in benefits" :key="index"> 
                <div class="col-3">{{field.organisation__name}}: <b>N {{field.transactionAmount}}</b></div>  
            </q-card-section>
        </q-card>
        
      </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref } from "vue";
import path from "src/router/urlpath";
import debug from "src/router/debugger";

export default {
  data() {
    const headers = SessionStorage.getItem("headers");
    const userEmail = LocalStorage.getItem("userEmail");  
    return { 
      headers,
      userEmail,
      contributions:[], 
      attendance:[],
      outstanding:[],
      benefits:[],
    };
  },
    methods:{
       fetchData() {
      console.log(this.userEmail);
      const requestParam = {
        params: {
          email: this.userEmail,
        },
      };
      try {
         const promise = axios.get(path.DASHBOARD, requestParam, this.headers);

          promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;  
            if (result.success) {   
              this.contributions =  response.data.data.usertransaction
              this.attendance = response.data.data.attendance
              this.outstanding=response.data.data.outstanding 
              this.benefits=response.data.data.benefits 
            } 
  
          })
          .catch((error) => {
            debug("Error:", error);
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
  },
  mounted() {
    console.log("mounted");
    this.fetchData();
  },
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
