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
  import env from '@/helpers/env';
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage ,timestampToTime} from '@/helpers/utils';
import list from './components/List';
export default {
  components: {
    list
  },
  data(){
    return{
      tabHover:true,
      productEncash:0,
      ultimaEncash:0,
      listData:[],
      isApp:env.isJXHAPP(),
      menuStatic: 1,
    }
  },
  beforeMount(){
  },
  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      personId: state => state.global.userInfo.idPerson,
      ucAccountId: state => state.global.userInfo.ucAccountId,
      clientCode: state => state.global.clientCode
    }),
  },
  created() {
    if (this.$route.query.menuStatic) this.menuStatic = Number(this.$route.query.menuStatic)
  },
  mounted(){
  },
  methods:{

  },
}
</script>
<style lang="scss" scoped>// scoped
.inner-body{
  width: 100%;
  height: inherit;
  min-height: 100%;
  flex-direction: column;
  // background: #fff;
  .header{
    flex-shrink: 0;
    height: 1rem;
    overflow: hidden;
    border-bottom: 0.2rem solid #f2f2f2;
    display: flex;
    background-color: #fff;
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
