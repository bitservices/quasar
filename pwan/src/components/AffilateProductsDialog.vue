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
        <q-form @submit.prevent='saveRecord' ref='affilateProductsForm'>
          
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
            multiple 
            map-options 
            use-input
            input-debounce="300"
            stack-label
            class="q-mb-md"
           /> 

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

import { ref } from 'vue';   
import { LocalStorage, SessionStorage } from 'quasar';
import axios from 'axios'; 
import {inputFieldRequired} from 'src/validation/validation';
import path from 'src/router/urlpath';   

export default {
  name: 'AffilateProductsDialog',
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
    const userEmail = LocalStorage.getItem('userEmail');

    const formData = ref({});
    const form = ref({
      label: '',
      width: '10px',
      height: '10px',
    });
    const showDialog = ref(false);

    return {
      formData,
      productList : [],
      clients:[], 
      allClients:[],
      showDialog, 
      dense:true,  
      userEmail,
      form,
      dialogWidth,
      dialogHeight, 
      showSpinner: false,   
      inputFieldRule: value => inputFieldRequired(value), 
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
    saveRecord() {
       if (this.$refs.affilateProductsForm.validate()) {
        this.showSpinner = true;   
        //this.onClick(formData.value);
        
        console.log(">>>>>>>>>>formData>>>>>>>",this.formData)
        this.formData.client = this.formData.client.value;
        this.formData.user = this.userEmail
        this.formData.products = this.formData.products.map(item => item.value);
        this.$emit('formDataSubmitted', this.formData);
         document.getElementById('closeBtn').click();
          this.showDialog = true;
           this.showSpinner = false;
       }
    },
    loadClients() {
      try { 
        const requestParam = {
          params: {
            isAnAffilate: true,
            status : 'A',
          },
        };
        axios
          .get(path.CLIENT_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log('client Response >>>>>>>>>>>>', response.data.data);
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.clients = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            }));
            this.allClients = this.clients;
            console.log('this.clients >>>>>>>>>>>>', this.clients);
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
        this.productList = [];
        const requestParam = {
          params: {
            client: selectedItem.value, 
          },
        };
        axios
          .get(path.PRODUCTDEF_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log(
              'productList Response >>>>>>>>>>>>',
              response.data.data
            );
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.productList = response.data.data.map((option) => ({
              label: option.name,
              value: option.id,
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
    this.loadClients();
  },
  unmounted() {
    console.log('Calling unmounted>>>>>>>>>>');
    this.formData = { };
  },
  updated() {
    const headers = SessionStorage.getItem('headers');
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == 'edit' || this.action == 'view') {
      try {
        const requestParams = {
          params: {
            id: this.searchValue,
          },
        };
        console.log(this.urlLink)
        const promise = axios.get(this.urlLink, requestParams, headers);
        console.log('>>>>>>>>>>promise>>>>>>>>', promise);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log('>>>>>>>>result>>>>>>>', result.data);
            if (result.success) {
              this.formData = result.data[0];
              this.handleClientChange(result.data[0].client)
              this.formData.client = {
                 label: result.data[0].client.name,
                 value: result.data[0].client.code,
              }
              this.formData.products = result.data[0].products.map((option) => ({ 
              value: option.id,
              label: option.name,
            }));
            
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      this.formData = { };
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
