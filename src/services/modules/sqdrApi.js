import $http from '../request';
import Base from '../base';
import {credit} from '../api';
import {base} from '../api';

// function mockData() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(require('./mock.json'));
//     }, 200 + (Math.random() * 1300));
//   });
// }

class Sqdr extends Base {
  /*
 * 省钱达人业务接口
 * */
  // 订单列表查询
  getOrderList(param) {
    return $http.post('/v2/activity/groupon/queryActivityOrders', param);
  }

  // 查询活动列表
  getActivityList(param) {
    return $http.post('/v2/activity/groupon/queryActivityList', param);
  }

  // 查询活动详情
  getActivityDetail(param) {
    return $http.post('/v2/activity/groupon/queryActivityDetail', param);
  }

  // 查询抽奖结果
  getLotteryResult(param) {
    return $http.post('/v2/activity/groupon/queryActivityResult', param);
  }

  // 社交账号增删改查
  socialAccountHttp(param) {
    return $http.post('/v2/activity/groupon/socialAccount', param);
  }

  // 读取地址列表
  getAddressHttp(param) {
    return $http.post('/v1/personCenter/address/getAddress', param);
  }
  // 新增收货地址
  addAddressHttp(param) {
    return $http.post('/v1/personCenter/address/addAddress', param);
  }
  // 设置默认收货地址
  setDefaultAddressHttp(param) {
    return $http.post('/v1/personCenter/address/setDefaultAddress', param);
  }
  // 修改收货地址
  updateAddressHttp(param) {
    return $http.post('/v1/personCenter/address/updateAddress', param);
  }
  // 获取下级地址数据
  getAddressData(data) {
    return $http.post('/v1/personCenter/address/getAdressChildrenList', data);
  }
  // 获取活动详情
  getActiveDetailHttp(data) {
    return $http.post('/v2/activity/groupon/queryActivityDetail', data);
  }
  // 去支付保存订单
  saveActivityOrderHttp(data) {
    return $http.post('/v2/activity/groupon/saveActivityOrder', data);
  }
  // 去支付跳转支付宝
  payByAlipayHttp(data) {
    return $http.post('/v2/activity/groupon/payByAlipay', data);
  }
  // 去支付跳转支付宝
  queryScrobarOrderListHttp(data) {
    return $http.post('/v2/activity/groupon/queryScrobarOrderList', data);
  }
  // 查询订单详情
  queryOrderDetailHttp(data) {
    return $http.post('/v2/activity/groupon/queryOrderDetail', data);
  }
  // 保存活动分享记录
  shareHttp(data) {
    return $http.post('/v2/activity/groupon/share', data);
  }
  // 已结束活动列 - 最新揭晓
  queryFinishedActivityListHttp(data) {
    return $http.post('/v2/activity/groupon/queryFinishedActivityList', data);
  }
  // 查看抽奖结果
  queryActivityResultHttp(data) {
    return $http.post('/v2/activity/groupon/queryActivityResult', data);
  }
  // 查询广告列表
  queryAdertisingListHttp(data) {
    return $http.post('/v2/activity/groupon/queryAdvertisingList', data);
  }

}

export default new Sqdr();
