<template>
  <q-page padding>
    <q-card>
        <q-card-section class='pwan-blue text-white'>
          <HeaderPage  
              :label='pageName'
              :hint='hint'  
            />
        </q-card-section>
      </q-card>
    <q-card
      class='card-flex-display' 
    > 
      <q-card-section>
        <q-form  @submit.prevent='saveRecord' ref='integrationForm'>
          <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div>  
           <q-select
                filled
                bottom-slots
                v-model='formData.paymentChannel'
                :options='paymentChannels'
                label='Select Payment Channel' 
                :dense='dense'
                :rule=[requiredRule]
              />
              
              <q-input
              v-model='formData.publicKey'
              filled
              label='Enter Public Key'
              :type='isPwd ? "password" : "text"'                 
              :rule=[requiredRule]
            >
              <template v-slot:prepend>
                <q-icon name='lock' />
              </template>
              <template v-slot:append>
                <q-icon
                  :name='isPwd ? "visibility_off" : "visibility"'
                  class='cursor-pointer'
                  @click='isPwd = !isPwd'
                />
              </template>
            </q-input>  

          <q-card-actions align='center'>
          <q-btn
            rounded
            size='md'
            color='primary'
            label='Reset' 
            @click='resetForm' 
          />
          <q-btn
            id='actionBtn'
            :label='actionLabel'
            class='pwan-button'
            type='submit'
             size='md'
            rounded
            v-close-popup
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
        title='Payment Integration List'
        :rows='rows'
        :columns='columns'
        row-key='id' 
        selection='single' 
        v-model:selected='selected'
      > 
        <template v-slot:top>
          <q-label>Payment Integration List</q-label>
          <q-space />
          <q-btn rounded color='blue' icon='edit' size='sm' @click='editItem' />
          <q-btn
            rounded
            color='info'
            icon='visibility'
            size='sm'
            @click='viewItem'
          />
          <q-btn
            rounded
            color='red'
            icon='delete'
            size='sm'
            @click='deleteItem'
          />
        </template>  
      </q-table>
      <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar';
import axios from 'axios';
import { ref, computed } from 'vue'; 
import path from 'src/router/urlpath'; 
import { useI18n } from 'vue-i18n'
import HeaderPage from 'src/components/HeaderPage.vue'; 
import { inputFieldRequired } from 'src/validation/validation'; 
import ResponseDialog from 'src/components/ResponseDialog.vue';

