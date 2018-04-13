import * as types from './mutation-types';
import API from '../api';

const actions = {
  async getMenu({ commit }) {
    console.info('get menu');

    let { data } = await API.base.getMenu();
    let menu = data;

    commit(types.MENUS, menu);
  }
};

export default actions;
