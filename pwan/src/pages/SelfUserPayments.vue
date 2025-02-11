<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card>
          <q-card-section class="pwan-blue text-white">
            <HeaderPage  
                :label="pageName"
                :hint="hint"  
              />
          </q-card-section>
        </q-card>
        <div class="text-center"> 
                <q-spinner v-if="showSpinner" color="primary" size="60px" />
        </div>
         <div class="q-pa-md q-gutter-lg"> 
            <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
        </div>
      <q-card   class="card-flex-display" 
    >
      <q-card-section>
        <div class="row">
          <div class="col-8 text-h6"></div>
          <div v-if="imageFile" class="col-4" style="display: flex; justify-content: flex-end">
                  <img :src="imageFile" alt="Preview" style="max-width: 100px" width="150px"  height="100px" />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="saveRecord" ref="userPaymentForm">
           
          <div class="row">
            <div class="col-8"></div> 
             <div  class="col-4" style="display: flex; justify-content: flex-end">
               <q-badge rounded :label="`N `+sumAmountStr" class="pwan-btton text-h6" />
              </div>
            </div>
          <div v-for="(field, index) in userPayments" :key="index"> 
            <div class="row" v-if="field.amount >= 0  ">
               <q-input
                  v-model="field.id"
                  type="hidden"
                />
              
              <div class="col-6">
                <q-checkbox 
                v-model="field.checked"  
                :ref="`checkbox-${field.id}`" 
                color="primary"
                @click="choosePaymentItem"
              />{{field.paymentType.name}}({{field.year}})</div>
              <div class="col-2">{{field.currentDebit}}</div>
               <div class="col-4"> 
              <q-input 
                filled
                bottom-slots
                class="amount"
                v-model="field.amount" 
                placeholder="Payable Amount"
                type="number"
                :dense="dense"  
                :readonly="!field.checked"
                :rules="[amountRule]" 
                @change="handleAmountChange(index,field)"
                :ref="`input-`+field.id"
                :id="`input-`+index"
              />
              </div>
            </div>
          </div> 
           <q-card-actions align="center"> 
               <div v-for="(channel, index) in integrationChnnels" :key="index"> 
                <div class="row full-width"> 
                  <q-btn :label="`Pay with `+channel.paymentChannel.name" class="pwan-button top-margin full-width" @click="proceedToPayment(channel.publicKey,channel.paymentChannel.code)" />
              </div><q-space/>
            </div>
        </q-card-actions>
        </q-form>
      </q-card-section> 
    </q-card>
   
    </div>
  </q-page>
</template>


<script> 
import { useI18n } from 'vue-i18n'
import HeaderPage from "src/components/HeaderPage.vue"; 
import { LocalStorage, SessionStorage } from "quasar";
import { isReadonly, onUnmounted, ref,computed } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import debug from "src/router/debugger";
import ResponseDialog from "src/components/ResponseDialog.vue"; 
import { isRequired,amountFieldRule } from 'src/validation/validation';   
import $ from 'jquery';
 
