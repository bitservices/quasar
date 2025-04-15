<template>
  <q-dialog v-model='success'>
    <q-card v-bind:class='form.class' style='width: 300px'>
      <q-card-section>
        <div>{{ form.label }}</div>
      </q-card-section>
      <q-card-section v-bind:class='form.textClass'>
        {{ form.message }}
      </q-card-section>
      <q-card-actions align='right' v-bind:class='form.buttonClass'>
        <q-btn label=' OK ' color='primary' rounded v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {  ref } from 'vue'; 

export default {
  name: 'ResponseDialog',
  props: {
    label: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    cardClass: {
      type: String,
      required: true,
    },
    textClass: {
      type: String,
      required: true,
    },
    buttonClass: {
      type: String,
      required: true,
    },
  },
  data() {
    const success = ref(false);
    const form = ref({
      label: '',
      message: '',
    });
    return {
      form,
      success,
    };
  },
  methods: {},
  beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    this.form.label = this.label;
  },
  mounted() {
    console.log('mounted');
    this.form.message = this.message;
  },
  updated() {
    this.form.message = this.message;
    this.form.label = this.label;
    this.form.class = this.cardClass;
    this.form.textClass = this.textClass;
    this.form.buttonClass = this.buttonClass;
  },
};
</script>
