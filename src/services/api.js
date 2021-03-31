import $http from './request';

export const base = {
  // 注册获取验证码
  SendSmsCode(data) {
    return $http.post('/v1/personCenter/util/sendSMSCode', data);
  },
  // 短信登录
  loginWithSms(data) {
    return $http.post('/v1/personCenter/channel/smsLogin', data);
  },
  // 密码登录
  loginWithPwd(data) {
    return $http.post('/v1/personCenter/channel/pwdLogin', data);
  },
  // 获取用户信息
  getUserInfo(data) {
    return $http.post('/v1/personCenter/account/getUserInfo', data);
  },
  // 获取吉享花userinfo
  JXHgetBaseInfo(param = {}) {
    return $http.post('/jxh/common/getBaseInfo', param);
  },
  // 获取app市场审核状态 isOpen
  getAppExaminingStatus(param = {}, header = {}) {
    return $http.post('/jxh/common/fnConfigure', param, header);
  }
};

export const credit = {
  // 获取支持的银行列表
  getUsableBankList(param = {}) {
    return $http.post('/v1/personCenter/bankCard/getUsableBankList', param);
  },
  // 获取实名协议列表
  getAgreement(param = {}) {
    return $http.post('/v1/personCenter/util/getAgreement', param);
  },
  // 查询用户激活状态
  getActiveStep(param = {}) {
    return $http.post('/v2/personCenter/accountActive/getAmftActiveStep', param);
  },
  // 终审
  identityAuthentication(param = {}) {
    return $http.post('/v2/personCenter/accountActive/amftLastExamine', param, {version: '23000'});
  },
  // 获取绑卡信息
  getBankInfo(param = {}) {
    return $http.post('/v1/personCenter/bankCard/getBankInfo', param);
  },
  // 获取职业类型
  getVocation(param = {}) {
    return $http.post('/v2/personCenter/accountActive/getAmftVocation', param);
  },
  // 获取省市区的Json数据
  getAddress(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/getAddress', param);
  },
  // 添加个人数据
  addPersonInfo(param = {}) {
    return $http.post('/v2/personCenter/accountActive/commitAmftPersonInfo', param);
  },
  // 获取银行卡名称
  getBankName(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/getBankName', param);
  },
  // 上传文件
  fileUpload(param = {}) {
    return $http.post('/v2/personCenter/accountActive/saveAmftFileUploadInfo', param);
  },
  // 添加银行卡
  addCreditBankCard(param = {}) {
    return $http.post('/v2/personCenter/accountActive/addCreditBankCard', param);
  },
  // 实名认证
  realAuthen(param = {}) {
    return $http.post('/v2/personCenter/accountActive/realAuthen', param);
  },
  // 获取协议
  getAgreements(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/getAgreements', param);
  },
  // 获取身份证信息
  getIdentInfo(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/getIdentInfo', param);
  },
  // 提交身份证信息
  saveAddIdentInfo(param = {}) {
    return $http.post('/v2/personCenter/accountActive/amftFirstExamine', param, {version: '23000'});
  },
  // 获取微众鉴权参数
  getAppAuthentication(param = {}) {
    return $http.post('/v2/personCenter/accountActive/getAppAuthentication', param);
  },
  // 活体结果校验
  livingDetection(param = {}) {
    return $http.post('/v2/personCenter/accountActive/uploadLivingDetection', param);
  },
  // 授信结果查询
  getAmftCreditResult(param = {}) {
    return $http.post('/v2/personCenter/accountActive/getAmftCreditResult', param);
  },
  // 个人信息反显
  getPersonInfo(param = {}) {
    return $http.post('/v2/personCenter/accountActive/queryAmftPersonInfo', param);
  },
  // 控制是否调用公司反查接口
  searchCompanyControler(param) {
    return $http.post('/v1/personCenter/util/fnConfigure', param);
  },
  // 查询公司名字
  searchCompanyName(param = {}) {
    return $http.post('/v2/personCenter/accountActive/searchCompanyName', param);
  },
  // 获取广告位
  toGetAdvert(param = {}) {
    return $http.post('/v1/goods/gg/toGetGg', param);
  },
};


export default {
  base,
  credit,
};

