<template>
  <div class="default">
    <div class="step1">
      <h3><img src="./images/goods-icons-step1-success.png"><span>第一步 订单已通过审核</span></h3>
      <p>开通会员后即可优先进入放款通道</p>
    </div>
    <div class="step2">
      <h3><span>第二步 开通会员送专属权益礼包</span><label>¥{{pageData.realPayAmount/100}}</label></h3>
      <div class="product-info">
        <h3 class="title-block">
          <div class="left"><img src="./images/goods-title-icon-member.png"><span>会员权益</span></div>
        </h3>
        <div class="member-shower">
          <img src="./images/hr-card@2x.png">
          <div class="txt">
            <p class="p1">开通会员可享受以下各项权益</p>
            <p class="p2">会员有效期3个月</p>
          </div>
        </div>
        <div class="server-list">
          <div class="server-li" v-for="(item, index) in pageData.giftContent" :key="index">
            <img :src="item.img">
            <p>{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
    <p class="warm-txt" v-if="pageData.payMethod === '0'">若提现失败，您所购买的提现加速会员包相关费用将于3～5个工作日内100%退回您的支付账户,一经支付确认申请借款将无法取消订单，请知悉。（详情参看爱用Plus会员说明和<span class="col" @click="goLinkTerm">《服务合同》</span>）</p>
    <p class="warm-txt" v-if="pageData.payMethod === '1'">说明：若提现成功，则代表您同意授权爱用Plus会员，费用将从您的收款账户进行扣除，若扣除失败将以分期偿还的方式支付。（详情参看<span class="col" @click="goLinkTerm">爱用Plus会员说明</span>）</p>
  </div>
</template>

<script>
  export default {
    name: "ResultPayContentOrign",
    props: ["pageData"],
    data(){
      return {
        termStatic: true
      }
    },
    methods: {
      handlePopup() {
        this.$emit('showPopup', this.termStatic)
      },
      goLinkTerm(){
        window.location.href = 'http://aiyong.dafysz.cn/terms/vip-package-service-deduct-agreement.html';
      }
    }
  }
</script>

<style scoped lang="scss">
  .default{
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
    .static-msg{
      // height: 3.2rem;
      background: #fff;
      border-bottom: 0.2rem solid #f2f2f2;
      text-align: center;
      padding-bottom: 0.2rem;
      img{
        width: 1.05rem;
        height: auto;
        display: inline-block;
        margin: 0.4rem auto;
        margin-bottom: 0.24rem;
      }
      p{
        font-size: 0.28rem;
        line-height: 0.28rem;
        margin-bottom: 0.2rem;
      }
    }
    .order-li{
      border-bottom: 1px solid #E5E5E5;
      height: 0.9rem;
      display: flex;
      align-items: center;
      padding: 0 0.3rem;
      font-size: 0.3rem;
      background-color: #fff;
      .tt{
        color: #A8A8A8;
        flex-shrink: 0;
      }
      .txt{
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
      }
      .link{
        flex-shrink: 0;
        color: #D1A056;
        font-size: 0.24rem;
      }
      .price{
        flex-shrink: 0;
        color: #F22C2C;
        font-size: 0.3rem;
      }
    }
    .server-list{
      display: flex;
      padding-top: 0.2rem;
      background-color: #fff;
      .server-li{
        flex-grow: 1;
        text-align: center;
        img{
          width: 1.4rem;
          height: auto;
        }
        p{
          font-size: 0.24rem;
          line-height: 0.24rem;
        }
      }
    }
    .warm-txt{
      background-color: #fff;
      color: #A8A8A8;
      font-size: 0.22rem;
      line-height: 0.3rem;
      padding: 0.2rem 0.3rem;
      border-bottom:0.2rem solid #f2f2f2;
      .col{
        color: #D19F55;
      }
    }
  }
</style>
