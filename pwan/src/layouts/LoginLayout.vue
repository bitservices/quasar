<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="pwan-blue">
      <q-toolbar>
        <q-toolbar-title> Property Connect App </q-toolbar-title>

        <div>Property Connect App v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

defineOptions({
  name: "MainLayout",
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>


