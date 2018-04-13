import Vue from 'vue';
import VueRouter from 'vue-router';
// import VueMeta from 'vue-meta';
import baseRoutes from './base';
import userRoutes from './user';

Vue.use(VueRouter);
// Vue.use(VueMeta);

let routes = baseRoutes.concat(userRoutes);

const router = new VueRouter({
  mode: 'history',
  fallback: false,
  scrollBehavior: () => ({ y: 0 }),
  routes
});

export function createRouter() {
  return router;
}
