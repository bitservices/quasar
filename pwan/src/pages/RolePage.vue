<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Menu Items"
        :rows="rows"
        :columns="columns"
        row-key="code"
        selection="single"
        @row-click="handleRowClick"
        v-model:selected="selected"
      >
        <template v-slot:body-cell-checkbox="props">
          <q-checkbox v-model="props.selected" />
        </template>
        <template v-slot:top>
          <q-label>Role</q-label>
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
          <StandingDataFormDialog
            v-model="showFormDialog"
            :onClick="saveRecord"
            @formDataSubmitted="saveRecord"
            label="Role"
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
          <q-btn
            rounded
            color="red"
            icon="delete"
            size="sm"
            @click="showDialog"
          >
            <q-dialog v-model="medium_dialog">
              <q-card style="width: 700px" class="bg-info text-white">
                <q-card-section>
                  <div class="text-h6">Delete Item(s)</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  Are you sure you want to delete selected item(s)
                </q-card-section>
                <q-card-actions align="center" class="bg-white text-teal">
                  <q-btn
                    @click="deleteItem"
                    flat
                    label="Yes"
                    v-close-popup
                    class="bg-negative text-white"
                    rounded
                  />
                  <q-btn
                    flat
                    label="No"
                    class="bg-secondary text-white"
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
import StandingDataFormDialog from "src/components/StandingDataFormDialog.vue";
import ResponseDialog from "src/components/ResponseDialog.vue";
import path from "src/router/urlpath";
export default {
  components: {
    StandingDataFormDialog,
    ResponseDialog,
  },
  data() {
    const profile = LocalStorage.getItem("turnelParams");
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
        name: "organisation",
        align: "left",
        label: "Organisation",
        field: (row) => row.organisation.name,
        sortable: true,
      },
    ];
    const parentData = ref({
      code: "",
      name: "",
    });
    const urlLink = ref(path.ROLE_SEARCH);
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const action = ref("");
    const searchValue = ref("");
    const actionBtn = ref("done");
    const rows = ref([]);
    const selected = ref([]);
    const actionLabel = ref("Submit");
    const medium_dialog = ref(false);
    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });

    return {
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
      profile,
    };
  },
  methods: {
    handleRowClick(event, row) {
      // Handle row click event
      console.log("Row clicked:", row);

      // Access checkbox status from row data
      console.log("Checkbox status:", this.row.selected);

      // You can perform actions based on the checkbox status and row data
      if (row.selected) {
        console.log("Checkbox is checked");
        // Perform actions when checkbox is checked
      } else {
        console.log("Checkbox is unchecked");
        // Perform actions when checkbox is unchecked
      }
    },
    fetchData() {
      const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        }; 
      try {
        const promise = axios.get(path.ROLE_SEARCH, requestParams, this.headers);
        console.log("promise in the Fetch Data>>>>>>>>>>", promise);
        promise
          .then((response) => { 
            console.log(response.data.data)
            this.rows = response.data.data;
            this.selected = [];
            // You can access properties of the response data as needed
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
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    saveRecord(record) {
      console.log("action clicked>>>>>>>>>", this.action);
      if (this.action == "add") {
        record["createdBy"] = this.profile.email
        record["client"] = this.profile.client
        record["organisation"] = this.profile.organisation
        this.createRecord(record);
      } else if (this.action == "edit") {
        this.updateRecord(record);
      }
    },
    createRecord(record) {
      try {
        const promise = axios.post(path.ROLE_CREATE, record, this.headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            if (result.success) {
              this.fetchData();
            }

            this.childRef = {
              message: result.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            this.showMessageDialog = true;
            // You can access properties of the response data as needed
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
          });
      } catch (error) {
        console.error("Error:", error);
      }
    },
    updateRecord(record) {
      try {
        console.log("calling Update Record from Child Component", record);
        const promise = axios.put(path.ROLE_UPDATE, record, this.headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log("result after savings >>>>>", result);
            if (result.success) {
              this.fetchData();
            }

            this.childRef = {
              message: result.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            this.showMessageDialog = true;
            // You can access properties of the response data as needed
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
          });
      } catch (error) {
        console.error("Error:", error);
      }
    },
    showDialog() {
      if (this.selected.length > 0) {
        this.medium_dialog = true;
      } else {
        this.medium_dialog = false;
      }
    },
    addItem() {
      this.showFormDialog = true;
      this.action = "add";
      this.actionLabel = "Submit";
    },
    editItem() {
      if (this.selected.length > 0) {
        this.showFormDialog = true;
        this.searchValue = this.selected[0]["code"];
        this.action = "edit";
        this.actionLabel = "Update";
      }
    },
    viewItem() {
      if (this.selected.length > 0) {
        this.showFormDialog = true;
        this.searchValue = this.selected[0]["code"];
        this.action = "view";
        this.actionLabel = "Done";
      }
    },  
    deleteItem(){
       try {
        const data = this.selected;
        const promise =  axios.post(          
          path.ROLE_REMOVE,
          data,
          this.headers
        );
         promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(result);
            if (result.success) {
              this.fetchData();
            }

            this.childRef = {
              message: result.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            this.showMessageDialog = true;
            // You can access properties of the response data as needed
          })
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
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
    console.log("mounted");
    this.fetchData();
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
