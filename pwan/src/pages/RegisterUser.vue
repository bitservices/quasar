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
          <q-form @submit.prevent='handleSubmit' ref='userRegistrationForm'> 
             <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div>  
            <q-input
              filled
              bottom-slots
              v-model='formData.email'
              label='Email'
              :dense='dense'
              :rules='[emailRule]'
            >
              <template v-slot:prepend>
                <q-icon name='email' />
              </template>
              <template v-slot:append>
                <q-icon
                  name='close'
                  @click='formData.email = ""'
                  class='cursor-pointer'
                />
              </template>
            </q-input> 

            <q-input
              v-model='formData.password'
              filled
              label='Password'
              :type='isPwd ? "password" : "text"'
              :rules='[passwordRule]' 
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
              filled
              bottom-slots
              v-model='formData.phoneNumber'
              label='Phone Number'
              :dense='dense'
              :rules='[validationPhoneRule]' 
            > 
            </q-input>


              <q-btn rounded class='pwan-button top-margin full-width' icon='register' label='Register' type='submit' /> 
     
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
import {  SessionStorage } from 'quasar'; 
import path from 'src/router/urlpath';   
import HeaderPage from 'src/components/HeaderPage.vue';  
import { useRouter } from 'vue-router';
import ResponseDialog from 'src/components/ResponseDialog.vue';   
import { validatePhoneNumber, validateEmail,validatePassword,validateConfirmPassword } from 'src/validation/validation';

export default {
   components: { 
    HeaderPage, 
    ResponseDialog,
  }, 
  data() {
    const { t } = useI18n()  
    const pageName = computed(()=> t('userregistration.pagename'))
    const hint = computed(()=> t('userregistration.hint'))
    const router = useRouter();
    const formData = ref({ 
      validationCode: '',
      password : '',
      email : '',

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
      validationPhoneRule : value => validatePhoneNumber(value),
      emailRule: value => validateEmail(value),
      passwordRule: value => validatePassword(value),
      confirmPasswordRule: value =>validateConfirmPassword(value, this.formData.password)


    };
  },
  methods : {
    handleSubmit() { 
     if (this.$refs.userRegistrationForm.validate()) {
      this.showSpinner = true; 
      try {
         const promise = axios.post(path.USER_REGISTER,
          {email : this.formData.email, password: this.formData.password, phoneNumber:this.formData.phoneNumber}
        );
        promise
          .then((response) => {
            // Extract data from the respons 
          const result = response.data;
          console.log('>>>>>>>>>>>result>>>>>>>',result)
          if (result.success) {  
              this.showSpinner = false;   
              SessionStorage.set('sessionEmail',this.formData.email)
              SessionStorage.set('sessionPasswrod',this.formData.password)
              
              this.router.push({ path: '/registrationcompletion'});
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
   
  }, 
};
</script> 
