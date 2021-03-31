<template>
  <div class="kf-model" v-if="kfModel">
    <div class="bg">
      <div class="txt">
        <p class="p1">爱有钱提现相关问题请咨询微信客服</p>
        <p class="p2">微信客服：关注“爱用商城APP”微信公众号</p>
        <p class="p3">服务时间：周一至周日9:00-18:30</p>
      </div>
      <p class="enter" @click="kfClick">我知道了</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "customerServiceDialog",
    props: {
      kfModel: {
        required: true,
        default: false
      }
    },
    methods: {
      kfClick() {
        this.$emit('handleCustomerDialog', false)
      }
    }
  }
</script>

<style scoped lang="scss">
  .kf-model{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba($color: #000000, $alpha: .6);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .bg{
      width: 5.6rem;
      height: auto;
      background: #fff;
      overflow: hidden;
      border-radius: 0.1rem;
      text-align: center;
      p{
        color: #363636;
      }
      .p1{
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.28rem;
        margin: 0.4rem 0;
      }
      .p2{
        font-size: 0.26rem;
        line-height: 0.34rem;
      }
      .p3{
        font-size: 0.26rem;
        line-height: 0.26rem;
        margin: 0.3rem 0 0.4rem 0;
      }
      .enter{
        height: 0.82rem;
        border-top: 1px solid #E5E5E5;
        line-height: 0.82rem;
        font-size: 0.3rem;
      }
    }
  }
</style>
