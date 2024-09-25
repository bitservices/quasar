<template>
  <q-page class="flex flex-center">
    <div>
      <p class="error">{{ error }}</p>

      <p class="decode-result">
        Last result: <b>{{ result }}</b>
      </p>

      <qrcode-stream @decode="onDecode" @init="onInit" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
//importing QrcodeStream component from vue-qrcode-reader.
import { QrcodeStream } from "vue-qrcode-reader";
export default defineComponent({
  name: "PageIndex",
  components: { QrcodeStream },
  data() {
    return {
      result: "",
      error: "",
    };
  },
  methods: {
    //Creating onCode method to change result state to data receiving through scanner
    onDecode(result) {
      this.result = result;
    },
    // cretaing onInit method to check for error or permission or browser not supported
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    },
  },
});
</script>