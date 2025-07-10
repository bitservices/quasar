<template>
  <q-page padding>
    <q-card>
        <q-card-section class="pwan-blue text-white">
          <HeaderPage  
              :label="pageName"
              :hint="hint"  
            />
        </q-card-section>
      </q-card>
   <q-toggle
              v-model='toggleValue'
              :label='toggleLabel'
              @update:model-value='onToggleChange'
            /> 
      <q-card
        class="card-flex-display" 
      >  
        <q-card-section>
          <q-form>             
              <q-select
                filled
                bottom-slots
                v-model="formData.donationStatus"
                :options="donationStatusList"
                label="Select Payment Mode"  
                :dense="dense"
              />
              <q-select
                filled
                bottom-slots
                v-model="formData.donationType"
                :options="donationTypeList"
                label="Select Type of Donation"  
                :dense="dense"
              />
            <div v-if='toggleValue'> 
               <div class='row'>
                  <div class='col-8'></div> 
                  <div  class='col-4' style='display: flex; justify-content: flex-end'>
                    <q-badge rounded :label='`Unit(s):   `+requiredUnit' class='pwan-btton text-h6' />
                  </div>
                </div> 
              <q-input 
                filled
                bottom-slots
                v-model='formData.message'
                label='message'
                type='textarea'
                rows='4'
                maxlength='1000'
                @keypress='handleeNessageChange' 
                @change="handleeNessageChange"
                counter 
              />
            </div>
          </q-form>
        </q-card-section>
        <q-card-section>
          <q-card-actions align="center">
            <div v-if='!toggleValue'>  
              <q-btn
                rounded
                size="md"
                color="primary"
                label="Search"
                @click="searchDonationData"
                v-close-popup
              />
              <q-btn
                label="Download"
                color="secondary"
                @click="downloadReport"
                size="md"
                rounded
                v-close-popup
              /> 
            </div>
             <div v-else>  
              <q-btn
                label="Send Message"
                color="primary"
                @click="sendSMS" 
                size="md"
                rounded
                v-close-popup
              /> 
            </div> 
            <Done />           
          </q-card-actions>
        </q-card-section>
         <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />  
      </q-card>
      <div class="q-pa-md">
        <q-table
          class="my-sticky-header-table"
          flat
          bordered
          title="Donation Details"
          :rows="rows"
          :columns="columns"
          row-key="id"
          v-model:selected="selected"
        > 
          <template v-slot:top>
            <q-label>Donation Report</q-label>
            <q-space /> 
          </template> 
        </q-table>  
        <Done />
      </div>  
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar';
import axios from 'axios';
import { ref, computed } from 'vue'; 
import path from 'src/router/urlpath';
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n';
import HeaderPage from 'src/components/HeaderPage.vue';  
import DatePicker from 'src/components/DatePicker.vue';  
import Done from 'src/components/Done.vue'; 
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";  
import { Capacitor } from "@capacitor/core"; 
import { Browser } from "@capacitor/browser"; 
import ResponseDialog from 'src/components/ResponseDialog.vue';
export default {
  components: { 
    HeaderPage, 
    DatePicker,
    Done,
    ResponseDialog,
  },
   
  data() {
    const { t } = useI18n();
    const pageName = computed(()=> t('donationport.pagename'))
    const hint = computed(()=> t('donationport.hint'))
    const headers = SessionStorage.getItem('headers'); 
    const profile = LocalStorage.getItem('turnelParams'); 
    
   const columns = [
      {
        name: 'name',
        required: false,
        label: 'Name',
        align: 'left',
        field: (row) =>
          row.donation.full_name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'phoneNumber',
        align: 'left',
        label: 'Phone Number',
        field: (row) => row.donation.phoneNumber,
        sortable: true,
      }, 
       {
        name: 'description',
        align: 'left',
        label: 'Donation Type',
        field: (row) => row.item.description.name,
        sortable: true,
      },
       {
        name: 'amount',
        align: 'left',
        label: 'Donation Amount', 
          field: (row) => new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(row.item.amount),
        sortable: true,
      },
      {
        name: 'donationType',
        align: 'left',
        label: 'Payment Mode',
        field: (row) => row.item.donationStatus.name,
        sortable: true,
      },
       
       
    ]; 

    const rows = ref([]);
    const selected = ref([]);
    const formData = ref({});
    const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {},
    });

    return {  
      selected,
      columns,
      rows, 
      headers, 
      formData,
      profile,
      dense:true, 
      donationStatusList:[],  
      donationTypeList : [],
      pageName,
      hint,
      toggleValue: false,
      toggleLabel: "Donation Report",
      requiredUnit:1,
      showSpinner:false,
      showMessageDialog:false,
      childRef,

    };
  },
  methods: { 
    
    resolveRequiredUnit(){ 
       const msgLen =  this.formData.message == null ? 0 : this.formData.message.length;  
        if(msgLen > 160){
          this.requiredUnit = Math.ceil(msgLen/160) 
        }else{
           this.requiredUnit = 1
        }
    },
    handleeNessageChange(){ 
        this.resolveRequiredUnit()

    },
    onToggleChange(value){ 
      if(value){
       
         this.toggleLabel = 'Send SMS'
      }else{ 
         this.toggleLabel = 'Donation Report'
      } 
    },
    searchDonationData() {
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,            
            order_by : 'full_name' 
          },
        };
         
         if(this.formData.donationStatus != null && this.formData.donationStatus.value != null &&  this.formData.donationStatus.value != ''){
           requestParams['params']['status'] = this.formData.donationStatus.value
        }

         if(this.formData.donationType != null && this.formData.donationType.value != null &&  this.formData.donationType.value != ''){
           requestParams['params']['donationType'] = this.formData.donationType.value
        }

        console.log(">>>>>this.requestParams>>>>>>>",requestParams)
        
      try { 
        const promise = axios.get(
          path.DONATOR_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response 
            let computedResultLis = [] 
            for (let i = 0; i < response.data.data.length; i++) { 
                 
                 let donationResult = structuredClone(response.data.data[i]);
                 for (let k = 0; k < donationResult.donationItems.length; k++) {
                  let item  = donationResult.donationItems[k]  
                      computedResultLis.push({"donation":donationResult, "item":item })
                 }
              }
              
            console.log(">>>>>>>computedResultLis>>>>>>>",computedResultLis)  
            this.selected = [];
            this.rows = computedResultLis
          })
          .catch((error) => {
             console.log(error)
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }, 
  async sendSMS(){     
     
      this.showSpinner= true   
      const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation, 
            message : this.formData.message,        
            order_by : 'full_name' ,
            requiredUnit: this.requiredUnit,
          },
        };
        
         if(this.formData.donationStatus != null && this.formData.donationStatus.value != null &&  this.formData.donationStatus.value != ''){
           requestParams['params']['status'] = this.formData.donationStatus.value
        }

         if(this.formData.donationType != null && this.formData.donationType.value != null &&  this.formData.donationType.value != ''){
           requestParams['params']['donationType'] = this.formData.donationType.value
        }
        
      try { 
        const promise = axios.get(
          path.DONATOR_SEND_SMS,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response              
            const result = response.data;
            console.log(">>>>>>result>>>>>>",result)
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
                  message: result.message,
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
                  label: 'Error',
                  cardClass: 'bg-negative text-white error',
                  textClass: 'q-pt-none',
                  buttonClass: 'bg-white text-teal',
                }
          });
      } catch (error) {
        console.error('Error submitting form:', error);
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
  },

