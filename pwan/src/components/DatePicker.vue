<template>
  <div>
    <q-input
      v-model='selectedDate'
      :label='label'   
      @change='onChangeDate' 

    >
      <template v-slot:append>
        <q-icon name='event' @click='showDatePicker = !showDatePicker' class='cursor-pointer' />
      </template>
    </q-input> 
      <q-date v-if='showDatePicker'
        v-model='selectedDate' 
        @click='setDateValue'
      /> 
  </div>
</template>

<script>
import { date } from 'quasar'; // Import Quasar's date utilities

export default {
   name: 'DatePicker', 
  props: { 
    label: {
      type: String,
      required: true,
    },
    
     
  },
  data() {
    return {
      selectedDate: null, // Store the selected date
      showDatePicker: false, // Control visibility of the date picker 
    };
  },
  computed: {
    formattedDate() {
      // Format the date for display
      return this.selectedDate ? date.formatDate(this.selectedDate, 'YYYY-MM-DD') : '';
    },
  },
  methods: {
     
     setDateValue() {  
       this.selectedDate = date.formatDate(this.selectedDate, 'YYYY-MM-DD') 
      this.$emit('setDate', this.selectedDate); // Emit the value to the parent
    },
    onChangeDate(value){ 
         this.selectedDate = value ? date.formatDate(value, 'YYYY-MM-DD') : ''; 
         this.setDateValue();
    }, 
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
    console.log('>>>>>>>>>mounted>>>>>>>>>>');
   
  },
  unmounted() { 
     
  },
  updated() {  
    console.log('>>>>>>>>>>>')
  },
};
 
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
