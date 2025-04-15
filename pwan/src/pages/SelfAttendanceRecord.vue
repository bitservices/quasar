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
        <div class='q-pa-md q-gutter-lg'>
          <q-toggle
              v-model='toggleValue'
              :label='toggleLabel'
              @update:model-value='onToggleChange'
            />
            <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />
        </div>
      <div  v-if='toggleValue'>
        <q-card  v-if='position.isSet' class='card-flex-display'>
          <q-card-section> 
            <q-form @submit.prevent='recordFormAttendance' ref='selfAttendanceForm'>
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
                :options='organisations'
                label='Select Organisation'
                :rules='[requiredRule]' 
              />
              
              <q-card-actions align='center'> 
              <q-btn
              class='pwan-button'
                label='Record Attendance' 
                type='submit'
                size='md'
                rounded 
                :disabled='isDisabled'
              />
            </q-card-actions>
          </q-form>
          </q-card-section> 
      </q-card>
      </div>
    <q-card v-else class='q-mt-md'>  
          <QRCodeScanner v-if='position.isSet' ref='qrcodescanner'
            @scannedDataSubmitted='recordScannedAttendance'
            />
      </q-card>

      <div class='q-pa-md'>
     <q-table
        class='my-sticky-header-table'
        flat
        bordered
        title='Attendance'
        :rows='rows'
        :columns='columns'
        row-key='id'         
        selection='single' 
        v-model:selected='selected'
      >
        <template v-slot:top>
          <q-label>Attendance List</q-label>
        </template> 

      </q-table>
    </div>
    </div>
  </q-page>
</template>

<script>
import { Geolocation } from '@capacitor/geolocation';
import { ref, computed } from 'vue'; 
import { useI18n } from 'vue-i18n'
import HeaderPage from 'src/components/HeaderPage.vue'; 
import ResponseDialog from 'src/components/ResponseDialog.vue';  
import { isRequired } from 'src/validation/validation';
import { LocalStorage, SessionStorage } from 'quasar';
import axios from 'axios'; 
import path from 'src/router/urlpath';  
import QRCodeScanner from 'src/components/QRCodeScanner.vue'; 
import { format } from 'date-fns'; 
 
