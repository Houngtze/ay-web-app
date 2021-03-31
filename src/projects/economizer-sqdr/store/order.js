import {session} from '@/helpers/storage';

export default {
  namespaced: true,
  state: {
    goodsDetail: session.get('goods_detail') || null,
    activityRule: session.get('activity_rule') || null,
  },
  mutations: {
    SET_GOODS_DETAIL(state, data) {
      state.goodsDetail = data;
      session.set('goods_detail', data);
    },
    REMOVE_GOODS_DETAIL(state, data) {
      session.remove('goods_detail', data);
    },
    SET_ACTIVITY_RULE(state, data) {
      state.activityRule = data;
      session.set('activity_rule', data);
    },
  },
  actions: {
    clearGoodsDetail(context, data) {
      context.commit('REMOVE_GOODS_DETAIL', data);
    },
    setGoodsDetail(context, data) {
      context.commit('SET_GOODS_DETAIL', data);
    },
    setActivityRule(context, data) {
      context.commit('SET_ACTIVITY_RULE', data);
    },
  },
};
