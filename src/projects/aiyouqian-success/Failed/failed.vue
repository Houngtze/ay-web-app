<template>
  <SalePageLayout :isFullScreen="true">
    <ai-template :message="pageMessage">
      <template slot="image">
        <img src="./image/audit@2x.png" srcset="./image/audit@3x.png">
      </template>
      <template slot="dec">
        <p class="warning">商城消费能提升申请通过率哟，超多低价秒杀活动等你来</p>
      </template>
      <template slot="bottom"> 
        <div class="buttom">
          <p @click="goHome">返回</p>
        </div>
      </template>
    </ai-template>
  </SalePageLayout>
</template>
<script>
import SalePageLayout from '@/components/SalePageLayout';
import AiTemplate from '../components/template'
export default {
  components: {
    AiTemplate,
    SalePageLayout
  },
  data() {
    return {
      pageMessage:'申请失败'
    }
  },
  methods: {
    goHome() {
      this.$nativeBridge.jumpToAppIndex();
    },
    goOrder() {
      this.$nativeBridge.jumpToAppOrderCenter({orderState: '0'});
    }
  }
}
</script>

<style lang="scss" scoped>
.warning{
  font-size: 0.24rem;
  color:#a8a8a8;
  line-height: 0.36rem;
}
.buttom{
  display: flex;
  flex-direction: column;
  align-items: center;
  p{
    width: 4rem;
    height: 1rem;
    line-height: 0.8rem;
    margin-top: 0.5rem;
    -webkit-appearance: none;
    background-image: url(/custom-page/img/button.435d9c35.png);
    background-repeat: no-repeat;
    background-color: transparent;
    background-size: 100% 100%;
    background-position: bottom;
    border: none;
    font-size: 0.35rem;
    color: #ffffff;
  }
  span{
    font-size: 0.24rem;
    color:#363636;
    line-height: 0.36rem;
  }
}
</style>
