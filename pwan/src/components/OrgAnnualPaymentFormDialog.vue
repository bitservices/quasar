<template>
  <q-dialog v-model='showDialog' persistent width='1229px' height='600px'>
    <q-card
      class='card-flex-display'
      :style='{ width: form.width, height: form.height }'
    >
       <q-card-section class='pwan-blue text-white'>
            <HeaderPage  
                :label='pageName'
                :hint='hint'  
              />
          </q-card-section>
      <q-card-section>
        <q-form @submit.prevent='saveRecord' ref='orgAnnualPmtForm'>
          <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div>  
          <q-select
            filled
            bottom-slots
            v-model='formData.paymentType'
            :options='paymentTypes'
            label='Select Payment Type'
            :dense='dense'
          />
          <q-input
            filled
            bottom-slots
            v-model='formData.amount'
            label='Enter Amount'
            type='number'
            step='0.01'
          />
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align='center'>
          <q-btn
            rounded
            size='md'
            color='primary'
            label='Cancel'
            v-close-popup
          />
          <q-btn
            :label='actionLabel'
            color='secondary'
            @click='saveRecord'
            size='md'
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from 'vue'; 
import { useI18n } from 'vue-i18n'
import { LocalStorage, SessionStorage } from 'quasar';
import axios from 'axios';
import path from 'src/router/urlpath'; 
import HeaderPage from 'src/components/HeaderPage.vue'; 

export default {
  components: { 
    HeaderPage,
  },
  name: 'OrgAnnualPaymentFormDialog',
  props: {
    onClick: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    searchValue: {
      type: String, // Specify the data type of the prop
      required: true, // Indicates whether the prop is required or not
    },
    action: {
      type: String,
      required: true,
    },
    actionLabel: {
      type: String,
      required: true,
    },
    urlLink: {
      type: String,
      required: true,
    },
  },
  data() {
     const { t } = useI18n() 
    const pageName = computed(()=> t('orgpmtform.pagename'))
    const hint = computed(()=> t('orgpmtform.hint'))
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + 'px';
    const dialogHeight = controlHeight + 'px';
    const profile = LocalStorage.getItem('turnelParams');
    const headers = SessionStorage.getItem('headers');

    const formData = ref({
      paymentType: '',
      amount: 0.0,
    });
    const form = ref({
      label: '',
      width: '10px',
      height: '10px',
    });
    const showDialog = ref(false);

    return {
      formData,
      showDialog,
      form,
      dialogWidth,
      dialogHeight,
      paymentTypes: [],
      dense: true,
      profile,
      headers,
      pageName,
      hint,
    };
  },
  methods: {
    saveRecord() {
      console.log('>>>>>>>thisis inside handle Save,', this.formData);
      this.formData.paymentType = this.formData.paymentType.value;
      this.formData.client = this.profile.client;
      this.formData.organisation = this.profile.organisation;
      this.formData.createdBy = this.profile.email;

      //this.onClick(formData.value);
      this.$emit('formDataSubmitted', this.formData);
      this.showDialog = true;
      console.log(this.showDialog);
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
    console.log('mounted>>>>>>>>>>>>');
    const requestParams = {
      params: {
        client: this.profile.client,
        organisation: this.profile.organisation,
      },
    };
    axios
      .get(path.PAYMENTTYPE_SEARCH, requestParams, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.paymentTypes = response.data.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
        console.log('paymentTypes>>>>>>>>>', paymentTypes);
      })
      .catch((error) => {
        console.log(error)
      });
  },
  unmounted() {
    console.log('Calling unmounted>>>>>>>>>>');
    this.formData = { paymentType: '', amount: '' };
  },
  updated() {
    const headers = SessionStorage.getItem('headers');
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
    if (this.action == 'edit' || this.action == 'view') {
      try {
        const requestParams = {
          params: {
            code: this.searchValue,
          },
        };
        const promise = axios.get(this.urlLink, requestParams, headers);
        console.log('>>>>>>>>>>promise>>>>>>>>', promise);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            console.log('>>>>>>>>result>>>>>>>', result.data);
            if (result.success) {
              this.formData = result.data[0];
              this.formData.paymentType = {
                value: result.data[0].paymentType.code,
                label: result.data[0].paymentType.name,
              };
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      this.formData = { paymentType: '', amount: 0.0 };
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
