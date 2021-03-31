import $http from '../request';
import Base from '../base';
import {credit} from '../api';
import {base} from '../api';

class creditApi extends Base {
    //信用认证查询入口
    getCreditRelated(param = {}) {
        return $http.post('/xinyong/getCreditRelated', param);
    }

    //运营商
    getOperatorStatus(param = {}) {
        return $http.post('/v2/personCenter/cashLoan/getOperatorStatus', param);
    }

    //芝麻分
    getZhimaCreditInfo(param = {}) {
        return $http.post('/xinyong/getZhimaCreditInfo', param);
    }

    //添加/更新用户中心基础信息
    addBasisInformation(param = {}) {
        return $http.post('/v2/personCenter/accountActive/addBasisInformation', param);
    }

    // 获取用户反显信息
    getUserAuthorization(param) {
        return $http.post('/xinyong/getYdrhPersonInfo', param);
    }

    // 提交人行授权信息
    postAuthorizationInfo(param) {
        return $http.post('/xinyong/commitYdrhAuthorize', param);
    }

    credit = credit

    base = base
}

export default new creditApi();
