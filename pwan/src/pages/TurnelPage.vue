<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card>
          <q-card-section class="pwan-blue text-white">
            <HeaderPage  
                :label="pageName"
                :hint="hint"  
              />
          </q-card-section>
        </q-card>
        <div class="text-center"> 
                <q-spinner v-if="showSpinner" color="primary" size="60px" />
        </div>
      <q-card> 
      <q-card-section> 
        <q-form @submit.prevent="handleTurnelling" ref="turnelingForm">
          <q-select
            filled
            bottom-slots
            v-model="formData.client"
            @update:model-value="handleClientChange"
            :options="clients"
            label="Select Client"
            :rules="[requiredRule]" 
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.organisation"
            :options="organisations"
            label="Select Organisation"
            :rules="[requiredRule]" 
          />
        <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
            <q-card-actions align="center"> 
            <q-btn
            class="pwan-button"
              label="Turnel" 
              type="submit"
              size="md"
              rounded  
            />
          </q-card-actions>
        </q-form>
        </q-card-section>
          
    </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue"; 
import { useI18n } from 'vue-i18n'
import HeaderPage from "src/components/HeaderPage.vue"; 
import ResponseDialog from "src/components/ResponseDialog.vue";  
import { isRequired } from 'src/validation/validation';
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios"; 
import path from "src/router/urlpath";
import { useRouter } from "vue-router";
const router = useRouter();
export default {
  components: { 
    HeaderPage,
    ResponseDialog,
  },
  data() {
    
    const { t } = useI18n() 
    const pageName = computed(()=> t('turnel.pagename'))
    const hint = computed(()=> t('turnel.hint'))
    const showSpinner = ref(false); 
    const headers = SessionStorage.getItem("headers");
    const userEmail = LocalStorage.getItem("userEmail");
    const clients = ref([]);
    const organisations = ref([]);
    const menus = ref([]);
    const formData = ref({
      client: null,
      organisation: null,
    });
     const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });
    return {
      formData,
      clients,
      organisations,
      menus,
      headers,
      userEmail,
      pageName,
      hint,
      showSpinner, 
      childRef,  
      showMessageDialog:false,  
      requiredRule: value => isRequired(value),
    };
  },
  methods: {
    loadUserClients() {
      try {
        console.log(">>>>>calling LoadUserClients>>>>>>>>>", this.userEmail);
        const requestParam = {
          params: {
            email: this.userEmail,
          },
        };
        axios
          .get(path.ACTIVE_USER_CLIENT_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log("client Response >>>>>>>>>>>>", response.data.data);
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.clients = response.data.data.map((option) => ({
              label: option.client.name,
              value: option.client.code,
            }));
            console.log("this.clients >>>>>>>>>>>>", this.clients);
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    handleClientChange(selectedItem) {
      try {
        console.log(">>>>>calling handleClientChange>>>>>>>>>", selectedItem);
        const requestParam = {
          params: {
            client: selectedItem.value,
            email: this.userEmail,
          },
        };
        axios
          .get(path.ACTIVE_ORG_USER_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log(
              "organisations Response >>>>>>>>>>>>",
              response.data.data
            );
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.organisations = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            }));
            console.log("this.organisation >>>>>>>>>>>>", this.organisations);
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    handleTurnelling() {
       if (this.$refs.turnelingForm.validate()) {
        const turnelParams = {
          email: this.userEmail,
          client: this.formData.client.value,
          organisation: this.formData.organisation.value,
          orgName : this.formData.organisation.label,
        };
        LocalStorage.set("turnelParams", turnelParams);
        try {
          const requestParam = {
            params: turnelParams,
          };
          axios
            .get(path.USER_PROFILES, requestParam, this.headers)
            .then((response) => {
              this.menus = response.data.data;
              let updatedMenu = [];
              Object.keys(this.menus).forEach((key) => {
                let menuSection = { title: key };
                let sectionItems = this.menus[key];
                let menuitems = [];
                sectionItems.forEach(function (menu, index) {
                  let menuitem = {
                    title: menu.name,
                    caption: menu.code,
                    icon: menu.icon,
                    link: menu.url,
                  };
                  menuitems.push(menuitem);
                });
                menuSection["menuitems"] = menuitems;
                updatedMenu.push(menuSection);
              });
              console.log("Inside turnelling >>>>>>>>>>>>>>",updatedMenu)
              this.$emit("update-menu", updatedMenu);
            })
            .catch((error) => {
              console.error("Error fetching options:", error);
            });
        } catch (error) {
          console.error("Error submitting form:", error);
        }
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
    this.loadUserClients();
    console.log(">>>>>>>>mounted>>>>>>>>>>");
  },
  beforeUpdate() {
    console.log(">>>>>>>>before updated>>>>>>>>>>");
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
