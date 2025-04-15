<template>
  <q-page padding> 
        <q-card>
          <q-card-section class='pwan-blue text-white'>
            <HeaderPage  
                :label='pageName'
                :hint='hint'  
              />
          </q-card-section>
        </q-card>
        <q-card v-if='websitelink != null' style='margin-bottom: 10px;'>
          <q-card-section class='text-center'>
          Your Estate Agency Link is :  <a :href='websitelink' target='_blank'   rel='noopener noreferrer'> {{websitelink}}</a> 
           </q-card-section>
        </q-card>
          
           <q-toggle
              v-model='toggleValue'
              :label='toggleLabel'
              @update:model-value='onToggleChange'
            />

         <div class='card-container' v-if='!toggleValue'> 
          <q-card
            v-if='isSupperUser'
            key='websitesetup' 
             class='my-card-d text-white'
          > 
              <router-link to='/userwebsitesetup' class='q-card-link' style='text-decoration: none;' @click='handleClick("/userwebsitesetup")'>
                <q-card-section>
                  <div class='text-h6'><q-icon name='fa fa-wifi' size='40px' />Website Setup</div>
                  <div>Website Setup</div>
                </q-card-section>
              </router-link>
           </q-card>
           <q-card
            v-if='isSupperUser'
            key='organisations-upload' 
             class='my-card-d'
          > 
              <router-link to='/orgupload' class='q-card-link' style='text-decoration: none;' @click='handleClick("/orgupload")'>
               
                <q-card-section> 
                  <div class='text-h6'><q-icon name='upload' size='40px' />Upload Organistions</div>
                  <div>Upload Organisations</div> 
                </q-card-section>
                
              </router-link>
           </q-card>
           
           <q-card
            v-for='item in items'
            :key='item.id' 
             class='my-card-d text-white'
          >
              <router-link :to='`${item.link}`' class='q-card-link' style='text-decoration: none;' @click='handleClick(`${item.link}`)'>
                <q-card-section>
                  <div class='text-h6'><q-icon :name='item.icon' size='40px' />{{ item.title }}</div>
                  <div>{{ item.description }}</div>
                </q-card-section>
              </router-link>
           </q-card>
        </div>
      
      <div class='q-pa-md row items-start q-gutter-md' v-else>  
        <q-card
          class='my-card-d text-white'
          style='background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)' v-if='outstanding.length > 0'>
          <q-card-section>
            <div class='text-h6 text-center'>OutStanding Payment(s)</div> 
          </q-card-section>  
          <q-separator dark inset /> 
            <q-card-section v-for='(field, index) in outstanding' :key='index'> 
                <div class='col-3'>{{field.organisation__name}}</div>  
                <hr>
                <div class='col-3'>Current Debit: <b>N {{field.currentDebit}}</b> | Paid: <b>N {{field.paid}}</b> </div>  
            
            </q-card-section>
        </q-card>

        <q-card dark bordered class='bg-red-9 my-card-d text-white'  v-if='contributions.length > 0'>
          <q-card-section>
            <div class='text-h6 text-center'>Total Contribution(s)</div> 
          </q-card-section>
          <q-separator dark inset /> 
            <q-card-section v-for='(field, index) in contributions' :key='index'> 
                <div class='col-3'>{{field.organisation__name}}: <b>N {{field.transactionAmount}}</b></div>  
            </q-card-section>
        </q-card>
        <q-card dark bordered class='bg-puple-9 my-card-d text-white'  v-if='attendance.length > 0'>
          <q-card-section>
            <div class='text-h6 text-center'>Attendance</div> 
          </q-card-section>
          <q-separator dark inset /> 
            <q-card-section v-for='(field, index) in attendance' :key='index'> 
                <div class='col-3'>{{field.organisation__name}}: <b>{{field.count}}</b></div>  
            </q-card-section>
        </q-card>
        <q-card dark bordered class='bg-green-9 my-card-d text-white'  v-if='benefits.length > 0'>
          <q-card-section>
            <div class='text-h6 text-center'>Total Receivable(s)</div> 
          </q-card-section>
          <q-separator dark inset /> 
            <q-card-section v-for='(field, index) in benefits' :key='index'> 
                <div class='col-3'>{{field.organisation__name}}: <b>N {{field.transactionAmount}}</b></div>  
            </q-card-section>
        </q-card>
        
      </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar';
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import axios from 'axios';
import { ref } from 'vue';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger'; 
import HeaderPage from 'src/components/HeaderPage.vue';

