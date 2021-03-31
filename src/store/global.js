import {session} from '@/helpers/storage';
import env from '@/helpers/env';
import {headerConf} from '@/services/request';
import api from '../services/api';
import {Toast} from 'mint-ui';
import {local} from "../helpers/storage";

export default {
  namespaced: true,
  state: {
    userInfo: session.get('global-user-info') || {},
    source: session.get('global-source') || null,
    token: session.get('global-token') || null,
    title: session.get('global-title') || null,
    clientCode: session.get('global-clientCode') || null,
    jxhSign: local.get("JXH_SIGN") || null,
  },
  mutations: {
    SETUSERINFO(state, data) {
      // data.idPerson = 134189;
      // data.userId = 29147083;
      if (data.userId) headerConf.userId = data.userId;
      if (data.idPerson) headerConf.idPerson = data.idPerson;
      session.set('global-user-info', data);
      state.userInfo = Object.assign({}, data);
    },
    SETSOURCE(state, data) {
      session.set('global-source', data);
      state.source = data;
    },
    SETTOKEN(state, data) {
      session.set('global-token', data);
      state.token = data;
    },
    SETTITLE(state, data) {
      session.set('global-title', data);
      state.title = data;
    },
    SETCLIENTCODE(state, data) {
      session.set('global-clientCode', data);
      headerConf.clientCode = data;
      state.clientCode = data;
    },
    CLEANUSERINFO(state) {
      session.remove('global-token')
      session.remove('global-user-info')
      state.token =  null
      state.userInfo = {}
    }
  },
  actions: {
    // 设置userInfo
    setUserInfo(context, data) {
      context.commit('SETUSERINFO', data);
    },
    // 设置userId
    setUserId({commit, state}, data) {
      const param = Object.assign({}, state.userInfo);
      param.userId = data;
      commit('SETUSERINFO', param);
    },
    // 设置idPerson
    setIdPerson({commit, state}, data) {
      const param = Object.assign({}, state.userInfo);
      param.idPerson = data;
      commit('SETUSERINFO', param);
    },
    // 更新用户信息
    updateUserInfo(context, data) {
      return new Promise(async (resolve) => {
        data.source = session.get('global-source') || null;
        let res
        if (env.isJXHLink() || env.isJXHAPP()) {
          res = await api.base.JXHgetBaseInfo(data);
        } else {
          res = await api.base.getUserInfo(data);
        }

        if (res.code === 'sc0' || res.code === '0' ) {
          // 更新数据
          headerConf.userId = data.userId;
          headerConf.idPerson = data.idPerson;
          context.commit('SETUSERINFO', res.data);
          resolve('success');
        } else {
          Toast({
            message: res.message,
            position: 'bottom'
          });
        }
      });
    },
    // 设置渠道信息
    setSource(context, data) {
      headerConf.channel = data;
      context.commit('SETSOURCE', data);
    },
    // 设置token信息
    setToken(context, data) {
      headerConf.token = `Authorization: Bearer ${data}`;
      headerConf['x-auth-token'] = data;
      context.commit('SETTOKEN', `Authorization: Bearer ${data}`);
    },
    setTitle(context, data) {
      context.commit('SETTITLE', data);
    },
    setClientCode(context, data) {
      context.commit('SETCLIENTCODE', data);
    },
    // 清除登录信息
    cleanUserInfo(context, data) {
      headerConf.channel = data;
      context.commit('CLEANUSERINFO', data);
    },
  },
  getters: {
    /**
     * 是否登录
     * @return {boolean}
     */
    isLogin(state, getters) {
      const token = session.get('global-token');
      const userId = session.get('global-user-info') ? session.get('global-user-info').userId : null;
      if (env.isApp() || env.isJXHLink()) {
        return userId !== '' && userId !== undefined && userId !== null;
      } else {
        return (token !== '' && token !== undefined && token !== null) || userId;
      }
    },
  }
};
