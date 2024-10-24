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
  <div v-if="showSearchForm">
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
            v-model="formData.minAmount" 
            label="Min Price" 
            type="number"
            step="0.01"
            :dense="dense"
          />  

           <q-input
            filled
            bottom-slots
            v-model="formData.maxAmount" 
            label="Max Price" 
            type="number"
            step="0.01"
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
      <div class="text-center"> 
                <q-spinner v-if="showSpinner" color="primary" size="60px" />
      </div>
    <div class="q-pa-md">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Property Details"
        :rows="rows"
        :columns="columns"
        row-key="id" 
        selection="single" 
        v-model:selected="selected" 
      >  
      </q-table>  
     <q-card
      class="card-flex-display" 
    > 
      <q-card-section>
        <q-card-actions align="center">
          <q-btn
            rounded
            size="md"
            class="pwan-button"
            label="View Details"
            @click="viewDetails" 
          />
          
        </q-card-actions>
      </q-card-section>
    </q-card>
    </div>
  </div>
    <div class="scrollable" ref="scrollContainer" v-else>
      <div class="content">  
          <q-carousel 
          v-model="slide"
          animated
          infinite
          height="400px" 
          control-type="dots" 
        >
          <q-carousel-slide
            v-for="(image, index) in productImages"
            :key="index"
            :name="index" 
          > 
            <div v-if="image.imageUrl">
              <q-card>
                <q-card-section>
                    <img  style="max-width: 100%;  height: auto;" alt="Google Drive Image"
                      :src="image.imageUrl" 
                      @load="updateCarouselHeight"
                    />  
                 <a :href="image.imageUrl" target="_blank" download="product_flyer.png" rel="noopener noreferrer">Download Flyer</a>
                 </q-card-section>
              </q-card>
            </div>
             
            <div v-if="image.videoUrl">
              <q-card>
                <q-card-section> 
                 <iframe  
                    style="max-width: 100%;  height: auto;"
                    :src="image.videoUrl"
                    frameborder="0"
                    allowfullscreen
                    >
                  </iframe>
                   <a :href="image.videoUrl" target="_blank" download="video.mp4" rel="noopener noreferrer">Download Video</a> 
                   </q-card-section>
              </q-card>
                </div>  
              <div v-if="image.subscriptionFormUrl">
                <q-card>
                <q-card-section>
                <a :href="image.subscriptionFormUrl" target="_blank" download="subscription_form.pdf"  rel="noopener noreferrer">Download Subscription Form</a>
                </q-card-section>
              </q-card>
              </div>
          </q-carousel-slide>
        </q-carousel>  
        <q-card
      class="card-flex-display" 
    > 
      <q-card-section>
        <q-card-actions align="center">
          <q-btn
            rounded
            size="md"
            color="primary"
            label="Close"
            @click="showSearchForm=true"
            v-close-popup
          />
          
        </q-card-actions>
      </q-card-section>
    </q-card>
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
import ResponseDialog from "src/components/ResponseDialog.vue";
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
    const selected = ref([]);
    const showSearchForm = ref(true) 
    const showMessageDialog = ref(false);
    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });
     const columns = [
      {
        name: "name",
        required: false,
        label: "Property/Product Name",
        align: "left",
        field: (row) => row.name,
        format: (val) => `${val}`,
        sortable: true,
      },
       {
        name: "affilate",
        align: "left",
        label: "Affilate",
        field: (row) => row.client.name,
        sortable: true,
      },
      {
        name: "country",
        align: "left",
        label: "Country",
        field: (row) => row.country.name,
        sortable: true,
      },
      {
        name: "state",
        align: "left",
        label: "State",
        field: (row) => row.state.name,
        sortable: true,
      },
      {
        name: "county",
        align: "left",
        label: "County",
        field: (row) => row.county.name,
        sortable: true,
      },
       {
        name: "amount",
        align: "left",
        label: "Amount",
        field: (row) =>   new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(row.amount),
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: (row) => row.productStatus.name,
        sortable: true,
      },
    ];
     const rows = ref([]);

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
      columns,
      rows,
      selected,
      showSearchForm,
      childRef,
      showMessageDialog,
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
         let data = {}
        this.showSpinner = true;
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
        if(this.formData.maxAmount != null && this.formData.maxAmount > 0){
          data['maxAmount'] = this.formData.maxAmount;
        }
         if(this.formData.minAmount != null && this.formData.minAmount > 0){
          data['minAmount'] = this.formData.minAmount;
        }
        
         axios
          .get(path.PRODUCTDEF_SEARCH, {params: data}, this.headers)
          .then((response) => { 
               const result = response.data.data; 
               console.log(">>>>>>>>>result>>>>>>>",result)
                this.rows = result; 
                this.showSpinner = false

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
          
   updateCarouselHeight(event) {
      const img = event.target;
      this.carouselHeight = `${img.clientHeight}px`;
    },
    viewDetails(){ 
     if (this.selected.length > 0) {   
        this.showSpinner = true;
       this.productImages = []  
       console.log(">>>>>>>>this.selected>>>>>>>",this.selected[0])
        this.productImages.push(this.selected[0])  
      } else { 
       
          this.childRef = {
              message: "No Record is Selected, Please select a record.",
              label: "Error",
              cardClass: "bg-negative text-white error",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            }; 
      }
      this.showSpinner = false; 
            this.showMessageDialog = false;
            this.showSearchForm = false;

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

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
}
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>


