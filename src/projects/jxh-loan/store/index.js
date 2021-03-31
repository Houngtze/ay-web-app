import Vue from 'vue';
import Vuex from 'vuex';
import base from './base';
import credit from './credit';

Vue.use(Vuex);

export default {
  modules: {
    base,
    credit
  },
};
