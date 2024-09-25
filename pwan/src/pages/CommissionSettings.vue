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
        <q-form  @submit.prevent="saveRecord" ref="commissionForm">
          <div class="text-center"> 
                <q-spinner v-if="showSpinner" color="primary" size="60px" />
            </div>  
           <q-input
            filled
            bottom-slots
            v-model="formData.name"
            label="Name"  
            :rules="[requiredRule]" 
          />  

          <q-input
            filled
            bottom-slots
            v-model="formData.adminCharge"
            label="Admin Charge(%)"
            type="number"
            step="0.01"
            :rules="[requiredRule]" 
          />  
           <q-input
            filled
            bottom-slots
            v-model="formData.directPercent"
            label="Direct Commission Rate(%)"
            type="number"
            step="0.01"
            :rules="[requiredRule]" 
          />  
           
          <q-input
            filled
            bottom-slots
            v-model="formData.firstIndirectPercent"
            label="First Indirect Commission Rate(%)"
            type="number"
            step="0.01"
            :rules="[requiredRule]" 
          />  
          <q-input
            filled
            bottom-slots
            v-model="formData.secondIndirectPercent"
            label="Second Indirect Commission Rate(%)"
            type="number"
            step="0.01"
            :rules="[requiredRule]" 
          />  
          <q-input
            filled
            bottom-slots
            v-model="formData.thirdIndirectPercent"
            label="Third Indirect Commission Rate(%)"
            type="number"
            step="0.01"
            :rules="[requiredRule]" 
          />  
          <q-input
            filled
            bottom-slots
            v-model="formData.taxVatPercent"
            label="Tax/Vat Rate(%)"
            type="number"
            step="0.01"
            :rules="[requiredRule]" 
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
        title="Commission Settings"
        :rows="rows"
        :columns="columns"
        row-key="id" 
        selection="single" 
        v-model:selected="selected"
      > 
        <template v-slot:top>
          <q-label>Commission Settings</q-label>
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
         <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
      </q-table>
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
    const pageName = computed(()=> t('commissionsettings.pagename'))
    const hint = computed(()=> t('commissionsettings.hint'))
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
        name: "name",
        align: "left",
        label: "Service Name",
        field: (row) => row.name, 
        sortable: true,
      },
      {
        name: "directPercent",
        align: "left",
        label: "Direct Commision",
        field: (row) => row.directPercent,
        sortable: true,
      },
      {
        name: "firstIndirectPercent",
        align: "left",
        label: "First Indirect Commission",
        field: (row) => row.firstIndirectPercent,
        sortable: true,
      }, 
      {
        name: "secondIndirectPercent",
        align: "left",
        label: "Second Indirect Commission",
        field: (row) => row.secondIndirectPercent,
        sortable: true,
      }, 
      {
        name: "thirdIndirectPercent",
        align: "left",
        label: "Third Indirect Commission",
        field: (row) => row.thirdIndirectPercent,
        sortable: true,
      }, 
       
       
    ]; 
    const rows = ref([]);
    const selected = ref([]);
    const formData = ref({}); 
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
      clients:[],
      organisations:[],  
      pageName,
      hint, 
      requiredRule: value => inputFieldRequired(value),
      showSpinner,
      showMessageDialog, 
      action: "add",
      actionLabel:"Create",
      childRef,
    };
  },
  methods: { 
     loadCommissionSettings() {
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        }; 
      try {
        console.log(">>>>>requestParams>>>>>>>>",requestParams)
        const promise = axios.get(
          path.COMMISSION_SETTINGS_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log("response data>>>>>>>", response.data);
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
      if (this.$refs.commissionForm.validate()) {  
        try {
          console.log("this.action>>>>>>",this.action)
           let promise = ""
           this.showSpinner = true; 
          this.formData.client= this.profile.client;
          this.formData.organisation= this.profile.organisation;
          this.formData.createdBy = this.profile.email;
          console.log(">>>>>requestParams>>>>>>>>",this.formData)
          if(this.action == "add"){
                promise = axios.post(
            path.COMMISSION_SETTINGS_CREATE,
            this.formData,
            this.headers
          ); 
          }else if(this.action == "edit"){
                promise = axios.put(
            path.COMMISSION_SETTINGS_UPDATE,
            this.formData,
            this.headers
              );
          } 
          else if(this.action == "delete"){
             promise = axios.post(
            path.COMMISSION_SETTINGS_REMOVE,
            this.formData,
            this.headers
              );
          } 
          console.log(">>>>>>>>promise>>>>>>>",promise)
          promise
            .then((response) => {
              // Extract data from the response 
              const result = response.data
              console.log(">>>>result>>>>>",result)
              console.log(">>>>result message>>>>>",result.message)

              this.childRef = {
              message: result.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };  
            this.showMessageDialog = true;
            console.log("this.showMessageDia thenlog>>>>>",this.showMessageDialog)
            })
            .catch((error) => {
             this.childRef = {
              message: error.message,
              label: "Error",
              cardClass: "bg-negative text-white error",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            }; 
            this.showMessageDialog = true;
            console.log("this.showMessageDia thenlog error >>>>>",this.showMessageDialog)
            }); 
            
             this.showSpinner = false; 
             console.log("this.showMessageDialog>>>>>",this.showMessageDialog)
             //this.resetForm();
             this.loadCommissionSettings();
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      }
    }, 
    resetForm(){ 
      this.formData = {name:'',adminCharge:'',directPercent:'', firstIndirectPercent:'',secondIndirectPercent:'',thirdIndirectPercent:''}; 
      this.action = "add";
      this.actionLabel="Create";
    },
    editItem() {
      console.log(">>>>>this.formData>>>>>>>",this.selected[0])
      if (this.selected.length > 0) {
        this.formData = this.selected[0];
        this.action = "edit";
        this.actionLabel=" Edit ";
      }
    },
   viewItem () {
    console.log(">>>>>this.formData>>>>>>>",this.selected[0])
      if (this.selected.length > 0) {
       this.formData = this.selected[0];
       this.action = "view";
       this.actionLabel=" View ";
      }
    },
    deleteItem() {
      console.log(">>>>>this.formData>>>>>>>",this.selected[0])
       if (this.selected.length > 0) {
        this.formData = this.selected[0];
        this.action = "delete";
        this.actionLabel="Delete";
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
    console.log(">>>>>>>>>user Email >>>>>", this.profile);
  },
  mounted() {  
    console.log(">>>>>>>>>>>profile>>>>>>>>>>",this.profile);
    this.loadCommissionSettings()

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
