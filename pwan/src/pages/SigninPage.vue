<template>
  <q-page padding class="flex flex-center app-bg">
    <q-card style="width: 400px">
      <q-card-section class="pwan-blue text-white">
        <HeaderPage :label="pageName" :hint="hint" />
      </q-card-section>
      <q-card-section>
        <div>
          <q-form @submit.prevent="handleSubmit" ref="signInForm">
            <div class="text-center">
              <q-spinner v-if="showSpinner" color="primary" size="60px" />
            </div>
            <q-input
              filled
              bottom-slots
              v-model="formData.username"
              label="Email"
              :dense="dense"
              :rules="[emailRule]"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="formData.username = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>

            <q-input
              v-model="formData.password"
              filled
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              :rules="[passwordRule]"
              required
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-btn
              rounded
              class="pwan-button top-margin full-width"
              icon="login"
              label="Login"
              type="submit"
            />
            <div class="row justify-center q-gutter-sm">
              <div class="col-8 col=12 q-pa-md">
                <q-btn
                  label="Login with Google"
                  color="red"
                  @click="loginWithGoogle"
                />
              </div>
              <div class="col-8 col=12 q-pa-md">
                <q-btn
                  label="Login with Yahoo"
                  color="purple"
                  @click="loginWithYahoo"
                />
              </div>
              <div class="col-8 col=12 q-pa-md">
                <q-btn
                  label="Login with Microsoft"
                  color="blue"
                  @click="loginWithMicrosoft"
                />
              </div>
            </div>
          </q-form>
        </div>
        <ResponseDialog
          v-model="showMessageDialog"
          :cardClass="childRef.cardClass"
          :textClass="childRef.textClass"
          :label="childRef.label"
          :message="childRef.message"
          :buttonClass="childRef.buttonClass"
        />
      </q-card-section>

      <q-card-actions>
        <q-btn
          flat
          label="Forgot Password?"
          @click="navigateToForgotPassword"
        />
        <q-btn flat label="Register" @click="navigateToRegister" />
        <q-btn flat label="Register Donator" @click="registerDonator" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { LocalStorage, SessionStorage } from "quasar";
import path from "src/router/urlpath";
import HeaderPage from "src/components/HeaderPage.vue";
import ResponseDialog from "src/components/ResponseDialog.vue";
import { useRouter } from "vue-router";
import { validateEmail, validatePassword } from "src/validation/validation";

export default {
  components: {
    HeaderPage,
    ResponseDialog,
  },
  data() {
    const { t } = useI18n();
    const pageName = computed(() => t("signin.pagename"));
    const hint = computed(() => t("signin.hint"));
    const logonMessage = computed(() => t("signin.invalduser"));
    const emailValidationMsg = computed(() =>
      t("signin.validation.invalidemail")
    );
    const passValidationMsg = computed(() =>
      t("signin.validation.passwordrequired")
    );

    const router = useRouter();
    const formData = ref({
      username: "",
      password: "",
    });
    const showMessageDialog = ref(false);
    const childRef = ref({
      label: "",
      message: "",
      textClass: "",
      cardClass: "",
      buttonClass: "",
      data: {},
    });

    return {
      isPwd: ref(true),
      formData,
      dense: false,
      pageName,
      hint,
      showSpinner: false,
      router,
      showMessageDialog,
      childRef,
      logonMessage,
      emailValidationMsg,
      passValidationMsg,
      emailRule: (value) => validateEmail(value),
      passwordRule: (value) => validatePassword(value),
    };
  },
  methods: {
    handleSubmit() {
      console.log(">>>>>>>>>handle submit button >>>>>>>>>");

      if (this.$refs.signInForm.validate()) {
        this.showSpinner = true;
        try {
          const requestParam = {
            params: {
              email: this.formData.username,
            },
          };
          console.log(
            ">>>>>>path.FIND_USER_BY_EMAIL>>>>>>>>>>>",
            path.FIND_USER_BY_EMAIL
          );
          const userPromise = axios.get(path.FIND_USER_BY_EMAIL, requestParam);
          userPromise.then((response) => {
            console.log(">>>>>>>>.response >>>>>>>>>>>>>>>", response);
            if (response.data.success) {
              console.log(">>>>> singin response response>>>>>>>>>>", response);
              LocalStorage.set("userEmail", this.formData.username);
              LocalStorage.set("issupperUser", response.data.issupperuser);
              const userData = response.data.data;
              if (
                (userData.last_name == null ||
                  userData.last_name.trim() == "") &&
                (userData.first_name == null ||
                  userData.first_name.trim() == "")
              ) {
                console.log("loading userprofile");
                this.router.push({ path: "/userprofile" });
              } else {
                this.authenticateUser();
              }
            } else {
              this.childRef = {
                message: response.data.message,
                label: "Error",
                cardClass: "bg-negative text-white error",
                textClass: "q-pt-none",
                buttonClass: "bg-white text-teal",
              };
              this.showSpinner = false;
              this.showMessageDialog = true;
            }
          });
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      }
    },
    navigateToForgotPassword() {
      this.router.push({ path: "/forgot-password" }); // Route to the Forgot Password page
    },

    navigateToRegister() {
      console.log("Navigate to Register Page");
      this.router.push({ path: "/register" });
    },

    registerDonator() {
      console.log("Navigate to Register Donator");
      this.router.push({ path: "/donator" });
    },

    authenticateUser() {
      try {
        console.log(
          ">>>>>>>indide authenticate user password and email >>>",
          this.formData.password,
          this.formData.username
        );
        const promise = axios.post(
          path.USER_AUTHENTICATEE,

          { username: this.formData.username, password: this.formData.password }
        );
        promise
          .then((response) => {
            // Extract data from the respons
            const authenticated = response.data["access"];
            console.log(">>>>>>>response.data>>>>>>>>", response.data);
            LocalStorage.set("token", response.data);
            const headers = {
              Authorization: "Bearer " + response.data["access"],
            };
            console.log(">>>>>>>headers>>>>>>>>", headers);
            SessionStorage.set("headers", { headers: headers });
            if (authenticated) {
              // Redirect to the homepage or intended route
              const pagestack = ["/dashboard"];
              LocalStorage.set("pagestack", pagestack);
              this.showSpinner = false;
              this.router.push({ path: "/dashboard" });
            }
          })
          .catch((error) => {
            console.log(">>>>error response>>>>>", error.response);
            this.childRef = {
              message: this.logonMessage,
              label: "Error",
              cardClass: "bg-negative text-white error",
              textClass: "q-pt-none",
              buttonClass: "bg-white text-teal",
            };
            this.showSpinner = false;
            this.showMessageDialog = true;
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  },
};
</script>
