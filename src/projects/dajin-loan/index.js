import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '爱用商城',
  router: require('./router').default,
  store: require('./store/index').default,
  api: 'dajinApi'
});
