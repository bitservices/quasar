<template> 
		 
   <div class='text-center'> 
        <q-spinner v-if='show' color='primary' size='60px' />
    </div> 

</template>

<script> 
 
export default {
  name: 'PageLoader',  
  props: { 
    show: {
      type: Boolean,
      required: true,
    } 
  },
  data() {
   
    console.log('>>>inside the pageLoader', this.show)
    return {
       
    };
  },
  methods: {
     
  },
  beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('before Mount');
  },
  mounted() {
    console.log('mounted>>>>>>>>>>>>');
     
  },
  unmounted() {
    console.log('Calling unmounted>>>>>>>>>>');
    
  },
  updated() {
     console.log('Calling Updated LifeCycle>>>>>>>>>>');
  },
};
</script>


