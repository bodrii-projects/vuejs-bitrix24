import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/control",
  },


  {
    path: "/main",
    name: "main",
    component: () => import(/* webpackChunkName: "Main" */ "../pages/Main.vue"),
  },
  {
    path: "/control",
    name: "control",
    component: () => import(/* webpackChunkName: "Control" */ "../pages/Control.vue"),
  },

  {
    path: "/settings",
    name: "settings",
    component: () => import(/* webpackChunkName: "Settings" */ "../pages/Settings.vue"),
  },



];

const router = new VueRouter({
  routes,
});

export default router;
