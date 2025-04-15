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
        <div class='row'>
          <div class='col-8 text-h6'></div>
          <div v-if='imageFile' class='col-4' style='display: flex; justify-content: flex-end'>
                  <img :src='imageFile' alt='Preview' style='max-width: 100px' width='150px'  height='100px' />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model='userId'
            :options='orgUsers'
            label='Select Member' 
            @update:model-value='loadUserOutstanding'
            :dense='dense'
          />
        </q-form>
      </q-card-section>
        </q-card>
      <q-table
        class='my-sticky-header-table'
        flat
        bordered
        title='User Outstanding Payments'
        :rows='rows'
        :columns='columns'
        row-key='id'
        selection='single'
        v-model:selected='selected'
      >
        <template v-slot:body-cell-checkbox='props'>
          <q-checkbox v-model='props.selected' />
        </template>
        <template v-slot:top>
          <q-label>User Outstanding Payment</q-label>
          <q-space />
          <q-btn rounded color='green' icon='add' size='sm' @click='addItem' />
          <q-btn rounded color='blue' icon='edit' size='sm' @click='editItem' />
          <q-btn
            rounded
            color='info'
            icon='visibility'
            size='sm'
            @click='viewItem'
          />
          <UserOutstandingPaymentFormDialog
            v-model='showFormDialog'
            :onClick='saveRecord'
            @formDataSubmitted='saveRecord'
            label='User Outstanding Payments'
            :searchValue='searchValue'
            :action='action'
            :actionLabel='actionLabel'
            :urlLink='urlLink'
          />
          <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />
          <q-btn
            rounded
            color='red'
            icon='delete'
            size='sm'
            @click='showDialog'
          >
            <q-dialog v-model='medium_dialog'>
              <q-card style='width: 700px' class='bg-info text-white'>
                <q-card-section>
                  <div class='text-h6'>Delete Item(s)</div>
                </q-card-section>

                <q-card-section class='q-pt-none'>
                  Are you sure you want to delete selected item(s)
                </q-card-section>
                <q-card-actions align='center' class='bg-white text-teal'>
                  <q-btn
                    @click='deleteItem'
                    flat
                    label='Yes'
                    v-close-popup
                    class='bg-negative text-white'
                    rounded
                  />
                  <q-btn
                    flat
                    label='No'
                    class='bg-secondary text-white'
                    v-close-popup
                    rounded
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-btn>
        </template>
      </q-table>
      <q-space/>
         <q-btn
          @click='generateOutstandingPayments'
          flat
          :label='generateLabel' 
         class='pwan-button top-margin full-width'
           
        />
    </div>
    
  </q-page>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { LocalStorage, SessionStorage } from 'quasar';
