export default {
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      component: () => import('./Home/Home'),
      meta: {
        title: '借钱',
      },
    },
    {
      path: '/marketing',
      component: () => import('./Marketing/Marketing'),
      meta: {
        title: '借钱',
      },
    },
    {
      path: '/goldmore',
      component: () => import('./GoldMore/GoldMore'),
      meta: {
        title: '会员礼包',
      },
    },
    {
      path: '/goldmore2',
      component: () => import('./GoldMore/GoldMore2'),
      meta: {
        title: '会员礼包',
      },
    },
    {
      path: '/golddetail',
      component: () => import('./GoldMore/Detail'),
      meta: {
        title: '产品详情',
      },
    },
    {
      path: '/goldcode',
      component: () => import('./GoldMore/Code'),
      meta: {
        title: '微信支付',
      },
    },
    {
      path: '/login',
      component: () => import('./LoanSupermarket/Register'),
      meta: {
        title: '爱有钱',
      },
    },
    {
      path: '/sm-supermarket',
      component: () => import('./LoanSupermarket/Supermarket'),
      meta: {
        title: '爱有钱',
        needSign: true,
      },
    },
    {
      path: '/baseInfo',
      component: () => import('@/components/NewCredit/BaseInfo'),
      meta: {
        title: '实名认证',
        needSign: true,
      },
    },
    {
      path: '/wxlink',
      component: () => import('./LoanSupermarket/WxLink'),
      meta: {
        title: '爱有钱',
        needSign: true,
      },
    },
  ],
};
