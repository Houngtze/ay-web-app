import axios from 'axios';
import {Toast, MessageBox} from 'mint-ui';
import {redirectToLoginPage, netWorkStatus} from '@/helpers/utils';
import {local, session} from '@/helpers/storage';
import env from '@/helpers/env';
import Ng from '@/native/NativeBridge';

let cancel = {};
export const headerConf = {
  // 'X-Requested-With': 'XMLHttpRequest',
  platform: 'H5',
};
let promiseArr = {};
const CancelToken = axios.CancelToken;
const ua = navigator.userAgent;
const nativeBridge = new Ng();

// 请求拦截器
axios.interceptors.request.use(async (config) => {
  // if (config.method === 'post') {
  //   config.headers.platform = 'h5';
  //   if (!config.data.channel) {
  //     config.data.channel = 'APP';
  //   }
  //   config.data.userId = '';
  //   config.data.idPerson = '';
  // }
  config.headers.deviceId = local.get("JXH_SIGN") && local.get("JXH_SIGN").sign;
  if (env.isApp()) {
    const userAgent = navigator.userAgent
    let version = userAgent.substr(-5, 5).replace(/\./g, '') + "00"
    const data = await nativeBridge.jumpToDeviceToken();
    if (data.deviceToken) config.headers.token = `Authorization: Bearer ${data.deviceToken}`;
    config.headers.version = version;
   if (env.isAndroid() && data.androidChannel) config.headers.androidChannel = data.androidChannel;
  }else {
    // 吉享花项目的投放字段
    if (session.get("pSource")) {
      config.headers.putSource = session.get("pSource");
    }
  }
  // 发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url]) {
    promiseArr[config.url] || promiseArr[config.url]('操作取消');
    promiseArr[config.url] = cancel;
  } else {
    promiseArr[config.url] = config;
  }
  return Object.prototype.toString.call(promiseArr[config.url]) === "[object Function]" ? promiseArr[config.url]() : promiseArr[config.url];
}, error => Promise.reject(error));
// 响应拦截器即异常处理
axios.interceptors.response.use(response => {
  if (response.data.code === 'sc710103' || response.data.code === 'sc000401'
    || response.data.code === "500117" || response.data.code === "000401") {
    if (!env.isJXHAPP()) {
      MessageBox.alert(response.data.message).then(action => {
        redirectToLoginPage();
      });
    } else {
      redirectToLoginPage();
    }
  }
  return response;
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
    case 400:
      err.message = '错误请求';
      break;
    case 401:
      err.message = '未授权，请重新登录';
      break;
    case 403:
      err.message = '拒绝访问';
      break;
    case 404:
      err.message = '请求错误,未找到该资源';
      break;
    case 405:
      err.message = '请求方法未允许';
      break;
    case 408:
      err.message = '请求超时';
      break;
    case 500:
      err.message = '服务器端出错';
      break;
    case 501:
      err.message = '网络未实现';
      break;
    case 502:
      err.message = '网络错误';
      break;
    case 503:
      err.message = '服务不可用';
      break;
    case 504:
      err.message = '网络超时';
      break;
    case 505:
      err.message = 'http版本不支持该请求';
      break;
    default:
      err.message = `连接错误${err.response.status}`;
    }
  } else if (err.message.indexOf('timeout') !== -1) {
    Toast({
      position: 'bottom',
      message: '请求超时',
    });
    closeLoading();
  }
  return Promise.reject(err);
});
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/api' : '/';
// 设置默认请求头
axios.defaults.headers = headerConf;
axios.defaults.timeout = 25000;
let loading = null;

function starteLoading() {
  if (!loading) {
    loading = Toast({
      className: 'g-mask-toast-loading',
      iconClass: 'g-mask-toast-loading-icon',
      duration: -1,
      message: 'loading...',
    });
  }
}

function closeLoading() {
  if (loading) {
    loading.close();
    loading = null;
  }
}

const call = function (res, err, solve) {
  closeLoading();
  promiseArr = {};
  if (!err) {
    solve(res);
  } else {
    Toast({
      position: 'bottom',
      message: err.message,
    });
  }
};

export default {
  // get请求
  get(url, param = {}) {
    return new Promise((resolve, reject) => {
      if (netWorkStatus()) {
        axios({
          method: 'get',
          url,
          params: param,
          cancelToken: new CancelToken(c => {
            cancel = c;
          }),
        }).then((res, err) => {
          res = res.data;
          call(res, err, resolve, reject);
        })
      } else {
        Toast({
          position: 'bottom',
          message: '请检查网络连接',
        });
      }
    });
  },
  // post请求
  post(url, param = {}, conf = {}) {
    const params = {
      method: 'post',
      url,
      data: param,
      cancelToken: new CancelToken(c => {
        cancel = c;
      }),
    };
    if (conf) {
      params.headers = {
        ...headerConf,
        ...conf,
      };
    }
    return new Promise((resolve, reject) => {
      if (netWorkStatus()) {
        starteLoading();
        axios(params).then((res, err) => {
          if (res) {
            res = res.data;
            call(res, err, resolve, reject);
          }
        })
      } else {
        Toast({
          position: 'bottom',
          message: '请检查网络连接',
        });
      }
    });
  },
};
