export default {
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    // 话费充值主页
    {
      path: '/index',
      name: 'index',
      component: () => import('./Home/Home'),
      meta: {
        title: '话费充值'
      },
    },
    // 登录
    {
      path: '/login',
      name: 'login',
      component: () => import('@component/login/Login'),
      meta: {
        title: '登录'
      },
    },
    // 充值成功
    {
      path: '/result',
      name: 'result',
      component: () => import('./Result/Result'),
      meta: {
        title: '支付结果',
        needSign: true
      },
    },
    // 收银台
    {
      path: '/cashier',
      name: 'cashier',
      component: () => import('./Cashier/Cashier'),
      meta: {
        title: '收银台',
        needSign: true
      },
    },
    // 详情
    {
      path: '/detail',
      name: 'detail',
      component: () => import('./Detail/Detail'),
      meta: {
        title: '订单详情',
        needSign: true
      },
    },
  ],
};
