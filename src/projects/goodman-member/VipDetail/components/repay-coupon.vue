<template>
  <div class="page-content">
    <div class="intro-block">
      <h2 class="block-title">
        <img src="../../images/vip-detail/icon-qysm.png"/>
        <span>权益说明</span>
      </h2>
      <p class="desc">Ai季卡/年卡会员，即可每月获得还款券。</p>
    </div>
    <div class="banner-block">
      <img style="height: 8rem" v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/banner-repay-coupon.png'"/>
    </div>
    <div class="intro-block">
      <h2 class="block-title">
        <img src="../../images/vip-detail/icon-qyjs.png"/>
        <span>权益介绍</span>
      </h2>
      <p class="desc">1、权益使用门槛：</p>
      <p class="desc">1）爱满分消费：需分12期，分期本金达到还款券指定门槛，则发放对应面额的还款券，合计10张；</p>
      <p class="desc">2）爱有钱：需分3期，分期本金达到还款券指定门槛，则发放对应面额的还款券，合计1张；</p>
      <p class="desc">2、办理分期业务正常还款2期后自动下发还款券（还款券在合同期内有效，每月仅可使用1张）；</p>
      <p class="desc">3、成为年卡/季卡会员才能获得还款券，体验卡会员无此权益。</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "repay-coupon"
  }
</script>
