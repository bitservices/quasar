<template>
  <GmapMap :center="center" :zoom="zoom" style="width: 100%; height: 400px">
    <!-- Add other map components or markers here if needed -->
  </GmapMap>
</template>

<script>
import { gmapApi } from "@fawmi/vue-google-maps";

export default {
  data() {
    return {
      center: { lat: 0, lng: 0 }, // Initial map center
      zoom: 10, // Initial zoom level
    };
  },
  mounted() {
    // Example of reading user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    }
  },
};
</script>