export default {
  components: { 
    HeaderPage,
    ResponseDialog,
  },
  data() {
    const { t } = useI18n();
    const pageName = computed(()=> t('integration.pagename'))
    const hint = computed(()=> t('integration.hint'))
    const headers = SessionStorage.getItem('headers');  
    const profile = LocalStorage.getItem('turnelParams');
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
        name: 'paymentChannel',
        required: false,
        label: 'Payment Channel',
        align: 'left',
        field: (row) =>
          row.paymentChannel.name,
        format: (val) => `${val}`,
        sortable: true,
      },
     
      {
        name: 'publicKey',
        align: 'left',
        label: 'Public Key',
        field: (row) => row.publicKey,
        sortable: true,
      },
        
       
    ]; 

    const rows = ref([]);
    const selected = ref([]);
    const formData = ref({
      paymentChannel : '',
      publicKey:'',
      client:profile.client,
      organisation:profile.organisation,
      createdBy : profile.email
    }); 
    const showMessageDialog = ref(false);
    const showSpinner = ref(false);

    return {  
      selected,
      columns,
      rows, 
      profile,
      headers, 
      formData, 
      dense:true,   
      pageName,
      hint, 
      requiredRule: value => inputFieldRequired(value),
      showSpinner,
      showMessageDialog, 
      action: 'add',
      actionLabel:'Create',
      paymentChannels:[],
      childRef,
      isPwd: ref(true),
    };
  },
  methods: { 
     loadPaymentIntegrations() {
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
         
      try { 
        const promise = axios.get(
          path.PAYMENTINTEGRATION_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response 
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
    handleSubmit() {  
       if (this.$refs.paymentIntegrationForm.validate()) { 
        this.showSpinner = true; 
        try {  
         this.formData.paymentChannel = this.formData.paymentChannel.value;
         console.log(this.formData)
            const userPromise = axios.post(path.PAYMENTINTEGRATION_CREATE,
                this.formData
                );  
                userPromise.then((response) => { 
                    if(response.data.success){ 
                        
                     console.log('>>>>>>>>>>>')
                    }else{
                       this.childRef = {
                        message: response.data.message,
                        label: 'Error',
                        cardClass: 'bg-negative text-white error',
                        textClass: 'q-pt-none',
                        buttonClass: 'bg-white text-teal',
                      };
                      this.showSpinner = false;
                      this.showMessageDialog = true;
                    }
                    

                })

        } catch (error) {
          console.error('Error submitting form:', error);
        }
     }
    },
    saveRecord() { 
      if (this.$refs.integrationForm.validate()) {  
        try {
          console.log('this.action>>>>>>',this.action)
           let promise = ''
           this.showSpinner = true; 
          this.formData.client= this.profile.client;
          this.formData.organisation= this.profile.organisation;
          this.formData.createdBy = this.profile.email;
          this.formData.paymentChannel = this.formData.paymentChannel.value 
          if(this.action == 'add'){
                promise = axios.post(
            path.PAYMENTINTEGRATION_CREATE,
            this.formData,
            this.headers
          ); 
          }else if(this.action == 'edit'){
                promise = axios.put(
            path.PAYMENTINTEGRATION_UPDATE,
            this.formData,
            this.headers
              );
          } 
          else if(this.action == 'delete'){
             promise = axios.post(
            path.PAYMENTINTEGRATION_REMOVE,
            this.formData,
            this.headers
              );
          }  
          promise
            .then((response) => {
              // Extract data from the response 
              const result = response.data 
              if(result.success)  
              {  
                this.childRef = {
                message: result.message,
                label: 'Success',
                cardClass: 'bg-positive text-white',
                textClass: 'q-pt-none',
                buttonClass: 'bg-white text-teal',
              };   
              this.showSpinner= false;
              this.showMessageDialog = true;
              
               
              }else{
                this.childRef = {
                  message: result.message,
                  label: 'Error',
                  cardClass: 'bg-negative text-white error',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal',
                };
                this.showSpinner= false;
                this.showMessageDialog = true;
              } 
              this.loadPaymentIntegrations(); 
              this.resetForm();
            })
            .catch((error) => {
             this.childRef = {
              message: error.message,
              label: 'Error',
              cardClass: 'bg-negative text-white error',
              textClass: 'q-pt-none',
              buttonClass: 'bg-white text-teal',
            };  
              this.showSpinner= false;
              this.showMessageDialog = true;
            }); 
            this.loadPaymentIntegrations(); 
            this.resetForm();
              
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      }
    }, 
    resetForm(){ 
      this.formData = {paymentChannel:'',publicKey:'', createdBy : this.profile.email, organisation:this.profile.organisation, client:this.profile.client}; 
      this.action = 'add';
      this.actionLabel='Create';
    },
    editItem() {
      if (this.selected.length > 0) { 
        this.setformData()
         console.log('>>>>this.formData>>>>',this.formData)
        this.action = 'edit';
        this.actionLabel=' Edit '; 
      }
    },
   viewItem () {
    console.log('>>>>>this.formData>>>>>>>',this.selected[0])
      if (this.selected.length > 0) { 
        this.setformData()
       this.action = 'view';
       this.actionLabel=' View ';  
      }
    },
    deleteItem() {
      console.log('>>>>>this.formData>>>>>>>',this.selected[0])
       if (this.selected.length > 0) { 
         this.setformData()
        this.action = 'delete';
        this.actionLabel='Delete'; 
        document.getElementById('actionBtn').click();
      }
    },
    setformData(){
       this.formData.paymentChannel = {
          label : this.selected[0].paymentChannel.name,
          value : this.selected[0].paymentChannel.code
        };
        this.formData.id = this.selected[0].id
        this.formData.publicKey = this.selected[0].publicKey;
        this.formData.client = this.selected[0].client.code;
         this.formData.organisation = this.selected[0].organisation.code;
         this.formData.createdBy = this.selected[0].createdBy.userName;
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
    console.log('>>>>>>>>>user Email >>>>>', this.profile);
  },
  mounted() {  
    console.log('>>>>>>>>>>>profile>>>>>>>>>>',this.profile);
    this.loadPaymentIntegrations()
     axios
      .get(path.PAYMENTCHANNEL_SEARCH)
      .then((response) => {
        console.log('payment channel Response >>>>>>>>>>>>', response.data); 
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.paymentChannels = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        console.log('this.paymentchannels >>>>>>>>>>>>', this.paymentChannels);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });

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
