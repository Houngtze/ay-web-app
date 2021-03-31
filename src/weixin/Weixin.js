import wx from 'weixin-js-sdk';
import qs from 'querystringify';
import env from '@/helpers/env';
import {local, session} from '@/helpers/storage';
import wxApi from '@/services/modules/wxApi';

const IS_READY = Symbol('/services/Weixin/IS_READY');
const IS_ERROR = Symbol('/services/Weixin/IS_ERROR');
const API = Symbol('/services/Weixin/IO');
// const STORE = Symbol('/services/Weixin/STORE');
const INIT_TASK = Symbol('/services/Weixin/INIT_TASK');

const WEIXIN_AUTH_CONFIG_KEY = 'global/weixin-auth-config';
const WEIXIN_AUTH_DATA_KEY = 'global/weixin-auth-data';
const RETURN_QUERY_KEY = '_$qk_return$_';

export default class Weixin {
  constructor() {
    this[IS_ERROR] = false;
    this[IS_READY] = false;
    this[API] = wxApi;
  }
  init() {
    if (!env.isWeixin()) {
      throw new Error('只能在微信环境下使用');
    }

    if (this[IS_READY] || this[IS_ERROR] || this[INIT_TASK]) {
      // 表示已初始过，或初始中
      return;
    }

    this[INIT_TASK] = Promise.resolve()
    // 检查是否未上一次的授权回跳地址。是的时候读取后重定向，结束本次初始化
    .then(() => {
      // 检查 url 是否包含上一次带回的授权信息，使用 openid 和 sign 作为唯一标识
      // 带上一次授权信息时，写入 storage 并重定向清除 url 参数，下一次从 storage 上获取授权信息
      const searchParam = qs.parse(window.location.search);
      if (searchParam.openid && searchParam.sign) {
        const userInfo = {
          openid: searchParam.openid, // 用户openid，无感知授权时只能拿到 openid 和 subscribe
          nickname: searchParam.nickname, // 用户昵称
          headimgurl: searchParam.headimgurl, // 用户头像
          sex: searchParam.sex, // 用户性别（1男性 2女性 0未知）
          province: searchParam.province, // 省份
          city: searchParam.city, // 国家
          country: searchParam.country, // 城市
          subscribe: searchParam.subscribe, // 是否关注（1关注 0未关注）
        };
        console.info('[weixin][init]微信授权，URL带回授权信息，写入storage');
        local.set(WEIXIN_AUTH_DATA_KEY, userInfo);
        const returnQuery = qs.parse(window.location.search);
        let returnUrl = returnQuery[RETURN_QUERY_KEY]; // RETURN_QUERY_KEY = '_$qk_return$_', 约定字段;
        if (!returnUrl) {
          returnUrl = window.location.href.split('?')[0].split('#')[0];
          window.location.replace(returnUrl);
        } else {
          // TODO 安全拦截
          throw new Error('非法路径！');
        }
        return new Promise(() => {
          // always pending
        });
      } else {
        return undefined;
      }
    })

    // 从服务器获取初始化所需签名信息
    .then(() => {
      const storageConfig = session.get(WEIXIN_AUTH_CONFIG_KEY);
      // 先读取缓存
      if (storageConfig) {
        // 存在直接返回签名信息
        return storageConfig;
      } else {
        return this[API].wx.getWechatConfig({
          redirectUri: window.location.href.split('#')[0], // weixin要求做encodeURIComponent，但后端已提供
        }).then((resp) => {
          if (resp.result === 'success' || resp.status === 'success') {
            session.set(WEIXIN_AUTH_CONFIG_KEY, resp.data);
            return resp.data;
          } else {
            return Promise.reject(new Error(resp.message));
          }
        });
      }
    })

    // 初始化 SDK
    .then((conf) => {
      wx.error((err) => {
        console.error('weixin', err);
      });
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: conf.appId, // 必填，公众号的唯一标识
        timestamp: conf.timestamp, // 必填，生成签名的时间戳
        nonceStr: conf.nonceStr, // 必填，生成签名的随机串
        signature: conf.signature, // 必填，签名，见附录1
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
        ],
      });
      wx.showMenuItems({
        menuList: [
          'menuItem:share:appMessage',
          'menuItem:share:timeline',
        ],
      });
    })

    // 检查 wx ready
    .then(() => (
      new Promise((resolve, reject) => {
        let hasRejected = false;
        const watchdogHandle = setTimeout(() => {
          console.error('[weixin][init]微信SDK初始化超时');
          hasRejected = true;
          reject(new Error('微信SDK初始化超时'));
        }, 10 * 1000);
        wx.ready(() => {
          if (hasRejected) {
            // 已超时时，即使 weixin 在下一时刻自己初始化成功了，也视为失败
            return;
          }
          clearTimeout(watchdogHandle);
          resolve();
        });
      })
    ))

    // 微信 ready 后，尝试读取上一次的已授权用户信息
    // .then(() => {
    //   const storeUserInfo = local.get(WEIXIN_AUTH_DATA_KEY);
    //   if (storeUserInfo) {
    //     console.info('[weixin][init]找到storage授权信息，更新至store');
    //     this[STORE].dispatch({
    //       type: 'global/weixin/updateWeixinAuthState',
    //       authData: storeUserInfo,
    //     });
    //   } else {
    //     console.info('[weixin][init]无storage授权信息，等待手动授权');
    //   }
    // })

    // 汇总结果
    .then(() => {
      console.info('[weixin][init]微信SDK初始化成功，ready!');
      this[IS_READY] = true;
    }, (err) => {
      console.error('[weixin][init]', err.message);
      this[IS_ERROR] = true;
      throw err;
    })

    // 已确信初始化任务完成
    .finally(() => {
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
  setShareTimeline({title, desc, link, imgUrl, onSuccess, onCancel}) {
    if (!this[IS_READY]) {
      throw new Error('微信SDK尚未初始化');
    }
    //  分享到朋友圈
    console.log(link);
    wx.onMenuShareTimeline({
      title, // 分享标题
      desc, // 分享描述
      link, // 分享链接
      imgUrl, // 分享图标
      success: onSuccess || function () {
        // TODO
      },
      cancel: onCancel || function () {
        // TODO
      },
    });
  }

  setShareAppMessage({title, desc, link, imgUrl, onSuccess, onCancel}) {
    if (!this[IS_READY]) {
      throw new Error('微信SDK尚未初始化');
    }
    //  分享给朋友
    wx.onMenuShareAppMessage({
      title, // 分享标题
      desc, // 分享描述
      link, // 分享链接
      imgUrl, // 分享图标
      success: onSuccess || function () {
      },
      cancel: onCancel || function () {
      },
    });
  }
  setHideOptionMenu() {
    if (!this[IS_READY]) {
      throw new Error('微信SDK尚未初始化');
    }
    //  分享给朋友
    wx.hideOptionMenu();
  }
  setShowOptionMenu() {
    if (!this[IS_READY]) {
      throw new Error('微信SDK尚未初始化');
    }
    //  分享给朋友
    wx.showOptionMenu();
  }
}
