<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Payment Type"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :selected-rows-label="getSelectedString"
        selection="multiple"
        v-model:selected="selected"
      >
        <template v-slot:top>
          <q-label>Product</q-label>
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
          <PaymentTypeFormDialog
            v-model="showFormDialog"
            :onClick="saveRecord"
            @formDataSubmitted="saveRecord"
            label="Payment Type"
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
import PaymentTypeFormDialog from "src/components/PaymentTypeFormDialog.vue";
import ResponseDialog from "src/components/ResponseDialog.vue";
import path from "src/router/urlpath";


export default {
  components: {
    PaymentTypeFormDialog,
    ResponseDialog,
  },
  setup() {
    const headers = SessionStorage.getItem("headers");
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
    ];
    const parentData = ref({
      code: "",
      name: "",
    });
    const urlLink = ref( 
          path.PAYMENTTYPE_SEARCH,
    );
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const action = ref("");
    const searchValue = ref("");
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

    const turnelParams = LocalStorage.getItem("turnelParams");
     const requestParams = {
          params: {
            client: turnelParams.client,
            organisation:turnelParams.organisation, 
          },
        };
        
    const fetchData = async () => {
      try { 
       const response = await axios.get(path.PAYMENTTYPE_SEARCH,requestParams,
          headers
        );
        if (response.data) {
          console.log("response>>>>>>",response.data.data)
          rows.value = response.data.data;
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
        const promise = axios.post(
          path.PAYMENTTYPE_CREATE,
          record,
          headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(">>>>>>>>>result>>>>>>",result)
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
        const promise = axios.put(
          path.PAYMENTTYPE_UPDATE,
          record,
          headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(result);
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
        console.log("searchValue >>>>>",searchValue.value)

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
    const deleteItem = async () => {
      try {
        const data = selected.value;
        const promise =  axios.post(          
          path.PAYMENTTYPE_REMOVE,
          data,
          headers
        );
         promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(result);
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
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    return {
      fetchData,
      saveRecord,
      createRecord,
      updateRecord,
      addItem,
      editItem,
      viewItem,
      deleteItem,
      showDialog,
      urlLink,
      actionLabel,
      searchValue,
      showMessageDialog,
      childRef,
      selected,
      columns,
      rows,
      headers,
      medium_dialog,
      action,
      showFormDialog,
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
