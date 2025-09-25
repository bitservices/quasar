<template>
  <q-page padding>
    <q-card class="card-flex-display">
      <q-card-section>
        <div class="text-h6">{{ form.label }}</div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.code"
            label="Code"
            :readonly="isReadonly"
            :dense="dense"
            :rules="[inputFieldRule]"
          />
          <div>
            <q-checkbox
              v-model="useStore.formData.isAnAffilate"
              label="Is an Affilate"
            />
          </div>
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.name"
            label="Name"
            :dense="dense"
            :rules="[inputFieldRule]"
          />
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.website"
            label="Web Site"
            :dense="dense"
          />
          <div class="row">
            <div class="cols-8">
              <q-file
                bottom-slots
                filled
                v-model="useStore.formData.logo"
                label="Client Logo"
                clearable
                accept=".jpg,.jpeg,.png,.pdf"
                @update:model-value="validateFile"
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <!-- Error message -->
            <div v-if="error" class="text-negative text-caption q-mt-sm">
              {{ error }}
            </div>

            <!-- Preview for images -->
            <div class="q-mt-md">
              <q-img
                v-if="previewUrl"
                :src="previewUrl"
                spinner-color="primary"
                style="width: 200px; height: 150px"
              />
            </div>

            <!-- File details -->
            <div v-if="file && !error" class="q-mt-md text-body2">
              <p><b>Name:</b> {{ file.name }}</p>
              <p><b>Size:</b> {{ (file.size / 1024).toFixed(2) }} KB</p>
              <p><b>Type:</b> {{ file.type }}</p>
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
            @click="cancel"
          />
          <q-btn
            v-if="showButton"
            :label="actionLabel"
            :color="colourLabel"
            @click="executeRecord"
            size="md"
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import { ref } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import { useClientStore } from "src/stores/clientStore";
import { useRouter } from "vue-router";
import helper from "src/utils/helper";
import { useQuasar } from "quasar";

export default {
  name: "StateFormDialog",
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
    const headers = SessionStorage.getItem("headers");
    const useStore = useClientStore();
    const router = useRouter();
    const $q = useQuasar();
    const file = ref(null);
    const previewUrl = ref(null);
    const error = ref(null);

    const formData = ref({
      code: "",
      name: "",
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
      countries: [],
      allCountries: [],
      dense: true,
      headers,
      useStore,
      router,
      helper,
      showButton: true,
      actionLabel: "Create",
      colourLabel: "secondary",
      isReadonly: false,
      $q,
      file,
      previewUrl,
      error,
    };
  },
  methods: {
    filterCountries(val, update) {
      console.log(">>>>val>>>>>>", val);
      if (val === "") {
        update(() => {
          this.countries = this.allCountries;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.countries = this.allCountries.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    },

    executeRecord() {
      console.log(">>>>>>>thisis inside handle Save,", this.useStore.formData);
      this.useStore.formData.status = this.useStore.formData?.status
        ? "A"
        : this.useStore.formData.status.code;
      this.useStore.formData.email = LocalStorage.getItem("userEmail");
      let data = this.useStore.formData;
      console.log("record>>>>>>>>", data);
      const record = new FormData();
      for (let key in data) {
        record.append(key, data[key]);
      }

      let promise = "";
      if (this.useStore.mode == "create") {
        promise = axios.post(path.CLIENT_CREATE, record, this.headers);
      }
      if (this.useStore.mode == "update") {
        promise = axios.put(path.CLIENT_UPDATE, record, this.headers);
      } else if (this.useStore.mode == "activate") {
        if (this.useStore.formData.status == "A") {
          promise = axios.post(path.CLIENT_DEACTIVATE, record, this.headers);
        } else {
          promise = axios.post(path.CLIENT_ACTIVATE, record, this.headers);
        }
      }
      console.log(">>>>>>promise>>>>>", promise);

      promise
        .then((response) => {
          const result = response.data;
          console.log(">>>>>>result>>>>>>>>", result);
          if (result.success) {
            this.useStore.reload = true;
            this.$q.notify({
              type: "positive",
              message: result.message,
              position: "center",
            });
          } else {
            this.$q.notify({
              type: "negative",
              message: result.message,
              position: "center",
            });
          }

          this.router.push("/client");
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
          this.$q.notify({
            type: "negative",
            message: error.message,
            position: "center",
          });
        });
      //this.onClick(formData.value);
      // this.formData.countryCode = this.useStore.formData.countryCode.value;
      // this.formData.stateCode = this.useStore.formData.stateCode.value;
      // this.$emit("formDataSubmitted", this.formData);
      // this.showDialog = true;
      // console.log(this.showDialog);
    },

    cancel() {
      this.useStore.reload = false;
      this.router.push("/client");
    },
    updateData() {
      this.isReadonly = false;
      if (this.useStore.mode == "view") {
        this.showButton = false;
      } else {
        this.showButton = true;
      }
      this.actionLabel = this.useStore.mode;
      if (this.useStore.mode == "activate") {
        if (this.useStore.formData.status.code == "A") {
          this.colourLabel = "red";
          this.actionLabel = "De-Activate";
        } else {
          this.colourLabel = "secondary";
        }
      } else {
        this.colourLabel = "secondary";
      }
      if (this.useStore.mode != "create") {
        this.isReadonly = true;
      }
      if (this.useStore.formData.logo) {
        this.previewUrl =
          "data:image/jpeg;base64," + this.useStore.formData.logo;
      } else {
        this.previewUrl = null;
      }
    },
    validateFile(files) {
      console.log(">>>>>>>inside validte File>>>>>>>>>>", files);
      this.error = null;
      this.previewUrl = null;

      const f = files[0] || files;
      console.log(">>>>>>>f>>>>>>>>>>", f);
      if (!f) return;

      // 1. Check size (e.g. max 2MB)
      const maxSize = 2 * 1024 * 1024;
      console.log(">>>>>f size >>>>>>>>", f.size);
      if (f.size > maxSize) {
        this.error = "File size must be less than 2MB";
        this.file = null;
        return;
      }

      // 2. Check type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(f.type)) {
        this.error = "Only JPG, PNG, and PDF files are allowed";
        this.file = null;
        return;
      }

      // 3. Generate preview if it's an image
      if (f.type.startsWith("image/")) {
        this.previewUrl = URL.createObjectURL(f);
        console.log(">>>>>this.previewUrl>>>>>>>", this.previewUrl);
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
    console.log("mounted >>>>>>>", this.useStore.formData);
    this.updateData();
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
    this.formData = { code: "", name: "" };
  },
  updated() {
    console.log(">>>>>>>>updated >>>>>>>>>>>>>>>", this.useStore.mode);
    this.updateData();
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
