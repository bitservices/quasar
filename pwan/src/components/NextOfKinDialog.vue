<template>
  <q-dialog v-model='showDialog' persistent width='1229px' height='600px'>
    <q-card
      class='card-flex-display'
      :style='{ width: form.width, height: form.height }'
    >
        <q-card-section class='pwan-blue text-white'>
            <HeaderPage  
                :label='pageName'
                :hint='hint'  
              />
          </q-card-section> 

      <q-card-section>
        <q-form  @submit.prevent='saveNextOfKin' ref='nextOfKinFormRef'>  
 
        <div class="page-container"> 
           <q-input
            filled
            bottom-slots
            v-model='nextOfKinData.lastName'
            label='Last Name' 
            :dense='dense'
            :rules='[inputRequiredRule]'
          />
            <q-input
            filled
            bottom-slots
            v-model='nextOfKinData.firstName'
            label='First Name' 
            :dense='dense'
            :rules='[inputRequiredRule]'
          />
           <q-input
            filled
            bottom-slots
            v-model='nextOfKinData.middleName'
            label='Middle Name' 
            :dense='dense'
          />
           <q-select
            filled
            bottom-slots
            v-model='nextOfKinData.gender'
            :options='genderList'
            label='Select Gender'  
            :dense='dense'  
            :rules='[requiredRule]' 
          /> 
          <q-input
            filled
            bottom-slots
            v-model='nextOfKinData.phoneNumber'
            label='Next of Kin Phone Number' 
            :dense='dense'
             :rules='[inputRequiredRule]'
          />
          <q-input
            filled
            bottom-slots
            v-model='nextOfKinData.emailAddress'
            label='Next of Kin Email'
            :readonly='isReadonly'
            :dense='dense'
           :rules='[inputRequiredRule]'
          />
          <div class='q-pa-md'> 
          <DatePicker v-model='nextOfKinData.dateOfBirth' label='Date of Birth' @setDate='setDateOfBirth'  
           ref='nextOfKinBirthDate' />
          </div>  
           
          <div class='row'>
            <div class='col-8'>
                <q-file
                  bottom-slots
                  filled
                  v-model='nextOfKinData.imageByte' 
                  label='Next of Kin Picture'
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
           
          <q-select
            filled
            bottom-slots
            v-model='nextOfKinData.maritalStatus'
            :options='maritalStatusList'
            label='Select Marital Status'
            :dense='dense'
             :rules='[requiredRule]' 
          /> 
           <q-select
            filled
            bottom-slots
            v-model='nextOfKinData.occupation'
            :options='occupationList'
            label='Select Occupation'
            :dense='dense'
             :rules='[requiredRule]' 
          />

          <q-input 
                filled
                bottom-slots
                v-model='nextOfKinData.address'
                label='Street'
                type='textarea'
                rows='2'
                maxlength='1000'  
              />
          
           <q-select
            filled
            bottom-slots
            v-model='nextOfKinData.country'
            :options='countries'
            label='Select Country'
            @update:model-value='handleCountryUpdate'
            :dense='dense'
            :rules='[requiredRule]'
            use-input
            input-debounce='200'
            clearable
            @filter='filterCountries'
          />
          <q-select
            filled
            bottom-slots
            v-model='nextOfKinData.state'
            :options='stateList'
            label='Select State'
            @update:model-value='handleStateUpdate'
            :dense='dense'
            :rules='[requiredRule]'
            use-input
            input-debounce='200'
            clearable
            @filter='filterStates'
          />
          <q-select
            filled
            bottom-slots
            v-model='nextOfKinData.county'
            :options='counties'
            label='Select County'
            :dense='dense'
            :rules='[requiredRule]'
            use-input
            input-debounce='200'
            clearable
            @filter='filterCounties'
          /> 
        </div>  
        <q-card-actions align='center'>
          <q-btn
            id="closenextofkinBtn"
            rounded
            size='md'
            color='primary'
            label='Cancel'
            v-close-popup
          />
          <q-btn
            label='Create Next of Kin'
            color='secondary'
            type="submit"
            size='md'
            rounded 
            :disable="isDisabled"
          />
        </q-card-actions>
        </q-form>
      </q-card-section>
      
    </q-card>
  </q-dialog>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar';
