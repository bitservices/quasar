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
        <div v-if='isSupperUser'>
           <q-input
                filled
                bottom-slots
                v-model='formData.userName'
                @keyup='handleInput'
                @keydown.enter='handleEnter'
                placeholder='Search for Member'
                :dense='dense' 
              />
              <q-list v-if='showSuggestions && filteredSuggestions.length > 0'>
                <q-item
                  clickable
                  v-for='item in filteredSuggestions'
                  :key='item.email'
                  @click='selectRecord(item)'
                >
                  <q-item-section>{{ item.name }}</q-item-section>
                  <q-item-section side>
                    <!-- Side content -->
                    <q-item-label caption lines='1'>
                      <img :src='item.image' />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list> 

        </div>
        <div class='row'>
          <div class='col-8 text-h6'></div>
          <div v-if='imageFile' class='col-4' style='display: flex; justify-content: flex-end'>
                  <img :src='imageFile' alt='Preview' style='max-width: 100px' width='150px'  height='100px' />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form  @submit.prevent='saveRecord' ref='userProfileForm'>
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
           <q-select
            filled
            bottom-slots
            v-model='formData.gender'
            :options='genderList'
            label='Select Gender'  
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
          <div class='q-pa-md'>
           
          <DatePicker v-model='formData.dateOfBirth' label='Date of Birth' @setDate='setDateOfBirth'  
           ref='birthDate' />
          </div>
           <q-input
            filled
            bottom-slots
            v-model='formData.email'
            label='Email'
            :readonly='isReadonly'
            :dense='dense'
            :rules='[requiredRule]' 
          />
           <q-input
            filled
            bottom-slots
            v-model='formData.username'
            label='User Name'
            :readonly='isReadonly'
            :dense='dense'
            
          />
           
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
             <q-card-actions align='center'>  
              <q-btn
                      rounded  
                  label='Cancel'
                  icon='cancel'
                  v-close-popup
                  class='pwan-blue '
                    />  
               <q-btn
                      label='Save' 
                      rounded
                      type='submit'
                      icon='save'
                      class='pwan-button '
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
import {computed, ref } from 'vue'; 
import { useI18n } from 'vue-i18n'
import axios from 'axios';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger'; 
import { useRouter } from 'vue-router'; 
import HeaderPage from 'src/components/HeaderPage.vue'; 
import { inputFieldRequired } from 'src/validation/validation';
import DatePicker from 'src/components/DatePicker.vue';  
import Done from 'src/components/Done.vue';  
import { format } from 'date-fns';

export default {
   components: { 
    HeaderPage,  
    DatePicker,
    Done
  }, 
   
  data() {
    
    const { t } = useI18n()  
    const pageName = computed(()=> t('userprofile.pagename'))
    const hint = computed(()=> t('userprofile.hint'))
    const router = useRouter();
    const headers = SessionStorage.getItem('headers');
    const formData = ref({
      last_name: '',
      middle_name: '',
      first_name: '', 
    });
    

    return {
      formData, 
      headers, 
      dense:true,
      isReadonly:true,
      imageFile : null,
      genderList:[],
      router,
      showSpinner: false, 
      pageName,
      hint,
      requiredRule: value => inputFieldRequired(value), 
      dateOfBirth:null,
      isSupperUser : SessionStorage.getItem('isSupperUser'), 
      suggestions: [],
      filteredSuggestions: [],
      showSuggestions: false,
    };
  },
  methods: {
    saveRecord() {     
       if (this.$refs.userProfileForm.validate()) {
          this.showSpinner = true; 
          console.log('>>>>>>>>Saving formdata>>>>>>>>>>>>',this.formData)
          this.formData.gender = this.formData.gender.value
          this.formData.status = this.formData.status.code 
          const requestData = new FormData();
          for (let key in this.formData) { 
            console.log(key, ':::',this.formData[key])
            requestData.append(key, this.formData[key]);
          }
          
          try { 
            console.log('>>>>reqeust data>>>>>>>',requestData)
            const promise = axios.put(path.USER_UPDATE, requestData, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                const result = response.data;  
                if (result.success) {  
                  this.formData = result.data; 
                  this.formData.gender = {
                    value : result.data.gender == null? '' : result.data.gender.code,
                    label : result.data.gender == null? '' : result.data.gender.name,
                  }
                  this.showSpinner = false;
                  this.router.push({ path: '/dashboard' });
                  

                }
    
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
     handleInput() {
      if (this.formData.userName === '' || this.formData.userName.length < 3) {
        this.filteredSuggestions = [];
        this.showSuggestions = false;
      } else {
        const filter = {
          params: {
            term: this.formData.userName,
          },
        };
        axios
          .get(path.USER_SEARCH_AUTOCOMPLETER, filter, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            debug(response.data.data);
            this.filteredSuggestions = response.data.data.map((option) => ({
              name:
                option.last_name +
                ' ' +
                option.first_name +
                ' ' +
                option.middle_name,
              email: option.email,
              id: option.id,

            }));
          })
          .catch((error) => {
            console.error('Error fetching options:', error);
          }); 
        this.showSuggestions = true;
      }
    },
    handleEnter() {
      if (this.filteredSuggestions.length > 0) { 
        this.selectRecord(this.filteredSuggestions[0]);
      }
    },
    selectRecord(userObj) {
      console.log('>>>>>>>>>>>>value>>>>>>>>',userObj, '>>>>>>>email >>>>>>>>', userObj.username)
      this.formData.userName = userObj.name;
      this.formData.email = userObj.email;
      this.formData.userId = userObj.id;
      this.showSuggestions = false; 
      this.loadUserByEmail(userObj.email)
      //this.loadOrganisationAttendance(userObj.id)
      // Optionally, emit an event or perform other actions when a suggestion is selected
    },
    loadUserByEmail(userEmail){
       try {
        const requestParam = {
          params: {
            email: userEmail,
          },
        };
        const promise =  axios.get(
          path.FIND_USER_BY_EMAIL,
          requestParam,
          this.headers
        ); 

         promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;    
            if (result.success) { 
              this.formData = result.data; 
              console.log('>>>>>result.data>>>>>>',result.data);
              this.formData.gender = {
                value : result.data.gender == null? '' : result.data.gender.code,
                label : result.data.gender == null? '' : result.data.gender.name,
              }
              this.dateOfBirth = format(this.formData.dateOfBirth, 'yyyy-MM-dd'); 
             // this.imageFile = 'data:image/jpeg;base64,' + this.formData.imageByte   
             this.$refs.birthDate.onChangeDate(this.dateOfBirth)

             this.loadUserImage(result.data.id)

            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error('Error:', error);
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
    if(this.isSupperUser){
      this.isReadonly = false
    }
    
     const userEmail = LocalStorage.getItem('userEmail');
      this.loadUserByEmail(userEmail);
      axios
      .get(path.GENDER_SEARCH_ALL)
      .then((response) => { 
        this.genderList = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        })); 
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
