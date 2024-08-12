<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card
      class="card-flex-display" 
    >
      <q-card-section>
        <div class="row">
          <div class="col-8 text-h6">Uuser Pofile</div>
          <div v-if="imageFile" class="col-4" style="display: flex; justify-content: flex-end">
                  <img :src="imageFile" alt="Preview" style="max-width: 100px" width="150px"  height="100px" />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.userId"
            :options="orgUsers"
            label="Select Member"
            @update:model-value="onChangeUser"
            :dense="dense"
          />
            
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="center">
          <q-btn
            rounded
            size="md"
            color="primary"
            label="Cancel"
            v-close-popup
          />
          <q-btn
            label="Save"
            color="secondary"
            @click="saveRecord"
            size="md"
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
    </div>
  </q-page>
</template>


<script>
import { LocalStorage, SessionStorage } from "quasar";
import { isReadonly, onUnmounted, ref } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import debug from "src/router/debugger";

export default {
   
  data() {
    
   const profile = SessionStorage.getItem("turnelParams");
    const headers = SessionStorage.getItem("headers");
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
      profile,
      orgUsers:[],
    };
  },
  methods: {
    saveRecord() {      
      const requestData = new FormData();
      for (let key in this.formData) { 
        requestData.append(key, this.formData[key]);
      } 

      
    },
   
    onChangeUser(value) {
      console.log(value);
      this.imageFile = "data:image/jpeg;base64," + value.imageSrc;
    },
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
       const requestParams = {
      params: {
        client: this.profile.client,
        organisation: this.profile.organisation,
      },
    };
         const promise =  axios.get(
          path.ORGUSER_SEARCH,
          requestParams,
          this.headers
        ); 
         console.log(">>>>>>>>promise>>>>>>>",promise)
         promise
          .then((response) => {
          this.orgUsers = response.data.data.map((option) => (
          {
          label:
            option.userId.last_name +
            " " +
            option.userId.first_name +
            " " +
            option.userId.middle_name,
          value: option.userId.id,
          imageSrc: option.userId.imageByte,
        }));
        console.log("orgUsers>>>>>>>>>", orgUsers);
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
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
