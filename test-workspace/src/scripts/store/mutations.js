import * as types from './mutation-types';

const mutations = {
  [types.MENUS](state, menu) {
    state.menu = menu;
  }
};

export default mutations;
