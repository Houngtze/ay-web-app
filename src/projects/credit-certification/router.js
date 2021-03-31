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
        // 信用认证主页
        {
            path: '/index',
            name: 'index',
            component: () => import('./Home/Home'),
            meta: {
                title: '信用认证'
            },
        },
        // 信用认证主页
        {
            path: '/login',
            name: 'login',
            component: () => import('@component/login/Login'),
            meta: {
                title: '登录'
            },
        },
        // 认证
        {
            path: '/credit',
            name: 'credit',
            component: () => import('./Credit/Credit'),
            meta: {
                title: '',
                needSign: true
            },
        },
        // 实名认证
        {
            path: '/baseInfo',
            name: 'baseInfo',
            component: () => import('./BaseInfo/BaseInfo'),
            meta: {
                title: '实名认证',
                needSign: true
            },
        },
        // 基础信息
        {
            path: '/personInfo',
            name: 'personInfo',
            component: () => import('./PersonInfo/PersonInfo'),
            meta: {
                title: '基础信息',
                needSign: true
            },
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
        },
    ],
};
