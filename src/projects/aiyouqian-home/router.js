export default {
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: () => import('./Activate/Activate'),
      meta: {
        title: '借钱',
      },
    },
    {
      path: '/new',
      component: () => import('./ActivateNew/ActivateNew'),
      meta: {
        title: '信用生活',
      },
    },
    {
      path: '/login',
      component: () => import('@/components/login/Login'),
      meta: {
        title: '登录',
      },
    },
    {
      path: '*',
      redirect: '/home', // 不制作 404
    },
  ],
};
