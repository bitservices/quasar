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

              <div class='parent'> 
                  <div class='child' v-if='value' ref='qrContainer'>
                    <qrcode-vue :value='value' :size='200' level='H' render-as='svg' /> 
                  </div>  
                     <q-btn label='Download QR Code' @click='downloadQR' class='q-mt-md' />
              </div>  
            </div>

              <div class='row center'>
                  <q-btn id='closeBtn'
                          flat
                        label='Close'
                        icon='close'
                        v-close-popup
                        class='pwan-blue top-margin'
                      />  
                  <q-btn
                        label='Save'
                        flat
                        type='submit'
                        icon='save' 
                        class='pwan-button'
                      />
                </div>
             
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
import QrcodeVue from 'qrcode.vue'



export default {
   components: { 
    HeaderPage,
    QrcodeVue,   
  }, 
   
  data() {
    
    const { t } = useI18n()  
    const pageName = computed(()=> t('clientform.pagename'))
    const hint = computed(()=> t('clientform.hint'))
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
      logoFile : null,
      genderList:[],
      router,
      showSpinner: false, 
      pageName,
      hint,
      profile,
      requiredRule: value => inputFieldRequired(value), 
      dateOfBirth:null, 
      showMessageDialog:false,
      value : null,
    };
  },
  methods: {
    saveRecord() {     
       if (this.$refs.clientForm.validate()) {
          this.showSpinner = true;   
          console.log(this.formData)
          const requestData = new FormData();
          for (let key in this.formData) {  
            requestData.append(key, this.formData[key]);
          }
          
          try { 
            console.log('>>>>reqeust data>>>>>>>',requestData)
            const promise = axios.put(path.CLIENT_UPDATE, requestData, this.headers);
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
    downloadQR() {
      console.log('download qr code')
      const qrElement = this.$refs.qrContainer.querySelector('svg'); // Get the canvas element
      console.log('>>>>>qrElement>>>>>>',qrElement)
      if (!qrElement) return;

      // Convert the SVG to a string
      const serializer = new XMLSerializer();
      const svgData = serializer.serializeToString(qrElement);

      // Create a Blob and URL for download
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      // Create a download link and trigger it
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.svg'; // File name
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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

            console.log('response.data.data.logo>>>>>>>',response.data.data.logo)
            this.logoFile = 'data:image/jpeg;base64,' + response.data.data.logo;
          })
          .catch((error) => {
            console.log(error);
          }); 
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

       
        try {
        const requestParams = {
          params: {
            code: this.profile.client,
          },
        };
        console.log('client code >>>>>>',requestParams)
         console.log('>>>>>>>headers >>>>>>',this.headers)
        const promise = axios.get(path.CLIENT_SEARCH, requestParams, this.headers); 
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data; 
            if (result.success) { 
              this.formData = result.data[0];
              this.formData.status = result.data[0].status.code
              this.isChecked = this.formData.isAnAffilate;
              this.loadUClientLogo(result.data[0].code) 
              let obj = {organisation:this.profile.organisation, 
             client:this.profile.client}
             this.value = JSON.stringify(obj)  
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
        
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
