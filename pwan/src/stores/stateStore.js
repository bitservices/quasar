import { defineStore } from "pinia";

export const useStateStore = defineStore("state", {
  state: () => ({
    formData: {
      id: "",
      code: "",
      name: "",
      countryCode: {},
      status: {},
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
