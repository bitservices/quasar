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
            v-model="formData.whatsappNumber"
            label="Whatsapp Number"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.facebookHandle"
            label="Facebook Handle"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.instagramHandle"
            label="Instagram Handle"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.twitterHandle"
            label="Twitter Handle"
            :dense="dense"
          />

          <q-input
            filled
            bottom-slots
            v-model="formData.youtubeHandle"
            label="Youtube Handle"
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
  name: "UserContactInfoDialog",
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
    };
  },
  methods: {
    saveRecord() {
      this.formData.email = LocalStorage.getItem("userEmail");
      console.log(">>>>>>>thisis inside handle Save,", this.formData);
      //this.onClick(formData.value);
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
        console.log(">>>>>>>>>>promise>>>>>>>>", promise);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log(">>>>>>>>result>>>>>>>", result.data);
            if (result.success) {
              this.formData = result.data[0];
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
