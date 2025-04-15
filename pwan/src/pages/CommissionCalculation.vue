<template>
  <q-page padding>
    <div class='q-pa-md'>
      <q-card>
          <q-card-section class='pwan-blue text-white'>
            <HeaderPage  
                :label='pageName'
                :hint='hint'  
              />
          </q-card-section>
        </q-card>
        <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
        </div>
      <q-card> 
      <q-card-section> 
        <q-form @submit.prevent='calculateCommission' ref='commissionForm'>
          <q-select
            filled
            bottom-slots
            v-model='formData.client'
            @update:model-value='handleClientChange'
            :options='clients'
            label='Select Client'
            :rules='[requiredRule]' 
          />
          <q-select
            filled
            bottom-slots
            v-model='formData.organisation'
            @update:model-value='handleOrganisationChange'
            :options='organisations'
            label='Select Organisation'
            :rules='[requiredRule]' 
          />
          <q-select
            filled
            bottom-slots
            v-model='formData.product'
            :options='commissionsettings'
            label='Select Service Name'
            :rules='[requiredRule]' 
          />
           <q-input
            filled
            bottom-slots
            v-model='formData.amount'
            label='Sales Amount'
            type='number'
            step='0.01'
            :rules='[inputRequiredRule]' 
          />  
        
            <q-card-actions align='center'> 
            <q-btn
            class='pwan-button'
              label='Calculate Commission' 
              type='submit'
              size='md'
              rounded  
            />
            <Done/>
          </q-card-actions>
        </q-form>
        </q-card-section> 
    </q-card>
       <div v-if='showCommission'> 
          <q-table
            class='my-sticky-header-table'
            flat
            bordered
            title='Commission List'
            :rows='rows'
            :columns='columns'
            row-key='code' 
          /> 
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'; 
import { useI18n } from 'vue-i18n'
import HeaderPage from 'src/components/HeaderPage.vue';  
import { isRequired, inputFieldRequired } from 'src/validation/validation';
import { LocalStorage, SessionStorage } from 'quasar'; 
import Done from 'src/components/Done.vue';  
import axios from 'axios'; 
import path from 'src/router/urlpath'; 
export default {
  components: { 
    HeaderPage, 
    Done,
  },
  data() {
    
    const { t } = useI18n() 
    const pageName = computed(()=> t('commission.pagename'))
    const hint = computed(()=> t('commission.hint'))
    const showSpinner = ref(false); 
    const headers = SessionStorage.getItem('headers');
    const userEmail = LocalStorage.getItem('userEmail');
    const clients = ref([]);
    const organisations = ref([]);
    const commissionsettings  = ref([]);  
    const formData = ref({
      client: null,
      organisation: null,
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
        name: 'level',
        required: false,
        label: 'Commission Level',
        align: 'left',
        field: (row) => row.header, 
        sortable: true,
      },
      {
        name: 'commission',
        align: 'center',
        label: 'Total Commission (NGN)',
        field: (row) => new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(row.commission),
        sortable: true,
      },
      {
        name: 'vat',
        align: 'center',
        label: 'Tax/Vat (NGN)',
        field: (row) => new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(row.vat),
        sortable: true,
      },
      {
        name: 'netAmount',
        align: 'center',
        label: 'Net Amount (NGN)',
        field: (row) => new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(row.netAmount),
        sortable: true,
      },
    ];
    return {
      formData,
      clients,
      organisations,
      commissionsettings, 
      headers,
      userEmail,
      pageName,
      hint,
      showCommission:false,
      showSpinner, 
      childRef,  
      showMessageDialog:false,  
      requiredRule: value => isRequired(value),
      inputRequiredRule: value => inputFieldRequired(value),
      commissionList:[],
      columns,
      rows:[], 
      
    };
  },
  methods: {
    loadCommissionClients() {
      try { 
         
         const requestParam = {
          params: {
            isAnAffilate: true, 
          },
        };
        axios
          .get(path.CLIENT_SEARCH, requestParam,this.headers)
          .then((response) => {
            console.log('client Response >>>>>>>>>>>>', response.data.data);
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.clients = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            }));
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
        console.log('>>>>>calling handleClientChange>>>>>>>>>', selectedItem);
        const requestParam = {
          params: {
            client: selectedItem.value, 
          },
        };
        axios
          .get(path.ORGANISATION_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log(
              'organisations Response >>>>>>>>>>>>',
              response.data.data
            );
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.organisations = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            }));
            console.log('this.organisation >>>>>>>>>>>>', this.organisations);
          })
          .catch((error) => {
            console.error('Error fetching options:', error);
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },

    handleOrganisationChange(selectedItem) {
      try {
        console.log('>>>>>calling handleClientChange>>>>>>>>>', selectedItem);
        const requestParam = {
          params: {
            organisation: selectedItem.value,
            client: this.formData.client.value,
          },
        };
        axios
          .get(path.COMMISSION_SETTINGS_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log(
              'organisations Response >>>>>>>>>>>>',
              response.data.data
            );
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.commissionsettings = response.data.data.map((option) => ({
              label: option.name,
              value: option.id,
            }));
            console.log('this.organisation >>>>>>>>>>>>', this.organisations);
          })
          .catch((error) => {
            console.error('Error fetching options:', error);
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    calculateCommission() {
       if (this.$refs.commissionForm.validate()) {
        const data =  {
          product: this.formData.product.value ,
          amount : parseFloat(this.formData.amount) 
        }
        try { 
          axios
            .post(path.COMMISSION_CALCULATE, data, this.headers)
            .then((response) => {   
              this.commissionList = response.data; 
              let commissionObj = []; 
              Object.keys(this.commissionList).forEach((item) => {
                
                 this.commissionList[item]['header'] = item.replace(/_/g, ' ').toUpperCase()
                 commissionObj.push(this.commissionList[item]);
              });  
              console.log('>>>>>this.commissionObj>>>>',commissionObj)
              this.rows = commissionObj;
              this.showCommission = true;
            })
            .catch((error) => {
              console.error('Error fetching options:', error);
            });
        } catch (error) {
          console.error('Error submitting form:', error);
        }
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
  },
  mounted() {
    this.loadCommissionClients();
    console.log('>>>>>>>>mounted>>>>>>>>>>');
  },
  beforeUpdate() {
    console.log('>>>>>>>>before updated>>>>>>>>>>');
  },
  updated() {
    console.log('>>>>>>>>updated>>>>>>>>>>');
  },
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
