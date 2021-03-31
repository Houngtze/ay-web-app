
export default {
  routes: [
    {
      path: '/',
      redirect: '/mindex',
    },
    {
      path: '*',
      redirect: '/mindex',
    },
    {
      path: '/mindex',
      name: 'index',
      component: () => import('./Mindex/Mindex'),
      meta: {
        title: '借钱'
      },
    },
    {
      path: '/show-creditcard',
      name: 'showcreditcard',
      component: () => import('./Mindex/ShowCreditCard'),
      meta: {
        title: '申请信用卡',
        needSign: false
      },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('./Home/Home'),
      meta: {
        title: '借钱',
        // needSign: true
      },
    },
    {
      path: '/loan',
      name: 'loan',
      component: () => import('./Loan/Loan'),
      meta: {
        title: '借钱',
        needSign: true,
        keepAlive: true
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
      path: '/repayment-List', //还款计划表
      name: 'repaymentList',
      component: () => import('./Loan/repaymentList'),
      meta: {
        title: '账单明细',
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
        title: '吉享花',
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
      component: () => import('./Login'),
      meta: {
        title: '吉享花'
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
      path: '/add-bank',
      name: 'addBank',
      component: () => import('./Bank/InsertBank'),
      meta: {
        title: '新增银行卡',
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
        needSign: true,
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
      path: '/bankInfo',
      name: 'bankInfo',
      component: () => import('./Credit/BankInfo'),
      meta: {
        title: '银行卡信息',
        needSign: true
      },
    },
    {
      path: '/creditResult',
      name: 'creditResult',
      component: () => import('./Credit/CreditResult'),
      meta: {
        title: '吉享花',
        needSign: true
      },
    },
    {
      path: '/ResultNew',
      name: 'ResultNew',
      component: () => import('./Result/ResultNew'),
      meta: {
        title: '借钱',
        needSign: true
      },
    },
  ],
};
