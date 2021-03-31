import sqdr from '@/services/modules/sqdrApi';
import {session} from '@/helpers/storage';

export default {
  namespaced: true,
  state: {
    selectedAddr: session.get('selected_addr') || null,
    addrList: session.get('addr_list') || null,
    editAddr: session.get('edit_addr') || null,
  },
  mutations: {
    SET_SELECTED_ADDR(state, data) {
      state.selectedAddr = data;
      session.set('selected_addr', data);
    },
    SET_ADDR_LIST(state, data) {
      state.addrList = data;
      session.set('addr_list', data);
    },
    SET_EDIT_ADDR(state, data) {
      state.editAddr = data;
      session.set('edit_addr', data);
    },
  },
  actions: {
    set_SelectedAddr(context, data) {
      context.commit('SET_SELECTED_ADDR', data);
    },
    async set_AddrList(context, data) {
      let eps = await sqdr.getAddressHttp(data);
      context.commit('SET_ADDR_LIST', eps.data);
    },
    set_EditAddr(context, data) {
      context.commit('SET_EDIT_ADDR', data);
    },
  },
};
