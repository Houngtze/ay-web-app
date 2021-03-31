import {Toast} from 'mint-ui';
import './native';


const IS_READY = Symbol('services/NativeBridge#IS_READY');
const IS_ERROR = Symbol('services/NativeBridge#IS_ERROR');
const INIT_TASK = Symbol('services/NativeBridge#INIT_TASK');

// eslint-disable-next-line
const isReady = () => {
  // 此状态准确，存在 window.WebViewJavascriptBridge，确信已 ready
  return !!window.WebViewJavascriptBridge;
};

const callBridgeMethod = (methodName, param, callback) => {
  console.debug('[NB] call: ' + methodName + ', ' + JSON.stringify(param));
  window.dafei.callMethods('shappingmallmessage', methodName, param, function () {
    console.debug('[NB] callback: ' + methodName + ', ' + JSON.stringify(arguments)); // eslint-disable-line prefer-rest-params
    return callback.apply(this, arguments); // eslint-disable-line prefer-rest-params
  });
};


export default class NativeBridge {

  [IS_READY] = false;

  init() {
    // 自行实现，ready 机制
    if (this[IS_READY] || this[IS_ERROR] || this[INIT_TASK]) {
      return;
    }

    this[INIT_TASK] = new Promise((resolve, reject) => {
      if (isReady()) {
        console.debug('[NB] Native Bridge 已就绪');
        resolve();
        return;
      }
      let intervalCount = 0;
      const intervalHandler = setInterval(() => {
        intervalCount++;
        if (isReady()) {
          console.debug('[NB] Native Bridge 已就绪');
          clearInterval(intervalHandler);
          resolve();
        } else if (intervalCount > 10) { // 500ms
          console.debug('[NB] Native Bridge 超时');
          clearInterval(intervalHandler);
          reject();
        }
      }, 50);
    }).then(() => {
      this[IS_READY] = true;
    }, () => {
      this[IS_ERROR] = true;
    }).finally(() => {
      this[INIT_TASK] = undefined;
    });
  }

  ready(callback, onErrorCallback = undefined) {
    if (this[IS_READY]) {
      if (callback) {
        callback();
      }
    } else if (this[IS_ERROR]) {
      if (onErrorCallback) {
        onErrorCallback();
      }
    } else {
      // 利用 promise 实现回调队列
      this[INIT_TASK].then(() => {
        if (callback) {
          callback();
        }
      }, () => {
        if (onErrorCallback) {
          onErrorCallback();
        }
      });
    }
  }

  setShareData({title, desc, imgUrl, link, onSuccess, onCancel, onFailure}) {
    if (!this[IS_READY]) {
      throw new Error('Native Bridge 尚未就绪');
    }
    // 注意，2.0.1 前，分享不支持取消和失败状态，但有基础功能和成功回调
    callBridgeMethod('setRightTopShareHandler', {title, desc, imgUrl, link}, (result) => {
      // result {type: 1|2|3, platform: 'qq'}
      if (result.data.type === 1 || result.data.share === true) {
        if (onSuccess) {
          onSuccess(result.data);
        } else {
          Toast('分享成功');
        }
      } else if (result.data.type === 2) {
        if (onCancel) {
          onCancel(result.data);
        } else {
          Toast('分享取消');
        }
      } else {
        if (onFailure) {
          onCancel(result.data);
        } else {
          Toast('分享失败');
        }
      }
    });
  }

  share({title, desc, imgUrl, link, onSuccess, onCancel, onFailure}) {
    if (!this[IS_READY]) {
      throw new Error('Native Bridge 尚未就绪');
    }
    // 注意，2.0.1 前，分享不支持取消和失败状态，但有基础功能和成功回调
    callBridgeMethod('setShareData', {title, desc, imgUrl, link}, (result) => {
      // result {type: 1|2|3, platform: 'qq'}
      if (result.data.type === 1 || result.data.share === true) {
        if (onSuccess) {
          onSuccess(result.data);
        } else {
          Toast('分享成功');
        }
      } else if (result.data.type === 2) {
        if (onCancel) {
          onCancel(result.data);
        } else {
          Toast('分享取消');
        }
      } else {
        if (onFailure) {
          onCancel(result.data);
        } else {
          Toast('分享失败');
        }
      }
    });
  }

  /**
   * 跳转至原生登录页
   *
   * 原生API行为
   * 登录成功时，回调 UserInfoData；否则，不回调！
   */
  jumpToLogin() {
    return new Promise((resolve) => {
      callBridgeMethod('goLogin', {}, async () => {
        const res = await this.getUserInfo();
        resolve(res);
      });
    });
  }

