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
    <q-card
      class="card-flex-display" 
    > 
       <q-card-section>
        <div class="row">
          <div class="col-8 text-h6">Attendance Report</div> 
        </div>
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.userId"
            :options="orgUsers"
            label="Select Member" 
            @update:model-value="loadUserImage"
            :dense="dense"
          />
           <DatePicker v-model="attendanceDate" label="Attendance Date" @setDate="setAttendanceDate"/> 
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="center">
          <q-btn
            rounded
            size="md"
            color="primary"
            label="Search"
            @click="searchAttendanceData"
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
          <Done />
        </q-card-actions>
      </q-card-section>
    </q-card>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="User Outstanding Payments"
        :rows="rows"
        :columns="columns"
        row-key="id"
        v-model:selected="selected"
      > 
        <template v-slot:top>
          <q-label>Attendance Report</q-label>
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
export default {
  components: { 
    HeaderPage, 
    DatePicker,
    Done,
  },
   
  data() {
    const { t } = useI18n();
    const pageName = computed(()=> t('attendancereport.pagename'))
    const hint = computed(()=> t('attendancereport.hint'))
    const headers = SessionStorage.getItem('headers'); 
    const profile = LocalStorage.getItem('turnelParams'); 
    
   const columns = [
      {
        name: 'name',
        required: false,
        label: 'Name',
        align: 'left',
        field: (row) =>
          row.userId.last_name +' '+row.userId.first_name + ' '+row.userId.middle_name,
        format: (val) => `${val}`,
        sortable: true,
      },
     
      {
        name: 'email',
        align: 'left',
        label: 'Email',
        field: (row) => row.userId.email,
        sortable: true,
      },
      {
        name: 'phoneNumber',
        align: 'left',
        label: 'Phone Number',
        field: (row) => row.userId.phoneNumber,
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
       
       
    ]; 

    const rows = ref([]);
    const selected = ref([]);
    const formData = ref({});

    return {  
      selected,
      columns,
      rows, 
      headers, 
      formData,
      profile,
      dense:true, 
      orgUsers:[], 
      paymentModes:[], 
      paymentTypes:[],
      imageFile:null,
      attendanceDate: null,
      pageName,
      hint,
    };
  },
  methods: {
     
    searchAttendanceData() {
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation
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
        const promise = axios.get(
          path.ATTENDANCE_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log('response data>>>>>>>', response.data);
            this.rows = response.data.data;  
            this.selected = [];
          })
          .catch((error) => {
             console.log(error)
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }, 

async requestFilesystemPermission() {

console.log(">>>>>>inside requestFilesystemPermission>>>>>>",Capacitor.getPlatform())
  if (Capacitor.getPlatform() === 'android') {
    const permissionStatus = await Filesystem.requestPermissions();
    console.log('Filesystem permission status:', permissionStatus);
  }
}, 
 
async downloadReport() {
  console.log(">>>>>>calling download file 22222 2222>>>>>>>>>>>")  
  try {
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
    const fileData = ""
     const response = await axios.get(
          path.ATTENDANCE_REPORT,
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
          a.download = 'attendance_report.pdf'; // Set the filename for download 
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
