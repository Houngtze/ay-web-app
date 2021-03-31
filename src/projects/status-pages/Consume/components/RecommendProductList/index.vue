<template>
  <!-- 推荐商品 -->
  <div class="recommend-block"
       v-if="skuInfor && skuInfor.length">
    <div class="title">
      <label>———</label>
      <img src="../../images/credit-result-recommend-title-icon.png">
      <span>限时特价 新人专享</span>
      <label>———</label>
    </div>
    <div class="content">
      <ul>
        <li v-for="(item, index) in skuInfor" :key="index" @click="toProductDetail(item)" data-growing-container
            :data-growing-title="item.name">
          <img :src="`${item.srcIp + '/' + item.skuImg}`" alt="">
          <p class="title">{{item.skuName}}</p>
          <p class="money-bar" v-if="item.forexSales">
            <span>活动价￥</span>
            <strong>{{priceFormat(item.forexSales)[0]}}.</strong>
            <em>{{priceFormat(item.forexSales)[1]}}</em>
            <span>起</span>
            <label>日供</label>
          </p>
          <p class="money-bar" v-else>
            <span>活动价￥</span>
            <strong>{{priceFormat(item.originalPrice)[0]}}.</strong>
            <em>{{priceFormat(item.originalPrice)[1]}}</em>
            <span>起</span>
          </p>
          <p v-if="item.forexSales" class="original-price">原价{{item.originalPrice}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import env from "@/helpers/env";

  export default {
    name: "index",
    props: ['skuInfor', 'pagePosition'],
    computed: {
      ...mapState({
        idPerson: state => state.global.userInfo.idPerson,
        userId: state => state.global.userInfo.userId,
      }),
    },
    methods: {
      // 价格格式化
      priceFormat(price) {
        const value = price.toString();
        if (value.indexOf('.') !== -1) {
          return value.split('.');
        } else {
          return [value, '00'];
        }
      },
      // 去详情
      toProductDetail(data) {
        if (env.isApp()) {
          if (data.skuCode) {
            this.$api.buryingPoint({
              "personId": this.idPerson,
              "userId": this.userId,
              "imei": "h5_no_imei",
              "list": [
                {
                  "startTimeStamp": new Date().getTime(),
                  "qkId": data.skuCode,
                  "markId": "recommend_sku",
                  "pagePosition": this.pagePosition
                }
              ]
            })
            this.$nativeBridge.jumpToDetail(data.skuCode)
          } else {
            this.$toast('sku出错')
          }
        } else {
          this.$toast('请在爱用商城app中打开')
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .recommend-block{
    background: #f2f2f2;
    margin-bottom: .98rem;
    .title{
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: .41rem 0 .3rem 0;
      & span{
        font-size: .3rem;
        color:rgba(54,54,54,1);
        line-height: .3rem;
        display: inline-block;
        margin-right: .2rem;
        font-weight: 600;
      }
      & img{
        width: .3rem;
        display: inline-block;
        margin-right: .1rem;
        margin-left: .2rem;
      }
      & label{
        color: #C6C6C6;
        opacity: .7;
      }
    }
    .content{
      ul{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 .3rem;
        li{
          width: 3.38rem;
          padding: 0.25rem;
          margin-bottom: .15rem;
          border-radius: .1rem;
          flex-shrink: 0;
          background-color: #fff;
          text-align: center;
          img{
            width: 3rem;
            height: 3rem;
            &[lazy=error] {
              margin: auto;
              border: 1px solid rgba(200,200,200, 0.3);
              background-image: url("http://static.ali.szqk-tech.com/images/aiyong-shop/aiyong-product-default.png");
              background-size: 100%;
            }
            &[lazy=loading] {
              margin: auto;
              border: 1px solid rgba(200,200,200, 0.3);
              background-image: url("http://static.ali.szqk-tech.com/images/aiyong-shop/aiyong-product-default.png");
              background-size: 100%;
            }
          }
          .title{
            margin: 0.4rem 0 0.24rem 0;
            padding: 0;
            font-size: 0.26rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient: vertical;
            text-align: left;
          }
          .money-bar{
            display: flex;
            justify-content: left;
            align-items: baseline;
            font-size: 0.2rem;
            color: #F63337;
            width: 100%;
            line-height: 1;
            span{
              font-size: .2rem;
            }
            strong{
              font-size: .28rem;
              font-weight: 600;
            }
            em{
              font-size: .2rem;
              font-style:normal;
              font-weight: 600;
            }
            label{
              font-size: .2rem;
              color: #a8a8a8;
            }
          }
          .original-price{
            text-align: left;
            width: 100%;
            text-decoration: line-through;
            font-size: .2rem;
            color: #a8a8a8;
          }
        }
      }
    }
  }
</style>
