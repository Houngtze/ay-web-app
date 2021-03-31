const loginPage = () => {
  if (window.location.href.indexOf("jxh") > -1) {
    return import("@/components/jxh/jxh-login/login")
  }
  return import("@/components/login/Login")
}

export default {
  routes: [
    {
      path: '/',
      redirect: '/404',
    },
    /*
      *爱花账单业务：对应不同资金方有不同账单页面
     */
    //  爱花（读秒）账单
    {
      path: '/aihua/pintec/home',
      component: () => import('./aihua/pintec/Home'),
      meta: {
        title: '爱花账单明细',
        needSign: true
      },
    },
    // 爱花（读秒）授信回调
    {
      path: '/aihua/pintec/pending',
      component: () => import('./aihua/pintec/Pending'),
      meta: {
        title: '审核结果',
        needSign: true
      },
    },
    //  爱花（加油宝）账单
    {
      path: '/aihua/jiayoubao/home',
      component: () => import('./aihua/jiayoubao/Home'),
      meta: {
        title: '爱花账单明细',
        needSign: true
      },
    },
    /*
      *爱满分2账单业务
     */
    {
      path: '/aimanfen/bill',
      component: () => import('./aimanfen/Home'),
      meta: {
        title: '爱满分账单明细',
        needSign: true
      },
    },
    /*
      *吉享花账单
     */
    {
      path: '/aimanfen/jxh-bill',
      component: () => import('./aimanfen/JXH'),
      meta: {
        title: '账单明细',
        // needSign: true
      },
    },
    {
      path: '/login',
      component: () => loginPage(),
      meta: {
        title: '登录',
      },
    },
    {
      path: '/404',
      component: () => import('./404/index'),
      meta: {
        title: '404',
      },
    },
  ],
};
