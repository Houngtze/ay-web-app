<template>
  <div class="page-layout">
    <!-- 进度条 -->
    <Progress :progressConfig="progress" v-if="funding"/>
    <!-- 内容 -->
    <GuideContent :contentImages="contentImages" :contentTitle="contentTitle" :contentDesc="contentDesc"
                  :contentBtn="contentBtn"></GuideContent>
    <div v-if="PPMFormData" v-html="PPMFormData.url" v-show="false" ref="formSubmit"/>
    <div class="bottom-bar" v-if="bannerInfo">
      <div class="banner">
        <img v-lazy='bannerInfo.imgUrl' lazy="error" @click="tapBanner">
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Progress from './components/Progress/index'
  import GuideContent from './components/GuideContent/index'

  export default {
    name: "PPM_Confirm",
    components: {
      Progress,
      GuideContent
    },
    data() {
      return {
        forGetPwHtml: null,
        contentImages: {
          src: require('./images/examine-success.png')
        },
        contentTitle: {
          text: ['支付完成，订单确认中'],
          style: {
            padding: ".99rem 0 .18rem 0",
            fontSize: "0.48rem"
          }
        },
        contentDesc: {
          text: []
        },
        contentBtn: {
          text: '下一步',
          onActive: this.toNext
        },
        PPMFormData: null,
        bannerInfo: null,
        progress: {
          textArr: [{
            text: '确认信息',
            extra: null
          },{
            text: '分期授权',
            extra: null
          },{
            text: '确认支付',
            extra: null
          }],
          index: 0
        },
        funding: null
      }
    },
    computed: {
      ...mapState({
        idPerson: state => state.global.userInfo.idPerson,
        userId: state => state.global.userInfo.userId,
      })
    },
    mounted() {
      if (this.$route.query.funding === 'JYC') {
        this.funding = this.$route.query.funding
        this.contentImages = null
        this.contentDesc.text = ['为了保证交易安全，需要确认您的个人信息，请您在当日24点前确认']
        this.contentTitle.text = ['订单就快完成啦！', '请确认您的个人信息']
      } else {
        this.toGetAdvert()
      }
      // this.getPPMStatus()
    },
    methods: {
      // 版本号
      getVersion () {
        const userAgent = navigator.userAgent
        const version = userAgent.substr(-5, 5)
        return version.replace(/\./g, '') + "00"
      },
      // PPM、聚有财开户判断
      /*
      * 根据版本号判断，APP（3.1.0）老版本用ppm
      * */
      async getPPMStatus() {
        let params={
          userId:this.userId,
          idPerson:this.idPerson,
          channel:'APP',
          product: "AMFT",
          version: this.getVersion(),
          orderNo: this.$route.query.orderNo || ""
        };
        let res=await this.$api.getPPMResultHttp(params);
        if(res.code=='sc0') {
          this.PPMFormData=res.data.url;
          this.$nextTick(() => {
            // 数据渲染后执行自动提交开户表单
            if (res.data.isPpmOpen === "1") {
              //已开户
              this.$router.push({name:  'e-guide-examine-direct', query: {orderNo: this.$route.query.orderNo}})
            }
            else {
              //未开户
              if (res.data.urlType === 2) {
                window.location.href = res.data.url
              } else {
                this.submitForm()
              }
            }
          })
        }else {
          this.$toast(res.message)
        }
      },
      toNext() {
        this.getPPMStatus()
      },
      // 获取广告位子
      async toGetAdvert() {
        const res = await this.$api.toGetAdvert({code: 'ahAuditFailure'})
        if (res.code === 'sc0') {
          this.bannerInfo = res.data;
        }
      },
      tapBanner() {
        if (!this.bannerInfo.jumpType) return;
        if (this.bannerInfo.jumpType === 9 ) {
          window.location.href = this.bannerInfo.jumpParam
        }
      },
      // 提交ppm表单
      submitForm(){
        // document.getElementById("formId").submit();
        this.$refs.formSubmit.querySelector("form").submit();
      },
    }
  }
</script>

<style scoped lang="scss">
  .page-layout{
    height: 100%;
    overflow: hidden;
    background-color: #f2f2f2;
  }
  .bottom-bar{
    height: calc(100% - 5.14rem);
    margin-top: .18rem;
    .banner img {
      width: 100%;
      height: 3rem;
      &[lazy=loading] {
        margin: auto;
        background: url("images/banner-default.png") no-repeat;
        background-size: 100% 100%;
      }
      &[lazy=error] {
        margin: auto;
        background: url("images/banner-default.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
</style>
