<template>
  <q-dialog v-model="showDialog" persistent width="1229px" height="600px">
    <q-card
      class="card-flex-display"
      :style="{ width: form.width, height: form.height }"
    >
      <q-card-section>
        <div class="text-h6">{{ form.label }}</div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-input
            filled
            bottom-slots
            v-model="formData.code"
            label="Code"
            :dense="dense"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.name"
            label="Name"
            :dense="dense"
          />
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="center">
          <q-btn
            rounded
            size="sm"
            color="primary"
            label="Cancel"
            v-close-popup
          />
          <q-btn
            label="Submit"
            color="secondary"
            @click="saveRecord"
            size="sm"
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { SessionStorage } from "quasar";
import { onUnmounted, ref } from "vue";
import axios from "axios";

export default {
  name: "StandingDataFormDialog",
  props: {
    onClick: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    dataProp: {
      type: Object, // Specify the data type of the prop
      required: true, // Indicates whether the prop is required or not
    },
    action: {
      type: String,
      required: true,
    },
  },
  data() {
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + "px";
    const dialogHeight = controlHeight + "px";
    console.log("width and height", dialogWidth, dialogHeight);

    const formData = ref({
      code: "",
      name: "",
    });
    const form = ref({
      label: "",
      width: "10px",
      height: "10px",
    });
    const showDialog = ref(false);

    return {
      formData,
      showDialog,
      form,
      dialogWidth,
      dialogHeight,
    };
  },
  methods: {
    saveRecord() {
      console.log(">>>>>>>thisis inside handle Save,", this.formData);
      //this.onClick(formData.value);
      this.$emit("formDataSubmitted", this.formData);
      this.showDialog = true;
      console.log(this.showDialog);
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
    console.log("mounted");
  },
  updated() {
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == "add") {
      this.formData = { code: "", name: "" }; //this.dataProp;
    } else if (this.action == "edit") {
      this.formData = { code: "A", name: "Active" };
    }
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
