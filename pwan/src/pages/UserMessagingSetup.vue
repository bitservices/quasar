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
         <q-form @submit.prevent='saveMessageingSetup' ref='usermsgsetupForm'>
           
          <q-select
            filled
            bottom-slots
            v-model='formData.messageType'
            :options='messageTypes'
            label='Select Messsage Type' 
            :dense='dense'  
             :rules='[requiredRule]'   
          />

          <q-select
            filled
            bottom-slots
            v-model='formData.messagingChannel'
            :options='messageChannels'
            label='Select Messsage Channel' 
            :dense='dense'    
          />
          
          <q-input
              filled
              bottom-slots
              v-model='formData.message'
              label='message'
              type='textarea'
              rows='4'
              maxlength='1000' 
              counter 
            />
         

            <q-card-actions align='center'>              
              <q-btn
                rounded
                class='pwan-button top-margin' 
               :label='actionLabel'
                type='submit' 
              />
                <ResponseDialog
                  v-model='showMessageDialog'
                  :cardClass='childRef.cardClass'
                  :textClass='childRef.textClass'
                  :label='childRef.label'
                  :message='childRef.message'
                  :buttonClass='childRef.buttonClass'
                />
              <Done />
            </q-card-actions>
        </q-form>
      </q-card-section>
     
    </q-card>
    <div class='q-pa-md'>
        <q-table
        class='my-sticky-header-table'
        flat
        bordered
        title='User Messaging Setup'
        :rows='rows'
        :columns='columns'
        row-key='id' 
        selection='single'
        v-model:selected='selected'
      >
        <template v-slot:top>
          <q-label>User Messaging Setup</q-label>
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
import { isRequired,inputFieldRequired } from 'src/validation/validation';   
import Done from 'src/components/Done.vue';   
import ResponseDialog from 'src/components/ResponseDialog.vue';
export default {
    components: {  
    HeaderPage, 
    ResponseDialog,
    Done,
  },
  
  data() {
     const { t } = useI18n() 
    const pageName = computed(()=> t('usermsgsetup.pagename'))
    const hint = computed(()=> t('usermsgsetup.hint'))
    const headers = SessionStorage.getItem('headers');  
    const userEmail = LocalStorage.getItem('userEmail');
     
    const columns = [
      {
        name: 'messageType',
        required: false,
        label: 'Message Type',
        align: 'left',
        field: (row) => row.messageType.name  , 
        sortable: true,
      },
      {
        name: 'messageChannel',
        required: false,
        label: 'Messaging Channel',
        align: 'left',
        field: (row) => row.messagingChannel.name  , 
        sortable: true,
      },
      {
        name: 'message',
        required: false,
        label: 'Message',
        align: 'left',
        field: (row) => row.message  , 
        sortable: true,
      },
       
       
    ]; 
    const rows = ref([]);
    const selected = ref([]);
    const formData = ref({
      createdBy : userEmail,
      user: userEmail
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
      selected,
      columns,
      rows,
      userEmail,
      headers, 
      formData, 
      dense:true, 
      messageChannels:[],
      messageTypes:[],
      pageName,
      hint,    
      requiredRule: value => isRequired(value),  
      inputRequiredRule: value => inputFieldRequired(value), 
      childRef,
      showSpinner: false,
      showMessageDialog: false,
      actionLabel: "Save Msg Setup",
      action : "add"
                
    };
  },
  methods: {
       searchData() {
         const requestParams = {
          params: { 
            user: this.userEmail, 
          },
        };
      try {
        console.log('>>>>>requestParams>>>>>>>>',requestParams)
        const promise = axios.get(
          path.USER_MESSAGINGSETUP_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log('response data>>>>>>>', response.data);
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
    saveMessageingSetup(){ 
      if (this.$refs.usermsgsetupForm.validate()) 
      { 
          this.showSpinner = true; 
          this.formData.messageType = this.formData.messageType.value;
          this.formData.messagingChannel = this.formData.messagingChannel.value; 

            try { 
              let promise = ''
               if(this.action == 'add'){
                promise = axios.post(
                  path.USER_MESSAGINGSETUP_CREATE,
                  this.formData,
                  this.headers
                ); 
                }else if(this.action == 'edit'){
                      promise = axios.put(
                  path.USER_MESSAGINGSETUP_UPDATE,
                  this.formData,
                  this.headers
                    );
                } 
                else if(this.action == 'delete'){
                  promise = axios.post(
                  path.USER_MESSAGINGSETUP_REMOVE,
                  this.formData,
                  this.headers
                    );
                }   
                
                 promise
                  .then((response) => { 
                    const result = response.data
                    console.log(">>>>>>>>result>>>>>>>>",result);
                    if(result.success){
                       this.childRef = {
                        message: result.message,
                        label: 'Success',
                        cardClass: 'bg-positive text-white',
                        textClass: 'q-pt-none',
                        buttonClass: 'bg-white text-teal',
                      };
                      this.showMessageDialog = true;
                    }else{
                      this.childRef = {
                        message: result.message,
                        label: 'Error',
                        cardClass: 'bg-negative text-white error',
                        textClass: 'q-pt-none',
                        buttonClass: 'bg-white text-teal',
                      };
                    }
                      setTimeout(() => {
                          window.location.reload();
                        }, 2000);
                  })
                  .catch((error) => {
                    this.childRef = {
                      message: error.message,
                      label: 'Error',
                      cardClass: 'bg-negative text-white error',
                      textClass: 'q-pt-none',
                      buttonClass: 'bg-white text-teal',
                    };
                    this.showMessageDialog = true;
                  });
              } catch (error) {
                console.error('Error:', error);
                      this.childRef = {
                      message: error.message,
                      label: 'Error',
                      cardClass: 'bg-negative text-white error',
                      textClass: 'q-pt-none',
                      buttonClass: 'bg-white text-teal',
                    };
                     this.showSpinner = false;  
              }  
               
      }
    },
    loadMessageChannels(){

      const promise =  axios.get(
          path.USER_MESSAGINGCHANNEL_SEARCH, 
          this.headers
        ); 
         promise
          .then((response) => {
            console.log('>>>>>response.data.data>>>>>>>',response.data.data)
          this.messageChannels = response.data.data.map((option) => (
          {
          label: option.name,
          value: option.code,
          unitPrice : option.unitPrice,
        })); 
          
         console.log('>>>>>>>>this.messageChannel>>>>>>>',this.messageChannels)
          })
          .catch((error) => {
            console.log(error);
          });
    },     
     
     loadMessageTypes(){

      const promise =  axios.get(
          path.MESSAGETYPE_SEARCH, 
          this.headers
        ); 
         promise
          .then((response) => {
            console.log('>>>>>response.data.data>>>>>>>',response.data.data)
          this.messageTypes = response.data.data.map((option) => (
          {
          label: option.name,
          value: option.code, 
        })); 
          
         console.log('>>>>>>>>this.messageChannel>>>>>>>',this.messageTypes)
          })
          .catch((error) => {
            console.log(error);
          });
    },     

     editItem() {
      if (this.selected.length > 0) { 
        this.setformData()
         console.log('>>>>this.formData>>>>',this.formData)
        this.action = 'edit';
        this.actionLabel=' Edit Msg Setup'; 
      }
    },
   viewItem () {
    console.log('>>>>>this.formData>>>>>>>',this.selected[0])
      if (this.selected.length > 0) { 
        this.setformData()
       this.action = 'view';
       this.actionLabel=' View  Msg Setup';  
      }
    },
    deleteItem() {
      console.log('>>>>>this.formData>>>>>>>',this.selected[0])
       if (this.selected.length > 0) { 
         this.setformData()
        this.action = 'delete';
        this.actionLabel='Delete Msg Seup';  
      }
    },
    setformData(){
       const selectedRecord = {
      messageType : this.selected[0].messageType,
      messagingChannel : this.selected[0].messagingChannel,
      message : this.selected[0].message,
      id : this.selected[0].id
     } 
      this.formData = selectedRecord;  
      this.formData.messageType = {
          label : this.selected[0].messageType.name,
          value : this.selected[0].messageType.code
        }; 
        this.formData.messagingChannel = {
          label : this.selected[0].messagingChannel.name,
          value : this.selected[0].messagingChannel.code
        }; 
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
         
      this.loadMessageTypes()
      this.loadMessageChannels()
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
