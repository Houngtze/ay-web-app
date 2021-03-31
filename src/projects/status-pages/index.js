import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '结果',
  router: require('./router').default,
  store: require('./store/index').default,
  api: 'statusApi',
});
