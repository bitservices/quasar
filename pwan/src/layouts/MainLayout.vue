<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="pwan-blue">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Pwan Group App </q-toolbar-title>

        <div>Pwan Group App v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> MENU </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          :items="link.menuitems"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

defineOptions({
  name: "MainLayout",
});

const linksList = [
  {
    title: "Settings",
    menuitems: [
      {
        title: " Status",
        caption: "Status Page",
        icon: "status",
        link: "/status",
      },
      {
        title: " Gender",
        caption: "Gender Page",
        icon: "code",
        link: "/gender",
      },
      {
        title: " Doc 3",
        caption: "chat.quasar.dev",
        icon: "chat",
        link: "https://chat.quasar.dev",
      },
      {
        title: " Doc 4",
        caption: "forum.quasar.dev",
        icon: "record_voice_over",
        link: "https://forum.quasar.dev",
      },
      {
        title: " Doc 5",
        caption: "@quasarframework",
        icon: "rss_feed",
        link: "https://twitter.quasar.dev",
      },
      {
        title: " Doc 6",
        caption: "@QuasarFramework",
        icon: "public",
        link: "https://facebook.quasar.dev",
      },
      {
        title: " Doc 7",
        caption: "Community Quasar projects",
        icon: "favorite",
        link: "https://awesome.quasar.dev",
      },
    ],
  },
  {
    title: "Operations",
    menuitems: [
      {
        title: " Doc",
        caption: "quasar.dev",
        icon: "school",
        link: "/home",
      },
      {
        title: " Doc 2",
        caption: "github.com/quasarframework",
        icon: "code",
        link: "/dashboard",
      },
      {
        title: " Doc 3",
        caption: "chat.quasar.dev",
        icon: "chat",
        link: "https://chat.quasar.dev",
      },
      {
        title: " Doc 4",
        caption: "forum.quasar.dev",
        icon: "record_voice_over",
        link: "https://forum.quasar.dev",
      },
      {
        title: " Doc 5",
        caption: "@quasarframework",
        icon: "rss_feed",
        link: "https://twitter.quasar.dev",
      },
      {
        title: " Doc 6",
        caption: "@QuasarFramework",
        icon: "public",
        link: "https://facebook.quasar.dev",
      },
      {
        title: " Doc 7",
        caption: "Community Quasar projects",
        icon: "favorite",
        link: "https://awesome.quasar.dev",
      },
    ],
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
