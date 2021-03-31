import $http from '../request';
import Base from '../base';
import {session} from '@/helpers/storage';
/* eslint-disable no-unused-vars */

// 历史 API 列表，见 activity-xrmx、web-app-world-cup 工程

class billApi extends Base {
  // 获取服务器的当前时间
  getServerTime(param = {}) {
    return $http.post('/v1/sc/goods/time/now', param);
  }
  /*
  * 爱花（读秒）业务接口
  * */
  // 授信结果
  getAHPintecFristRepeyment(param) {
    return $http.post('/v2/personCenter/aiHua/getAHPintecFristRepeyment', param);
  }
  // 爱花（读秒）账单
  queryAHPintecRepayments(param) {
    return $http.post('/v2/personCenter/aiHua/queryAHPintecRepayments', param);
  }
  // 爱花（读秒）授信结果
  getPenticActiveStep(param) {
    return $http.post('/v2/personCenter/accountActive/getActiveStep', param);
  }
  // 爱花（读秒）运营商授信结果
  operatorCallback(param) {
    return $http.post('/v1/personCenter/accountActive/operatorCallback', param);
  }
  /*
  * 爱花（加油宝）业务接口
  * */
  // 爱花（加油宝）账单
  queryJYBRepaymentList(param = {}) {
    return $http.post('/v2/personCenter/aiHua/queryJYBRepaymentList', param);
  }
  /*
  * 爱满分业务接口
  * */
  // 爱满分账单
  getBillInfo(param) {
    return $http.post('/v2/personCenter/aiHua/getMoneyMonth', param);
  }
  // 爱满分授信结果
  getMoneyFirstMonth(param) {
    return $http.post('/v2/personCenter/aiHua/getMoneyFirstMonth', param);
  }
  // 吉享花账单
  getJxhBillInfo(param) {
    return $http.post('/jxh/personCenter/aiHua/getMoneyMonth', param);
  }
  // 获取吉享花授信步骤
  getCreditStep(param = {}) {
    return $http.post('/jxh/credit/getCreditStep', param);
  }
  // 吉享花账单
  getJXHOrderInformation(data) {
    return $http.post('/jxh/personCenter/myPayment/getJXHOrderInformation', data);
  }
}

function mockData(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...data,
        $isSuccess: data.result === 'success',
        $message: data.result === 'success' ? data.message : `${data.message} [${data.code}]`,
      });
    }, 200 + (Math.random() * 1300));
  });
}

export default new billApi()
