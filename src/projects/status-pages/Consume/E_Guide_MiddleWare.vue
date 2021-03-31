<template>
  <div class="page-layout">
    <!-- 进度条 -->
    <Progress :progressConfig="progress"/>
    <!-- 内容 -->
    <GuideContent :contentTitle="contentTitle" :contentDesc="contentDesc"
                  :contentBtn="contentBtn" style="margin-top: .18rem;"></GuideContent>
    <!-- 开户html -->
    <div  v-html="middlewareHtml" ref="middlewareForm" style="display: none"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Progress from './components/Progress/index'
  import GuideContent from './components/GuideContent/index'
  import {Toast} from 'mint-ui';

  import env from "@/helpers/env";

  export default {
    name: "E_Guide_MiddleWare",
    components: {
      Progress,
      GuideContent
    },
    data() {
      return {
        middlewareHtml: null,
        orderNo: null,
        funding: "ERS",
        showLoading: null,
        progress: {
          textArr: [{
            text: '开户确认',
            extra: null
          },{
            text: '分期授权',
            extra: null
          },{
            text: '受托确认',
            extra: null
          },{
            text: '等待发货',
            extra: null
          }],
          index: 1
        },
        contentTitle: {
          text: ['个人信息确认完成','请牢记密码'],
          style: {
            padding: ".99rem 0 .18rem 0",
            fontSize: "0.48rem"
          }
        },
        contentDesc: {
          text: ['为了保证交易安全，需要确认您的个人信息并授权分期交易','请您在当日24点前确认']
        },
        contentBtn: {
          text: '下一步',
          onActive: this.toNext
        }
      }
    },
    computed: {
      ...mapState({
        idPerson: state => state.global.userInfo.idPerson,
      })
    },
    created() {
      // 获取订单号，没有则提示
      this.getOrderNo()
    },
    methods: {
      // 下一步
      toNext() {
        if (!this.getOrderNo()) {
          return false
        }
        this.repayAuth()
      },
      // 借款人授权二合一
      async repayAuth() {
        const param = {
          funding: this.funding,
          personId: this.idPerson,
          channelType: env.isApp() ? "IOS" : (env.isAndroid() ? "ANDROID":  "WAP"),
          returnUrl: window.location.origin + '/custom-page/status-pages/#/ppm-confirm?orderNo=' + this.orderNo + '&funding=' + this.funding,
          successfulUrl: window.location.origin + '/custom-page/status-pages/#/e-guide-examine?orderNo=' + this.orderNo + '&funding=' + this.funding,
          forgotPwdUrl: window.location.origin + '/custom-page/status-pages/#/e-forget-password?orderNo=' + this.orderNo + '&funding=' + this.funding
        }
        const res = await this.$api.repayAuth(param);
        if (res.code === 'sc0') {
          if (this.funding === "ERS") {
            if (res.data.status === "0") {
              this.middlewareHtml = res.data.html
              // 提交E融所开户表单
              this.$nextTick(() => {
                this.submitForm()
              })
            } else {
              this.$router.push({name: 'e-guide-examine', query: {orderNo: this.orderNo}})
            }
          } else if (this.funding === "JZCF") {
            if (res.data.openStatus === "0") {
              this.showLoading = Toast({
                className: 'g-mask-toast-loading',
                iconClass: 'g-mask-toast-loading-icon',
                duration: -1,
              });
            } else {
              window.location.href = res.data.url
              // window.open(res.data.url,'_blank');
            }
          } else {
            this.$toast(res.message)
          }
        }
      },
      // 订单号判断
      getOrderNo() {
        if (!this.$route.query.orderNo) {
          this.$toast('订单号出错')
          return false
        } else {
          this.orderNo = this.$route.query.orderNo
          this.funding = this.$route.query.funding
          return true
        }
      },
      // 提交ppm表单
      submitForm(){
        // document.getElementById("formId").submit();
        this.$refs.middlewareForm.querySelector("form").submit();
      },
    }
  }
</script>

<style scoped lang="scss">
  .page-layout{
    height: 100%;
    overflow: hidden;
    background-color: #fff;
  }
  .e-middleware-content{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
