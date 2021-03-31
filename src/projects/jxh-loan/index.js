import mountApp from '../mountApp';
import {session} from '@/helpers/storage';
import {Toast} from 'mint-ui';
import env from '@/helpers/env';

mountApp(require('./Index.vue').default, {
  title: '借钱',
  router: require('./router').default,
  store: require('./store/index').default,
  api: 'jxhApi',
  firstRouteBefore(to, from, next, storeInstance) {
    // 平台渠道参数，加在请求头
    if (to.query.pSource) {
      session.set("pSource", to.query.pSource)
    }
    // 非app限制入口，链接必须带urlSource参数，字符限制10位
    if (env.isJXHAPP() || env.isJXHLink()) {
      // 吉享花app默认渠道值
      storeInstance.dispatch('base/set_configType', to.query.urlSource || "JXH_XJFQ");
    } else {
      if (to.query.urlSource && to.query.urlSource.length < 10) {
        session.set("urlSource", to.query.urlSource)
      } else if (!session.get("urlSource")) {
        return Toast("获取渠道参数失败")
      }
    }
    next()
  }
});
