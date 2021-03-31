import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '话费充值',
  router: require('./router').default,
  api: 'prepaidRefillApi',
});
