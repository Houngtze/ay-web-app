
export default {
  routes: [
    // 登陆
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/login/Login'),
      meta: {
        title: '登陆'
      },
    },
    // 授信结果页面
    {
      path: '/creditResult',
      name: 'creditResult',
      component: () => import('./Consume/CreditResult'),
      meta: {
        title: '审核结果',
        needSign: true
      },
    },
    /*
    * E融所开户逻辑
    * */
    // E融所开户引导页
    {
      path: '/e-guide-confirm',
      name: 'e-guide-confirm',
      component: () => import('./Consume/E_Guide_Confirm'),
      meta: {
        title: '支付结果',
        needSign: true
      },
    },
    // E融所开户成功中间页面
    {
      path: '/e-guide-middleware',
      name: 'e-guide-middleware',
      component: () => import('./Consume/E_Guide_MiddleWare'),
      meta: {
        title: '支付结果',
        // needSign: true
      },
    },
    // 订单审核中，需要操作确认（受托支付等）
    {
      path: '/e-guide-examine',
      name: 'e-guide-examine',
      component: () => import('./Consume/E_Guide_Examine'),
      meta: {
        title: '审核中',
        // needSign: true
      },
    },
    // 订单审核中（无需资金方确认操作，下单结果页）
    {
      path: '/e-guide-examine-direct',
      name: 'e-guide-examine-direct',
      component: () => import('./Consume/E_Guide_Examine_Direct'),
      meta: {
        title: '审核中',
        // needSign: true
      },
    },
    // 订单审核结果
    {
      path: '/apply-result',
      name: 'apply-result',
      component: () => import('./Consume/applyResult'),
      meta: {
        title: '审核结果',
        // needSign: true
      },
    },
    // E融所忘记密码
    {
      path: '/e-forget-password',
      name: 'e-forget-password',
      component: () => import('./Consume/E_ForgetPassword'),
      meta: {
        title: '忘记密码',
        needSign: true
      },
    },
    // PPM开户确认页面
    {
      path: '/ppm-confirm',
      name: 'ppm-confirm',
      component: () => import('./Consume/PPM_Confirm'),
      meta: {
        title: '支付结果',
        needSign: true
      },
    },
    // 跳转页面中间页判断（app使用）
    {
      path: '/skip-middlepage',
      name: 'skip-middlepage',
      component: () => import('./Consume/Skip_MiddlePage'),
      meta: {
        title: '跳转中...',
        needSign: true
      },
    },
    /*
    * 资金方银行卡操作页面
    * */
    //  绑定银行卡
    {
      path: '/bind-bankcard',
      name: 'bind-bankcard',
      component: () => import('./CompleteInfo/FinancingBindBankcard/BindBankcard'),
      meta: {
        title: '绑定银行卡',
        needSign: true
      },
    },
    //  绑卡列表
    {
      path: '/bankcard-list',
      name: 'bankcard-list',
      component: () => import('./CompleteInfo/FinancingBindBankcard/BankList'),
      meta: {
        title: '选择银行卡',
        needSign: true
      },
    },
    {
      path: '/add-bankcard',
      name: 'add-bankcard',
      component: () => import('./CompleteInfo/FinancingBindBankcard/InsertBank'),
      meta: {
        title: '添加银行卡',
        needSign: true
      },
    },
    /*
    * 2019.05.23 聚有财受托支付
    * */
    {
      path: '/jyc-examine',
      name: 'jyc-examine',
      component: () => import('./Consume/JYC_Examine'),
      meta: {
        title: '支付结果',
        needSign: true
      },
    },
    /*
    * 2019.06.12
    * 新增短信补件页面
    * 包括 绑卡、开户、受托
    * */
    //
    {
      path: '/complete-skip-middlepage',
      name: 'complete-skip-middlepage',
      component: () => import('./CompleteInfo/SMSCompleteInfo/CompleteSkip_MiddlePage'),
      meta: {
        title: '跳转中'
      },
    },
    {
      path: '/complete-bind-bank',
      name: 'complete-bind-bank',
      component: () => import('./CompleteInfo/SMSCompleteInfo/CompleteBindBankcard'),
      meta: {
        title: '绑定银行卡'
      },
    },
    {
      path: '/complete-jyc-examine',
      name: 'complete-jyc-examine',
      component: () => import('./CompleteInfo/SMSCompleteInfo/CompleteJYC_Examine'),
      meta: {
        title: '受托支付'
      },
    },
    {
      path: '/complete-result',
      name: 'complete-result',
      component: () => import('./CompleteInfo/SMSCompleteInfo/CompleteResult'),
      meta: {
        title: '审核提交完成'
      },
    },
  //  2019-07-16 新增补件步骤：二合一授权
    {
      path: '/complete-two-one-auth',
      name: 'complete-two-one-auth',
      component: () => import('./CompleteInfo/SMSCompleteInfo/CompleteTwoOneAuth'),
      meta: {
        title: '分期授权'
      },
    },
    // 合约机授信简化-个人信息补件
    {
      path: '/jxh-personal-info-complete-info',
      name: 'personal-info-complete-info',
      component: () => import('./CompleteInfo/CreditCompleteInfo/PersonalInfoCompleteInfo'),
      meta: {
        title: '补充个人信息',
        needSign: true
      },
    },
    /*
    *
    * 吉享花页面
    *
    * */
    // 个人中心-会员跳转中间页
    {
      path: '/jxh-vip-page',
      name: 'jxh-vip-page',
      component: () => import('./JXH/Center/JXHVipPage'),
      meta: {
        title: '跳转中。。',
        needSign: true
      },
    },
    {
      path: '/jxh-contractList',
      name: 'jxh-ContractList',
      component: () => import('./JXH/Center/CompleteInfo/ContractList'),
      meta: {
        title: '合同列表',
        needSign: true
      },
    },
    {
      path: '/jxh-messageCompleteInfo',
      name: 'jxh-MessageCompleteInfo',
      component: () => import('./JXH/Center/CompleteInfo/MessageCompleteInfo'),
      meta: {
        title: '资料补传',
        needSign: true
      },
    },
    {
      path: '/jxh-previewPdf',
      name: 'jxh-previewPdf',
      component: () => import('./components/previewPdf/previewPdf'),
      meta: {
        title: '合同预览',
        needSign: false
      },
    },

    {
      path: '/third-href',
      name: 'third-href',
      component: () => import('./ThirdHref'),
      meta: {
        title: '跳转中...',
        needSign: true
      },
    },
    {
      path: '*',
      name: '404',
      component: () => import('@component/404/index'),
      meta: {
        title: '页面出错'
      },
    },
  ],
};
