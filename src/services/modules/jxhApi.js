import $http from '../request';
import Base from '../base';
import {base, credit} from '../api';

function mockData(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 200 + (Math.random() * 1300));
  });
}
const jxhCredit = {
  getCreditStep(param = {}) {
    return $http.post('/jxh/credit/getCreditStep', param);
  },
  // 吉享花授信上传文件
  JXHuploadCreditFile(param = {}) {
    return $http.post('/jxh/credit/uploadCreditFile', param);
  },
  // 吉享花获取支持的银行列表
  JXHgetSupportBankList(param = {}) {
    return $http.post('/jxh/common/getSupportBankList', param);
  },
  // 吉享花获取银行信息
  JXHgetBankInfo(param = {}) {
    return $http.post('/jxh/credit/getBankInfo', param);
  },
  // 吉享花四要素下发短信
  JXHsendBankFourSms(param = {}) {
    return $http.post('/jxh/common/sendBankFourSms', param);
  },
  // 吉享花获取认证配置
  JXHgetThirdAuthConfig(param = {}) {
    return $http.post('/jxh/credit/getThirdAuthConfig', param);
  },
  // 吉享花实名认证
  JXHrealNameAuthentic(param = {}) {
    return $http.post('/jxh/credit/realNameAuthentic', param);
  },
  // 吉享花获取授信信息
  JXHgetCreditInfo(param = {}) {
    return $http.post('/jxh/credit/getCreditInfo', param);
  },
  // 吉享花获取个人信息选项
  JXHgetPersonInfoOption(param = {}) {
    return $http.post('/jxh/credit/getPersonInfoOption', param);
  },
  // 提交个人信息
  JXHsubmitPersonInfo(param = {}) {
    return $http.post('/jxh/credit/submitPersonInfo', param);
  },
  // 查询授信结果
  JXHgetCreditResult(param = {}) {
    return $http.post('/jxh/credit/getCreditResult', param);
  },
  // 上传活检信息
  JXHuploadLivingDetection(param = {}) {
    return $http.post('/jxh/credit/uploadLivingDetection', param);
  },
  // 吉享花获取银行卡
  JXHgetBank(param = {}) {
    return $http.post('/jxh/bankCard/getBank', param);
  },
}
class Jxh extends Base {
  base = base
  credit = credit
  jxhCredit = jxhCredit
  userRFEResultHttp(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/userRFEResult', param);
  }
  // 落地页初始化准入
  admissionHttp(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/jyc/admission', param);
  }
  // 获取金融产品
  queryProductHttp(param = {}) {
    return $http.post('/v2/cashierDesk/loan/queryProduct', param);
  }
  // 礼包金额
  getGiftAmounttHttp(param = {}) {
    return $http.post('/v2/cashloan/getGiftAmount', param);
  }
  // 申请提现
  loanApplyHttp(param = {}, header = {}) {
    return $http.post('/v2/personCenter/cashLoan/jyc/loanApply', param, header);
  }
  // 查询开户信息
  queryAccountInfoHttp(param = {}) {
    return $http.post('/jyc/queryAccountInfo', param);
  }
  // 订单详情
  getOrderDetailHttp(param = {}) {
    return $http.post('/v2/cashierDesk/loan/getOrderDetail', param);
  }
  // 礼包订单列表
  listGiftOrdersHttp(param = {}) {
    return $http.post('/v2/cashloan/listGiftOrders', param);
  }
  // 礼包订单详情
  giftOrderDetailHttp(param = {}) {
    return $http.post('/v2/cashloan/giftOrderDetail', param);
  }
  // 借款初始化
  loanInitHttp(param = {}) {
    return $http.post('/v2/cashierDesk/loan/init', param);
  }
  // 获取支付串
  paymentStringHttp(param = {}) {
    return $http.post('/v2/cashierDesk/loan/paymentString', param);
  }
  // 获取借款记录列表
  queryOrdersListHttp(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/jyc/queryOrdersList', param);
  }
  // 获取借款订单详情
  queryOrderDetailHttp(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/jyc/queryOrderDetail', param);
  }
  // 放款
  withdrawallHttp(param = {}) {
    return $http.post('/jyc/withdrawal', param);
  }
  // 还款计划 - 试算
  trialHttp(param = {}) {
    return $http.post('/v2/cashierDesk/loan/trial', param);
  }
  // 资金方查询
  queryFundingHttp(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/jyc/queryFunding', param);
  }
  // 绑卡下发短信
  bindBankSendCodeHttp(param = {}) {
    return $http.post('/jxh/personCenter/util/sendSMSCode', param);
  }
  // 绑定银行卡 - 包商
  bindBankSubmitHttp(param = {}) {
    return $http.post('/v1/personCenter/util/fundingbind', param);
  }
  // 导流
  getBackflow(param = {}) {
    return $http.post('/xinyong/jump/open/status', param);
  }
  // 确认订单 - 根据支付类型返回支付串等
  confirmPayHttp(param = {}) {
    return $http.post('/v2/cashierDesk/loan/confirmPay', param);
  }
  // 支付成功后 - 资金方查询
  orderFundingStatusHttp(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/jyc/orderFundingStatus', param);
  }
  // 现金贷-E融所开户接口
  ersAccountHttp(param = {}) {
    return $http.post('/v2/ers/account', param);
  }
  // 现金贷-借款人授权二合一
  repayAuthHttp(param = {}) {
    return $http.post('/v2/ers/repayAuth', param);
  }
  // 查询全部待还金额
  queryXjdRemainSumAmtHttp(param = {}) {
    return $http.post('/v1/personCenter/repayment/queryXjdRemainSumAmt', param);
  }
  // 查询账单详情
  queryXjdBillDetailHttp(param = {}) {
    return $http.post('/v1/personCenter/repayment/queryXjdBillDetail', param);
  }
  // 用户近期（时间段内）请求过授权
  userOperatorsAuthCacheHttp(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/userOperatorsAuthCache', param);
  }
  // 授信最后一步绑卡发送短信
  sendMsxfSms(param = {}) {
    return $http.post('/v2/personCenter/accountActive/sendMsxfSms', param);
  }
  // 个人中心申请信用卡
  applyCreditCard(param = {}) {
    return $http.post('/jxh/myLimit/applyCreditCard', param);
  }
  // 获取广告位
  toGetAdvertisement(param = {}) {
    return $http.post('/v1/goods/advert/toGetAdvert', param);
  }
  // 查询额度
  getCreditLimit(param = {}) {
    return $http.post('/jxh/credit/getCreditLimit', param);
  }
  // 获取userinfo
  getBaseInfo(param = {}) {
    return $http.post('/jxh/common/getBaseInfo', param);
  }
  // 添加银行卡
  JxhAddCreditBankCard(param = {}) {
    return $http.post('/jxh/bankCard/addBank', param);
  }
  // 获取银行卡名称
  jxhGetBankName(param = {}) {
    return $http.post('/jxh/bankCard/identifyCard', param);
  }
  // 注册获取验证码
  jxhSendSmsCode(data) {
    return $http.post('/jxh/bankCard/sendSmsCode', data);
  }
  // 查询四要素下发短信日志信息
  getSmsSendLog(data) {
    return $http.post('/jxh/common/getSmsSendLog', data);
  }
  //资方绑卡前可用资方获取
  jxhGetAvailableFundList(param = {}) {
    return $http.post('/jxh/credit/getAvailableFundList', param);
  }
}

export default new Jxh();
