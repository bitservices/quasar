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
         <q-form @submit.prevent='saveRecord' ref='productTypeDefinitionForm'>
          <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div> 
          <div> 
          <q-select
            filled
            bottom-slots
            v-model='formData.productType'
            :options='productTypes'
            label='Select Product Type'
            :readonly='isReadonly' 
            :dense='dense'
            :rules='[requiredRule]'
          />

          <q-input
            filled
            bottom-slots
            v-model='formData.name'
            label='Name'
            :dense='dense'
            :rules='[inputFieldRule]'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.address'
            label='Address'
            :dense='dense'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.amount'
            label='Enter Amount'
            type='number'
            step='0.01'
            :rules='[inputFieldRule]'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.description'
            label='Description'
            type='textarea'
            rows='2'
            maxlength='200'
            counter
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.landmark'
            label='Landmark'
            type='textarea'
            rows='3'
            maxlength='300'
            counter
          />
          <q-checkbox
            v-model='formData.allowedPartialPayment'
            label='Allowed Parital Payment'
            color='primary'
          />
          <q-checkbox
            v-model='formData.allowedInspection'
            label='Allowed Inspection'
            color='secondary'
          /> 
           <q-input
              filled
              bottom-slots
              v-model='formData.inspectionTime'
              type='time'
              label='Inspection Time'
              :dense='dense'  
            /> 
          <q-select
            filled
            bottom-slots
            v-model='formData.productStatus'
            :options='productStatusList'
            label='Select Product Status'
            :dense='dense' 
            :rules='[requiredRule]'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.totalMeasurement'
            label='Enter Total Size'
            type='number'
          />
          <q-select
            filled
            bottom-slots
            v-model='formData.dimension'
            :options='dimensions'
            label='Select Dimension'
            :dense='dense' 
            :rules='[requiredRule]'
          />
          <q-select
            filled
            bottom-slots
            v-model='formData.country'
            :options='countries'
            label='Select Country'
            @update:model-value='handleCountryChange'
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
            v-model='formData.state'
            :options='stateList'
            label='Select State'
            @update:model-value='handleStateChange'
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
            v-model='formData.county'
            :options='counties'
            label='Select County'
            :dense='dense'
            :rules='[requiredRule]'
            use-input
            input-debounce='200'
            clearable
            @filter='filterCounties'
          />  
          <div v-if='showBytes'>
            <q-card>
              <q-card-section>
              <q-uploader 
                  label='Drag and drop Image file or click to select one'
                  single 
                  @added='handleImageFilesAdded'
                /> 
              </q-card-section>
            </q-card>
            <q-card>
              <q-card-section>
              <q-uploader 
                  label='Drag and drop Subscription file or click to select one'
                  single 
                  @added='handleSubscriptionFilesAdded'
                /> 
            </q-card-section>
            </q-card>
            <q-card>
            <q-card-section>
            <q-uploader 
                label='Drag and drop Video file or click to select one'
                single 
                @added='handleVideoFilesAdded'
              /> 
            </q-card-section>
            <q-card-section>
            <q-video
              :src='formData.videoUrl'
              autoplay='false'
              controls 
            />  
            </q-card-section>
            </q-card>
           </div>
          </div>

          <q-card-actions align='center'>
          <div class='row'>
            <q-btn id='closeBtn'
                  rounded  
                  label='Close'
                  icon='close'
                  v-close-popup
                  class='pwan-blue top-margin full-width'
                />  
            <q-btn
                  :label='actionLabel'
                  rounded
                  type='submit'
                  icon='save' 
                  class='pwan-button top-margin full-width'
                />
          </div>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from 'vue'; 
import { useI18n } from 'vue-i18n'
import { LocalStorage, SessionStorage } from 'quasar';
import axios from 'axios';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger'; 
import HeaderPage from 'src/components/HeaderPage.vue'; 
import { isRequired ,inputFieldRequired} from 'src/validation/validation';

