export default {
  routes: [
    {
      path: '/home',
      component: () => import('./Home/Home'),
      meta: {
        title: '省钱达人'
      },
    },
    {
      path: '/img-shower',
      component: () => import('./components/ImgShower/ImgShower'),
      meta: {
        title: '省钱达人',
      },
    },
    {
      path: '/login',
      component: () => import('@component/login/Login'),
      meta: {
        title: '登录',
      },
    },
    {
      path: '/detail',
      component: () => import('./Detail/Detail'),
      meta: {
        title: '产品详情'
      },
    },
    {
      path: '/cashier',
      component: () => import('./Cashier/Cashier'),
      meta: {
        title: '支付',
        needSign: true
      },
    },
    {
      path: '/addr-list',
      component: () => import('./components/AddAdress/AddrList'),
      meta: {
        title: '收货地址列表',
        needSign: true
      },
    },
    {
      path: '/add-address',
      component: () => import('./components/AddAdress/Add'),
      meta: {
        title: '添加收货地址',
        needSign: true
      },
    },
    {
      path: '/add-payway',
      component: () => import('./components/AddPayWay/AddPay'),
      meta: {
        title: '添加微信&支付宝',
        needSign: true
      },
    },
    {
      path: '/pay-shower',
      component: () => import('./components/AddPayWay/Shower'),
      meta: {
        title: '收款账户',
        needSign: true
      },
    },
    {
      path: '/payway-list',
      component: () => import('./components/AddPayWay/PayWayList'),
      meta: {
        title: '收款账户',
        needSign: true
      },
    },
    {
      path: '/order-detail',
      component: () => import('./OrderDetail/OrderDetail'),
      meta: {
        title: '订单详情',
        needSign: true
      },
    },
    {
      path: '/order',
      component: () => import('./OrderList/OrderList'),
      meta: {
        title: '我参与的',
        needSign: true
      },
    },
    {
      path: '/success',
      component: () => import('./OrderSuccess/OrderSuccess'),
      meta: {
        title: '支付结果'
      },
    },
    {
      path: '/result',
      component: () => import('./OrderResult/OrderResult'),
      meta: {
        title: '开奖结果'
      },
    },
    {
      path: '/rule',
      component: () => import('./Rule/Rule'),
      meta: {
        title: '活动规则'
      },
    },
    {
      path: '/new-record',
      component: () => import('./NewRecord/NewRecord'),
      meta: {
        title: '最新揭晓'
      },
    },
    {
      path: '/share',
      component: () => import('./Share/Share'),
      meta: {
        title: '邀请助力',
      },
    },
    {
      path: '/my-code',
      component: () => import('./OrderDetail/MyCode'),
      meta: {
        title: '我参与的'
      },
    },
    {
      path: '/goods-return',
      component: () => import('./OrderDetail/GoodsReturn'),
      meta: {
        title: '我参与的'
      },
    },
    {
      path: '/new-guide',
      component: () => import('./NewGuide'),
      meta: {
        title: '新手指引'
      },
    },
    {
      path: '*',
      redirect: '/home', // 不制作 404
    },
  ],
};
