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
    // 信用提额主页
    {
      path: '/index',
      name: 'index',
      component: () => import('./Home/Home'),
      meta: {title: '信用提额'},
    },
    // 授权
    {
      path: '/authorization',
      name: 'authorization',
      component: () => import('./Authorization'),
      meta: {
        title: '授权',
        needSign: true
      },
    },
    // 协议
    {
      path: '/agreement',
      name: 'agreement',
      component: () => import('./Agreement/Agreement'),
      meta: {
        title: '授权协议',
        needSign: true
      },
    },
    {
      path: '/',
      redirect: 'index'
    }
  ],
};
