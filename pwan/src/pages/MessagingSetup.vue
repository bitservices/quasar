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
        <q-form  @submit.prevent="saveRecord" ref="msgingSetupForm">
          <div class="text-center"> 
                <q-spinner v-if="showSpinner" color="primary" size="60px" />
            </div>  
           <q-select
                filled
                bottom-slots
                v-model="formData.messageType"
                :options="messageTypes"
                label="Select Message Type" 
                :dense="dense"
                :rule=[requiredRule]
              />
              
             <q-input
              filled
              bottom-slots
              v-model="formData.message"
              label="message"
              type="textarea"
              rows="4"
              maxlength="1000"
              :rules="[inputFieldRule]"
              counter 
            />
             <q-select
            filled
            bottom-slots
            v-model="messagingChannels"
            :options="messageChannelList"
            label="Select Messaging Channels" 
            :dense="dense" 
            multiple
            emit-value
            map-options 
            use-input
            input-debounce="300"
            stack-label
            class="q-mb-md"
           /> 

          <q-card-actions align="center">
          <q-btn
            rounded
            size="md"
            color="primary"
            label="Reset" 
            @click="resetForm" 
          />
          <q-btn
            id="actionBtn"
            :label="actionLabel"
            class="pwan-button"
            type="submit"
             size="md"
            rounded
            v-close-popup
          />
        </q-card-actions>
        </q-form>
      </q-card-section> 
    </q-card>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Payment Integration List"
        :rows="rows"
        :columns="columns"
        row-key="id" 
        selection="single" 
        v-model:selected="selected"
      > 
        <template v-slot:top>
          <q-label>Messaging Setup List</q-label>
          <q-space />
          <q-btn rounded color="blue" icon="edit" size="sm" @click="editItem" />
          <q-btn
            rounded
            color="info"
            icon="visibility"
            size="sm"
            @click="viewItem"
          />
          <q-btn
            rounded
            color="red"
            icon="delete"
            size="sm"
            @click="deleteItem"
          />
        </template>  
      </q-table>
      <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref, computed } from "vue"; 
import path from "src/router/urlpath";
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n'
import HeaderPage from "src/components/HeaderPage.vue"; 
import { inputFieldRequired } from 'src/validation/validation'; 
import ResponseDialog from "src/components/ResponseDialog.vue";

