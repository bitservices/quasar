<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card
      class="card-flex-display" 
    >
    <q-card-section class="pwan-blue text-white">
        <HeaderPage  
            :label="pageName"
            :hint="hint"  
          />
      </q-card-section>
      <q-card-section>
        <q-form  @submit.prevent="saveRecord" ref="orgProfileForm">
          <div class="text-center"> 
                <q-spinner v-if="showSpinner" color="primary" size="60px" />
            </div>  
             <q-input
            filled
            bottom-slots
            v-model="formData.code"
            label="Code"
            :dense="dense"
            :readonly="isReadonly" 
            :rules="[inputRequiredRule]"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.name"
            label="Name"
            :dense="dense"
            :rules="[inputRequiredRule]"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.client"
            :options="clients"
            label="Select client" 
            :dense="dense"
            :readonly="isReadonly"
          />
           <q-select
            filled
            bottom-slots
            v-model="formData.country"
            :options="countries"
            label="Select Country"
            @update:model-value="handleCountryChange"
            :dense="dense"
            :rules="[selectedRule]"
            use-input
            input-debounce="200"
            clearable
            @filter="filterCountries"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.state"
            :options="stateList"
            label="Select State"
            @update:model-value="handleStateChange"
            :dense="dense"
            :rules="[selectedRule]"
            use-input
            input-debounce="200"
            clearable
            @filter="filterStates"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.county"
            :options="counties"
            label="Select County"
            :dense="dense"
            :rules="[selectedRule]"
            use-input
            input-debounce="200"
            clearable
            @filter="filterCounties"
          />

         <q-input
            filled
            bottom-slots
            v-model="formData.website"
            label="website"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.address"
            label="address"
            type="textarea"
            rows="3"
            maxlength="300"
            counter
            :rules="[inputRequiredRule]"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.longitude"
            label="longitude"
            :dense="dense"
            type="number"
          />

          <q-input
            filled
            bottom-slots
            v-model="formData.latitude"
            label="latitude"
            :dense="dense"
            type="number"
          >
              <template v-slot:append>
            <q-icon
              name="edit"
              @click="getPosition"
              class="cursor-pointer"
              
            />
          </template>
            </q-input>
          <q-input
            filled
            bottom-slots
            v-model="formData.radius"
            label="radius"
            :dense="dense"
            type="number"
          />
         <q-input
            filled
            bottom-slots
            v-model="formData.slogan"
            label="slogan"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.meetingDays"
            label="Meeting Days"
            type="textarea"
            rows="2"
            maxlength="200"
            counter
            :readonly="dense"
          >  
              <template v-slot:append>
                <q-icon
                  name="edit"
                  @click="loadMeetingDays"
                  class="cursor-pointer"
                  
                />
              </template>
            </q-input>
           <q-checkbox
            v-model="formData.allowSeatAllocation"
            label="Allowed Seet Allocation"
            color="primary"
          />
          <q-checkbox
            v-model="formData.validateMeetingStartTime"
            label="Validate Meeting Start Time"
            color="primary"
          /> 
          <q-input
            filled
            bottom-slots
            v-model="formData.reservedSeats"
            label="Number of Seats For Reservation"
            :dense="dense"
            type="number"
          /> 
          <q-input
            filled
            bottom-slots
            v-model="formData.seatPrefix"
            label="Seat Prefix"
            :dense="dense" 
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.seatSufix"
            label="Seat Surffix"
            :dense="dense" 
          />
         
          <div class="row">
            <q-btn  id="closeBtn"
                  rounded  
                  label="Close"
                  icon="close"
                  v-close-popup
                  class="pwan-blue top-margin full-width"
                />  
            <q-btn
                  :label="actionLabel"
                  rounded
                  type="submit"
                  icon="save" 
                  class="pwan-button top-margin full-width"
                />
          </div>
          <div v-if="showMeetingDialog">
            <q-dialog v-model="showMeetingDialog" width="1229px" height="600px">
                <q-card style="width: 1229px"> 
                  <q-card-actions align="right">
                  <q-btn rounded color="green" icon="add" size="sm" @click="addMeetingDays" />
                   <q-btn rounded color="red" icon="delete" size="sm"  @click="removeMeetingDays" />
                  </q-card-actions>
                  <q-card-section class="q-pt-none">
                    <div v-if="meetingDays" class="row full-width" ref="meetingDaysDiv"> 
                      <div  v-for="(item, index) in meetingDays" :key="index">
                          <div class="row meetingdays">
                             <div class="col-3"> 
                                    <q-select
                                    filled
                                    bottom-slots
                                    v-model="item.day"
                                    :options="daysOfWeek"
                                    label="Select Day" 
                                    :dense="dense"  
                                    :ref="'meetingday' + index"
                                  /> 
                                </div>
                                <div class="col-3">
                                  <q-input
                                  filled
                                  bottom-slots
                                  v-model="item.meetingName" 
                                  label="Meeting Name" 
                                  :dense="dense"  
                                  :ref="'meetingName' + index"
                                />
                                </div>
                                <div class="col-3">
                                  <q-input
                                  filled
                                  bottom-slots
                                  v-model="item.startTime"
                                  type="time"
                                  label="Start  Time"
                                  :dense="dense" 
                                  :ref="'starttime' + index"
                                />
                                </div>
                                <div class="col-3">
                                <q-input
                                  filled
                                  bottom-slots
                                  v-model="item.endTime"
                                  type="time"
                                  label="End Time"
                                  :dense="dense"  
                                  :ref="'endtime' + index"
                                />
                              </div> 
                              </div>
                        </div>
                      </div> 
                  </q-card-section>
                </q-card>
            </q-dialog>
          </div>
        
            <q-row class="q-mt-md" justify="center">
            <q-col cols="6" sm="4" class="q-mb-md">
              <q-btn
                      rounded  
                      label="Cancel"
                      icon="cancel"
                      v-close-popup
                      class="pwan-blue top-margin full-width"
                    /> 
            </q-col>
            <q-col cols="6" sm="4" class="q-mb-md">
               <q-btn
                          label="Save" 
                          rounded
                          type="submit"
                          icon="save"
                          class="pwan-button top-margin full-width"
                        />
            </q-col>
          </q-row>
 
        </q-form>
      </q-card-section> 
    </q-card>
    </div>
  </q-page>
