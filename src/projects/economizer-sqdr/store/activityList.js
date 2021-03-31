import {session} from '@/helpers/storage';

export default {
  state: {
    activityList: session.get('activity_list') || null,
  },
  mutations: {
    SAVE_ACTIVITY_LIST(state, data) {
      state.activityList = data;
      session.set('activity_list', data);
    },
  },
  actions: {
    save_ActivityList(context,data) {
      context.commit('SAVE_ACTIVITY_LIST',data);
    }
  },
};
