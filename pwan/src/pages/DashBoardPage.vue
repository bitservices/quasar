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
        <q-card v-if="websitelink != null" style="margin-bottom: 10px;">
          <q-card-section class="text-center">
          Your Estate Agency Link is :  <a :href="websitelink" target="_blank"   rel="noopener noreferrer"> {{websitelink}}</a> 
           </q-card-section>
        </q-card>
          
         <div class="card-container"> 
          <q-card
            v-if="isSupperUser"
            key="websitesetup"
            style="background:linear-gradient(to right, #3357FF, #C300FF)"
             class="my-card text-white"
          > 
              <router-link to="/userwebsitesetup" class="q-card-link" style="text-decoration: none; color: white;">
                <q-card-section>
                  <div class="text-h6">Website Setup</div>
                  <div>Website Setup</div>
                </q-card-section>
              </router-link>
           </q-card>
           <q-card
            v-for="item in items"
            :key="item.id"
            :style="{ background: item.gradient }"
             class="my-card text-white"
          >
              <router-link :to="`${item.link}`" class="q-card-link" style="text-decoration: none; color: white;">
                <q-card-section>
                  <div class="text-h6">{{ item.title }}</div>
                  <div>{{ item.description }}</div>
                </q-card-section>
              </router-link>
           </q-card>
        </div>
      
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
    const websitelink = ref(null)
    
    return { 
      headers,
      userEmail,
      contributions:[], 
      attendance:[],
      outstanding:[],
      benefits:[],
      pageName,
      hint,
      websitelink,
      isSupperUser:false,
       items: [
        
        { id: 1, title: 'Properties', description: 'Search for Properties',link:'/properties',gradient: 'linear-gradient(to right, #FF5733, #FFC300)',}, 
        { id: 2, title: 'Turnel', description: 'Turnelling to Different Client/Affilate', link:'/turnel',gradient: 'linear-gradient(to right, #33FF57, #33FFC3)', },
        { id: 3, title: 'Commision', description: 'Calculate Commission',link:'/calculatecommission',gradient: 'linear-gradient(to right, #FF5733, #FFC300)', },
        { id: 4, title: 'Attendance', description: 'Record Attendance',link:'/selfattendance',gradient: 'linear-gradient(to right, #3357FF, #C300FF)' },
        { id: 5, title: 'Client', description: 'Client/Affilate',link:'/client' ,gradient: 'linear-gradient(to right, #33FF57, #33FFC3)',},
        { id: 6, title: 'Organisation', description: 'Organisation/Center Page',link:'/organisation',gradient: 'linear-gradient(to right, #FF5733, #FFC300)', },
        { id: 7, title: 'QR Code', description: 'QR Code',link:'/userqrcode',gradient: 'linear-gradient(to right, #3357FF, #C300FF)'},
       
      ],
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
    },
    loadUser(){
       const requestParam = {
        params: {
          email: this.userEmail,
        },
      }; 
      try {
         const promise = axios.get(path.USER_SEARCH_BY_EMAIL, requestParam, this.headers);

          promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;   
            if (result.success) {   
              this.isSupperUser =  result.data.is_superuser
 
            }  
  
          })
          .catch((error) => {
            debug("Error:", error);
          });
 
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    loadUserWebsiteSetup() { 
      try { 
        const requestParam = {
            params: {
              email: this.userEmail,
            },
          }; 
        const promise = axios.get(
          path.USER_WEBSITE_SEARCH, 
          requestParam,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log("response data>>>>>>>", response.data.data); 
            const result =  response.data.data;
            this.websitelink = path.ESTATE_AGENCY_URL + result[0].refId 
          })
          .catch((error) => {
             
          });
      } catch (error) {
        console.error("Error submitting form:", error);
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
    console.log("beforeMount");
  },
  mounted() {
    console.log("mounted");
    this.fetchData();
    this.loadUser();
    this.loadUserWebsiteSetup()
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
