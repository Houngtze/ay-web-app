<template>
  <div class="page-layout" v-if="pageData">
    <div :class="isVip ? 'page-header' : 'page-header default'">
      <vip-info :data="pageData" :vipLevel="vipLevel" />
      <vip-loan-adv :isVip="isVip" />
    </div>
    <div class="page-content" v-if="pageData">
      <!-- 权益 -->
      <vip-power-block :data="powerData" :isVip="isVip" :vipLevel="vipLevel" :userId="userId"/>
      <!-- 买就送扫地机器人 -->
      <template v-if="!isVip" >
        <div :class="isToTop ? 'buy-button to-bottom' : 'buy-button'" id="buyButton" @click="toBuy">
          <label>限时福利</label>
          <button>开通即送扫地机器人</button>
        </div>
      </template>
      <!--领券购物-->
      <vip-shop-coupon :data="shopCouponData" :level="vipLevel" @onActiveToProductList="toProductList" />
      <!--生活权益-->
      <vip-life-coupon :data="lifeCouponData" :level="vipLevel" v-if="lifeCouponData"/>
      <!--会员爆款-->
      <vip-product-list :data="productData" :level="vipLevel" @onActiveToProductList="toProductList"/>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import env from "@/helpers/env"
  import vipInfo from './components/vipInfo';
  import VipLoanAdv from '../components/VipLoanAdv';
  import VipPowerBlock from '../components/VipPowerBlock';
  import vipShopCoupon from './components/vipShopCoupon';
  import vipLifeCoupon from './components/vipLifeCoupon';
  import vipProductList  from './components/vipProductList';

  export default {
    name: "Home",
    data() {
      return {
        selectedCard: null,
        termStatic: true,
        isToTop: false,
        scrollTabOffTop: null
      }
    },
    components: {
      vipProductList,
      vipInfo,
      VipLoanAdv,
      VipPowerBlock,
      vipShopCoupon,
      vipLifeCoupon
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
        userName: state => state.global.userInfo.userName
      }),
      ...mapState('vip', {
        pageData: state => state.vipData
      }),
      isVip() {
        return this.pageData && this.pageData.vip
      },
      vipLevel() {
        return (this.pageData && this.pageData.vipLevel) || 'default'
      },
      validDate() {
        return this.pageData && this.pageData.validDate.replace("/","-").replace("/","-")
      },
      powerData() {
        return (this.pageData && this.pageData.content['2'])
      },
      shopCouponData() {
        return (this.pageData && this.pageData.content['6'])
      },
      lifeCouponData() {
        return (this.pageData && this.pageData.content['7'])
      },
      productData() {
        return (this.pageData && this.pageData.content['8'])
      },
    },
    async mounted() {
      if (!this.vipData) await this.updateVipData()
      this.$nextTick(() => {
        if (!this.isVip) {
          this.scrollTabOffTop = document.getElementById("buyButton").offsetTop
          document.getElementById("app").addEventListener('scroll', this.scrollTabFixed)
        }
      })
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.scrollTabFixed)
    },
    methods: {
      ...mapActions('vip',['updateVipData']),
      // 项点击操作
      toHref(data) {
        if (!data) return
        if (data.needLogin && !this.userId) {
          redirectToLoginPage()
          return false
        }
        if (data.url){
          if (data.url.indexOf('http') > -1) {
            window.location.href = data.url
          } else {
            window.location.assign(window.location.origin + data.url)
          }
        }
      },
      // 处理页面滚动
      getScrollTop() {
        return document.getElementById("app").scrollTop;
      },
      // 滚动条吸顶
      scrollTabFixed() {
        if (this.getScrollTop() >= 10) {
          this.isToTop = true;
        } else {
          this.isToTop = false;
        }
      },
      // 去商品列表
      toProductList() {
        if (this.vipLevel != "default") {
          if (env.isApp()) {
            return this.$nativeBridge.jumpNativeForType(10, this.productData.areaTitle)
          } else {
            return this.$toast("请在爱用商城app中操作")
          }
        } else {
          this.toBuy()
        }
      },
      toBuy() {
        this.$router.push({path: "/vip-pay"})
      },
    }
  }
</script>

<style scoped lang="scss">
.page-layout{
  width: 100%;
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  background-color: #F5F5F5;
}
.page-header{
  background-image: url("../images/black-bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  padding:  0 .2rem;
  min-height: 3rem;
  &.default{
    background: linear-gradient(180deg, #F7D7A4 0%, #F5F5F5 100%);
  }
}
.page-content{
  width: 100%;
  height: 100%;
  padding:  0 .2rem;
  .buy-button{
    padding: .22rem 0 .2rem 0;
    position: relative;
    width: 100%;
    &.to-bottom{
      position: fixed;
      bottom: .3rem;
      left: 0;
      z-index: 99;
      padding: .22rem .2rem
    }
    label{
      position: absolute;
      left: .4rem;
      top: 0rem;
      color: #fff;
      line-height: .44rem;
      font-size: .24rem;
      padding: 0 .32rem;
      background: linear-gradient(90deg, #EC6555 0%, #EB4837 100%);
      border-radius: .32rem;
      border-bottom-right-radius: 0;
    }
    button{
      border: none;
      width: 100%;
      height: 1rem;
      background: linear-gradient(90deg, #372F26 0%, #2C251E 100%);
      border-radius: .51rem;
      color: #F6DFB9;
      font-size: .36rem;
      font-weight: 600;
    }
  }
  /deep/ .coupon-block{
    background:  #FFFFFF;
    border-radius: .14rem;
    padding: .3rem .22rem .24rem .22rem;
    margin-bottom: .2rem;
    h3{
      font-size: .34rem;
      color: #363636;
      line-height: .48rem;
      margin-bottom: .12rem;
    }
  }
}
</style>
