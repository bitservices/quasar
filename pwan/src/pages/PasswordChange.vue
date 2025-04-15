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
          <q-form @submit.prevent='handleSubmit' ref='passwordChangeForm'> 
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
              required 
            > 
            </q-input>

            <q-input
              v-model='formData.password'
              filled
              label='New Password'
              :type='isPwd ? "password" : "text"'
              :rules='[passwordRule]'
              required 
            >
              <template v-slot:prepend>
                <q-icon name='lock' />
              </template>
              <template v-slot:append>
                <q-icon
                  :name='isPwd ? "visibility_off" : "visibility"'
                  class='cursor-pointer'
                  @click='isPwd = !isPwd'
                />
              </template>
            </q-input>

            <q-input
              v-model='formData.confirmPassword'
              filled
              label='Confirm Password'
              :type='isPwd ? "password" : "text"'
               :rules='[confirmPasswordRule]'
              required 
            >
              <template v-slot:prepend>
                <q-icon name='lock' />
              </template>
              <template v-slot:append>
                <q-icon
                  :name='isPwd ? "visibility_off" : "visibility"'
                  class='cursor-pointer'
                  @click='isPwd = !isPwd'
                />
              </template>
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
import { validateCode,validateEmail,validatePassword,validateConfirmPassword } from 'src/validation/validation';

export default {
   components: { 
    HeaderPage, 
    ResponseDialog,
  }, 
  data() {
    const { t } = useI18n()  
    const pageName = computed(()=> t('passwordchange.pagename'))
    const hint = computed(()=> t('passwordchange.hint'))
    const router = useRouter();
    const formData = ref({ 
      validationCode: '',
      password : '',
      email : SessionStorage.getItem('sessionEmail'),

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
      emailRule: value => validateEmail(value),
      passwordRule: value => validatePassword(value),
      confirmPasswordRule: value =>validateConfirmPassword(value, this.formData.password)

    };
  },
  methods : {
    handleSubmit() { 
     if (this.$refs.passwordChangeForm.validate()) {
      this.showSpinner = true; 
      try {
         const promise = axios.post(path.PASSWORD_FINALIZE,
          {email : this.formData.email, password: this.formData.password, validationCode:this.formData.validationCode}
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
                  console.log('>>>>>>response>>>>>>>>>>>>>>>',response)
                    if(response.data.success){ 
                        
                        const userData = response.data.data; 
                        if((userData.last_name == null || userData.last_name.trim()=='') || 
                        (userData.first_name == null || userData.first_name.trim()=='')){
                            this.router.push({ path: '/userprofile'});
                        }else{

                            this.authenticateUser();
                        }
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
             console.log(error)
          }); 
      } catch (error) {
        console.error('Error submitting form:', error);
      }
     }
    },
    authenticateUser(){ 
        try {
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
            this.router.push({ path: '/dashboard' });
          }
          })
          .catch((error) => {
             console.log(error)
          }); 
      } catch (error) {
        console.error('Error submitting form:', error);
      }

    }
   
  }, 
};
</script> 
