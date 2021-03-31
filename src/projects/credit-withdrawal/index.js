import mountApp from '../mountApp';

mountApp(require('./Index.vue').default, {
  title: '信用提额',
  router: require('./router').default,
  api: 'withdrawalApi',
  source:'AYSCAPP_XYTE'
});
