import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '账单',
  api: 'billApi',
  store: require('./store').default,
  router: require('./router').default,
});
