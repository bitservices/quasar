<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card
      class="card-flex-display" 
    >
      <q-card-section>
        <div class="row">
          <div class="col-8 text-h6">Organisation User Assignment </div>
          <div v-if="imageFile" class="col-4" style="display: flex; justify-content: flex-end">
                  <img :src="imageFile" alt="Preview" style="max-width: 100px" width="150px"  height="100px" />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <q-hide 
            v-model="formData.email"
          />
          <q-input
            filled
            bottom-slots
            v-model="formData.userName"
            @keyup="handleInput"
            @keydown.enter="handleEnter"
            placeholder="Search for User/PBO"
            :dense="dense"
          />
          <q-list v-if="showSuggestions && filteredSuggestions.length > 0">
            <q-item
              clickable
              v-for="item in filteredSuggestions"
              :key="item.email"
              @click="selectRecord(item)"
            >
              <q-item-section>{{ item.name }}</q-item-section>
              <q-item-section side>
                <!-- Side content -->
                <q-item-label caption lines="1">
                  <img :src="item.image" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
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
            label="Create"
            class="pwan-button"
            @click="saveRecord"
            size="md"
            rounded 
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
     <div class="q-pa-md">
     <q-table
        class="my-sticky-header-table"
        flat
        bordered
        title="Members"
        :rows="rows"
        :columns="columns"
        row-key="id"
        selection="single" 
        v-model:selected="selected"
      >
        <template v-slot:top>
          <q-label>User Website Setup</q-label>
          <q-space /> 
          <q-btn 
            rounded
            color="blue" 
            icon="edit" size="sm" 
            @click="showDialog"
          >
            <q-dialog v-model="medium_dialog">
              <q-card style="width: 700px" class="bg-info text-white">
                <q-card-section>
                  <div class="text-h6">{{dialog_header}}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  {{dialog_message}}
                </q-card-section>
                <q-card-actions align="center" class="bg-white text-teal">
                   <q-btn v-if="activate"
                    @click="activateUser"
                    flat
                    label="Activate"
                    class="bg-secondary text-white"
                    v-close-popup
                    rounded 
                  />
                   <q-btn v-if="deactivate"
                    @click="deactivateUser"
                    flat
                    label="De-Activate"
                    v-close-popup
                    class="bg-negative text-white"
                    rounded 
                  />
                  <q-btn
                    flat
                    label="Cancle"
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
    </div>
  </q-page>
</template>