export default {
  components: { 
    HeaderPage,
    ResponseDialog,
  },
  data() {
    const { t } = useI18n();
    const pageName = computed(()=> t('msgingsetup.pagename'))
    const hint = computed(()=> t('msgingsetup.hint'))
    const headers = SessionStorage.getItem("headers");  
    const profile = LocalStorage.getItem("turnelParams");
    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });
   
      const columns = [
      {
        name: "message Type",
        required: false,
        label: "Message Type",
        align: "left",
        field: (row) =>
          row.messageType.name,
        format: (val) => `${val}`,
        sortable: true,
      },
     
      {
        name: "message",
        align: "left",
        label: "Message",
        field: (row) => row.message,
        sortable: true,
      },
      {
        name: "messagingChannel",
        align: "left",
        label: "Messaging Channels",
        field: (row) => row.messagingChannels,
        sortable: true,
      },
       
    ]; 

    const rows = ref([]);
    const selected = ref([]);
    const formData = ref({
      messageType : "",
      message:"",
      client:profile.client,
      organisation:profile.organisation,
      createdBy : profile.email
    }); 
    const showMessageDialog = ref(false);
    const showSpinner = ref(false);

    return {  
      selected,
      columns,
      rows, 
      profile,
      headers, 
      formData, 
      dense:true,   
      pageName,
      hint, 
      requiredRule: value => inputFieldRequired(value),
      showSpinner,
      showMessageDialog, 
      action: "add",
      actionLabel:"Create",
      messageTypes:[],
      messagingChannels:[],
      messageChannelList:[],
      childRef, 
    };
  },
  methods: { 
     loadMessagingSetups() {
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
         
      try { 
        const promise = axios.get(
          path.MESSAGINGSETUP_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response 
            
            console.log("response.data.data>>>>>>>>>",response.data.data)
            this.rows = response.data.data;  
            this.selected = [];
          })
          .catch((error) => {
             
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
     
    saveRecord() { 
      if (this.$refs.msgingSetupForm.validate()) {  
        try {
          console.log("this.action>>>>>>",this.action)
           let promise = ""
           this.showSpinner = true; 
          this.formData.client= this.profile.client;
          this.formData.organisation= this.profile.organisation;
          this.formData.createdBy = this.profile.email;
          this.formData.messageType = this.formData.messageType.value,
          this.formData.messagingChannels = JSON.stringify(this.messagingChannels)
          if(this.action == "add"){
                promise = axios.post(
            path.MESSAGINGSETUP_CREATE,
            this.formData,
            this.headers
          ); 
          }else if(this.action == "edit"){
                promise = axios.put(
            path.MESSAGINGSETUP_UPDATE,
            this.formData,
            this.headers
              );
          } 
          else if(this.action == "delete"){
             promise = axios.post(
            path.MESSAGINGSETUP_REMOVE,
            this.formData,
            this.headers
              );
          }  
          promise
            .then((response) => {
              // Extract data from the response 
              const result = response.data 
              
              if(result.success)  
              {  
                this.childRef = {
                message: result.message,
                label: "Success",
                cardClass: "bg-positive text-white",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal",
              };   
              this.showSpinner= false;
              this.showMessageDialog = true;
              
               
              }else{
                this.childRef = {
                  message: result.message,
                  label: "Error",
                  cardClass: "bg-negative text-white error",
                  textClass: "q-pt-none",
                  buttonClass: "bg-white text-teal",
                };
                this.showSpinner= false;
                this.showMessageDialog = true;
              } 
              this.loadMessagingSetups(); 
              this.resetForm();
            })
            .catch((error) => {
             this.childRef = {
              message: error.message,
              label: "Error",
              cardClass: "bg-negative text-white error",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };  
              this.showSpinner= false;
              this.showMessageDialog = true;
            }); 
            this.loadMessagingSetups(); 
            this.resetForm();
              
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      }
    }, 
    resetForm(){ 
      this.formData = {messageType:'',message:'', createdBy : this.profile.email, organisation:this.profile.organisation, client:this.profile.client}; 
      this.action = "add";
      this.actionLabel="Create";
      this.messagingChannels = [];
    },
    editItem() {
      if (this.selected.length > 0) { 
        this.setformData()
         console.log(">>>>this.formData>>>>",this.formData)
        this.action = "edit";
        this.actionLabel=" Edit "; 
      }
    },
   viewItem () {
    console.log(">>>>>this.formData>>>>>>>",this.selected[0])
      if (this.selected.length > 0) { 
        this.setformData()
       this.action = "view";
       this.actionLabel=" View ";  
      }
    },
    deleteItem() {
      console.log(">>>>>this.formData>>>>>>>",this.selected[0])
       if (this.selected.length > 0) { 
         this.setformData()
        this.action = "delete";
        this.actionLabel="Delete"; 
        document.getElementById('actionBtn').click();
      }
    },
    setformData(){
       this.formData.messageType = {
          label : this.selected[0].messageType.name,
          value : this.selected[0].messageType.code
        };
        this.formData.id = this.selected[0].id
        this.formData.message = this.selected[0].message;
        this.formData.client = this.selected[0].client.code;
         this.formData.organisation = this.selected[0].organisation.code;
         this.formData.createdBy = this.selected[0].createdBy.userName;
         this.messagingChannels = JSON.parse(this.selected[0].messagingChannels);
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
    console.log(">>>>>>>>>user Email >>>>>", this.profile);
  },
  mounted() {  
    console.log(">>>>>>>>>>>profile>>>>>>>>>>",this.profile);
    this.loadMessagingSetups()
     axios
      .get(path.MESSAGETYPE_SEARCH)
      .then((response) => {
        console.log("payment channel Response >>>>>>>>>>>>", response.data); 
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.messageTypes = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        console.log("this.messageTypes >>>>>>>>>>>>", this.messageTypes);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

      axios
      .get(path.MESSAGINGCHANNEL_SEARCH)
      .then((response) => {
        console.log("payment channel Response >>>>>>>>>>>>", response.data); 
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.messageChannelList = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        console.log("this.messageChannelList >>>>>>>>>>>>", this.messageChannelList);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });


  },
  updated() {},
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
