<template>
  <q-dialog  @hide="showDialog"  persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{form.label}}</div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-input
              filled
              bottom-slots
              v-model="formData.code"
              label="Code"
              :dense="dense" />
          <q-input
              filled
              bottom-slots
              v-model="formData.name"
              label="Name"
              :dense="dense" />

          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn label=" Save " color="primary" @click="handleSave" rounded />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>


<script>
import { SessionStorage } from "quasar";
import { onUnmounted, ref } from "vue";
import axios from "axios";

export default {
name: 'StandingDataFormDialog',
props: {
    onClick: {
      type: Function,
      required: true
    },
    label:{
      type : String,
      required : true
    }
  },
  setup () {  
    const formData = ref({
        code: '',
        name: ''
    });
    const form  = ref({
        label :  ""
      });
     const showDialog = ref(false);
     
    return {  
      formData,
      showDialog,
      form, 
    }
  },
  methods(){
    const handleSave =  () => { 
      console.log(">>>>>>>thisis inside handle Save,", this.onClick)  
        showDialog.value = true
        console.log(showDialog.value)
    }; 

  },
  beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
   this.form.label = this.label
   console.log("onClick Function >>>>>>", this.onClick)
  },
  mounted() {
    console.log('mounted');  
    console.log('ChildComponent inside  mounted:', this.onClick); 
  }

}

</script>
