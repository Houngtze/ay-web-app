<template>
  <div class="goods" v-if="pageData">
    <div class="step1">
      <h3><img src="./images/goods-icons-step1-success.png"><span>第一步 订单已通过审核</span></h3>
      <p>开通会员后即可优先进入放款通道</p>
    </div>
    <div class="step2" v-if="pageData.packageGoods">
      <h3><span>第二步 开通会员送专属权益礼包</span><label>¥{{pageData.realPayAmount/100}}</label></h3>
      <div class="product-info" v-if="pageData && pageData.giftContent">
        <h3 class="title-block">
          <div class="left"><img src="./images/goods-title-icon-member.png"><span>会员权益</span></div>
        </h3>
        <div class="member-shower">
          <img src="./images/hr-card@2x.png">
          <div class="txt">
            <p class="p1">开通会员可享受以下各项权益</p>
            <p class="p2">会员有效期6个月</p>
          </div>
        </div>
        <div class="server-list">
          <div class="server-li" v-for="(item, index) in pageData.giftContent" :key="index">
            <img :src="item.img">
            <p>{{item.name}}</p>
          </div>
        </div>
      </div>
      <div class="product-info product">
        <h3 class="title-block">
          <div class="left"><img class="goods" src="./images/icon-goods@2x.png"><span>本单可享租赁权益</span></div>
          <div class="right"><span @click="popupVisible = true">租赁详情 ></span></div>
        </h3>
        <div class="info">
          <span>手机</span>
          <p>{{pageData.packageGoods.skuName}}{{pageData.packageGoods.skuName}}{{pageData.packageGoods.skuName}}{{pageData.packageGoods.skuName}}<label v-if="pageData.packageGoods.isNew">全新</label></p>

          <!-- <i v-if="pageData.packageGoods.introduce">{{pageData.packageGoods.introduce}}</i> -->
        </div>
        <div class="info">
          <span>价值</span>
          <span>￥{{pageData.packageGoods.price /100 }}</span>
        </div>
        <div class="info desc">
          <div class="info-block">
            <p>租金￥{{pageData.packageGoods.rental}}起</p>
            <!-- <p>￥{{pageData.packageGoods.rental}}起</p> -->
          </div>
          <div class="info-line"></div>
          <div class="info-block">
            <p>期数{{pageData.packageGoods.periods}}个月起</p>
            <!-- <p>{{pageData.packageGoods.periods}}个月起</p> -->
          </div>
        </div>
        <div class="info warm-txt g-mobile-border-top g-mobile-border-bottom">
          <p class="">您将获得该商品租赁服务，同时您同意承诺将该商品租赁订单1个月内提前结清，即可获赠租赁转让特权。</p>
        </div>
        <div class="goods-navbar bor">
          <mt-navbar v-model="selected">
            <mt-tab-item id="out">
              <div class="info">
                <i></i>
                <span>出让手机</span>
                <label>推荐</label>
              </div>
            </mt-tab-item>
            <mt-tab-item id="take">
              <i></i>
              <span>拿手机</span>
            </mt-tab-item>
          </mt-navbar>
        </div>
      </div>
    </div>
    <div class="goods-navbar">

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="out">
          <div class="out-text">
            <p>说明：若提现成功，则代表您同意授权爱用Plus会员，费用将从您的收款账户进行扣除，若扣除失败将以分期偿还的方式支付。<span @click="openLinkTerm">（详细查看爱用Plus会员说明）</span></p>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="take">
          <div class="take-info">
            <p class="address g-mobile-border">
              您还没有收货地址
              <span>点击添加>></span>
            </p>
            <div class="table">
              <p><span>月租金</span><span>￥{{pageData.packageGoods.rental}}</span></p>
              <p><span>租期</span><span>{{pageData.packageGoods.periods}}期</span></p>
              <!--<p><span>到期无忧计划</span><span>¥XXX(一次性付清)</span></p>-->
            </div>
            <span>开通会员即享到期无忧计划，保障您的租赁体验；满12个月自动买断，且无需支付额外费用</span>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>

    <!-- 租赁服务详情popup -->
    <mt-popup class="rent" v-model="popupVisible" position="bottom">
      <h3>租赁服务详情<i class="close" @click="popupVisible=false"></i></h3>
      <div class="block-1">
        <div class="block-item"><p>租赁</p><span>随时可还 租满即送</span></div>
        <div class="block-item"><p>归还</p><span>再次下单 换新复租</span></div>
        <div class="block-item"><p>买断</p><span>支付尾款 终生享有</span></div>
      </div>
      <div class="block-2">
        <table border="1">
          <tr><td>租期</td><td>{{pageData.packageGoods.periods}}个月起</td></tr>
          <tr><td>租金</td><td>￥{{pageData.packageGoods.rental}}起</td></tr>
          <tr><td>随时买断</td><td>租赁期间可随时买断</td></tr>
          <tr><td>租满即送</td><td>租满12个月即送</td></tr>
        </table>
      </div>
    </mt-popup>

    <!-- 手机已经抢完 -->
    <mt-popup
      v-model="dialogVisible"
      :closeOnClickModal="false"
    >
      <div class="product-over">
        <img src="./images/product-over.png">
        <p>今日手机已经抢完</p>
        <span>即将为您转为提现方式({{productOverCounter}}s)</span>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  export default {
    name: "ResultPayContentOrign",
    props: ["pageData"],
    data() {
      return {
        selected: 'out',
        popupVisible: false,
        dialogVisible: false,
        productOverCounter: 3,
        productOverInterval: null
      }
    },
    watch: {
      selected(newVal) {
        if (newVal === 'take') {
          this.productOverCounter = 3
          this.dialogVisible = true
          this.productOverTimer()
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.productOverInterval)
    },
    methods: {
      productOverTimer() {
        this.productOverInterval = setInterval(()=> {
          if (this.productOverCounter <= 1) {
            clearInterval(this.productOverInterval)
            this.dialogVisible = false
            this.selected = 'out'
          }
          this.productOverCounter--
        }, 1000)
      },
      openLinkTerm(){
        window.location.href = 'http://jxh.dafysz.cn/terms/vip-package-service-deduct-agreement.html';
      }
    }
  }
</script>

<style scoped lang="scss">
  .step1{
    width: 100%;
    min-height: 1.4rem;
    padding: .22rem .3rem;
    background-color: #fff;
    & h3{
      & img{
        width: .48rem;
        height: .48rem;
        display: inline-block;
        vertical-align: middle;
        margin-right: .16rem;
      }
      & span{
        font-size: .32rem;
        vertical-align: middle;
      }
    }
    & p{
      font-size: .26rem;
      color: #a8a8a8;
      margin-top: .14rem;
    }
  }
  .step2{
    margin-top: .18rem;
    & > h3{
      padding: .3rem;
      width: 100%;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & span{
        font-size: .32rem;
        vertical-align: middle;
      }
      & > label{
        color: #F22C2C;
        font-size: .32rem;
      }
    }
    & .product-info{
      margin: .18rem .3rem;
      padding: 0 .3rem;
      background-color: #fff;
      box-shadow:0px 4px 8px 0px rgba(221,221,221,0.1);
      border-radius: .1rem;
      overflow: hidden;
      & .title-block{
        padding-top: .26rem;
        padding-bottom: .16rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        & img{
          margin-right: 0.16rem;
          width: .3rem;
          height: .26rem;
          vertical-align: middle;
        }
        & .left{
          & span{
            font-size: .3rem;
            vertical-align: middle;
          }
        }
        & .right{
          & span{
            font-size: .24rem;
            color: #a8a8a8;
            vertical-align: middle;
          }
        }
      }
      &.product{
        & .title-block{
          & img{
            width: .2rem;
            height: .32rem;
          }
          & img.goods{
            width: 0.4rem;
            height:0.4rem;
          }
        }
      }
      & .info{
        display: flex;
        margin-bottom: .12rem;
        & > span,p{
          font-size: .28rem;
          line-height: .4rem;
        }
        & > span:first-child{
          margin-right: .54rem;
          flex-shrink: 1;
          white-space: nowrap;
          color: #a8a8a8;
        }
        & > p > label{
          background:rgba(255,248,236,1);
          font-size: .2rem;
          color: #D09E54;
          line-height: 1;
          padding: .05rem .08rem;
          margin-left: .1rem;
          margin-right: .12rem;
        }
        & > i{
          font-size: .22rem;
          color: #a8a8a8;
          font-style:normal;
        }
      }
      & .info.desc{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 6.3rem;
        height: 0.7rem;
        background: #f8f8f8;
        margin-bottom: 0.2rem;
        & .info-block{
          flex: 1;
          text-align: center;
          padding: .2rem;
          font-size: .26rem;
          color: #a8a8a8;
        }
        & .info-line{
          width: 1px;
          height: 0.5rem;
          border-left: 1px solid #eeeeee;
        }
      }
      & .warm-txt{
        padding: 0.2rem 0;
        color: #a8a8a8;
      }
      & .server-list{
        display: flex;
        align-items: center;
        // justify-content: center;
        justify-content: space-between;
        flex-direction: row;
        padding-bottom: .26rem;
        & .server-li{
          text-align: center;
          display: flex;
        }
        & img{
          width: .4rem;
          height: .4rem;
          display: inline-block;
          margin-bottom: .08rem;
          flex-shrink: 0;
        }
        & p{
          font-size: .22rem;
          line-height: 0.4rem;
          color: #a8a8a8;
        }
      }
      & .member-shower{
        display: flex;
        margin-bottom: 0.3rem;
        & img{
          width: 2.16rem;
          height: 0.92rem;
          flex-shrink: 0;
          margin-right: 0.2rem;
        }
        & .txt{
          & .p1{
            color: #363636;
            font-size: 0.28rem;
            line-height: 0.4rem;
          }
          & .p2{
            font-size: 0.22rem;
            color: #a8a8a8;
          }
        }
      }
    }
  }
.goods-navbar.bor{
  border-top: 1px solid #eee;
}
.goods-navbar{
  /deep/ .mint-navbar {
    position: relative;
    &:after{
      height: 1px;
      content: '';
      width: 100%;
      border-bottom: 1px solid #e8e8e8;
      position: absolute;
      bottom: 0;
      right: 0;
      transform: scaleY(0.5);
      z-index: 10;
    }
    & .mint-tab-item{
      color: #868686;
      & .info{
        & span{
          font-size: .28rem;
          vertical-align: middle;
          margin-right: .14rem;
        }
        & label{
          background:rgba(247,82,82,1);
          border-radius: .2rem;
          padding: .02rem .16rem;
          color: #fff;
          font-size: .24rem;
          line-height: 1;
          vertical-align: middle;
          line-height: 0.34rem;
        }
      }
      & i{
        width: 0.34rem;
        height: 0.34rem;
        display: inline-block;
        vertical-align: middle;
        background: url(./images/inp-radio-dis@2x.png) center no-repeat;
        background-size: 100% auto;
        margin-right: 0.1rem;
      }
      &.is-selected{
        border: none;
        color: #363636;
        & i{
          background-image: url(./images/inp-radio@2x.png);
        }
        & .mint-tab-item-label{
          min-width: 1.8rem;
          border-bottom: 3px solid #E1AD5B;
          margin-top: -3px;
        }
      }
    }
  }
  /deep/ .mint-navbar .mint-tab-item{
    padding: 0;
    & .mint-tab-item-label{
      font-size: .3rem;
      height: 100%;
      padding: .29rem .1rem;
      display: inline-block;
    }
  }
  /deep/ .mint-navbar .mint-tab-item.is-selected{}
  .out-text{
    background-color: #fff;
    padding: .3rem;
    color: #a8a8a8;
    & span{
      color: #D09E54;
    }
  }
  .take-info{
    background-color: #fff;
    p.address{
      padding: .2rem;
      text-align: center;
      font-size: .28rem;
      color: #a8a8a8;
      & span{
        color: #D09E54;
      }
    }
    & > span{
      padding: 0 .3rem .3rem .3rem;
      color: #a8a8a8;
      font-size: .22rem;
      display: inline-block;
    }
    .table{
      padding: 0 .3rem .24rem .3rem;
      p{
        padding-top: .24rem;
        font-size: .28rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        & span{
          color: #a8a8a8;
          &:last-child{
            color: #363636;
          }
        }
      }
    }
  }
}
  .rent{
    width: 100%;
    border-radius:.24rem .24rem 0px 0px;
    & h3{
      font-size: .36rem;
      padding: .3rem 0 .36rem 0;
      text-align: center;
      font-weight: 600;
      position: relative;
      .close{
        width: .36rem;
        height: .36rem;
        background: url(../../images/close@2x.png) center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: .3rem;
        top: .36rem;
      }
    }
    & .block-1{
      margin: 0 .3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background:rgba(248,248,248,1);
      border-radius: 0.08rem;
      padding: .2rem 0;
      & .block-item{
        text-align: center;
        flex: 1;
        & p{
          font-size: .26rem;
        }
        & span{
          font-size: .22rem;
          color: #a8a8a8;
        }
      }
    }
    & .block-2{
      padding: .3rem;
      width: 100%;
      & table{
        font-size: .3rem;
        color: #333333;
        border-width: 1px;
        border-color: rgba(200, 200, 200, 0.5);
        border-collapse: collapse;
        margin-right: 5px;
        margin-bottom: 5px;
        display: inline-block;
        vertical-align: top;
        width: 100%;
        & tr{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        & td {
          border-width: 1px;
          width:70%;
          color: #363636;
          text-align: center;
          border-style: solid;
          border-color: rgba(200, 200, 200, 0.3);
          background-color: #ffffff;
          padding-top: .28rem;
          padding-bottom: .28rem;
          &:first-child{
            width: 30%;
            background-color: #eee;
          }
        }
      }
    }
  }
  .product-over{
    width: 5.6rem;
    height: 3.92rem;
    background:rgba(255,255,255,1);
    border-radius: .1rem;
    text-align: center;
    & img{
      margin: .4rem 0 .32rem 0;
      width: 1.8rem;
      height: 1.94rem;
      display: inline-block;
    }
    & p{
      font-size: .28rem;
      margin-bottom: .1rem;
    }
    & span{
      font-size: .26rem;
      color: #a8a8a8;
    }
  }

</style>
