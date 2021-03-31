
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
        needSign: true
      },
    },
    {
      path: '/loan',
      name: 'loan',
      component: () => import('./Loan/Loan'),
      meta: {
        title: '爱有钱',
        needSign: true
      },
    },
    {
      path: '/loan-enter',
      name: 'loanEnter',
      component: () => import('./Loan/LoanEnter'),
      meta: {
        title: '借款确认',
        needSign: true
      },
    },
    {
      path: '/my-loan',
      redirect: '/repayment/home',
      // name: 'myLoan',
      // component: () => import('./MyLoan/MyLoan'),
      // meta: {
      //   title: '我的借款',
      //   needSign: true
      // },
    },
    {
      path: '/open-msg',
      redirect: '/operator',
      // name: 'openMsg',
      // component: () => import('./OpenMsg/OpenMsg'),
      // meta: {
      //   title: '激活现金额度需补充以下资料',
      //   needSign: true
      // },
    },
    {
      path: '/operator',
      name: 'operator',
      component: () => import('./OpenMsg/Operator'),
      meta: {
        title: '激活现金额度需补充以下资料',
        needSign: true
      },
    },
    {
      path: '/result-pay',
      name: 'resultPay',
      component: () => import('./Result/ResultPay'),
      meta: {
        title: '审核通过',
        // needSign: true
      },
    },
    {
      path: '/result-static',
      name: 'resultStatic',
      component: () => import('./Result/ResultStatic'),
      meta: {
        title: '爱有钱',
        needSign: true
      },
    },
    {
      path: '/pay-success',
      name: 'paySuccess',
      component: () => import('./Result/PaySuccess'),
      meta: {
        title: '待提现',
        needSign: true
      },
    },
    {
      path: '/result-loan',
      name: 'resultLoan',
      component: () => import('./Result/ResultLoan'),
      meta: {
        title: '待提现',
        needSign: true
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@component/login/Login'),
      meta: {
        title: '爱有钱'
      },
    },
    {
      path: '/loan-detail',
      name: 'loan-detail',
      component: () => import('./LoanList/LoanDetail'),
      meta: {
        title: '借款详情',
        needSign: true
      },
    },
    {
      path: '/order-list',
      name: 'orderList',
      component: () => import('./OrderList/OrderList'),
      meta: {
        title: '待确认订单',
        needSign: true
      },
    },
    {
      path: '/loan-list',
      redirect: '/repayment/loan-list',
      // name: 'loanList',
      // component: () => import('./LoanList/LoanList'),
      // meta: {
      //   title: '借款记录',
      //   needSign: true
      // },
    },
    {
      path: '/bank-list',
      name: 'bankList',
      component: () => import('./Bank/BankList'),
      meta: {
        title: '银行卡列表',
        needSign: true
      },
    },
    {
      path: '/bank-list-rz',
      name: 'bankListRZ',
      component: () => import('./Bank/BankListRZ'),
      meta: {
        title: '银行卡列表',
        needSign: true
      },
    },
    {
      path: '/add-bank-rz',
      name: 'addBankRZ',
      component: () => import('@component/credit/InsertBank/InsertBankRZ'),
      meta: {
        title: '新增银行卡',
        needSign: true
      },
    },
    {
      path: '/bind-bank',
      name: 'bindBank',
      component: () => import('./Bank/Bind'),
      meta: {
        title: '绑定收款卡',
        needSign: true
      },
    },
    {
      path: '/result-bind',
      name: 'resultBind',
      component: () => import('./Result/ResultBind'),
      meta: {
        title: '放款中',
        needSign: true
      },
    },
    {
      path: '/patch',
      name: 'patch',
      component: () => import('./Patch/Patch'),
      meta: {
        title: '等待放款',
        needSign: true
      },
    },
    {
      path: '/patch-ers',
      name: 'patch-ers',
      component: () => import('./Patch/PatchErs'),
      meta: {
        title: '添加放款方',
        needSign: true
      },
    },
    {
      path: '/ers-html',
      name: 'ersHtml',
      component: () => import('./Patch/ErsHtml'),
      meta: {
        title: '',
        needSign: true
      },
    },
    {
      path: '/loan-failed',
      name: 'loanFailed',
      component: () => import('./Result/LoanFalse'),
      meta: {
        title: '',
        needSign: true
      },
    },
    {
      path: '/ayq-app-home',
      name: 'ayq-app-home',
      component: () => import('./AYQ_APP/Home'),
      meta: {
        title: '爱有钱',
        keepAlive: true
      },
    },
    {
      path: '/ayq-app-my',
      name: 'ayq-app-my',
      component: () => import('./AYQ_APP/My'),
      meta: {
        title: '我的'
      },
    },
    {
      path: '/repayment/home',
      name: 'repayment-home',
      component: () => import('./Repayment/Home'),
      meta: {
        title: '我的借款',
        needSign: true
      },
    },
    {
      path: '/repayment/loan-list',
      name: 'repayment-loan-list',
      component: () => import('./Repayment/LoanList/LoanList'),
      meta: {
        title: '借款记录',
        needSign: true
      },
    },
    {
      path: '/repayment/detail',
      name: 'repayment-detail',
      component: () => import('./Repayment/Detail/Detail'),
      meta: {
        title: '账单详情',
        needSign: true
      },
    },
    {
      path: '/repayment/repay-list',
      name: 'repayment-repay-list',
      component: () => import('./Repayment/RepayList/RepayList'),
      meta: {
        title: '还款记录',
        needSign: true
      },
    },
    {
      path: '/baseInfo',
      name: 'baseInfo',
      component: () => import('./Credit/BaseInfoUrl'),
      meta: {
        title: '基本信息校验',
        needSign: true
      },
    },
    {
      path: '/liveAc',
      name: 'liveAc',
      component: () => import('@component/NewCredit/LiveAc/LiveAc'),
      meta: {
        title: '视频认证',
        needSign: true
      },
    },
    {
      path: '/identityAc',
      name: 'identityAc',
      component: () => import('@component/NewCredit/IdentityAc/IdentityAc'),
      meta: {
        title: '身份认证',
        needSign: true
      },
    },
    {
      path: '/personInfo',
      name: 'personInfo',
      component: () => import('@component/NewCredit/PersonInfo/PersonInfoA'),
      meta: {
        title: '身份认证',
        needSign: true
      },
    },
    {
      path: '/bankInfo',
      name: 'bankInfo',
      component: () => import('./Credit/BankInfo'),
      meta: {
        title: '银行卡信息',
        needSign: true
      },
    },
    {
      path: '/addBank',
      name: 'addBank',
      component: () => import('@component/NewCredit/InsertBank/InsertBank'),
      meta: {
        title: '新增银行卡',
        needSign: true
      },
    },
    {
      path: '/creditResult',
      name: 'creditResult',
      component: () => import('./Credit/CreditResult'),
      meta: {
        title: '爱有钱',
        needSign: true
      },
    },
    {
      path: '/org-loan-list',
      name: 'org-loan-list',
      component: () => import('./OrgLoan'),
      meta: {
        title: '专属放款通道推荐',
        needSign: true
      },
    },
    {
      path: '/dajin-loan',
      name: 'dajin-loan',
      component: () => import('./Dajin'),
      meta: {
        title: '完善资料',
        needSign: true
      },
    },
  ],
};