<script>
import { LocalStorage, SessionStorage } from "quasar";
import { isReadonly, onUnmounted, ref } from "vue";
import axios from "axios";
import path from "src/router/urlpath";
import debug from "src/router/debugger";
import ResponseDialog from "src/components/ResponseDialog.vue"; 
import { format } from 'date-fns';
 
 
export default {
   
   components: { 
    ResponseDialog,
  }, 
  data() {
    
   
    const userEmail = LocalStorage.getItem("userEmail");
    const headers = SessionStorage.getItem("headers");
    const selected = ref([]);
    const formData = ref({}); 
    const medium_dialog = ref(false);  
    const rows = ref([]);
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
        label: "Name",
        align: "left",
        field: (row) =>
          row.user.last_name +" "+row.user.first_name + " "+row.user.middle_name,
        format: (val) => `${val}`,
        sortable: true,
      }, 
      
       {
        name: "status",
        align: "left",
        label: "Status",
        field: (row) => row.status.name,
        sortable: true,
      },
       {
        name: "refId",
        align: "left",
        label: "Reference Id",
        field: (row) => row.refId,
        sortable: true,
      },
      {
        name: "activationDate",
        align: "left",
        label: "Activation Date",
        field: (row) => format(row.activationDate, 'yyyy-MM-dd'),
        sortable: true,
      }, 
      {
        name: "expirationDate",
        align: "left",
        label: "Expiration Date",
        field: (row) => format(row.expirationDate, 'yyyy-MM-dd'),
        sortable: true,
      }, 
       
    ]; 

    return {
      formData,
      childRef,  
      headers, 
      dense:true, 
      imageFile : null, 
      suggestions: [],
      filteredSuggestions: [],
      showSuggestions: false,
      showMessageDialog:false,
      columns,
      rows, 
      medium_dialog,
      selected,
      deactivate:true,
      activate:false,
      dialog_header:"",
      dialog_message:"",
      userEmail,
    };
  },
  methods: {
    handleInput() {
      if (this.formData.userName === "" || this.formData.userName.length < 4) {
        this.filteredSuggestions = [];
        this.showSuggestions = false;
      } else {
        const filter = {
          params: {
            term: this.formData.userName,
          },
        };
        axios
          .get(path.USER_SEARCH_AUTOCOMPLETER, filter, this.headers)
          .then((response) => {
            
            this.filteredSuggestions = response.data.data.map((option) => ({
              name:
                option.last_name +
                " " +
                option.first_name +
                " " +
                option.middle_name,
              email: option.email,
              id: option.id,

            }));
          })
          .catch((error) => {
            console.error("Error fetching options:", error);
          }); 
        this.showSuggestions = true;
      }
    },
    handleEnter() {
      if (this.filteredSuggestions.length > 0) {
        console.log("this.filteredSuggestions[0]:::::::::",this.filteredSuggestions[0])
        this.selectRecord(this.filteredSuggestions[0]);
      }
    },
    selectRecord(userObj) {
      console.log(">>>>>>>>>>>>value>>>>>>>>",userObj)
      this.formData.userName = userObj.name;
      this.formData.email = userObj.email;
      this.formData.id = userObj.id;
      this.showSuggestions = false;
      this.loadUserImage(userObj)
      // Optionally, emit an event or perform other actions when a suggestion is selected
    },
    loadUserImage(userObj){
       const requestParam = {
        params: {
          userId: userObj.id, 
        },
      };  
      
      console.log(">>>>>>>inside requestParam>>>>>>>>>",requestParam )
      const promise =  axios.get(
          path.USER_IMAGE,
          requestParam,
          this.headers
        );   
         promise
          .then((response) => {
          console.log("response data>>>>>",response.data)
            this.imageFile = "data:image/jpeg;base64," + response.data.data.imageByte;
          })
          .catch((error) => {
            console.log(error);
          }); 
    },
    saveRecord() {       
      console.log(">>>>>>userEmail>>>>>>>",this.userEmail) 
      const data = {
        userId : this.formData.id,
        email : this.userEmail
      } 
      console.log(">>>>>data>>>>>>>>",data)
      try { 
        const promise = axios.post(path.USER_WEBSITE_CREATE, data, this.headers);
        promise
          .then((response) => { 
            console.log(">>>>>>>response>>>>>>>>>>>>>>>",response)
            const result = response.data;  
            if (result.success) {    
               this.childRef = {
              message: response.data.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            this.showMessageDialog = true;
            this.loadUserWebsiteSetup()
            }else{

              this.childRef = {
              message: result.message,
              label: "Error",
              cardClass: "bg-negative text-white error",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal"
            };
            this.showMessageDialog = true;
            }
 
          })
          .catch((error) => {
            debug("Error:", error);
          });
      } catch (error) {
        debug("Error:", error);
      } 
    },
     loadUserWebsiteSetup() { 
      try { 
        const promise = axios.get(
          path.USER_WEBSITE_SEARCH, 
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log("response data>>>>>>>", response.data.data); 
            this.rows = response.data.data;  
            this.selected = [];
          })
          .catch((error) => {
             
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    showDialog(){
       if (this.selected.length > 0) {
        this.medium_dialog = true;
         const name =this.selected[0].userId.last_name + " "+this.selected[0].userId.first_name + " "+this.selected[0].userId.middle_name
         if(this.selected[0].status.code == "A"){
          this.deactivate = true
          this.activate = false
          this.dialog_header="Deactivate User"
         this.dialog_message=" Are you Sure you want to Deactivate "+ name
        }else{
          this.deactivate = false
          this.activate = true
          this.dialog_header="Activate User"
         this.dialog_message=" Are you Sure you want to Activate "+ name
        }
      } else {
        this.medium_dialog = false;
      }

    }, 
    getSelectedString(value){
      console.log(value)
    },
    deactivateUser(){
      console.log("indide deactive method >>>>>>>>", this.selected)
        const data = {
            id: this.selected[0].id, 
        };
      try {
        console.log(">>>>>data>>>>>>>>",data)
        const promise = axios.post(
          path.ORGUSER_DEACTIVATE,
          data,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log("response data>>>>>>>", response.data.data); 
             this.loadUserWebsiteSetup()
             this.childRef = {
              message: response.data.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            this.showMessageDialog = true;
          })
          .catch((error) => { 
              
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
    activateUser(){
      console.log(this.selected)
       console.log("indide deactive method >>>>>>>>", this.selected)
        const data = { 
            id: this.selected[0].id,  
        };
      try {
        console.log(">>>>>requestParams>>>>>>>>",data)
        const promise = axios.post(
          path.ORGUSER_ACTIVATE,
          data,
          this.headers
        ); 
        promise
          .then((response) => {
            // Extract data from the response
            console.log("response data>>>>>>>", response.data); 
             this.loadUserWebsiteSetup()
              this.childRef = {
              message: response.data.message,
              label: "Success",
              cardClass: "bg-positive text-white",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
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
    console.log("before Mount");
  },
  mounted() {
    console.log(">>>>>>>>>mounted>>>>>>>>>>");
    this.loadUserWebsiteSetup()
        
  },
  unmounted() { 
     
  },
  updated() {
    console.log(">>>>>>>>>>>update>>>>>>") 
  },
};
</script>
<style scoped>
.card-flex-display {
  display: flex;
  flex-direction: column;
}
</style>
