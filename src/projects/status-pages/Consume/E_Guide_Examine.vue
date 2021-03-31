<template>
  <div class="page-layout">
    <!-- 进度条 -->
    <Progress :progressConfig="progress"/>
    <!-- 内容 -->
    <GuideContent :contentTitle="contentTitle" :contentImages="contentImages"
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
        funding: "ERS",
        PPMFormData: null,
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
          index: 2
        },
        contentImages: {
          src: require('./images/examining.png')
        },
        contentTitle: {
          text: ['授权完成!', '距离发货仅剩最后一步'],
          style: {
            padding: ".77rem 0 0 0",
            fontSize: "0.48rem"
          }
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
        if (this.funding === "ERS") {
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
                  this.$router.push({name: 'apply-result', query: {result: "2"}})
                  return
                }
                // 进件判断，成功走审核结果判断，失败走另一个资金方
                if (res.data.entryStatus === "1") {
                  // E融所审核状态判断：1审核中 2 审核拒绝 3审核通过
                  if (res.data.auditStatus === "2") {
                    // 判断PPM是否需要开户
                    this.$router.push({name: 'ppm-confirm', query: {orderNo: this.orderNo}})
                  }
                  if (res.data.auditStatus === "3") {
                    // 受托支付判断
                    if (res.data.entrustStatus === "0" || !res.data.entrustStatus) {
                      if (!await this.bindStatus()) {
                        return false
                      }
                      this.entrustPay()
                    } else {
                      // 审核结果页：1 成功 ，非1为失败
                      this.$router.push({name: 'apply-result', query: {result: "1"}})
                    }
                  }
                } else if (res.data.entryStatus === "0") {
                  // 判断PPM是否需要开户
                  this.$router.push({name: 'ppm-confirm', query: {orderNo: this.orderNo}})
                }
              }
            }
          } else {
            this.$toast(res.message)
          }
        } else {
          this.entrustPay()
        }

      },
      // 受托支付  0 未受托支付 1 已受托支付
      async entrustPay() {
        let successUrl
        if (this.funding === "ERS") {
          successUrl = window.location.origin + '/custom-page/status-pages/#/apply-result?result=1'
        } else if (this.funding === "JZCF") {
          successUrl = window.location.origin + '/custom-page/aiyouqian-success.html#/wait'
        }
        const param = {
          funding: this.funding,
          personId: this.idPerson,
          orderNo: this.orderNo,
          returnUrl: successUrl,
          successUrl: successUrl,
          forgotPwdUrl: window.location.origin + '/custom-page/status-pages/#/e-forget-password?orderNo=' + this.orderNo + '&funding=' + this.funding
        }
        const res = await this.$api.entrustPay(param);
        if (res.code === 'sc0') {
          if (this.funding === "ERS") {
            if (res.data.status === "0") {
              this.examineHtml = res.data.redirectUrl
              this.$nextTick(() => {
                this.submitForm()
              })
            } else {
              this.$toast("受托失败："+ JSON.stringify(res.data))
              return
            }
          }
          if (this.funding === "JZCF") {
            if (res.data.openStatus === "1" && res.data.authStatus === "1") {
              window.location.href = res.data.redirectUrl
              // window.open(res.data.redirectUrl,'_blank');
            } else {
              this.$toast("开户或授权状态出错：" + JSON.stringify(res.data))
              return
            }
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
      // 提交委托支付表单
      submitForm(){
        // document.getElementById("formId").submit();
        this.$refs.examineForm.querySelector("form").submit();
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
      }
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