import axios from 'axios';
import { ref, computed } from 'vue';
import UserOutstandingPaymentFormDialog from 'src/components/UserOutstandingPaymentFormDialog.vue';
import ResponseDialog from 'src/components/ResponseDialog.vue';
import HeaderPage from 'src/components/HeaderPage.vue'; 
import path from 'src/router/urlpath';
export default {
  components: {
    UserOutstandingPaymentFormDialog,
    ResponseDialog,
    HeaderPage
  },
  data() {
    const headers = SessionStorage.getItem('headers');
    const userEmail = '';
    const columns = [
      {
        name: 'userName',
        required: false,
        label: 'User',
        align: 'left',
        field: (row) =>
          row.userId.last_name +
          ' ' +
          row.userId.first_name +
          ' ' +
          row.userId.middle_name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'paymentType',
        align: 'center',
        label: 'Payment Type',
        field: (row) => row.paymentType.name,
        sortable: true,
      },
      {
        name: 'openingDebit',
        align: 'center',
        label: 'Opening Debit',
        field: (row) => row.openingDebit,
        sortable: true,
      },
      {
        name: 'currentDebit',
        align: 'center',
        label: 'Current Debit',
        field: (row) => row.currentDebit,
        sortable: true,
      },
      {
        name: 'totalAmountPaid',
        align: 'center',
        label: 'Total Amount Paid',
        field: (row) => row.totalAmountPaid,
        sortable: true,
      },
      {
        name: 'balanceAmount',
        align: 'center',
        label: 'Balance',
        field: (row) => row.balanceAmount,
        sortable: true,
      },
      {
        name: 'year',
        align: 'center',
        label: 'Year',
        field: (row) => row.year,
        sortable: true,
      },
    ];
 
    const { t } = useI18n() 
    const pageName = computed(()=> t('useroutstandingpayment.pagename'))
    const hint = computed(()=> t('useroutstandingpayment.hint'))
    const showSpinner = ref(false); 
    const urlLink = ref(path.USR_OUTSTANDING_PAYMENT_SEARCH);
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const action = ref('');
    const searchValue = ref('');
    const actionBtn = ref('done');
    const rows = ref([]);
    const selected = ref([]);
    const actionLabel = ref('Submit');
    const medium_dialog = ref(false);
    const currentYear = new Date().getFullYear()  
    const profile = LocalStorage.getItem('turnelParams');
    const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {},
    });

    return {
      profile,
      urlLink,
      actionLabel,
      searchValue,
      showMessageDialog,
      childRef,
      selected,
      columns,
      rows,
      userEmail,
      headers,
      medium_dialog,
      action,
      showFormDialog,
      actionBtn,
      generateLabel: 'Generate Outstanding Payments for '+currentYear,
      pageName,
      hint, 
      showSpinner,
      orgUsers :[],
      userId : null,

    };
  },
  methods: {

    loadUserOutstanding(obj) {
      console.log('obj>>>>>>',obj)
          this.loadUserImage(obj)
          this.fetchData(obj.value)

       
    },
    loadUserImage(userObj){
      console.log('>>>>>>>inside loadUserImage>>>>>>>>>')
       const requestParam = {
        params: {
          userId: userObj.value, 
        },
      };  
      const promise =  axios.get(
          path.USER_IMAGE,
          requestParam,
          this.headers
        );  
         promise
          .then((response) => {
 
            this.imageFile = 'data:image/jpeg;base64,' + response.data.data.imageByte;
          })
          .catch((error) => {
            console.log(error);
          }); 
    },

    generateOutstandingPayments(){ 
    try {
      this.showSpinner = true;   
      const promise = axios.post(
          path.USR_OUTSTANDING_PAYMENTS_GENERATE,
          {organisation:this.profile.organisation, client:this.profile.client},
          this.headers
        );
        console.log('promise in the Fetch Data>>>>>>>>>>', promise);
        promise
          .then((response) => {
            // Extract data from the response
            console.log('response data>>>>>>>', response.data);
            const result = response.data
            console.log('result >>>>>>>', result);
             this.childRef = {
              message: result.message,
              label: 'Success',
              cardClass: 'bg-positive text-white error',
              textClass: 'q-pt-none',
              buttonClass: 'bg-white text-teal',
            };
            this.showMessageDialog = true;
            this.showSpinner = false
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
            this.showSpinner = false
          });
          this.fetchData()
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      
    },
    handleRowClicks(event, row) {
      // Handle row click event
      console.log('Row clicked:', row);

      // Access checkbox status from row data
      console.log('Checkbox status:', this.row.selected);

      // You can perform actions based on the checkbox status and row data
      if (row.selected) {
        console.log('Checkbox is checked');
        // Perform actions when checkbox is checked
      } else {
        console.log('Checkbox is unchecked');
        // Perform actions when checkbox is unchecked
      }
    },
    fetchData(userId) {
      try { 
        var requestParams = {
          params: { 
             client : this.profile.client,
             organisation : this.profile.organisation, 
          },
        };
        if(userId != null && userId != ''){
         requestParams = {
          params: {
             client : this.profile.client,
             organisation : this.profile.organisation, 
             userId : userId
          },
        };
        }
        console.log('requestParams>>>>',requestParams)
        const promise = axios.get(
          path.USR_OUTSTANDING_PAYMENT_SEARCH,
          requestParams,
          this.headers
        );
        console.log('promise in the Fetch Data>>>>>>>>>>', promise);
        promise
          .then((response) => {
            // Extract data from the response
            console.log('response data>>>>>>>', response.data);
            this.rows = response.data.data;
            this.selected = [];
            // You can access properties of the response data as needed
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
        console.error('Error submitting form:', error);
      }
    },
    saveMembersRecord(record){
      console.log('>>>>>>>recording all users outstanding payment saveMembersRecord>>>>>>>>>>')
      try {
        const promise = axios.post(
          path.USRS_OUTSTANDING_PAYMENT_CREATE,
          record,
          this.headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            if (result.success) {
               this.childRef = {
              message: result.message,
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
                buttonClass: 'bg-white text-teal',
              };
            } 
             this.fetchData();
            this.showMessageDialog = true;
            // You can access properties of the response data as needed
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
      }
    },
    saveRecord(record) {
      console.log('action clicked>>>>>>>>>', record);
      console.log('>>>>>>>record.members>>>>>>>>>', record.members);
      //saveMembersRecord
      if(record.members){
        this.saveMembersRecord(record)
      }else{
        if (this.action == 'add') {
          this.createRecord(record);
        } else if (this.action == 'edit') {
          this.updateRecord(record);
        }
      }
    },
    createRecord(record) {
      try {
        const promise = axios.post(
          path.USR_OUTSTANDING_PAYMENT_CREATE,
          record,
          this.headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            if (result.success) {
              this.childRef = {
              message: result.message,
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
              buttonClass: 'bg-white text-teal',
            };
            }
              this.fetchData();            
            this.showMessageDialog = true;
            // You can access properties of the response data as needed
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
      }
    },
    updateRecord(record) {
      try {
        console.log('calling Update Record from Child Component', record);
        const promise = axios.put(
          path.USR_OUTSTANDING_PAYMENT_UPDATE,
          record,
          this.headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log('result after savings >>>>>', result);
            if (result.success) {
              this.fetchData();
            }

            this.childRef = {
              message: result.message,
              label: 'Success',
              cardClass: 'bg-positive text-white',
              textClass: 'q-pt-none',
              buttonClass: 'bg-white text-teal',
            };
            this.showMessageDialog = true;
            // You can access properties of the response data as needed
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
      }
    },
    showDialog() {
      if (this.selected.length > 0) {
        this.medium_dialog = true;
      } else {
        this.medium_dialog = false;
      }
    },
    addItem() {
      this.showFormDialog = true;
      this.action = 'add';
      this.actionLabel = 'Submit';
    },
    editItem() {
      if (this.selected.length > 0) {
        this.showFormDialog = true;
        this.searchValue = this.selected[0]['id'];
        this.action = 'edit';
        this.actionLabel = 'Update';
      }
    },
    viewItem() {
      if (this.selected.length > 0) {
        this.showFormDialog = true;
        this.searchValue = this.selected[0]['code'];
        this.action = 'view';
        this.actionLabel = 'Done';
      }
    },
    handleRowClick(event, row) {
      console.log('Row clicked:', row, '  >>>selected>>>>>', this.selected);
      if (this.row.status.code == 'A') {
        this.actionBtn = 'clear';
      } else {
        this.actionBtn = 'done';
      }
      console.log('>>>>>>>>>selected.value.target>>>>>', this.selected.target);
      this.selected = row;
    },
    getSelectedString(row) {
      // Example function to return label for selected row (if needed)
      return row ? row.name : 'No client selected';
    },
     deleteItem() {
      try {
        const data = this.selected;
        console.log(">>>>data>>>>",data)
        const promise = axios.post(
          path.USR_OUTSTANDING_PAYMENT_REMOVE,
          data,
          this.headers
        );
         
         
        console.log(">>>>>>>promise >>>>>>>>>>>>>",promise)
         promise.then((response) => {
            // Extract data from the response
            console.log(">>>>>>>response >>>>>>>>>>>>>",response)
            const result = response.data; 
            console.log('result after savings >>>>>', result);  
            this.childRef = {
              message: result.message,
              label: 'Success',
              cardClass: 'bg-positive text-white',
              textClass: 'q-pt-none',
              buttonClass: 'bg-white text-teal',
            };
            this.showMessageDialog = true;
            // You can access properties of the response data as needed
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
          this.fetchData()

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
    console.log('beforeMount');
    console.log('>>>>>>>>>user Email >>>>>', this.userEmail);
  },
  mounted() {
    console.log('mounted');
    this.fetchData();
     try {
      console.log('>>>>>>this.profile>>>>>',this.profile)
      const requestParams = {
        params: {
          client: this.profile.client,
          organisation: this.profile.organisation,
        },
      };
      const promise = axios.get(
        path.ORGUSER_SEARCH,
        requestParams,
        this.headers
      );
      console.log('>>>>>>>>promise>>>>>>>', promise);
      promise
        .then((response) => {
          console.log('>>>>>>>>>>>>response.data.data>>>>>>>>>>>>>>>>',response.data.data)
          this.orgUsers = response.data.data.map((option) => ({
            label: option.userId.last_name +
          ' ' +
          option.userId.first_name +
          ' ' +
          option.userId.middle_name,
            value: option.userId.id,
          }));
        })
        .catch((error) => {
          console.log(error);
        });
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
