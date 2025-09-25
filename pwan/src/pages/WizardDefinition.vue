<template>
  <q-page padding>
    <q-stepper v-model="step" color="primary" animated flat>
      <!-- Step 1 -->
      <q-step name="1" title="Personal Info" icon="person" :done="step > 1">
        <q-input
          v-model="formData.name"
          label="Full Name"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model="formData.email"
          label="Email"
          outlined
          class="q-mb-md"
        />

        <div class="row justify-end q-gutter-sm">
          <q-btn color="primary" label="Next" @click="step++" />
        </div>
      </q-step>

      <!-- Step 2 -->
      <q-step name="2" title="Address Details" icon="home" :done="step > 2">
        <q-input
          v-model="formData.address"
          label="Address"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model="formData.city"
          label="City"
          outlined
          class="q-mb-md"
        />

        <div class="row justify-between q-gutter-sm">
          <q-btn flat color="primary" label="Back" @click="step--" />
          <q-btn color="primary" label="Next" @click="step++" />
        </div>
      </q-step>

      <!-- Step 3 -->
      <q-step name="3" title="Tenant Details" icon="check_circle">
        <div>
          <p><strong>Name:</strong> {{ formData.name }}</p>
          <p><strong>Email:</strong> {{ formData.email }}</p>
          <p><strong>Address:</strong> {{ formData.address }}</p>
          <p><strong>City:</strong> {{ formData.city }}</p>
        </div>

        <div class="row justify-between q-gutter-sm">
          <q-btn flat color="primary" label="Back" @click="step--" />
          <q-btn flat color="primary" label="Next" @click="step++" />
        </div>
      </q-step>
      <!-- Step 4 -->
      <q-step name="3" title="Confirmation" icon="check_circle">
        <div>
          <p><strong>Name:</strong> {{ formData.name }}</p>
          <p><strong>Email:</strong> {{ formData.email }}</p>
          <p><strong>Address:</strong> {{ formData.address }}</p>
          <p><strong>City:</strong> {{ formData.city }}</p>
        </div>

        <div class="row justify-between q-gutter-sm">
          <q-btn flat color="primary" label="Back" @click="step--" />
          <q-btn color="green" label="Submit" @click="submitForm" />
        </div>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      formData: {
        name: "",
        email: "",
        address: "",
        city: "",
      },
    };
  },
  methods: {
    submitForm() {
      // This is where you send the form data to your API
      console.log("Form submitted:", this.formData);
      this.$q.notify({
        type: "positive",
        message: "Form submitted successfully!",
      });
    },
  },
};
</script>
