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
         <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.client"
            :options="userclients"
            label="Filter By Client" 
            @update:model-value="filterOrganisation"
            :dense="dense"
            use-input
            input-debounce="200"
            clearable
            @filter="filterClients"
          /> 
        </q-form>  

      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Organisation"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :selected-rows-label="getSelectedString"
        selection="single"
        @row-click="handleRowClick"
        v-model:selected="selected"
      >
        <template v-slot:top>
          <q-label>Organisation</q-label>
          <q-space />
          <q-btn rounded color="green" icon="add" size="sm" @click="addItem" />
          <q-btn rounded color="blue" icon="edit" size="sm" @click="editItem" />
          <q-btn
            rounded
            color="info"
            icon="visibility"
            size="sm"
            @click="viewItem"
          />
          <OrganisationFormDialog
            v-model="showFormDialog"
            :onClick="saveRecord"
            @formDataSubmitted="saveRecord"
            label="Organisation"
            :searchValue="searchValue"
            :action="action"
            :actionLabel="actionLabel"
            :urlLink="urlLink"
          />
          <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
          <q-btn v-if="issuperuser"
            rounded
            color="red"
            :icon="actionBtn"
            size="sm"
            @click="showDialog"
          >
            <q-dialog v-model="medium_dialog">
              <q-card style="width: 700px" class="bg-info text-white">
                <q-card-section>
                  <div class="text-h6">{{dialog_header}}</div>
                </q-card-section>  
                <q-card-section class="q-pt-none">
                   {{dialog_message}}
                </q-card-section>
                <q-card-actions align="center" class="bg-white text-teal">
                 
                  <q-btn v-if="activate"
                    @click="activateUser"
                    flat
                    label="Activate"
                    class="bg-secondary text-white"
                    v-close-popup
                    rounded
                    :disable="disableActivate"
                  />
                   <q-btn v-if="deactivate"
                    @click="deactivateUser"
                    flat
                    label="De-Activate"
                    v-close-popup
                    class="bg-negative text-white"
                    rounded
                    :disable="disableDeActivate"
                  />
                  <q-btn
                    flat
                    label="Cancle"
                    class="bg-primary text-white"
                    v-close-popup
                    rounded
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-btn>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue"; 
import { useI18n } from 'vue-i18n'
import HeaderPage from "src/components/HeaderPage.vue"; 
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios"; 
import OrganisationFormDialog from "src/components/OrganisationFormDialog.vue";
import ResponseDialog from "src/components/ResponseDialog.vue";
import path from "src/router/urlpath";
import { format } from 'date-fns';
export default {
  components: {
    OrganisationFormDialog,
    ResponseDialog,
    HeaderPage,
  },
  setup() {
    const headers = SessionStorage.getItem("headers");
    const userEmail = "";
    const columns = [
      {
        name: "code",
        required: false,
        label: "Code",
        align: "left",
        field: (row) => row.code,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "name",
        align: "left",
        label: "Name",
        field: (row) => row.name,
        sortable: true,
      },
      {
        name: "client",
        align: "left",
        label: "Client Name",
        field: (row) => row.client.name,
        sortable: true,
      },
      {
        name: "expirationDate",
        align: "left",
        label: "Renewal Date",
        field: (row) => row.expirationDate ?format(row.expirationDate, 'yyyy-MM-dd'):'',
        sortable: true,
      },
    ];
    const parentData = ref({
      code: "",
      name: "",
    });
     const { t } = useI18n() 
    const pageName = computed(()=> t('organisation.pagename'))
    const hint = computed(()=> t('organisation.hint'))
    const urlLink = ref(path.ORGANISATION_SEARCH);
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const action = ref("");
    const searchValue = ref("");
    const actionBtn = ref("done");
    const issuperuser = ref(false); 
    const rows = ref([]);
    const selected = ref([]);
    const actionLabel = ref("Submit");
    const medium_dialog = ref(false);
    const deactivate = ref(true);
    const activate = ref(false); 
     const dialog_header = ref(null);
     const dialog_message= ref(null);
     const showSpinner = ref(false);  
    const formData = ref({});
    const userclients = ref([]);
     const allClients = ref([]);    
    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });

  const loadUserClients = async ()=>{
    try {
        const userEmail = LocalStorage.getItem("userEmail");
        const requestParam = {
          params: {
            createdBy: userEmail,
          },
        };
        const response = await axios.get(
          path.CLIENT_FIND_BY_CREATOR,
          requestParam,
          headers
        ); 
        if (response.data) { 
          console.log(response.data) 
          userclients.value = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        allClients.value = userclients.value
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }

  };
   const filterClients =(val, update)=> {
        console.log(">>>>val>>>>>>",val)
      if (val === "") {
        update(() => {
          userclients.value = allClients.value;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        userclients.value = allClients.value.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    };
  const filterOrganisation = async ()=>{

    try {
      
        showSpinner.value=true;
        const userEmail = LocalStorage.getItem("userEmail");
        const requestParam = {
          params: {
            createdBy: userEmail,
            client : formData.value.client.value,
          },
        };
        console.log(">>>>>>requestParam>>>>>>>>>>>>>>",requestParam)
        const response = await axios.get(
          path.ORGANISATION_SEARCH,
          requestParam,
          headers
        ); 
        console.log("response.data>>>>>>>",response.data)
        if (response.data) {
          rows.value = response.data.data;
          selected.value = []; 
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
      
      showSpinner.value=false;

  };
    const loadUser = async () => {
      try {
        const userEmail = LocalStorage.getItem("userEmail");
        const requestParam = {
          params: {
            email: userEmail,
          },
        };
        const response = await axios.get(
          path.USER_SEARCH_BY_EMAIL,
          requestParam,
          headers
        ); 
        if (response.data) {  
          console.log("luser loading ",response.data.data)
          issuperuser.value = response.data.data.is_superuser
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    const fetchData = async () => {
      try {
        
      showSpinner.value=true;
        const userEmail = LocalStorage.getItem("userEmail");
        const requestParam = {
          params: {
            createdBy: userEmail,
          },
        };
        const response = await axios.get(
          path.ORGANISATION_SEARCH,
          requestParam,
          headers
        ); 
        console.log("response.data>>>>>>>",response.data)
        if (response.data) {
          rows.value = response.data.data;
          selected.value = []; 
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
      
      showSpinner.value=false;
    };
    const saveRecord = (record) => {
      showSpinner.value=true;
      if (action.value == "add") {
        createRecord(record);
      } else if (action.value == "edit") {
        updateRecord(record);
      }
      showSpinner.value=false;
    };
    const createRecord = (record) => {
      try {
        const promise = axios.post(path.ORGANISATION_CREATE, record, headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            if (result.success) {
              fetchData();
            }

            childRef.value = {
              message: result.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            showMessageDialog.value = true;
            // You can access properties of the response data as needed
          })
          .catch((error) => {
            childRef.value = {
              message: error.message,
              label: "Error",
              cardClass: "bg-negative text-white error",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            showMessageDialog.value = true;
          });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const updateRecord = (record) => {
      try {
        console.log("calling Update Record from Child Component", record);
        const promise = axios.put(path.ORGANISATION_UPDATE, record, headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log("result after savings >>>>>", result);
            if (result.success) {
              fetchData();
            }

            childRef.value = {
              message: result.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            showMessageDialog.value = true;
            // You can access properties of the response data as needed
          })
          .catch((error) => {
            childRef.value = {
              message: error.message,
              label: "Error",
              cardClass: "bg-negative text-white error",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            showMessageDialog.value = true;
          });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const showDialog = () => {
      if (selected.value.length > 0) { 
        medium_dialog.value = true;
        const organisationName = selected.value[0].name
        if(selected.value[0].status.code == "A"){
          deactivate.value = true
          activate.value = false
           dialog_header.value="Deactivate Organisation"
         dialog_message.value=" Are you Sure you want to Deactivate "+ organisationName
        }else{
           deactivate.value = false
          activate.value = true
          dialog_header.value="Activate Organisation"
         dialog_message.value=" Are you Sure you want to Activate "+ organisationName
        }
      } else {
        medium_dialog.value = false;
      }
    };
    const addItem = () => {
      showFormDialog.value = true;
      action.value = "add";
      actionLabel.value = "Submit";
    };
    const editItem = () => {
      if (selected.value.length > 0) {
        showFormDialog.value = true;
        searchValue.value = selected.value[0]["id"];
        action.value = "edit";
        actionLabel.value = "Update";
      }
    };
    const viewItem = () => {
      if (selected.value.length > 0) {
        showFormDialog.value = true;
        searchValue.value = selected.value[0]["id"];
        action.value = "view";
        actionLabel.value = "Done";
      }
    };
    const handleRowClick = (event, row) => {
      console.log("Row clicked:", row, "  >>>selected>>>>>", selected.value);
      if (row.status.code == "A") {
        actionBtn.value = "clear";
      } else {
        actionBtn.value = "done";
      }
      console.log(">>>>>>>>>selected.value.target>>>>>", selected.value.target);
      selected.value = row;
    };
    const getSelectedString = (row) => {
      // Example function to return label for selected row (if needed)
      return row ? row.name : "No client selected";
    };
    const activateUser = async () => {
      try {
        showSpinner.value=true;
        const data = {"id":selected.value[0].id};
        const response = await axios.post(path.ORGANISATION_ACTIVATE, data, headers);
        console.log(">>>response data>>",response.data)
        const result = response.data;
        if (result.success) {
          fetchData();
           childRef.value = {
              message: result.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            showMessageDialog.value = true;
            showSpinner.value=false;
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    const deactivateUser = async () => {
      try {
        showSpinner.value=true;
        const data = {"id":selected.value[0].id};
        const response = await axios.post(path.ORGANISATION_DEACTIVATE, data, headers);
        const result = response.data;
        if (result.success) {
          fetchData();
           childRef.value = {
              message: result.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            showMessageDialog.value = true;
            showSpinner.value=false;
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };


    return {
      loadUserClients,
      filterOrganisation,
      filterClients,
      fetchData, 
      loadUser,
      saveRecord,
      createRecord,
      updateRecord,
      handleRowClick,
      addItem,
      editItem,
      viewItem, 
      showDialog,
      activateUser,
      deactivateUser,
      formData,
      urlLink,
      actionLabel,
      searchValue,
      showMessageDialog,
      childRef,
      selected,
      columns,
      rows,
      userEmail,
      headers,
      medium_dialog,
      action,
      showFormDialog,
      actionBtn, 
      deactivate,
      activate,
      issuperuser, 
      dialog_header,
      dialog_message,
      pageName,
      hint, 
      showSpinner,
      userclients,
      allClients,
    };
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("beforeMount");
    console.log(">>>>>>>>>user Email >>>>>", this.userEmail);
  },
  mounted() {
    console.log("mounted");
    //
    this.loadUserClients();
    this.fetchData();
    this.loadUser();
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
