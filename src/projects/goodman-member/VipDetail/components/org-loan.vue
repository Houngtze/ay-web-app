<template>
  <div class="page-content">
    <div class="intro-block">
      <h2 class="block-title">
        <img src="../../images/vip-detail/icon-qysm.png"/>
        <span>权益说明</span>
      </h2>
      <p class="desc">Ai会员，可享受专属分期通道推荐。</p>
    </div>
    <div class="banner-block" @click="toDc">
      <img style="height: 2.68rem" v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/banner-dc.png'"/>
    </div>
    <div class="intro-block">
      <h2 class="block-title">
        <img src="../../images/vip-detail/icon-qyjs.png"/>
        <span>权益介绍</span>
      </h2>
      <p class="desc">1、开通Ai会员，即可享受专属分期通道推荐；</p>
      <p class="desc">2、会员用户可在爱有钱页面点击推荐入口申请；</p>
      <p class="desc">3、借款服务由第三方提供，本平台只负责向优质会员推荐</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "org-loan",
    props: ["isVip"],
    methods: {
      toDc() {
        if (this.isVip) {
          window.location.href = window.location.origin + "/custom-page/jyc-xjd/#/org-loan-list"
        } else {
          this.$router.push({path: "/vip-pay"})
        }
      }
    }
  }
</script>
