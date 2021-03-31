import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '爱赚钱',
  router: require('./router').default,
  // store: require('./store/index').default,
  api: 'outApi',
});
