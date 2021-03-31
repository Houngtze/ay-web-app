<template>
  <div class="page-layout">
    <!-- 进度条 -->
    <Progress :progressConfig="progress"/>
    <!-- 内容 -->
    <GuideContent :contentTitle="contentTitle" :contentDesc="contentDesc"
                  :contentBtn="contentBtn" style="margin-top: .18rem;">
    </GuideContent>
    <!-- 受托支付html -->
    <div v-html="examineHtml" ref="examineForm" style="display: none" ></div>
    <!-- PPM -->
    <div v-if="PPMFormData" v-html="PPMFormData" v-show="false" ref="formSubmit"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Progress from './components/Progress/index'
  import GuideContent from './components/GuideContent/index'

  export default {
    name: "E_Guide_Confirm",
    components: {
      Progress,
      GuideContent
    },
    data() {
      return {
        examineHtml: null,
        orderNo: null,
        PPMFormData: null,
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
          index: 1
        },
        contentTitle: {
          text: ['个人信息确认完成', '请牢记密码'],
          style: {
            padding: ".77rem 0 .6rem 0",
            fontSize: "0.48rem"
          }
        },
        contentBtn: {
          text: '下一步',
          onActive: this.toNext
        },
        contentDesc: {
          text: ['为了保证交易安全需要确认您的个人信息并授权分期交易，', '请您在当日24点前确认']
        }
      }
    },
    computed: {
      ...mapState({
        idPerson: state => state.global.userInfo.idPerson,
        userId: state => state.global.userInfo.userId,
      }),
    },
    created() {
      // 获取订单号，没有则提示
      this.getOrderNo()
    },
    methods: {
      // 下一步
      async toNext() {
        if (!this.getOrderNo()) {
          return false
        }
        this.entrustPay()
      },
      // 受托支付  0 未受托支付 1 已受托支付
      async entrustPay() {
        const param = {
          personId: this.idPerson,
          orderNo: this.orderNo,
          channel: 'H5'
        }
        const res = await this.$api.JYC_EntrustPay(param);
        if (res.code === 'sc0') {
          if (res.data.status === "1") {
            // this.examineHtml = res.data.redirectUrl
            // this.$nextTick(() => {
            //   this.submitForm()
            // })
            window.location.href = res.data.redirectUrl
          } else {
            this.$toast('获取受托支付失败：' + JSON.stringify(res.data))
          }
        } else {
          this.$toast(res.message)
        }
      },
      // 提交委托支付表单
      submitForm(){
        // document.getElementById("formId").submit();
        this.$refs.examineForm.querySelector("form").submit();
      },
      // 提交ppm表单
      submitPPMForm(){
        // document.getElementById("formId").submit();
        this.$refs.formSubmit.querySelector("form").submit();
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
      // PPM审核状态
      async getPPMStatus() {
        let params={
          userId:this.userId,
          idPerson:this.idPerson,
          channel:'APP',
          product: "AMFT"
        };
        let res=await this.$api.getPPMResultHttp(params);
        if(res.code=='sc0') {
          if (res.PPMFormData.isPpmOpen === "1") {
            //已开户
            this.$router.push({name: 'apply-result', query: {result: "1"}})
          }
          else {
            //未开户
            if (this.PPMFormData.urlType === 2) {
              window.location.href = this.PPMFormData.url
            } else {
              this.submitPPMForm()
            }
          }
        }else {
          this.$toast(res.message)
        }
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
  .content-extra{
    margin-top: .62rem;
    padding: 0 .3rem;
    & p {
      font-size: .24rem;
      line-height: 1.5;
      margin-bottom: .1rem;
      display: flex;
      & label{
        padding: 0 0.15rem 0 0.1rem;
        height: .35rem;
        line-height: .35rem;
        background-color: #d8d8d8;
        color: #363636;
        margin-right: 0.12rem;
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
      }
      & span{
        flex: 1;
        color: #868686;
      }
    }
  }
  .e-examine-content{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