export default {
  components: { 
    HeaderPage,
  },
  data() {
    const { t } = useI18n() 
    const pageName = computed(()=> t('dashboard.pagename'))
    const hint = computed(()=> t('dashboard.hint'))
    const headers = SessionStorage.getItem('headers');
    const userEmail = LocalStorage.getItem('userEmail'); 
    const websitelink = ref(null)
    const contributions = ref([])
    const attendance = ref([])
    const outstanding = ref([])
    const benefits = ref([])
    
    return { 
      headers,
      userEmail,
      contributions, 
      attendance,
      outstanding,
      benefits,
      pageName,
      hint,
      websitelink,
      isSupperUser:false,
      toggleValue:ref(false), 
      toggleLabel:'Dashboard Transaction Details',
       items: [
        

        { id: 1, title: 'Payment', description: 'Make Online Payment',link:'/viewpayments',gradient: 'linear-gradient(to right, #FF5733, #FFC300)',icon:'payment'}, 
        { id: 2, title: 'Properties', description: 'Search for Properties',link:'/properties',gradient: 'linear-gradient(to right, #FF5733, #FFC300)',icon:'home'}, 
        { id: 3, title: 'Turnel', description: 'Turnelling to Different Client/Affilate', link:'/turnel',gradient: 'linear-gradient(to right, #33FF57, #33FFC3)', icon : 'loop', },
        { id: 4, title: 'Commision', description: 'Calculate Commission',link:'/calculatecommission',gradient: 'linear-gradient(to right, #FF5733, #FFC300)', icon:'wallet'},
        { id: 5, title: 'Attendance', description: 'Record Attendance',link:'/selfattendance',gradient: 'linear-gradient(to right, #3357FF, #C300FF)', icon:'check',},
        { id: 6, title: 'Client/Center', description: 'Client/Affilate/Center',link:'/client' ,gradient: 'linear-gradient(to right, #33FF57, #33FFC3)', icon:'company'},
        { id: 7, title: 'Organisation/Branches', description: 'Organisation/Branches',link:'/organisation',gradient: 'linear-gradient(to right, #FF5733, #FFC300)', icon:'fa fa-sitemap'},
        { id: 8, title: 'QR Code', description: 'QR Code',link:'/userqrcode',gradient: 'linear-gradient(to right, #3357FF, #C300FF)', icon:'fa fa-qrcode'},
       
      ],
    };
  },
    methods:{

      handleClick(link){  
        console.log(">>>>>>>>>link>>>>>",link)
        var pageStacking = LocalStorage.getItem('pagestack') 
        pageStacking.push(link)  
       LocalStorage.set('pagestack',pageStacking) 
        
      },
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
            debug('Error:', error);
          });
 
      } catch (error) {
        console.error('Error submitting form:', error);
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
              SessionStorage.set('isSupperUser', result.data.is_superuser);
 
            }  
  
          })
          .catch((error) => {
            debug('Error:', error);
          });
 
      } catch (error) {
        console.error('Error submitting form:', error);
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
            const result =  response.data.data;
            this.websitelink = path.ESTATE_AGENCY_URL + result[0].refId
          })
          .catch((error) => {
             console.log(error)
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    
    onToggleChange(value){  
      if(value){
          this.toggleLabel = 'Dashboard Actions'
      }else{          
         this.toggleLabel = 'Dashboard Transaction Details'
      }
         
    },

  },
  beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('beforeMount');
  },
  mounted() {
    console.log('mounted');
    this.fetchData();
    this.loadUser();
    this.loadUserWebsiteSetup()
  },
};
</script>

<style lang='sass'>
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
