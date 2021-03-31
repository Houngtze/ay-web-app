import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '信用认证',
  router: require('./router').default,
  api: 'creditApi',
  source:'AYSCAPP_XYRZ'
});
