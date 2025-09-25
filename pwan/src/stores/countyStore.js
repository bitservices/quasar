import { defineStore } from "pinia";

export const useCountyStore = defineStore("county", {
  state: () => ({
    formData: {
      id: "",
      code: "",
      name: "",
      stateCode: {},
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
