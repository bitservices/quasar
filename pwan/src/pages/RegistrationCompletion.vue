<template>
  <q-page padding class='flex flex-center app-bg'>
    <q-card style='width: 600px'>
      <q-card-section class='pwan-blue text-white'>
        <HeaderPage  
            :label='pageName'
            :hint='hint'  
          />  
      </q-card-section>

      <q-card-section>
        <div>
          <q-form @submit.prevent='handleSubmit' ref='registrationForm'> 
             <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div>  
            <q-input
              filled
              bottom-slots
              v-model='formData.validationCode'
              label='Validation Code'
              :dense='dense'
              :rules='[validationCodeRule]' 
            > 
            </q-input>

            
              <q-btn rounded class='pwan-button top-margin full-width' icon='submit' label='Submit' type='submit' /> 
     
          </q-form>
        </div>
         <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />  
      </q-card-section> 
      
    </q-card>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'; 
import { useI18n } from 'vue-i18n'
import axios from 'axios';
import { LocalStorage, SessionStorage } from 'quasar'; 
import path from 'src/router/urlpath';   
import HeaderPage from 'src/components/HeaderPage.vue';  
import { useRouter } from 'vue-router';
import ResponseDialog from 'src/components/ResponseDialog.vue';   
import { validateCode } from 'src/validation/validation';

export default {
   components: { 
    HeaderPage, 
    ResponseDialog,
  }, 
  data() {
    const { t } = useI18n()  
    const pageName = computed(()=> t('userregistration.pagename'))
    const hint = computed(()=> t('userregistration.validationmsg'))
    const router = useRouter();
    const formData = ref({ 
      validationCode: '', 
      email : SessionStorage.getItem('sessionEmail'),
      password : SessionStorage.getItem('sessionPasswrod'),

    }); 
    const showMessageDialog = ref(false);
    const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {}, 
    });
    return {
      isPwd: ref(true),
      formData, 
      dense:false,
      pageName,
      hint,
      showSpinner: false,
      router,
      showMessageDialog,
      childRef, 
      validationCodeRule : value => validateCode(value), 

    };
  },
  methods : {
    handleSubmit() { 
     if (this.$refs.registrationForm.validate()) {
      this.showSpinner = true; 
      try {
         const promise = axios.post(path.USER_REGISTER_FINALIZE,
          {email : this.formData.email,validationCode:this.formData.validationCode}
        );
        promise
          .then((response) => {
            // Extract data from the respons 
          const result = response.data;
          console.log('>>>>>>>>>>>result>>>>>>>',result)
          if (result.success) { 
            const requestParam = {
                params :{
                  email : SessionStorage.getItem('sessionEmail')
                }
            }
            console.log('>>>>>>>>>>>>>email>>>>>>>',requestParam)
            const userPromise = axios.get(path.FIND_USER_BY_EMAIL,
                requestParam
                ); 
                userPromise.then((response) => {
                    if(response.data.success){ 
                        
                         this.authenticateUser();
                    }
                    

                })
            
            //this.router.push({ path: '/dashboard' });
          }else{
            console.log('>>>>>error result>>>>>>>',result)
              this.childRef = {
              message: result.message,
              label: 'Error',
              cardClass: 'bg-negative text-white error',
              textClass: 'q-pt-none',
              buttonClass: 'bg-white text-teal',
            };
            this.showSpinner = false;
            this.showMessageDialog = true;
          }
          })
          .catch((error) => {
             
             consle.log(error)
          }); 
      } catch (error) {
        console.error('Error submitting form:', error);
      }
     }
    },
    authenticateUser(){ 
        try {
          
      console.log('>>>>>>>password and email >>>',this.formData.password, this.formData.email)
        const promise = axios.post(path.USER_AUTHENTICATEE,
        
          {username:this.formData.email, password:this.formData.password}
        );
        promise
          .then((response) => {
            // Extract data from the respons 
          LocalStorage.set('userEmail', this.formData.email); 
          const authenticated = response.data['access']; 
          LocalStorage.set('token', response.data);
          const headers = {
            Authentication: 'Bearer ' + response.data['access'],
            'Access-Control-Allow-Origin': path.ORIGIN_PATH,
          };  
          SessionStorage.set('headers', headers); 
          if (authenticated) {
            // Redirect to the homepage or intended route  
            this.showSpinner = false;
            this.router.push({ path: '/userprofile' });
          }
          })
          .catch((error) => {
             
             consle.log(error)
          }); 
      } catch (error) {
        console.error('Error submitting form:', error);
      }

    }
   
  }, 
};
</script> 
