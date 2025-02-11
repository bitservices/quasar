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
       <div  v-if="toggleValue">
          <q-card  v-if="position.isSet" class="card-flex-display">
          <q-card-section>
            <div class="row">
              <div class="col-8 text-h6"> </div>
              <div v-if="imageFile" class="col-4" style="display: flex; justify-content: flex-end">
                      <img :src="imageFile" alt="Preview" style="max-width: 100px" width="150px"  height="100px" />
              </div>
            </div>
          </q-card-section>  
          <q-card-section> 
            <q-form @submit.prevent="recordFormAttendance" ref="attendanceForm">
              <q-hide 
                v-model="formData.email"
              />
              <q-input
                filled
                bottom-slots
                v-model="formData.userName"
                @keyup="handleInput"
                @keydown.enter="handleEnter"
                placeholder="Search for Member"
                :dense="dense" 
              />
              <q-list v-if="showSuggestions && filteredSuggestions.length > 0">
                <q-item
                  clickable
                  v-for="item in filteredSuggestions"
                  :key="item.email"
                  @click="selectRecord(item)"
                >
                  <q-item-section>{{ item.name }}</q-item-section>
                  <q-item-section side>
                    <!-- Side content -->
                    <q-item-label caption lines="1">
                      <img :src="item.image" />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list> 
              <q-card-actions align="center"> 
              <q-btn
                class="pwan-button"
                label="Record Attendance" 
                type="submit"
                size="md"
                rounded
                v-close-popup
              />
            </q-card-actions>
            </q-form>
          </q-card-section> 
        </q-card>
      </div>
     <q-card v-else class="q-mt-md">  
          <QRCodeScanner v-if="position.isSet" ref="qrcodescanner"
            @scannedDataSubmitted="recordScannedAttendance"
            />
      </q-card>
     <div class="q-pa-md">
     <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Members"
        :rows="rows"
        :columns="columns"
        row-key="id"
        selection="single" 
        v-model:selected="selected"
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
import { isReadonly, ref, computed } from "vue"; 
import { useI18n } from 'vue-i18n'
import HeaderPage from "src/components/HeaderPage.vue";  
import { isRequired } from 'src/validation/validation';
import { LocalStorage, SessionStorage } from "quasar"; 
import axios from "axios";
import path from "src/router/urlpath";
import debug from "src/router/debugger";
import ResponseDialog from "src/components/ResponseDialog.vue"; 
import { format } from 'date-fns'; 
import QRCodeScanner from "src/components/QRCodeScanner.vue";
 
 
export default {
   
   components: { 
    ResponseDialog,
    HeaderPage,
    QRCodeScanner,
  }, 
  data() {
    
    const { t } = useI18n() 
    const pageName = computed(()=> t('attendance.pagename'))
    const hint = computed(()=> t('attendance.hint'))
    const profile = LocalStorage.getItem("turnelParams");
    const headers = SessionStorage.getItem("headers");
    const selected = ref([]);
    const formData = ref({}); 
    const medium_dialog = ref(false);   
     const showSpinner = ref(false);
    const rows = ref([]);
     const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });
    const position ={
      longitude : 0,
      latitude: 0,
      isSet:false,
    }
    const columns = [
      {
        name: "name",
        required: false,
        label: "Name",
        align: "left",
        field: (row) =>
          row.userId.last_name +" "+row.userId.first_name + " "+row.userId.middle_name,
        format: (val) => `${val}`,
        sortable: true,
      },
     
      {
        name: "email",
        align: "left",
        label: "Email",
        field: (row) => row.userId.email,
        sortable: true,
      },
       {
        name: "seatNumber",
        align: "left",
        label: "Seat Number",
        field: (row) => row.seatNumber,
        sortable: true,
      },
       {
        name: "membershipType",
        align: "left",
        label: "MembeShip Type",
        field: (row) => row.membership.name,
        sortable: true,
      },
       {
        name: "attendanceDate",
        align: "left",
        label: "Attendance Date",
        field: (row) => format(row.attendanceDate, 'yyyy-MM-dd'),
        sortable: true,
      },
       {
        name: "attendanceTime",
        align: "left",
        label: "Attendance Time",
        field: (row) => format(row.attendanceDate, 'hh:mm:ss'),
        sortable: true,
      },
       
       
    ]; 

    return {
      formData,
      childRef, 
      profile,
      headers, 
      dense:true, 
      imageFile : null, 
      suggestions: [],
      filteredSuggestions: [],
      showSuggestions: false,
      showMessageDialog:false,
      columns,
      rows, 
      medium_dialog,
      selected,
      deactivate:true,
      activate:false,
      dialog_header:"",
      dialog_message:"",
      position,
      pageName,
      hint,
      showSpinner, 
      requiredRule: value => isRequired(value), 
      toggleValue:ref(false),
      toggleLabel:"Record Attendance By Scanning Member QR Code",
       
    };
  },
  methods: {
     onToggleChange(value){ 
      if(value){
        this.toggleLabel = "Record Attendance By Filling Form"
      }else{ 
         this.toggleLabel = "Record Attendance By Scanning Member QR Code"
      }
        if(this.$refs.qrcodescanner != null)
          this.$refs.qrcodescanner.stopCamera();
    },
    handleInput() {
      if (this.formData.userName === "" || this.formData.userName.length < 4) {
        this.filteredSuggestions = [];
        this.showSuggestions = false;
      } else {
        const filter = {
          params: {
            term: this.formData.userName,
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
                " " +
                option.first_name +
                " " +
                option.middle_name,
              email: option.email,
              id: option.id,

            }));
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          }); 
        this.showSuggestions = true;
      }
    },
    handleEnter() {
      if (this.filteredSuggestions.length > 0) { 
        this.selectRecord(this.filteredSuggestions[0]);
      }
    },
    selectRecord(userObj) {
      console.log(">>>>>>>>>>>>value>>>>>>>>",userObj)
      this.formData.userName = userObj.name;
      this.formData.email = userObj.email;
      this.formData.userId = userObj.id;
      this.showSuggestions = false;
      this.loadUserImage(userObj)
      this.loadOrganisationAttendance(userObj.id)
      // Optionally, emit an event or perform other actions when a suggestion is selected
    },
    loadUserImage(userObj){
      console.log(">>>>>>>inside loadUserImage>>>>>>>>>")
       const requestParam = {
        params: {
          userId: userObj.id, 
        },
      };  
      const promise =  axios.get(
          path.USER_IMAGE,
          requestParam,
          this.headers
        );  
         promise
          .then((response) => {
 
            this.imageFile = "data:image/jpeg;base64," + response.data.data.imageByte;
          })
          .catch((error) => {
            console.log(error);
          }); 
    },
    recordScannedAttendance(record){
      let data = JSON.parse(record);  

        const attendanceData = { 
        client : this.profile.client,
        organisation:this.profile.organisation,
        email : data.email,
        longitude:   this.position.longitude ,  
        latitude: this.position.latitude,
      } 
     this.recordAttendance(attendanceData);
   },
    recordFormAttendance(){
      console.log("get here>>>>>>>")
      if (this.$refs.attendanceForm.validate()) {
          const data = {
          client : this.profile.client,
          organisation:this.profile.organisation,
          email : this.formData.email,
          longitude:   this.position.longitude ,  
          latitude: this.position.latitude,
        }
        console.log("data:>>>>>>",data)
        this.recordAttendance(data);
      }
    },
    recordAttendance(data) {      
      this.showSpinner= true
    
      console.log(">>>>>>>>>>>>>>>",data)
      try { 
        const promise = axios.post(path.REGISTER_ATTENDANCE, data, this.headers);
        promise
          .then((response) => { 
            console.log(">>>>>>>response>>>>>>>>>>>>>>>",response)
            const result = response.data;  
            if (result.success) {    
               this.childRef = {
              message: response.data.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            }; 
            this.loadOrganisationAttendance()
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
             this.showSpinner= false
 
          })
          .catch((error) => {
            debug("Error:", error);
            this.childRef = {
              message: error.message,
              label: "Error",
              cardClass: "bg-negative text-white error",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal"
            }; 
            
            this.showMessageDialog = true;
             this.showSpinner= false
          });
      } catch (error) {
            debug("Error:", error);
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
     loadOrganisationAttendance(userId) {
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
        if(userId != null && userId != ""){
          requestParams["params"]["userId"]=userId
        }
      try {
        console.log(">>>>>requestParams>>>>>>>>",requestParams)
        const promise = axios.get(
          path.ATTENDANCE_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log("response data>>>>>>>", response.data.data); 
            this.rows = response.data.data;  
            this.selected = [];
          })
          .catch((error) => {
             
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    showDialog(){
       if (this.selected.length > 0) {
        this.medium_dialog = true;
         const name =this.selected[0].userId.last_name + " "+this.selected[0].userId.first_name + " "+this.selected[0].userId.middle_name
         if(this.selected[0].status.code == "A"){
          this.deactivate = true
          this.activate = false
          this.dialog_header="Deactivate User"
         this.dialog_message=" Are you Sure you want to Deactivate "+ name
        }else{
          this.deactivate = false
          this.activate = true
          this.dialog_header="Activate User"
         this.dialog_message=" Are you Sure you want to Activate "+ name
        }
      } else {
        this.medium_dialog = false;
      }

    }, 
    getSelectedString(value){
      console.log(value)
    },

  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("before Mount");
  },
  mounted() {
    console.log(">>>>>>>>>mounted>>>>>>>>>>");
    this.loadOrganisationAttendance()
    try{
        if ('geolocation' in navigator) {
          console.log('Geolocation is supported');
          navigator.geolocation.getCurrentPosition(
              (position) => {
                // Success callback
                this.position = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  isSet : true,
                };
                console.log(">>>>>>>>>>this.position>>>>>>>>",this.position)
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
              }
            );
        } else {
          console.log('Geolocation is not supported by this browser');
        }
    }catch(error){
      console.log(">>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>",error)
    }
        
  },
  unmounted() { 
     
  },
  updated() {
    console.log(">>>>>>>>>>>update>>>>>>") 
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
