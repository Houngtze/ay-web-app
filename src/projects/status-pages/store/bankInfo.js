import {session} from '@/helpers/storage';
export const SET_BANK_INFO = 'SET_BANK_INFO';

export default {
  namespaced: true,
  state: {
    bankInfo: session.get('financing-bank-info') || null, // 银行卡信息
  },
  mutations: {
    [SET_BANK_INFO](state, data) {
      state.bankInfo = data;
      session.set('financing-bank-info', data);
    },
    CLEAR_DATA(state) {
      state.bankInfo = null;
    },
  },
  actions: {
    // 设置银行卡信息
    set_bankInfo(context, data) {
      context.commit('SET_BANK_INFO', data);
    },
    clearData(context) {
      context.commit('CLEAR_DATA');
    },
  },
};
