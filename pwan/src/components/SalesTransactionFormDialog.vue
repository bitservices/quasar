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
        <q-form>  

            
            <q-select
            filled
            bottom-slots
            v-model='formData.client'
            :options='clients'
            label='Affilate/Client'  
            :dense='dense'
            use-input
            input-debounce='200'
            clearable
            @filter='filterAffilates'
            @update:model-value='handleClientChange'
          />

           <q-select
            filled
            bottom-slots
            v-model="formData.products"
            :options="productList"
            label="Select Products" 
            :dense="dense" 
            map-options 
            use-input 
            stack-label
            class="q-mb-md"
            @update:model-value='handleProductChange'
           /> 
          <q-input
            filled
            bottom-slots
            v-model='formData.amount'
            label='Enter Subscribed Amount'
            type='number'
            step='0.01' 
          />

          <q-select
            filled
            bottom-slots
            v-model='formData.salesStatus'
            :options='salesStatusList'
            label='Select Payment Type'  
            :dense='dense'  
          /> 


          <q-input type="hidden" v-model='subscriberData.id' />                               
          <q-input
            filled
            bottom-slots
            v-model='subscriberData.fullName'
            @keyup='handleInput'
            @keydown.enter='handleEnter'
            placeholder='Search for Subscriber'
            :dense='dense'
          />
          <q-list v-if='showSuggestions && filteredSuggestions.length > 0'>
            <q-item
              clickable
              v-for='item in filteredSuggestions'
              :key='item.id'
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

           <q-input
            filled
            bottom-slots
            v-model='subscriberData.lastName'
            label='Last Name' 
            :dense='dense'
            :rules='[requiredRule]' 
          />
            <q-input
            filled
            bottom-slots
            v-model='subscriberData.firstName'
            label='First Name' 
            :dense='dense'
            :rules='[requiredRule]' 
          />
           <q-input
            filled
            bottom-slots
            v-model='subscriberData.middleName'
            label='Middle Name' 
            :dense='dense'
          />
           <q-select
            filled
            bottom-slots
            v-model='subscriberData.gender'
            :options='genderList'
            label='Select Gender'  
            :dense='dense'  
          /> 
          <q-input
            filled
            bottom-slots
            v-model='subscriberData.phoneNumber'
            label='Subscriber Phone Number' 
            :dense='dense'
            :rules='[requiredRule]' 
          />
          <q-input
            filled
            bottom-slots
            v-model='subscriberData.email'
            label='Subscriber Email'
            :readonly='isReadonly'
            :dense='dense'
            :rules='[requiredRule]' 
          />
          <div class='q-pa-md'> 
          <DatePicker v-model='subscriberData.dateOfBirth' label='Date of Birth' @setDate='setDateOfBirth'  
           ref='birthDate' />
          </div>
           
          
           
          <div class='row'>
            <div class='col-8'>
                <q-file
                  bottom-slots
                  filled
                  v-model='subscriberData.imageByte'
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
           
          <q-file
            bottom-slots
            filled
            v-model='formData.paymentEvidence'
            label='Payment Evidence'
          >
            <template v-slot:append>
              <q-icon name='attachment' />
            </template>
          </q-file>

          <q-select
            filled
            bottom-slots
            v-model='formData.paymentStatus'
            :options='paymentStatusList'
            label='Select Paymet Status'
            :dense='dense'
          />

          <q-select
            filled
            bottom-slots
            v-model='formData.salesStatus'
            :options='salesStatusList'
            label='Select Paymet Plans'
            :dense='dense'
          />
          <q-date v-model='formData.salesDate' mask='YYYY-MM-DD' />
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align='center'>
          <q-btn
            rounded
            size='md'
            color='primary'
            label='Cancel'
            v-close-popup
          />
          <q-btn
            :label='actionLabel'
            color='secondary'
            @click='saveRecord'
            size='md'
            rounded
            v-close-popup
          />
        </q-card-actions>
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

