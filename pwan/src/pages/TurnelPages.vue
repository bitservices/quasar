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
          @change="handleClientChange"
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
import { LocalStorage, SessionStorage, Loading } from "quasar";
import axios from "axios";
import { ref } from "vue";
import path from "src/router/urlpath";
export default {
  setup() {
    const headers = SessionStorage.getItem("headers");
    const userEmail = LocalStorage.getItem("userEmail");
    const clients = ref([]);
    const organisations = ref([]);
    const formData = ref({
      client: null,
      organisation: null,
    });
    const loadUserClients = async () => {
      try {
        console.log(">>>>>calling LoadUserClients>>>>>>>>>", userEmail);
        Loading.show();
        const requestParam = {
          params: {
            email: "lubemimoko@gmail.com",
          },
        };
        const response = await axios.get(
          path.ACTIVE_USER_CLIENT_SEARCH,
          requestParam,
          headers
        );
        const result = response.data;
        console.log(">>>>>result>>>>>>>>", result);
        console.log(">>>>>result data>>>>>>>>", result.data);
        if (result.success) {
          clients.value = result.data.map((option) => ({
            label: option.client.name,
            value: option.client.code,
          }));
          console.log("clients>>>>>>>>", clients);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    const handleClientChange = async (value) => {
      console.log(">>>>>>>>>handle Client Change>>>>>>>>", value);

      try {
        Loading.show();
        const selectedClient = value;

        const requestParam = {
          params: {
            email: userEmail,
            client: selectedClient.value,
          },
        };
        const response = await axios.get(
          path.ACTIVE_ORG_USER_SEARCH,
          requestParam,
          headers
        );
        if (response.data) {
          organisations.value = response.data.map((option) => ({
            label: option.organisation.name,
            value: option.organisation.code,
          }));
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    return {
      formData,
      clients,
      organisations,
      headers,
      userEmail,
      loadUserClients,
      handleClientChange,
    };
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
    this.loadUserClients();
  },
  beforeMount() {
    console.log("beforeMount");
  },
  mounted() {
    console.log(">>>>>>>>mounted>>>>>>>>>>");
  },
  updated() {
    console.log(">>>>>>>>updated>>>>>>>>>>");
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
