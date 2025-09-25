import { defineStore } from "pinia";

export const useProductTypeStore = defineStore("productType", {
  state: () => ({
    formData: {
      id: "",
      code: "",
      name: "",
      client: {},
      organisation: {},
      productCategory: {},
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
