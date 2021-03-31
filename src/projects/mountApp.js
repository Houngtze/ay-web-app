/* eslint-disable */
// 未知原因，babel.config 上使用的默认配置 es7.promise.finally 未生效
// 手动 shim
// https://github.com/matthew-andrews/Promise.prototype.finally/blob/master/finally.js
import {local, session} from "../helpers/storage";

window.Promise.prototype['finally'] = function finallyPolyfill(callback) {
  const constructor = this.constructor;
  return this.then(function (value) {
    return constructor.resolve(callback()).then(function () {
      return value;
    });
  }, function (reason) {
    return constructor.resolve(callback()).then(function () {
      throw reason;
    });
  });
};
/* eslint-enable */
/* eslint-disable import/first */
import '../global/global';
import '../global/global.scss';
import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';
import Mint from 'mint-ui';
import { createHashUrl, redirectToLoginPage } from '../helpers/utils';
import NativeBridge from '../native/NativeBridge';
import Weixin from '../weixin/Weixin';
import env from '../helpers/env';
import globalStore from '../store';
import { headerConf } from '@/services/request';
import fastClick from 'fastclick';

import 'mint-ui/lib/style.css';
import 'normalize.css';

import '@babel/polyfill';
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

Vue.use(Vuex);
Vue.use(Router);
Vue.use(Mint);
Vue.config.productionTip = false;

document.setTitle = function(t) {
  document.title = t;
  const i = document.createElement('iframe');
  i.src = '';
  i.style.display = 'none';
  i.onload = function() {
    setTimeout(function(){
      i.remove();
    }, 9)
  }
  document.body.appendChild(i);
}

