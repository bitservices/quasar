import { defineStore } from "pinia";

export const useProductTypeDefinitionStore = defineStore(
  "producttypedefinition",
  {
    state: () => ({
      formData: {
        id: "",
        code: "",
        name: "",
        description: "",
        address: "",
        longitude: "",
        latitude: "",
        landmark: "",
        imageUrl: "",
        videoUrl: "",
        subscriptionFormUrl: "",
        imageByte: "",
        videoByte: "",
        subscriptionFormByte: "",
        imageExt: "",
        videoExt: "",
        subscriptionFormExt: "",
        amount: "",
        allowedPartialPayment: "",
        allowedInspection: "",
        inspectionTime: "",
        productType: {},
        productStatus: {},
        measurement: "",
        dimension: {},
        client: {},
        organisation: {},
        country: {},
        state: {},
        county: {},
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
  }
);