async downloadReport() {
  console.log(">>>>>>calling download file 22222 2222>>>>>>>>>>>")  
  try {
     const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
            order_by : 'full_name' 
          },
        };
          
         if(this.formData.donationStatus != null && this.formData.donationStatus.value != null &&  this.formData.donationStatus.value != ''){
           requestParams['params']['status'] = this.formData.donationStatus.value
        }
         if(this.formData.donationType != null && this.formData.donationType.value != null &&  this.formData.donationType.value != ''){
           requestParams['params']['donationType'] = this.formData.donationType.value
        }
    const fileData = ""
     const response = await axios.get(
          path.DONATION_REPORT,
          requestParams,
          this.headers
        ); 
    console.log(">>>>>>>>>>>>fileData>>>>>>>",response.data) 
      console.log('File saved in browser successfully!');
        // Extract data from the response 
            const blob = new Blob([response.data], { type: 'application/pdf', 'Content-Disposition': 'attachment; filename="attendance_report.pdf"' });
          // Create a URL for the Blob (useful for download or preview)
          const blobUrl = URL.createObjectURL(blob);

          // Create a link element to trigger the download
          if (Capacitor.isNativePlatform()) { 
            console.log(">>>>>>>>>>inside capacitor platform>>>>>>>>>")
            await Browser.open({ url: blobUrl }); 
              // Optional: Revoke the blob URL after a delay (cleanup)
              setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
          }else{ 
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'donation_report.pdf'; // Set the filename for download 
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          console.log("File downloaded in browser!")
        }
 
  } catch (error) {
    console.error('Filesystem error:', error);
  }
},


