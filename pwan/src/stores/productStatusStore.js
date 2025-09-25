import { defineStore } from "pinia";

export const useProductStatusStore = defineStore("productStatus", {
  state: () => ({
    formData: {
      code: "",
      name: "",
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
