<template>  
    <div class='q-pa-md' align='center'> 
        <q-space />
        <q-space />
         <q-btn
            label='Done'
             class='pwan-button-done'
            @click='done'
            size='md'  
            rounded
          />
      </div>  
</template>

<script> 


import { useRouter } from 'vue-router'; 
import { LocalStorage } from 'quasar';  


export default {
   
  data() {
    const router = useRouter();
    return { 
      router,
    };
  },
  methods: {
    done() {
       console.log("Calling Done >>>>>>>>>")
       var pageStacking = LocalStorage.getItem('pagestack')
       console.log(">>>>>>>pageStacking>>>>>>>>>",pageStacking)

        pageStacking.pop() 
        const index = pageStacking.length;
        var url =  pageStacking[index - 1] 
       LocalStorage.set('pagestack',pageStacking)
        this.router.push(url.trim());
    },
  },
};
</script>

<style scoped>
.q-card {
  max-width: 400px;
  margin: 20px auto;
}
</style>
