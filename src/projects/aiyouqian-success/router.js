export default {
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: () => import('./Home'),
      meta: {
        title: '提交成功',
      },
    },
    {
      path: '/wait',
      component: () => import('./Wait/Wait'),
      meta: {
        title: '个人信息确认',
      },
    },
    {
      path: '/failed',
      component: () => import('./Failed/failed'),
      meta: {
        title: '审核结果',
      },
    },
    {
      path: '/reviewing',
      component: () => import('./Reviewing/reviewing'),
      meta: {
        title: '审核中',
      },
    },
    // 银联支付回调页面
    {
      path: '/bank-pay-callback-page',
      component: () => import('./BankPaySuccess/index'),
      meta: {
        title: '支付结果',
      },
    },
    {
      path: '*',
      redirect: '/home', // 不制作 404
    },
  ],
};
