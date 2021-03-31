<template>
  <div class="page-layout">
    <!-- 内容 -->
    <GuideContent :contentTitle="contentTitle" :contentBtn="contentBtn" :contentImages="contentImages" style="min-height: 100%" />
    <div class="e-forget-password-content" v-if="forGetPwHtml" v-html="forGetPwHtml" ref="formSubmit"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import GuideContent from './components/GuideContent/index'
  import env from "@/helpers/env";

  export default {
    name: "E_ForgetPassword",
    components: {
      GuideContent
    },
    data() {
      return {
        forGetPwHtml: null,
        orderNo: null,
        contentTitle: {
          text: ['请点击下一步找回密码'],
          style: {
            padding: "2.3rem 0 0 0",
            fontSize: "0.4rem"
          }
        },
        contentImages: {
          src: require('./images/forgetPw.png'),
          style: {
            margin: "0 0 .3rem 0"
          }
        },
        contentBtn: {
          text: '下一步',
          style: {
            minWidth: '6.9rem',
            height: '.92rem',
            borderRadius: '.1rem'
          },
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
        const param = {
          personId: this.idPerson,
          channelType:  env.isApp() ? "IOS" : (env.isAndroid() ? "ANDROID":  "WAP"),
          returnUrl: window.location.origin + '/custom-page/status-pages/#/e-guide-middleware?orderNo=' + this.orderNo
        }
        const res = await this.$api.trsPwdReset(param);
        if (res.code === 'sc0') {
          this.forGetPwHtml = res.data.reSetPassword
          this.$nextTick(() => {
            this.submitForm()
          })
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
      // 提交表单
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
  }
  .e-forget-password-content{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
