<template>
  <q-layout view="lHh Lpr lFf">
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
      <router-view @update-menu="handleUpdateMenu" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { LocalStorage } from "quasar";

defineOptions({
  name: "MainLayout",
});
let linksList = [];
let defaultList = [
  {
    title: "Default 1",
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
        title: " Marital Status",
        caption: "Marital Status Page",
        icon: "chat",
        link: "/maritalstatus",
      },
      {
        title: " Product Status",
        caption: "Product Status Page",
        icon: "record_voice_over",
        link: "/productstatus",
      },
      {
        title: " Payment Mode",
        caption: "Paymet Mode Page",
        icon: "rss_feed",
        link: "/paymentmode",
      },
      {
        title: " Country",
        caption: "@QuasarFramework",
        icon: "country",
        link: "/country",
      },
      {
        title: " State",
        caption: "State Definition",
        icon: "favorite",
        link: "/state",
      },
    ],
  },
  {
    title: "Default 2",
    menuitems: [
      {
        title: " County ",
        caption: "County Definition",
        icon: "school",
        link: "/county",
      },
      {
        title: " MemberShip Tyoe",
        caption: "MemberShip Type",
        icon: "code",
        link: "/membershiptype",
      },
      {
        title: " Client",
        caption: "Client Definition",
        icon: "chat",
        link: "/client",
      },
      {
        title: " Prospecting Customer",
        caption: "Prospecting Customers",
        icon: "record_voice_over",
        link: "/prospect",
      },
      {
        title: " Menu ",
        caption: "@quasarframework",
        icon: "rss_feed",
        link: "/menu",
      },
      {
        title: " Menu Item ",
        caption: "@quasarframework",
        icon: "rss_feed",
        link: "/menuitem",
      },
      {
        title: " Sales Transction ",
        caption: "@quasarframework",
        icon: "rss_feed",
        link: "/sales",
      },
      {
        title: " Turnel ",
        caption: "@QuasarFramework",
        icon: "public",
        link: "/turnel",
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
let profiles = LocalStorage.getItem("profiles")
  if(profiles!= null){
    linksList = profiles 
  }else{
    linksList = defaultList;
    LocalStorage.set("profiles", linksList)
  }

function handleUpdateMenu(updatedMenuItems) {
  console.log("updated Menu>>>>>>>>>", updatedMenuItems);
  linksList = [];  
  
  defaultList.forEach(function (menu, index) {
    linksList.push(menu);
  });
  updatedMenuItems.forEach(function (menu, index) {
    linksList.push(menu);
  });
  LocalStorage.set("profiles", linksList)
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
