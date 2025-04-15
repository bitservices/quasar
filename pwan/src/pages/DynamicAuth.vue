<template>
  <q-page padding>
    <div class='q-pa-md'>
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
        <q-form  @submit.prevent='saveRecord' ref='userDanForm'>
          <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div>  
            <q-select
            filled
            bottom-slots
            v-model='formData.danType'
            :options='danTypeList'
            label='Choose DanType'  
            :dense='dense'  
          /> 
          <q-input
            filled
            bottom-slots
            v-model='formData.baseNumber'
            label='Choose Base Number'
            type='number'
            step='1'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.otp'
            label='OTP'
            type='text' 
          />
           <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />
          
           <q-card-actions align="center">
              <q-btn
                      rounded  
                      label='Cancel'
                      icon='cancel'
                      v-close-popup
                      class='pwan-blue top-margin'
                    />  
               <q-btn
                          label='Save' 
                          rounded
                          type='submit'
                          icon='save'
                          class='pwan-button top-margin'
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
import { LocalStorage, SessionStorage } from 'quasar';
import {  computed, ref } from 'vue'; 
import { useI18n } from 'vue-i18n'
import axios from 'axios';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger'; 
import { useRouter } from 'vue-router'; 
import HeaderPage from 'src/components/HeaderPage.vue'; 

import ResponseDialog from 'src/components/ResponseDialog.vue'; 
import Done from 'src/components/Done.vue'; 
import { inputFieldRequired } from 'src/validation/validation';  

export default {
   components: { 
    HeaderPage, 
    ResponseDialog,  
    Done,
  }, 
   
  data() {
    
    const { t } = useI18n()  
    const pageName = computed(()=> t('dannumber.pagename'))
    const hint = computed(()=> t('dannumber.hint'))
    const router = useRouter();
    const headers = SessionStorage.getItem('headers'); 
    const profile = LocalStorage.getItem('turnelParams'); 
    
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const formData = ref({
      baseNumber: '', 
       
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
      danTypeList:[],
      router,
      showSpinner: false, 
      pageName,
      hint,
      requiredRule: value => inputFieldRequired(value), 
      profile,  
      childRef,
      showFormDialog,
      showMessageDialog,
    };
  },
  methods: {
    saveRecord() {     
       if (this.$refs.userDanForm.validate()) {
          this.showSpinner = true; 
          this.formData.user = LocalStorage.getItem('userEmail'); 
           this.formData.organisation = this.profile.organisation;
          this.formData.client = this.profile.client; 
          this.formData.danType  = this.formData.danType.value;
          this.formData.email = this.profile.email;
          console.log('>>>>>>>>Saving formdata>>>>>>>>>>>>',this.formData)
          try {  
            const promise = axios.post(path.DYNAMICNUMBER_CREATE, this.formData, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                const result = response.data;  
                console.log(">>>>>result>>>>>>",result)
                if (result.success) {    
                   this.childRef = {
                    message: response.data.message,
                    label: 'Success',
                    cardClass: 'bg-positive text-white',
                    textClass: 'q-pt-none',
                    buttonClass: 'bg-white text-teal',
                  };
                 
                }else{
                  this.childRef = {
                      message: error.message,
                      label: 'Faliure',
                      cardClass: 'bg-negative text-white error',
                      textClass: 'q-pt-none',
                      buttonClass: 'bg-white text-teal',
                    }; 
                }

                   this.showMessageDialog = true;
                  this.showSpinner = false;   
    
                // You can access properties of the response data as needed
              })
              .catch((error) => {
                debug('Error:', error);
                this.childRef = {
                      message: error.message,
                      label: 'Faliure',
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
                label: 'Faliure',
                cardClass: 'bg-negative text-white error',
                textClass: 'q-pt-none',
                buttonClass: 'bg-white text-teal',
              }; 
              this.showSpinner = false; 
              this.showMessageDialog = true;
          }
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
     
     axios
      .get(path.DYNAMICTYPE_SEARCH)
      .then((response) => { 
        console.log('>>>>>response>>>>>>',response)
        this.danTypeList = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        })); 
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });


      const requestData = {email:this.profile.email};
      console.log(">>>>request data>>>>>>",requestData)
      axios
      .post(path.DANVALIDATE_CREATE, requestData, this.headers)
      .then((response) => { 
        console.log('>>>>>response>>>>>>',response) 
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
       
      

        
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
