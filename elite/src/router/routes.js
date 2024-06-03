

import { createRouter, createWebHistory } from 'vue-router';
import HomePage from 'pages/HomePage.vue';
import LoginPage from 'pages/LoginPage.vue';
import DashboardPage from 'pages/DashboardPage.vue';

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
