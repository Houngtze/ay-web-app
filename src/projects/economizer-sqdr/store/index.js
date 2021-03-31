import Vue from 'vue';
import Vuex from 'vuex';
import addr from './addr';
import activityList from './activityList';
import orderList from './orderList';
import order from './order';
import payway from './payWay';
import top from './top';
import edit from './edit';

Vue.use(Vuex);

export default {
  modules: {
    addr,
    activityList,
    orderList,
    order,
    payway,
    top,
    edit,
  },
};
