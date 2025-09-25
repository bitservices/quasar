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
         <q-form @submit.prevent='saveRecord' ref='userTestimonialForm'>
          <div class='text-center'> 
                <q-spinner v-if='showSpinner' color='primary' size='60px' />
            </div> 
          <div >  

          <q-input
            filled
            bottom-slots
            v-model='formData.name'
            label='Client Name'
            :dense='dense'
            :rules='[inputFieldRule]'
          />
          
          <q-input
            filled
            bottom-slots
            v-model='formData.message'
            label='Testimonies'
            type='textarea'
            rows='4'
            maxlength='2000'
            counter
          />
          
            <div v-if='showBytes'>
            <q-card>
              <q-card-section>
              <q-uploader 
                  label='Drag and drop Client Image file or click to select'
                  single 
                  @added='handleImageFilesAdded'
                /> 
              </q-card-section>
            </q-card>
            
          </div>
            
          </div>
          <q-card-actions align='center'>
          <div class='row'>
            <q-btn id='closeBtn'
                  rounded  
                  label='Close'
                  icon='close'
                  v-close-popup
                  class='pwan-blue top-margin full-width'
                />  
            <q-btn
                  :label='actionLabel'
                  rounded
                  type='submit'
                  icon='save' 
                  class='pwan-button top-margin full-width'
                />
          </div>
          </q-card-actions>
        </q-form>
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
import debug from 'src/router/debugger'; 
import HeaderPage from 'src/components/HeaderPage.vue'; 
import { isRequired ,inputFieldRequired} from 'src/validation/validation';

export default {
  components:{
    HeaderPage
  }, 
  name: 'ProductTypeFormDialog',
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
     showBytes: {
      type: Boolean,
      required: true,
    },  
    
  },
  data() {
    const { t } = useI18n() 
    const pageName = computed(()=> t('testimonial.pagename'))
    const hint = computed(()=> t('testimonial.hint'))
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Set the width and height of the dialog to cover the viewport
    const controlWidth = viewportWidth * 0.9; // 90% of the viewport width
    const controlHeight = viewportHeight * 0.9; // 90% of the viewport height
    const dialogWidth = controlWidth + 'px';
    const dialogHeight = controlHeight + 'px'; 
   
    const headers = SessionStorage.getItem('headers');
    const formData = ref({ 
      
      createdBy: '',
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
      headers, 
      dense: true, 
      isReadonly: false,
      imageUrl: null, 
      pageName,
      hint, 
      showSpinner: false,  
      requiredRule: value => isRequired(value), 
      inputFieldRule: value => inputFieldRequired(value),  
      lastUploadedFile: null,
    };
  },
  methods: {
    showTimePopup() {
      this.$refs.timePopup.show();
    },
    hideTimePopup() {
      this.$refs.timePopup.hide();
    },

    saveRecord() {
      const userEmail = LocalStorage.getItem('userEmail');
      //this.onClick(formData.value);
     if (this.$refs.userTestimonialForm.validate()) { 
        this.showSpinner = true;
        let data = this.formData;  
        data.status = 'A';   
        data.userId = userEmail;
        data.createdBy = userEmail;
        console.log('data>>>>',data)
        const requestData = new FormData(); 
        for (let key in data) {  
          requestData.append(key, data[key]);
        } 
        this.$emit('formDataSubmitted', requestData); 
        document.getElementById('closeBtn').click();
        this.showDialog = true; 
         this.showSpinner = false;  
     }
    },
    
    
   
     handleImageFilesAdded(files) { 
        files.forEach(file => {  
          
                console.log('>>>>>>>formData>>>>>>',this.formData)
                const formData = new FormData();
                formData.append('imageFile', file); // 'file' should match the multer field name
                formData.append('id',this.formData.id)
                 formData.append('userId',this.formData.userId.id)
                formData.append('destination',path.UPLOAD_DESINATION) 
                // Use Axios to send the file
                axios.post(path.TESTIMONIAL_UPDATE_IMAGE, formData)
                  .then(response => {
                    console.log('Upload successful:', response.data);
                  })
                  .catch(error => {
                    console.error('Upload error:', error);
                  });
        });
    },
     
  },

  beforeCreate() {
    debug('beforeCreate');
  },
  created() {
    debug('created');
  },
  beforeMount() {
    console.log('before Mount');
  },
  mounted() {  
  
  },
  unmounted() {
    debug('Calling unmounted>>>>>>>>>>'); 

  },
  updated() {
    this.form.label = this.label;
    this.form.width = this.dialogWidth;
    this.form.height = this.dialogHeight;
       
    if (this.action == 'edit' || this.action == 'view') {
      this.isReadonly = true;
      try { 
        const requestParams = {
          params: {
            id: this.searchValue,
          },
        };
        const promise = axios.get(this.urlLink, requestParams,this.headers);
        promise
          .then((response) => {
            // Extract data from the response
            const result = response.data;

            if (result.success) {
              debug('fetched product Type Definition>>>>>>', result.data[0]);
              this.formData = result.data[0];
              
              this.formData.status = {
                value: result.data[0].status.code,
                label: result.data[0].status.name,
              };
              
            }
          })
          .catch((error) => {
            debug(error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    
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
