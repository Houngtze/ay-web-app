import $http from '../request';
import Base from '../base';

class Wx extends Base {
  wx = {
    //  获取微信js配置
    getWechatConfig(param) {
      return $http.post('v1/airChat/jsConfig', param);
    }
  }
}

export default new Wx();
