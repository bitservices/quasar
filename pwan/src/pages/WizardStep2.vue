<template>
  <q-page padding>
    <h4>Step 2: Address Details</h4>
    <q-input
      v-model="wizard.formData.address"
      label="Address"
      outlined
      class="q-mb-md"
    />
    <q-input
      v-model="wizard.formData.city"
      label="City"
      outlined
      class="q-mb-md"
    />

    <div class="row justify-between">
      <q-btn color="primary" label="Back" @click="goBack" />
      <q-btn color="primary" label="Next" @click="goNext" />
    </div>
  </q-page>
</template>

<script>
import { useWizardStore } from "src/stores/wizardStore";
import { useRouter } from "vue-router";

export default {
  setup() {
    const wizard = useWizardStore();
    const router = useRouter();

    function goBack() {
      router.push("/wizardpage/step1");
    }
    function goNext() {
      router.push("/wizardpage/step3");
    }

    return { wizard, goBack, goNext };
  },
};
</script>
