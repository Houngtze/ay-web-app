import $http from '../request';
import Base from '../base';
import {session} from '@/helpers/storage';
/* eslint-disable no-unused-vars */

// 历史 API 列表，见 activity-xrmx、web-app-world-cup 工程

class dajinApi extends Base {
  // 大金贷预去重
  applyDuplicateCheck(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/jyc/djd/applyDuplicateCheck', param);
  }
  // 大金贷-贷款申请
  dajinApply(param = {}) {
    return $http.post('/v2/personCenter/cashLoan/jyc/djd/apply', param);
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

export default new dajinApi()
