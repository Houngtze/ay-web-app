import $http from '../request';
import Base from '../base';
import {credit} from '../api';
import {base} from '../api';

class vip extends Base {
  // 会员中心首页
  getVipHomeData(param = {}) {
    return $http.post('/v2/vip/getHomeContent', param);
  }
  // 开通会员卡
  buyHaoRenKa(param = {}) {
    return $http.post('/v2/vip/buyHaoRenKa', param);
  }
  // 支付会员卡
  getPayString(param = {}) {
    return $http.post('/v2/vip/getPayString', param);
  }
  // 获取可以购买VIP卡类型
  getVipList(param = {}) {
    return $http.post('/v2/vip/getVipList', param);
  }
  // 获取会员礼品是否领取
  getVipGiftInfo(param) {
    return $http.post('/v2/vip/getVipGiftInfo', param);
  }
  // 保存地址信息
  fillVipGiftInfo(param) {
    return $http.post('/v2/vip/fillVipGiftInfo', param);
  }
  // 商品列表
  getProductList(data) {
    return $http.post('/v1/sc/goods/search/goodsSearch', data);
  }
  // 会员首页领取优惠券
  vipReceiveCoupon(data) {
    return $http.post('/v2/vip/vipReceiveCoupon', data);
  }
  credit = credit

  base = base
}

export default new vip();