async downloadFilexxx() {
  await requestPermission(); // Ensure permission is granted
  
          const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
          
        if(this.formData.userId != null && this.formData.userId.value != null &&  this.formData.userId.value != ''){
          requestParams['params']['userId'] = this.formData.userId.value
        }
        if(this.attendanceDate != null && this.attendanceDate != null &&  this.attendanceDate != ''){
          requestParams['params']['attendanceDate'] = this.attendanceDate
        }
        console.log('requestParams>>>>>>>>',requestParams)
      try { 
        const response =  await axios.get(
          path.ATTENDANCE_REPORT,
          requestParams,
          this.headers
        ); 
        console.log(">>>>>>>>>>>promise>>>>>>>>>>")
        promise
          .then((response) => { 
      if (Capacitor.isNativePlatform()) {
      // Mobile: Convert Byte Array to Base64 and Save  
        Filesystem.writeFile({
          path: "attendance_report.pdf",
          data: response.data,
          directory: Directory.Documents,
          encoding: Encoding.Base64,
        });
        console.log("File saved on mobile!");
      } else {
            // Extract data from the response 
            const blob = new Blob([response.data], { type: 'application/pdf', 'Content-Disposition': 'attachment; filename="attendance_report.pdf"' });
          // Create a URL for the Blob (useful for download or preview)
          const blobUrl = URL.createObjectURL(blob);

          // Create a link element to trigger the download
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'attendance_report.pdf'; // Set the filename for download 
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          console.log("File downloaded in browser!")
        }
            
          })
          .catch((error) => {
              console.log(error)
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
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
    setAttendanceDate(value){
      this.attendanceDate = value;
    },
  arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
     
    
  },
  beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() { 
  },
 
 mounted() { 
  console.log('>>>>>>this.profile>>>>>',this.profile)
      const requestParams = {
        params: {
          client: this.profile.client,
          organisation: this.profile.organisation,
        },
      };
      const promise = axios.get(
        path.DONATIONSTATUS_SEARCH, 
        this.headers
      );
      console.log('>>>>>>>>promise>>>>>>>', promise);
      promise
        .then((response) => {
          console.log('>>>>>>>>>>>>response.data.data>>>>>>>>>>>>>>>>',response.data.data)
          this.donationStatusList = response.data.data.map((option) => ({
            label: option.name,          
            value: option.code,
          }));
        })
        .catch((error) => {
          console.log(error);
        });



  const donationTypePromise = axios.get(
        path.DONATIONTYPE_SEARCH, 
        this.headers
      );
      console.log('>>>>>>>>promise>>>>>>>', promise);
      donationTypePromise
        .then((response) => {
          console.log('>>>>>>>>>>>>response.data.data>>>>>>>>>>>>>>>>',response.data.data)
          this.donationTypeList = response.data.data.map((option) => ({
            label: option.name,          
            value: option.code,
          }));
        })
        .catch((error) => {
          console.log(error);
        });

     
  },
  updated() {},
};
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 500px

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
