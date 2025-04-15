<template>
  <q-layout view='hHh Lpr lFf'>
    <q-header elevated class='pwan-blue'>
      <q-toolbar>
        <q-toolbar-title> Property Connect App </q-toolbar-title>

        <div>Property Connect App v1.0.0</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup> 

defineOptions({
  name: 'MainLayout',
});

 
</script>


