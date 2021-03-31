import {session} from '@/helpers/storage';
import {formatDateTime} from '@/helpers/utils';
import {headerConf} from '@/services/request';
import api from '@/services/modules/qybApi';
import {Toast} from 'mint-ui';

export default {
  namespaced: true,
  state: {
    creditStep: session.get('credit-step') || null,
    creditStartTime: session.get('credit-start-time') || null, // 授信流程开始时间
    bankInfo: session.get('credit-bank-info') || null,
    personInfo: session.get('credit-person-info') || null,
    idCardInfo: null,
    loanResult: null,
    product: session.get('product') || null
  },
  mutations: {
    SET_ID_CARD_INFO(state, data) {
      state.idCardInfo = data;
    },
    SETCREDITSTEP(state, data) {
      state.creditStep = data;
    },
    SETBANKINFO(state, data) {
      state.bankInfo = data;
      session.set('credit-bank-info', data);
    },
    SET_PERSON_INFO(state, data) {
      state.personInfo = data;
      session.set('credit-person-info', data);
    },
    SET_CREDIT_START_TIME(state, data) {
      if (!data) {
        session.remove('credit-start-time');
      } else {
        session.set('credit-start-time', data);
      }
      state.creditStartTime = data;
    },
    SET_LOAN_RESULT(state, data) {
      state.loanResult = data;
    },
    SET_PRODUCT(state, data) {
      state.product = data;
      session.set('product', data);
    },
  },
  actions: {
    // 设置授信步骤
    async setCreditStep(context, data) {
      const res = await api.qybGetApplyStep(data);
      if (res.code === "0") {
        context.commit('SETCREDITSTEP', res.data);
      }
    },
    // 设置银行卡信息
    set_bankInfo(context, data) {
      context.commit('SETBANKINFO', data);
    },
    // 设置个人信息
    set_personInfo(context, data) {
      context.commit('SET_PERSON_INFO', data);
    },
    set_idCardInfo(context, data) {
      context.commit('SET_ID_CARD_INFO', data);
    },
    // 设置授信流程开始时间
    setCreditStartTime(context) {
      context.commit('SET_CREDIT_START_TIME', formatDateTime('yyyy-mm-dd hh:mm:ss'));
    },
    // 获取订单状态
    async setLoanResult(context, data) {
      const res = await api.qybGetLoanResult(data);
      if (res.code === "0") {
        context.commit('SET_LOAN_RESULT', res.data.loanResult);
      } else {
        Toast({
          message: res.message
        })
      }
    },
    // 设置产品类型
    setProduct(context, data) {
      context.commit('SET_PRODUCT', data);
    },
  },
};
