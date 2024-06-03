<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          My Quasar App
        </q-toolbar-title>

        <q-btn flat to="/">Home</q-btn>
        <q-btn flat to="/login">Login</q-btn>
        <q-btn flat to="/dashboard">Dashboard</q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'App',
};
</script>
