<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Status"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :selected-rows-label="getSelectedString"
        selection="multiple"
        v-model:selected="selected"
      >
        <template v-slot:top>
          <q-label>Status</q-label>
          <q-space />
          <q-btn rounded color="green" icon="add" size="sm" @click="addItem" />
          <q-btn rounded color="blue" icon="edit" size="sm" @click="editItem" />
          <StandingDataFormDialog
            v-model="showFormDialog"
            :onClick="saveRecord"
            @formDataSubmitted="saveRecord"
            label="Status"
          />
          <ResponseDialog
            v-model="showMessageDialog"
            v-bind:class="childRef.class"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
          />
          <q-btn
            rounded
            color="red"
            icon="delete"
            size="sm"
            @click="showDialog"
          >
            <q-dialog v-model="medium_dialog">
              <q-card style="width: 700px; max-width: 80vw" class="danger">
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
                    color="red"
                  />
                  <q-btn flat label="No" v-close-popup />
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
import { SessionStorage } from "quasar";
import axios from "axios";
import { ref } from "vue";
import StandingDataFormDialog from "src/components/StandingDataFormDialog.vue";
import ResponseDialog from "src/components/ResponseDialog.vue";

export default {
  components: {
    StandingDataFormDialog,
    ResponseDialog,
  },
  setup() {
    const headers = SessionStorage.getItem("headers");
    const columns = [
      {
        name: "Code",
        required: false,
        label: "Code",
        align: "left",
        field: (row) => row.code,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "aame",
        align: "center",
        label: "Name",
        field: (row) => row.name,
        sortable: true,
      },
    ];
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const action = ref("");
    const rows = ref([]);
    const selected = ref([]);
    const medium_dialog = ref(false);
    const childRef = ref({
      label: "Success",
      message: "Error Occured",
      textClass: "",
      class: "",
    });

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/pwanproperties/status/",
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
      try {
        console.log("calling saveRecord from Child Component", record);
        const promise = axios.post(
          "http://localhost:8000/api/pwanproperties/status/save/",
          record,
          headers
        );
        console.log(">>>>>>>get Response inside parent >>>>>>>", promise);
        promise
          .then((response) => {
            // Extract data from the response
            console.log(">>>>>>response>>>", response);
            const responseData = response.data;
            console.log("Response data:", responseData);
            if (response.success) {
              fetchData();
            }

            form.value = {
              message: response.message,
              label: "Success",
            };
            console.log(">>>>>>form>>>>>>", form);
            showMessageDialog.value = true;
            // You can access properties of the response data as needed
          })
          .catch((error) => {
            // Handle errors if the request fails
            console.error(">>>>>>Error:", error);
            console.error("Error submitting form:", error);
            form.value = {
              message: error.message,
              label: "Error",
            };
            console.log(">>>>>>form>>>>>>", form);
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
    };
    const editItem = () => {
      if (selected.value.length > 0) {
        showFormDialog.value = true;
      }
      action.value = "edit";
      console.log("edit Item clicked", showFormDialog);
    };
    const deleteItem = async () => {
      try {
        const data = selected.value;
        const response = await axios.post(
          "http://localhost:8000/api/pwanproperties/status/remove/",
          data,
          headers
        );
        if (response.data.success) {
          fetchData();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    return {
      fetchData,
      saveRecord,
      addItem,
      editItem,
      deleteItem,
      showDialog,
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
