<template>
  <q-page padding>
    <div class='q-pa-md'> 
      <q-table
        class='my-sticky-header-table'
        flat
        bordered
        title='County'
        :rows='rows'
        :columns='columns'
        row-key='name'
        :selected-rows='getSelectedString'
        selection='multiple'
        v-model:selected='selected'
      >
        <template v-slot:top>
          <q-label>County</q-label>
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
          <CountyFormDialog
            v-model='showFormDialog'
            :onClick='saveRecord'
            @formDataSubmitted='saveRecord'
            label='County'
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
      <Done />
    </div>
  </q-page>
</template>

<script>
import { SessionStorage } from 'quasar';
import axios from 'axios';
import { ref } from 'vue';  
import CountyFormDialog from 'src/components/CountyFormDialog.vue';
import ResponseDialog from 'src/components/ResponseDialog.vue';  
import Done from 'src/components/Done.vue'; 
import path from 'src/router/urlpath'; 
import debug from 'src/router/debugger'; 

export default {
   name: 'CountyPage', 
   components: {
    CountyFormDialog,
    ResponseDialog,
    Done,
  },
  
  data() {
    const headers = SessionStorage.getItem('headers');
    const columns = [
      {
        name: 'code',
        required: false,
        label: 'Code',
        align: 'left',
        field: (row) => row.code,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'name',
        align: 'center',
        label: 'Name',
        field: (row) => row.name,
        sortable: true,
      },
      {
        name: 'state',
        align: 'center',
        label: 'State',
        field: (row) => row.stateCode.name,
        sortable: true,
      },
      {
        name: 'country',
        align: 'center',
        label: 'Country',
        field: (row) => row.countryCode.name,
        sortable: true,
      },
      {
        name: 'status',
        align: 'center',
        label: 'Status',
        field: (row) => row.status.name,
        sortable: true,
      },
    ];
    const urlLink = ref(path.COUNTY_SEARCH,
    );
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const action = ref('');
    const searchValue = ref('');
    const rows = ref([]);
    const selected = ref([]);
    const actionLabel = ref('Submit');
    const medium_dialog = ref(false);
    const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {},
    });
 
   
    return { 
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
    }
  },
  methods : {

      fetchData() {
      try { 
        axios.get(path.COUNTY_ALL,
          this.headers
        )
        .then((response) => { 
        // Assuming the response data is an array of objects with 'value' and 'label' properties 
         if (response.data) { 
          this.rows = response.data;
          this.selected = []; 
        }
      })
       
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
    saveRecord(record) {
      if (this.action == 'add') {
        this.createRecord(record);
      } else if (action.value == 'edit') {
        this.updateRecord(record);
      }
    },
    createRecord(record) {
      try {
        debug('this .headers>>>>', this.headers)
        const promise = axios.post(path.COUNTY_CREATE,
          record,
          this.headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            debug('>>>>>>result >>>>>>>>',result)
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
    updateRecord(record) {
      try {
        console.log('calling Update Record from Child Component', record);
        const promise = axios.put(path.COUNTY_UPDATE,
          record,
          headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(result);
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
      debug(this.selected.length)
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
        this.searchValue = this.selected.value[0]['code'];
        this.action = 'edit';
        this.actionLabel = 'Update';
      }
    },
      viewItem() {
      if (this.selected.length > 0) {
        this.showFormDialog = true;
        this.searchValue = this.selected.value[0]['code'];
        this.action = 'view';
        this.actionLabel = 'Done';
      }
    },
     deleteItem () {
      try {
        const data = this.selected; 
        const promise =  axios.post(path.COUNTY_REMOVE,
          data,
          this.headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(result);
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
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
       handleCountryChange() {
      try {
         console.log('>>>>>>>calling handle Country Change>>>>>>>>>>>>>')
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
     getSelectedString() {
      try {
         return null
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
  },
  mounted() { 
    axios
      .get(path.COUNTRY_ALL)
      .then((response) => { 
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.countries = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        })); 
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      }); 

        
      
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
