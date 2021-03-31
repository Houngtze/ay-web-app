export default {
  routes: [
    // 登录
    {
      path: '/login',
      name: 'login',
      component: () => import('@component/login/Login'),
      meta: {
        title: '登录'
      },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('./Home'),
      meta: {title: '会员中心'},
    },
    // 购买会员
    {
      path: '/vip-pay',
      name: 'vip-pay',
      component: () => import('./VipPay'),
      meta: {
        title: '会员中心',
        needSign: true
      }
    },
    {
      path: '/baseInfo',
      name: 'baseInfo',
      component: () => import('@component/NewCredit/BaseInfo'),
      meta: {
        title: '基本信息校验',
        needSign: true
      },
    },
    // 详情
    {
      path: '/vip-detail/:type',
      name: 'vip-detail',
      component: () => import('./VipDetail'),
      meta: {title: '详情介绍'}
    },
    // 领取会员商品
    {
      path: '/send-gift',
      name: 'send-gift',
      component: () => import('./SendGift'),
      meta: {title: '领取会员专属礼品', needSign: true}
    },
    {
      path: '*',
      redirect: 'home'
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@component/404'),
      meta: {
        title: '页面出错'
      },
    },
  ],
};
