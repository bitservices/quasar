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
          <q-input
            filled
            bottom-slots
            v-model='formData.code'
            label='Code'
            :dense='dense'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.name'
            label='Name'
            :dense='dense'
          />
           <q-select
            filled
            bottom-slots
            v-model='formData.countryCode'
            :options='countries'
            label='Select Country'
            @update:model-value='handleCountryChange'
            :dense='dense'
            use-input
            input-debounce='200'
            clearable
            @filter='filterCountries'
          /> 
          
          <q-select
            filled
            bottom-slots
            v-model='formData.stateCode' 
            :options='stateList'
            label='State'
            :dense='dense'
            use-input
            input-debounce='200'
            clearable
            @filter='filterStates'
          />
           
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align='center'>
          <q-btn
            rounded
            size='md'
            color='primary'
            label='Cancel'
            v-close-popup
          />
          <q-btn
            :label='actionLabel'
            color='secondary'
            @click='saveRecord'
            size='md'
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { SessionStorage } from 'quasar';
import {  ref } from 'vue';
import axios from 'axios'; 
import path from 'src/router/urlpath'; 

export default {
  name: 'CountyFormDialog',
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
    const headers = SessionStorage.getItem('headers');

    const formData = ref({
      code: '',
      name: '',
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
      countries: [],
      allCountries:[],
      stateList : [],
      allStates :[],
      dense:true,
      headers,
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
    saveRecord() {
      console.log('>>>>>>>thisis inside handle Save,', this.formData); 
      //this.onClick(formData.value);
      this.formData.countryCode = this.formData.countryCode.value
      this.formData.stateCode = this.formData.stateCode.value
      this.$emit('formDataSubmitted', this.formData);
      this.showDialog = true;
      console.log(this.showDialog);
    },
    handleCountryChange(selectedItem){
      console.log('calling country change', selectedItem.value)
      const requestParams = {
          params: {
            countryCode: selectedItem.value,
          },
        };
        console.log('>>>>>>this.headers>>>>>>>',this.headers)
      axios
      .get(path.STATE_SEARCH,requestParams,this.headers)
      .then((response) => {
        console.log('State Response >>>>>>>>>>>>', response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.stateList = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        this.allStates = this.stateList;
        console.log('this.stateList >>>>>>>>>>>>', this.stateList);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
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
    console.log('mounted');
     axios
      .get(path.COUNTRY_ALL)
      .then((response) => {
        console.log('country Response >>>>>>>>>>>>', response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.countries = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        this.allCountries = this.countries
        console.log('this.countries >>>>>>>>>>>>', this.countries);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });

  },
  unmounted() {
    console.log('Calling unmounted>>>>>>>>>>');
    this.formData = { code: '', name: '' };
  },
  updated() { 
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == 'edit' || this.action == 'view') {
      try {
        const requestParams = {
          params: {
            code: this.searchValue,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, headers);
        console.log('>>>>>>>>>>promise>>>>>>>>', promise);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log('>>>>>>>>result>>>>>>>', result.data);
            if (result.success) {
              this.formData = result.data[0];
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      this.formData = { code: '', name: '' };
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
