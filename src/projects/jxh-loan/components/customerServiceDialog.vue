<template>
  <div class="kf-model" v-if="kfModel">
    <div class="bg">
      <div class="txt">
        <p class="p1">请拨打客服热线4001868888</p>
        <p class="p2">（时间9:00-18:00）</p>
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
      width: 6rem;
      height: 3.12rem;
      background: #fff;
      border-radius: 0.1rem;
      text-align: center;
      padding: 0.48rem 0 0.48rem 0;
      p{
        color: #363636;
      }
      .p1{
        font-weight: 400;
        font-size: 0.30rem;
        line-height: 0.28rem;
        margin-bottom: 0.12rem;
        font-weight:600;
      }
      .p2{
        font-size: 0.30rem;
        line-height: 0.34rem;
        margin-bottom: 0.48rem;
        font-weight:600;
      }
      .enter{
        width:5.04rem;
        height:0.84rem;
        line-height: 0.84rem;
        background:rgba(186,153,80,1);
        border-radius:0.42rem;
        margin: 0 auto;
        font-size: 0.32rem;
        color:#fff;
      }
    }
  }
</style>
