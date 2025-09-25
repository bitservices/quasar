<template>
  <q-page padding>
    <h4>Step 3: Confirmation</h4>
    <div class="q-mb-md">
      <p><strong>Name:</strong> {{ wizard.formData.name }}</p>
      <p><strong>Email:</strong> {{ wizard.formData.email }}</p>
      <p><strong>Address:</strong> {{ wizard.formData.address }}</p>
      <p><strong>City:</strong> {{ wizard.formData.city }}</p>
    </div>

    <div class="row justify-between">
      <q-btn color="primary" label="Back" @click="goBack" />
      <q-btn color="green" label="Submit" @click="submitForm" />
    </div>
  </q-page>
</template>

<script>
import { useWizardStore } from "src/stores/wizardStore";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  setup() {
    const wizard = useWizardStore();
    const router = useRouter();
    const $q = useQuasar();

    function goBack() {
      router.push("/wizardpage/step2");
    }

    function submitForm() {
      console.log("Final Form Data:", wizard.formData);
      // $q.notify({ type: "positive", message: "Form submitted successfully!" });
      router.push("/wizardpage"); // Redirect after submit
    }

    return { wizard, goBack, submitForm };
  },
};
</script>
