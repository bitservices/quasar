<template>
  <q-page padding>
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
         <q-form @submit.prevent='saveContactConfigSettings' ref='contactConfigSettingForm'>
           
          <q-select
            filled
            bottom-slots
            v-model='formData.contactConfigurationType'
            :options='contactConfigurationTypes'
            label='Select Contact Config Type' 
            :dense='dense'   
          />
          
          <q-input 
                filled
                bottom-slots 
                v-model='formData.prefix' 
                placeholder='Enter Prefix' 
                :dense='dense'    
              />
            <q-input 
                filled
                bottom-slots 
                v-model='formData.surfix' 
                placeholder='Enter Surfix' 
                :dense='dense'    
              />

            <q-card-actions align='center'>              
              <q-btn
                rounded
                class='pwan-button top-margin'
                label='Save Settings'  
                type='submit' 
              />
              <Done />
            <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />
            </q-card-actions>
        </q-form>
      </q-card-section>
     
    </q-card>
    <div class='q-pa-md'>
      <q-table
        class='my-sticky-header-table'
        flat
        bordered
        title='Contact Configuration Settings(s)'
        :rows='rows'
        :columns='columns'
        row-key='id'
        v-model:selected='selected'
      > 
        <template v-slot:top>
          <q-label>Contact Configuration Settings</q-label>
          <q-space /> 
        </template> 
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar';
import axios from 'axios';
import { ref,computed } from 'vue';  
import path from 'src/router/urlpath';
import { useI18n } from 'vue-i18n'
import HeaderPage from 'src/components/HeaderPage.vue';  
import ResponseDialog from 'src/components/ResponseDialog.vue'; 
import Done from 'src/components/Done.vue';  
export default {
    components: {  
    HeaderPage, 
    Done,
    ResponseDialog,
  },
  
  data() {
     const { t } = useI18n() 
    const pageName = computed(()=> t('contactconfigsetting.pagename'))
    const hint = computed(()=> t('contactconfigsetting.hint'))
    const headers = SessionStorage.getItem('headers'); 
    const profile = LocalStorage.getItem('turnelParams');
    const userEmail = LocalStorage.getItem('userEmail');
     
    const columns = [
      {
        name: 'contactConfigurationType',
        required: false,
        label: 'Contact Config Type',
        align: 'left',
        field: (row) => row.contactConfigurationType.name  , 
        sortable: true,
      },
      {
        name: 'prefix',
        align: 'left',
        label: 'Prefix',
        field: (row) => row.prefix  ,
        sortable: true,
      },
      {
        name: 'currentValue',
        align: 'left',
        label: 'Current Value',
        field: (row) => row.currentValue  ,
        sortable: true,
      },
      {
        name: 'surfix',
        align: 'left',
        label: 'Surfix',
        field: (row) => row.surfix  ,
        sortable: true,
      },
       
    ]; 
    const rows = ref([]);
    const selected = ref([]);
    const formData = ref({}); 
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
      selected,
      columns,
      rows,
      userEmail,
      headers, 
      formData,
      profile,
      dense:true, 
      contactConfigurationTypes:[],
      pageName,
      hint,     
      childRef,
      showMessageDialog,
      
                
    };
  },
  methods: { 
    searchData() {
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
      try {
        console.log('>>>>>requestParams>>>>>>>>',requestParams)
        const promise = axios.get(
          path.CONTACTCONFIGSETTINGS_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log('response data configuration settings>>>>>>>', response.data.data);
            this.rows = response.data.data;  
            this.selected = [];
          })
          .catch((error) => {
             console.log(error)
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    saveContactConfigSettings(){ 
      if (this.$refs.contactConfigSettingForm.validate()) {
          this.showSpinner= true   
          console.log('the form is valid>>>>>>>>'); 
                this.formData.contactConfigurationType = this.formData.contactConfigurationType.value
                this.formData.client = this.profile.client;
                this.formData.organisation=this.profile.organisation; 
                this.formData.email = this.profile.email;
                console.log(">>>>>>>formData >>>>>>>>",this.formData)

              const promise = axios.post(path.CONTACTCONFIGSETTINGS_CREATE, this.formData, this.headers);
                promise
                  .then((response) => {
  
                    const result = response.data;  
                    console.log(">>>>>>>result >>>",result)                    
                    if (result.success) {  
                       console.log(">>>>>>>result success >>>",result.success)  
                      this.childRef = {
                        message: result.message,
                        label: 'Success',
                        cardClass: 'bg-positive text-white success',
                        textClass: 'q-pt-none',
                        buttonClass: 'bg-white text-teal',
                      }; 
                    } 
                    this.showSpinner = false;  
                    this.showMessageDialog = true;
                    this.searchData()
                  })
                  .catch((error) => { 
                      this.childRef = {
                      message: error.message,
                      label: 'Error',
                      cardClass: 'bg-negative text-white error',
                      textClass: 'q-pt-none',
                      buttonClass: 'bg-white text-teal',
                    }; 
                    this.showSpinner = false; 
                  }); 
              
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
    console.log('beforeMount');
    console.log('>>>>>>>>>user Email >>>>>', this.userEmail);
  },
  mounted() {
    console.log('>>>>>>>>>mounted>>>>>>>>>>');
    try {  
         const promise =  axios.get(
          path.CONTACT_CONFIG_TYPE_SEARCH, 
          this.headers
        ); 
         promise
          .then((response) => {
            console.log('>>>>>response.data.data>>>>>>>',response.data.data)
          this.contactConfigurationTypes = response.data.data.map((option) => (
          {
          label: option.name,
          value: option.code, 
        })); 
          
         console.log('>>>>>>>>this.contactConfigurationType>>>>>>>',this.contactConfigurationTypes)
          })
          .catch((error) => {
            console.log(error);
          });
        
      this.searchData();
      } catch (error) {
        console.error('Error:', error);
      }
  },
  updated() {},
};
</script>

<style lang='sass'>
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #0c0144
    -webkit-text-fill-color: white

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
  tbody tr:nth-child(even)
</style>
