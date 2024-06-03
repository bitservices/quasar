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
    component:  () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/ApplicationHomePage.vue") },
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