  /**
   * 获取原生侧的用户信息
   *
   * @typedef {object} UserInfoData
   * @property {number} userId
   * @property {number} personId
   * @property {boolean} isActive
   *
   * @return Promise<UserInfoData>  为登录时，resolve(null)
   */
  getUserInfo() {
    return new Promise((resolve) => {
      callBridgeMethod('getUserInfo', {}, (res) => {
        if (res) {
          resolve(res.data);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * 跳到商详
   * @params {string} skuCode
   */
  jumpToDetail(skuCode) {
    return new Promise((resolve) => {
      callBridgeMethod('goCommodityDetail', {skuCode}, () => {
        resolve();
      });
    });
  }

  /**
   * 闹钟提醒
   * @params {string} title
   * @params {string} beginTimeStamp
   * @params {string} reservation
   */
  jumpToAlarm(title, beginTimeStamp, reservation) {
    return new Promise((resolve) => {
      callBridgeMethod('remind', {title, beginTimeStamp, reservation}, (result) => {
        resolve(result);
      });
    });
  }

  /**
   * 返回app首页
   */
  jumpToAppIndex() {
    return new Promise((resolve) => {
      callBridgeMethod('goHome', {}, (result) => {
        resolve(result);
      });
    });
  }
  /**
   * 进入授信/借钱页面
   */
  jumpToAppCashLoan(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('cashLoan', param, (result) => {
        resolve(result);
      });
    });
  }
  /**
   * 进入个人中心
   */
  jumpToAppMe(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('goMe', param, (result) => {
        resolve(result);
      });
    });
  }
  /**
   * 进入订单中心
   */
  jumpToAppOrderCenter(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('goShoppingOrderCenter', param, (result) => {
        resolve(result);
      });
    });
  }
  /**
   * 进入手机浏览器访问
   */
  jumpToSystemWeb(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('goSystemWeb', param, (result) => {
        console.log(result);
        resolve(result);
      });
    });
  }
  /** 跳转页面专用桥，以后全在这个方法上面跳转
   *
   * @param path 路径
   * @param param 入参
   * @returns {Promise<any>}
   */
  jumpNative(path, param) {
    return new Promise((resolve) => {
      callBridgeMethod('goNative', {
        path,
        param,
      }, (result) => {
        console.log(result);
        if (result.result !== 'success') {
          Toast(result.message);
          return;
        }
        resolve(result);
      });
    });
  }
  /**
   * 退出登录
   */
  jumpToLoginOut(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('goLoginOut', param, (result) => {
        resolve(result);
      });
    });
  }
  /**
   * 获取token
   */
  jumpToDeviceToken(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('deviceToken', param, (result) => {
        resolve(result);
      });
    });
  }
  /**
   * 监听返回操作
   */
  jumpToListenBack(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('listenBack', param, (result) => {
        resolve(result);
      });
    });
  }
  /**
   * 进入账单详情
   */
  jumpToBillDetail(param = {}) {
    return this.jumpNative('billDetail', param)
  }
  /**
   * 账单立即还款跳到收银台
   */
  jumpToCashier(param = {}) {
    return this.jumpNative('billToCashier', param)
  }
  /**
   * 获取白骑士tokenKey
   */
  requestBqsToken(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('requestBqsToken', param, (result) => {
        resolve(result);
      });
    });
  }

  /**
   * 打开新的窗口跳转url
   * param: url String
   */
  pushAnimation(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('pushAnimation', param, (result) => {
        resolve(result);
      });
    });
  }

   /**
   * 跳转原生具体类型
   */
  jumpNativeForType(type, value) {
    if (!type) return
    return new Promise((resolve) => {
      window.dafei.jumpNativeForType(type.toString(), value, res => {
        resolve(res)
      })
    });
  }

  /**
   * 操作成功通知app
   */
  noticeNative(param = {}) {
    /*
    * param ：
    *   path: 跳转类型[String]
    *   ** JXH_JQPage 通知借钱成功
    * */
    return new Promise((resolve) => {
      callBridgeMethod('noticeNative', param, (result) => {
        resolve(result);
      });
    });
  }
  /**
   * 打开app推送设置
   * callback：[String]goAppPushSetting: 1 打开成功
   */
  goAppPushSetting(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('goAppPushSetting', param, (result) => {
        console.log(result);
        resolve(result);
      });
    });
  }

  /**
   * 原生导航栏返回键返回首页设置
   */
  navbarBackHome(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('backHome', param, (result) => {
        console.log(result);
        resolve(result);
      });
    });
  }
  /**
   * 原生导航栏返回键返回首页设置
   */
  navbarBackJXHStore(param = {}) {
    return new Promise((resolve) => {
      callBridgeMethod('backJXHStore', param, (result) => {
        console.log(result);
        resolve(result);
      });
    });
  }
  /**
   * 补充信息给app的回调
   */
  personAddDataBlock(param={}) {
    return this.jumpNative('addDataBlock', param)
  }
}

export const Jsbridge = new NativeBridge();
