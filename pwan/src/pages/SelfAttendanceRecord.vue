<template>
  <q-page padding>
    <div class="q-pa-md">
       <q-card>
          <q-card-section class="pwan-blue text-white">
            <HeaderPage  
                :label="pageName"
                :hint="hint"  
              />
          </q-card-section>
        </q-card>
        <div class="text-center"> 
                <q-spinner v-if="showSpinner" color="primary" size="60px" />
        </div>
        <div class="q-pa-md q-gutter-lg">
          <q-toggle
              v-model="toggleValue"
              :label="toggleLabel"
              @update:model-value="onToggleChange"
            />
            <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
        </div>
      <q-card  v-if="toggleValue" class="card-flex-display">
        <q-card-section> 
          <q-form @submit.prevent="recordFormAttendance" ref="selfAttendanceForm">
            <q-select
              filled
              bottom-slots
              v-model="formData.client"
              @update:model-value="handleClientChange"
              :options="clients"
              label="Select Client"
              :rules="[requiredRule]" 
            />
            <q-select
              filled
              bottom-slots
              v-model="formData.organisation"
              :options="organisations"
              label="Select Organisation"
              :rules="[requiredRule]" 
            />
            
            <q-card-actions align="center"> 
            <q-btn
            class="pwan-button"
              label="Record Attendance" 
              type="submit"
              size="md"
              rounded 
              :disabled="isDisabled"
            />
          </q-card-actions>
        </q-form>
        </q-card-section> 
    </q-card>
    <q-card v-else class="q-mt-md">  
          <QRCodeScanner 
            @scannedDataSubmitted="recordScannedAttendance"
            />
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue"; 
import { useI18n } from 'vue-i18n'
import HeaderPage from "src/components/HeaderPage.vue"; 
import ResponseDialog from "src/components/ResponseDialog.vue";  
import { isRequired } from 'src/validation/validation';
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios"; 
import path from "src/router/urlpath";
import { useRouter } from "vue-router";  
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import QRCodeScanner from "src/components/QRCodeScanner.vue";

const router = useRouter();
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
    const headers = SessionStorage.getItem("headers");
    const userEmail = LocalStorage.getItem("userEmail");
    const clients = ref([]);
    const organisations = ref([]);
    const menus = ref([]);
    const formData = ref({
      client: null,
      organisation: null,
    });
    const position ={
      longitude : 0,
      latitude: 0,
    }
     const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });
    return {
      formData,
      clients,
      organisations,
      menus,
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
      toggleValue:ref(true), 
      toggleLabel:"Record Attendance By Filling Form"
    };
  },
  methods: {
    onToggleChange(value){
      console.log(">>value>>>",value);
      if(value){
        this.toggleLabel = "Record Attendance By Filling Form"
      }else{ 
         this.toggleLabel = "Record Attendance By Scanning"
      }
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
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
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
              "organisations Response >>>>>>>>>>>>",
              response.data.data
            );
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.organisations = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            }));
            console.log("this.organisation >>>>>>>>>>>>", this.organisations);
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
   recordScannedAttendance(record){
      let data = JSON.parse(record); 
      console.log(data)

        const attendanceData = { 
        client : data.client,
        organisation:data.organisation,
        email : data.email,
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
      console.log(">>>>>>>>>>>>>>>",data)
      try { 
        const promise = axios.post(path.REGISTER_ATTENDANCE, data, this.headers);
        promise
          .then((response) => { 
            console.log(">>>>>>>response>>>>>>>>>>>>>>>",response)
            const result = response.data;  
             console.log(">>>>>>>result>>>>>>>>>>>>>>>",result)
            if (result.success) {    
               this.childRef = {
              message: response.data.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };  
            }else{ 
                this.childRef = {
                message: result.message,
                label: "Error",
                cardClass: "bg-negative text-white error",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal"
              }; 
            }
            this.showMessageDialog = true;
             this.showSpinner= false;
 
          })
          .catch((error) => {
            console.log("Error>>>>>>>>Axios error:", error);
                this.childRef = {
                message: error.message,
                label: "Error",
                cardClass: "bg-negative text-white error",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal"
              }; 
               this.showMessageDialog = true;
             this.showSpinner= false;
          });
      } catch (error) {
        
        console.log("Error try Catch error>>>>:", error);
           this.childRef = {
                message: error.message,
                label: "Error",
                cardClass: "bg-negative text-white error",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal"
              }; 
              this.showMessageDialog = true;
             this.showSpinner= false
      } 
    },
    
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("beforeMount");
  },
  mounted() {
    this.loadUserClients();
    console.log(">>>>>>>>mounted>>>>>>>>>>");
    try{
        if ('geolocation' in navigator) {
          console.log('Geolocation is supported');
          navigator.geolocation.getCurrentPosition(
              (position) => {
                // Success callback
                this.position = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                };
                this.isDisabled = false
              },
              (error) => {
                // Error callback
                console.log(error)
              this.childRef = {
              message: error.message,
              label: "Error",
              cardClass: "bg-negative text-white error",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal"
            }; 
                this.isDisabled = true;
                this.showMessageDialog=true;
              }
            );
        } else {
          console.log('Geolocation is not supported by this browser');
        }
    }catch(error){
      console.log(">>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>",error)
    }
  },
 
  beforeUpdate() {
    console.log(">>>>>>>>before updated>>>>>>>>>>");
  },
  updated() {
    console.log(">>>>>>>>updated>>>>>>>>>>");
  },
};
</script>

<style lang="sass">
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
