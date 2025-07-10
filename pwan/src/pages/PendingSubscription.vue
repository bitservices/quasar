<template>
  <q-page padding>
    <div class='q-pa-md'>
      <q-table
        class='my-sticky-header-table'
        flat
        bordered
        title='Sales Trancaction'
        :rows='rows'
        :columns='columns'
        row-key='id'
        selection='single'
        v-model:selected='selected'
      >
        <template v-slot:top>
          <q-label>Subscription</q-label>
          <q-space />
          <q-btn rounded color='blue' icon='edit' size='sm' @click='editItem' />   
          <PendingSubscriptionFormDialog
            v-model='showFormDialog'
            :onClick='saveRecord'
            @formDataSubmitted='saveRecord'
            label='Pending Subscription'
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
          
        </template>
      </q-table> 
      <Done />
    </div>
  </q-page>
</template>

<script>
import { SessionStorage,  LocalStorage } from 'quasar';
import axios from 'axios';
import { ref } from 'vue';
import PendingSubscriptionFormDialog from 'src/components/PendingSubscriptionFormDialog.vue';
import ResponseDialog from 'src/components/ResponseDialog.vue';
import Done from 'src/components/Done.vue';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger'; 
import { format } from 'date-fns'; 


export default {
  components: {
    PendingSubscriptionFormDialog,
    ResponseDialog,
    Done,
  },
  setup() {
    let headers = SessionStorage.getItem('headers'); 
    const columns = [
      
       
      {
        name: 'amount',
        align: 'center',
        label: 'Amount',
        field: (row) =>
          new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(row.amount),
        sortable: true,
      },
       
       
      {
        name: 'paymentStatus',
        align: 'center',
        label: 'Status',
        field: (row) => row.paymentStatus.name,
        sortable: true,
      },
      {
        name: 'paymentDate',
        align: 'center',
        label: 'Payment Date',
        field: (row) => format(row.paymentDate, 'yyyy-MM-dd'),
        sortable: true,
      },
    ];
    
    
    const urlLink = ref(path.SUBSCRIPTION_PMT_VIEW);
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const action = ref('');
    const searchValue = ref('');
    const rows = ref([]);
    const selected = ref([]);
    const actionLabel = ref('Submit');
    const medium_dialog = ref(false); 
    const userEmail = LocalStorage.getItem('userEmail');      
    const profile = LocalStorage.getItem('turnelParams');  
    console.log(">>>>>>>profile>>>>>>>>",profile);
    const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {},
    });

    
    const fetchData = async () => {
      try {
         
    const requestParams = {
      params: {   
        client : profile.client,
        organisation : profile.organisation,
        paymentStatus : "P",
        order_by : "-paymentDate"
      },
    }; 
    console.log('requestParams>>>>>>>>>>>>',requestParams)
        const response = await axios.get(
          path.SUBSCRIPTION_PMT_SEARCH,
          requestParams,
          headers
        );
        if (response.data) {
          console.log('pending response>>>>>>', response.data.data);
          rows.value = response.data.data;
          selected.value = [];
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };
    const saveRecord = (record) => {
      console.log(">>>>action performed>>>>",record.action)
      if (record.action == 'approve') {
        approveRecord(record);
      } else if (record.action == 'reject') {
         rejectRecord(record);
      }
    };
    const approveRecord = (record) => {
      try {
        headers['Content-Type'] = 'multipart/form-data'; 
        console.log(">>>>>>>>>>>>>Approve Record>>>>>>>>",record);

        const promise = axios.post(path.SUBSCRIPTION_PMT_APPROVE, record, headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log('>>>>>>>>>result>>>>>>', result);
            if (result.success) {
               childRef.value = {
                  message: result.message,
                  label: 'Success',
                  cardClass: 'bg-positive text-white',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal',
                }; 
            }else{

               childRef.value = {
                  message: result.message,
                  label: 'Error',
                  cardClass: 'bg-negative text-white error',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal',
                };

            }
             fetchData(); 
            showMessageDialog.value = true;
            // You can access properties of the response data as needed
          })
          .catch((error) => {
            childRef.value = {
              message: error.message,
              label: 'Error',
              cardClass: 'bg-negative text-white error',
              textClass: 'q-pt-none',
              buttonClass: 'bg-white text-teal',
            };
            showMessageDialog.value = true;
          });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const rejectRecord = (record) => {
      try { 
        console.log(">>>>headers>>>>>",headers)
        headers['Content-Type'] = 'multipart/form-data'; 
        console.log(">>>>>submitted record>>>>>>>>>>",record)
        const promise = axios.post(path.SUBSCRIPTION_PMT_REJECT, record, headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(result);
             if (result.success) {
               childRef.value = {
                  message: result.message,
                  label: 'Success',
                  cardClass: 'bg-positive text-white',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal',
                }; 
            }else{

               childRef.value = {
                  message: result.message,
                  label: 'Error',
                  cardClass: 'bg-negative text-white error',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal',
                };

            }
             fetchData(); 
            showMessageDialog.value = true;
            // You can access properties of the response data as needed
          })
          .catch((error) => {
            childRef.value = {
              message: error.message,
              label: 'Error',
              cardClass: 'bg-negative text-white error',
              textClass: 'q-pt-none',
              buttonClass: 'bg-white text-teal',
            };
            showMessageDialog.value = true;
          });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const showDialog = () => {
      if (selected.value.length > 0) {
        medium_dialog.value = true;
      } else {
        medium_dialog.value = false;
      }
    }; 
    const editItem = () => {
      if (selected.value.length > 0) {
        showFormDialog.value = true;
        console.log(">>>>selected>>>>>>",selected[0])
        searchValue.value = selected.value[0]['id'];
        console.log('searchValue >>>>>', searchValue.value);

        action.value = 'edit';
        actionLabel.value = 'Add Payment';
      }
    };
    

    return {
      fetchData,
      saveRecord,
      approveRecord,
      rejectRecord, 
      editItem,  
      showDialog,  
      urlLink,
      actionLabel,
      searchValue,
      showMessageDialog,
      childRef,
      selected,
      columns,
      rows,
      headers,
      medium_dialog,
      action,
      showFormDialog,
      userEmail,
      profile,
    };
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
    console.log('mounted');
    this.fetchData();
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
