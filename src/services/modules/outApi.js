import $http from '../request';
import Base from '../base';
import {base, credit} from '../api';

class Xjd extends Base {
  // 运营商授权 及 聚有财开户查询
  base = base
  credit = credit
}

export default new Xjd();
