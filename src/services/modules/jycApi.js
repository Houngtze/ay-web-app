import $http from '../request';
import Base from '../base';

class Jyc extends Base {
  credit = {
    //  查询用户激活状态
    getActiveStepHttp(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/getActiveStep', param);
    },
    //  通知授权提交成功
    informFinishHttp(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/informFinish', param);
    },
    //  授信结果查询
    getAudithHttp(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/getAudit', param);
    },
  }
  bank = {
    // 银行卡
    // 查询绑卡信息
    queryBankCardInfoHttp(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/NWD/queryBankCardInfo', param);
    },
    // 跳转至绑卡H5页面接口
    refreshToBindCardURLHttp(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/NWD/refreshToBindCardURL', param);
    },
  }
  loan = {
    // 提现
    // 试算接口
    calculateOrderHttp(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/NWD/calculate', param);
    },
    // 获取借款协议
    getAgreementsHttp(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/NWD/getAgreements', param);
    },
    // 提现申请
    loanApplyHttp(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/NWD/loanApply', param);
    },
    // 查询提现订单
    queryCashLoanHttp(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/NWD/queryCashLoan', param);
    },
  }
}

export default new Jyc();
