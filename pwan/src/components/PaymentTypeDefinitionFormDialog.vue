<template>
  <q-dialog v-model="showDialog" persistent width="1229px" height="600px">
    <q-card
      class="card-flex-display"
      :style="{ width: form.width, height: form.height }"
    >
       <q-card-section class="pwan-blue text-white">
            <HeaderPage  
                :label="pageName"
                :hint="hint"  
              />
          </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="saveRecord" ref="PaymentTypeDefinitionForm">
          <div class="text-center"> 
                <q-spinner v-if="showSpinner" color="primary" size="60px" />
            </div>  
          <q-select
            filled
            bottom-slots
            v-model="formData.paymentType"
            :options="PaymentTypes"
            label="Select Payment Type"
            :dense="dense"
          />

          <q-input
            filled
            bottom-slots
            v-model="formData.name"
            label="Name"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.amount"
            label="Enter Amount"
            type="number"
            step="0.01"
          />
         
           
          <q-checkbox
            v-model="formData.allowPartialPayment"
            label="Allowed Parital Payment"
            color="primary"
          /> 
            
        <q-card-actions align="center">
          <q-btn
            rounded
            size="md" 
            id="closeBtn"
            label="Cancel"
             class="pwan-blue top-margin half-width"
            v-close-popup
          />
          <q-btn
            :label="actionLabel" 
            type="submit"
            size="md"
            rounded
             class="pwan-button top-margin half-width"
          />
        </q-card-actions> 
      
        </q-form>
      </q-card-section> 
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from "vue"; 
import { useI18n } from 'vue-i18n'
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import path from "src/router/urlpath";
import debug from "src/router/debugger"; 
import HeaderPage from "src/components/HeaderPage.vue"; 
export default {
  components: { 
    HeaderPage,
  },
  name: "PaymentTypeFormDialog",
  props: {
    onClick: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    searchValue: {
      type: String, // Specify the data type of the prop
      required: true, // Indicates whether the prop is required or not
    },
    action: {
      type: String,
      required: true,
    },
    actionLabel: {
      type: String,
      required: true,
    },
    urlLink: {
      type: String,
      required: true,
    },
  },
  data() {
    const { t } = useI18n() 
    const pageName = computed(()=> t('paymenttypedefform.pagename'))
    const hint = computed(()=> t('paymenttypedefform.hint'))
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + "px";
    const dialogHeight = controlHeight + "px"; 
    const profile = LocalStorage.getItem("turnelParams");
    const headers = SessionStorage.getItem("headers");
    const formData = ref({
      code: "",
      name: "",
      client: "",
      organisation: "",
      createdBy: "",
    });
    const form = ref({
      label: "",
      width: "10px",
      height: "10px",
    });
    const showDialog = ref(false);

    return {
      formData,
      showDialog,
      form,
      dialogWidth,
      dialogHeight,
      profile,
      headers,
      time: "10:00",
      dense: true, 
      pageName,
      hint,
    };
  },
  methods: {
   
    saveRecord() {  
      this.formData.client = this.profile.client;
      this.formData.organisation = this.profile.organisation;
      this.formData.createdBy = this.profile.email;
      this.formData.paymentType = this.formData.paymentType.value; 
      console.log(">>>>this.formData>>>>>>",this.formData)
      this.$emit("formDataSubmitted", this.formData); 
      document.getElementById('closeBtn').click();
      this.showDialog = true; 
    },  
   
  },
  
  beforeCreate() {
    debug("beforeCreate");
  },
  created() {
    debug("created");
  },
  beforeMount() {
    console.log("before Mount");
  },
  mounted() {
    const turnelParams = LocalStorage.getItem("turnelParams");
    const requestParams = {
      params: {
        client: turnelParams.client,
        organisation: turnelParams.organisation, 
      },
    }; 
     
    axios
      .get(path.PAYMENTTYPE_SEARCH, requestParams, this.headers)
      .then((response) => { 
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.PaymentTypes = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        })); 
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    
  },
  unmounted() {
    debug("Calling unmounted>>>>>>>>>>",this.action);
    this.formData = { code: "", name: "" };
  },
  updated() {
     debug("Calling updated>>>>>>>>>>",this.action);
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == "edit" || this.action == "view") {
      try {
        const requestParams = {
          params: {
            code: this.searchValue,
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, this.headers);
        promise
          .then((response) => {
            const result = response.data;
            if (result.success) {
              debug(result.data[0])
              this.formData = result.data[0]; 
              this.formData.paymentType={
                label: result.data[0].paymentType.name,
                value: result.data[0].paymentType.code,
              }
            }
          })
          .catch((error) => {
            debug(error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      this.formData = {
        code: "",
        name: "",
        client: "",
        organisation: "",
        createdBy: "",
      };
    }
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
