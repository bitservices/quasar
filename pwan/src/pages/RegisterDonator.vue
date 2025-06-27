<template>
  <q-page padding class='flex flex-center app-bg'>
    <q-card style='width: 600px'>
      <q-card-section class='pwan-blue text-white'>
        <HeaderPage  
            :label='pageName'
            :hint='hint'  
          />  
      </q-card-section>

      <q-card-section>
        <div>
          <q-form @submit.prevent='handleSubmit' ref='donatorRegistrationForm'> 
             <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div>  
             
            <q-input
              filled
              bottom-slots
              v-model='formData.full_name'
              label='Donator Name'
              @keyup='handleInput'
              @keydown.enter='handleEnter'
              :dense='dense' 
            > 
            </q-input>
            <q-list v-if='showSuggestions && filteredSuggestions.length > 0'>
                <q-item
                  clickable
                  v-for='item in filteredSuggestions'
                  :key='item.id'
                  @click='selectRecord(item)'
                >
                  <q-item-section>{{ item.name }}</q-item-section>
                  <q-item-section side>
                    <!-- Side content -->
                    <q-item-label caption lines='1'>
                      <img :src='item.image' />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>



            <q-input
            filled
            bottom-slots
            v-model='formData.phoneNumber'
            label='Phone Number' 
            :dense='dense' 
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.donationItems'
            label='Donation Items'
            type='textarea'
            rows='2'
            maxlength='200'
            counte
            :readonly='isReadonly'
          >  
              <template v-slot:append>
                <q-icon
                  name='edit'
                  @click='loadDonationItems'
                  class='cursor-pointer'
                  
                />
              </template>
            </q-input>  
            <div v-if='showDonationDialog'>
            <q-dialog v-model='showDonationDialog'>
                <q-card> 
                  <q-card-actions align='right'>
                  <q-btn rounded color='green' icon='add' size='sm' @click='addDonationItem' />
                   <q-btn rounded color='red' icon='delete' size='sm'  @click='removeDonationItem' />
                  </q-card-actions>
                  <q-card-section class='q-pt-none'>
                    <div v-if='donationItems' class='row full-width' ref='donatingItemsDiv'> 
                      <div  v-for='(item, index) in donationItems' :key='index'>
                              <div class='row donationItem'>
                               <q-input type="hidden" v-model='item.id' :ref='"donationId" + index'/>
                                 
                              <div class='col-4'> 
                                  <q-select
                                    filled
                                    bottom-slots
                                    v-model='item.description'
                                    :options='donationTypeList'
                                    label='Select Description' 
                                    :dense='dense'  
                                    :ref='"donationDescription" + index'
                                  /> 
                                </div> 
                                
                                <div class='col-4'>
                                  <q-input
                                  filled
                                  bottom-slots
                                  v-model='item.amount'
                                  label='Enter Amount'
                                  type='number'
                                  step='0.01'
                                  :ref='"donationAmount" + index'
                                /> 
                                </div> 
                                  <div class='col-4'> 
                                    <q-select
                                    filled
                                    bottom-slots
                                    v-model='item.donationStatus'
                                    :options='donationStatusList'
                                    label='Select Mode ' 
                                    :dense='dense'  
                                    :ref='"donationStatus" + index'
                                  /> 
                                </div>
                                
                              </div>
                        </div>
                      </div>  
                  </q-card-section>
                  <q-card-actions align='center'>
                    <q-btn
                      flat
                      label='Cancle'
                      class='pwan-blue text-white'
                      v-close-popup
                      rounded
                    />
                    <q-btn
                      @click='saveDonationItems'
                      flat
                      label='Save' 
                      class='pwan-button text-white'
                      rounded 
                    /> 
                  </q-card-actions>
                </q-card>
              </q-dialog>
          </div>
          <q-btn rounded class='pwan-button top-margin full-width' icon='register' :label='donationLabel' type='submit' /> 
     
          </q-form>
        </div>
         <ResponseDialog
            v-model='showMessageDialog'
            :cardClass='childRef.cardClass'
            :textClass='childRef.textClass'
            :label='childRef.label'
            :message='childRef.message'
            :buttonClass='childRef.buttonClass'
          />  
      </q-card-section> 
      
    </q-card>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'; 
import { useI18n } from 'vue-i18n'
import axios from 'axios';
import {  SessionStorage } from 'quasar'; 
import path from 'src/router/urlpath';   
import HeaderPage from 'src/components/HeaderPage.vue';  
import { useRouter } from 'vue-router';
import ResponseDialog from 'src/components/ResponseDialog.vue';   
import { validatePhoneNumber } from 'src/validation/validation';

