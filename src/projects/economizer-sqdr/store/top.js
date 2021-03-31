import {session} from '@/helpers/storage';

export default {
  namespaced: true,
  state: {
    topData: session.get('top_data') || null,
  },
  mutations: {
    SET_TOP_DATA(state, data) {
      state.topData = data;
      session.set('top_data', data);
    },
  },
  actions: {
    setTopData(context, data) {
      context.commit('SET_TOP_DATA', data);
    },
  },
};