</template>


<script>
import { LocalStorage, SessionStorage } from "quasar";
import { isReadonly, computed, ref } from "vue"; 
import { useI18n } from 'vue-i18n'
import axios from "axios";
import path from "src/router/urlpath";
import debug from "src/router/debugger"; 
import { useRouter } from "vue-router"; 
import HeaderPage from "src/components/HeaderPage.vue"; 
import { inputFieldRequired,isRequired } from 'src/validation/validation'; 
import { format } from 'date-fns';

export default {
   components: { 
    HeaderPage,  
  }, 
   
  data() {
    
    const { t } = useI18n()  
    const pageName = computed(()=> t('orgprofile.pagename'))
    const hint = computed(()=> t('orgprofile.hint'))
    const router = useRouter();
    const headers = SessionStorage.getItem("headers"); 
    const profile = LocalStorage.getItem("turnelParams");
    const formData = ref({
      last_name: "",
      middle_name: "",
      first_name: "", 
    });
    

    return {
      formData, 
      profile,
      headers, 
      dense:true,
      countries: [],
      allCountries:[],
      stateList: [],
      allStates :[],
      counties: [],
      allCounties :[],
      router,
      showSpinner: false, 
      pageName,
      hint,
      requiredRule: value => inputFieldRequired(value), 
      selectedRule : value => isRequired(value),
      dateOfBirth:null,
    };
  },
  methods: {
    filterCountries(val, update) {
        console.log(">>>>val>>>>>>",val)
      if (val === "") {
        update(() => {
          this.countries = this.allCountries;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.countries = this.allCountries.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    }, 

    filterStates(val, update) {
        console.log(">>>>val>>>>>>",val)
      if (val === "") {
        update(() => {
          this.stateList = this.allStates;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.stateList = this.allStates.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    }, 
    filterCounties(val, update) {
        console.log(">>>>val>>>>>>",val)
      if (val === "") {
        update(() => {
          this.counties = this.allCounties;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.counties = this.allCounties.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    }, 
    saveRecord() {     
       if (this.$refs.orgProfileForm.validate()) {
          this.showSpinner = true;
          this.formData.gender = this.formData.gender.value
          this.formData.status = this.formData.status.code
          const requestData = new FormData();
          for (let key in this.formData) { 
            console.log(key, ":::",this.formData[key])
            requestData.append(key, this.formData[key]);
          }
          
          try { 
            console.log(">>>>reqeust data>>>>>>>",requestData)
            const promise = axios.put(path.USER_UPDATE, requestData, this.headers);
            promise
              .then((response) => {
                // Extract data from the response
                const result = response.data;  
                if (result.success) {  
                  this.formData = result.data; 
                  this.formData.gender = {
                    value : result.data.gender == null? "" : result.data.gender.code,
                    label : result.data.gender == null? "" : result.data.gender.name,
                  }
                  this.showSpinner = false;
                  this.router.push({ path: "/dashboard" });
                  

                }
    
                // You can access properties of the response data as needed
              })
              .catch((error) => {
                debug("Error:", error);
              });
          } catch (error) {
            debug("Error:", error);
          }
       }    
    }, 
    loadOrganisation(){

      try { 
        const requestParams = {
          params: {
            code: this.profile.organisation,
            client : this.profile.client,
          },
        };
        console.log(">>>>>>>>>>requestParams>>>>>>>", requestParams);
        const promise = axios.get(path.ORGANISATION_SEARCH, requestParams, this.headers);
        
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(">>>>>>>>resultsssssssss>>>>>>>", result.data);
            if (result.success) {
              this.formData = result.data[0];
              this.formData.client = {
                value: result.data[0].client.code,
                label: result.data[0].client.name,
              }
              this.formData.country = {
                value: result.data[0].country.code,
                label: result.data[0].country.name,
              }
              this.formData.state = {
                value: result.data[0].state.code,
                label: result.data[0].state.name,
              };
              this.formData.county = {
                value: result.data[0].county.code,
                label: result.data[0].county.name,
              };
              this.formData.status = {
                value: result.data[0].status.code,
                label: result.data[0].status.name,
              };
              this.handleCountryChange(result.data[0].country)
              this.handleStateChange(result.data[0].state)

            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error:", error);
      } 
    },
    handleCountryChange(selectedItem) {
      console.log(">>>selectedItem>>>>",selectedItem)
      const requestParams = {
        params: {
          countryCode: selectedItem.value,
        },
      };
      axios
        .get(path.STATE_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.stateList = response.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allStates = this.stateList;
          console.log("this.state List >>>>>>>>>>>>", this.stateList);
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    handleStateChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: this.formData.country.value,
          stateCode: selectedItem.value,
        },
      };
      axios
        .get(path.COUNTY_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.counties = response.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          this.allCounties = this.counties;
        })
        .catch((error) => {});
    },
    loadMeetingDays(){ 
      this.showMeetingDialog=true;  
      if(this.formData.meetingDays == null || this.formData.meetingDays.trim() == "" || this.formData.meetingDays == "null"){
           this.meetingDays = [{day:'', meetingName:'',startTime:'', endTime:''}];
      }else{
        try { 
               const meetingDaysStr = this.formData.meetingDays; 
              let days = meetingDaysStr.replace(/\\/g, '') 

              days = meetingDaysStr.replace(/\\/g, '').slice(days.indexOf("["),  days.indexOf("]") + 1);  
                days = JSON.parse(days);  
               this.meetingDays = days;   

          } catch (error) {
              console.error('Invalid JSON string:', error);
          }
        
        //   meetingDays.forEach(obj => {
        //     console.log(obj);
        // });
      }
    },
    saveMeetingDays(){
      let meetingDaysArray = [];

      for (let i = 0; i < this.meetingDays.length; i++) {
        console.log("day: ",this.$refs['meetingday' + i][0])
         console.log("meetingName: ",this.$refs['meetingName' + i][0])
          console.log("starttime: ",this.$refs['starttime' + i][0])
           console.log("endtime: ",this.$refs['endtime' + i][0])

         let day = this.$refs['meetingday' + i][0].modelValue;
         let meetingName = this.$refs['meetingName' + i][0].modelValue;
         let startTime = this.$refs['starttime' + i][0].modelValue;
         let endTime = this.$refs['endtime' + i][0].modelValue; 
         let resolvedDay = day.value;
         if(day.value ==null || day.value==undefined || day.value == "undefined"){
            resolvedDay = day
         }        
         console.log("day",day.value, "meetingName",meetingName, "startTime",startTime, "endTime",endTime)
         let meetingObj = {"day":resolvedDay, "meetingName":meetingName, "startTime":startTime, "endTime":endTime}
          meetingDaysArray.push(meetingObj)

      }
      console.log(">>>>>meetingDaysArray>>>>>>>",meetingDaysArray)
      this.formData.meetingDays = JSON.stringify(meetingDaysArray);


       

      this.showMeetingDialog=false;
    },
    validateTime() {
      const regex = /^(2[0-3]|[01]?[0-9]):[0-5][0-9]$/; // HH:MM format
      if (regex.test(this.time)) {
        this.submittedTime = this.time; // Set the submitted time if valid
      } else {
        this.submittedTime = 'Invalid time format';
      }
    },
    validateTimeRule(val) {
      return /^(2[0-3]|[01]?[0-9]):[0-5][0-9]$/.test(val) || 'Time must be in HH:MM format';
    },
    addMeetingDays(){
      if(this.meetingDaysCount < 7 ){
        this.meetingDays.push({day:'', meetingName:'',startTime:'', endTime:''});
        this.meetingDaysCount++;
      }else{

      }
    },
    removeMeetingDays(){
      
      if(this.meetingDaysCount > 1){
      // let componentDiv = this.$refs.meetingDaysDiv
      // componentDiv.removeChild(componentDiv.lastChild)
      this.meetingDays.pop();
      this.meetingDaysCount--;
      }else{

      }
    },
     getPosition(){
      try{
        if ('geolocation' in navigator) { 
          navigator.geolocation.getCurrentPosition(
              (position) => {
                // Success callbac 
                  this.formData.latitude= position.coords.latitude,
                  this.formData.longitude =  position.coords.longitude
                  
              },
              (error) => {
                // Error callback
                console.log(error)
              }
            );
        } else {
          console.log('Geolocation is not supported by this browser');
        }
    }catch(error){
      console.log(">>>>>>>>>>>>>>>error>>>>>>>>>>>>>>>",error)
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
    console.log("before Mount");
  },
  mounted() {
    console.log(">>>>>>>>>mounted>>>>>>>>>>");
     axios
      .get(path.COUNTRY_ALL)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.countries = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        this.allCountries = this.countries;
        console.log(">>>>>>>>>>countries>>>>>",this.countries) 
      this.loadOrganisation()     
      })  
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
