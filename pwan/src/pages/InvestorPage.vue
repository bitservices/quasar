<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="MemberShip Type"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :selected-rows-label="getSelectedString" 
        v-model:selected="selected"
      >
        <template v-slot:top>
          <q-label>Investors</q-label>
          <q-space />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage, Loading } from "quasar";
import axios from "axios";
import { ref } from "vue"; 
import path from "src/router/urlpath";
import debug from "src/router/debugger";
export default {
   
  setup() {
    const headers = SessionStorage.getItem("headers");
    const userEmail = "";
    const columns = [
      {
        name: "investorName",
        required: false,
        label: "Investor Name",
        align: "left",
        field: (row) => row.investorName,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "phoneNumber",
        align: "center",
        label: "Phone Number",
        field: (row) => row.phoneNumber,
        sortable: true,
      },
      {
        name: "investorEmail",
        align: "center",
        label: "Email",
        field: (row) => row.investorEmail,
        sortable: true,
      },
    ];
    const parentData = ref({
      code: "",
      name: "",
    });  
    const rows = ref([]);
    const selected = ref([]);
     
    const fetchData = async () => {
      try {
        Loading.show();
        const userEmail = LocalStorage.getItem("userEmail");
        const requestParam = {
          params: {
            email: userEmail,
          },
        };
        const response = await axios.get(
          path.INVESTORS_FIND_BY_USER,
          requestParam,
          headers
        );
        if (response.data) {
          debug("response.data>>>>>>",response.data)
          rows.value = response.data;
          selected.value = [];
          Loading.hide();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    

    return {
      fetchData, 
      columns,
      rows,
      userEmail,
      headers, 
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