export default async function mountApp(Component, optionsArg = {}) {
  const options = {
    store: {},
    ...optionsArg,
  };

  const storeInstance = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
      ...options.store.state,
      ...globalStore.state,
    },
    mutations: {
      ...options.store.mutations,
      ...globalStore.mutations,
    },
    actions: {
      ...options.store.actions,
      ...globalStore.actions,
    },
    getters: {
      ...options.store.getters,
      ...globalStore.getters,
    },
    modules: {
      ...options.store.modules,
      ...globalStore.modules,
    },
  });

  const routerInstance = new Router({
    mode: 'hash',
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },
    ...options.router,
  });

  if (options.title) {
    document.setTitle(options.title);
  }
  // 跟进配置，动态绑定api server
  if (!options.api) {
    await import('@/services/base').then(res => {
      Vue.prototype.$api = new res.default();
    });
  } else {
    await import(`@/services/modules/${options.api}`).then(res => {
      Vue.prototype.$api = res.default;
    });
  }
  const nativeBridgeInstance = new NativeBridge();
  const weixinInstance = new Weixin();
  Vue.prototype.$nativeBridge = nativeBridgeInstance;
  Vue.prototype.$weixin = weixinInstance;
  /*
   * 初始化行为
   */
  // 使得在任意页面渲染前，已完成 微信/APP 初始化
  if (env.isWeixin()) {
    weixinInstance.init();
  }
  nativeBridgeInstance.init();
  // 并非所有场景都能拿到各实例，直接注入至全局。谨慎，仅必要时使用
  window.$_dangerousStore = storeInstance;

  /**
   * 必须用户执行登录之后才可以访问
   */
  let isFirstRouteEnter = true;
  routerInstance.beforeEach((to, from, next) => {
    if (isFirstRouteEnter) {
      // 确保页面运行时，jsbridge已ready
      isFirstRouteEnter = false;
      Promise.all([
        new Promise((resolve) => {
          if (env.isWeixin()) {
            weixinInstance.ready(() => {
              resolve();
            }, () => {
              resolve();
            });
          } else {
            resolve();
          }
        }),
        new Promise(async resolve => {
          if (env.isApp()) {
            nativeBridgeInstance.ready(async () => {
              const tokenRes = await nativeBridgeInstance.jumpToDeviceToken();
              await storeInstance.dispatch('global/setToken', tokenRes.deviceToken);
              if (tokenRes.deviceId) {
                local.set("JXH_SIGN", {
                  "timeStamp": new Date().getTime(),
                  "sign": tokenRes.deviceId
                })
              }
              let res;
              // 吉享花判断
              if(env.isJXHAPP()) {
                let baseInfo = await Vue.prototype.$api.JXHgetBaseInfo({});
                if(baseInfo.result === 'success'){
                  res = baseInfo.data
                } else {
                  redirectToLoginPage();
                }
              } else{
                res = await nativeBridgeInstance.getUserInfo();
              }
              if (res && res.userId) {
                const param = {
                  userId: res.userId,
                  idPerson: res.personId || 0,
                };
                await storeInstance.dispatch('global/updateUserInfo', param);
              }
              resolve();
            }, () => {
              resolve();
            });
          } else {
            /*
            * 备注：吉享花专用的接口需要使用token，用随机生成的16位数字当设备号
            * */
            // 设置属于吉享花页面的专用标识。储存到localStorage中，并做7天时间校验
            if (env.isJXHLink()) {
              const jxhSign = local.get("JXH_SIGN")
              if (jxhSign) {
                if (Number(jxhSign.timeStamp) + 24*60*60*1000*7 < new Date().getTime()) {
                  local.remove("JXH_SIGN")
                }
              }
              if (!local.get("JXH_SIGN")) {
                local.set("JXH_SIGN", {
                  "timeStamp": new Date().getTime(),
                  "sign": Math.floor(Math.random()* Math.pow(10, 16))
                })
              }
              if (local.get("JXH_SIGN")) {
                let tokenRes = await Vue.prototype.$api.JXHapplyToken();
                if(tokenRes.result === 'success'){
                  await storeInstance.dispatch('global/setToken', tokenRes.data.accessToken);
                }else{
                  Mint.Toast('获取用户信息失败');
                }
                // 验证登录信息是否正确
                if (storeInstance.state.global.userInfo.userId) {
                  let baseinfo = await Vue.prototype.$api.JXHgetBaseInfo({});
                  if (baseinfo.code === "500117") {
                    await storeInstance.dispatch('global/cleanUserInfo')
                    Mint.MessageBox.alert(baseinfo.message).then(action => {
                      redirectToLoginPage();
                    });
                  }
                }
              }
            }
            resolve();
          }
        }),
      ]).finally(() => {
        next();
      });
    } else {
      next();
    }
  });
  routerInstance.beforeEach((to, from, next) => {
    if (to.meta.title) {
      storeInstance.dispatch('global/setTitle', to.meta.title);
      options.source && storeInstance.dispatch('global/setSource', options.source);
      document.setTitle(to.meta.title);
    }
    /*********************************
     *
     *   注意吉享花的登陆界面需要在登陆页面链接上加上jxh-字符串来识别
     *
     * ********************************/
    /****/
    if (to.meta.needSign) {
      if (!storeInstance.state.global.userInfo.userId || !storeInstance.state.global.token) {
        to.query && storeInstance.dispatch('global/setSource', to.query.source);
        // 表示当前未登录
        redirectToLoginPage();
        return;
      } else {
        if (to.path === "/login" && process.env.NODE_ENV !== 'development') return
      }
    }
    next();
  });

  if (storeInstance.state.global.token) headerConf.token = `${storeInstance.state.global.token}`; // 用户刷新页面保证token是存在的
  if (storeInstance.state.global.userInfo.userId) headerConf.userId = storeInstance.state.global.userInfo.userId; // 用户刷新页面保证token是存在的
  if (storeInstance.state.global.userInfo.idPerson) headerConf.idPerson = storeInstance.state.global.userInfo.idPerson; // 用户刷新页面保证token是存在的

  // 业务的路由守卫
  if (options.firstRouteBefore) {
    let isFirstRoute = true;
    routerInstance.beforeEach((to, from, next) => {
      if (isFirstRoute) {
        isFirstRoute = false;
        options.firstRouteBefore(to, from, next, storeInstance);
      } else {
        next();
      }
    });
  }
  if (options.routerBeforeEach) {
    routerInstance.beforeEach((to, from, next) => {
      options.routerBeforeEach(to, from, next, storeInstance);
    });
  }


  Vue.directive('preventReClick', {
    inserted (el, binding) {
      el.addEventListener('click', () => {
        if (!el.disabled) {
          el.disabled = true
          setTimeout(() => {
            el.disabled = false
          }, binding.value || 3000)
        }
      })
    }
  })

  new Vue({
    router: routerInstance,
    store: storeInstance,
    render: h => h(Component),
    mounted(){
      fastClick.attach(document.body) // 加载完毕调用
    }
  }).$mount('#app');
}
