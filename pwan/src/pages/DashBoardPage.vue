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
      <div class="q-pa-md row items-start q-gutter-md"> 
        <q-card
          class="my-card text-white"
          style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
        v-if="outstanding.length > 0">
          <q-card-section>
            <div class="text-h6 text-center">OutStanding Payment(s)</div> 
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
            <div class="text-h6 text-center">Total Contribution(s)</div> 
          </q-card-section>
          <q-separator dark inset /> 
            <q-card-section v-for="(field, index) in contributions" :key="index"> 
                <div class="col-3">{{field.organisation__name}}: <b>N {{field.transactionAmount}}</b></div>  
            </q-card-section>
        </q-card>
        <q-card dark bordered class="bg-puple-9 my-card text-white"  v-if="attendance.length > 0">
          <q-card-section>
            <div class="text-h6 text-center">Attendance</div> 
          </q-card-section>
          <q-separator dark inset /> 
            <q-card-section v-for="(field, index) in attendance" :key="index"> 
                <div class="col-3">{{field.organisation__name}}: <b>{{field.count}}</b></div>  
            </q-card-section>
        </q-card>
        <q-card dark bordered class="bg-green-9 my-card text-white"  v-if="benefits.length > 0">
          <q-card-section>
            <div class="text-h6 text-center">Total Receivable(s)</div> 
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import axios from "axios";
import { ref } from "vue";
import path from "src/router/urlpath";
import debug from "src/router/debugger"; 
import HeaderPage from "src/components/HeaderPage.vue";

export default {
  components: { 
    HeaderPage,
  },
  data() {
    const { t } = useI18n() 
    const pageName = computed(()=> t('dashboard.pagename'))
    const hint = computed(()=> t('dashboard.hint'))
    const headers = SessionStorage.getItem("headers");
    const userEmail = LocalStorage.getItem("userEmail"); 
    
    return { 
      headers,
      userEmail,
      contributions:[], 
      attendance:[],
      outstanding:[],
      benefits:[],
      pageName,
      hint,
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
            console.log("Attendanc data result>>>>>>>>>>>>",result) 
            if (result.success) {   
              this.contributions =  result.data.usertransaction
              this.attendance = result.data.attendance
              this.outstanding= result.data.outstanding 
              this.benefits= result.data.benefits 
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
