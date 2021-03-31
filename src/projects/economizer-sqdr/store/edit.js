import {session} from '@/helpers/storage';

export default {
  namespaced: true,
  state: {
    edit: session.get('address_edit') || null,
  },
  mutations: {
    SET_ADDRESS_EDIT(state, data) {
      state.edit = data;
      session.set('address_edit', data);
    },
    REMOVE_ADDRESS_EDIT(state, data) {
      state.edit = null;
      session.remove('address_edit');
    },
  },
  actions: {
    setAddressEdit(context, data) {
      context.commit('SET_ADDRESS_EDIT', data);
    },
    removeAddressEdit(context, data) {
      context.commit('REMOVE_ADDRESS_EDIT', data);
    },
  },
};
