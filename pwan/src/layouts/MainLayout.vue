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
      <q-item key="logout" clickable tag="a" target="_blank" @click="logout()">
        <q-item-section avatar>
          <q-item-label><q-icon name="logout" />Log Out </q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>
    <q-page-container>
      <router-view @update-menu="handleUpdateMenu" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { LocalStorage, SessionStorage } from "quasar";
import { useRouter } from "vue-router";
const router = useRouter();

defineOptions({
  name: "MainLayout",
});
let linksList = [];
let defaultList = [
  {
    title: "Default",
    menuitems: [
      {
        title: " Dashboard",
        caption: "Dashboard Page",
        icon: "dashboard",
        link: "/dashboard",
      }, 
      
      {
        title: " Expense Report",
        caption: "",
        icon: "chat",
        link: "/selfpaymentrpt",
      },
       {
        title: " Income Report",
        caption: "",
        icon: "chat",
        link: "/selfvendorrpt",
      },      
      {
        title: " Client",
        caption: "Client Definition",
        icon: "chat",
        link: "/client",
      },
      {
        title: " Organisation",
        caption: "Maintain Definition",
        icon: "chat",
        link: "/organisation",
      },
      {
        title: " Prospecting Customer",
        caption: "Prospecting Customers",
        icon: "record_voice_over",
        link: "/prospect",
      },
      {
        title: " Investors",
        caption: "Investors",
        icon: "record_voice_over",
        link: "/investor",
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
        title: " Contact Info",
        caption: "Community Quasar projects",
        icon: "favorite",
        link: "/usercontact",
      },
    ],
  },
];

const leftDrawerOpen = ref(false);
let profiles = LocalStorage.getItem("profiles");
if (profiles != null) {
  linksList = profiles;
} else {
  linksList = defaultList;
  LocalStorage.set("profiles", linksList);
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
  LocalStorage.set("profiles", linksList);
  router.push({ path: "/dashboard" });
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function logout() {  
  LocalStorage.clear();
  sessionStorage.clear();
  router.push("/");
}
</script>
