<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Sales Trancaction"
        :rows="rows"
        :columns="columns"
        row-key="id"
        selection="single"
        v-model:selected="selected"
      >
        <template v-slot:top>
          <q-label>Subscription</q-label>
          <q-space />
          <q-btn rounded color="green" icon="add" size="sm" @click="addItem" />
          <q-btn
            rounded
            color="blue"
            label="Add Payment"
            size="sm"
            @click="editItem"
          />
          <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
        </template>
      </q-table>
      <Done />
    </div>
  </q-page>
</template>

<script>
import { SessionStorage, LocalStorage } from "quasar";
import axios from "axios";
import { ref } from "vue";
import ResponseDialog from "src/components/ResponseDialog.vue";
import Done from "src/components/Done.vue";
import path from "src/router/urlpath";
import debug from "src/router/debugger";
import { format } from "date-fns";

export default {
  components: {
    ResponseDialog,
    Done,
  },
  setup() {
    let headers = SessionStorage.getItem("headers");
    console.log(">>>>headers 1111>>>>", headers);
    const columns = [
      {
        name: "subscriber",
        required: false,
        label: "Subscriber Name",
        align: "left",
        field: (row) =>
          row.subscriber.lastName +
          " " +
          row.subscriber.firstName +
          " " +
          row.subscriber.middleName,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "product",
        align: "center",
        label: "Product",
        field: (row) => row.subscribedProduct.name,
        sortable: true,
      },
      {
        name: "amount",
        align: "center",
        label: "Product Amount",
        field: (row) =>
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(row.subscribedProduct.amount),
        sortable: true,
      },
      {
        name: "quantity",
        align: "center",
        label: "Quantity",
        field: (row) => row.quantity,
        sortable: true,
      },
      {
        name: "amount",
        align: "center",
        label: "Amount",
        field: (row) =>
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(row.totalAmount),
        sortable: true,
      },

      {
        name: "Affillate",
        align: "center",
        label: "Affilate/Company",
        field: (row) => row.client.name,
        sortable: true,
      },
      {
        name: "paymentStatus",
        align: "center",
        label: "Status",
        field: (row) => row.paymentStatus.name,
        sortable: true,
      },
      {
        name: "subscriptionDate",
        align: "center",
        label: "Subscription DAte",
        field: (row) => format(row.subscriptionDate, "yyyy-MM-dd"),
        sortable: true,
      },
    ];

    const urlLink = ref(path.SUBSCRIPTION_SEARCH);
    const showFormDialog = ref(false);
    const showMessageDialog = ref(false);
    const action = ref("");
    const searchValue = ref("");
    const rows = ref([]);
    const selected = ref([]);
    const actionLabel = ref("Submit");
    const medium_dialog = ref(false);
    const userEmail = LocalStorage.getItem("userEmail");
    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });

    const fetchData = async () => {
      try {
        const requestParams = {
          params: {
            realtor: userEmail,
            order_by: "-subscriptionDate",
          },
        };
        console.log("requestParams>>>>>>>>>>>>", requestParams);
        const response = await axios.get(
          path.SUBSCRIPTION_SEARCH,
          requestParams,
          headers
        );
        if (response.data) {
          console.log("response>>>>>>", response.data.data);
          rows.value = response.data.data;
          selected.value = [];
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    const saveRecord = (record) => {
      console.log(">>>>action.value>>>>>", action.value);
      if (action.value == "add") {
        createRecord(record);
      } else if (action.value == "edit") {
        updateRecord(record);
      }
    };
    const createRecord = (record) => {
      try {
        headers["Content-Type"] = "multipart/form-data";
        debug(">>>>>>>>>>>header>>>>>>>>>", headers);
        const requestData = new FormData();
        for (let key in record) {
          requestData.append(key, record[key]);
        }

        console.log(">>>>>submitted requestData >>>>>>>>>>", requestData);
        const promise = axios.post(
          path.SUBSCRIPTION_CREATE,
          requestData,
          headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(">>>>>>>>>result>>>>>>", result);
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
        console.log(">>>>headers>>>>>", headers);
        headers["headers"]["Content-Type"] = "multipart/form-data";
        console.log(">>>>>submitted record>>>>>>>>>>", record);
        const requestData = new FormData();
        for (let key in record) {
          requestData.append(key, record[key]);
        }

        console.log(
          ">>>>>submitted requestData >>>>>>>>>>",
          requestData,
          ">>>>headers>>>>>>>",
          headers
        );

        const promise = axios.post(
          path.SUBSCRIPTION_ADDPAYMENT,
          requestData,
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
      actionLabel.value = "Submit Subscription";
    };
    const editItem = () => {
      if (selected.value.length > 0) {
        showFormDialog.value = true;
        console.log(">>>>selected>>>>>>", selected[0]);
        searchValue.value = selected.value[0]["id"];
        console.log("searchValue >>>>>", searchValue.value);

        action.value = "edit";
        actionLabel.value = "Add Payment";
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
        const response = await axios.post(
          path.SALESTRANS_REMOVE,
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
      userEmail,
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
