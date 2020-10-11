import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import("../views/About.vue")
  },
  {
    path: "/me",
    name: "Main Dashboard",
    component: () =>
      import("../views/MainDash.vue")
  },
  {
    path: "/auth",
    name: "Login or Register",
    component: () => import("../views/Auth.vue")
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
