import qs from 'querystringify';
import {Toast} from 'mint-ui';
import env from './env';
import {Jsbridge} from '../native/NativeBridge';

// 获取地理位置
export async function getMapDetail() {
  const geolocation = new qq.maps.Geolocation('LZWBZ-NOHHU-EJBV6-BGQ4J-DP4OZ-A6BGX', 'myapp');
  return new Promise((resolve, reject) => {
    geolocation.getLocation(val => {
      resolve(val);
    }, err => {
      reject(err);
    });
  });
}
// 获取当前访问路由
export function createHashUrl(routePath, query = undefined) {
  const { location } = window;
  return [
    location.origin,
    location.pathname,
    location.search,
    '#',
    routePath,
    query ? qs.stringify(query, '?') : '',
  ].join('');
}
// 重定向到登录页
export async function redirectToLoginPage(returnUrl) {
  if (!env.isApp()) {
    let actualReturnUrl
    if (returnUrl) {
      actualReturnUrl = returnUrl
    } else {
      actualReturnUrl = window.location.href;
      const str = actualReturnUrl.split('#')[0];
      const query = `?type=${window.location.href.indexOf("jxh") > -1 ? "jxh-pages" : "normal"}`
      actualReturnUrl = `${str}#/login${query}`;
    }
    window.location.assign(actualReturnUrl);
    window.location.reload();
  } else {
    await Jsbridge.jumpToLogin().then(async (res) => {
      const param = {
        userId: res.userId,
        idPerson: res.idPerson || 0,
      };
      if (res.clientCode) window.$_dangerousStore.dispatch('global/setClientCode', res.clientCode); // 为金融科技独立app做客户端code处理
      await window.$_dangerousStore.dispatch('global/updateUserInfo', param);
      const AFTloginRes = await Jsbridge.jumpToDeviceToken();
      await window.$_dangerousStore.dispatch('global/setToken', AFTloginRes.deviceToken);
      let actualReturnUrl = returnUrl || window.location.href;
      window.location.replace(actualReturnUrl);
      setTimeout(() => {
        window.location.reload()
      },300)
    });
  }
  // window.location.reload();
}
// 获取联网状态
export function netWorkStatus() {
  let status = navigator.onLine;
  if (navigator.connection) {
    navigator.connection.onchange = () => {
      console.log('navigator.onLine');
      console.log(navigator.onLine);
      status = navigator.onLine;
    };
  } else {
    window.addEventListener('offline', () => { console.log('navigator.offline'); status = false; });
    window.addEventListener('online', () => { console.log('navigator.onLine'); status = true; });
  }
  return status;
}
// 返回登录页
export function goLogin() {
  // const source = store.state.global.source;
  const {location} = window;
  const url = `${location.origin}/aiyong-shop/#/login`;
  window.location.href = url;
}
// 图片文件压缩
export function imgCompression(file) {
  return new Promise(solve => {
    const size = Math.ceil(file.size / 1024 / 1024);
    console.log(size)
    if (size > 2) {
      let loading = Toast({
        className: 'g-mask-toast-loading',
        iconClass: 'g-mask-toast-loading-icon',
        duration: -1,
        message: '文件压缩中...',
      });
      // const sizeVal = Math.ceil(size / 1);
      // const sizeVal = 2 / size;
      const reader = new FileReader();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.onload = function () {
        const oW = this.width;
        const oH = this.height;
        // const mH = 600;
        // const mW = 800;
        let tW = 600;
        if (oW / oH < 1) {
          tW = 400;
        }
        const tH = tW * oH / oW;
        // let tH = 800;
        // if (oW / oH > 1) {
        //   tW = 800;
        //   tH = 600;
        // }
        // canvas对图片进行缩放
        canvas.width = tW;
        canvas.height = tH;
        // 清除画布
        context.clearRect(0, 0, tW, tH);
        // 图片压缩
        context.drawImage(img, 0, 0, tW, tH);
        canvas.toBlob(bl => {
          if (loading) {
            loading.close();
            loading = null;
          }
          solve(bl);
        }, 'image/*');
      };
      // 为文件读取成功设置事件
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      // 正式读取文件
      reader.readAsDataURL(file);
    } else {
      solve(file);
    }
  });
}
// 获取当前时间
export function formatDateTime(type) {
  const date = new Date();
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let hh = date.getHours();
  hh = hh < 10 ? ('0' + hh) : hh;
  let mm = date.getMinutes();
  mm = mm < 10 ? ('0' + mm) : mm;
  let ss = date.getSeconds();
  ss = ss < 10 ? ('0' + ss) : ss;
  let res = date.getTime();
  switch (type) {
  case 'yyyy-mm-dd':
    res = y + '-' + m + '-' + d;
    break;
  case 'yyyy-mm-dd hh:mm':
    res = y + '-' + m + '-' + d + ' ' + hh + ':' + mm;
    break;
  case 'yyyy-mm-dd hh:mm:ss':
    res = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    break;
  default:
    break;
  }
  return res;
}
// 接口信息Toast
export function resToast(data) {
  if (env.isAndroid()) {
    Toast({
      message: data,
      position: 'bottom',
    });
  } else {
    Toast(data);
  }
}
// 时间戳转标准时间
export function timestampToTime(timestamp,mode) {
    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let D = Number(date.getDate())>=10?date.getDate():`0${date.getDate()}`;
    let h = Number(date.getHours())>=10?date.getHours():`0${date.getHours()}`;
    let m = Number(date.getMinutes())>=10?date.getMinutes():`0${date.getMinutes()}`;
    let s = date.getSeconds();
    if(mode == 'ymd'){
      return  `${Y}-${M}-${D}`;
    }else{
      return  `${Y}-${M}-${D} ${h}:${m}`;
    }

}

// 将请求参数序列化
export function queryToString(data) {
  let query = '';
  const keysArr = Object.keys(data);
  for (let i = 0; i < keysArr.length; i++) {
    let str = `${keysArr[i]}=${data[keysArr[i]]}`;
    if (i < keysArr.length - 1) str += '&';
    query += str;
  }
  return query;
}

//防抖函数
export function debounce(func, wait, immediate) {

  var timeout, result;

  return function () {
      var context = this;
      var args = arguments;

      if (timeout) clearTimeout(timeout);
      if (immediate) {
          // 如果已经执行过，不再执行
          var callNow = !timeout;
          timeout = setTimeout(function(){
              timeout = null;
          }, wait)
          if (callNow) result = func.apply(context, args)
      }
      else {
          timeout = setTimeout(function(){
              result = func.apply(context, args)
          }, wait);
      }

      return result;
  }
}

export function linkTap(url) {
  // if (/aiyong.dafysz.cn/i.test(url)) { //  || /10.17.20.129:8081/i.test(url)
  //   window.location.href = url;
  // } else {
  //   let setTime = setTimeout(() => {
  //     window.location.href = url;
  //   }, 800);
  //   // 获取jsbrige钩子
  //   const native = new NativeBridge();
  //   native.jumpToSystemWeb({url}).then(() => {
  //     if (setTime) {
  //       clearTimeout(setTime);
  //       setTime = null;
  //     }
  //   });
  // }
  window.location.href = url;
}
