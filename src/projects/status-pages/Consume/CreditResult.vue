<template>
  <div class="result-view">
    <div class="top-bar" v-if="creditData">
      <!-- 申请进度展示 -->
      <div class="waiting" v-if="creditData.auditStatus === 0">
        <h2>额度计算中</h2>
        <div class="counter">
          <div><span>￥</span></div>
          <div><span>{{counterArr[0] || 0}}</span></div>
          <div><span>{{counterArr[1] || 0}}</span></div>
          <div><span>{{counterArr[2] || 0}}</span></div>
          <div><span>{{counterArr[3] || 0}}</span></div>
          <div><span>{{counterArr[4] || 0}}</span></div>
        </div>
        <p>额度以最终实际结果为准，本额度仅供参考</p>
      </div>
      <div class="success" v-if="creditData.auditStatus === 1">
        <h4>钱包额度(元)</h4>
        <h1>{{formatData(creditData.totalLimit)}}</h1>
        <p>您的信用等级较高，已为您推荐优质大额放款通道</p>
      </div>
      <div class="fail" v-if="creditData.auditStatus === 2">
        <img src="./images/false.png" />
        <p>根据您的综合评分</p>
        <p>已匹配优质放款机构为您提供借款服务</p>
      </div>
      <!-- 页面按钮 -->
      <div class="button-block">
        <button class="active" v-if="creditData.auditStatus === 0" @click="getAmftCreditResult">刷新结果</button>
        <button class="active" v-if="creditData.auditStatus === 1 && creditData.existsUnPay" @click="jumpToAppOrderCenter">查看订单并支付</button>
        <button v-if="creditData.auditStatus === 1" @click="toDajin">立即申请</button>
        <button class="active" v-if="creditData.auditStatus === 2" @click="toDc">下一步</button>
      </div>
      <!-- 打开推送 -->
      <app-push v-if="Number(getVersion()) >= 38400"/>
      <!-- 广告位 -->
      <div class="bottom-bar" v-if="advData && advData.imgUrl && (!advData.skuInfor || !advData.skuInfor.length)">
        <div class="banner">
          <img v-lazy='advData.imgUrl' @click="tapBanner(advData)">
        </div>
      </div>
      <!-- 推荐位商品 -->
      <recommend-product-list :skuInfor="(advData && advData.skuInfor) || []" :pagePosition="auditDataDictionary[creditData.auditStatus]" v-if="creditData"/>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import env from '@/helpers/env'
import AppPush from './components/AppPush'
import RecommendProductList from './components/RecommendProductList'

