<template>
  <q-dialog v-model='showDialog' persistent width='1229px' height='600px'>
    <q-card
      class='card-flex-display'
      :style='{ width: form.width, height: form.height }'
    >
      <q-card-section>
        <div class='text-h6'>{{ form.label }}</div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <div class='text-h6'>{{ randomNumber }}</div>
          <q-input
            filled 
            v-model='formData.answer'
            label='Answwer'
            type='number'
            step='1'
          />  
          <div class='danger'>{{ errorMsg }}</div>
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align='center'>
          <q-btn
            rounded
            size='md'
            color='primary'
            label='Cancel'
            id='closeBtn'
            v-close-popup
          />
          <q-btn
            label='Validate'
            color='secondary'
            @click='saveRecord'
            size='md'
            rounded
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar';
import {  ref } from 'vue';
import axios from 'axios';
import path from 'src/router/urlpath';

export default {
  name: 'MenuItemFormDialog',
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
      menus: [],
      randomNumber: '',
      statusOptions: [],
      profile,
      headers,
      errorMsg : '', 
      updateddOnce: false, // Flag to prevent duplicate updates
    };
  },
  methods: {
     
    validateDan(){
      this.formData.organisation = this.profile.organisation;
      this.formData.client = this.profile.client;
      this.formData.randomNumber = this.randomNumber;
      this.formData.user = this.profile.email
      console.log('>>>>>> this.formData>>>>>>', this.formData)
        console.log('>>>>>>calling from Validate DAn method>>>>>>')
      axios
      .post(path.DYNAMICNUMBER_VALIDATE,this.formData, this.headers)
      .then((response) => { 
        console.log('>>>>>>>response>>>>>>>',response.data.success) 
        if(response.data.success){ 
            this.errorMsg = ''
            this.$emit('formDataSubmitted', this.formData);
            document.getElementById('closeBtn').click(); 
        }else{
          this.errorMsg = 'Invalid DAN Supplied'
        }
          //this.$emit('formDataSubmitted', this.formData); 
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      }); 

    },
    saveRecord() {
      console.log('>>>>>>>thisis inside handle Save,', this.formData); 
      //this.onClick(formData.value);
      this.validateDan(); 
      this.showDialog = true;
      console.log(this.showDialog);
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
     
  },
  unmounted() {
    console.log('Calling unmounted>>>>>>>>>>');
    this.formData = { };
  }, 
  updated() { 
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight; 
    if (this.updateddOnce) return; // Prevent running twice
    const requestParams = {
        params: {
          client: this.profile.client,
          organisation: this.profile.organisation,
          user : this.profile.email,
        },
      };
     axios
      .get(path.DYNAMICNUMBER_LOAD,requestParams,this.headers)
      .then((response) => {
        console.log('LOAD Response >>>>>>>>>>>>', response.data); 
        if(response.data.success)
            this.randomNumber = response.data.data.randNumber;
          console.log(response.data.data.hasDan)
          if(!response.data.data.hasDan){
            console.log('calling from updated method') 
            this.updateddOnce = true
            this.$emit('formDataSubmitted', this.formData); 
            document.getElementById('closeBtn').click(); 
          }
         
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      }); 
       
     
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
