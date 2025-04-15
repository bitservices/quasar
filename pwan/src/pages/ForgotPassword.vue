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
          <q-form @submit.prevent='handleSubmit' ref='forgotPassForm'> 
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
 
              <q-btn rounded class='pwan-button top-margin full-width' icon='save' label='Submit' type='submit' />  
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
import { SessionStorage } from 'quasar'; 
import path from 'src/router/urlpath';   
import HeaderPage from 'src/components/HeaderPage.vue';  
import { useRouter } from 'vue-router';  
import { validateEmail } from 'src/validation/validation';
import ResponseDialog from 'src/components/ResponseDialog.vue';   

export default {
   components: { 
    HeaderPage,
    ResponseDialog,
  }, 
  data() {
    const { t } = useI18n()  
    const pageName = computed(()=> t('forgotpassword.pagename'))
    const hint = computed(()=> t('forgotpassword.hint'))
    const router = useRouter();
    const formData = ref({
      email: '',  
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
      childRef,
      pageName,
      hint,
      showSpinner: false,
      showMessageDialog,
      router,  
      emailRule: value => validateEmail(value),
    };
  },
  methods : {
    handleSubmit() { 
       if (this.$refs.forgotPassForm.validate()) {
        this.showSpinner = true; 
        try {
          console.log('>>>>this.formData>>>>>>>>>>>>>',this.formData)
          const promise = axios.post(path.PASSWORD_CHANGE,
            this.formData
          );
          promise
            .then((response) => {
              // Extract data from the respons   
              const result = response.data;
              console.log('result>>>>>>',result)
            if (result.success) {  
              this.showSpinner = false;   
              SessionStorage.set('sessionEmail',this.formData.email)
              this.router.push({ path: '/passwordchange'});
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
    }
  }, 
};
</script> 
