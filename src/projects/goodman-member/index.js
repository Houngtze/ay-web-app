import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '会员中心',
  router: require('./router').default,
  store: require('./store').default,
  api: 'vipApi',
  firstRouteBefore(to, from, next, storeInstance) {
    if (to.query.from && String(to.query.type) === '1') {
      storeInstance.dispatch('vip/setVipFrom', to.query.from )
    }
    next()
  },
});
