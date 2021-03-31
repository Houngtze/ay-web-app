import {session} from '@/helpers/storage';

const ua = navigator.userAgent;

export default {
  /**
   * 是否运行于生产环境
   * @return {boolean}
   */
  isProd() {
    // 暂使用此规则判定，后续扩展
    return process.env.NODE_ENV === 'production' && window.location.host === 'aiyong.dafysz.cn';
  },
  /**
   * 是否运行于微信环境
   * @return {boolean}
   */
  isWeixin() {
    return ua.toLowerCase().indexOf('micromessenger') !== -1;
  },
  /**
   * 是否运行于爱用商城App环境
   * @return {boolean}
   */
  isApp() {
    // iOS 2.0.1、Android 2.0.1 起支持  bAiYongApp->爱用商城 bAFTApp->金融科技
    if (/\bAiYongApp\b/.test(ua) || /\bAFTApp\b/.test(ua) || /\bAYQAPP\b/.test(ua) || /\bJiXiangHuaApp\b/.test(ua)) {
      return true;
    }
    return false
  },
  isAiyongApp() {
    // iOS 2.0.1、Android 2.0.1 起支持  bAiYongApp->爱用商城 bAFTApp->金融科技
    const isAiyongApp = /\bAiYongApp\b/.test(ua)
    return isAiyongApp
  },
  isJXHAPP() {
    // iOS 2.0.1、Android 2.0.1 起支持
    const isJXHAPP = /\bJiXiangHuaApp\b/.test(ua)
    return isJXHAPP
  },
  /**
   * 获取 App 版本号 iOS 2.0.1、Android 2.0.1 起支持
   * @return {string}
   */
  getAppVersion() {
    let appVersion = null;
    ua.replace(/AiYongApp\/([^\s]+)/, (str, version) => {
      appVersion = version;
    });
    return appVersion;
  },
  /**
   * 是否是安卓环境
   * @return {boolean}
   */
  isAndroid() {
    return /\bandroid\b/i.test(navigator.userAgent);
  },
  /**
   * 是否是iOS环境
   * @return {boolean}
   */
  isIos() {
    return /\b(iPhone|iPad\b)/i.test(navigator.userAgent);
  },
  /**
   * 是否是吉享花链接（href中匹配”jxh“字符串）
   * @return {boolean}
   */
  isJXHLink() {
    return window.location.href.indexOf("jxh-") > -1;
  },
};
