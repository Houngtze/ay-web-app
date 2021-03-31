<template>
  <div class="page-layout">
    <!-- 受托支付html -->
    <div v-html="examineHtml" ref="examineForm" style="display: none"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "Skip_MiddlePage",
    data() {
      return{
        PPMFormData: null,
        examineHtml: null,
        orderNo: null,
        needPPM: null
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
      this.getPPMStatus()
      // 进入页面判断
      this.initPage()
    },
    methods: {
      // 页面初始化接口跳转
      async initPage() {
        if (!this.getOrderNo()) {
          return false
        }
        // 获取风控结果
        const param = {
          orderNo: this.orderNo,
          personId: this.idPerson,
        }
        const res = await this.$api.riskQueryResult(param);
        if (res.code === 'sc0') {
          // E融所开户状态判断： 0 开户失败 1 开户成功
          if (res.data.openStatus === "1") {
            // 二合一授权支付状态判断：0 未授权 1 已授权
            if (res.data.authStatus === "1") {
              // 判断订单状态（判断风控审核结果）
              if (res.data.orderStatus && res.data.orderStatus === "6") {
                this.$router.replace({name: 'apply-result', query: {result: "2"}})
                return
              }
              // 进件判断，成功走审核结果判断，失败走另一个资金方
              if (res.data.entryStatus === "1") {
                // E融所审核状态判断：1审核中 2 审核拒绝 3审核通过
                if (res.data.auditStatus === "2") {
                  // 判断PPM是否需要开户
                  if (res.data.needPpmOpen) {
                    this.$router.replace({name: 'ppm-confirm', query: {orderNo: this.orderNo}})
                  } else {
                    this.$router.replace({name: 'e-guide-examine-direct', query: {orderNo: this.orderNo}})
                  }
                }
                if (res.data.auditStatus === "3") {
                  if (!await this.bindStatus()) {
                    return false
                  }
                  // 受托支付判断
                  if (res.data.entrustStatus === "0" || !res.data.entrustStatus) {
                    this.entrustPay()
                  } else {
                    // 审核结果页：1 成功 ，非1为失败
                    this.$router.replace({name: 'apply-result', query: {result: "1"}})
                  }
                }
              } else if (res.data.entryStatus === "0") {
                // 判断PPM是否需要开户
                this.$router.replace({name: 'ppm-confirm', query: {orderNo: this.orderNo}})
              } else if (res.data.entryStatus === "2") {
                // 判断PPM是否需要开户
                this.$router.replace({name: 'e-guide-examine', query: {orderNo: this.orderNo}})
              }
            }
            if (res.data.authStatus === "0") {
              if (this.needPPM === "1") {
                this.$router.replace({name: 'e-guide-middleware', query: {orderNo: this.orderNo}})
              } else if (this.needPPM === "2") {
                this.$router.replace({name: 'e-guide-examine-direct', query: {orderNo: this.orderNo}})
              }
            }
          }
          if (res.data.openStatus === "0") {
            this.$router.replace({name: 'e-guide-confirm',query: {orderNo: this.orderNo}})
          }
        } else {
          this.$toast(res.message)
        }
      },
      // 受托支付  0 未受托支付 1 已受托支付
      async entrustPay() {
        const param = {
          personId: this.idPerson,
          orderNo: this.orderNo,
          returnUrl: window.location.origin + '/custom-page/status-pages/#/apply-result?result=1',
          forgotPwdUrl: window.location.origin + '/custom-page/status-pages/#/e-forget-password?orderNo=' + this.orderNo,
        }
        const res = await this.$api.entrustPay(param);
        if (res.code === 'sc0') {
          if (res.data.status === "0") {
            this.examineHtml = res.data.redirectUrl
            this.$nextTick(() => {
              this.submitForm()
            })
          } else {
            this.$router.push({name: 'e-guide-examine'})
          }
        } else {
          this.$toast(res.message)
        }
      },
      // 查询标的登记
      bindStatus() {
        return new Promise(async resolve => {
          const param = {
            orderNo: this.orderNo,
            idPerson: this.idPerson
          };
          const res = await await this.$api.bindStatus(param);
          let bindResult;
          if (res.code !== 'sc10000') {
            this.$toast(res.message)
            bindResult =  false
          } else {
            bindResult =  true
          }
          resolve(bindResult);
        });
      },
      // 提交表单
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
      // 版本号
      getVersion () {
        const userAgent = navigator.userAgent
        const version = userAgent.substr(-5, 5)
        return version.replace(/\./g, '') + "00"
      },
      // 获取ppm开户
      async getPPMStatus() {
        let params={
          userId:this.userId,
          idPerson:this.idPerson,
          channel:'APP',
          product: "AMFT",
          version: this.getVersion()
        };
        let res=await this.$api.getPPMResultHttp(params);
        if(res.code=='sc0') {
          if (res.data.isPpmOpen === "1") {
            //已开户
            this.needPPM = "1"
          } else {
            this.needPPM = "2"
          }
        }else {
          this.$toast(res.message)
        }
      },
    }
  }
</script>

<style scoped>
  .page-layout {
    min-height: 100%;
    width: 100%;
    background-color: #fff;
    overflow: hidden;
  }
</style>
