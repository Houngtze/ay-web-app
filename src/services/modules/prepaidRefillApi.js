import $http from '../request';
import Base from '../base';

class receivePosApi extends Base {

    // 获取充值信息
    getRechargeData(data) {
        return $http.post('/v2/activity/phonequery', data);
    }

    // 查询号码归属地
    getNumberAttribution(data) {
        return $http.post('/v2/activity/call', data);
    }

    // 生成订单
    generateOrder(data) {
        return $http.post('/v2/activity/phonetopup', data);
    }

    // 去支付跳转支付宝
    payByAlipayHttp(data) {
        return $http.post('/v2/phone/getPayString', data);
    }

    // 查询订单列表
    getOrderList(data) {
        return $http.post('/v2/activity/order', data);
    }

    // 查询订单详情
    getOrderDetail(data) {
        return $http.post('/v2/activity/details', data);
    }
}

export default new receivePosApi();
