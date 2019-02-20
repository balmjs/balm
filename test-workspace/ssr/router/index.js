import Vue from 'vue';
import Router from 'vue-router';
import Main from '../components/main';
import Test from '../components/test';

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/home',
        name: 'main',
        component: Main,
        alias: '/'
      },
      {
        path: '/test',
        name: 'test',
        component: Test
      }
    ]
  });
}
