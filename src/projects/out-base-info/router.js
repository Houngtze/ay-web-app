
export default {
  routes: [
    {
      path: '/',
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
  ],
};