export default {
   components: { 
    ResponseDialog,
    HeaderPage, 
  },
  data() { 
     const { t } = useI18n() 
    const pageName = computed(()=> t('selfpayment.pagename'))
    const hint = computed(()=> t('selfpayment.hint'))
    const organisation = computed(()=>  this.$route.params.orgCode)
    const client = computed(()=>  this.$route.params.clientCode) 
    const userEmail = LocalStorage.getItem("userEmail");  
    const showSpinner = ref(false);  
    const headers = SessionStorage.getItem("headers");
    const showMessageDialog = ref(false);
    const profile = LocalStorage.getItem("userEmail");  
    const formData = ref({
      last_name: "",
      middle_name: "",
      first_name: "", 
    });
    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
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
      integrationChnnels:[],
      userPayments:[], 
      childRef,  
      backupPayments:[],
      isreadonly:false,
      requiredRule: value => isRequired(value), 
      inputRequiredRule: value => inputFieldRequired(value),  
      amountRule: value => amountFieldRule(value),  
      pageName,
      hint, 
      showSpinner,
      checked:true,
      organisation,
      client,
      userEmail,
      sumAmount:0,
      sumAmountStr:"0.00"
    };
  },
  methods: {
    choosePaymentItem(){
      var amount = 0
      for (let i = 0; i < this.userPayments.length; i++) {  
              if(this.userPayments[i]["amount"]  > 0 && this.userPayments[i].checked ){ 
                
                amount += parseFloat(this.userPayments[i]["amount"])
            }  
      }
      this.sumAmount = amount;
      this.sumAmountStr = new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(amount); 
    },
    handleAmountChange(index, obj){ 
       var amount = 0
      for (let i = 0; i < this.userPayments.length; i++) {  
              if(this.userPayments[i]["amount"]  > 0 && this.userPayments[i].checked ){ 
                
                amount += parseFloat(this.userPayments[i]["amount"])
            }  
      }
      this.sumAmount = amount; 
      this.sumAmountStr = new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(amount);
    }, 
     
    reloadPage(){
      window.location.reload()
    },
    saveRecord() {   
      if (this.$refs.userPaymentForm.validate()) {
          this.showSpinner= true  
          let data = [];  
          for (let i = 0; i < this.userPayments.length; i++) {  
              if(this.userPayments[i]["amount"]  > 0 && this.userPayments[i].checked ){ 
                console.log("amount>>>",this.userPayments[i]["amount"])  
                let item = {
                  client: this.userPayments[i]["client"].code,
                  organisation :  this.userPayments[i]["organisation"].id ,
                  payerId : this.userPayments[i]["userId"].id ,
                  paymentMode : this.userPayments[i]["paymentMode"].value ,
                  paymentType : this.userPayments[i]["paymentType"].id ,
                  createdBy : this.profile.email,
                  amount : this.userPayments[i]["amount"],
                  id : this.userPayments[i]["id"],
                  status : "A"
                }           
                data.push(item)
              }
            }
          try { 
            console.log("data>>>>>>>",data)

            if(data.length == 0){ 
               this.childRef = {
                  message: "No Record(s) selected",
                  label: "Error",
                  cardClass: "bg-negative text-white error",
                  textClass: "q-pt-none",
                  buttonClass: "bg-white text-teal",
                }; 
                 this.showSpinner = false;
                this.showMessageDialog = true;
              return 
            }
            const promise = axios.post(path.USR_PAYMENT_TRANSACTION_CREATE, data, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                const result = response.data;  
                if (result.success) {  
                  
                  this.childRef = {
                  message: result.message,
                  label: "Success",
                  cardClass: "bg-positive text-white",
                  textClass: "q-pt-none",
                  buttonClass: "bg-white text-teal",
                }; 
                setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }else{
                   this.childRef = {
                  message: result.message,
                  label: "Success",
                  cardClass: "bg-negative text-white error",
                  textClass: "q-pt-none",
                  buttonClass: "bg-white text-teal",
                }; 
                }
                this.showSpinner = false;
                this.showMessageDialog = true;
                
      
              })
              .catch((error) => {
                debug("Error:", error);
                  this.childRef = {
                  message: error.message,
                  label: "Success",
                  cardClass: "bg-negative text-white error",
                  textClass: "q-pt-none",
                  buttonClass: "bg-white text-teal",
                }; 
                this.showSpinner = false;
                this.showMessageDialog = true;
              });
          } catch (error) {
            debug("Error:", error);
              this.childRef = {
                  message: error.message,
                  label: "Success",
                  cardClass: "bg-negative text-white error",
                  textClass: "q-pt-none",
                  buttonClass: "bg-white text-teal",
                }; 
                this.showSpinner = false;
                this.showMessageDialog = true;
          }
          
      }
      
    },
    proceedToPayment(publicKey, channel){
       console.log(">>>>>>>>channel>>>>>>>",channel)
       this.logPaymentItems(publicKey,channel)
    },
    loadOutStandingPayment(){
       const params = {
            params: {
              username: this.userEmail, 
              client: this.client,
              organisation: this.organisation,
            },
          };  
       const promise =  axios.get(
          path.USR_OUTSTANDING_PAYMENT_SEARCH,
          params,
          this.headers
        );  
         promise
          .then((response) => {

              console.log("result payment >>>>>>>",response.data.data)
            for (let i = 0; i < response.data.data.length; i++) {
              response.data.data[i]["amount"] = response.data.data[i]["currentDebit"] == 0 ? -1 : response.data.data[i]["currentDebit"]
              response.data.data[i]["paymentMode"] = ""
            }     

            this.userPayments = response.data.data
            if(this.backupPayments.length == 0){ 
              this.backupPayments = [...this.userPayments]
            }
          })
          .catch((error) => { 
            console.log(error);
          }); 
    },
    loadUserImage(email){
      console.log(">>>>>>>inside loadUserImage>>>>>>>>>")
       const requestParam = {
        params: {
          username: email, 
        },
      };  
      const promise =  axios.get(
          path.USER_IMAGE,
          requestParam,
          this.headers
        );  
         promise
          .then((response) => {
 
            this.imageFile = "data:image/jpeg;base64," + response.data.data.imageByte;
          })
          .catch((error) => {
            console.log(error);
          }); 
    },
     loadPaymentChannel(){
       const params = {
            params: {  
              client: this.client,
              organisation: this.organisation,
            },
          };  
       const promise =  axios.get(
          path.PAYMENTINTEGRATION_SEARCH,
          params,
          this.headers
        );  
         promise
          .then((response) => {

                this.integrationChnnels = response.data.data
              console.log("this.ntegrationChnnels>>>>>>>",this.ntegrationChnnels)
            
          })
          .catch((error) => { 
            console.log(error);
          }); 
    },
    logPaymentItems(publicKey,paymentChannel){
        console.log(">>>>>>>publicKey>>>>",publicKey)
      let paymentItems = [];  
          for (let i = 0; i < this.userPayments.length; i++) {  
              if(this.userPayments[i]["amount"]  > 0 && this.userPayments[i].checked ){  
                let item = {
                  client: this.userPayments[i]["client"].code,
                  organisation :  this.userPayments[i]["organisation"].id ,
                  payerId : this.userPayments[i]["userId"].id ,
                  paymentMode : "O" ,
                  paymentType : this.userPayments[i]["paymentType"].id ,
                  createdBy : this.userEmail,
                  amount : this.userPayments[i]["amount"],
                  id : this.userPayments[i]["id"],
                  status : "A"
                }           
                paymentItems.push(item)
              }
          }
          if(paymentItems.length > 0){
            let data = {"paymentItems":JSON.stringify(paymentItems),  "totalAmount":this.sumAmount, "createdBy":this.userEmail, 
            "payerId":paymentItems[0].payerId, "paymentStatus":"P", "paymentChannel":paymentChannel}
          console.log("data>>>>>>>",data) 
           const promise = axios.post(path.PAYMENTINTEGRATIONLOG_CREATE, data, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                const result = response.data;  
                 
                if (result.success) {  
                    if(paymentChannel=="PAYSTACK") {  
                      this.payWithPaystack(publicKey,result.data);
                    } else if(paymentChannel=="REMITA"){
                        this.payWithPaystack(publicKey,result.data);
                    }
                } 
                this.showSpinner = false;  
              })
              .catch((error) => {
                debug("Error:", error);
                  this.childRef = {
                  message: error.message,
                  label: "Success",
                  cardClass: "bg-negative text-white error",
                  textClass: "q-pt-none",
                  buttonClass: "bg-white text-teal",
                }; 
                this.showSpinner = false; 
              });
          } else{
               
                  this.childRef = {
                  message: "No Record Selected for Payment",
                  label: "Success",
                  cardClass: "bg-negative text-white error",
                  textClass: "q-pt-none",
                  buttonClass: "bg-white text-teal",
                }; 
                this.showSpinner = false;
                this.showMessageDialog = true;
                return 
          }
    },
    updatePaymentIntegrationLog(){
        console.log(">>>>>>>>>>update log>>>>>>>>>>>")
    },
    completePaymentTransaction(data, response){
      try{
              this.showSpinner = true;
              let paymentItems = JSON.parse(data.paymentItems); 
              paymentItems.forEach(item => { 
                item.referenceNumber = response.reference,
                item.transactionReference = response.transaction
              });  
              console.log(">>>>>>>>paymentItems 2222 >>>>>>>>>>>>>>",paymentItems) 
              const referenceNumber = response.reference;
              const transactionReference = response.transaction;
              const amount = data.totalAmount; 
              const promise = axios.post(path.USR_PAYMENT_TRANSACTION_CREATE, paymentItems, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                const result = response.data;  
                console.log(">>>>>>>>result>>>>>>>>>",result)
                if (result.success) {  
                  
                  try { 
                    const record = {"referenceNumber":referenceNumber, "transactionReference":transactionReference, "totalAmount":amount, "paymentStatus":"A" }
                    const promise = axios.put(path.PAYMENTINTEGRATIONLOG_UPDATE, record, this.headers);
                    promise
                      .then((response) => {
                          setTimeout(() => {
                          window.location.reload();
                        }, 2000);
                      })
                      .catch((error) => {
                        childRef.value = {
                          message: error.message,
                          label: "Error",
                          cardClass: "bg-negative text-white error",
                          textClass: "q-pt-none",
                          buttonClass: "bg-white text-teal",
                        };
                        showMessageDialog.value = true;
                      });
                  } catch (error) {
                    console.error("Error:", error);
                  } 
                // setTimeout(() => {
                //     window.location.reload();
                //   }, 2000);
                } 
              })
            }catch(error){
              console.log(">>>error>>>>>>>",error)
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
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("before Mount");
  },
  mounted() { 
    try { 
        this.loadUserImage(this.userEmail); 
          this.loadOutStandingPayment();
          this.loadPaymentChannel();
 
      
      } catch (error) {
        console.error("Error:", error);
      }

        
  },
  unmounted() { 
     
  },
  updated() {
    console.log(">>>>>>>>>>>update>>>>>>") 
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
