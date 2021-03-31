import {session} from '@/helpers/storage';
import {formatDateTime} from '@/helpers/utils';
import {headerConf} from '@/services/request';
import api from '@/services/modules/jxhApi';

export default {
  namespaced: true,
  state: {
    creditStep: session.get('credit-step') || null,
    smsVerifySwitch: session.get('credit-sms-switch') || null, // 绑卡短信开关
    creditStartTime: session.get('credit-start-time') || null, // 授信流程开始时间
  },
  mutations: {
    SETCREDITSTEP(state, data) {
      session.set('credit-step', data);
      state.creditStep = data;
    },
    SETBANKINFO(state, data) {
      state.bankInfo = data;
      session.set('credit-bank-info', data);
    },
    SETSMSSWITCH(state, data) {
      state.smsVerifySwitch = data;
      session.set('credit-sms-switch', data);
    },
    SET_CREDIT_START_TIME(state, data) {
      session.set('credit-start-time', data);
      state.creditStartTime = data;
    },
  },
  actions: {
    // 设置授信步骤
    async setCreditStep(context, data) {
      const res = await api.jxhCredit.getCreditStep(data);
      context.commit('SETCREDITSTEP', res.data);
    },
    // 设置银行卡信息
    set_bankInfo(context, data) {
      context.commit('SETBANKINFO', data);
    },
    set_smsswitch(context, data) {
      context.commit('SETSMSSWITCH', data);
    },
    // 设置授信流程开始时间
    setCreditStartTime(context) {
      context.commit('SET_CREDIT_START_TIME', formatDateTime('yyyy-mm-dd hh:mm:ss'));
    },
  },
};
