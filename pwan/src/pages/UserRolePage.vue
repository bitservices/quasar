<template>
  <q-page padding>
    <q-card
      class="card-flex-display" 
    > 
       <q-card-section>
        <div class="row">
          <div class="col-8 text-h6">User Role</div>
          <div v-if="imageFile" class="col-4" style="display: flex; justify-content: flex-end">
                  <img :src="imageFile" alt="Preview" style="max-width: 100px" width="150px"  height="100px" />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form>
          <q-select
            filled
            bottom-slots
            v-model="formData.userId"
            :options="orgUsers"
            label="Select Member" 
            @update:model-value="loadUserRoles"
            :dense="dense"
          />
           
           <q-select
            filled
            bottom-slots
            v-model="formData.roleCode"
            :options="roleCodes"
            label="Select Role" 
            :dense="dense"
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
            label="Add Role"
            @click="createRole"
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
    <div class="q-pa-md" v-if="rows">
      <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="User Role"
        :rows="rows"
        :columns="columns"
        row-key="id"
        selection="single" 
        v-model:selected="selected"
      >
        <template v-slot:top>
          <q-label>User Role</q-label>
          <q-space />
          <q-btn 
            rounded
            color="red" 
            icon="delete" size="sm" 
            @click="showDialog"
          >
            <q-dialog v-model="medium_dialog">
              <q-card style="width: 700px" class="bg-info text-white">
                <q-card-section>
                  <div class="text-h6">User Role Removal</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  {{dialog_message}}
                </q-card-section>
                <q-card-actions align="center" class="bg-white text-teal">
                   <q-btn
                    @click="removeRole"
                    flat
                    label="Yes"
                    class="bg-secondary text-white"
                    v-close-popup
                    rounded 
                  /> 
                  <q-btn
                    flat
                    label="No"
                    class="bg-primary text-white"
                    v-close-popup
                    rounded
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-btn> 
        </template> 
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, SessionStorage } from "quasar";
import axios from "axios";
import { ref } from "vue"; 
import path from "src/router/urlpath"; 
import ResponseDialog from "src/components/ResponseDialog.vue"; 
export default {
  components: { 
    ResponseDialog,
  }, 
   
  data() {
    const headers = SessionStorage.getItem("headers"); 
    const profile = LocalStorage.getItem("turnelParams");  
    const medium_dialog = ref(false); 
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
        name: "userName",
        required: false,
        label: "User",
        align: "left",
        field: (row) =>
          row.userId.last_name +
          " " +
          row.userId.first_name +
          " " +
          row.userId.middle_name,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "Role",
        align: "left",
        label: "Role",
        field: (row) => row.roleCode.name, 
        sortable: true,
      }, 
      {
        name: "organisation",
        align: "left",
        label: "Organisation",
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
      orgUsers:[], 
      roleCodes:[], 
      paymentTypes:[],
      imageFile:null,
      medium_dialog,
      childRef,
      showMessageDialog:false,
    };
  },
  methods: {
     
    loadUserRoles(obj) {
      console.log("obj>>>>>>",obj)
          this.loadUserImage(obj)
         const requestParams = {
          params: { 
            client: this.profile.client,
            organisation: this.profile.organisation,
            userId:obj.value
          },
        };
        

      try {
        console.log(">>>>>requestParam 11111111111s>>>>>>>>",requestParams)
        const promise = axios.get(
          path.USERROLE_SEARCH,
          requestParams,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log("response data>>>>>>>", response.data);
            this.rows = response.data.data;  
            this.selected = [];
          })
          .catch((error) => {
             
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },

    reset(){ 
           window.location.reload();
    },
     loadUserImage(userObj){
      console.log(">>>>>>>inside loadUserImage>>>>>>>>>")
       const requestParam = {
        params: {
          userId: userObj.value, 
        },
      };  
      const promise =  axios.get(
          path.USER_IMAGE,
          requestParam,
          this.headers
        );  
         promise
          .then((response) => {
 
            this.imageFile = "data:image/jpeg;base64," + response.data.data.imageByte;
          })
          .catch((error) => {
            console.log(error);
          }); 
    },
     showDialog(){
       if (this.selected.length > 0) {
        this.medium_dialog = true;
         const name =this.selected[0].userId.last_name + " "+this.selected[0].userId.first_name + " "+this.selected[0].userId.middle_name
          
         this.dialog_message=" Are you Sure you want to Remove Role  "+ this.selected[0].roleCode.name + " from " + name
         
      } else {
        this.medium_dialog = false;
      } 
    }, 
    removeRole(){
        const data = {
            id: this.selected[0].id, 
        };
      try {
        const promise = axios.post(
          path.USERROLE_REMOVE,
          data,
          this.headers
        ); 
        console.log(">>>>>>promise>>>>>>>>>>",promise)
        promise
          .then((response) => {  
            
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>response 1111>>>>>>>>>",response.data)
            const result = response.data 
            
             console.log(">>>>>>>>>>>>>>>>>>>>>>>>result success>>>>>>>>>",result.success)
            if(result.success){
              this.childRef = {
                message: result.message,
                label: "Success",
                cardClass: "bg-positive text-white",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal",
              };
              this.loadUserRoles(this.formData.userId)  
            }else{
                  this.childRef = {
                  message: result.message,
                  label: "Error",
                  cardClass: "bg-negative text-white error",
                  textClass: "q-pt-none",
                  buttonClass: "bg-white text-teal"
                };

            }
            this.showMessageDialog = true;  
          })
          .catch((error) => { 
              
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    createRole(){  
    const data = {
      client: this.profile.client,
      organisation:this.profile.organisation,
       createdBy:this.profile.email,
        userId:this.formData.userId.value,
        roleCode : this.formData.roleCode.value  
    }

      try { 
        const promise = axios.post(
          path.USERROLE_CREATE,
          data,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response 
            
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>response3333>>>>>>>>>",response.data)
            const result = response.data
             console.log(">>>>>>>>>>>>>>>>>>>>>>>>result success>>>>>>>>>",result.success)
            if(result.success){
              this.childRef = {
                message: response.data.message,
                label: "Success",
                cardClass: "bg-positive text-white",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal",
              };
              this.loadUserRoles(this.formData.userId)
            }else{
                this.childRef = {
                message: result.message,
                label: "Error",
                cardClass: "bg-negative text-white error",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal"
              };
            } 
             this.showMessageDialog = true;
          })
          .catch((error) => { 
              
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
    
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
    console.log(">>>>>>>>>mounted>>>>>>>>>>");
    try {
      console.log(">>>>>>this.profile>>>>>",this.profile)
      const requestParams = {
        params: {
          client: this.profile.client,
          organisation: this.profile.organisation,
        },
      };
      const promise = axios.get(
        path.ORGUSER_SEARCH,
        requestParams,
        this.headers
      );
      console.log(">>>>>>>>promise>>>>>>>", promise);
      promise
        .then((response) => {
          console.log(">>>>>>>>>>>>response.data.data>>>>>>>>>>>>>>>>",response.data.data)
          this.orgUsers = response.data.data.map((option) => ({
            label: option.userId.last_name +
          " " +
          option.userId.first_name +
          " " +
          option.userId.middle_name,
            value: option.userId.id,
          }));
        })
        .catch((error) => {
          console.log(error);
        });

      const roleCodePromise = axios.get(
        path.ROLE_SEARCH,
        requestParams,
        this.headers
      );
      console.log(">>>>>>>>roleCodePromise>>>>>>>", roleCodePromise);
      roleCodePromise
        .then((response) => {
          this.roleCodes = response.data.data.map((option) => ({
            label: option.name,
            value: option.id,
          }));
          console.log("roleCodes>>>>>>>>>", this.roleCodes);
        })
        .catch((error) => {
          console.log(error);
        }); 

    } catch (error) {
      console.error("Error:", error);
    }
  },
  updated() {},
};
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

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
