
export default {
  routes: [
    {
      path: '/',
      redirect: '/identityAc',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("./Login"),
      meta: {
        title: '登陆/注册',
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
        needSign: true,
        isShowTerm: false
      }
    },
    {
      path: '/applyLoan',
      name: 'applyLoan',
      component: () => import('./Credit/applyLoan'),
      meta: {
        title: '分期信息',
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
