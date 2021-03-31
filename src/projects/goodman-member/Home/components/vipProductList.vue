<template>
  <div class="product-list">
    <h3>
      {{data.areaName}}
      <button @click="toMore">查看更多</button>
    </h3>
    <ul v-if="productData">
      <li v-for="(item, index) in productData" :key="index" @click="toDetail(item.skuCode)">
        <img v-lazy="srcIp + '/' +item.src" />
        <p>{{item.name}}</p>
        <span>原价￥{{item.salePrice}}</span>
        <div class="vip-brand" v-if="item.vipPrice">
          <label>会员价</label>
          <span>￥{{item.vipPrice}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import env from "@/helpers/env"
  export default {
    name: "vipProductList",
    props: ["data", "level"],
    data() {
      return {
        productData: null,
        srcIp: null
      }
    },
    mounted() {
      this.getProductData(this.data.areaTitle)
    },
    methods:{
      getProductData(code) {
        this.$api.getProductList({
          channel: "APP",
          code: code,
          pageNum: 1,
          pageSize: 3,
          orderSort: 'salePriceDesc',
        }).then(res => {
          if (res.code === "sc0") {
            this.srcIp = res.data.srcIp
            this.productData = res.data.resultList
          } else {
            this.$toast(res.message)
          }
        })
      },
      toDetail(skuCode) {
        if (this.level != 'default') {
          if (env.isApp()) {
            return this.$nativeBridge.jumpNativeForType(11, skuCode)
          } else {
            return this.$toast("请在爱用商城app中操作")
          }
        } else {
          this.$router.push({path: "/vip-pay"})
        }
      },
      toMore() {
        this.$emit("onActiveToProductList")
      }
    }
  }
</script>

<style scoped lang="scss">
.product-list{
  background:  #FFFFFF;
  border-radius: .14rem;
  padding: .3rem .22rem .24rem .22rem;
  margin-bottom: 1.98rem;
  h3{
    font-size: .34rem;
    color: #363636;
    line-height: .48rem;
    margin-bottom: .12rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    button{
      font-size: .22rem;
      color: #CD3330;
      line-height: .4rem;
      border-radius: .21rem;
      border: 1px solid #CD3330;
      background-color: #fff;
      padding: 0 .22rem;
    }
  }
  ul{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    li{
      width: 2.06rem;
      img{
        height: 2.06rem;
        border-radius: .12rem;
      }
      & >  p, & > span{
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #363636;
        font-size: .24rem;
        margin-bottom: 0.04rem;
      }
      & > span{
        color: #868686;
      }
      .vip-brand{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        label{
          padding: 0 .1rem;
          color: #FBE8C9;
          font-size: .2rem;
          line-height: .34rem;
          background: #2B2B2F;
          border-radius: 0.06rem 0px 0px 0.06rem;
          white-space: nowrap;
        }
        span{
          padding: 0 .06rem;
          color: #2B2B2F ;
          font-size: .24rem;
          line-height: .34rem;
          background: #FBE8C9;
          border-radius: 0.06rem 0.06rem 0.06rem 0;
          white-space: nowrap;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
