<template>
  <q-page padding>
    <HeaderPage :label="pageName" :hint="hint" />

    <div v-if="$q.screen.lt.md">
      <p>Payment Evidence</p>
      <hr />
    </div>
    <q-form>
      <div class="row">
        <div class="cols-6 col-12">
          <div class="row">
            <!-- Preview for images -->
            <div class="cols-6 col-12 q-mt-md">
              <q-img
                v-if="previewEvidenceUrl"
                :src="previewEvidenceUrl"
                spinner-color="primary"
                style="width: 100%; height: 50%"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-end q-gutter-sm">
        <q-btn size="md" color="negative" label="Back" @click="cancel" />
        <q-btn size="md" color="positive" label="Download" @click="download" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage, Loading, QSpinnerGears } from "quasar";
import { useI18n } from "vue-i18n";
import { ref, computed, nextTick } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import { useSubscriptionStore } from "src/stores/subscriptionStore";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import HeaderPage from "src/components/HeaderPage.vue";
import { isRequired, inputFieldRequired } from "src/validation/validation";
import DatePicker from "src/components/DatePicker.vue";

export default {
  components: {
    HeaderPage,
    DatePicker,
  },
  name: "ProductTypeFormDialog",

  data() {
    const useStore = useSubscriptionStore();
    const router = useRouter();
    const $q = useQuasar();
    const { t } = useI18n();
    const pageName = computed(() => t("subscription.pagename"));
    const hint = computed(() => t("subscription.maintain.hint"));
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + "px";
    const dialogHeight = controlHeight + "px";
    const userEmail = LocalStorage.getItem("userEmail");
    const headers = SessionStorage.getItem("headers");
    const step = ref(1);

    const file = ref(null);
    const previewEvidenceUrl = ref(null);
    const imgError = ref(null);

    return {
      previewEvidenceUrl,

      useStore,
      router,
      $q,
    };
  },

  methods: {
    cancel() {
      this.useStore.reload = false;
      this.router.push("/subscription/view");
    },
    download() {
      const base64Data = this.useStore.formData.payment.paymentEvidence;
      const mimeType = "image/png"; // 👈 set the correct type
      const fileName = "paymentEvidence.png";

      // Convert base64 to byte array
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create blob
      const blob = new Blob([byteArray], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      // Create a link and click it
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    },

    detectImageFormat(bytes) {
      if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return "JPEG";
      } else if (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47
      ) {
        return "PNG";
      } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
        return "GIF";
      } else if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
        return "BMP";
      } else if (
        (bytes[0] === 0x49 && bytes[1] === 0x49) ||
        (bytes[0] === 0x4d && bytes[1] === 0x4d)
      ) {
        return "TIFF";
      } else if (
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46
      ) {
        return "WEBP";
      }
      return "Unknown";
    },

    base64ToBytes(base64) {
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    },

    detectImageFormatFromBase64(base64) {
      const bytes = this.base64ToBytes(base64);
      return this.detectImageFormat(bytes);
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
    this.previewEvidenceUrl =
      "data:image/jpeg;base64," +
      this.useStore.formData.payment.paymentEvidence;
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
  },
  updated() {
    this.previewEvidenceUrl =
      "data:image/jpeg;base64," +
      this.useStore.formData.payment.paymentEvidence;
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
