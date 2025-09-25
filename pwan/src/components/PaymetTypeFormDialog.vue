<template>
  <q-page padding>
    <q-card>
      <q-card-section class="pwan-blue text-white">
        <HeaderPage :label="pageName" :hint="hint" />
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="executeRecord" ref="formRef">
          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.code"
            label="Code"
            :readonly="isReadonly"
            :dense="dense"
            :rules="[inputFieldRule]"
          />

          <q-input
            filled
            bottom-slots
            v-model="useStore.formData.name"
            label="Name"
            :dense="dense"
            :rules="[inputFieldRule]"
          />
          <div class="row justify-center q-gutter-sm">
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
              type="submit"
              size="md"
              rounded
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import { useProductTypeStore } from "src/stores/productTypeStore";
import { useRouter } from "vue-router";
import helper from "src/utils/helper";
import { useQuasar } from "quasar";
import HeaderPage from "src/components/HeaderPage.vue";
import { isRequired, inputFieldRequired } from "src/validation/validation";

export default {
  components: {
    HeaderPage,
  },
  name: "ProductTypeFormDialog",
  data() {
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport

    const { t } = useI18n();
    const pageName = computed(() => t("producttype.pagename"));
    const hint = computed(() => t("producttype.maintain.hint"));
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + "px";
    const dialogHeight = controlHeight + "px";
    const headers = SessionStorage.getItem("headers");
    const useStore = useProductTypeStore();
    const router = useRouter();
    const $q = useQuasar();
    const profile = LocalStorage.getItem("turnelParams");

    return {
      dialogWidth,
      dialogHeight,
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
      pageName,
      hint,
      profile,
      requiredRule: (value) => isRequired(value),
      inputFieldRule: (value) => inputFieldRequired(value),
    };
  },
  methods: {
    executeRecord() {
      if (this.$refs.formRef.validate()) {
        let record = Object.assign({}, this.useStore.formData);
        record.status = this.useStore.formData?.status
          ? "A"
          : this.useStore.formData.status.code;
        record.client = this.profile.client;
        record.organisation = this.profile.organisation;
        record.createdBy = this.profile.email;

        let promise = "";
        if (this.useStore.mode == "create") {
          promise = axios.post(path.PRODUCTTYPE_CREATE, record, this.headers);
        }
        if (this.useStore.mode == "update") {
          promise = axios.put(path.PRODUCTTYPE_UPDATE, record, this.headers);
        } else if (this.useStore.mode == "delete") {
          console.log("calling deactivate >>>>>>>>>>>>>");
          promise = axios.post(path.PRODUCTTYPE_REMOVE, record, this.headers);
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

            this.router.push("/producttype");
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
            this.$q.notify({
              type: "negative",
              message: error.message,
              position: "center",
            });
          });
      }
    },

    cancel() {
      this.useStore.reload = false;
      this.router.push("/producttype");
    },
    updateData() {
      this.isReadonly = false;
      if (this.useStore.mode == "view") {
        this.showButton = false;
      } else {
        this.showButton = true;
      }
      this.actionLabel = this.useStore.mode;
      if (this.useStore.mode == "delete") {
        this.colourLabel = "negative";
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
