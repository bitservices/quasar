<template>
  <q-dialog v-model='showDialog' persistent width='1229px' height='600px'>
    <q-card
      class='card-flex-display'
      :style='{ width: form.width, height: form.height }'
    >
        <q-card-section class='pwan-blue text-white'>
            <HeaderPage  
                :label='pageName'
                :hint='hint'  
              />
          </q-card-section> 
          <q-separator />
          <q-card-section>
          <div v-if='paymentEvidence' class='col-12 col-sm-12' style='display: flex; justify-content: center'>               
                  <img :src='paymentEvidence' alt='Preview' style='max-width: 300px' width='200px'  height='100%' />

          </div> 
          </q-card-section>
          <q-separator />
           <q-card-section> 
            <div class="text-h5 q-mb-md">Subscribed Product</div>
             <div class="row">
               <div class="col-sm-6 col-6">Name:</div> <div class="col-sm-6 col-6"><b>{{ subscriptionProduct.name }}</b></div>
              </div>
              <div class="row">
               <div class="col-sm-6 col-6">Address:</div> <div class="col-sm-6 col-6"><b>{{ subscriptionProduct.address }} </b></div>
              </div>
              <div class="row">
               <div class="col-sm-6 col-6">Product Unit Price:</div> <div class="col-sm-6 col-6"><b> {{ subscriptionProduct.amount }} </b></div>
              </div> 
              <div class="row">
               <div class="col-sm-6 col-6">Product Total Cost:</div> <div class="col-sm-6 col-6"><b> {{ subscriptionProduct.totalCost }} </b></div>
              </div> 
          </q-card-section>

           <q-card-section>       
            <div class="text-h5 q-mb-md">Realtor/PBO</div>
             <div class="row">
               <div class="col-sm-6 col-6">Name:</div> <div class="col-sm-6 col-6"><b>{{ realtor.last_name }} {{ realtor.first_name }} {{ realtor.middle_name }}</b></div>
              </div>
              <div class="row">
               <div class="col-sm-6 col-6">E-mail:</div> <div class="col-sm-6 col-6"><b>{{ realtor.email }} </b></div>
              </div>
              <div class="row">
               <div class="col-sm-6 col-6">Phone Number:</div> <div class="col-sm-6 col-6"><b>{{ realtor.phoneNumber }} </b></div>
              </div>
            </q-card-section>

          <q-card-section>             
             <div class="text-h5 q-mb-md">Subscriber/Client</div>
             <div class="row">
               <div class="col-sm-6 col-6">Name:</div> <div class="col-sm-6 col-6"><b>{{ subscriber.lastName }} {{ subscriber.firstName }} {{ subscriber.middleName }}</b></div>
              </div>
              <div class="row">
               <div class="col-sm-6 col-6">E-mail:</div> <div class="col-sm-6 col-6"><b>{{ subscriber.emailAddress }} </b></div>
              </div>
              <div class="row">
               <div class="col-sm-6 col-6">Phone Number:</div> <div class="col-sm-6 col-6"><b>{{ subscriber.phoneNumber }} </b></div>
              </div>
              <div class="row">
               <div class="col-sm-6 col-6">Subscription Date:</div> <div class="col-sm-6 col-6"><b>{{ subscription.date }}</b></div>
              </div> 
              <div class="row">
               <div class="col-sm-6 col-6">Payment Plan:</div> <div class="col-sm-6 col-6"><b>{{ paymentPlan }} </b></div>
              </div> 
               
          </q-card-section>
          <q-card-section>             
             <div class="text-h5 q-mb-md">Subscription Cost</div> 
             <div class="row" v-if="previousPayment > 0" >
               <div  class="col-sm-6 col-6">Previous Payment(s):</div> <div class="col-sm-6 col-6"><b>{{ subscription.previous }} </b></div>
              </div>
              <div class="row">
               <div class="col-sm-6 col-6">Current Payment:</div> <div class="col-sm-6 col-6"><b>{{ subscriptionPayment.amount }} </b></div>
              </div>
              <div class="row">
               <div class="col-sm-6 col-6">Total Payment:</div> <div class="col-sm-6 col-6"><b>{{ subscription.totalAmount }} </b></div>
              </div>
              <q-separator/>
              <div class="row">
               <div class="col-sm-6 col-6">Outstandig Balance: </div> <div class="col-sm-6 col-6"><b>{{ subscription.balance }}</b></div>
              </div> 
              <q-separator/>
               
          </q-card-section>


      <q-card-section> 
       <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />  
      </q-card-section>
      <q-card-section>
        <q-card-actions align='center'>
          <q-btn
            rounded
            size='md'
            color='primary'
            label='Cancel'
            v-close-popup
          />
          <q-btn
            label='Reject'
            class="pwan-red"
            @click='rejectRecord'
            size='md'
            rounded
            v-close-popup 
          />
          <q-btn
            label='Accept'
            color='secondary'
            @click='acceptRecord'
            size='md'
            rounded
            v-close-popup 
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template> 
<script>
import { LocalStorage, SessionStorage } from 'quasar';
import { ref, computed } from 'vue'; 
import axios from 'axios';
import path from 'src/router/urlpath'; 
import { useI18n } from 'vue-i18n'
import HeaderPage from 'src/components/HeaderPage.vue';   
import debug from 'src/router/debugger'; 
import DatePicker from 'src/components/DatePicker.vue';     
import ResponseDialog from 'src/components/ResponseDialog.vue';  
import { format } from 'date-fns';    

