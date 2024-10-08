<template>
  <q-page padding>
     <q-card>
          <q-card-section class="pwan-blue text-white">
            <HeaderPage  
                :label="pageName"
                :hint="hint"  
              />
          </q-card-section>
        </q-card>
        <div class="text-center"> 
                <q-spinner v-if="showSpinner" color="primary" size="60px" />
        </div>
    <q-card
      class="card-flex-display" 
    >  
      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.client"
            :options="clients"
            label="Affilate/Client"  
            :dense="dense"
          />
          <q-select
            filled
            bottom-slots
            v-model="formData.country"
            :options="countries"
            label="Select Country"
            :dense="dense" 
            @update:model-value="handleCountryChange"
          />
           <q-select
            filled
            bottom-slots
            v-model="formData.state"
            :options="states"
            label="Select State"
            :dense="dense" 
            @update:model-value="handleStateChange"
          />
           <q-select
            filled
            bottom-slots
            v-model="formData.county"
            :options="counties"
            label="Select County"
            :dense="dense"
          />

           <q-input
            filled
            bottom-slots
            v-model="formData.amount" 
            label="Enter Amount" 
            :dense="dense"
          />  
          <q-card-actions align="center">
          <q-btn
            rounded
            size="md" 
            label="Search"
             icon="search" 
            @click="searchProperties"
           class="pwan-button top-margin full-width"
          /> 
        </q-card-actions>
        </q-form> 
      </q-card-section> 
    </q-card> 
    <div class="scrollable" ref="scrollContainer">
      <div class="content">  
          <q-carousel 
          v-model="slide"
          animated
          infinite
          height="400px" 
          control-type="dots"
          class="my-carousel"
        >
          <q-carousel-slide
            v-for="(image, index) in productImages"
            :key="index"
            :name="index" 
          > 
              <a :href="image.imageFile" target="_blank" download="product_flyer.png" rel="noopener noreferrer">Download Flyer</a>
              <img
                :src="image.imageFile"
                class="carousel-image"
                @load="updateCarouselHeight"
              /> 
              <a :href="image.videoFile" target="_blank" download="product_video.mp4" rel="noopener noreferrer">Download Video</a>
              <q-video
                ref="videoPlayer"
                :src="image.videoFile"
                autoplay
                controls 
                class="my-video"
              /> 
              <a :href="image.subScriptionFile" target="_blank" download="subscription_form.pdf"  rel="noopener noreferrer">Download Subscription Form</a>
          </q-carousel-slide>
        </q-carousel>
       
      </div> 
      </div>
  </q-page>
</template>

