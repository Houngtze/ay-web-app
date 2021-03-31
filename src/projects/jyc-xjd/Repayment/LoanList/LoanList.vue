<template>
<div class="inner-body">
  <div class="header">
    <div :class="menuStatic === 1 ? 'menu-li menu-hover' : 'menu-li'" @click="menuStatic = 1">
      <p>已放款</p>
      <i class="icon"></i>
    </div>
    <div :class="menuStatic === 2 ? 'menu-li menu-hover' : 'menu-li'" @click="menuStatic = 2">
      <p>未放款</p>
      <i class="icon"></i>
    </div>
  </div>
  <div class="in-bd">
    <list :type="menuStatic"></list>
  </div>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import list from './components/List';
export default {
  components: {
    list
  },
  data(){
    return{
      menuStatic:1,
    }
  },
  beforeMount(){
  },
  watch:{
  },
  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      personId: state => state.global.userInfo.idPerson,
    }),
  },
  created() {
  },
  mounted(){
  },
  methods:{
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>// scoped
.inner-body{
  width: 100%;
  height: inherit;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  .header{
    flex-shrink: 0;
    height: 1rem;
    overflow: hidden;
    border-bottom: 0.2rem solid #f2f2f2;
    display: flex;
    background: #fff;
    .menu-li{
      flex: 1;
      font-size: 0.32rem;
      color: #a8a8a8;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      line-height: 0.44rem;
      .icon{
        width: 0.56rem;
        height: 0.08rem;
        background: #fff;
        margin-top: 0.1rem;
      }
    }
    .menu-hover{
      color: #363636;
      .icon{
        background: #363636;
      }
    }
  }
  .in-bd{
    height: inherit;
    min-height: 100%;
  }
}
</style>


