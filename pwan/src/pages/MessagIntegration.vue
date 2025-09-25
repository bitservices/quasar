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
         <q-form @submit.prevent='purchaseUnit' ref='msgIntegrationForm'>
          <div class='row'>
            <div class='col-8'></div> 
            <div  class='col-4' style='display: flex; justify-content: flex-end'>
              <q-badge rounded :label='`Unit(s):   `+equivalentUnit' class='pwan-btton text-h6' />
            </div>
          </div>
          <q-select
            filled
            bottom-slots
            v-model='formData.messageChannel'
            :options='messageChannels'
            label='Select Messsage Channel' 
            :dense='dense'  
             :rules='[requiredRule]'  
            @update:model-value='handleChannelChange'
          />
          
          <q-input 
                filled
                bottom-slots 
                v-model='formData.amount' 
                placeholder='Enter Amount'
                type='number'
                :dense='dense'  
                @change='handleAmountChange'
                :rules='[inputRequiredRule]'  
              />

            <q-card-actions align='center'>              
              <q-btn
                rounded
                class='pwan-button top-margin'
                label='Buy Unit(s)'  
                type='submit' 
              />
              <Done />
            </q-card-actions>
        </q-form>
      </q-card-section>
     
    </q-card>
    <div class='q-pa-md'>
      <q-table
        class='my-sticky-header-table'
        flat
        bordered
        title='Message Integration(s)'
        :rows='rows'
        :columns='columns'
        row-key='id'
        v-model:selected='selected'
      > 
        <template v-slot:top>
          <q-label>Message Integration(s)</q-label>
          <q-space /> 
        </template> 
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar';
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
    const pageName = computed(()=> t('msgintegration.pagename'))
    const hint = computed(()=> t('msgintegration.hint'))
    const headers = SessionStorage.getItem('headers'); 
    const profile = LocalStorage.getItem('turnelParams');
    const userEmail = LocalStorage.getItem('userEmail');
     
    const columns = [
      {
        name: 'messageChannel',
        required: false,
        label: 'Message Channel',
        align: 'left',
        field: (row) => row.messagingChannel.name  , 
        sortable: true,
      },
      {
        name: 'totalUnit',
        align: 'left',
        label: 'Total Unit',
        field: (row) => new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format( row.totalUnit), 
        sortable: true,
      },
       
    ]; 
    const rows = ref([]);
    const selected = ref([]);
    const formData = ref({});
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
      columns,
      rows,
      userEmail,
      headers, 
      formData,
      profile,
      dense:true, 
      messageChannels:[],
      pageName,
      hint,  
      unitPrice:0,
      equivalentUnit:0, 
      requiredRule: value => isRequired(value),  
      inputRequiredRule: value => inputFieldRequired(value), 
      childRef,
                
    };
  },
  methods: {
    handleAmountChange(amount){ 
        if(amount > 0 && this.unitPrice > 0){
          this.equivalentUnit = Math.floor(amount/this.unitPrice)
        }else{
          this.equivalentUnit = 0
        }
    },
    handleChannelChange(channel){ 
        this.unitPrice = channel.unitPrice;
         if(this.formData.amount > 0 && this.unitPrice > 0){
          this.equivalentUnit = Math.floor(this.formData.amount/this.unitPrice)
        }else{
          this.equivalentUnit = 0
        }
    },
    searchData() {
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
      try {
        console.log('>>>>>requestParams>>>>>>>>',requestParams)
        const promise = axios.get(
          path.MESSAGINGINTEGRATION_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log('response data>>>>>>>', response.data);
            this.rows = response.data.data;  
            this.selected = [];
          })
          .catch((error) => {
             console.log(error)
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    purchaseUnit(){
      console.log('>>>>>>>>purchase unit>>>>>>>>')
      if (this.$refs.msgIntegrationForm.validate()) {
          this.showSpinner= true   
          console.log('the form is valid>>>>>>>>');
          this.logPaymentItems('pk_test_8f42f8d746d6f8bd63d34d6025d6390e24123d61','PAYSTACK')
      }
    },
    logPaymentItems(publicKey,paymentChannel){
        console.log('>>>>>>>publicKey>>>>',publicKey) 
              if(this.formData.amount > 0 && this.unitPrice > 0 ){  
                let item = {
                  client: this.profile.client,
                  organisation : this.profile.organisation,
                  paymentMode : 'O' , 
                  createdBy : this.userEmail,
                  amount : this.formData.amount, 
                  messageChannel : this.formData.messageChannel.value,
                  totalUnit:this.equivalentUnit,
                  unitPrice:this.unitPrice,
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
              let paymentItems = JSON.parse(data.paymentItems);  
              console.log('>>>>>>>>paymentItems 2222 >>>>>>>>>>>>>>',paymentItems) 
              const referenceNumber = response.reference;
              const transactionReference = response.transaction; 
              const promise = axios.post(path.MESSAGINGINTEGRATION_CREATE, paymentItems, this.headers);
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
    console.log('>>>>>>>>>mounted>>>>>>>>>>');
    try {  
         const promise =  axios.get(
          path.MESSAGINGCHANNEL_SEARCH, 
          this.headers
        ); 
         promise
          .then((response) => {
            console.log('>>>>>response.data.data>>>>>>>',response.data.data)
          this.messageChannels = response.data.data.map((option) => (
          {
          label: option.name,
          value: option.code,
          unitPrice : option.unitPrice,
        })); 
          
         console.log('>>>>>>>>this.messageChannel>>>>>>>',this.messageChannels)
          })
          .catch((error) => {
            console.log(error);
          });
        
      this.searchData();
      } catch (error) {
        console.error('Error:', error);
      }
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
