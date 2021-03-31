<template>
  <div class="page-layout">
    <GuideContent :contentImages="contentImages" :contentTitle="contentTitle"
                  :contentBtn="contentBtn" />
    <!-- 广告位 -->
    <div class="bottom-bar" v-if="advData && advData.imgUrl && (!advData.skuInfor || !advData.skuInfor.length)">
      <div class="banner">
        <img v-lazy='advData.imgUrl' @click="tapBanner">
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import env from "@/helpers/env";
  import GuideContent from './components/GuideContent/index'

  const imgageObj = {
    'success': require('./images/examine-success.png'),
    'fail': require('./images/examine-fail.png')
  }

  const textClass = {
    'success': '爱满分审核通过！商品会尽快发货',
    'fail': '本次爱满分申请失败'
  }

  export default {
    name: "applyResult",
    components: {
      GuideContent
    },
    data() {
      return {
        contentImages: null,
        contentTitle: {
          text: [],
          style: {
            padding: ".77rem 0 0 0",
            fontSize: "0.4rem"
          }
        },
        contentBtn: {
          text: null,
          onActive: this.toNext
        },
        advData: null,  // 广告数据
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        idPerson: state => state.global.userInfo.idPerson
      }),
      advCode() {
        if (env.isApp()) {
          return this.$route.query.result === "1" ? "amfAuditSucc" : "amfAuditRefuse"
        }
        return this.$route.query.result === "1" ? "jxh_amfAuditSucc" : "jxh_amfAuditRefuse"
      }
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

      if (!this.$route.query.result || (this.$route.query.result !== "1" && this.$route.query.result !== "2")) {
        this.$toast('结果出错')
        return
      }
      this.contentImages = {
        src: this.$route.query.result === "1" ? [imgageObj['success']] : [imgageObj['fail']]
      }
      this.contentTitle.text = this.$route.query.result === "1" ? [textClass['success']] : [textClass['fail']]
      this.contentBtn.text = this.$route.query.result === "1" ? '返回' : '去购物'
      this.toGetAdvert()
    },
    methods: {
      // app获取版本号
      getVersion () {
        const userAgent = navigator.userAgent
        const version = userAgent.substr(-5, 5)
        return (version.replace(/\./g, '') + "00")
      },
      // 下一步
      toNext() {
        if (this.$route.query.result === "1" ) {
          this.$nativeBridge.jumpToAppOrderCenter()
        } else {
          this.$nativeBridge.jumpToAppIndex()
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
      // 获取广告位子
      async toGetAdvert() {
        const res = await this.$api.toGetAdvert({
          code: this.advCode,
          version: this.getVersion(),
          personId: this.idPerson
        })
        if (res.code === 'sc0') {
          this.advData = res.data
        } else {
          this.$toast(res.message)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .open-push{
    padding: 0 .3rem .47rem .3rem;
    width: 100%;
    background-color: #fff;
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
  .recommend-block{
    background: #f2f2f2;
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
</style>
