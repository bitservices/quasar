<template>
  <q-page padding>
    <q-card
      class="card-flex-display" 
    >  
          <q-card-section class="pwan-blue text-white">
            <HeaderPage  
                :label="pageName"
                :hint="hint"  
              />
          </q-card-section> 
      <q-card-section>
         <q-form @submit.prevent="sendMessage" ref="sendMsgForm">
            <div class="text-center"> 
                <q-spinner v-if="showSpinner" color="primary" size="60px" />
            </div>  
          <div class="row">
            <div class="col-8"></div> 
            <div  class="col-4" style="display: flex; justify-content: flex-end">
              <q-badge rounded :label="`Unit(s):   `+requiredUnit" class="pwan-btton text-h6" />
            </div>
          </div> 
   
           <div v-for="(channel, index) in messageChannels" :key="index">
              <div class="q-gutter-sm"> 
                <q-radio 
                  v-model="messageChannel"  
                  color="primary"
                  @click="chooseMessageChannel"
                  :val="channel.code"
                />{{channel.name}} ({{channel.unitPrice}})
              </div> 
            </div> 

                <q-input v-if="messageChannel == 'EMAIL' "
              filled
              bottom-slots
              v-model="formData.subject"
              label="Subject"
              type="text" 
              :rules="[inputFieldRule]"
            />

            <q-input
              filled
              bottom-slots
              v-model="formData.message"
              label="message"
              type="textarea"
              rows="4"
              maxlength="1000"
              @change="handleeNessageChange"
              :rules="[inputFieldRule]"
              counter 
            />
         

            <q-card-actions align="center">              
              <q-btn
                class="pwan-button top-margin full-width"
                label="Send Message"  
                type="submit" 
              />
            </q-card-actions>
        </q-form>
        <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
      </q-card-section>
     
    </q-card> 
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref,computed } from "vue";  
import path from "src/router/urlpath";
import { useI18n } from 'vue-i18n'
import HeaderPage from "src/components/HeaderPage.vue"; 
import ResponseDialog from "src/components/ResponseDialog.vue";
import { isRequired,inputFieldRequired } from 'src/validation/validation';  
export default {
    components: {  
    HeaderPage, 
    ResponseDialog,
  },
  
  data() {
     const { t } = useI18n() 
    const pageName = computed(()=> t('sendmsg.pagename'))
    const hint = computed(()=> t('sendmsg.hint'))
    const headers = SessionStorage.getItem("headers"); 
    const profile = LocalStorage.getItem("turnelParams");
    const userEmail = LocalStorage.getItem("userEmail");
     
   
    const selected = ref([]);
    const formData = ref({
      client:profile.client,
      organisation:profile.organisation,
      createdBy : profile.email,
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
       
      userEmail,
      headers, 
      formData,
      profile,
      dense:true, 
      messageChannels:[],
      messageChannel: ref(""),
      pageName,
      hint,   
      requiredUnit:1,  
      inputFieldRule: value => inputFieldRequired(value), 
      showSpinner:false,
      showMessageDialog:false,
      childRef,
                
    };
  },
  methods: {
    chooseMessageChannel(){ 
      
      this.resolveRequiredUnit()
    },
    resolveRequiredUnit(){
      console.log(">>>>>>this.formData.message>>>>>>",this.formData.message)
       const msgLen =  this.formData.message == null ? 0 : this.formData.message.length; 
       console.log(">>>>>>msgLen>>>>>>>>>>",msgLen)
        if(this.messageChannel == "SMS" &&  msgLen > 160){
          this.requiredUnit = Math.ceil(msgLen/160) 
        }else{
           this.requiredUnit = 1
        }
    },
    handleeNessageChange(){ 
        this.resolveRequiredUnit()

    },
     
    async  sendMessage(){ 
      if (this.$refs.sendMsgForm.validate()) {
          this.showSpinner= true   
          this.formData.messageChannel = this.messageChannel;
          this.formData.requiredUnit = this.requiredUnit
          
          console.log("the form is valid>>>>>>>>",this.formData);
         const promise = axios.post(path.SEND_MESSAGE, this.formData, this.headers);
                promise
                  .then((response) => {
                    // Extract data from the response
                    const result = response.data;   
                    console.log(">>>>>>result>>>>>>>",result)
                    if(result.success){
                       this.childRef = {
                        message: result.message,
                          label: "Success",
                          cardClass: "bg-positive text-white",
                          textClass: "q-pt-none",
                          buttonClass: "bg-white text-teal",
                        };
                    }else{
                       this.childRef = {
                        message: error.message,
                        label: "Error",
                        cardClass: "bg-negative text-white error",
                        textClass: "q-pt-none",
                        buttonClass: "bg-white text-teal",
                      }
                    }
                    
                    this.showSpinner = false;  
                    this.showMessageDialog = true;
                  })
                  .catch((error) => { 
                      this.childRef = {
                      message: error.message,
                      label: "Success",
                      cardClass: "bg-negative text-white error",
                      textClass: "q-pt-none",
                      buttonClass: "bg-white text-teal",
                    }; 
                  }); 
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
    console.log(">>>>>>>>>user Email >>>>>", this.userEmail);
  },
  mounted() {
    console.log(">>>>>>>>>mounted>>>>>>>>>>");
    try {  
         const promise =  axios.get(
          path.MESSAGINGCHANNEL_SEARCH, 
          this.headers
        ); 
         promise
          .then((response) => {
            console.log(">>>>>response.data.data>>>>>>>",response.data.data)
          this.messageChannels = response.data.data
          this.messageChannel = response.data.data[0].code
          console.log("tis.messagecannel>>>>>>>",this.messageChannel)
          
         console.log(">>>>>>>>this.messageChannel>>>>>>>",this.messageChannels)
          })
          .catch((error) => {
            console.log(error);
          });
         
      } catch (error) {
        console.error("Error:", error);
      }
  },
  updated() {},
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
