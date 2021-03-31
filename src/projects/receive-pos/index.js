import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '免费领POS机',
  router: require('./router').default,
  api: 'receivePosApi',
});
