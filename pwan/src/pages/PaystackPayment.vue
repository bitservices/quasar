<template>
  <q-page>
    <q-btn label="Pay Now" color="primary" @click="payWithPaystack" />
  </q-page>
</template>

<script>
export default {
  name: 'PaystackPaymentPage',

  methods: {
    payWithPaystack() {
      const handler = window.PaystackPop.setup({
        key: 'pk_test_8f42f8d746d6f8bd63d34d6025d6390e24123d61', // Replace with your public key
        email: 'ekwedigwe.ikechukwe@gmail.com',
        amount: 5000,
        ref: '13019245344400391',
        callback: function(response) { 
          console.log(">>>>>>response>>>>",response)
        },
        onCancel: function() {
          alert('Payment was canceled.');
        }
      });
      handler.openIframe();
    }
  }
}
</script>
