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
          <q-input
            filled
            bottom-slots
            v-model="formData.code"
            label="Code"
            :readonly="isReadonly"
            :dense="dense"
          />
          <div>
            <q-checkbox v-model="isChecked" label="Is an Affilate" />
          </div>
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
            v-model="formData.website"
            label="Web Site"
            :dense="dense"
          /> 
          <div class="row">
            <div class="cols-8">
                <q-file
                  bottom-slots
                  filled
                  v-model="formData.logo"
                  @update:model-value="onFileChange"
                  label="Client Logo"
                >
                  <template v-slot:append>
                    <q-icon name="attachment" />
                  </template>
                </q-file>
              </div>
              <div v-if="logoFile" class="cols-4 q-mt-md">
                <img :src="logoFile" alt="Preview" style="max-width: 100%;" />
            </div>
            </div>
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
import debug from "src/router/debugger";

export default {
  name: "StandingDataFormDialog",
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
    const logoFile = ref(null)
    const profile = LocalStorage.getItem("turnelParams");
    const formData = ref({
      code: "",
      name: "",
      website: "",
      isAnAffilate: false, 
      logo : "",
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
      isChecked: false,
      form,
      dialogWidth,
      dialogHeight,
      logoFile,
      dense:true,
      isReadonly:false,
      profile,
    };
  },
  methods: {
    saveRecord() {   
      this.formData.email = this.profile.email; 
      
      if (this.isChecked) {
        this.formData.isAnAffilate = true;
      } else {
        this.formData.isAnAffilate = false;
      }
      const requestData = new FormData();
      for (let key in this.formData) { 
        requestData.append(key, this.formData[key]);
      }  

      this.$emit("formDataSubmitted", requestData);
      this.showDialog = true;
    },
    loadUClientLogo(code){ 
       const requestParam = {
        params: {
          code: code, 
        },
      };  
      const promise =  axios.get(
          path.CLIENT_LOGO,
          requestParam,
          this.headers
        );  
         promise
          .then((response) => {
 
            this.logoFile = "data:image/jpeg;base64," + response.data.data.logo;
          })
          .catch((error) => {
            console.log(error);
          }); 
    },
    onFileChange(file) { 
      if (file) {
        const reader = new FileReader();
        console.log("reader>>>>>>>",reader)
       reader.onload  = function(e) {
          const logoByte = e.target.result;  
          this.logoFile = "data:image/jpeg;base64,"+logoByte 
        }; 
      } else {
        this.logoFile = null;
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
    console.log("before Mount");
  },
  mounted() {
    console.log("mounted");
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
    this.formData = {
      code: "",
      name: "",
      website: "",
      isAnAffilate: false,
      email: "",
    };
  },
  updated() {
    const headers = SessionStorage.getItem("headers");
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == "edit" || this.action == "view") {
      this.isReadonly = true
      try {
        const requestParams = {
          params: {
            code: this.searchValue,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, headers); 
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data; 
            if (result.success) {
              this.formData = result.data[0];
              this.formData.status = result.data[0].status.code
              this.isChecked = this.formData.isAnAffilate;
              this.loadUClientLogo(result.data[0].code)
              //this.logoFile = "data:image/jpeg;base64," + result.data[0].logo 
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      this.isReadonly = false
      this.logoFile = null
      this.formData = {
        code: "",
        name: "",
        website: "",
        isAnAffilate: false,
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
