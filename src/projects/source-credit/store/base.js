import {Toast} from 'mint-ui';
import {session} from '@/helpers/storage';
import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    txUsableLimit: session.get('xjd-loan-txUsableLimit') || 5000, // 最大可提现金额
    comfirmLoan: session.get('xjd-loan-comfirmLoan') || null, // 确认订单
    termLoan: session.get('xjd-loan-termLoan') || null, // 确认订单
    openBankInfo: session.get('xjd-loan-openBankInfo') || null, // 开户银行
    canLoan: session.get('xjd-can-loan') || false, // 可借款
    bankInfo: session.get('xjd-bank-info') || null, // 银行卡信息
  },
  mutations: {
    XJD_LOAN_CANLOAN(state, data) {
      state.canLoan = data;
      session.set('xjd-can-loan', data);
    },
    XJD_LOAN_TXUSABLELIMIT(state, data) {
      state.txUsableLimit = data;
      session.set('xjd-loan-txUsableLimit', data);
    },
    XJD_LOAN_COMFIRMLOAN(state, data) {
      state.comfirmLoan = data;
      session.set('xjd-loan-comfirmLoan', data);
    },
    XJD_LOAN_TERMLOAN(state, data) {
      state.termLoan = data;
      session.set('xjd-loan-termLoan', data);
    },
    XJD_LOAN_OPENBANK(state, data) {
      state.openBankInfo = data;
      session.set('xjd-loan-openBankInfo', data);
    },
    XJD_BANK_INFO(state, data) {
      state.bankInfo = data;
      session.set('xjd-bank-info', data);
    },
  },
  actions: {
    // 设置最大可提现金额
    set_txUsableLimit(context, data) {
      context.commit('XJD_LOAN_TXUSABLELIMIT', data);
    },
    // 设置是否准入状态
    set_canLoan(context, data) {
      context.commit('XJD_LOAN_CANLOAN', data);
    },
    // 存储确认订单信息
    set_comfirmLoan(context, data) {
      context.commit('XJD_LOAN_COMFIRMLOAN', data);
    },
    // 存储协议列表
    set_termLoan(context, data) {
      context.commit('XJD_LOAN_TERMLOAN', data);
    },
    // 开户银行卡信息
    set_openBankInfo(context, data) {
      context.commit('XJD_LOAN_OPENBANK', data);
    },
    // 清除数据（提交订单以后）
    clearData(context, data) {
      context.commit('XJD_LOAN_TERMLOAN', null);
      context.commit('XJD_LOAN_COMFIRMLOAN', null);
      context.commit('XJD_LOAN_TXUSABLELIMIT', null);
    },
    // 设置银行卡信息
    set_bankInfo(context, data) {
      context.commit('XJD_BANK_INFO', data);
    },
    // 获取银行卡列表
    async getBankList(context, data) {
      const res = await api.credit.getBankInfo({
        idPerson: data
      });
      if (res.code === '0' || res.code === 'sc0') {
        if (res.data) {
          context.commit('XJD_BANK_INFO', res.data.bankInfoList[0]);
        }
      }
    },
  },
};
