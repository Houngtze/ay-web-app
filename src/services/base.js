import $http from './request';

export default class Base {
  // constructor() {
  //   if (new.target === Base) {
  //     throw new Error('本类不能实例化');
  //   }
  // }
  // 注册获取验证码
  SendSmsCode(data) {
    return $http.post('/v1/personCenter/util/sendSMSCode', data);
  }
  // 短信登录
  loginWithSms(data) {
    return $http.post('/v1/personCenter/channel/smsLogin', data);
  }
  // 密码登录
  loginWithPwd(data) {
    return $http.post('/v1/personCenter/channel/pwdLogin', data);
  }
  // 获取用户信息
  getUserInfo(data) {
    return $http.post('/v1/personCenter/account/getUserInfo', data);
  }
  // 吉享花-申请token
  JXHapplyToken(data) {
    return $http.post('/jxh/common/applyToken', data);
  }
  // 吉享花-手机号下发短信
  JXHsendSmsCode(data) {
    return $http.post('/jxh/common/sendSmsCode', data);
  }
  // 吉享花-短信登陆-注册
  JXHsmsLogin(data) {
    return $http.post('/jxh/account/smsLogin', data);
  }
  // 吉享花-密码登陆
  JXHpasswordLogin(data) {
    return $http.post('/jxh/account/passwordLogin', data);
  }
  // 吉享花-获取用户状态
  JXHgetUserStatus(data) {
    return $http.post('/jxh/account/getUserStatus', data);
  }
  // 获取userinfo
  JXHgetBaseInfo(param = {}) {
    return $http.post('/jxh/common/getBaseInfo', param);
  }
  // 请求流量统计
  statisticsRequestTraffic(data) {
    return $http.post('/jxh/speedLoan/statisticsRequestTraffic', data);
  }
  // 查询贷款合作机构列表
  getLoanCooperationOrgan(data) {
    return $http.post('/jxh/common/getLoanCooperationOrgan', data);
  }
  // 信用生活页面配置接口
  getPageConfig(data = {}) {
    return $http.post('/xinyong/index', data);
  }
  // 导流
  getBackflow(param = {}) {
    return $http.post('/xinyong/jump/open/status', param);
  }
  // 页面配置统计
  postStat(param) {
    return $http.post('/xinyong/stat', param);
  }
}