export default {
  components: { 
    HeaderPage,
    ResponseDialog,  
    QRCodeScanner,

  },
  data() {
    const { t } = useI18n() 
    const pageName = computed(()=> t('selfattendance.pagename'))
    const hint = computed(()=> t('selfattendance.hint'))
    const showSpinner = ref(false); 
    const headers = SessionStorage.getItem('headers');
    const userEmail = LocalStorage.getItem('userEmail');
    const clients = ref([]);
    const selected = ref([]);
    const organisations = ref([]); 
     const rows = ref([]);
    const formData = ref({
      client: null,
      organisation: null,
    });
    const position ={
      longitude : 0,
      latitude: 0,
      isSet : false
    }
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
        name: 'organisation',
        align: 'left',
        label: 'Organisation/Center',
        field: (row) => row.organisation.name,
        sortable: true,
      },
      {
        name: 'client',
        align: 'left',
        label: 'Client/Center',
        field: (row) => row.client.name,
        sortable: true,
      },
       {
        name: 'attendanceDate',
        align: 'left',
        label: 'Attendance Date',
        field: (row) => format(row.attendanceDate, 'yyyy-MM-dd'),
        sortable: true,
      },
       {
        name: 'attendanceTime',
        align: 'left',
        label: 'Attendance Time',
        field: (row) => format(row.attendanceDate, 'hh:mm:ss'),
        sortable: true,
      },
       
       {
        name: 'seatNumber',
        align: 'left',
        label: 'Seat Number',
        field: (row) => row.seatNumber,
        sortable: true,
      },
       
    ]; 
    return {
      formData,
      clients,
      organisations, 
      headers,
      userEmail,
      pageName,
      hint,
      showSpinner,
      position,
      isDisabled: true,
      childRef,  
      showMessageDialog:false, 
      requiredRule: value => isRequired(value), 
      toggleValue:ref(false), 
      toggleLabel:'Record Attendance By Scanning Center/Organisation QR Code',
      columns,
      rows,
      selected,
    };
  },
  methods: {
    onToggleChange(value){ 
      if(value){
        this.toggleLabel = 'Record Attendance By Filling Form'
      }else{ 
         this.toggleLabel = 'Record Attendance By Scanning Center/Organisation QR Code'
      } 
      if(this.$refs.qrcodescanner != null)
          this.$refs.qrcodescanner.stopCamera();
    },
    loadUserClients() {
      try { 
        axios
          .get(path.CLIENT_SEARCH, this.headers)
          .then((response) => {
            
            console.log(response.data.data)
            this.clients = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            })); 
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
        const requestParam = {
          params: {
            client: selectedItem.value
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
   recordScannedAttendance(record){
      let data = JSON.parse(record); 
      console.log(data)

        const attendanceData = { 
        client : data.client,
        organisation:data.organisation,
        email : this.userEmail,
        longitude:   this.position.longitude ,  
        latitude: this.position.latitude,
      } 
     this.recordAttendance(attendanceData);
   },
   recordFormAttendance() { 
    if (this.$refs.selfAttendanceForm.validate()) {
       const data = { 
        client : this.formData.client.value,
        organisation:this.formData.organisation.value,
        email : this.userEmail,
        longitude:   this.position.longitude ,  
        latitude: this.position.latitude,
      }
      this.recordAttendance(data);
    } 
    },

    recordAttendance(data){
       this.showSpinner= true  
      try { 
        const promise = axios.post(path.REGISTER_ATTENDANCE, data, this.headers);
        promise
          .then((response) => {  
            const result = response.data;   
            if (result.success) {    
               this.childRef = {
              message: response.data.message,
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
                buttonClass: 'bg-white text-teal'
              };  
            }
            this.loadUserAttendance();
            this.showMessageDialog = true;
             this.showSpinner= false;
 
          })
          .catch((error) => {
            console.log('Error>>>>>>>>Axios error:', error);
                this.childRef = {
                message: error.message,
                label: 'Error',
                cardClass: 'bg-negative text-white error',
                textClass: 'q-pt-none',
                buttonClass: 'bg-white text-teal'
              }; 
               this.showMessageDialog = true;
             this.showSpinner= false;
          });
      } catch (error) {
        
        console.log('Error try Catch error>>>>:', error);
           this.childRef = {
                message: error.message,
                label: 'Error',
                cardClass: 'bg-negative text-white error',
                textClass: 'q-pt-none',
                buttonClass: 'bg-white text-teal'
              }; 
              this.showMessageDialog = true;
             this.showSpinner= false
      } 
    },
     loadUserAttendance() {
         const requestParams = {
          params: { 
            email: this.userEmail,
            order_by : '-attendanceDate' 
          },
        };
         
      try {
        console.log('>>>>>requestParams>>>>>>>>',requestParams)
        const promise = axios.get(
          path.ATTENDANCE_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log('response data>>>>>>>', response.data.data); 
            this.rows = response.data.data;  
            this.selected = [];
          })
          .catch((error) => {
             
             consle.log(error)
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    async getCurrentLocation() {
  try {
    console.log("calling getCurrentLocation for mobile app")
    const permission = await Geolocation.requestPermissions();
    if (permission.location === 'granted') {
      const position = await Geolocation.getCurrentPosition();

      this.position = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  isSet : true, 
                };
                this.isDisabled = false
      console.log('Latitude:', position.coords.latitude);
      console.log('Longitude:', position.coords.longitude);
    } else {
      console.warn('Location permission denied by the user.');
    }
  } catch (error) {
    console.error('Error getting location:', error.message);
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
    this.loadUserClients();
    this.loadUserAttendance()
    console.log('>>>>>>>>mounted>>>>>>>>>>');
    try{
        if ('geolocation' in navigator) {
          console.log('Geolocation xxxxxx is supported');
          navigator.geolocation.getCurrentPosition(
              (position) => {
                // Success callback
                this.position = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  isSet : true,

                };
                this.isDisabled = false
              },
              (error) => {                 
                // Error callback
                console.log(">>>>>>>>returning error >>>>>>>>>>")
                console.log(error)
                 try{ 
           console.log("calling get Current Location 2222>>>>>>")
            this.getCurrentLocation()
          }catch(error){
            console.log("error >>>>>",error)
            this.childRef = {
                        message: error.message,
                        label: 'Error',
                        cardClass: 'bg-negative text-white error',
                        textClass: 'q-pt-none',
                        buttonClass: 'bg-white text-teal'
                      }; 
                          this.isDisabled = true;
                          this.showMessageDialog=true; 
                  }
              
            }
            );
        } else {
              try{
                  console.log("calling get Current Location111>>>>>>")
                  this.getCurrentLocation()
                }catch(error){
                   console.log("error >>>>>",error)
                   this.childRef = {
                        message: error.message,
                        label: 'Error',
                        cardClass: 'bg-negative text-white error',
                        textClass: 'q-pt-none',
                        buttonClass: 'bg-white text-teal'
                      }; 
                          this.isDisabled = true;
                          this.showMessageDialog=true;
                }
        }
    }catch(error){
      try{ 
           console.log("calling get Current Location 2222>>>>>>")
            this.getCurrentLocation()
          }catch(error){
            console.log("error >>>>>",error)
            this.childRef = {
                        message: error.message,
                        label: 'Error',
                        cardClass: 'bg-negative text-white error',
                        textClass: 'q-pt-none',
                        buttonClass: 'bg-white text-teal'
                      }; 
                          this.isDisabled = true;
                          this.showMessageDialog=true;
          }
    }
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
