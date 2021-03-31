<template>
  <div class="page-layout">
    <!-- 进度条 -->
    <Progress :progressConfig="progress"/>
    <!-- 内容 -->
    <GuideContent :contentTitle="contentTitle" :contentDesc="contentDesc"
                  :contentBtn="contentBtn" style="margin-top: .18rem;"></GuideContent>
    <!-- 开户html -->
    <div v-html="confirmHtml" ref="confirmForm" style="display: none"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Progress from './components/Progress/index'
  import GuideContent from './components/GuideContent/index'
  import env from "@/helpers/env";

  export default {
    name: "E_Guide_Confirm",
    components: {
      Progress,
      GuideContent
    },
    data() {
      return {
        confirmHtml: null,
        orderNo: null,
        funding: "ERS",
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
          index: 0
        },
        contentTitle: {
          text: ['订单就快完成啦!','请确认您的个人信息'],
          style: {
            padding: ".99rem 0 .18rem 0",
            fontSize: "0.48rem"
          }
        },
        contentDesc: {
          text: ['为了保证交易安全，需要确认您的个人信息','请您在当日24点前确认']
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
      async toNext() {
        if (!this.getOrderNo()) {
          return false
        }
        // 走开户接口
        const param = {
          funding: this.funding,
          channel: "app",
          channelType: env.isApp() ? "IOS" : (env.isAndroid() ? "ANDROID":  "WAP"),
          personId: this.idPerson,
          returnUrl: window.location.origin + '/custom-page/status-pages/#/ppm-confirm?orderNo=' + this.orderNo + '&funding=' + this.funding,
          successfulUrl: window.location.origin + '/custom-page/status-pages/#/e-guide-middleware?orderNo=' + this.orderNo + '&funding=' + this.funding,
          failUrl: window.location.origin + '/custom-page/status-pages/#/ppm-confirm?orderNo=' + this.orderNo + '&funding=' + this.funding,
        }
        const res = await this.$api.eAccount(param);
        if (res.code === 'sc0') {
          if (res.data.isOpen === "2") {
            if (res.data.transNo) {
              window.location.href = res.data.url
              // window.open(res.data.url,'_blank');
            } else {
              this.confirmHtml = res.data.url
              // 提交E融所开户表单
              this.$nextTick(() => {
                this.submitForm()
              })
            }
          }
          if (res.data.isOpen === "1") {
            this.$router.push({name: 'e-guide-middleware', query: {orderNo: this.orderNo}})
          }
        } else {
          this.$toast(res.message)
        }
        // this.$router.push({name: 'e-guide-middleware', query: {orderNo: this.$route.query.orderNo}})
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
      // 提交表单
      submitForm(){
        // document.getElementById("formId").submit();
        this.$refs.confirmForm.querySelector("form").submit();
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
</style>
