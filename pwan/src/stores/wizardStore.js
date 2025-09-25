import { defineStore } from "pinia";

export const useWizardStore = defineStore("wizard", {
  state: () => ({
    formData: {
      name: "",
      email: "",
      address: "",
      city: "",
    },
  }),
  actions: {
    updateField(field, value) {
      this.formData[field] = value;
    },
  },
});