import { ref, computed } from 'vue'; 
import axios from 'axios';
import path from 'src/router/urlpath'; 
import { useI18n } from 'vue-i18n'
import HeaderPage from 'src/components/HeaderPage.vue';   
import debug from 'src/router/debugger'; 
import DatePicker from 'src/components/DatePicker.vue';  
import { isRequired,validateInputField } from 'src/validation/validation';

export default {
    components: {  
    HeaderPage,  
    debug,
    DatePicker,
  },   
  name: 'NextOfKinDialog',
  props: {
    onClick: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    searchValue: {
      type: String, // Specify the data type of the prop
      required: true, // Indicates whether the prop is required or not
    },
    action: {
      type: String,
      required: true,
    },
    actionLabel: {
      type: String,
      required: true,
    },
    urlLink: {
      type: String,
      required: true,
    },
  },
  data() {

     const { t } = useI18n() 
    const pageName = computed(()=> t('nextofkin.pagename'))
    const hint = computed(()=> t('nextofkin.hint'))
    const headers = SessionStorage.getItem('headers'); 
    const userEmail = LocalStorage.getItem('userEmail');

    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + 'px';
    const dialogHeight = controlHeight + 'px';  
    const  nextOfKinData = ref({
        id:"",
        lastName : "",
        firstName : "",
        middleName:""
      }); 
    const form = ref({
      label: '',
      width: '10px',
      height: '10px',
    });
    const showDialog = ref(false);

    return {
      nextOfKinData, 
      showDialog,
      form,
      dialogWidth,
      dialogHeight, 
      headers,
      dense: true, 
      suggestions: [],
      filteredSuggestions: [],
      showSuggestions: false,
      userEmail,
      clients :[],
      productList : [],
      pageName,
      hint,      
      allClients:[],
      dense: true,
      maritalStatusList :[],
      occupationList : [],
       countries: [],
      allCountries:[],
      stateList: [],
      allStates :[],
      counties: [],
      allCounties : [], 
      imageFile : null,  
      requiredRule: value => isRequired(value), 
      inputRequiredRule: value => validateInputField(value),
      isDisabled : false,
      isReadonly : false,
    };
  },
  methods: {

       handleCountryUpdate(value){
        this.nextOfKinData.county={value:"",label:""}
        this.nextOfKinData.state={value:"",label:""}
        this.handleCountryChange(value)

      },
      handleStateUpdate(value){
        
        this.nextOfKinData.county={value:"",label:""}
         this.handleStateChange(value)

      },
      filterAffilates(val, update) {
        console.log('>>>>val>>>>>>',val)
      if (val === '') {
        update(() => {
          this.clients = this.allClients;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.clients = this.allClients.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    }, 

    filterCountries(val, update) {
        console.log('>>>>val>>>>>>',val)
      if (val === '') {
        update(() => {
          this.countries = this.allCountries;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.countries = this.allCountries.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    }, 

    filterStates(val, update) {
        console.log('>>>>val>>>>>>',val)
      if (val === '') {
        update(() => {
          this.stateList = this.allStates;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.stateList = this.allStates.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    }, 
    filterCounties(val, update) {
        console.log('>>>>val>>>>>>',val)
      if (val === '') {
        update(() => {
          this.counties = this.allCounties;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.counties = this.allCounties.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    }, 

     
    
    saveNextOfKin() {
      console.log("Saving next of kin>>>>>>>")
      //this.onClick(nextOfKinData.value);   
      if (this.$refs.nextOfKinFormRef.validate()) 
     {
        this.showSpinner = true;  
        this.nextOfKinData.country = this.nextOfKinData.country.value
        this.nextOfKinData.state = this.nextOfKinData.state.value
        this.nextOfKinData.county = this.nextOfKinData.county.value
        this.nextOfKinData.gender = this.nextOfKinData.gender.value
        this.nextOfKinData.maritalStatus = this.nextOfKinData.maritalStatus.value
        this.nextOfKinData.occupation = this.nextOfKinData.occupation.value
        console.log(">>>>>>this.nextOfKinData>>>>>>",this.nextOfKinData) 
        this.$emit('formDataSubmitted', this.nextOfKinData);
        document.getElementById('closenextofkinBtn').click();
        this.showDialog = true; 
        this.showSpinner = false; 
     }
    },

    loadMaritalStatus(){
       axios
      .get(path.MARITALSTATUS_SEARCH)
      .then((response) => { 
        console.log(">>>>>sales status response>>>>>>>",response.data.data)
        this.maritalStatusList = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        })); 
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
    },
    loadOccupation(){
       axios
      .get(path.OCCUPATION_SEARCH)
      .then((response) => { 
        console.log(">>>>>sales occupationList response>>>>>>>",response.data.data)
        this.occupationList = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        })); 
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
    },
    handleCountryChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: selectedItem.value,
        },
      };
      axios
        .get(path.STATE_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.stateList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
           this.allStates = this.stateList;
          console.log('this.state List >>>>>>>>>>>>', this.stateList);
        })
        .catch((error) => {
          console.error('Error fetching options:', error);
        });
    },
    handleStateChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: this.nextOfKinData.country.value,
          stateCode: selectedItem.value,
        },
      };
      axios
        .get(path.COUNTY_SEARCH, requestParams, this.headers)
        .then((response) => { 
          console.log('>>>response.data>>>',response.data)
          this.counties = response.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allCounties = this.counties;
        })
        .catch((error) => {
          console.log(error)
        });
    },
     setDateOfBirth(value){
      this.nextOfKinData.dateOfBirth = value;
    }, 

   
    
  },
  beforeCreate() {
    debug('beforeCreate');
  },
  created() {
    debug('created');
  },
  beforeMount() {
    console.log('before Mount');
  },
  mounted() {  
    this.isDisabled = false;
    const requestParams = {
      params: {
        
        email: this.userEmail, 
      },
    };

    axios
      .get(path.COUNTRY_ALL)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.countries = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        this.allCountries = this.countries;
      })
      .catch((error) => {
        console.log(error)
      });

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
 
      this.loadMaritalStatus();
      this.loadOccupation()

  },
  unmounted() { 
  },
  updated() {
    console.log(">>>>>>update next of kin this.action>>>>>>>>",this.action,this.searchValue,this.urlLink)
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == 'edit' || this.action == 'view') {
      if(this.action == 'view')  this.isDisabled = true;
     
      this.isDisabled=true
      try {
        const requestParams = {
          params: {
            id: this.searchValue, 
          },
        };
        const promise = axios.get(this.urlLink, requestParams, this.headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log("next of kin data retrieved >>>>>>>",result.data[0])
            if (result.success) {
              this.nextOfKinData = result.data[0]; 
              this.nextOfKinData.gender =  {value: result.data[0].gender.code, label: result.data[0].gender.name}
              this.nextOfKinData.maritalStatus =  {value: result.data[0].maritalStatus.code, label: result.data[0].maritalStatus.name}
               this.nextOfKinData.occupation =  {value: result.data[0].occupation.code, label: result.data[0].occupation.name}
              this.nextOfKinData.country =  {value: result.data[0].country.code, label: result.data[0].country.name}
                console.log(">>>>result.data[0].dateOfBirth>>>>>",result.data[0].dateOfBirth)
               console.log(">>>>this.$refs.nextOfKinBirthDate>>>>>",this.$refs.nextOfKinBirthDate)
               this.$refs.nextOfKinBirthDate.onChangeDate(result.data[0].dateOfBirth)
               this.imageFile = 'data:image/jpeg;base64,' + result.data[0].imageUrl; 
             
             this.nextOfKinData.state = {
                value: result.data[0].state.code,
                label: result.data[0].state.name,
              };
               this.nextOfKinData.county = {
                value: result.data[0].county.code,
                label: result.data[0].county.name,
              }; 
               
              this.handleCountryChange(this.nextOfKinData.country) 
              this.handleStateChange(this.nextOfKinData.state)


              
          }
          })
          .catch((error) => {
            debug(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      this.nextOfKinData = { 
        createdBy: this.userEmail,
      };
    }
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
