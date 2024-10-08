<template>
  <q-card>
    <q-card-section>
      <q-input
        v-model="inputValue"
        label="Enter text or URL"
        filled
      />
      <q-btn @click="generateQRCode" label="Generate QR Code" color="primary" />
      <q-separator />
      <div v-if="qrCode">
        <qrcode-vue :value="qrCode" :size="200" :margin="0" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import QrcodeVue from 'qrcode.vue';

export default {
  components: {
    QrcodeVue,
  },
  data() {
    return {
      inputValue: '',
      qrCode: '',
    };
  },
  methods: {
    generateQRCode() {
      this.qrCode = this.inputValue || ''; // Generate QR code from input
    },
  },
};
</script>

<style scoped>
.q-card {
  max-width: 400px;
  margin: 20px auto;
}
</style>
