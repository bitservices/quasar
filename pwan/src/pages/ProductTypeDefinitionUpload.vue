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
        <q-form  @submit.prevent='uploadFile' ref='productDefUploadForm'>
          <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div>    
            <div v-if='!preview'>
                <q-file
                  bottom-slots
                  filled
                  v-model='formData.uploadFile' 
                  label='User Upload'
                >
                  <template v-slot:append>
                    <q-icon name='attachment' />
                  </template>
                </q-file>   
               <q-btn
                          label='Preview' 
                          rounded
                          type='submit'
                          icon='upload'
                          class='pwan-button top-margin full-width'
                        />  
            </div>
            <div v-else>
              <q-table
                  class='my-sticky-header-table'
                  flat
                  bordered
                  title='User Upload Preview'
                  :rows='rows'
                  :columns='columns'
                  row-key='id'/>
                  <div class='text-center'> 
                      <q-btn
                              label='Close' 
                              rounded 
                              icon='close'
                              @click='preview=false'
                              class='pwan-blue top-margin' 
                              v-close-popup
                            />  
                      <q-btn
                              label='process' 
                              rounded 
                              icon='save'
                              @click='processUpload'
                              class='pwan-button top-margin'
                              :disable='disabled'
                            />  
                    </div>
            </div>
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
import {  computed, ref } from 'vue'; 
import { useI18n } from 'vue-i18n' 
import axios from 'axios';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger';
import HeaderPage from 'src/components/HeaderPage.vue'; 
import ResponseDialog from 'src/components/ResponseDialog.vue';  
 

export default {
   components: { 
    HeaderPage,  
    ResponseDialog,
  }, 
   
  data() {
    
    const { t } = useI18n()  
    const pageName = computed(()=> t('productdefupload.pagename'))
    const hint = computed(()=> t('productdefupload.hint')) 
    const headers = SessionStorage.getItem('headers');
    const profile = LocalStorage.getItem('turnelParams');
    const formData = ref({  
      createdBy:LocalStorage.getItem('userEmail')
    });
      const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {},
    }); 
    const columns = [
      
      {
        name: 'productType',
        align: 'center',
        label: 'Code',
        field: (row) => row.productType,
        sortable: true,
      },
       {
        name: 'name',
        align: 'center',
        label: 'Product Name',
        field: (row) => row.name,
        sortable: true,
      },
      {
        name: 'productCategory',
        align: 'center',
        label: 'Product Category',
        field: (row) => row.productCategory,
        sortable: true,
      },
       {
        name: 'description',
        align: 'center',
        label: 'Description',
        field: (row) => row.description,
        sortable: true,
      },
      {
        name: 'address',
        align: 'center',
        label: 'Address',
        field: (row) => row.address,
        sortable: true,
      },
      {
        name: 'landmark',
        align: 'center',
        label: 'Landmark',
        field: (row) => row.landmark,
        sortable: true,
      },
      {
        name: 'imageUrl',
        align: 'center',
        label: 'Image',         
        field: (row) => row.imageUrl,
        sortable: true,
      },
       {
        name: 'videoUrl',
        align: 'center',
        label: 'Video',
        field: (row) => row.videoUrl,
        sortable: true,
      },
       {
        name: 'subscriptionFormUrl',
        align: 'center',
        label: 'Subscription Form',
        field: (row) => row.subscriptionFormUrl,
        sortable: true,
      },
        {
        name: 'measurement',
        align: 'center',
        label: 'Measurement',
        field: (row) => row.measurement,
        sortable: true,
      },
      {
        name: 'dimension',
        align: 'center',
        label: 'Dimension',
        field: (row) => row.dimension,
        sortable: true,
      }, 
      {
        name: 'countryCode',
        align: 'center',
        label: 'Country',         
        field: (row) =>row.countryCode,
        sortable: true,
      },
      {
        name: 'stateCode',
        align: 'center',
        label: 'State',         
        field: (row) =>row.stateCode,
        sortable: true,
      },
      {
        name: 'countyCode',
        align: 'center',
        label: 'County',         
        field: (row) =>row.countyCode,
        sortable: true,
      },
      {
        name: 'processed',
        align: 'center',
        label: 'Processed',
        field: (row) => row.isProcessed,
        sortable: true,
      },
      {
        name: 'reason',
        align: 'center',
        label: 'Reason',
        field: (row) => row.reason,
        sortable: true,
      },
      {
        name: 'organisation',
        align: 'center',
        label: 'Organisation',
        field: (row) => row.organisation.name,
        sortable: true,
      },
      {
        name: 'client',
        align: 'center',
        label: 'Client',
        field: (row) => row.client.name,
        sortable: true,
      }, 
    ];
    const rows = ref([]);

    return {
      formData, 
      headers, 
      dense:true,
      isReadonly:true, 
      showSpinner: false, 
      pageName,
      hint,
      requiredRule: value => inputFieldRequired(value), 
      dateOfBirth:null,
      profile,
      preview : false,
      columns,
      rows,
      batchNo : 0,
      childRef,
      disabled:false,
    };
  },
  methods: {
    uploadFile() {     
       if (this.$refs.productDefUploadForm.validate()) {
          this.showSpinner = true;
          this.formData.client = this.profile.client
          this.formData.organisation = this.profile.organisation
          console.log('>>>>>>this.formData>>>>>>>>>>',this.formData)
          const requestData = new FormData();
          for (let key in this.formData) { 
            console.log(key, ':::',this.formData[key])
            requestData.append(key, this.formData[key]);
          }
          
          try {  
            const promise = axios.post(path.PRODUCTDEF_UPLOAD, requestData, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                const result = response.data;  
                 console.log('result>>>>>>',result)
                if (result.success) {                    
                  this.preview = true;
                  this.rows = result.data
                  this.batchNo = result.data[0].batchNo;
                  this.showSpinner=false; 
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
    processUpload(){
      console.log('>>>>>click on processed button >>>>>>>>',this.batchNo)
        this.showSpinner = true;
        const data={
          client:this.profile.client,
          organisation:this.profile.organisation,
          batchNo : this.batchNo,
          createdBy:LocalStorage.getItem('userEmail'),           
          destination: path.UPLOAD_DESINATION
        }
        console.log('>>>>>>>data>>>>>>>>>>>>>>',data)
          try {  
            const promise = axios.post(path.PRODUCTDEF_UPLOAD_PROCESS,data, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                this.preview = false;
                const result = response.data;  
                 console.log('result>>>>>>',result)
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
                this.childRef = {
                  message: error.message,
                  label: 'Error',
                  cardClass: 'bg-negative text-white error',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal'
                }; 
                this.showMessageDialog = true; 
                this.showSpinner=false;
              });
          } catch (error) {
            debug('Error:', error);
          }
    }


      


     
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
         console.log('>>>>>>>>>>>mounted>>>>>>') 
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