export default {
  components: {
    AppPush,
    RecommendProductList
  },
  data() {
    return {
      creditData: null, // 授信数据
      advData: null,  // 广告数据
      // 授信数据：0 审核中 ，1 审核通过， 2 审核拒绝
      auditDataDictionary: {
        0: 'amftcreditWatting',
        1: 'amftCreditSuccess',
        2: 'amftcreditFail'
      },
      counterTimer: null,
      counter: 0,
      counterLimit: 0,
      isAppPushOpen: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.global.userInfo.userId,
      idPerson: state => state.global.userInfo.idPerson
    }),
    counterArr() {
      let counterLimit = this.counterLimit.toString()
      const counterLimitLength = counterLimit.length
      if (counterLimit.length < 5) {
        for (let i = 0;i < (5 - counterLimitLength); i++) {
          counterLimit = "0" + counterLimit
        }
      }
      return counterLimit.split("");
    }
  },
  watch: {
    'creditData.auditStatus'(newVal) {
      this.advData = null
      this.toGetAdvert(newVal)
    }
  },
  beforeCreate() {
    this.$nativeBridge.navbarBackHome({
      isBackHome: true
    })
  },
  created() {
    this.getAmftCreditResult()
  },
  beforeDestroy() {
    clearInterval(this.counterTimer)
  },
  methods: {
    // 跳转订单中心待支付订单
    jumpToAppOrderCenter() {
      this.$nativeBridge.jumpToAppOrderCenter({orderState: '1'});
    },
    // 跳转首页
    jumpToAppIndex() {
      this.$nativeBridge.jumpToAppIndex()
    },
    // 去借钱
    goXJD() {
      window.location.replace(window.location.origin + '/custom-page/jyc-xjd/#/home')
    },
    // 额度格式化
    formatData(num) {
      num = num + '';
      if (!num.includes('.')) {
        num += '.'
      }
      return num.replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
        return $1 + ',';
      }).replace(/\.$/, '');
    },
    // 价格格式化
    priceFormat(price) {
      const value = price.toString();
      if (value.indexOf('.') !== -1) {
        return value.split('.');
      } else {
        return [value, '00'];
      }
    },
    // app获取版本号
    getVersion () {
      const userAgent = navigator.userAgent
      const version = userAgent.substr(-5, 5)
      return (version.replace(/\./g, '') + "00")
    },
    // 获取授信状态
    async getAmftCreditResult() {
      const param = {
        idPerson: this.idPerson,
        userId: this.userId,
        version: this.getVersion()
      }
      const res = await this.$api.getAmftCreditResult(param)
      if (res.code === 'sc0') {
        this.creditData = res.data
        if (res.data.auditStatus === 0) {
          this.creditWaitingCounterAnimate()
        }
      } else {
        this.$toast(res.message)
      }
    },
    // 审核中额度计算动画
    creditWaitingCounterAnimate() {
      this.counterTimer = setInterval(() => {
        if (this.counterLimit >= 10000) {
          this.counterLimit = 10000
          clearInterval(this.counterTimer)
          return
        }
        if (this.counter < 60) {
          this.counterLimit = this.counterLimit + this.getRandomNum(45, 75)
        } else if (this.counter < 180) {
          this.counterLimit = this.counterLimit + this.getRandomNum(10, 30)
        } else if (this.counterLimit <= 10000) {
          this.counterLimit = this.counterLimit + this.getRandomNum(0, 10)
        }
        this.counter++
      }, 1000)
    },
    // 获取区间随机数
    getRandomNum(min, max) {
      return parseInt(Math.random()*(max - min + 1) + min, 10)
    },
    // 获取广告位子
    async toGetAdvert(type) {
      const res = await this.$api.toGetAdvert({
        code: this.auditDataDictionary[type],
        version: this.getVersion(),
        personId: this.idPerson
      })
      if (res.code === 'sc0') {
          this.advData = res.data
      } else {
        this.$toast(res.message)
      }
    },
    // 点击广告位
    tapBanner() {
      if (!this.advData.jumpType) return;
      if (this.advData.jumpType === 9 ) {
        window.location.href = this.advData.jumpParam
      }
    },
    // 去贷超
    toDc() {
      window.location.replace(window.location.origin + "/custom-page/jyc-xjd/#/org-loan-list")
    },
    // 大金贷
    toDajin() {
      window.location.replace(window.location.origin + "/custom-page/jyc-xjd/#/dajin-loan")
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/index';
.result-view{
  height: 100%;
  background: #f2f2f2;
  .top-bar{
    background-color: #fff;
    /* 审核中样式 */
    & .waiting{
      text-align: center;
      padding: .84rem 0 .87rem 0;
      & h2{
        font-size: .48rem;
        font-weight: 600;
      }
      .counter{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: .8rem 0 .2rem 0;
        & > div{
          width: .96rem;
          height: .96rem;
          border:1px solid rgba(198,198,198,1);
          & span{
            font-size: 1rem;
            font-weight: 600;
            line-height:  .96rem;
          }
        }
      }
      & p {
        font-size: .24rem;
        font-family:PingFang SC;
        color:rgba(168,168,168,1);
      }
    }
    & .success{
      padding: 1rem 0 .67rem 0;
      text-align: center;
      & h4{
        font-size: .3rem;
        line-height: .98rem;
        margin-bottom: .3rem;
        line-height: 1;
      }
      & h1{
        font-size: 1rem;
        line-height: 1;
      }
    }
    & .fail{
      text-align: center;
      padding: .77rem 0 .5rem 0;
      img{
        width: 1.5rem;
        display: inline-block;
        margin-bottom: .15rem;
      }
      h2{
        font-size: .48rem;
        margin-bottom: .15rem;
      }
      p{
        font-size: .24rem;
        color: #a8a8a8;
      }
    }
    & .button-block{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding-bottom: .46rem;
      button{
        width: 4rem;
        height: .8rem;
        border-radius: .4rem;
        background:rgba(255,255,255,1);
        border: 1px solid rgba(229,229,229,1);
        box-shadow:0px 9px 10px 0px rgba(54,54,54,0.06);
        color: #363636;
        font-size: .36rem;
        margin-bottom: .4rem;
        &.active{
          background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
          color: #fff;
        }
      }
    }
    & .open-push{
      padding: 0 .3rem .47rem .3rem;
      .content{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left{
          text-align: left;
          p{
            font-size: .3rem;
            line-height: 1;
            margin-bottom: 0.08rem;
          }
          span{
            font-size: .24rem;
          }
        }
        .right{
          button{
            width: 1.5rem;
            height: .54rem;
            border:1px solid rgba(208,158,84,1);
            border-radius: .27rem;
            font-size: .24rem;
            background: #fff;
            color: rgba(208,158,84,1);
          }
        }
      }
    }
  }
  .bottom-bar{
    margin-top: .18rem;
    .banner img {
      width: 100%;
      height: 3rem;
      &[lazy=loading] {
        margin: auto;
        background: url("./images/banner-default.png") no-repeat;
        background-size: 100% 100%;
      }
      &[lazy=error] {
        margin: auto;
        background: url("./images/banner-default.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }

}
</style>
