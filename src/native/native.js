/* eslint-disable */

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var DaFei = function () {
  function DaFei() {
    _classCallCheck(this, DaFei);

    this.callbacks = [];
    this.isIOS = DaFei.utils.isIOS();
    this.isAndroid = DaFei.utils.isAndroid();
    this.init();
  }

  _createClass(DaFei, [{
    key: 'iosWebViewJavascriptBridge',
    value: function iosWebViewJavascriptBridge(callback) {
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
      }
      if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
      }
      window.WVJBCallbacks = [callback];
      window.WVJBIframe = document.createElement('iframe');
      window.WVJBIframe.style.display = 'none';
      window.WVJBIframe.src = 'https://__bridge_loaded__';
      window.WVJBIframe.onload = function () {
        setTimeout(function () {
          window.WVJBIframe.remove();
        }, 4);
      };
      document.documentElement.appendChild(window.WVJBIframe);
    }
  }, {
    key: 'androidWebViewJavascriptBridge',
    value: function androidWebViewJavascriptBridge(callback) {
      if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
      } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
          callback(WebViewJavascriptBridge);
        }, false);
      }
    }
  }, {
    key: 'init',
    value: function init() {
      this.isIOS ? this.iosWebViewJavascriptBridge(this.bridgeCallBack.bind(this)) : this.androidWebViewJavascriptBridge(this.bridgeCallBack.bind(this));
    }
  }, {
    key: 'bridgeCallBack',
    value: function bridgeCallBack(bridge) {
      var _this = this;

      this.isAndroid ? bridge.init(function (message, responseCallback) {
        responseCallback();
      }) : '';
      this.callbacks.forEach(function (value) {
        _this[value.name](value.method, value.data, value.callback);
      });
    }
  }, {
    key: 'shappingmallmessage',
    value: function shappingmallmessage(method, data, callback) {
      window.WebViewJavascriptBridge.callHandler('shappingmallmessage', {
        method: method,
        data: data
      }, function (response) {
        callback(response);
      });
    }
  }, {
    key: 'shappingmallmessageListen',
    value: function shappingmallmessageListen(method, data, callback) {
      window.WebViewJavascriptBridge.registerHandler('shappingmallappmessage', function (data, responseCallback) {
        callback(data);
        responseCallback(callback);
      });
    }
  }, {
    key: 'callMethods',
    value: function callMethods(name, method, data, callback) {
      if (window.WebViewJavascriptBridge) {
        this[name](method, data, callback);
      } else {
        this.callbacks.push({
          name: name,
          method: method,
          data: data,
          callback: callback
        });
      }
    }
  },
  {
    key: 'jumpNativeForType',
    value: function jumpNativeForType(type, value) {
      switch (type) {
        //首页
        case '1':
          window.dafei.callMethods('shappingmallmessage', 'goHome', {}, function (res) {
          });
          break;
        //取现 校验登录状态
        case '2':
          DaFei.getUserInfo(function () {
            window.dafei.callMethods('shappingmallmessage', 'goCash', {}, function (res) {
            })
          })
          break;
        //还款 校验登录状态
        case '3':
          DaFei.getUserInfo(function () {
            window.dafei.callMethods('shappingmallmessage', 'goRepayment', {}, function (res) {
            })
          });
          break;
        //我的
        case '4':
          window.dafei.callMethods('shappingmallmessage', 'goMe', {}, function (res) {
          });
          break;
        //充值 校验登录状态
        case '5':
          DaFei.getUserInfo(function () {
            window.dafei.callMethods('shappingmallmessage', 'goRecharge', {}, function (res) {
            })
          })
          break
        //收藏 校验登录状态
        case '6':
          DaFei.getUserInfo(function () {
            window.dafei.callMethods('shappingmallmessage', 'goCollection', {}, function (res) {
            })
          })
          break
        //优惠券列表 校验登录状态
        case '7':
          DaFei.getUserInfo(function () {
            window.dafei.callMethods('shappingmallmessage', 'goDiscountRollCenter', {}, function (res) {
            })
          })
          break;
        //couponCode商品列表
        case '8':
          window.dafei.callMethods('shappingmallmessage', 'goDiscountCommodityList', {couponCode: value}, function (res) {
          });
          break;
        //H5
        case '9':
          // window.dafei.callMethods('shappingmallmessage', 'goWeb', {url: value}, function (res) {
          // });
          location.href = value
          break;
        //code商品列表
        case '10':
          window.dafei.callMethods('shappingmallmessage', 'goCommodityList', {code: value}, function (res) {
          });
          break;
        //商品介绍
        case '11':
          window.dafei.callMethods('shappingmallmessage', 'goCommodityDetail', {skuCode: value}, function (res) {
          });
          break;
        // 锚点（原生！！！）
        case '12':
          var link = location.href
          if (link.indexOf('#') !== -1) {
            link = link.slice(0, link.indexOf('#') + 1) + value
          } else {
            link += '#' + value
          }
          location.href = link;
          break;
        //类目
        case '13':
          window.dafei.callMethods('shappingmallmessage', 'goCategory', {shopTypeId: value}, function (res) {
          });
          break;
        //shopType商品列表
        case '14':
          window.dafei.callMethods('shappingmallmessage', 'goCategoryList', {shopTypeId: value}, function (res) {
          });
          break;
        //keyword商品列表
        case '15':
          window.dafei.callMethods('shappingmallmessage', 'goKeyWordCommodityList', {keyword: value}, function (res) {
          });
          break;
        //  跳转到消息中心
        case '16':
          window.dafei.callMethods('shappingmallmessage', 'goMessageList', {}, function (res) {
          });
          break;
        // 跳转爱花授信 校验登录状态
        case '17':
          window.dafei.callMethods('shappingmallmessage', 'goNative', { path: 'AuthAh' }, function (res) {
          });
          break;
        // 跳转爱满分授信 校验登录状态
        case '18':
          window.dafei.callMethods('shappingmallmessage', 'goNative', { path: 'billToCredit' }, function (res) {
          });
          break;
        // 跳转吉享花-借钱
        case '21':
          window.dafei.callMethods('shappingmallmessage', 'goNative', { path: 'goJXH_Loan' }, function (res) {
          });
          break;
        // 跳转吉享花-分期商城
        case '22':
          window.dafei.callMethods('shappingmallmessage', 'goNative', { path: 'goJXH_Store' }, function (res) {
          });
          break;
        // 跳转吉享花-账单
        case '23':
          window.dafei.callMethods('shappingmallmessage',
            'pushAnimation',
            { url: window.location.origin + '/custom-page/bill-pages/#/aimanfen/jxh-bill'  }, function (res) {
            });
          break;
      }
    }
  }
])
  return DaFei;
}()

DaFei.utils = {
  device: function () {
    var u = navigator.userAgent;
    return {
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
      iPad: u.indexOf('iPad') > -1
    };
  }(),
  isIOS: function isIOS() {
    return this.device.ios || this.device.iPhone || this.device.iPad;
  },
  isAndroid: function isAndroid() {
    return this.device.android;
  }
}

DaFei.getUserInfo = function getUserInfo(cb) {
  window.dafei.callMethods('shappingmallmessage', 'getUserInfo', {}, function (res) {
    if (res) {
      cb(res)
    } else {
      window.dafei.callMethods('shappingmallmessage', 'goLogin', {}, function (res) {
      })
    }
  })
}

window.dafei = new DaFei();
