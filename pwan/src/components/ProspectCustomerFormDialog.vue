<template>
  <q-dialog v-model="showDialog" persistent width="1229px" height="600px">
    <q-card
      class="card-flex-display"
      :style="{ width: form.width, height: form.height }"
    >
      <q-card-section>
        <div class="text-h6">{{ form.label }}</div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-input type="hidden" v-model="formData.email" />

          <q-input
            filled
            bottom-slots
            v-model="formData.phoneNumber"
            label="Phone Number"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.prospectName"
            label="Prospect Name"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.prospectEmail"
            label="Prospect Email"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.subject"
            label="Subject"
            :dense="dense"
          />
           <q-input
            filled
            bottom-slots
            v-model="formData.message"
            label="Description"
            type="textarea"
            rows="2"
            maxlength="200"
            counter
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.prospectType"
            :options="prospectTypes"
            label="Select Prospect Type" 
            :dense="dense"  
          />
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="center">
          <q-btn
            rounded
            size="md"
            color="primary"
            label="Cancel"
            v-close-popup
          />
          <q-btn
            :label="actionLabel"
            color="secondary"
            @click="saveRecord"
            size="md"
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import { onUnmounted, ref } from "vue";
import axios from "axios"; 
import path from "src/router/urlpath";

export default {
  name: "ProspectCustomerFormDialog",
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
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + "px";
    const dialogHeight = controlHeight + "px";

    const formData = ref({
      id: "",
      prospectName: "",
      prospectEmail: "",
      phoneNumber: "",
      email: "",
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
      prospectTypes:[],
      dense:true,
    };
  },
  methods: {
    saveRecord() {
      this.formData.email = LocalStorage.getItem("userEmail"); 
      //this.onClick(formData.value);
      this.formData.prospectType = this.formData.prospectType.value
      this.$emit("formDataSubmitted", this.formData);
      this.showDialog = true;
      console.log(this.showDialog);
    },
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("before Mount");
  },
   mounted() {
    console.log(">>>>>>>>inside mout>>>>>>>");
    try{
        
      const prospectTypesPromise = axios.get(
        path.PROSPECT_TYPE_SEARCH_ALL,
        this.headers
      ); 
      prospectTypesPromise
        .then((response) => { 
          this.prospectTypes = response.data.map((option) => ({
            label: option.name,
            value: option.code,
          })); 
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  },
  unmounted() { 
    this.formData = {
      id: "",
      prospectName: "",
      prospectEmail: "",
      phoneNumber: "",
      email: "",
    };
  },
  updated() {
    const headers = SessionStorage.getItem("headers");
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == "edit" || this.action == "view") {
      try {
        const requestParams = {
          params: {
            id: this.searchValue,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, headers); 
        promise
          .then((response) => {  
            const result = response.data; 
            if (result.success) { 
              this.formData = result.data[0];  
              this.formData.prospectType = {
                value: result.data[0].prospectType.code,
                label : result.data[0].prospectType.name,
              } 
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      this.formData = {
        id: "",
        prospectName: "",
        prospectEmail: "",
        phoneNumber: "",
        email: "",
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
