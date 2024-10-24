<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="User Leads"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :selected-rows-label="getSelectedString"
        selection="single"
        v-model:selected="selected"
      /> 
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref } from "vue"; 
import path from "src/router/urlpath";
export default { 
  setup() {
    const headers = SessionStorage.getItem("headers");
    const userEmail = "";
    const columns = [
       
      {
        name: "name",
        align: "left",
        label: "Prospect Name",
        field: (row) => row.name,
        sortable: true,
      },
      {
        name: "email",
        align: "left",
        label: "Prospect Email",
        field: (row) => row.email,
        sortable: true,
      },
      {
        name: "phoneNumber",
        align: "left",
        label: "Prospect Mobile",
        field: (row) => row.phoneNumber,
        sortable: true,
      },

      {
        name: "subject",
        align: "left",
        label: "Subject",
        field: (row) => row.subject,
        sortable: true,
      },
       {
        name: "message",
        align: "left",
        label: "Message",
        field: (row) => row.message,
        sortable: true,
      },
       
    ];
     
    const rows = ref([]);
    const selected = ref([]);
    
    const fetchData = async () => {
      try { 
        const userEmail = LocalStorage.getItem("userEmail");
        const requestParam = {
          params: {
            agencyEmail: userEmail,
          },
        }; 
        const response = await axios.get(
          path.LEADS_SEARCH,
          requestParam,
          headers
        );
        if (response.data) {
           
          rows.value = response.data.data;
          selected.value = []; 
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
 

    return {
      fetchData, 
      selected,
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
