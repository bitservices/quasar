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
         <q-form @submit.prevent='sendMessage' ref='sendMsgForm'>
            <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div>  
           
 

            <q-card-actions align='center'>              
              <q-btn
                class='pwan-button top-margin full-width'
                label='Run BirthDay Message'  
                type='submit' 
              />
            </q-card-actions>
        </q-form>
        <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />
      </q-card-section>
     
    </q-card> 
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
import { inputFieldRequired } from 'src/validation/validation';  
export default {
    components: {  
    HeaderPage, 
    ResponseDialog,
  },
  
  data() {
     const { t } = useI18n() 
    const pageName = computed(()=> t('sendmsg.pagename'))
    const hint = computed(()=> t('sendmsg.hint'))
    const headers = SessionStorage.getItem('headers');  
    const userEmail = LocalStorage.getItem('userEmail');
     
   
      
    const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {},
    });

    return {  
       
      userEmail,
      headers, 
      dense:true, 
      messageChannels:[],
      messageChannel: ref(''),
      pageName,
      hint,   
      requiredUnit:1,  
      inputFieldRule: value => inputFieldRequired(value), 
      showSpinner:false,
      showMessageDialog:false,
      childRef,
                
    };
  },
  methods: {
     
     //DIVINE GRACE
    async  sendMessage(){  
          this.showSpinner= true    
           
         const promise = axios.post(path.SEND_BIRTHDATY_MESSAGE, this.headers);
                promise
                  .then((response) => {
                    // Extract data from the response
                    const result = response.data;   
                    console.log('>>>>>>result>>>>>>>',result)
                    if(result.success){
                       this.childRef = {
                        message: result.message,
                          label: 'Success',
                          cardClass: 'bg-positive text-white',
                          textClass: 'q-pt-none',
                          buttonClass: 'bg-white text-teal',
                        };
                    }else{
                       this.childRef = {
                        message: error.message,
                        label: 'Error',
                        cardClass: 'bg-negative text-white error',
                        textClass: 'q-pt-none',
                        buttonClass: 'bg-white text-teal',
                      }
                    }
                    
                    this.showSpinner = false;  
                    this.showMessageDialog = true;
                  })
                  .catch((error) => { 
                      this.childRef = {
                      message: error.message,
                      label: 'Success',
                      cardClass: 'bg-negative text-white error',
                      textClass: 'q-pt-none',
                      buttonClass: 'bg-white text-teal',
                    }; 
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
    console.log('beforeMount');
    console.log('>>>>>>>>>user Email >>>>>', this.userEmail);
  },
  mounted() {
    console.log('>>>>>>>>>mounted>>>>>>>>>>');
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
