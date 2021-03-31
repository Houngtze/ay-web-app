<template>
  <div class="login-bar">
    <div class="login-top"></div>
    <div class="login-view">
      <nav>
        <span :class="{active: presentFile === 'Verify'}" @click="selectView('Verify')">验证码登录</span>
        <span :class="{active: presentFile !== 'Verify'}" @click="selectView('Password')">密码登录</span>
      </nav>
      <component :is="viewId" :disabled="!checked"></component>
    </div>
    <footer class="login-bottom">
      <protocol-item
        :linkArr="linkArr"
        @handleStatus="handleStatus">
      </protocol-item>
    </footer>
  </div>
</template>
<script>
import ProtocolItem from '@component/credit/components/ProtocolItem.vue'
export default {
  components: {
    ProtocolItem
  },
  data() {
    return {
      viewId: () => import(`./components/Verify.vue`),
      presentFile: 'Verify',
      linkArr: [{
        title: '《爱用商城用户协议》',
        url: 'http://3c.dafysz.cn/h5/sales/index.html#/CommonQK/URProtocol'
      }], // 协议列表
      checked: true
    }
  },
  methods: {
    selectView(fileName) {
      if(this.presentFile === fileName) return; // 当前视图不做处理
      this.presentFile = fileName;
      this.viewId = () => import(`./components/${fileName}.vue`)
    },
    handleStatus(status) {
      this.checked = status
    }
  }
}
</script>
<style lang="scss" scoped>
@import './style/index.scss';
.login-bar{
  // height: 100%;
  background-color: $bg-color-white;
  flex-direction: column;
  display: flex;
  height: 100%;
  .login-top{
    flex-shrink: 0;
    height: 2.4rem;
    width: 100%;
    background-size: 100%;
    background-repeat: no-repeat;
    @include bg-image('./images/bg-advert')
  }
  .login-view{
    // height: calc(100% - 3.5rem);
    height: 100%;
    padding: 0 0.72rem;
    nav{
      display: flex;
      justify-content: space-around;
      padding-top: 0.9rem;
      span{
        padding-bottom: 0.1rem;
        font-size: 0.3rem;
        font-weight: 400;
        line-height: 0.35rem;
        color: $color-main;
        &.active{
          border-bottom: 0.04rem solid $color-gold;
        }
      }
    }
  }
  .login-bottom{
    flex-shrink: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    /deep/ .protocol-item{
      div{
        p{
          color: $color-main;
        }
      }
    }
  }
}
</style>
