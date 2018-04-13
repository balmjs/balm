import * as types from '../mutation-types';
import API from '../../api';

const state = {
  users: [],
  currentUser: {}
};

const getters = {
  allUsers(state) {
    return state.users;
  },
  currentUser(state) {
    return Object.assign({}, state.currentUser);
  }
};

const mutations = {
  [types.ALL_USERS](state, users) {
    state.users = users;
  },
  [types.CREATE_USER](state, user) {
    // mock data
    user.id = state.users.length
      ? state.users[state.users.length - 1].id + 1
      : 1;

    state.users.push(user);
  },
  [types.DELETE_USER](state, id) {
    if (state.users.length) {
      let index = state.users.findIndex(user => user.id === +id);
      state.users.splice(index, 1);
    }
  },
  [types.UPDATE_USER](state, user) {
    if (state.users.length) {
      let index = state.users.findIndex(_user => _user.id === +user.id);
      state.users[index] = user;
    }
  },
  [types.ONE_USER](state, id) {
    if (state.users.length) {
      let user = state.users.find(user => user.id === +id);
      state.currentUser = user;
    }
  },
  [types.RESET_USER]() {
    state.currentUser = {};
  }
};

const actions = {
  async getAllUsers({ commit }, params = {}) {
    console.info('all users');

    // TODO
    // API.user.getAll(params);

    // NOTE: For Test
    let { data } = await API.user.getAllUsers();
    let users = data.map(user => {
      return {
        id: user.id,
        name: user.name
      };
    });

    commit(types.ALL_USERS, users);
  },
  addUser({ commit }, formData) {
    let user = Object.assign({}, formData);
    console.info('create user', user);

    // TODO
    // API.user.create(user);

    commit(types.CREATE_USER, user);
  },
  removeUser({ commit }, id) {
    console.info('delete user', id);

    // TODO
    // API.user.delete(id);

    commit(types.DELETE_USER, id);
  },
  editUser({ commit }, formData) {
    let user = Object.assign({}, formData);
    console.info('update user', user);

    // TODO
    // API.user.update(user.id, user);

    commit(types.UPDATE_USER, user);
  },
  getUser({ commit }, id) {
    console.info('one user', id);

    // TODO
    // API.user.getOne(id);

    commit(types.ONE_USER, id);
  },
  resetUser({ commit }) {
    console.info('clear user');

    commit(types.RESET_USER);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
