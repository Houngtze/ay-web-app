import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '借钱',
  router: require('./router').default
});
