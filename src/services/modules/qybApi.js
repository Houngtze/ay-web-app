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
class QYB extends Base {
  base = base
  credit = credit
  jxhCredit = jxhCredit
  // 权益宝-查询授信步骤
  qybGetApplyStep(param = {}) {
    return $http.post('jxh/qyb/getApplyStep', param);
  }
  // 权益宝-实名认证
  qybRealNameAuthentic(param = {}) {
    return $http.post('jxh/qyb/realNameAuthentic', param);
  }
  // 权益宝-授信上传文件
  qybuUploadCreditFile(param = {}) {
    return $http.post('jxh/qyb/uploadCreditFile', param);
  }
  // 权益宝-提交个人信息
  qybSubmitPersonInfo(param = {}) {
    return $http.post('jxh/qyb/submitPersonInfo', param);
  }
  // 权益宝-获取个人信息
  qybGetPersonInfo(param = {}) {
    return $http.post('/jxh/qyb/getPersonInfo', param);
  }
  // 权益宝-提交借款申请
  qybSubmitLoanApply(param = {}) {
    return $http.post('jxh/qyb/submitLoanApply', param);
  }
  // 批量上传图片
  uploadFiles(param = {}) {
    return $http.post('/v1/personCenter/util/uploadFiles', param);
  }
  // 获取权易宝产品选项
  qybGetQybProOption(param = {}) {
    return $http.post('/jxh/qyb/getQybProOption', param);
  }
  // 提交借款申请
  qybSubmitLoanApply(param = {}) {
    return $http.post('/jxh/qyb/submitLoanApply', param);
  }
  // 查询借款结果
  qybGetLoanResult(param = {}) {
    return $http.post('/jxh/qyb/getLoanResult', param);
  }
}

export default new QYB();
