<template>
  <q-page padding class="flex flex-center">
    
     <q-card style="width : 450px">
      <q-card-section class="pwan-blue text-white">
        <div class="text-h6 text-center">Sign In</div>
      </q-card-section>
      <q-card-section>
        <div>
          <q-form>
               <q-input filled bottom-slots v-model="formData.username" label="Email" :dense="dense">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
                <template v-slot:append>
                  <q-icon name="close"  @click="formData.username = ''" class="cursor-pointer" />
                </template>
              </q-input>

               <q-input v-model="formData.password" filled label="Password" :type="isPwd ? 'password' : 'text'">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
          </q-form>
        </div>
      </q-card-section>

      <q-card-actions class="flex flex-center">
        <q-btn class="pwan-button" @click="handleSubmit" rounded> Login </q-btn> 
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios';
import { LocalStorage, SessionStorage } from 'quasar';
import router from 'src/router/routes'; 
import path from "src/router/urlpath";
export default {


  data() {
    return {
      formData: { 
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async handleSubmit() {
    try { 
      console.log(this.formData)
      const response = await axios.post(path.USER_AUTHENTICATEE, this.formData);
      if(response.data){
        const authenticated = response.data['access']
        LocalStorage.set('token', response.data);
        console.log(authenticated)
        if (authenticated) {
          // Redirect to the homepage or intended route
          console.log("redirecting to the Home Page", router)
          router.push('/home');
        }
        
      }
    }catch(error){
      console.error('Error submitting form:', error);
    } 
    }
  },
  setup () {
    return {
      password: ref(''),
      isPwd: ref(true),
      username: ref('')
    }
    
  }  
  
}
</script>
