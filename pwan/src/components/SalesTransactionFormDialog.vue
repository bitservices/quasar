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
            v-model='formData.subscriber'
            label='Client Name'
            :dense='dense'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.salerId'
            @keyup='handleInput'
            @keydown.enter='handleEnter'
            placeholder='Search for PBO'
            :dense='dense'
          />
          <q-list v-if='showSuggestions && filteredSuggestions.length > 0'>
            <q-item
              clickable
              v-for='item in filteredSuggestions'
              :key='item.email'
              @click='selectRecord(item.email)'
            >
              <q-item-section>{{ item.name }}</q-item-section>
              <q-item-section side>
                <!-- Side content -->
                <q-item-label caption lines='1'>
                  <img :src='item.image' />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-select
            filled
            bottom-slots
            v-model='formData.productType'
            :options='productTypes'
            label='Select Product Type'
            :dense='dense'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.amount'
            label='Enter Amount'
            type='number'
            step='0.01'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.description'
            label='Description'
          />

          <q-file
            bottom-slots
            filled
            v-model='formData.paymentEvidence'
            label='Payment Evidence'
          >
            <template v-slot:append>
              <q-icon name='attachment' />
            </template>
          </q-file>

          <q-select
            filled
            bottom-slots
            v-model='formData.paymentStatus'
            :options='paymentStatusList'
            label='Select Paymet Status'
            :dense='dense'
          />

          <q-select
            filled
            bottom-slots
            v-model='formData.salesStatus'
            :options='salesStatusList'
            label='Select Paymet Plans'
            :dense='dense'
          />
          <q-date v-model='formData.salesDate' mask='YYYY-MM-DD' />
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
import { LocalStorage, SessionStorage } from 'quasar';
import {  ref } from 'vue';
import axios from 'axios';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger';

export default {
  name: 'SalesTransactionFormDialog',
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
      client: '',
      organisation: '',
      createdBy: '',
      salesDate: new Date(),
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
      profile,
      headers,
      dense: true,
      salesStatusList: [],
      paymentStatusList: [],
      suggestions: [],
      filteredSuggestions: [],
      showSuggestions: false,
    };
  },
  methods: {
    handleInput() {
      if (this.formData.salerId === '' || this.formData.salerId.length < 4) {
        this.filteredSuggestions = [];
        this.showSuggestions = false;
      } else {
        const filter = {
          params: {
            term: this.formData.salerId,
          },
        };
        axios
          .get(path.USER_SEARCH_AUTOCOMPLETER, filter, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            debug(response.data.data);
            this.filteredSuggestions = response.data.data.map((option) => ({
              name:
                option.last_name +
                ' ' +
                option.first_name +
                ' ' +
                option.middle_name,
              email: option.email,
              image: option.imageUrl,
            }));
          })
          .catch((error) => {
            console.error('Error fetching options:', error);
          });
        // this.filteredSuggestions = this.suggestions.filter((item) =>
        //   item.toLowerCase().includes(this.inputValue.toLowerCase())
        // );
        this.showSuggestions = true;
      }
    },
    handleEnter() {
      if (this.filteredSuggestions.length > 0) {
        this.selectRecord(this.filteredSuggestions[0]);
      }
    },
    selectRecord(value) {
      this.formData.salerId = value;
      this.showSuggestions = false;
      // Optionally, emit an event or perform other actions when a suggestion is selected
    },
    saveRecord() {
      //this.onClick(formData.value);
      let productType = this.formData.productType.value;
      this.formData.client = this.profile.client;
      this.formData.organisation = this.profile.organisation;
      this.formData.createdBy = this.profile.email;
      this.formData.productType = productType;
      this.formData.paymentStatus = this.formData.paymentStatus.value;
      this.formData.salesStatus = this.formData.salesStatus.value;
      const requestData = new FormData();
      for (let key in this.formData) {
        requestData.append(key, this.formData[key]);
      }
      debug('>>>>>>>request data>>>>>>>', requestData);
      this.$emit('formDataSubmitted', requestData);
      this.showDialog = true;
    },
  },
  beforeCreate() {
    debug('beforeCreate');
  },
  created() {
    debug('created');
  },
  beforeMount() {
    console.log('before Mount');
  },
  mounted() {  
    const requestParams = {
      params: {
        client: this.profile.client,
        organisation: this.profile.organisation, 
      },
    };

    axios
      .get(path.PRODUCTDEF_SEARCH, requestParams, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.productTypes = response.data.data.map((option) => ({
          label: option.name,
          value: option.id,
        }));
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });

    axios
      .get(path.PAYMENTSTATUS_SEARCH_ALL, requestParams, this.headers)
      .then((response) => {
        debug('paymentStatusList Response >>>>>>>>>>>>', response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.paymentStatusList = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        debug('this.paymentStatusList >>>>>>>>>>>>', this.salesStatusList);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
    axios
      .get(path.SALESSTATUS_SEARCH_ALL, requestParams, this.headers)
      .then((response) => {
        debug('salesStatusList Response >>>>>>>>>>>>', response.data);
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.salesStatusList = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        debug('this.salesStatusList >>>>>>>>>>>>', this.salesStatusList);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
  },
  unmounted() {
    debug('Calling unmounted>>>>>>>>>>');
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
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, this.headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            if (result.success) {
              this.formData = result.data[0];
              debug('formData>>>>>>>', this.formData);
            }
          })
          .catch((error) => {
            debug(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      this.formData = {
        code: '',
        name: '',
        client: '',
        organisation: '',
        createdBy: '',
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
