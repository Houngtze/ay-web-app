<template>
  <div class="coupon-block">
    <h3>{{data.areaName}}</h3>
    <div class="coupon-adv">
      <img src="../../images/icon-coupon-adv.png">
      <div class="desc">
        <h4>{{advDesc.length && advDesc[0]}} <img src="../../images/icon-arrow-right-black.png"></h4>
        <p>{{advDesc.length && advDesc[1]}}</p>
      </div>
      <button @click="toProduct">{{level != 'default' ? "立即使用" : "开通立享"}}</button>
    </div>
    <div class="coupon-list">
      <coupon :data="item" v-for="(item, index) in data.areaList" :level="level" :key="index" type="life"/>
      <div class="coupon-more" @click="toCoupon">
        <p>查看更多 》</p>
      </div>
    </div>
  </div>
</template>

<script>
  import coupon from "./coupon"
  import env from "@/helpers/env"
  export default {
    name: "vipShopCoupon",
    props: ["data", "level"],
    components: {coupon},
    computed: {
      advDesc() {
        return this.data && this.data.areaTitle && this.data.areaTitle.indexOf(">") > -1 && this.data.areaTitle.split(">")
      }
    },
    methods: {
      toProduct() {
        if (this.level == 'default') {
          this.$router.push({path: "/vip-pay"})
        }  else {
          this.$emit("onActiveToProductList")
        }
      },
      toCoupon() {
        if (this.level == 'default') {
          this.$router.push({path: "/vip-pay"})
        } else {
          if (env.isApp()) {
            return this.$nativeBridge.jumpNativeForType(7, "")
          } else {
            return this.$toast("请在爱用商城app中操作")
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .coupon-adv{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 1.4rem;
    background: linear-gradient(90deg, #FBE8C7 0%, #F7D7A4 100%);
    border-radius: .14rem;
    padding: .28rem .26rem .3rem .26rem;
    img{
      width: .82rem;
      display: inline-block;
      margin-right: .14rem;
    }
    .desc{
      color: #583A18;
      h4{
        font-size: .3rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: left;
        line-height: .42rem;
        text-align: left;
        img{
          width: .26rem;
          display: inline-block;
        }
      }
      p{
        font-size: .24rem;
        text-align: left;
      }
    }
    button{
      min-width: 1.44rem;
      height: .54rem;
      border: none;
      line-height: .54rem;
      background: linear-gradient(90deg, #55402E 0%, #3D352E 100%);
      border-radius: .29rem;
      padding: 0 .18rem;
      font-size: .26rem;
      font-family: PingFang-SC-Medium, PingFang-SC;
      color: #FFFFFF;
    }
  }
  .coupon-list{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    .coupon-more{
      margin-top: .2rem;
      width: 3.22rem;
      height: 1.6rem;
      background: #D8D8D8 linear-gradient(171deg, #FEFAF2 0%, #FCF1DA 100%);
      border-radius: .14rem;
      display: inline-flex;
      text-align: center;
      justify-items: center;
      align-items: center;
      p{
        flex: 1;
        text-align: center;
        font-size: .24rem;
        color: #653E20;
        line-height: .34rem;
      }
    }
  }
</style>
