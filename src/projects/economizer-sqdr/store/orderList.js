import {session} from '@/helpers/storage';
import sqdr from '@/services/modules/sqdrApi';

export default {
  state: {
    orderList: session.get('order_list') || null,
    orderDetail: session.get('order_detail') || null,
  },
  mutations: {
    SAVE_ORDER_LIST(state, data) {
      state.orderList = data;
      session.set('order_list', data);
    },
    SET_ORDER_DETAIL(state, data) {
      state.orderDetail = data;
      session.set('order_detail', data);
    },
  },
  actions: {
    async save_OrderList(context, data) {
      const res = await sqdr.getOrderList(data);
      if (res.code === '0') {
        if (res.data) {
          context.commit('SAVE_ORDER_LIST', res.data.list);
        } else {
          context.commit('SAVE_ORDER_LIST', []);
        }
      }
    },
    setOrderDetail(context, data) {
      context.commit('SET_ORDER_DETAIL', data);
    }
  },
};
