import {getMapDetail} from '@/helpers/utils';
import {session} from '@/helpers/storage';

export default {
  namespaced: true,
  state: {
    detail: session.get('map-detail') || null, // 授信流程开始时间
  },
  mutations: {
    SET_MAP_DETAIL(state, data) {
      session.set('map-detail', data);
      state.detail = data;
    },
  },
  actions: {
    // 设置授信流程开始时间
    async refreshMapDetail(context) {
      const res = await getMapDetail();
      context.commit('SET_MAP_DETAIL', Object.assign({}, res));
    },
  },
};
