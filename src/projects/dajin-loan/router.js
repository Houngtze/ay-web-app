
export default {
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('./Home'),
      meta: {
        title: '借款申请',
        needSign: true
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@component/login/Login'),
      meta: {
        title: '爱用商城'
      },
    },
  ],
};
