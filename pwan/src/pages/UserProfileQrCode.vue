<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card
      class="card-flex-display" 
    >
    <q-card-section class="pwan-blue text-white">
        <HeaderPage  
            :label="pageName"
            :hint="hint"  
          />
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-8 text-h6"> 
          </div>
          <div v-if="imageFile" class="col-4" style="display: flex; justify-content: flex-end">
                  <img :src="imageFile" alt="Preview" style="max-width: 100px" width="150px"  height="100px" />
          </div>
        </div>
      </q-card-section> 
      <q-card-section>
        <div class="parent"> 
            <div class="child" v-if="value">
              <qrcode-vue :value="value" :size="size" level="H" render-as="svg" /> 
            </div> 
        </div>  
      </q-card-section>
    </q-card> 
    </div>
    
  </q-page>
</template>


<script>
import { LocalStorage, SessionStorage } from "quasar";
import { isReadonly, computed, ref } from "vue"; 
import { useI18n } from 'vue-i18n'
import axios from "axios";
import path from "src/router/urlpath"; 
import { useRouter } from "vue-router"; 
import HeaderPage from "src/components/HeaderPage.vue";  
import QrcodeVue from 'qrcode.vue'

export default {
   components: { 
    HeaderPage,  
    QrcodeVue, 
  }, 
   
  data() {
    
    const { t } = useI18n()  
    const pageName = computed(()=> t('userqrcode.pagename'))
    const hint = computed(()=> t('userqrcode.hint'))
    const router = useRouter();
    const headers = SessionStorage.getItem("headers");
    const value = ref(null); 
    const formData = ref({
      last_name: "",
      middle_name: "",
      first_name: "", 
    });
    

    return {
      formData, 
      headers, 
      dense:true,
      isReadonly:true,
      imageFile : null, 
      router,
      showSpinner: false, 
      pageName,
      hint,
      value,
      size: 200, 
    };
  },
  methods: {
    loadUserImage(userId){
       const requestParam = {
                  params: {
              userId: userId, 
            },
          };  
          const promise =  axios.get(
              path.USER_IMAGE,
              requestParam,
              this.headers
            );  
            promise
              .then((response) => {

                this.imageFile = "data:image/jpeg;base64," + response.data.data.imageByte;
              })
              .catch((error) => {
                console.log(error);
              }); 
    }
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("before Mount");
  },
  mounted() {
    console.log(">>>>>>>>>mounted>>>>>>>>>>");
    try {
        const userEmail = LocalStorage.getItem("userEmail");
        const requestParam = {
          params: {
            email: userEmail,
          },
        };
        const promise =  axios.get(
          path.FIND_USER_BY_EMAIL,
          requestParam,
          this.headers
        ); 

         promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;   
            if (result.success) {  
               
             // this.imageFile = "data:image/jpeg;base64," + this.formData.imageByte   
             this.loadUserImage(result.data.id)
             const userName = result.data.last_name + " "+result.data.first_name + " "+result.data.middle_name;
             let obj = {email:result.data.email,
             id:result.data.id,
             name:userName}
             this.value = JSON.stringify(obj) 

            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error:", error);
      }
 

        
  },
  unmounted() { 
     
  },
  updated() {
    console.log(">>>>>>>>>>>update>>>>>>") 
  },
};
</script>
<style scoped>
 .parent {
  position: relative;
  height: 100vh; /* Adjust height as needed */
}

.child {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centers the child */
}
</style>
