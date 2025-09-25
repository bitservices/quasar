import { defineStore } from "pinia";

export const useOrganisationStore = defineStore("organisation", {
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
      address: "",
      longitude: "",
      latitude: "",
      radius: "",
      meetingDays: "",
      meetingName: "",
      slogan: "",
      allowSeatAllocation: "",
      validateMeetingStartTime: "",
      client: "",
      reservedSeats: "",
      seatPrefix: "",
      seatSufix: "",
      country: "",
      state: "",
      county: "",
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
