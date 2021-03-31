import mountApp from '../mountApp';
import {session} from '@/helpers/storage';

mountApp(require('./Index.vue').default, {
  title: '权易宝',
  router: require('./router').default,
  store: require('./store/index').default,
  api: 'qybApi',
  firstRouteBefore(to, from, next, storeInstance) {
    storeInstance.dispatch('credit/setProduct', "QYB")
    // 平台渠道参数，加在请求头
    if (to.query.pSource) {
      session.set("pSource", to.query.pSource)
    }
    next()
  },
  async routerBeforeEach(to, from, next, storeInstance) {
    if (to.path === "/login") {
      if (storeInstance.state.global.userInfo.userId) {
        next(from.path)
      } else {
        next()
      }
    } else {
      const filterPageArr = ["/addBank", "/bankList"]
      if (filterPageArr.includes(to.path)) {
        return next()
      }
      // 路由守卫：获取授信步骤
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
          // 身份认证
          path = '/identityAc';
          break;
        case 30:
        case 40:
          // 个人信息
          path = '/personInfo';
          break;
        case 50:
          // 分期信息
          path = '/applyLoan';
          break;
        case 60:
        case 70:
        // 等待授信结果
        case 1000:
        case 1100:
          // 授信结束
          path = '/creditResult';
          break;
      }
      if (path == "/creditResult") {
        await storeInstance.dispatch('credit/setLoanResult', {
          userId: storeInstance.state.global.userInfo.userId
        });
      }
      if (to.path !== path) {
        next({path})
      } else {
        next()
      }
    }
  }
});
