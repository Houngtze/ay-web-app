import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '提交成功',
  router: require('./router').default,
});
