import mountApp from '../mountApp';
import {session} from '@/helpers/storage';

mountApp(require('./Index.vue').default, {
  title: '吉享花',
  router: require('./router').default,
  store: require('./store/index').default,
  api: 'jxhApi',
  firstRouteBefore(to, from, next) {
    // 平台渠道参数，加在请求头
    if (to.query.pSource) {
      session.set("pSource", to.query.pSource)
    }
    next()
  },
  async routerBeforeEach(to, from, next, storeInstance) {
    if (!storeInstance.state.global.userInfo.userId) {
      next()
    }
    else {
      const fliterArr = ["/addBank", "/bankList"]
      if (fliterArr.includes(to.path)) {
        return next()
      }
      await storeInstance.dispatch('credit/setCreditStep', {
        userId: storeInstance.state.global.userInfo.userId,
        accountId: storeInstance.state.global.userInfo.accountId,
      });
      const creditStep = storeInstance.state.credit.creditStep
      let path = '';
      switch (creditStep.status) {
        case 0:
        case 10:
        case 20:
        case 30:
          // 身份认证
          path = '/identityAc';
          break;
        case 40:
          // 视频认证
          path = '/liveAc';
          break;
        case 50:
          // 个人信息
          path = '/personInfo';
          break;
        case 70:
        // 等待授信结果
        case 1000:
        case 1100:
          // 授信结束
          path = '/creditResult';
          break;
      }
      if (to.path !== path) {
        next({ path })
      } else {
        next()
      }
    }
  }
});
