<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Client"
        :rows="rows"
        :columns="columns"
        row-key="name"
        selection="single"
        @row-click="handleRowClick"
        v-model:selected="selected"
      >
        <template v-slot:top>
          <q-label>Client</q-label>
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
          <ClientFormDialog
            v-model="showFormDialog"
            :onClick="saveRecord"
            @formDataSubmitted="saveRecord"
            label="Client"
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
                  />
                   <q-btn v-if="deactivate"
                    @click="deactivateUser"
                    flat
                    label="De-Activate"
                    v-close-popup
                    class="bg-negative text-white"
                    rounded 
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
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref } from "vue";
import ClientFormDialog from "src/components/ClientFormDialog.vue";
import ResponseDialog from "src/components/ResponseDialog.vue";
import path from "src/router/urlpath";
export default {
  components: {
    ClientFormDialog,
    ResponseDialog,
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
        align: "center",
        label: "Name",
        field: (row) => row.name,
        sortable: true,
      },
      {
        name: "isAnAffilate",
        align: "center",
        label: "Is An Affilate",
        field: (row) => row.isAnAffilate,
        sortable: true,
      },
      {
        name: "website",
        align: "center",
        label: "Web Site",
        field: (row) => row.website,
        sortable: true,
      },
    ];
    const parentData = ref({
      code: "",
      name: "",
    });
    const urlLink = ref(path.CLIENT_SEARCH);
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const action = ref("");
    const searchValue = ref("");
    const actionBtn = ref("done");
    const rows = ref([]);
    const selected = ref([]);
    const actionLabel = ref("Submit");
    const medium_dialog = ref(false);  
    const issuperuser = ref(false);  
    const deactivate = ref(true);
    const activate = ref(false); 
     const dialog_header = ref(null);
     const dialog_message= ref(null);

    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });

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
          issuperuser.value = response.data.data.is_superuser
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    
    const fetchData = async () => {
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
          rows.value = response.data;
          selected.value = []; 
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    const saveRecord = (record) => {
      if (action.value == "add") {
        createRecord(record);
      } else if (action.value == "edit") {
        updateRecord(record);
      }
    };
    const createRecord = (record) => {
      try {
        const promise = axios.post(path.CLIENT_CREATE, record, headers);
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
        const promise = axios.put(path.CLIENT_UPDATE, record, headers);
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
    const showDialog = () => {
      if (selected.value.length > 0) {
        medium_dialog.value = true;
        const clienName = selected.value[0].name
        if(selected.value[0].status.code == "A"){
          deactivate.value = true
          activate.value = false
           dialog_header.value="Deactivate Client"
         dialog_message.value=" Are you Sure you want to Deactivate "+ clienName
        }else{
           deactivate.value = false
          activate.value = true
          dialog_header.value="Activate Client"
         dialog_message.value=" Are you Sure you want to Activate "+ clienName
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
        searchValue.value = selected.value[0]["code"];
        action.value = "edit";
        actionLabel.value = "Update";
      }
    };
    const viewItem = () => {
      if (selected.value.length > 0) {
        showFormDialog.value = true;
        searchValue.value = selected.value[0]["code"];
        action.value = "view";
        actionLabel.value = "Done";
      }
    };
    const handleRowClick = (event, row) => { 
      if (row.status.code == "A") {
        actionBtn.value = "clear";
      } else {
        actionBtn.value = "done";
      } 
      selected.value = row;
    };
    const getSelectedString = (row) => {
      // Example function to return label for selected row (if needed)
      return row ? row.name : "No client selected";
    };
   const activateUser = async () => {
      try {
        const data = {"code":selected.value[0].code};
        const response = await axios.post(path.CLIENT_ACTIVATE, data, headers);
        const result = response.data
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
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    const deactivateUser = async () => {
      try {
        const data = {"code":selected.value[0].code}; 
        const response = await axios.post(path.CLIENT_DEACTIVATE, data, headers);
        const result = response.data
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
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };


    return {
      fetchData,
      saveRecord,
      createRecord,
      updateRecord,
      handleRowClick,
      addItem,
      editItem,
      viewItem, 
      showDialog, 
      activate,
      deactivate,
      loadUser,
      activateUser,
      deactivateUser,
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
      issuperuser,  
      dialog_header,
      dialog_message, 
    };
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() { 
  },
  mounted() {
    console.log("mounted");
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
