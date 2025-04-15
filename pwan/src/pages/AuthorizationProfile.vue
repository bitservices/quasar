<template>
  <q-page padding>
    <q-card
      class="card-flex-display" 
    >  
     <q-card-section>
        <div class="row">
          <div class="col-8 text-h6">Authorization Profile</div> 
        </div>
      </q-card-section>
      <q-card-section>
        <q-form>
          
           <q-select
            filled
            bottom-slots
            v-model="formData.roleCode"
            :options="roleCodes"
            label="Select Role" 
            :dense="dense" 
            @update:model-value="loadMenuitemList"
          /> 
            <q-select
            filled
            bottom-slots
            v-model="menuItems"
            :options="menuItemList"
            label="Select Menu Items" 
            :dense="dense" 
            multiple
            emit-value
            map-options 
            use-input
            input-debounce="300"
            stack-label
            class="q-mb-md"
           /> 
          <ResponseDialog
            v-model="showMessageDialog"
            :cardClass="childRef.cardClass"
            :textClass="childRef.textClass"
            :label="childRef.label"
            :message="childRef.message"
            :buttonClass="childRef.buttonClass"
          />
        </q-form>
      </q-card-section>
      <q-card-section>
        <q-card-actions align="center">
          <q-btn
            rounded
            size="md"
            color="primary"
            label="Submit"
            @click="createAuthorizationProfile"
            v-close-popup
          />
          <q-btn
            label="Reset"
            color="secondary"
            @click="reset"
            size="md"
            rounded
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar';
import axios from 'axios';
import { ref } from 'vue'; 
import path from 'src/router/urlpath'; 
import ResponseDialog from 'src/components/ResponseDialog.vue'; 
export default {
  components: { 
    ResponseDialog,
  }, 
   
  data() {
    const headers = SessionStorage.getItem('headers'); 
    const profile = LocalStorage.getItem('turnelParams');  
    const medium_dialog = ref(false); 
     const childRef = ref({
      label: '',
      message: '',
      textClass: '',
      cardClass: '',
      buttonClass: '',
      data: {},
    });
    const columns = [
      {
        name: 'userName',
        required: false,
        label: 'User',
        align: 'left',
        field: (row) =>
          row.userId.last_name +
          ' ' +
          row.userId.first_name +
          ' ' +
          row.userId.middle_name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: 'Role',
        align: 'left',
        label: 'Role',
        field: (row) => row.roleCode.name, 
        sortable: true,
      }, 
      {
        name: 'organisation',
        align: 'left',
        label: 'Organisation',
        field: (row) => row.organisation.name,
        sortable: true,
      },
       
    ]; 
    const rows = ref([]);
    const selected = ref([]);
    const formData = ref({});  
    return {  
      selected,
      columns,
      rows, 
      headers, 
      formData,
      profile,
      dense:true,  
      medium_dialog,
      childRef,
      roleCodes:[],
      showMessageDialog:false,
      menuItems:[],
      menuItemList:[],

    };
  },
  methods: {
    createAuthorizationProfile(){ 
      const data = {
      client: this.profile.client,
      organisation:this.profile.organisation,
      createdBy:this.profile.email, 
      role : this.formData.roleCode.value,  
      menuItems : this.menuItems,
    }

      try { 
        const promise = axios.post(
          path.PROFILE_CREATE,
          data,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response 
             
            const result = response.data 
            if(result.success){
              this.childRef = {
                message: response.data.message,
                label: 'Success',
                cardClass: 'bg-positive text-white',
                textClass: 'q-pt-none',
                buttonClass: 'bg-white text-teal',
              };
            }else{
                this.childRef = {
                message: result.message,
                label: 'Error',
                cardClass: 'bg-negative text-white error',
                textClass: 'q-pt-none',
                buttonClass: 'bg-white text-teal'
              };
            } 
             this.showMessageDialog = true;
          })
          .catch((error) => { 
               console.log(error)
          });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
    loadMenuitemList(role) {
       console.log(role)
     try { 
      const requestParams = {
        params: {
          client: this.profile.client,
          organisation: this.profile.organisation,
          role:this.formData.roleCode.value,
        },
      }; 
      const profilePromise = axios.get(
        path.PROFILE_DETAIL,
        requestParams,
        this.headers
      );  
      profilePromise
        .then((response) => { 
          this.menuItems = []
           for (let key in response.data.profileItems) {
              this.menuItems.push(response.data.profileItems[key].code); 
            }
           
        })
        .catch((error) => {
          console.log(error);
        }); 
       } catch (error) {
      console.error('Error:', error);
    }

    },
    reset(){ 
           window.location.reload();
    },
     
     showDialog(){
       if (this.selected.length > 0) {
        this.medium_dialog = true;
         const name =this.selected[0].userId.last_name + ' '+this.selected[0].userId.first_name + ' '+this.selected[0].userId.middle_name
          
         this.dialog_message=' Are you Sure you want to Remove Role  '+ this.selected[0].roleCode.name + ' from ' + name
         
      } else {
        this.medium_dialog = false;
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
    console.log('beforeMount'); 
  },
 
 mounted() { 
    try { 
      const requestParams = {
        params: {
          client: this.profile.client,
          organisation: this.profile.organisation,
        },
      };
      const roleCodePromise = axios.get(
        path.ROLE_SEARCH,
        requestParams,
        this.headers
      );  
      roleCodePromise
        .then((response) => {
          this.roleCodes = response.data.data.map((option) => ({
            label: option.name,
            value: option.id,
          }));
        })
        .catch((error) => {
          console.log(error);
        }); 

      
        const menuItemPromise = axios.get(
        path.MENUITEM_SEARCH,  
        this.headers
      );  
      menuItemPromise
        .then((response) => {
          this.menuItemList = response.data.data.map((option) => ({
            label: option.name,
            value: option.code,
          }));
           
        })
        .catch((error) => {
          console.log(error);
        }); 



    } catch (error) {
      console.error('Error:', error);
    }
  },
  updated() {},
};
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 500px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #0c0144
    -webkit-text-fill-color: white

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
  tbody tr:nth-child(even)
</style>
