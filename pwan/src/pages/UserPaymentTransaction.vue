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
          <q-toggle
              v-model="toggleValue"
              :label="toggleLabel"
              @update:model-value="onToggleChange"
            />
            <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
        </div>
      <q-card  v-if="toggleValue"
      class="card-flex-display" 
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
          <q-select
            filled
            bottom-slots
            v-model="formData.userId"
            :options="orgUsers"
            label="Select Member"
            @update:model-value="onChangeUser"
            :dense="dense"
            :readonly="isreadonly"
            :rules="[requiredRule]" 
          />
           <q-select
            filled
            bottom-slots
            v-model="formData.payment"
            :options="paymentTypes"
            label="Select Payment Type"
            @update:model-value="onChangePayment"
            :dense="dense"
          />
          
          <div v-for="(field, index) in userPayments" :key="index"> 
            <div class="row" v-if="field.amount >= 0  ">
               <q-input
                  v-model="field.id"
                  type="hidden"
                />
              <div class="col-3">{{field.paymentType.name}}</div>
              <div class="col-3">{{field.currentDebit}}</div>
               <div class="col-3"> 
              <q-input 
                filled
                bottom-slots
                v-model="field.amount" 
                placeholder="Payable Amount"
                type="number"
                :dense="dense"
                :rules="[amountRule]" 
              />
              </div>
               <div class="col-3"> 
                  <q-select
                    filled
                    bottom-slots
                    v-model="field.paymentMode"
                    :options="paymentModes"
                    label="Select Payment Mode" 
                    :dense="dense"
                    :rules="[requiredRule]" 
                  />
              </div>
            </div>
          </div> 
           <q-card-actions align="center"> 
              <q-btn
                label="Reset"
                class="pwan-blue"
                @click="reloadPage"
                size="md"
                rounded
                v-close-popup
              />
              <q-btn
                class="pwan-button"
                label="Save" 
                type="submit"
                size="md"
                rounded
                v-close-popup
              />
        </q-card-actions>
        </q-form>
      </q-card-section> 
    </q-card>
    <q-card v-else class="q-mt-md">  
          <QRCodeScanner ref="qrcodescanner"
            @scannedDataSubmitted="readScanCode"
            />
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
import QRCodeScanner from "src/components/QRCodeScanner.vue";
 
