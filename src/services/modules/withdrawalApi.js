import $http from '../request';
import Base from '../base';
import {credit} from '../api';
import {base} from '../api';

class withdrawalApi extends Base {
  //信用提额查询入口
  getCreditIncreaseLimit(param = {}) {
    return $http.post('/xinyong/getCreditIncreaseLimit', param);
  }

  //信用提额查询入口
  commitCreditIncreaseLimit(param = {}) {
    return $http.post('/xinyong/commitCreditIncreaseLimit', param);
  }

  //运营商
  getOperatorStatus(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/getOperatorStatus', param);
  }

  //芝麻分
  getZhimaCreditInfo(param = {}) {
    return $http.post('/xinyong/getZhimaCreditInfo', param);
  }

  // 获取用户反显信息
  getUserAuthorization(param) {
    return $http.post('/xinyong/getYdrhPersonInfo', param);
  }

  // 注册获取验证码
  SendSmsCode(data) {
    return $http.post('/v1/personCenter/util/sendSMSCode', data);
  }

  // 提交人行授权信息
  postAuthorizationInfo(param) {
    return $http.post('/xinyong/commitYdrhAuthorize', param);
  }

  // 是否需要活检和OCR认证
  isNeedFaceOCRVerify(param) {
    return $http.post('/v2/personCenter/accountActive/isNeedFaceOCRVerify', param);
  }
  credit = credit

  base = base
}

export default new withdrawalApi();
