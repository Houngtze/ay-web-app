import {Toast} from 'mint-ui';

const PREFIX = 'qk-app-'; // 缓存key 的前缀
const SIGN = 'as20181228'; // 缓存字段的签名 防止出现相同key

// 拼接key
function joinKey(key) {
  return `${PREFIX}${key}`;
}

export const session = {
  get(key) {
    const val = sessionStorage.getItem(joinKey(key));
    let res = null;
    // 根据签名判断当前值是否有效
    if (val && JSON.parse(val).sign === SIGN) {
      res = JSON.parse(val).value;
    }
    return res;
  },
  set(key, value) {
    // 合成存储值
    const param = {
      value,
      sign: SIGN,
    };
    try {
      sessionStorage.setItem(joinKey(key), JSON.stringify(param));
    } catch (error) {
      Toast('请关闭无痕模式!');
    }
  },
  remove(key) {
    sessionStorage.removeItem(joinKey(key));
  },
};

export const local = {
  get(key) {
    const val = localStorage.getItem(joinKey(key));
    let res = null;
    if (val && JSON.parse(val).sign === SIGN) {
      res = JSON.parse(val).value;
    }
    return res;
  },
  set(key, value) {
    const param = {
      value,
      sign: SIGN,
    };
    try {
      localStorage.setItem(joinKey(key), JSON.stringify(param));
    } catch (error) {
      Toast('请关闭无痕模式!');
    }
  },
  remove(key) {
    localStorage.removeItem(joinKey(key));
  },
};
