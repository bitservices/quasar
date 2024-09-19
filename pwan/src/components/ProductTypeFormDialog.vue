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
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.name"
            label="Name"
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

export default {
  name: "ProductTypeFormDialog",
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

   const profile = LocalStorage.getItem("turnelParams"); 
    const formData = ref({
      code: "",
      name: "", 
      client : "",
      organisation : "" ,
      createdBy : "",
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
    };
  },
  methods: {
    saveRecord() {
      
      //this.onClick(formData.value);
      this.formData.client = this.profile.client;
      this.formData.organisation =  this.profile.organisation;
      this.formData.createdBy = this.profile.email;
      console.log(">>>>>>>thisis inside handle Save,", this.formData);
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
    console.log("mounted");
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
    this.formData = { code: "", name: "" };
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
            code: this.searchValue,
             client : this.profile.client,
             organisation : this.profile.organisation, 
          },
        };
        const promise = axios.get(this.urlLink, requestParams, headers); 
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data; 
            if (result.success) {
              this.formData = result.data[0];
              console.log("formData>>>>>>>",this.formData)
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      this.formData = { code: "", name: "" , 
      client : "",
      organisation : "" ,
      createdBy : "",};
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
