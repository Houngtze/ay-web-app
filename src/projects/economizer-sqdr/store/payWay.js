import {session} from '@/helpers/storage';
import sqdr from '@/services/modules/sqdrApi';

export default {
  namespaced: true,
  state: {
    selectedPayWay: session.get('selected_pay_way') || null,
    payWayList: session.get('pay_way_list') || null,
    editPayWay: session.get('edit_pay_way') || null,
  },
  mutations: {
    SET_SELECTED_PAY_WAY(state, data) {
      state.selectedPayWay = data;
      session.set('selected_pay_way', data);
    },
    SET_PAY_WAY_LIST(state, data) {
      state.payWayList = data;
      session.set('pay_way_list', data);
    },
    SET_EDIT_PAY_WAY(state, data) {
      state.editPayWay = data;
      session.set('edit_pay_way', data);
    },
  },
  actions: {
    setSelectedPayWay(context, data) {
      context.commit('SET_SELECTED_PAY_WAY', data);
    },
    async setPayWayList(context, data) {
      let eps = await sqdr.socialAccountHttp(data);
      context.commit('SET_PAY_WAY_LIST', eps.data);
    },
    setEditPayWay(context, data) {
      context.commit('SET_EDIT_PAY_WAY', data);
    },
  },
};
