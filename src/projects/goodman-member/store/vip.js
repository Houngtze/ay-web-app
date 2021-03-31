import vipApi from '@/services/modules/vipApi';
import {Toast} from 'mint-ui';
import {session} from '@/helpers/storage';

export default {
  namespaced: true,
  state: {
    vipData: null, // 会员信息
    vipFrom: session.get('vip-from') || ""
  },
  mutations: {
    UPDATE_VIP_DATA(state, data) {
      state.vipData = data;
    },
    SET_VIP_FROM(state, data) {
      session.set('vip-from', data)
      state.vipFrom = data;
    },
  },
  actions: {
    // 会员信息
    updateVipData(context, data) {
      return new Promise(async resolve => {
        const res = await vipApi.getVipHomeData({
          userId: context.rootState.global.userInfo.userId || ""
        })
        if (res.code === 'sc0') {
          context.commit('UPDATE_VIP_DATA', res.data);
          resolve(res.data)
        } else {
          Toast(res.message)
        }
      })
    },
    // 设置会员来源
    setVipFrom(context, data) {
      context.commit('SET_VIP_FROM', data);
    }
  },
};
