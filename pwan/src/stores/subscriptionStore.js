import { defineStore } from "pinia";

export const useSubscriptionStore = defineStore("subscription", {
  state: () => ({
    formData: {
      id: "",
      realtor: {},
      subscribedProduct: "",
      subscriptionDate: null,
      subscriber: {
        id: "",
        lastName: "",
        firstName: "",
        middleName: "",
        imageUrl: "",
        gender: null,
        maritalStatus: null,
        nextOfKin: {},
        relationShipType: "",
        phoneNumber: "",
        dateOfBirth: null,
        address: null,
        occupation: null,
        emailAddress: null,
        country: null,
        state: null,
        county: null,
        signature: "",
      },
      client: "",
      organisation: {},
      totalAmount: "",
      amount: 0.0,
      quantity: 1,
      paymentStatus: {},
      paymentPlans: {},
      subscriptionPayments: {},
      createdBy: {},
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
