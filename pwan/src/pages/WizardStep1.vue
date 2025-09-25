<template>
  <q-page padding>
    <h4>Step 1: Personal Info</h4>
    <q-input
      v-model="wizard.formData.name"
      label="Full Name"
      outlined
      class="q-mb-md"
    />
    <q-input
      v-model="wizard.formData.email"
      label="Email"
      outlined
      class="q-mb-md"
    />

    <div class="row justify-end">
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

    function goNext() {
      router.push("/wizardpage/step2");
    }

    return { wizard, goNext };
  },
};
</script>
