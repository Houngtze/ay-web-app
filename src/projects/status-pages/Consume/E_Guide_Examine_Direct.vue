<template>
  <div class="page-layout">
    <!-- 内容 -->
    <GuideContent :contentTitle="contentTitle" :contentImages="contentImages"
                  :contentBtn="contentBtn">
      <div class="content-extra" slot="extra">
        <p>
          <label>1</label>
          <span>您提交的信息正在加速审核，请耐心等待；</span>
        </p>
        <p>
          <label>2</label>
          <span>您可以在“我的”—“订单中心”查看该笔交易审核状态；</span>
        </p>
        <p>
          <label>3</label>
          <span>审核通过后，您还需要24小时内在“我的”—“订单中心”核对个人信息；</span>
        </p>
        <p>
          <label>4</label>
          <span>若审核不通过且您支付了首付款，首付款会在3-7个工作日原路退回。</span>
        </p>
      </div>
    </GuideContent>
    <!-- 打开推送 -->
    <app-push  v-if="Number(getVersion()) >= 38400"/>
    <!-- 广告位 -->
    <div class="bottom-bar" v-if="advData && advData.imgUrl && (!advData.skuInfor || !advData.skuInfor.length)">
      <div class="banner">
        <img v-lazy='advData.imgUrl' @click="tapBanner">
      </div>
    </div>
    <!-- 推荐位商品 -->
    <recommend-product-list :skuInfor="(advData && advData.skuInfor) || []" pagePosition="amftAuditWaiting"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import env from "@/helpers/env";
  import Progress from './components/Progress/index'
  import GuideContent from './components/GuideContent/index'
  import AppPush from './components/AppPush'
  import RecommendProductList from './components/RecommendProductList'

  export default {
    name: "E_Guide_Examine_Direct",
    components: {
      Progress,
      GuideContent,
      AppPush,
      RecommendProductList
    },
    data() {
      return {
        orderNo: null,
        contentImages: {
          src: require('./images/examining.png')
        },
        contentTitle: {
          text: ['加速审核中...'],
          style: {
            padding: ".4rem 0 0 0",
            fontSize: "0.48rem"
          }
        },
        contentBtn: {
          text: '刷新结果',
          onActive: this.toNext
        },
        progressStyle: {
          text: null,
          style: null
        },
        grade: 0,
        gradeTarget: 95,
        popTime: 0,
        advData: null,  // 广告数据
        isAppPushOpen: false
      }
    },
    computed: {
      ...mapState({
        idPerson: state => state.global.userInfo.idPerson,
        userId: state => state.global.userInfo.userId,
      }),
    },
    created() {
      // 返回按钮直接返回首页
      if (env.isApp()) {
        this.$nativeBridge.navbarBackHome({
          isBackHome: true
        })
      }  else {
        this.$nativeBridge.navbarBackJXHStore()
      }
      // 获取订单号，没有则提示
      this.getOrderNo()
      this.toGetAdvert()
    },
    methods: {
      // app获取版本号
      getVersion () {
        const userAgent = navigator.userAgent
        const version = userAgent.substr(-5, 5)
        return (version.replace(/\./g, '') + "00")
      },
      async toNext() {
        if (!this.getOrderNo()) {
          return false
        }
        let params = {
          channel: 'SC',
          idPerson: this.idPerson || '0',
          userId: this.userId,
          orderNo: this.orderNo
        }
        let res = await this.$api.orderDetail(params)
        if (res.code === 'sc0') {
          res.data.status = res.data.status.toString()
          if (res.data.status === "3" || res.data.status === "4" || res.data.status === "5") {
            this.$router.replace({name: 'apply-result', query: {result: "1"}})
          }
          if (res.data.status === "6") {
            this.$router.replace({name: 'apply-result', query: {result: "2"}})
          }
        } else {
          this.$toast(res.message)
        }
      },
      // 订单号判断
      getOrderNo() {
        if (!this.$route.query.orderNo) {
          this.$toast('订单号出错')
          return false
        } else {
          this.orderNo = this.$route.query.orderNo
          return true
        }
      },
      // 获取广告位子
      async toGetAdvert() {
        const res = await this.$api.toGetAdvert({
          code: env.isApp() ? "amftAuditWaiting" : "jxh_amftAuditWaiting" ,
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
        } else {
          this.$nativeBridge.jumpNativeForType(
            this.advData.jumpType,
            this.advData.jumpParam || "")
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .page-layout {
    height: 100%;
    /deep/ .guide-content{
      padding-bottom: .44rem;
    }
  }

  .content-extra {
    margin: .62rem .3rem 0 .3rem;
    background-color: #fff;
    border:1px solid rgba(198,198,198,.5);
    border-radius:10px;
    padding: .24rem .2rem;
    & p {
      font-size: .24rem;
      line-height: 1.5;
      margin-bottom: .1rem;
      display: flex;
      & label {
        padding: 0 0.15rem 0 0.1rem;
        height: .35rem;
        line-height: .35rem;
        background-color: #d8d8d8;
        color: #363636;
        margin-right: 0.12rem;
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
      }
      & span {
        flex: 1;
        color: #868686;
      }
    }
  }
  .bottom-bar{
    margin-top: .18rem;
  }
</style>
