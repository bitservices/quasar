<template>
  <q-page padding>
    <div class='q-pa-md'>
      <q-card class='card-flex-display'>
        <q-card-section>
          <q-form>
            <q-select
              filled
              bottom-slots
              v-model='formData.vendorCode'
              :options='vendors'
              label='Select Vendor'
              @update:model-value='onChangeVendor'
              :dense='dense'
            />
            <q-input
              filled
              bottom-slots
              v-model='formData.amount'
              placeholder='Payable Amount'
              type='number'
              :dense='dense'
            />
            <q-input
              filled
              bottom-slots
              v-model='formData.description'
              label='Description'
              type='textarea'
              rows='2'
              maxlength='200'
              counter
            />

            <q-select
              filled
              bottom-slots
              v-model='formData.paymentMode'
              :options='paymentModes'
              label='Select Payment Mode'
              :dense='dense'
            />
          </q-form>
        </q-card-section>
        <q-card-section>
          <q-card-actions align='center'>
            <ResponseDialog
              v-model='showMessageDialog'
              :cardClass='childRef.cardClass'
              :textClass='childRef.textClass'
              :label='childRef.label'
              :message='childRef.message'
              :buttonClass='childRef.buttonClass'
            />
            <q-btn
              label='Reset'
              color='primary'
              @click='reloadPage'
              size='md'
              rounded
              v-close-popup
            />
            <q-btn
              label='Save'
              color='secondary'
              @click='saveRecord'
              size='md'
              rounded
              v-close-popup
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar'; 
import axios from 'axios';
import path from 'src/router/urlpath';
import debug from 'src/router/debugger';
import ResponseDialog from 'src/components/ResponseDialog.vue';

export default {
  components: {
    ResponseDialog,
  },
  data() {
    const profile = LocalStorage.getItem('turnelParams');
    const headers = SessionStorage.getItem('headers');
    const showMessageDialog = ref(false);
    const formData = ref({});
    const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {},
    });

    return {
      formData,
      headers,
      dense: true,
      isReadonly: true,
      profile,
      showMessageDialog,
      vendors: [],
      paymentModes: [],
      childRef,
    };
  },
  methods: {
    reloadPage() {
      window.location.reload();
    },
    saveRecord() {
      this.formData.vendorCode = this.formData.vendorCode.value;
      this.formData.paymentMode = this.formData.paymentMode.value;
      this.formData.organisation = this.profile.organisation;
      this.formData.client = this.profile.client;
      this.formData.createdBy = this.profile.email;
      console.log('>>>>>>>>this.formData>>>>>>>>>>>>>>', this.formData);
      try {
        const promise = axios.post(
          path.VENDOR_PAYMENT_TRANSACTION_CREATE,
          this.formData,
          this.headers
        );
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;
            if (result.success) {
              this.childRef = {
                message: result.message,
                label: 'Success',
                cardClass: 'bg-positive text-white',
                textClass: 'q-pt-none',
                buttonClass: 'bg-white text-teal',
              };
              this.showMessageDialog = true;
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
          })
          .catch((error) => {
            debug('Error:', error);
          });
      } catch (error) {
        debug('Error:', error);
      }
    },

    onChangeVendor(obj) {
      console.log('>>>>>>>>obj>>>>>>>>>>>', obj);
      //this.imageFile = 'data:image/jpeg;base64,' + obj.imageSrc;

      try {
      } catch (error) {
        console.error('Error:', error);
      }
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
    try {
      const requestParams = {
        params: {
          client: this.profile.client,
          organisation: this.profile.organisation,
        },
      };
      const promise = axios.get(
        path.VENDOR_SEARCH,
        requestParams,
        this.headers
      );
      console.log('>>>>>>>>promise>>>>>>>', promise);
      promise
        .then((response) => {
          this.vendors = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
        })
        .catch((error) => {
          console.log(error);
        });

      const paymentModePromise = axios.get(
        path.PAYMENTMODE_SEARCH,
        this.headers
      );
      console.log('>>>>>>>>paymentModePromise>>>>>>>', paymentModePromise);
      paymentModePromise
        .then((response) => {
          this.paymentModes = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          console.log('paymentModes>>>>>>>>>', this.paymentModes);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  },
  unmounted() {},
  updated() {
    console.log('>>>>>>>>>>>update>>>>>>');
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
