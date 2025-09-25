import { LocalStorage } from "quasar";
import { createRouter, createWebHistory } from "vue-router";

import SigninPage from "src/pages/SigninPage.vue";

const routes = [
  {
    path: "/home",
    name: "HomePage",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "ApplicationHomePage",
        component: () => import("src/pages/ApplicationHomePage.vue"),
      },
      {
        path: "/dashboard",
        component: () => import("src/pages/DashBoardPage.vue"),
      },
      { path: "/status", component: () => import("src/pages/StatusPage.vue") },
      { path: "/gender", component: () => import("src/pages/GenderPage.vue") },
      { path: "/banks", component: () => import("src/pages/BankPage.vue") },
      {
        path: "/maritalstatus",
        component: () => import("src/pages/MaritalStatus.vue"),
      },
      {
        path: "/occupation",
        component: () => import("src/pages/Occupation.vue"),
      },
      {
        path: "/relationshiptype",
        component: () => import("src/pages/RelationshipType.vue"),
      },

      {
        path: "/paymenttype",
        component: () => import("src/pages/PaymentType.vue"),
      },

      {
        path: "/country",
        component: () => import("src/pages/CountryPage.vue"),
      },
      {
        path: "/membershiptype",
        component: () => import("src/pages/MemberShipType.vue"),
      },

      {
        path: "/prospect",
        component: () => import("src/pages/ProspectCustomer.vue"),
      },
      {
        path: "/leads",
        component: () => import("src/pages/LeadsPage.vue"),
      },

      {
        path: "/investor",
        component: () => import("src/pages/investorPage.vue"),
      },
      {
        path: "/menu",
        component: () => import("src/pages/MenuPage.vue"),
      },
      {
        path: "/turnel",
        component: () => import("src/pages/TurnelPage.vue"),
      },
      {
        path: "/menuitem",
        component: () => import("src/pages/MenuItemPage.vue"),
      },

      {
        path: "/pendingsubscription",
        component: () => import("src/pages/PendingSubscription.vue"),
      },

      {
        path: "/paymentdef",
        component: () => import("src/pages/PaymentTypeDefinition.vue"),
      },
      {
        path: "/dimension",
        component: () => import("src/pages/DimensionPage.vue"),
      },

      {
        path: "/usercontact",
        component: () => import("src/pages/UserContactInfo.vue"),
      },
      {
        path: "/productcontact",
        component: () => import("src/pages/ProductContact.vue"),
      },
      {
        path: "/prospecttype",
        component: () => import("src/pages/ProspectTypePage.vue"),
      },
      {
        path: "/userprofile",
        component: () => import("src/pages/UserProfile.vue"),
      },
      {
        path: "/organnualpymt",
        component: () => import("src/pages/OrgAnnualPayments.vue"),
      },
      {
        path: "/useroutstanding",
        component: () => import("src/pages/UserOutstandingPayment.vue"),
      },

      {
        path: "/userpayment",
        component: () => import("src/pages/UserPaymentTransaction.vue"),
      },

      {
        path: "/attendancerpt",
        component: () => import("src/pages/AttendanceReport.vue"),
      },

      {
        path: "/userpaymentrpt",
        component: () => import("src/pages/UserPaymentReport.vue"),
      },
      {
        path: "/incomerpt",
        component: () => import("src/pages/IncomeReport.vue"),
      },

      {
        path: "/outstandingpaymentrpt",
        component: () => import("src/pages/OutstandingPaymentReport.vue"),
      },
      {
        path: "/vendorpaymentrpt",
        component: () => import("src/pages/VendorPaymentReport.vue"),
      },
      {
        path: "/expenserpt",
        component: () => import("src/pages/ExpenseReport.vue"),
      },
      {
        path: "/usercumulativepaymentrpt",
        component: () => import("src/pages/UserCumulativePaymentReport.vue"),
      },
      {
        path: "/vendorledgerpaymentrpt",
        component: () => import("src/pages/VendorCumulativePaymentReport.vue"),
      },
      {
        path: "/selfpaymentrpt",
        component: () => import("src/pages/SelfPaymentReport.vue"),
      },
      {
        path: "/selfvendorrpt",
        component: () => import("src/pages/SelfVendorPaymentReport.vue"),
      },

      {
        path: "/vendor",
        component: () => import("src/pages/VendorPage.vue"),
      },
      {
        path: "/vendorpayment",
        component: () => import("src/pages/VendorPaymentTransaction.vue"),
      },
      {
        path: "/userasignment",
        component: () => import("src/pages/UserAssignment.vue"),
      },
      {
        path: "/orguserrpt",
        component: () => import("src/pages/OrganisationUsersReport.vue"),
      },
      {
        path: "/role",
        component: () => import("src/pages/RolePage.vue"),
      },
      {
        path: "/userrole",
        component: () => import("src/pages/UserRolePage.vue"),
      },
      {
        path: "/profile",
        component: () => import("src/pages/AuthorizationProfile.vue"),
      },

      {
        path: "/attendance",
        component: () => import("src/pages/AttendanceRecord.vue"),
      },

      {
        path: "/selfattendance",
        component: () => import("src/pages/SelfAttendanceRecord.vue"),
      },
      {
        path: "/comsettings",
        component: () => import("src/pages/CommissionSettings.vue"),
      },

      {
        path: "/calculatecommission",
        component: () => import("src/pages/CommissionCalculation.vue"),
      },

      {
        path: "/userqrcode",
        component: () => import("src/pages/UserProfileQrCode.vue"),
      },

      {
        path: "/properties",
        component: () => import("src/pages/PropertiesDetails.vue"),
      },

      {
        path: "/userwebsitesetup",
        component: () => import("src/pages/UserWebsiteSetup.vue"),
      },
      {
        path: "/testimonial",
        component: () => import("src/pages/UserTestimonial.vue"),
      },

      {
        path: "/changepassword",
        component: () => import("src/pages/ChangePassword.vue"),
      },
      {
        path: "/userupload",
        component: () => import("src/pages/UserUpload.vue"),
      },
      {
        path: "/orgprofile",
        component: () => import("src/pages/OrganisationalProfile.vue"),
      },
      {
        path: "/orgupload",
        component: () => import("src/pages/OrganisationUpload.vue"),
      },
      {
        path: "/productupload",
        component: () => import("src/pages/ProductTypeDefinitionUpload.vue"),
      },
      {
        path: "/viewpayments",
        component: () => import("src/pages/PaymentDetails.vue"),
      },
      {
        path: "/paystack",
        component: () => import("src/pages/PaystackPayment.vue"),
      },
      {
        path: "/paymentchannel",
        component: () => import("src/pages/PaymentChannel.vue"),
      },
      {
        path: "/integration",
        component: () => import("src/pages/PaymentIntegration.vue"),
      },
      {
        path: "/selfpayment/:orgCode/:clientCode",
        component: () => import("src/pages/SelfUserPayments.vue"),
      },
      {
        path: "/messagingchannel",
        component: () => import("src/pages/MessagingChannel.vue"),
      },
      {
        path: "/msgintegration",
        component: () => import("src/pages/MessagIntegration.vue"),
      },
      {
        path: "/sendmsg",
        component: () => import("src/pages/SendMessage.vue"),
      },
      {
        path: "/messagetype",
        component: () => import("src/pages/MessageType.vue"),
      },
      {
        path: "/msgingstup",
        component: () => import("src/pages/MessagingSetup.vue"),
      },
      {
        path: "/runbirthdaymessage",
        component: () => import("src/pages/RunBirthdayMessage.vue"),
      },
      {
        path: "/usercreation",
        component: () => import("src/pages/UserCreation.vue"),
      },
      {
        path: "/clientprofile",
        component: () => import("src/pages/ClientProfile.vue"),
      },
      {
        path: "/generalledgerrpt",
        component: () => import("src/pages/GeneralLedgerReport.vue"),
      },

      {
        path: "/dantype",
        component: () => import("src/pages/DynamicAuthType.vue"),
      },
      {
        path: "/userdan",
        component: () => import("src/pages/DynamicAuth.vue"),
      },
      {
        path: "/validatedan",
        component: () => import("src/pages/ValidateDan.vue"),
      },
      {
        path: "/fundingtype",
        component: () => import("src/pages/FundingType.vue"),
      },
      {
        path: "/fundingpayment",
        component: () => import("src/pages/FundingPayment.vue"),
      },
      {
        path: "/outstandingreport",
        component: () => import("src/reports/outstandingreport.vue"),
      },

      {
        path: "/productportfolio",
        component: () => import("src/pages/AffilateProducts.vue"),
      },
      {
        path: "/usermsgintegration",
        component: () => import("src/pages/UserMessagIntegration.vue"),
      },
      {
        path: "/usermessagingchannel",
        component: () => import("src/pages/UserMessagingChannel.vue"),
      },
      {
        path: "/agencywebsite",
        component: () => import("src/pages/WebsiteSetup.vue"),
      },

      {
        path: "/donaionstatus",
        component: () => import("src/pages/DonationStatus.vue"),
      },

      {
        path: "/donationtype",
        component: () => import("src/pages/DonationType.vue"),
      },
      {
        path: "/contactconfigtype",
        component: () => import("src/pages/ContactConfigurationType.vue"),
      },

      {
        path: "/contactconfigsettings",
        component: () => import("src/pages/ContactConfigurationSettings.vue"),
      },
      {
        path: "/donationrpt",
        component: () => import("src/pages/DonationReport.vue"),
      },

      {
        path: "/clientsmtpconfig",
        component: () => import("src/pages/ClientSmtpConfiguration.vue"),
      },
      {
        path: "/runcronejobs",
        component: () => import("src/pages/RunCronJobs.vue"),
      },

      {
        path: "/usermessagingseup",
        component: () => import("src/pages/UserMessagingSetup.vue"),
      },
      {
        path: "/wizard",
        component: () => import("src/pages/WizardDefinition.vue"),
      },
    ],
    meta: {
      requiresAuth: true, // Example of a protected route
    },
  },
  {
    path: "/signin",
    name: "Signin",
    component: SigninPage,
  },

  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/SigninPage.vue") },
      {
        path: "/register",
        component: () => import("src/pages/RegisterUser.vue"),
      },
      {
        path: "/forgot-password",
        component: () => import("src/pages/ForgotPassword.vue"),
      },
      {
        path: "/passwordchange",
        component: () => import("src/pages/PasswordChange.vue"),
      },
      {
        path: "/registrationcompletion",
        component: () => import("src/pages/RegistrationCompletion.vue"),
      },
      {
        path: "/donator",
        component: () => import("src/pages/RegisterDonator.vue"),
      },
    ],
  },
  {
    path: "/client",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/ClientPage.vue") },
      {
        path: "form",
        component: () => import("src/components/ClientFormDialog.vue"),
      },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },

  {
    path: "/productdef",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/ProductTypeDefinition.vue") },
      {
        path: "form",
        component: () =>
          import("src/components/ProductTypeDefinitionFormDialog.vue"),
      },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },

  {
    path: "/organisation",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/OrganisationPage.vue") },
      {
        path: "form",
        component: () => import("src/components/organisationFormDialog.vue"),
      },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },

  {
    path: "/state",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/StatePage.vue") },
      {
        path: "form",
        component: () => import("src/components/StateFormDialog.vue"),
      },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },

  {
    path: "/county",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/CountyPage.vue") },
      {
        path: "form",
        component: () => import("src/components/CountyFormDialog.vue"),
      },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },

  {
    path: "/producttype",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/ProductType.vue") },
      {
        path: "form",
        component: () => import("src/components/ProductTypeFormDialog.vue"),
      },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },

  {
    path: "/salesstatus",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/SalesStatus.vue") },
      {
        path: "form",
        component: () => import("src/components/SalesStatusFormDialog.vue"),
      },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },

  {
    path: "/paymentstatus",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/PaymentStatus.vue") },
      {
        path: "form",
        component: () => import("src/components/PaymentStatusFormDialog.vue"),
      },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },

  {
    path: "/productstatus",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/ProductStatus.vue") },
      {
        path: "form",
        component: () => import("src/components/ProductStatusFormDialog.vue"),
      },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },
  {
    path: "/paymentmode",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/PaymentMode.vue") },
      {
        path: "form",
        component: () => import("src/components/PaymentModeFormDialog.vue"),
      },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },

  {
    path: "/wizardpage",
    component: () => import("layouts/WizardLayout.vue"),
    children: [
      { path: "", component: () => import("pages/WizardStep1.vue") },
      { path: "step1", component: () => import("pages/WizardStep1.vue") },
      { path: "step2", component: () => import("pages/WizardStep2.vue") },
      { path: "step3", component: () => import("pages/WizardStep3.vue") },
    ],
    meta: { requiresAuth: true }, // user must be logged in
  },

  {
    path: "/subscription",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Subscription.vue") },
      {
        path: "form",
        component: () => import("src/components/SubscriptionFormDialog.vue"),
      },
      {
        path: "addamount",
        component: () =>
          import("src/components/SubscriptionAdditionalAmountFormDialog.vue"),
      },
      {
        path: "view",
        component: () => import("src/components/ViewSubscriptionDetails.vue"),
      },
      {
        path: "viewpaymentevidence",
        component: () => import("src/components/PaymentEvidence.vue"),
      },
      {
        path: "getpaymentreceipt",
        component: () => import("src/components/PaymentReceipt.vue"),
      },
    ],
    meta: { keepAlive: true, requiresAuth: true }, // user must be logged in
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Example route guard
router.beforeEach((to, from, next) => {
  const token = LocalStorage.getItem("token");
  const isAuthenticated = token && token.access;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/signin");
  } else {
    next();
  }
});
export default routes;
