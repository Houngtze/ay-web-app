import $http from '../request';
import Base from '../base';
import {base, credit} from '../api';

class SourceApi extends Base {
  base = base
  credit = credit
  // 下发短信
  sendSMSCodetHttp(param = {}) {
    return $http.post('/v1/personCenter/util/sendSMSCode', param);
  }
  // 短信注册 及 登录
  h5smsLogintHttp(param = {}) {
    return $http.post('/v1/personCenter/account/h5smsLogin', param);
  }
  // 授信最后一步绑卡发送短信
  sendMsxfSms(param = {}) {
    return $http.post('/v2/personCenter/accountActive/sendMsxfSms', param);
  }
  // 获取绑卡信息
  getBankInfo(param = {}) {
    return $http.post('/v1/personCenter/bankCard/getBankInfo', param);
  }
  // 获取用户信息
  getUserInfo(data) {
    return $http.post('/v1/personCenter/account/getUserInfo', data);
  }
}

export default new SourceApi();
