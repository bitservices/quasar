<template>   
           <q-select
            filled
            bottom-slots
            v-model="client" 
            :options="clients" 
            :label="label"
            :placeholder="placeholder"
            :clearable="clearable"
            emit-value
            map-options
            @input="updateValue"
            :rules="[requiredRule]" 
            :use-input="useInput"
            input-debounce="200"
            @filter="filterClients"
          />  
</template>

<script>
import { isRequired, inputFieldRequired } from 'src/validation/validation'; 
import axios from "axios"; 
import path from "src/router/urlpath";
import { useRouter } from "vue-router";
const router = useRouter();
export default { 
    name: "ClientSelect",
    props: {
    
    label: {
      type: String,
      default: "Select a Client",
    },
    placeholder: {
      type: String, 
    },
    clearable: {
      type: Boolean,
      default: true,
    },
     useInput: {
      type: Boolean,
      default: true,
    },
  },   
  data() { 
      
     
    return { 
      clients:[],  
      allClients:[],
      requiredRule: value => isRequired(value),
      inputRequiredRule: value => inputFieldRequired(value), 
    };
  },
  methods: {  
     updateValue(value) {
      this.$emit("input", value);
    },   
     filterClients(val, update) {
        console.log(">>>>val>>>>>>",val)
      if (val === "") {
        update(() => {
          this.clients = this.allClients;
        });
        return;
      }

      const needle = val.toLowerCase();
      update(() => {
        this.clients = this.allClients.filter((option) =>
          option.label.toLowerCase().includes(needle)
        );
      });
    }, 
   loadClients() {
      try { 
         
        axios
          .get(path.CLIENT_SEARCH, this.headers)
          .then((response) => {
            console.log("client Response >>>>>>>>>>>>", response.data.data);
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.clients = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            }));
            this.allClients = this.clients;
            console.log("this.clients >>>>>>>>>>>>", this.clients);
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("beforeMount");
  },
  mounted() {
    this.loadClients();
    console.log(">>>>>>>>mounted>>>>>>>>>>");
  },
  beforeUpdate() {
    console.log(">>>>>>>>before updated>>>>>>>>>>");
  },
  updated() {
    console.log(">>>>>>>>updated>>>>>>>>>>");
  },
};
</script>