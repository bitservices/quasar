import { defineStore } from "pinia";

export const useClientStore = defineStore("client", {
  state: () => ({
    formData: {
      id: "",
      code: "",
      name: "",
      website: "",
      isAnAffilate: "",
      activationDate: "",
      expirationDate: "",
      logo: "",
      status: {},
      createdBy: "",
    },

    reload: true,
    data: [],
    mode: "create",
  }),
  actions: {
    reset() {
      this.$reset(); // ✅ built-in in Pinia
    },
    updateField(field, value) {
      this.formData[field] = value;
    },
  },
});
