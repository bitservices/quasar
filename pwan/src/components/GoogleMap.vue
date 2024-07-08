<!-- src/components/GoogleMap.vue -->
<template>
  <GmapMap
    :center="{lat: 10, lng: 10}"
    :zoom="7"
    style="width: 100%; height: 500px"
  >
    <GmapMarker
      :position="{lat: 10, lng: 10}"
      :clickable="true"
      :draggable="true"
    />
  </GmapMap>
</template>

<script>
export default {
  name: 'GoogleMap'
}
</script>