export default {
   components: { 
    HeaderPage, 
    ResponseDialog,
  }, 
  data() {
    const { t } = useI18n()  
    const pageName = computed(()=> t('donator.pagename'))
    const hint = computed(()=> t('donator.hint'))
    const router = useRouter();
    const formData = ref({ 
      client: 'CMO',
      organisation : 'CMO', 
    }); 
    const donationStatusList= ref(null)
    const donationTypeList= ref(null)
    const showMessageDialog = ref(false);
    const donationItems = ref(null)
    const donationCount = ref(1); 
    const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {}, 
    });
    return {
      isPwd: ref(true),
      formData, 
      dense:false,
      pageName,
      hint,
      showSpinner: false,
      router,
      showMessageDialog,
      childRef, 
      validationPhoneRule : value => validatePhoneNumber(value), 
      showDonationDialog :false,
      donationStatusList,
      donationTypeList,
      donationItems,
      donationCount,      
      filteredSuggestions: [],
      showSuggestions: false,
      donationLabel : "Create Donator",
      isReadonly : true,


    };
  },
  methods : {
    handleSubmit() { 
     if (this.$refs.donatorRegistrationForm.validate()) {
      this.showSpinner = true; 
      try { 
        

        this.formData.donationItems = JSON.parse(this.formData.donationItems)
        //
        console.log(">>>this.formData.donationItems length>>>>",this.formData.donationItems.length)
         for (let i = 0; i < this.formData.donationItems.length; i++) {
          console.log(i, "  description ", this.formData.donationItems[i].description.value)
          console.log(i, " donationStatus  ", this.formData.donationItems[i].donationStatus.value)
          this.formData.donationItems[i].description = this.formData.donationItems[i].description.value;
          this.formData.donationItems[i].donationStatus = this.formData.donationItems[i].donationStatus.value;
          
         } 
        if(this.formData.id != null && this.formData.id != ""){ 
          this.handleUpdateDonator()
          return
        }
         const promise = axios.post(path.DONATOR_CREATE,
          this.formData
        );
        promise
          .then((response) => {
            // Extract data from the respons 
          const result = response.data;
          console.log('>>>>>>>>>>>result>>>>>>>',result)
          if (result.success) {  
              this.showSpinner = false;   
               this.childRef = {
                message: result.message,
                label: 'Success',
                cardClass: 'bg-positive text-white error',
                textClass: 'q-pt-none',
                buttonClass: 'bg-white text-teal',
              }; 
            this.showMessageDialog = true;
            }else{
            console.log('>>>>>error result>>>>>>>',result)
              this.childRef = {
              message: result.message,
              label: 'Error',
              cardClass: 'bg-negative text-white error',
              textClass: 'q-pt-none',
              buttonClass: 'bg-white text-teal',
            };
            this.showSpinner = false;
            this.showMessageDialog = true;
          }
          })
          .catch((error) => {
             
             console.log(error)
          }); 
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      
       setInterval(()=>{ 
        window.location.reload()
      },2000)
     }
    },

     handleUpdateDonator() { 
      try {         
         
         const promise = axios.put(path.DONATOR_UPDATE,
          this.formData
        );
        promise
          .then((response) => {
            // Extract data from the respons 
          const result = response.data;
          console.log('>>>>>>>>>>>result>>>>>>>',result)
          if (result.success) {  
              this.showSpinner = false;   
               this.childRef = {
                message: result.message,
                label: 'Success',
                cardClass: 'bg-positive text-white error',
                textClass: 'q-pt-none',
                buttonClass: 'bg-white text-teal',
              }; 
            this.showMessageDialog = true;
            }else{
            console.log('>>>>>error result>>>>>>>',result)
              this.childRef = {
              message: result.message,
              label: 'Error',
              cardClass: 'bg-negative text-white error',
              textClass: 'q-pt-none',
              buttonClass: 'bg-white text-teal',
            };
            this.showSpinner = false;
            this.showMessageDialog = true;
          }
          })
          .catch((error) => {
             
             console.log(error)
          }); 
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      setInterval(()=>{ 
        window.location.reload()
      },2000)
    },


    loadDonationItems(){ 
      this.showDonationDialog=true;  
      if(this.formData.donationItems == null || this.formData.donationItems == '' || this.formData.donationItems == 'null' || this.formData.donationItems == 'nan' || this.formData.donationItems.length == 0){
           this.donationItems = [{description:'',amount:0.00, donationStatus:''}];
      }else{

        // for (let i = 0; i < this.donationItems.length; i++) {  
        //     this.donationItems[i].description.value = this.donationItems[i].description
        //     this.donationItems[i].donationStatus.value =this.donationItems[i].donationStatus
        // }
        console.log(">>>> this.donationItems wwwww>>>>>>>", this.donationItems)
      }
    },

    saveDonationItems(){
      let donationItemArray = [];

      for (let i = 0; i < this.donationItems.length; i++) {
         
         let donationDescription = this.$refs['donationDescription' + i][0].modelValue;
         let donationAmount = this.$refs['donationAmount' + i][0].modelValue;
         let donationStatus = this.$refs['donationStatus' + i][0].modelValue;
         let donationId = this.$refs['donationId' + i][0].modelValue; 

         donationStatus = donationStatus.value
          donationDescription = donationDescription.value 
         
 
          
         let donationObj = {id: donationId, description:{value:donationDescription}, amount:donationAmount, donationStatus:{value:donationStatus}}
          donationItemArray.push(donationObj)

      }
      console.log('>>>>>donationItemArray>>>>>>>',donationItemArray)
      this.formData.donationItems = JSON.stringify(donationItemArray); 

      this.showDonationDialog=false;
    },

     addDonationItem(){
      if(this.donationCount < 3 ){
        this.donationItems.push({description:'',amount:0.00, donationStatus:''});
        this.donationCount++;
      } 
    },
    removeDonationItem(){ 
      if(this.donationCount > 0){ 
      this.donationItems.pop();
      this.donationCount--;
      } 
    },
    handleInput() {
      this.filteredSuggestions = [];
      if (this.formData.full_name === '' || this.formData.full_name.length < 3) {        
        this.showSuggestions = false;
      } else {
        const filter = {
          params: {
            term: this.formData.full_name,
          },
        };
        axios
          .get(path.DONATOR_AUTOCOMPLETER_SEARCH, filter, this.headers)
          .then((response) => {
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            console.log(response.data.data);
            if(response.data.data.length > 0)
            {
              this.filteredSuggestions = response.data.data.map((option) => ({
                name:
                  option.full_name +
                  ' ( ' +
                  option.phoneNumber +' )',  
                id: option.id,
                phoneNumber:option.phoneNumber,
                full_name : option.full_name,
                donationItems :  option.donationItems

              }));
            }
          })
          .catch((error) => {
            console.error('Error fetching options:', error);
          }); 
        this.showSuggestions = true;
      }
    },
    handleEnter() {
      if (this.filteredSuggestions.length > 0) { 
        this.selectRecord(this.filteredSuggestions[0]);
      }
    },
    selectRecord(donatorObj) {
      console.log('>>>>>>>>>>>>donatorObj>>>>>>>>',donatorObj) 
      this.formData.phoneNumber = donatorObj.phoneNumber;
      this.formData.id = donatorObj.id;
      this.formData.full_name = donatorObj.full_name;
      this.donationItems = []
       
      this.donationItems = donatorObj.donationItems.map((option) => ({
              description:{value:option.description.code,label:option.description.name}, 
              amount : option.amount,
              donationStatus:{value:option.donationStatus.code,label:option.donationStatus.name},
              id:option.id

            }));
      this.formData.donationItems = JSON.stringify(this.donationItems); 
      console.log(">>this.donationItems>>>>>",this.donationItems)
      this.showSuggestions = false;  
      this.donationLabel = "Update Donator"
      // Optionally, emit an event or perform other actions when a suggestion is selected
    },

   
  }, 

   beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('before Mount');
  },
  mounted() {
    console.log('mounted');  
      
      axios
      .get(path.DONATIONSTATUS_SEARCH)
      .then((response) => { 
        console.log(">>>>>donation status response data>>>>>", response.data)
        this.donationStatusList = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        })); 
      }) 


       axios
      .get(path.DONATIONTYPE_SEARCH)
      .then((response) => { 
        console.log(">>>>>donation status response data>>>>>", response.data)
        this.donationTypeList = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        })); 
      }) 

  },
  unmounted() {
    console.log('Calling unmounted>>>>>>>>>>'); 
  },
  updated() { 
     console.log('Calling Updated>>>>>>>>>>'); 
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == 'edit' || this.action == 'view') {
      // try {
      //   this.isReadonly = true
      //   const requestParams = {
      //     params: {
      //       id: this.searchValue,
      //     },
      //   };
      //   const promise = axios.get(this.urlLink, requestParams, this.headers);
      //   console.log('>>>>>>>>>>promise>ssssssssss>>>>>>>', promise);
      //   promise
      //     .then((response) => {
      //       // Extract data from the response
      //       const result = response.data;
      //       console.log('>>>>>>>>resultsssssssss>>>>>>>', result.data);
      //       if (result.success) {
      //         this.formData = result.data[0];
      //         this.formData.client = {
      //           value: result.data[0].client.code,
      //           label: result.data[0].client.name,
      //         }
      //         this.formData.country = {
      //           value: result.data[0].country.code,
      //           label: result.data[0].country.name,
      //         }
      //         this.formData.state = {
      //           value: result.data[0].state.code,
      //           label: result.data[0].state.name,
      //         };
      //         this.formData.county = {
      //           value: result.data[0].county.code,
      //           label: result.data[0].county.name,
      //         };
      //         this.formData.status = {
      //           value: result.data[0].status.code,
      //           label: result.data[0].status.name,
      //         };

      //       }
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // } catch (error) {
      //   console.error('Error:', error);
      // }
    } else {
      this.formData = { code: '', name: '' };
      this.isReadonly = false 
    }
  },
};
</script> 