export default {
    components: {  
    HeaderPage,  
    debug,
    DatePicker,  
    ResponseDialog,
  },   
  name: 'SalesTransactionFormDialog',
  props: {
    onClick: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    searchValue: {
      type: String, // Specify the data type of the prop
      required: true, // Indicates whether the prop is required or not
    },
    action: {
      type: String,
      required: true,
    },
    actionLabel: {
      type: String,
      required: true,
    },
    urlLink: {
      type: String,
      required: true,
    },
  },
  data() {

     const { t } = useI18n() 
    const pageName = computed(()=> t('subscription.pagename'))
    const hint = computed(()=> t('subscription.hint'))
    const headers = SessionStorage.getItem('headers'); 
    const userEmail = LocalStorage.getItem('userEmail');

    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + 'px';
    const dialogHeight = controlHeight + 'px';  
    const  realtor = ref({}); 
    const  subscriber = ref({});   
    const  subscriptionPayment = ref({});    
    const subscriptionProduct = ref({}) ;
    const subscription = ref({});
   const formData = ref({ 
      createdBy: '',
      salesDate: new Date(),
    });

    
    const form = ref({
      label: '',
      width: '10px',
      height: '10px',
    });
    const showDialog = ref(false);
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
      showDialog,
      form,
      dialogWidth,
      dialogHeight, 
      headers,
      dense: true, 
      showSuggestions: false,
      userEmail,       
      pageName,
      hint,         
      realtor ,
      subscriber ,
      subscriptionPayment,
      subscriptionProduct,
      subscription,
      showFormDialog:false, 
      showMessageDialog:false,
      childRef, 
      paymentPlan : "",  
      paymentEvidence : null,
      previousPayment :0,

      
    };
  },
  methods: {
    
      acceptRecord(){  
      this.formData.subscriptionPayment = {id: this.subscriptionPayment.id}   
      this.formData.action = "approve"
      this.formData.version = this.subscriptionPayment.version;
      console.log(">>>>>>>>>>this.formData>>>>>>>>>>",this.formData)
      this.$emit('formDataSubmitted', this.formData); 
      this.showDialog = true; 
      },
       rejectRecord(){  
     
      this.formData.subscriptionPayment = {id: this.subscriptionPayment.id}   
      this.formData.action = "reject"
      this.formData.version = this.subscriptionPayment.version;
      console.log(">>>>>>>>>>this.formData>>>>>>>>>>",this.formData)   
      this.$emit('formDataSubmitted', this.formData); 
      this.showDialog = true; 
      },
        },
  beforeCreate() {
    debug('beforeCreate');
  },
  created() {
    debug('created');
  },
  beforeMount() {
    console.log('before Mount');
  },
  mounted() {  
    
  },
  unmounted() {
    debug('Calling unmounted>>>>>>>>>>');
    this.formData = { code: '', name: '' };
  },
  updated() {
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == 'edit' || this.action == 'view') {
      try {
        const requestParams = {
          params: {
            id: this.searchValue, 
          },
        };
        const promise = axios.get(this.urlLink, requestParams, this.headers);
        promise
          .then((response) => {
            // Extract data from the response
            console.log(">>>>>subscription data >>>>>",response.data)
            const result = response.data;
            if (result.success) {
              console.log(">>>>>result.data[0]>>>>>",result.data)
          this.paymentPlan = result.data.subscription.paymentPlan.name; 
          this.realtor = result.data.realtor;
          this.subscriber = result.data.subscriber;
          this.subscriptionPayment = result.data.payment;
          this.subscriptionProduct = result.data.product;
          this.subscription = result.data.subscription; 
          this.subscription.date = format(this.subscription.date, 'dd-MMM-yyyy') 
          const subPaymentAmt = this.subscriptionPayment.amount;
          const productUnitCost = this.subscriptionProduct.amount 
          this.subscriptionPayment.amount = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(this.subscriptionPayment.amount)
 
          
          this.subscription.totalAmount = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(this.subscription.amount)

          this.subscription.balance = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format( (this.subscription.quantity * productUnitCost) - this.subscription.amount)
          
          this.previousPayment = this.subscription.amount - subPaymentAmt
          this.subscription.previous = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(this.previousPayment)

        
          this.subscriptionProduct.amount =  new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(productUnitCost)

          this.subscriptionProduct.totalCost =  new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(this.subscription.quantity * productUnitCost)

                console.log("subscription",this.subscription,"subscriptionProduct>>>",this.subscriptionProduct,"realtor>>",this.realtor, "subscriber>>",this.subscriber, "subpayment>>>",this.subscriptionPayment)
            }

            this.paymentEvidence = 'data:image/jpeg;base64,' + this.subscriptionPayment.paymentEvidence;

          })
          .catch((error) => {
            debug(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      this.formData = { 
        createdBy: this.userEmail,
      };
    }
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
