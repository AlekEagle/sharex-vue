import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/me/",
    name: "Main Dashboard",
    component: () =>
      import("../views/MainDash.vue")
  },
  {
    path: "/auth/",
    name: "Login or Register",
    component: () => import("../views/Auth.vue")
  },
  {
    path: "/me/files/",
    name: "Your Files",
    component: () => import("../views/Files.vue")
  },
  {
    path: "/me/edit/",
    name: "Edit your profile",
    component: () => import("../views/Edit.vue")
  },
  {
    path: '/set-up/',
    name: 'Get Setup',
    component: () => import('../views/Setup.vue')
  },
  {
    path: '/set-up/:name/',
    name: 'Service Setup',
    component: () => import('../views/SetupService.vue')
  },
  {
    path: '/me/file/:file/',
    name: 'File Info',
    component: () => import('../views/FileInfo.vue')
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Error",
    component: () => import("../views/NotFound.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
