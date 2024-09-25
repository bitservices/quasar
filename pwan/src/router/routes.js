import { LocalStorage } from "quasar";
import { createRouter, createWebHistory } from "vue-router";

import IndexPage from "pages/IndexPage.vue";
import DashBoardPage from "pages/DashBoardPage.vue";
import SigninPage from "src/pages/SigninPage.vue";
import ApplicationHomePage from "src/pages/ApplicationHomePage.vue"; 

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
        path: "/paymentstatus",
        component: () => import("src/pages/PaymentStatus.vue"),
      },
      {
        path: "/paymentmode",
        component: () => import("src/pages/PaymentMode.vue"),
      },
      {
        path: "/paymenttype",
        component: () => import("src/pages/PaymentType.vue"),
      },
      {
        path: "/productstatus",
        component: () => import("src/pages/ProductStatus.vue"),
      },
      {
        path: "/country",
        component: () => import("src/pages/CountryPage.vue"),
      },
      {
        path: "/state",
        component: () => import("src/pages/StatePage.vue"),
      },
      {
        path: "/county",
        component: () => import("src/pages/CountyPage.vue"),
      },
      {
        path: "/membershiptype",
        component: () => import("src/pages/MemberShipType.vue"),
      },
      {
        path: "/client",
        component: () => import("src/pages/ClientPage.vue"),
      },
      {
        path: "/organisation",
        component: () => import("src/pages/OrganisationPage.vue"),
      },
      {
        path: "/prospect",
        component: () => import("src/pages/ProspectCustomer.vue"),
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
        path: "/sales",
        component: () => import("src/pages/SalesTransactionPage.vue"),
      },
      {
        path: "/producttype",
        component: () => import("src/pages/ProductType.vue"),
      },
      {
        path: "/productdef",
        component: () => import("src/pages/ProductTypeDefinition.vue"),
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
        path: "/salesstatus",
        component: () => import("src/pages/SalesStatus.vue"),
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
      { path: "/register", component: () => import("src/pages/RegisterUser.vue") }, 
      { path: "/forgot-password", component: () => import("src/pages/ForgotPassword.vue") }, 
      { path: "/passwordchange", component: () => import("src/pages/PasswordChange.vue") }, 
      { path: "/registrationcompletion", component: () => import("src/pages/RegistrationCompletion.vue") }, 
      
       

    ],
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
  const isAuthenticated = token["access"];
  console.log("to>>>>", to);
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/home");
  } else {
    next();
  }
});
export default routes;
