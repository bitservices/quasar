<template>
  <q-dialog v-model="showDialog" persistent width="1229px" height="600px">
    <q-card
      class="card-flex-display"
      :style="{ width: form.width, height: form.height }"
    >
      <q-card-section class="pwan-blue text-white">
        <HeaderPage :label="pageName" :hint="hint" />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="saveRecord" ref="productTypeForm">
          <div class="text-center">
            <q-spinner v-if="showSpinner" color="primary" size="60px" />
          </div>
          <q-input
            filled
            bottom-slots
            v-model="formData.code"
            label="Code"
            :dense="dense"
            :rules="[inputFieldRule]"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.name"
            label="Name"
            :dense="dense"
            :rules="[inputFieldRule]"
          />
          <q-card-actions align="center">
            <div class="row">
              <q-btn
                id="closeBtn"
                rounded
                label="Close"
                icon="close"
                v-close-popup
                class="pwan-blue top-margin full-width"
              />
              <q-btn
                :label="actionLabel"
                rounded
                type="submit"
                icon="save"
                class="pwan-button top-margin full-width"
              />
            </div>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import HeaderPage from "src/components/HeaderPage.vue";
import { inputFieldRequired } from "src/validation/validation";

export default {
  components: {
    HeaderPage,
  },
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
    const { t } = useI18n();
    const pageName = computed(() => t("producttypeform.pagename"));
    const hint = computed(() => t("producttypeform.hint"));
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
      pageName,
      hint,
      showSpinner: false,
      inputFieldRule: (value) => inputFieldRequired(value),
    };
  },
  methods: {
    saveRecord() {
      if (this.$refs.productTypeForm.validate()) {
        this.showSpinner = true;
        this.formData.client = this.profile.client;
        this.formData.organisation = this.profile.organisation;
        this.formData.createdBy = this.profile.email;
        console.log(">>>>>this.formData>>>>>>>>>>>>", this.formData);
        this.$emit("formDataSubmitted", this.formData);
        document.getElementById("closeBtn").click();
        this.showDialog = true;
        this.showSpinner = false;
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
            client: this.profile.client,
            organisation: this.profile.organisation,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            if (result.success) {
              this.formData = result.data[0];
              console.log("formData>>>>>>>", this.formData);
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
