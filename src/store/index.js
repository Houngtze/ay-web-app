import Vue from 'vue';
import Vuex from 'vuex';
import global from './global';
import map from './map';

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {},
  modules: {
    global,
    map
  },
};
