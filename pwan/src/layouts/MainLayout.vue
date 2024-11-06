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
        <q-toolbar-title> Property Connect App  {{currentClient}}</q-toolbar-title>

        <div>Property Connect App v{{ $q.version }}</div>
        <div class="q-gutter-sm row items-center no-wrap" style="flext:1, width:40%;"> 
					<q-btn round dense flat color="white" icon="notifications">
						<q-badge color="red" text-color="white" floating> 5 </q-badge>
						<q-menu>
							<q-list style="min-width: 100px">
								<messages></messages>
								<q-card class="text-center no-shadow no-border">
									<q-btn
										label="View All"
										style="max-width: 120px !important"
										flat
										dense
										class="text-indigo-8"
									></q-btn>
								</q-card>
							</q-list>
						</q-menu>
					</q-btn>  
      		 <q-btn dense flat round icon="logout" @click="logout" />
				</div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="pwan-blue text-white">
         <div v-if="userImage" class="col-4 " style="display: flex; justify-content: flex-end "> 
        <q-card class="pwan-blue my-card" flat>  
          <div class="row" style="margin-top: 5px" >
            <div class="col-6">
              <q-img
                class="circular-image"
                :src="userImage" 
                contain
              style="height: 80px; width: 80px" />
              <div class="norap">{{userNames}} </div>
            </div>
          </div>  
        </q-card>
      </div>
      <hr/>
      <q-list> 
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
import { ref, onMounted, onUpdated, onBeforeUpdate, onUnmounted } from 'vue'
import EssentialLink from "components/EssentialLink.vue";
import { LocalStorage, SessionStorage } from "quasar";
import { useRouter } from "vue-router"; 
import axios from "axios";
import path from "src/router/urlpath";
import Messages from "components/UserMessages.vue";
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
        icon: "event",
        link: "/dashboard",
      },  
      
      {
        title: " Leads",
        caption: "Leads",
        icon: "record_voice_over",
        link: "/leads",
      },

      {
        title: " Testimonial", 
        icon: "record_voice_over",
        link: "/testimonial",
      },

      {
        title: " Expense Report",
        caption: "",
        icon: "event",
        link: "/selfpaymentrpt",
      },
       {
        title: " Income Report",
        caption: "",
        icon: "event",
        link: "/selfvendorrpt",
      },      
      
      {
        title: " Prospecting Customer",
        caption: "Prospecting Customers",
        icon: "record_voice_over",
        link: "/prospect",
      },
       
      {
        title: "User Profile",
        caption: "",
        icon: "event",
        link: "/userprofile",
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
        title: " Contact Info",
        caption: "Community Quasar projects",
        icon: "favorite",
        link: "/usercontact",
      },
      {
        title: " Change PAssword",
        caption: "Change Password",
        icon: "key",
        link: "/changepassword",
      },
    ],
  },
];

const leftDrawerOpen = ref(false);
let profiles = LocalStorage.getItem("profiles"); 
let userEmail = LocalStorage.getItem("userEmail");  
let currentClient = "";
const headers = SessionStorage.getItem("headers"); 
let userImage = null;
let userNames = null;
if (profiles != null) {
  linksList = profiles;
} else {
  linksList = defaultList;
  LocalStorage.set("profiles", linksList);
} 

function handleUpdateMenu(updatedMenuItems) { 
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

function loadUserImage(email){ 
       const requestParam = {
        params: {
          username: email, 
        },
      };  
      const promise =  axios.get(
          path.USER_IMAGE,
          requestParam,
          headers
        );  
         promise
          .then((response) => {
            console.log(response.data.data)
            userImage = "data:image/jpeg;base64," + response.data.data.imageByte;
            userNames = response.data.data.last_name + " "+ response.data.data.first_name + " "+ response.data.data.middle_name
          })
          .catch((error) => {
            console.log(error);
          }); 
    }

   onUpdated(() => {
  console.log('Component has been updated.')
    const turnelProfile = LocalStorage.getItem("turnelParams"); 
    console.log(">>>>>>turnelProfile>>>>>>>",turnelProfile)
  if(turnelProfile != null){ 
    currentClient = "("+turnelProfile.orgName + ")";
    console.log("currentClient>>>>>>>>",currentClient)
    
  }

})


  loadUserImage(userEmail);
</script> 

<style scoped>
.my-card {
  max-width: 300px;
  width: 100%;
}

.circular-image {
  border-radius: 100%;
  width: 50px; /* Adjust to your desired size */
  height:50px; /* Adjust to your desired size */
  object-fit: cover;
}
</style>