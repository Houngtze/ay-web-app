
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
      component: () => import('./Home/Home'),
      meta: {
        title: '爱有钱',
      },
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
    {
      path: '/liveAc',
      name: 'liveAc',
      component: () => import('@component/NewCredit/LiveAc/LiveAc'),
      meta: {
        title: '视频认证',
        needSign: true
      },
    },
    {
      path: '/identityAc',
      name: 'identityAc',
      component: () => import('@component/NewCredit/IdentityAc/IdentityAc'),
      meta: {
        title: '身份认证',
        needSign: true
      },
    },
    {
      path: '/personInfo',
      name: 'personInfo',
      component: () => import('@component/NewCredit/PersonInfo/PersonInfoA'),
      meta: {
        title: '身份认证',
        needSign: true
      },
    },
    {
      path: '/bankInfo',
      name: 'bankInfo',
      component: () => import('./Credit/BankInfo'),
      meta: {
        title: '银行卡信息',
        needSign: true
      },
    },
    {
      path: '/bankList',
      name: 'bankList',
      component: () => import('@component/NewCredit/BankInfo/BankList'),
      meta: {
        title: '银行卡列表',
        needSign: true
      },
    },
    {
      path: '/addBank',
      name: 'addBank',
      component: () => import('@component/NewCredit/InsertBank/InsertBank'),
      meta: {
        title: '新增银行卡',
        needSign: true
      },
    },
    {
      path: '/creditResult',
      name: 'creditResult',
      component: () => import('./Result/CreditResult'),
      meta: {
        title: '下载APP提现',
        needSign: true
      },
    },
  ],
};
