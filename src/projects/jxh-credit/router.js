
export default {
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/login',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('./Home'),
      meta: {
        title: '吉享花',
      },
    },
    {
      path: '/identityAc',
      name: 'identityAc',
      component: () => import('./Credit/IdentityAc'),
      meta: {
        title: '身份认证',
        needSign: true,
        keepAlive: true
      },
    },
    {
      path: '/liveAc',
      name: 'liveAc',
      component: () => import('@component/jxh/jxh-credit/LiveAc'),
      meta: {
        title: '视频认证',
        needSign: true
      },
    },
    {
      path: '/personInfo',
      name: 'personInfo',
      component: () => import('./Credit/PersonInfo'),
      meta: {
        title: '个人信息',
        needSign: true
      },
    },
    {
      path: '/bankList',
      name: 'bankList',
      component: () => import('@component/jxh/jxh-credit/AddBank/BankList'),
      meta: {
        title: '支持的银行卡列表',
        needSign: true
      },
    },
    {
      path: '/addBank',
      name: 'addBank',
      component: () => import('@component/jxh/jxh-credit/AddBank/InsertBank'),
      meta: {
        title: '银行卡信息',
        needSign: true
      },
    },
    {
      path: '/creditResult',
      name: 'creditResult',
      component: () => import('./Result/CreditResult'),
      meta: {
        title: '审核结果',
        needSign: true
      },
    },
  ],
};