<script>
import { ref, computed } from "vue"; 
import { useI18n } from 'vue-i18n'
import HeaderPage from "src/components/HeaderPage.vue"; 
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios"; 
import path from "src/router/urlpath";
import { format } from 'date-fns';
export default {
   components: { 
    HeaderPage, 
  },
  data() {
   
    const { t } = useI18n() 
    const pageName = computed(()=> t('properties.pagename'))
    const hint = computed(()=> t('properties.hint'))
    const showSpinner = ref(false); 
    const headers = SessionStorage.getItem("headers");  
    const userEmail = "";  
    const formData = ref({});

    return {   
      userEmail,
      headers, 
      formData, 
      dense:true,  
      clients:[], 
      states: [],
      counties:[], 
      productImages:[],
      pageName,
      hint,
      showSpinner,
      slide: 0,
    };
  },
  methods: { 
      loadClients() {
      try { 
        const requestParam = {
          params: {
            isAnAffilate: true,
            status : "A",
          },
        };
        axios
          .get(path.CLIENT_SEARCH, requestParam, this.headers)
          .then((response) => {
            console.log("client Response >>>>>>>>>>>>", response.data.data);
            // Assuming the response data is an array of objects with 'value' and 'label' properties
            this.clients = response.data.data.map((option) => ({
              label: option.name,
              value: option.code,
            }));
            console.log("this.clients >>>>>>>>>>>>", this.clients);
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    
    searchProperties() {

      try{
        
        this.productImages = []
         let data = {}

        if(this.formData.client != null){
          data['client'] = this.formData.client.value;
        }
        if(this.formData.country != null){
          data['country'] = this.formData.country.value;
        }
        if(this.formData.state != null){
          data['state'] = this.formData.state.value;
        }
        if(this.formData.county != null){
          data['county'] = this.formData.county.value;
        }
        if(this.formData.amount != null && this.formData.amount > 0){
          data['amount'] = this.formData.amount;
        }
          
        console.log(">>>>>>data>>>>",data)
           axios
          .get(path.PRODUCTDEF_SEARCH, {params: data}, this.headers)
          .then((response) => { 
               const result = response.data.data; 
              result.forEach(element => { 
                this.loadFetchedProductImages(element)
              });  

          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      } 
    }, 

   handleCountryChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: selectedItem.value,
        },
      };
      axios
        .get(path.STATE_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.states = response.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
          console.log("this.state List >>>>>>>>>>>>", this.stateList);
        })
        .catch((error) => {
          console.error("Error fetching options:", error);
        });
    },
    handleStateChange(selectedItem) {
      const requestParams = {
        params: {
          countryCode: this.formData.country.value,
          stateCode: selectedItem.value,
        },
      };
      axios
        .get(path.COUNTY_SEARCH, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          this.counties = response.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
        })
        .catch((error) => {});
    },   
    loadFetchedProductImages(element) { 
      try {
        const requestParams = {
          params: {
            id: element.id, 
          },
        };
         axios
        .get(path.PRODUCTDEF_BYTES, requestParams, this.headers)
        .then((response) => {
          // Assuming the response data is an array of objects with 'value' and 'label' properties
          const result = response.data; 
            if (result.success) {   
              element.imageFile = this.convertByteToImage(result.data.imageByte);  
              element.subScriptionFile = this.convertByteToPfdf(result.data.subscriptionFormByte);  
              element.videoFile = this.convertByteToVideo(result.data.videoByte) 
              console.log("element>>>>>>>>",element)
              this.productImages.push(element) 
            }
         
        })
        .catch((error) => {});
         
      } catch (err) {
        // Handle error
        this.error = 'An error occurred: ' + (err.response?.data?.message || err.message);
      } finally {
        this.loading = false; // Hide loading spinner
      }
    },
   updateCarouselHeight(event) {
      const img = event.target;
      this.carouselHeight = `${img.clientHeight}px`;
    },
     convertByteToImage(byte){ 
      const byteCharacters = atob(byte); // Extract Base64 part
      const byteArrays = [];
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += 512
      ) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: "application/png" }); // Create Blob with MIME type
      // Create Object URL and set as video source
      const imageUrl = URL.createObjectURL(blob); 
      return imageUrl;
    },

    convertByteToPfdf(byte){ 
      const byteCharacters = atob(byte); // Extract Base64 part
      const byteArrays = [];
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += 512
      ) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: "application/pdf" }); // Create Blob with MIME type
      // Create Object URL and set as video source
      const pdfUrl = URL.createObjectURL(blob); 
      return pdfUrl;
    },
    convertByteToVideo(byte){
      const byteCharacters = atob(byte); // Extract Base64 part
      const byteArrays = [];
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += 512
      ) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: "video/mp4" }); // Create Blob with MIME type
      // Create Object URL and set as video source
      const videoFile = URL.createObjectURL(blob);
      return videoFile;
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
    try { 
      this.loadClients();
      axios
      .get(path.COUNTRY_ALL)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.countries = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {});
     
    axios
      .get(path.PRODUCTSTATUS_SEARCH_ALL, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.productStatusList = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });

    axios
      .get(path.DIMENSION_SEARCH_ALL, this.headers)
      .then((response) => {
        // Assuming the response data is an array of objects with 'value' and 'label' properties
        this.dimensions = response.data.map((option) => ({
          label: option.name,
          value: option.code,
        }));
      })
      .catch((error) => {});
    } catch (error) {
      console.error("Error:", error);
    }
  },
  updated() {},
};
</script>

<style scoped>
.my-carousel {
  display: flex;
  justify-content: center; /* Center the carousel */
}

.carousel-image {
  width: 100%; /* Make the image responsive */
  height: auto; /* Maintain aspect ratio */
}
</style>
