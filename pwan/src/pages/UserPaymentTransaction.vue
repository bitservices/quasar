<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card
      class="card-flex-display" 
    >
      <q-card-section>
        <div class="row">
          <div class="col-8 text-h6">User PAyment Transaction</div>
          <div v-if="imageFile" class="col-4" style="display: flex; justify-content: flex-end">
                  <img :src="imageFile" alt="Preview" style="max-width: 100px" width="150px"  height="100px" />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.userId"
            :options="orgUsers"
            label="Select Member"
            @update:model-value="onChangeUser"
            :dense="dense"
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
            <div class="row">
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
                  />
              </div>
            </div>
          </div> 
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="center">
          <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          /> 
          <q-btn
            label="Reset"
            color="primary"
            @click="reloadPage"
            size="md"
            rounded
            v-close-popup
          />
          <q-btn
            label="Save"
            color="secondary"
            @click="saveRecord"
            size="md"
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
    </div>
  </q-page>
</template>


<script>
import { LocalStorage, SessionStorage } from "quasar";
import { isReadonly, onUnmounted, ref } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import debug from "src/router/debugger";
import ResponseDialog from "src/components/ResponseDialog.vue"; 
 
export default {
   components: { 
    ResponseDialog,
  },
  data() { 
   const profile = SessionStorage.getItem("turnelParams");
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
    };
  },
  methods: {
    reloadPage(){
      window.location.reload()
    },
    saveRecord() {      
        console.log(">>>>>>>>this.userPayments>>>>>>>>>>>>>>",this.userPayments)
    for (let i = 0; i < this.userPayments.length; i++) { 
          this.userPayments[i]["client"] = this.userPayments[i]["client"].code 
          this.userPayments[i]["organisation"] = this.userPayments[i]["organisation"].id 
          this.userPayments[i]["payerId"] = this.userPayments[i]["userId"].id 
          this.userPayments[i]["paymentMode"] = this.userPayments[i]["paymentMode"].value 
          this.userPayments[i]["paymentType"] = this.userPayments[i]["paymentType"].id  
          this.userPayments[i]["createdBy"] = this.profile.email
          this.userPayments[i]["status"] = "A"

      }
      try { 
        const promise = axios.post(path.USR_PAYMENT_TRANSACTION_CREATE, this.userPayments, this.headers);
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
            this.showMessageDialog = true; 
             setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
            
            
  
          })
          .catch((error) => {
            debug("Error:", error);
          });
      } catch (error) {
        debug("Error:", error);
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
      //this.imageFile = "data:image/jpeg;base64," + obj.imageSrc;
      
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
