import $http from '../request';
import Base from '../base';

class receivePosApi extends Base {

    // 获取下级地址数据
    getAddressData(data) {
        return $http.post('/v1/personCenter/address/getAdressChildrenList', data);
    }

    // 订单录入
    addOrder(data) {
        return $http.post('/v2/pos/index', data);
    }

    // 商品详情
    getGoodDetail(data) {
        return $http.post('/v2/pos/call', data);
    }

    // 订单列表
    getOrderList(data) {
        return $http.post('/v2/pos/query', data);
    }

    // 去支付跳转支付宝
    payByAlipayHttp(data) {
        return $http.post('/v2/pos/getPayString', data);
    }
}

export default new receivePosApi();
