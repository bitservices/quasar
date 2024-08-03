<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-form>
        <q-select
          filled
          bottom-slots
          v-model="formData.client"
          :options="clients"
          label="Select Client"
          @update:model-value="handleClientChange"
          :dense="dense"
        />
        <q-select
          filled
          bottom-slots
          v-model="formData.organisation"
          :options="organisations"
          label="Select Organisation" 
          :dense="dense"
        />
        <q-btn class="pwan-button" @click="handleTurnelling" rounded>
          Turnel
        </q-btn>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref } from "vue";
import path from "src/router/urlpath";
export default {
  data() {
    const headers = SessionStorage.getItem("headers");
    const userEmail = LocalStorage.getItem("userEmail");
    const formData = ref({
      client: "",
      organisation: "",
    });
    
    return {
      formData,
      clients: [],
      organisations: [],
      headers,
      userEmail,
    };
  },
  methods: {

     loadUserClients() {
      try {
        console.log(">>>>>calling LoadUserClients>>>>>>>>>", userEmail); 
        const requestParam = {
          params: {
            email: userEmail,
          },
        };
        const response = axios.get(
          path.ACTIVE_USER_CLIENT_SEARCH,
          requestParam,
          headers
        );
        console.log(response.data);
        if (response.data) {
          clients = response.data.map((option) => ({
            label: option.client.name,
            value: option.client.code,
          }));
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    handleClientChange(selectedItem) {
      console.log(">>>>selectedItem>>>>>",selectedItem)
      try {
        const requestParam = {
          params: {
            email: userEmail,
            client: selectedItem.value,
          },
        };
        const response = axios.get(
          path.ACTIVE_ORG_USER_SEARCH,
          requestParam,
          headers
        );

        if (response.data) {
          console.log(">>>>response.data>>>>>",response.data)
          organisations = response.data.map((option) => ({
            label: option.organisation.name,
            value: option.organisation.code,
          }));
        }
      } catch (error) {
        console.error("Error submitting form:", error);
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
  },
  mounted() {
    console.log(">>>>>>>>mounted>>>>>>>>>>");
    this.loadUserClients();
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
