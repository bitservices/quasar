<template>
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
        <q-form @submit.prevent='saveRecord' ref='clientForm'>
          <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div>  
          <q-input
            filled
            bottom-slots
            v-model='formData.code'
            label='Code'
            :readonly='isReadonly'
            :dense='dense'
            :rules='[inputFieldRule]' 
          />
          <div>
            <q-checkbox v-model='isChecked' label='Is an Affilate' />
          </div>
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
            v-model='formData.website'
            label='Web Site'
            :dense='dense'
          /> 
          <div class='row'>
            <div class='cols-8'>
                <q-file
                  bottom-slots
                  filled
                  v-model='formData.logo'
                  @update:model-value='onFileChange'
                  label='Client Logo'
                >
                  <template v-slot:append>
                    <q-icon name='attachment' />
                  </template>
                </q-file>
              </div>
              <div v-if='logoFile' class='cols-4 q-mt-md'>
                <img :src='logoFile' alt='Preview' style='max-width: 100%;' />
            </div>
            </div>

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
             
        </q-form>
      </q-card-section> 
    </q-card> 
</template>

<script>

import { ref, computed } from 'vue'; 
import { useI18n } from 'vue-i18n'
import { LocalStorage, SessionStorage } from 'quasar';
import axios from 'axios';
import path from 'src/router/urlpath'; 
import HeaderPage from 'src/components/HeaderPage.vue'; 
import { isRequired ,inputFieldRequired} from 'src/validation/validation';

export default {
  components: { 
    HeaderPage,
  },
  name: 'StandingDataFormDialog',
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
    const pageName = computed(()=> t('clientform.pagename'))
    const hint = computed(()=> t('clientform.hint'))
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight; 
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + 'px';
    const dialogHeight = controlHeight + 'px';
    const logoFile = ref(null)
    const profile = LocalStorage.getItem('turnelParams');
    const formData = ref({
      code: '',
      name: '',
      website: '',
      isAnAffilate: false, 
      logo : '',
    });
    const form = ref({
      label: '',
      width: '10px',
      height: '10px',
    });
    const showDialog = ref(true);

    return {
      formData,
      showDialog,
      isChecked: false,
      form,
      dialogWidth,
      dialogHeight,
      logoFile,
      dense:true,
      isReadonly:false,
      profile, 
      pageName,
      hint, 
      showSpinner: false, 
      requiredRule: value => isRequired(value), 
      inputFieldRule: value => inputFieldRequired(value), 
    };
  },
  methods: {
    saveRecord() {   
       if (this.$refs.clientForm.validate()) {
         this.showSpinner = true; 
          this.formData.email = this.profile == null? LocalStorage.getItem('userEmail'):this.profile.email;  
          if (this.isChecked) {
            this.formData.isAnAffilate = true;
          } else {
            this.formData.isAnAffilate = false;
          }
          const requestData = new FormData();
          for (let key in this.formData) { 
            requestData.append(key, this.formData[key]);
          }  

          this.$emit('formDataSubmitted', requestData);
          document.getElementById('closeBtn').click();
          this.showDialog = true;
           this.showSpinner = false;
       }
    },
    loadUClientLogo(code){ 
       const requestParam = {
        params: {
          code: code, 
        },
      };  
      const promise =  axios.get(
          path.CLIENT_LOGO,
          requestParam,
          this.headers
        );  
         promise
          .then((response) => {
 
            this.logoFile = 'data:image/jpeg;base64,' + response.data.data.logo;
          })
          .catch((error) => {
            console.log(error);
          }); 
    },
    onFileChange(file) { 
      if (file) {
        const reader = new FileReader();
        console.log('reader>>>>>>>',reader)
       reader.onload  = function(e) {
          const logoByte = e.target.result;  
          this.logoFile = 'data:image/jpeg;base64,'+logoByte 
        }; 
      } else {
        this.logoFile = null;
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
    console.log('mounted');
  },
  unmounted() {
    console.log('Calling unmounted>>>>>>>>>>');
    this.formData = {
      code: '',
      name: '',
      website: '',
      isAnAffilate: false,
      email: '',
    };
  },
  updated() {
    const headers = SessionStorage.getItem('headers');
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == 'edit' || this.action == 'view') {
      this.isReadonly = true
      try {
        const requestParams = {
          params: {
            code: this.searchValue,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, headers); 
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data; 
            if (result.success) {
              this.formData = result.data[0];
              this.formData.status = result.data[0].status.code
              this.isChecked = this.formData.isAnAffilate;
              this.loadUClientLogo(result.data[0].code)
              //this.logoFile = 'data:image/jpeg;base64,' + result.data[0].logo 
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      this.isReadonly = false
      this.logoFile = null
      this.formData = {
        code: '',
        name: '',
        website: '',
        isAnAffilate: false,
        email: '',
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
