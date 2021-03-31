import $http from '../request';
import Base from '../base';
import {credit} from '../api';
import {session} from '@/helpers/storage';
/* eslint-disable no-unused-vars */

// 历史 API 列表，见 activity-xrmx、web-app-world-cup 工程

class statusApi extends Base {
    credit = credit
    // 授信结果查询
    getAmftCreditResult(param = {}) {
      return $http.post('/v2/personCenter/accountActive/getAmftCreditResult', param);
    }
    // 获取广告位
    toGetAdvert(param = {}) {
      return $http.post('/v1/goods/advert/toGetAdvert', param);
    }
    // 需要开户
    isNeedOpen(param = {}) {
      return $http.post('/v2/ers/isNeedOpen', param);
    }
    // E融所开户
    eAccount(param = {}) {
      return $http.post('/v2/ers/account', param);
    }
    // 借款人授权二合一
    repayAuth(param = {}) {
      return $http.post('/v2/ers/repayAuth', param);
    }
    // 用户是否需要授权还款/缴费
    isNeedAuthPay(param = {}) {
      return $http.post('/v2/ers/isNeedAuthPay', param);
    }
    // e融所重置交易密码
    trsPwdReset(param = {}) {
      return $http.post('v2/ers/trsPwdReset', param);
    }
    // ppm是否开户
    getPPMResultHttp(param = {}) {
      return $http.post('/v2/personCenter/accountActive/getPpmStatus', param)
    }
    // 推送跳转界面请求接口
    exchangeJump(param = {}) {
      return $http.post('/v2/ers/exchangeJump', param)
    }
    // 风控审核结果
    riskQueryResult(param = {}) {
      return $http.post('/v2/ers/riskQueryResult', param)
    }
    // 受托支付
    entrustPay(param = {}) {
      return $http.post('/v2/ers/entrustPay', param)
    }
    // 查询标的登录记录
    bindStatus(param = {}) {
      return $http.post('/v2/ers/bindStatus', param)
    }
    /*
    * 桔子分期-业务
    * */
    // 获取支持的银行列表
    getUsableBankList(param = {}) {
      return $http.post('/v1/personCenter/bankCard/getUsableBankList', param);
    }
    // 获取银行卡名称
    getBankName(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/getBankName', param);
    }
    // 获取协议
    getAgreements(param = {}) {
      return $http.post('/v2/personCenter/cashLoan/getAgreements', param);
    }
    // 获取绑卡信息
    getBankInfo(param = {}) {
      return $http.post('/v1/personCenter/bankCard/getBankInfo', param);
    }
    // 添加银行卡
    addCreditBankCard(param = {}) {
      return $http.post('/v2/personCenter/accountActive/addCreditBankCard', param);
    }
    // 判断需要开户
    /*
    * 备注：该接口复用与判断资金方、获取授信信息等
    * */
    isNeedOpen(param = {}) {
      return $http.post('/v2/ers/isNeedOpen', param);
    }
    // 资金方消费绑卡
    fundingbind(param = {}) {
      return $http.post('/v1/personCenter/util/fundingbind', param);
    }
    // 聚有财受托支付
    JYC_EntrustPay(param = {}) {
      return $http.post('/jyc/entrustPay', param);
    }
    // 订单详情
    orderDetail(param = {}) {
      return $http.post('/v1/order/orderDetailNew', param);
    }
    // 补件申请
    patchApply(param = {}) {
      return $http.post('/v2/personCenter/patch/patchApply', param);
    }
    /*
    * 消费/授信补件接口
    * */
    // 查询补件项列表
    querySupplementaryList(param = {}) {
      return $http.post('/v2/RFE/querySupplementaryList', param);
    }
    // 更新补件项状态
    updateSupplementaryStatus(param = {}) {
      return $http.post('/v2/RFE/updateSupplementaryStatus', param);
    }
    // 补件申请
    rfeApply(param = {}) {
      return $http.post('/v2/RFE/rfeApply', param);
    }
    // 获取用户反显信息
    getUserAuthorization(param) {
      return $http.post('/xinyong/getYdrhPersonInfo', param);
    }
    // 提交人行授权信息
    postAuthorizationInfo(param) {
      return $http.post('/xinyong/commitYdrhAuthorize', param);
    }
    // 前端推荐商品列表统计接口
    buryingPoint(param) {
      return $http.post('/v2/user/behavior/buryingPoint', param);
    }
    // 获取实名协议列表
    getBindAgreement(param = {}) {
      return $http.post('/v1/personCenter/util/getAgreement', param);
    }

    /*
    * 个人中心页面
    *
    * */
    assembleThirdUrl(param = {}) {
      return $http.post('/jxh/memberCenter/assembleThirdUrl', param, {
        headers: {token: session.get("token")}
      });
    }
    /*
    * 第三方跳转-用户统计
    * */
  // 统计用户
    UserStatistics(param = {}) {
      return $http.post('/xinyong/stat', param);
    }
    /*
    * 吉享花接口
    * */
  // 吉享花获取银行卡
    JXHgetBank(param = {}) {
      return $http.post('/jxh/bankCard/getBank', param);
    }
    // 吉享花添加银行卡
    JXHaddBank(param = {}) {
      return $http.post('/jxh/bankCard/addBank', param);
    }
    // 吉享花添加银行卡发送验证码
    JXHsendSmsCode(param = {}) {
      return $http.post('/jxh/bankCard/sendSmsCode', param);
    }
    // 吉享花获取个人信息选项
    JXHgetPersonInfoOption(param = {}) {
      return $http.post('/jxh/credit/getPersonInfoOption', param);
    }
    // 吉享花获取授信信息
    JXHgetCreditInfo(param = {}) {
      return $http.post('/jxh/credit/getCreditInfo', param);
    }
    // 提交个人信息
    JXHsubmitPersonInfo(param = {}) {
      return $http.post('/jxh/credit/submitPersonInfo', param);
    }
    // 补充个人信息
    JXHsupplementalPersonInfo(param = {}) {
      return $http.post('/jxh/credit/supplementalPersonInfo', param);
    }
    //吉享花上传图片
    jxhUploadFiles(param = {}) {
      return $http.post('/jxh/personCenter/util/uploadFiles', param);
    }
    //吉享花补传资料
    submitLoanApply(param = {}) {
      return $http.post('/jxh/credit/applyLoans', param);
    }
    //吉享花获取合同列表
    jxhGetContractList(param = {}) {
      return $http.post('/jxh/credit/getContractList', param);
    }
    //信用购合同确认
    jxhComfirmOrder(param = {}) {
      return $http.post('/jxh/credit/comfirmOrder', param);
    }
}

function mockData(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...data,
        $isSuccess: data.result === 'success',
        $message: data.result === 'success' ? data.message : `${data.message} [${data.code}]`,
      });
    }, 200 + (Math.random() * 1300));
  });
}

export default new statusApi()