export default {
   components: { 
    ResponseDialog,
    HeaderPage,
    QRCodeScanner,
  },
  data() { 
     const { t } = useI18n() 
    const pageName = computed(()=> t('userpayment.pagename'))
    const hint = computed(()=> t('userpayment.hint'))
    const showSpinner = ref(false); 
   const profile = LocalStorage.getItem("turnelParams");
    const headers = SessionStorage.getItem("headers");
    const showMessageDialog = ref(false);
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
      orgUsers:[],
      userPayments:[], 
      paymentModes:[],
      childRef, 
      paymentTypes:[],
      backupPayments:[],
      isreadonly:false,
      requiredRule: value => isRequired(value), 
      inputRequiredRule: value => inputFieldRequired(value),  
      amountRule: value => amountFieldRule(value), 
      toggleValue:ref(false), 
      toggleLabel:"Record Payment By Scanning Member QR Code",
      pageName,
      hint, 
      showSpinner,
    };
  },
  methods: {
    onToggleChange(value){  
      if(value){
        this.toggleLabel = "Record Payment By Selecting Member"
      }else{ 
         this.toggleLabel = "Record Payment By Scanning QR Code"
      }
        if(this.$refs.qrcodescanner != null)
          this.$refs.qrcodescanner.stopCamera();
    },
     readScanCode(record){
      let data = JSON.parse(record); 
      console.log(data)

        const userData = { 
        value : data.id,
        label:data.name,
      } 
      this.formData.userId =  userData;
      this.toggleValue = true;
     this.onChangeUser(userData);

   },
    reloadPage(){
      window.location.reload()
    },
    saveRecord() {   
      if (this.$refs.userPaymentForm.validate()) {
          this.showSpinner= true  
          let data = [];  
          for (let i = 0; i < this.userPayments.length; i++) { 
              if(this.userPayments[i]["amount"]  > 0){ 
                console.log("amount>>>",this.userPayments[i]["amount"])  
                let item = {
                  client: this.userPayments[i]["client"].code,
                  organisation :  this.userPayments[i]["organisation"].id ,
                  payerId : this.userPayments[i]["userId"].id ,
                  paymentMode : his.userPayments[i]["paymentMode"].value ,
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
   
    loadOutStandingPayment(params){
       const promise =  axios.get(
          path.USR_OUTSTANDING_PAYMENT_SEARCH,
          params,
          this.headers
        );  
         promise
          .then((response) => {

              console.log("result payment >>>>>>>",response.data.data)
            for (let i = 0; i < response.data.data.length; i++) {
              response.data.data[i]["amount"] = response.data.data[i]["currentDebit"]
              response.data.data[i]["paymentMode"] = ""
            }     

            this.userPayments = response.data.data
            if(this.backupPayments.length == 0){ 
              this.backupPayments = [...this.userPayments]
            }
          })
          .catch((error) => {
            console.log("result payment >>>>>>>",response.data.data)
            console.log(error);
          }); 
    },
    loadUserImage(id){
      console.log(">>>>>>>inside loadUserImage>>>>>>>>>")
       const requestParam = {
        params: {
          userId: id, 
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
    onChangeUser(obj) {
      console.log(">>>>>>>>obj>>>>>>>>>>>",obj); 
      try {
       this.loadUserImage(obj.value)
       const requestParam = {
      params: {
        userId: obj.value,
        year : new Date().getFullYear(),
        client: this.profile.client,
        organisation: this.profile.organisation,
      },
    };  
          this.loadOutStandingPayment(requestParam)  
 
      } catch (error) {
        console.error("Error:", error);
      } 
    },

    onChangePayment(payment){
        console.log(payment)
        console.log("this.backupPayments 1111>>>>>>>>>",this.backupPayments)
        let containsPaymentType = false
        for (let i = 0; i < this.backupPayments.length; i++) {
            console.log("userpayemnts paymentType >>>>>>>>",this.backupPayments[i]["paymentType"]["id"])
            console.log("payment value  >>>>>>>>",payment["value"])
              if(this.backupPayments[i]["paymentType"]["id"] == payment["value"]){
                  containsPaymentType = true
              }
            }    
        if(containsPaymentType){
          try {
            const requestParam = {
            params: {
              userId: this.formData.userId.value,
              year : new Date().getFullYear(),
              client: this.profile.client,
              organisation: this.profile.organisation,
              paymentType : payment["value"],
            },
          };  
          this.loadOutStandingPayment(requestParam)
          } catch (error) {
            console.error("Error:", error);
          } 
        }else{ 
            this.userPayments[0].paymentType.name=payment["label"]
            this.userPayments[0].paymentType.id=payment["value"]
            this.userPayments[0].currentDebit="Free Will Donation"
            this.userPayments[0].amount=0.00
            this.userPayments = [this.userPayments[0]] 

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
    console.log("before Mount");
  },
  mounted() {
    console.log(">>>>>>>>>mounted>>>>>>>>>>");
    try {
       const requestParams = {
      params: {
        client: this.profile.client,
        organisation: this.profile.organisation,
      },
    };
         const promise =  axios.get(
          path.ORGUSER_SEARCH,
          requestParams,
          this.headers
        ); 
         console.log(">>>>>>>>promise>>>>>>>",promise)
         promise
          .then((response) => {
          this.orgUsers = response.data.data.map((option) => (
          {
          label:
            option.userId.last_name +
            " " +
            option.userId.first_name +
            " " +
            option.userId.middle_name,
          value: option.userId.id,
        })); 
          })
          .catch((error) => {
            console.log(error);
          });

        
      const paymentModePromise =  axios.get(
          path.PAYMENTMODE_SEARCH, 
          this.headers
        ); 
         console.log(">>>>>>>>paymentModePromise>>>>>>>",paymentModePromise)
         paymentModePromise
          .then((response) => {
          this.paymentModes = response.data.data.map((option) => (
          {
          label: option.name,
          value: option.code, 
        }));
        console.log("paymentModes>>>>>>>>>", this.paymentModes);
          })
          .catch((error) => {
            console.log(error);
          });
      
        axios
        .get(path.PAYMENTTYPE_SEARCH, requestParams, this.headers)
        .then((response) => {
          console.log("Payment Type Response >>>>>>>>>>>>", response.data); 
          this.paymentTypes = response.data.data.map((option) => ({
            label: option.name,
            value: option.id,
          }));
          console.log("this.Payment Type >>>>>>>>>>>>", this.PaymentTypes);
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
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
