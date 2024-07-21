<template>
  <q-page padding>
    <div class="q-pa-md">Dash Board</div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref } from "vue";
import path from "src/router/urlpath";
import debug from "src/router/debugger";

export default {
  setup() {
    const headers = SessionStorage.getItem("headers");
    const userEmail = LocalStorage.getItem("userEmail");

    const fetchData = async () => {
      console.log(userEmail);
      const requestParam = {
        params: {
          email: userEmail,
        },
      };
      try {
        const response = await axios.get(path.DASHBOARD, requestParam, headers);
        if (response.data) {
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    return {
      fetchData,
      headers,
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
