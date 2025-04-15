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
        <div class='row'>
          <div class='col-8 text-h6'></div>
          <div v-if='imageFile' class='col-4' style='display: flex; justify-content: flex-end'>
                  <img :src='imageFile' alt='Preview' style='max-width: 100px' width='150px'  height='100px' />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form  @submit.prevent='saveRecord' ref='userCreationForm'>
          <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div>  
          <q-input
            filled
            bottom-slots
            v-model='formData.last_name'
            label='Last Name' 
            :dense='dense'
            :rules='[requiredRule]' 
          />
            <q-input
            filled
            bottom-slots
            v-model='formData.first_name'
            label='First Name' 
            :dense='dense'
            :rules='[requiredRule]' 
          />
           <q-input
            filled
            bottom-slots
            v-model='formData.middle_name'
            label='Middle Name' 
            :dense='dense'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.phoneNumber'
            label='Phone Number' 
            :dense='dense'
            :rules='[requiredRule]' 
          />
           <q-input
            filled
            bottom-slots
            v-model='formData.email'
            label='Email' 
            :dense='dense'
            :rules='[requiredRule]' 
          />
          
           <q-select
            filled
            bottom-slots
            v-model='formData.gender'
            :options='genderList'
            label='Select Gender'  
            :dense='dense'  
          /> 
          
          <div class='q-pa-md'>
           
          <DatePicker v-model='formData.dateOfBirth' label='Date of Birth' @setDate='setDateOfBirth'  
           ref='birthDate' />
          </div>
            
          <div class='row'>
            <div class='col-8'>
                <q-file
                  bottom-slots
                  filled
                  v-model='formData.imageByte'
                  @update:model-value='onFileChange'
                  label='User Image'
                >
                  <template v-slot:append>
                    <q-icon name='attachment' />
                  </template>
                </q-file>
              </div>
              <div v-if='imageFile' class='col-4' style='display: flex; justify-content: flex-end'>               
                  <img :src='imageFile' alt='Preview' style='max-width: 100px' width='150px'  height='100px' />

          </div> 
            </div>
            <q-row class='q-mt-md' justify='center'>
            <q-col cols='6' sm='4' class='q-mb-md'> 
              <q-btn
                      rounded  
                      label='Cancel'
                      icon='cancel'
                      v-close-popup
                      class='pwan-blue top-margin full-width'
                    /> 
            </q-col>
            <q-col cols='6' sm='4' class='q-mb-md'>
               <q-btn
                          label='Save' 
                          rounded
                          type='submit'
                          icon='save'
                          class='pwan-button top-margin full-width'
                        />
            </q-col>
          </q-row>
            <ResponseDialog
              v-model='showMessageDialog'
              :cardClass='childRef.cardClass'
              :textClass='childRef.textClass'
              :label='childRef.label'
              :message='childRef.message'
              :buttonClass='childRef.buttonClass'
            />
        </q-form>
      </q-card-section> 
    </q-card>
    </div>
  </q-page>
</template>


<script>
import { LocalStorage, SessionStorage } from 'quasar';
import { computed, ref } from 'vue'; 
import { useI18n } from 'vue-i18n'
import axios from 'axios';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger'; 
import { useRouter } from 'vue-router'; 
import HeaderPage from 'src/components/HeaderPage.vue'; 
import { inputFieldRequired } from 'src/validation/validation'; 
import ResponseDialog from 'src/components/ResponseDialog.vue'; 
import DatePicker from 'src/components/DatePicker.vue';   

export default {
   components: { 
    HeaderPage,  
    DatePicker,
    ResponseDialog,
  }, 
   
  data() {
    
    const { t } = useI18n()  
    const pageName = computed(()=> t('userprofile.pagename'))
    const hint = computed(()=> t('userprofile.hint'))
    const router = useRouter();
    const headers = SessionStorage.getItem('headers');
    const profile = LocalStorage.getItem('turnelParams'); 
    
    const formData = ref({
      last_name: '',
      middle_name: '',
      first_name: '', 
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
      childRef,
      headers, 
      dense:true,
      isReadonly:true,
      imageFile : null,
      genderList:[],
      router,
      showSpinner: false, 
      pageName,
      hint,
      profile,
      requiredRule: value => inputFieldRequired(value), 
      dateOfBirth:null, 
      showMessageDialog:false,
    };
  },
  methods: {
    saveRecord() {     
       if (this.$refs.userCreationForm.validate()) {
          this.showSpinner = true;
          this.formData.gender = this.formData.gender.value;
          this.formData.username = this.formData.email;
          this.formData.client = this.profile.client;
          this.formData.organisation = this.profile.organisation;
          this.formData.createdBy = LocalStorage.getItem('userEmail');
          console.log(this.formData)
          const requestData = new FormData();
          for (let key in this.formData) {  
            requestData.append(key, this.formData[key]);
          }
          
          try { 
            console.log('>>>>reqeust data>>>>>>>',requestData)
            const promise = axios.post(path.USER_CREATE, requestData, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                const result = response.data;  
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
                  message: result.message,
                  label: 'Error',
                  cardClass: 'bg-negative text-white error',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal'
                }; 
                }
                this.showMessageDialog = true; 
                this.showSpinner=false;
    
                // You can access properties of the response data as needed
              })
              .catch((error) => {
                debug('Error:', error);
              });
          } catch (error) {
            debug('Error:', error);
          }
       }   
      
    },
    onFileChange(file) {
      console.log('file>>>>>>>>',file)
      if (file) {
        const reader = new FileReader(); 
       reader.onload  = function(e) {
          const userImage = e.target.result;  
          this.imageFile = 'data:image/jpeg;base64,'+userImage 
        }; 
      } else {
        this.imageFile = null;
      }
    },
    loadUserImage(userId){
       const requestParam = {
                  params: {
              userId: userId, 
            },
          };  
          const promise =  axios.get(
              path.USER_IMAGE,
              requestParam,
              this.headers
            );  
            promise
              .then((response) => {

                this.imageFile = 'data:image/jpeg;base64,' + response.data.data.imageByte;
              })
              .catch((error) => {
                console.log(error);
              }); 
    },
    setDateOfBirth(value){
      this.formData.dateOfBirth = value;
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
    console.log('>>>>>>>>>mounted>>>>>>>>>>'); 

      axios
      .get(path.GENDER_SEARCH_ALL)
      .then((response) => { 
        this.genderList = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        })); 
        console.log('>>>>>>this.genderList>>>>>>>>',this.genderList)
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