export default {
  components:{
    HeaderPage
  }, 
  name: 'ProductTypeFormDialog',
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
    showBytes: {
      type: Boolean,
      required: true,
    },  
    
  },
  data() {
    const { t } = useI18n() 
    const pageName = computed(()=> t('producttypedefform.pagename'))
    const hint = computed(()=> t('producttypedefform.hint'))
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + 'px';
    const dialogHeight = controlHeight + 'px';

    const profile = LocalStorage.getItem('turnelParams');
    const headers = SessionStorage.getItem('headers');
    const formData = ref({ 
      client: '',
      organisation: '',
      createdBy: '',
    });
    const form = ref({
      label: '',
      width: '10px',
      height: '10px',
    });
    const showDialog = ref(false);

    return {
      formData,
      showDialog,
      form,
      dialogWidth,
      dialogHeight,
      profile,
      headers,
      time: '10:00',
      dense: true,
      countries: [],
      allCountries:[],
      stateList: [],
      allStates :[],
      counties: [],
      allCounties : [],
      productTypes:[],
      isReadonly: false,
      imageUrl: null,
      videoUrl: null,
      subscriptionUrl: null,
      pageName,
      hint, 
      showSpinner: false,  
      requiredRule: value => isRequired(value), 
      inputFieldRule: value => inputFieldRequired(value), 
      imageUpload :path.IMAGE_UPLOAD, 
      videoUpload :path.VIDEO_UPLOAD, 
      lastUploadedFile: null,
    };
  },
  methods: {
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
    showTimePopup() {
      this.$refs.timePopup.show();
    },
    hideTimePopup() {
      this.$refs.timePopup.hide();
    },

    saveRecord() {
      //this.onClick(formData.value);
     if (this.$refs.productTypeDefinitionForm.validate()) { 
        this.showSpinner = true;
        let data = this.formData;  
        let productType = this.formData.productType.value;   
        data.productType = productType;
        data.dimension = this.formData.dimension.value;
        data.code = productType; //this.formData.productType.value;
        data.productStatus = this.formData.productStatus.value;
        data.county = this.formData.county.value;
        data.country = this.formData.country.value;
        data.state = this.formData.state.value; 
        data.status = 'A'; 
        data.client = this.profile.client;
        data.organisation = this.profile.organisation;
        data.createdBy = this.profile.email; 
        const requestData = new FormData(); 
        for (let key in data) {  
          requestData.append(key, data[key]);
        } 
        this.$emit('formDataSubmitted', requestData); 
        document.getElementById('closeBtn').click();
        this.showDialog = true; 
         this.showSpinner = false;  
     }
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
          countryCode: this.formData.country.value,
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
    
   
     handleImageFilesAdded(files) { 
        files.forEach(file => { 
          console.log('>>>this.formdata', this.formData)
                const formData = new FormData();
                formData.append('imageFile', file); // 'file' should match the multer field name
                formData.append('id',this.formData.id)
                formData.append('destination',path.UPLOAD_DESINATION)
                formData.append('client',this.profile.client)
                formData.append('organisation',this.profile.organisation)
                // Use Axios to send the file
                axios.post(path.PRODUCTDEF_UPDATE_IMAGE, formData)
                  .then(response => {
                    console.log('Upload successful:', response.data);
                  })
                  .catch(error => {
                    console.error('Upload error:', error);
                  });
        });
    },
     handleSubscriptionFilesAdded(files){
       files.forEach(file => { 
        
      console.log('>>>this.formdata', this.formData)
             const formData = new FormData();
                formData.append('imageFile', file); // 'file' should match the multer field name
                formData.append('id',this.formData.id)
                formData.append('destination',path.UPLOAD_DESINATION)
                formData.append('client',this.profile.client)
                formData.append('organisation',this.profile.organisation)
                // Use Axios to send the file
                axios.post(path.PRODUCTDEF_UPDATE_SUBSCRIPTION, formData)
                  .then(response => {
                    console.log('Upload successful:', response.data);
                  })
                  .catch(error => {
                    console.error('Upload error:', error);
                  }); 
             });
    },

     handleVideoFilesAdded(files){
       files.forEach(file => { 
        
      console.log('>>>this.formdata', this.formData)
             const formData = new FormData();
                formData.append('imageFile', file); // 'file' should match the multer field name
                formData.append('id',this.formData.id)
                formData.append('destination',path.UPLOAD_DESINATION)
                formData.append('client',this.profile.client)
                formData.append('organisation',this.profile.organisation)
                // Use Axios to send the file
                axios.post(path.PRODUCTDEF_UPDATE_VIDEO, formData)
                  .then(response => {
                    console.log('Upload successful:', response.data);
                  })
                  .catch(error => {
                    console.error('Upload error:', error);
                  }); 
             });
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
     const requestParams = {
      params: {
        client: this.profile.client,
        organisation: this.profile.organisation, 
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
      .get(path.PRODUCTTYPE_SEARCH, requestParams, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        console.log('>>>>>>>product type response>>>>>>>>>',response.data.data)
        this.productTypes = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {
        console.log(error)
      });

    axios
      .get(path.PRODUCTSTATUS_SEARCH_ALL, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.productStatusList = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });

    axios
      .get(path.DIMENSION_SEARCH_ALL, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.dimensions = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {
        console.log(error)
      });
  },
  unmounted() {
    debug('Calling unmounted>>>>>>>>>>'); 

  },
  updated() {
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
      const requestParams = {
          params: {
            id: this.searchValue,
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };  
    if (this.action == 'edit' || this.action == 'view') {
      this.isReadonly = true;
      try { 
        const promise = axios.get(this.urlLink, requestParams, this.headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;

            if (result.success) {
              debug('fetched product Type Definition>>>>>>', result.data[0]);
              this.formData = result.data[0];
              this.formData.country = {
                value: result.data[0].country.code,
                label: result.data[0].country.name,
              };
              this.formData.state = {
                value: result.data[0].state.code,
                label: result.data[0].state.name,
              };
              this.formData.county = {
                value: result.data[0].county.code,
                label: result.data[0].county.name,
              };

              this.formData.dimension = {
                value: result.data[0].dimension.code,
                label: result.data[0].dimension.name,
              };

              this.formData.productStatus = {
                value: result.data[0].productStatus.code,
                label: result.data[0].productStatus.name,
              };

              this.formData.productType = {
                value: result.data[0].productType.code,
                label: result.data[0].productType.name,
              };
              this.formData.status = {
                value: result.data[0].status.code,
                label: result.data[0].status.name,
              };
              
            }
          })
          .catch((error) => {
            debug(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    
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
