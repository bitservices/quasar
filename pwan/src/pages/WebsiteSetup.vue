<template>
  <q-page padding>
    <q-card
      class='card-flex-display' 
    >  
          <q-card-section class='pwan-blue text-white'>
            <HeaderPage  
                :label='pageName'
                :hint='hint'  
              />
          </q-card-section> 
      <q-card-section>
         <q-form @submit.prevent='purchaseWebsite' ref='websiteForm'> 
            <q-card-actions align='center'>              
              <q-btn
                rounded
                class='pwan-button top-margin'
                :label='actionLabel'  
                :disable='disabled'
                type='submit' 
              />
              <Done />
            </q-card-actions>
        </q-form>
      </q-card-section>
     
    </q-card>
    <div class='q-pa-md'>
        <div class="card" v-if='websitelink != null'>
           <div> Website: <a :href='websitelink' target='_blank'   rel='noopener noreferrer'> {{websitelink}}</a></div>
           <div> Expiration Date:   {{expirationDate}}</div>
        </div>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage,date } from 'quasar'; 
import axios from 'axios';
import { ref,computed } from 'vue';  
import path from 'src/router/urlpath';
import { useI18n } from 'vue-i18n'
import HeaderPage from 'src/components/HeaderPage.vue';  
import { isRequired,inputFieldRequired } from 'src/validation/validation';   
import Done from 'src/components/Done.vue';  
export default {
    components: {  
    HeaderPage, 
    Done,
  },
  
  data() {
     const { t } = useI18n() 
    const pageName = computed(()=> t('websitesetup.pagename'))
    const hint = computed(()=> t('websitesetup.hint'))
    const headers = SessionStorage.getItem('headers'); 
    const profile = LocalStorage.getItem('turnelParams');
    const userEmail = LocalStorage.getItem('userEmail');
    const websitelink = ref(null);
    const websiteId = ref(null);
    const expirationDate = ref(null);
    const selected = ref([]);
    const formData = ref({amount : 50000});
    const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {},
    });

    return {  
      selected, 
      websitelink,
      websiteId,
      expirationDate,
      userEmail,
      headers, 
      formData,
      profile,
      dense:true, 
      messageChannels:[],
      disabled: false,
      pageName,
      hint,  
      actionLabel: "Create Website (N50,000)",
      unitPrice:0,
      equivalentUnit:0, 
      requiredRule: value => isRequired(value),  
      inputRequiredRule: value => inputFieldRequired(value), 
      childRef,
                
    };
  },
  methods: {
    
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
            console.log(">>>>>>>>>>>",result) 
            if(result.length > 0){
            this.websitelink = path.ESTATE_AGENCY_URL + result[0].refId
            this.expirationDate = date.formatDate(result[0].expirationDate, 'DD-MM-YYYY')  
            this.websiteId = result[0].id;
              this.actionLabel = "Renew Website (N50,000)" 
              const today = new Date();
              if(today > new Date(result[0].expirationDate)){ 
                  this.disabled = false
              }else{ 
                this.disabled = true
              }
            } 
          })
          .catch((error) => {
             console.log(error)
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    purchaseWebsite(){
      console.log('>>>>>>>>purchase unit>>>>>>>>')
      if (this.$refs.websiteForm.validate()) {
          this.showSpinner= true   
          console.log('the form is valid>>>>>>>>');
          this.logPaymentItems('pk_test_8f42f8d746d6f8bd63d34d6025d6390e24123d61','PAYSTACK')
      }
    },
    logPaymentItems(publicKey,paymentChannel){
        console.log('>>>>>>>publicKey>>>>',publicKey) 
              if(this.formData.amount > 0 ){  
                let item = {
                  email: this.userEmail, 
                  paymentMode : 'O' , 
                  createdBy : this.userEmail,
                  amount : this.formData.amount,   
                  status : 'A'
                }            
                console.log('>>>>>>>>item>>>>>>',item) 
                let data = {'paymentItems':JSON.stringify(item),  'totalAmount':this.formData.amount, 'createdBy':this.userEmail, 
                'paymentStatus':'P', 'paymentChannel':paymentChannel}
              console.log('data>>>>>>>',data) 
              const promise = axios.post(path.PAYMENTINTEGRATIONLOG_CREATE, data, this.headers);
                promise
                  .then((response) => {
                    // Extract data from the response
                    const result = response.data;  
                    
                    if (result.success) {  
                        if(paymentChannel=='PAYSTACK') {  
                          this.payWithPaystack(publicKey,result.data);
                        } else if(paymentChannel=='REMITA'){
                            this.payWithPaystack(publicKey,result.data);
                        }
                    } 
                    this.showSpinner = false;  
                  })
                  .catch((error) => { 
                      this.childRef = {
                      message: error.message,
                      label: 'Success',
                      cardClass: 'bg-negative text-white error',
                      textClass: 'q-pt-none',
                      buttonClass: 'bg-white text-teal',
                    }; 
                    this.showSpinner = false; 
                  });
              } 
    }, 
    completePaymentTransaction(data, response){
      try{
              this.showSpinner = true;
              let url = path.USER_WEBSITE_CREATE;
              let paymentItems = JSON.parse(data.paymentItems);  
               if(this.websitelink != null){
                url = path.USER_WEBSITE_ACTIVATE,
                paymentItems["id"] = this.websiteId;
              }
              console.log('>>>>>>>>paymentItems 2222 >>>>>>>>>>>>>>',paymentItems) 
              const referenceNumber = response.reference;
              const transactionReference = response.transaction;  
              const promise = axios.post(url, paymentItems, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                const result = response.data;  
                console.log('>>>>>>>>result>>>>>>>>>',result)
                if (result.success) {  
                  
                  try { 
                    const record = {'referenceNumber':referenceNumber, 'transactionReference':transactionReference,  'paymentStatus':'A' }
                    const promise = axios.put(path.PAYMENTINTEGRATIONLOG_UPDATE, record, this.headers);
                    promise
                      .then((response) => {
                        console.log(response)
                          setTimeout(() => {
                          window.location.reload();
                        }, 2000);
                      })
                      .catch((error) => {
                        childRef.value = {
                          message: error.message,
                          label: 'Error',
                          cardClass: 'bg-negative text-white error',
                          textClass: 'q-pt-none',
                          buttonClass: 'bg-white text-teal',
                        };
                        showMessageDialog.value = true;
                      });
                  } catch (error) {
                    console.error('Error:', error);
                  } 
                // setTimeout(() => {
                //     window.location.reload();
                //   }, 2000);
                } 
              })
            }catch(error){
              console.log('>>>error>>>>>>>',error)
            } 
    },
     payWithPaystack(publicKey, data) {
      const handler = window.PaystackPop.setup({
        key: publicKey, //'pk_test_8f42f8d746d6f8bd63d34d6025d6390e24123d61', // Replace with your public key
        email: data.payerId.email,
        amount: data.totalAmount * 100,
        ref: data.referenceNumber,
        callback: this.completePaymentTransaction.bind(this, data),  
          
        onCancel: function() {
          alert('Payment was canceled.');
        }
      });
      handler.openIframe();
    } , 
    

     
     
    
  },
  beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('beforeMount');
    console.log('>>>>>>>>>user Email >>>>>', this.userEmail);
  },
  mounted() {
    this.loadUserWebsiteSetup()
  },
  updated() {},
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
