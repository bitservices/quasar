<template> 
      <div class="row card text-center" >
          <div class="col-3"></div>
          <div class="card-header text-white col-6 pwan-red">{{ label }}</div>
          <div class="col-3"></div>
        </div>
      <div class="card text-center" style="margin-top:10px">
          <div class="card-body">  
            <span class="card-title"></span>   
            <div class="col-3"></div>
            <div class="card-header text-white  pwan-blue col-6">{{ hint }}</div>
          <div class="col-3"></div> 
          </div> 
      </div>
        
</template>

<script>  
import { ref } from "vue"; 
export default {
  name: "HeaderPage", 
  props: { 
    label: {
      type: String,
      required: true,
    },
    hint: {
      type: String, // Specify the data type of the prop
      required: true, // Indicates whether the prop is required or not
    }
  },
  data() { 
     
    return { 
    };
  },
  methods: {
     
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
    console.log("mounted>>>>>>>>>>>>");
     
  },
  unmounted() {
    console.log("Calling unmounted>>>>>>>>>>");
    
  },
  updated() {
     console.log("Calling Updated LifeCycle>>>>>>>>>>");
  },
};
</script>