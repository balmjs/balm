import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import user from './modules/user';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules: {
      user
    }
  });
}