export default {
    components: {  
    HeaderPage,  
    debug,
    DatePicker,
  },   
  name: 'SalesTransactionFormDialog',
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
    const pageName = computed(()=> t('salestransaction.pagename'))
    const hint = computed(()=> t('salestransaction.hint'))
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
    const  subscriberData = ref({
        id:"",
        lastName : "",
        firstName : "",
        middleName:""
      });
    const formData = ref({ 
      createdBy: '',
      salesDate: new Date(),
    });
    const form = ref({
      label: '',
      width: '10px',
      height: '10px',
    });
    const showDialog = ref(false);

    return {
      formData,
      subscriberData,
      showDialog,
      form,
      dialogWidth,
      dialogHeight, 
      headers,
      dense: true,
      salesStatusList: [],
      paymentStatusList: [],
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
      salesStatusList:[],
    };
  },
  methods: {

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

    loadUserClients() {
       const requestParam = {
          params: {
            isAnAffilate: true,
            status : "A"
          },
        };
      try { 
        axios
          .get(path.CLIENT_SEARCH, requestParam, this.headers)
          .then((response) => {
            
            console.log(response.data.data)
            this.clients = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            })); 

            this.allClients = this.clients
          })
          .catch((error) => {
            console.error('Error fetching options:', error);
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    handleClientChange(selectedItem) {
      try { 
        const requestParam = {
          params: {
            client: selectedItem.value
          },
        };
        axios
          .get(path.PRODUCTDEF_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log(
              'PRODUCT dEFINITIN Response >>>>>>>>>>>>',
              response.data.data
            );
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.productList = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
              amount : option.amount,
            }));
            console.log('this.productList >>>>>>>>>>>>', this.productList);
          })
          .catch((error) => {
            console.error('Error fetching options:', error);
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },

    handleProductChange(selectedItem){
      console.log(">>>>>>>product Item >>>>>>>>>", selectedItem)
      this.formData.amount = selectedItem.amount

    },
    handleInput() {
      if (this.subscriberData.fullName === '' || this.subscriberData.fullName.length < 4) {
        this.filteredSuggestions = [];
        this.showSuggestions = false;
      } else {
        const filter = {
          params: {
            term: this.subscriberData.fullName,
            email : this.userEmail
          },
        };
        axios
          .get(path.SUBSCRIBER_AUTOCOMPLETER, filter, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            debug(response.data.data);
            this.filteredSuggestions = response.data.data.map((option) => ({
              name:
                option.lastName +
                ' ' +
                option.firstName +
                ' ' +
                option.middleName,
              email: option.email,
              image: option.imageUrl,
            }));
          })
          .catch((error) => {
            console.error('Error fetching options:', error);
          });
        // this.filteredSuggestions = this.suggestions.filter((item) =>
        //   item.toLowerCase().includes(this.inputValue.toLowerCase())
        // );
        this.showSuggestions = true;
      }
    },
    handleEnter() {
      if (this.filteredSuggestions.length > 0) {
        this.selectRecord(this.filteredSuggestions[0]);
      }
    },
    selectRecord(value) {
      this.formData.salerId = value;
      this.showSuggestions = false; 
      
    },
    saveRecord() {
      //this.onClick(formData.value);
      let productType = this.formData.productType.value;  
      this.formData.productType = productType;
      this.formData.paymentStatus = this.formData.paymentStatus.value;
      this.formData.salesStatus = this.formData.salesStatus.value;
      const requestData = new FormData();
      for (let key in this.formData) {
        requestData.append(key, this.formData[key]);
      }
      debug('>>>>>>>request data>>>>>>>', requestData);
      this.$emit('formDataSubmitted', requestData);
      this.showDialog = true;
    },
    loadSaleStatus(){
       axios
      .get(path.SALESSTATUS_SEARCH)
      .then((response) => { 
        console.log(">>>>>sales status response>>>>>>>",response.data.data)
        this.salesStatusList = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        })); 
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
    }
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
    const requestParams = {
      params: {
        
        email: this.userEmail, 
      },
    };

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

      this.loadUserClients();
      this.loadSaleStatus();

  },
  unmounted() {
    debug('Calling unmounted>>>>>>>>>>');
    this.formData = { code: '', name: '' };
  },
  updated() {
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == 'edit' || this.action == 'view') {
      try {
        const requestParams = {
          params: {
            code: this.searchValue, 
          },
        };
        const promise = axios.get(this.urlLink, requestParams, this.headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            if (result.success) {
              this.formData = result.data[0];
              debug('formData>>>>>>>', this.formData);
            }
          })
          .catch((error) => {
            debug(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      this.formData = {
        code: '',
        name: '',
        client: '',
        organisation: '',
        createdBy: '',
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
