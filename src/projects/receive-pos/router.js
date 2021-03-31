export default {
    routes: [
        // 免费领POS机主页
        {
            path: '/index',
            name: 'index',
            component: () => import('./Home/Home'),
            meta: {
                title: '免费领POS机'
            },
        },
        // 登录
        {
            path: '/login',
            name: 'login',
            component: () => import('@component/login/Login'),
            meta: {
                title: '登录'
            },
        },
        // 领取成功
        {
            path: '/result',
            name: 'result',
            component: () => import('./Result/Result'),
            meta: {
                title: '免费领POS机',
                needSign: true
            },
        },
        // 收银台
        {
            path: '/cashier',
            name: 'cashier',
            component: () => import('./Cashier/Cashier'),
            meta: {
                title: '收银台',
                needSign: true
            },
        },
        // 规则/订单
        {
            path: '/orders',
            name: 'orders',
            component: () => import('./Orders/Orders'),
            meta: {
                title: '免费领POS机',
                needSign: true
            },
        },
    ],
};
