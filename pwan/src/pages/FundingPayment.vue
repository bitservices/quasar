<template>
  <q-page padding>
    <div class='q-pa-md'>
      <q-card>
          <q-card-section class='pwan-blue text-white'>
            <HeaderPage  
                :label='pageName'
                :hint='hint'  
              />
          </q-card-section>
        </q-card>
        <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
        </div>
         <div class='q-pa-md q-gutter-lg'>
           
            <ValidateDanFormDialog
            v-model='showFormDialog'
            :onClick='saveRecord'
            @formDataSubmitted='saveRecord'
            label='Dynamic Authentication Validation' 
          />
            <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />
        </div>
      <q-card class='card-flex-display' 
    >

      <q-card-section>
        <q-form @submit.prevent='validateDAN' ref='fundingPaymentForm'>
          <q-select
                filled
                bottom-slots
                v-model='formData.fundingType'
                :options='fundingTypes'
                label='Select Funding Types' 
                :dense='dense'  
              />
          <q-input
            filled
            bottom-slots
            v-model='formData.description'
            label='Describtion'
            type='textarea'
            rows='3'
            maxlength='300'
            counter
            :rules='[inputRequiredRule]'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.payer'
            label='Payer'
            type='text'  
            :rules='[inputRequiredRule]'
          />
          <q-input 
                filled
                bottom-slots
                v-model='formData.amount' 
                placeholder='Amount'
                type='number'
                :dense='dense'   
                :rules='[amountRule]'   
              />
              <q-select
                    filled
                    bottom-slots
                    v-model='formData.paymentMode'
                    :options='paymentModes'
                    label='Select Payment Mode' 
                    :dense='dense'  
                  /> 
           <q-card-actions align='center'> 
              <q-btn
                label='Reset'
                class='pwan-blue'
                @click='reloadPage'
                size='md'
                rounded
                v-close-popup
              />
              <q-btn
                class='pwan-button'
                label='Post Funding' 
                type='submit'
                size='md'
                rounded
                v-close-popup
              />
              <Done />
        </q-card-actions>
        </q-form>
      </q-card-section> 
    </q-card> 
    </div>
  </q-page>
</template>


<script> 
import { useI18n } from 'vue-i18n'
import HeaderPage from 'src/components/HeaderPage.vue'; 
import { LocalStorage, SessionStorage } from 'quasar';
import { ref,computed } from 'vue';
import axios from 'axios';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger';
import ResponseDialog from 'src/components/ResponseDialog.vue'; 
import { isRequired,amountFieldRule,inputFieldRequired } from 'src/validation/validation';  
import QRCodeScanner from 'src/components/QRCodeScanner.vue';  
import ValidateDanFormDialog from 'src/components/ValidateDanFormDialog.vue';  
import Done from 'src/components/Done.vue';
 
export default {
   components: { 
    ResponseDialog,
    HeaderPage,
    QRCodeScanner,
    ValidateDanFormDialog,
    Done,
  },
  data() { 
     const { t } = useI18n() 
    const pageName = computed(()=> t('userpayment.pagename'))
    const hint = computed(()=> t('userpayment.hint'))
    const showSpinner = ref(false); 
   const profile = LocalStorage.getItem('turnelParams');
    const headers = SessionStorage.getItem('headers');
    const showMessageDialog = ref(false); 
    const showFormDialog = ref(false); 
    const formData = ref({
      "client":profile.client,
      "organisation":profile.organisation,
      "createdBy" : profile.email,
    });
    const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {},
    });

    return {
      formData, 
      headers, 
      dense:true,
      isReadonly:true,
      imageFile : null,
      profile,
      showMessageDialog,
      showFormDialog,
      orgUsers:[],
      userPayments:[], 
      paymentModes:[],
      fundingTypes : [],
      childRef, 
      paymentTypes:[],
      backupPayments:[],
      isreadonly:false,
      requiredRule: value => isRequired(value), 
      inputRequiredRule: value => inputFieldRequired(value),  
      amountRule: value => amountFieldRule(value),   
      pageName,
      hint, 
      showSpinner,
      checked:true,
      sumAmount:0,
      sumAmountStr:'0.00', 
      waiver : false,
    };
  },
  methods: {

     validateDAN() {
      console.log('calling validate DAn')
      this.showFormDialog = true;
      this.action = 'add';
      this.actionLabel = 'Validate';
    }, 
      
    reloadPage(){
      window.location.reload()
    },
    saveRecord() {    
          this.showSpinner= true  
          
          this.formData.fundingType = this.formData.fundingType .value;
          this.formData.paymentMode = this.formData.paymentMode .value;
          try {  
            console.log(">>>>>>>>>this.formData>>>>>>>>",this.formData)
            const promise = axios.post(path.FUNDINGPAYMENT_TRANSACTION_CREATE, this.formData, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                const result = response.data;  
                if (result.success) {  
                  
                  this.childRef = {
                  message: result.message,
                  label: 'Success',
                  cardClass: 'bg-positive text-white',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal',
                }; 
                setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }else{
                   this.childRef = {
                  message: result.message,
                  label: 'Success',
                  cardClass: 'bg-negative text-white error',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal',
                }; 
                }
                this.showSpinner = false;
                this.showMessageDialog = true;
                
      
              })
              .catch((error) => {
                debug('Error:', error);
                  this.childRef = {
                  message: error.message,
                  label: 'Success',
                  cardClass: 'bg-negative text-white error',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal',
                }; 
                this.showSpinner = false;
                this.showMessageDialog = true;
              });
          } catch (error) {
            debug('Error:', error);
              this.childRef = {
                  message: error.message,
                  label: 'Success',
                  cardClass: 'bg-negative text-white error',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal',
                }; 
                this.showSpinner = false;
                this.showMessageDialog = true;
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
    console.log('before Mount');
  },
  mounted() {
    console.log('>>>>>>>>>mounted>>>>>>>>>>');
    try {
       const requestParams = {
      params: {
        client: this.profile.client,
        organisation: this.profile.organisation,
      },
    };
         const promise =  axios.get(
          path.FUNDINGTYPE_SEARCH,
          requestParams,
          this.headers
        ); 
         console.log('>>>>>>>>promise>>>>>>>',promise)
         promise
          .then((response) => {
          this.fundingTypes = response.data.data.map((option) => (
          {
          label: option.name,
          value: option.id,
        })); 
          })
          .catch((error) => {
            console.log(error);
          });

        
      const paymentModePromise =  axios.get(
          path.PAYMENTMODE_SEARCH, 
          this.headers
        ); 
         console.log('>>>>>>>>paymentModePromise>>>>>>>',paymentModePromise)
         paymentModePromise
          .then((response) => {
          this.paymentModes = response.data.data.map((option) => (
          {
          label: option.name,
          value: option.code, 
        }));
        console.log('paymentModes>>>>>>>>>', this.paymentModes);
          })
          .catch((error) => {
            console.log(error);
          });
    
      } catch (error) {
        console.error('Error:', error);
      }
        
  },
  unmounted() { 
     
  },
  updated() {
    console.log('>>>>>>>>>>>update>>>>>>') 
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
