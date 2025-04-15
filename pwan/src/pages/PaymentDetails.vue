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
          
           
         <div class='card-container'> 
                      
           <q-card
            v-for='item in paymentItems'
            :key='item.id' 
             class='my-card-d text-white'
          >
              <router-link :to='`/selfpayment/${item.organisation.code}/${item.client.code}`' class='q-card-link' style='text-decoration: none;'>
                <q-card-section>
                  <div class='text-h6 text-center'><q-icon :name='item.icon' size='40px' />{{ item.organisation.name }}</div>
                  <div class='text-h6 text-center'>N {{ item.outstandingAmount }}</div>
                  <q-separator />
                  <div class='text-center'>Preview</div>
                </q-card-section> 
              </router-link>  
           </q-card>
        </div>  
        <Done />
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar';
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import axios from 'axios';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger'; 
import HeaderPage from 'src/components/HeaderPage.vue';
import Done from 'src/components/Done.vue';

export default {
  components: { 
    HeaderPage,
    Done,
  },
  data() {
    const { t } = useI18n() 
    const pageName = computed(()=> t('paymentdetails.pagename'))
    const hint = computed(()=> t('paymentdetails.hint'))
    const headers = SessionStorage.getItem('headers');
    const userEmail = LocalStorage.getItem('userEmail'); 
     
    return { 
      headers,
      userEmail, 
      pageName,
      hint, 
      paymentItems: [],
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
         const promise = axios.get(path.USR_OUTSTANDING_PAYMENT_SEARCH_GROUP_BY_ORGANISATION, requestParam, this.headers);

          promise
          .then((response) => {
            // Extract data from the response 
            const result = response.data; 
            
              
            if (result.success) {    
               
              result.data.forEach(item => {
                item.outstandingAmount = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(item.outstandingAmount);
            }); 
            console.log('>>>>result>>>',result)
            this.paymentItems =  result.data;
            console.log(this.paymentItems)
            } 
              
          })
          .catch((error) => {
            debug('Error:', error);
          });
 
      } catch (error) {
        console.error('Error submitting form:', error);
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
