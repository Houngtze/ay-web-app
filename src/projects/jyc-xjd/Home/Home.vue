<template>
  <div class="jyc-xjd">
    <p class="header" v-if="topStr" @click="topClick">
      <!--<img src="./images/icon-laba.png">-->
      <template v-if="pageData">
        <span class="link"
              v-if="pageData.newestLoanOrder && pageData.newestLoanOrder.orderStatus === '7'">立即操作&gt;&gt;</span>
        <span class="link"
              v-if="pageData.newestLoanOrder && pageData.newestLoanOrder.orderStatus === '1' && pageData.newestLoanOrder.isWithdrawal !== 'Y'">立即提现&gt;&gt;</span>
      </template>
      {{topStr}}
    </p>
    <div class="content-main">
      <div class="operate-block">
        <p class="p1">额度已激活</p>
        <p class="p2">当前最高可借(元)</p>
        <p class="p3">{{ultimaEncash | moneyFormat}}</p>
        <p class="p4" v-if="productEncash">总额度{{productEncash}}元，日利率低至万5</p>
        <p class="bnt1" v-if="ultimaEncash*1 > 0" @click="goToLoan">{{loan_btn_text}}</p>
        <p class="bnt1" v-else @click="goToCreditwithdrawal">去提额</p>
        <div class="no-quota">
          <div class="item" @click="payNow('1')">
            <img src="./images/icon-repay@2x.png">
            <p>立即还款</p>
          </div>
          <div class="item" @click="payNow('2')">
            <img src="./images/icon-up@2x.png">
            <p>立即提额</p>
          </div>
        </div>
      </div>
      <!-- <p class="bnt2" @click="goLink('/my-loan')">我的借款<span class="num" v-if="loanNum>0">{{loanNum}}</span></p> -->
    </div>
    <p class="tips">注：借款服务由第三方提供，本平台只负责对优质会员展示及推荐</p>
    <!-- 广告 -->
    <source-loan v-if="isVip" />
    <footer-link @onActiveToMyLoan="handleToMyLoan" />
    <!-- 开通会员弹框 -->
    <link-dialog :isShowDialog.sync="isShowLinkDialog" :dialogConfig="linkDialogConfig"/>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from 'vuex';
  import {redirectToLoginPage} from '@/helpers/utils';
  import FooterLink from './components/Footer';
  import SourceLoan from './components/SourceLoan';
  import LinkDialog from '@/components/LinkDialog';

  export default {
    components: {
      FooterLink,
      LinkDialog,
      SourceLoan
    },
    data() {
      return {
        countDown: 3,
        tabHover: true,
        productEncash: 0,
        canClick: false,
        ultimaEncash: 0,  // 额度
        topStr: '逾期将上报人行征信、百行征信、失信名单',
        pageData: null,
        pageDataAll: {},
        noJoinUrl: null,
        noJoinTxt: null,
        loanNum: 0,
        isShowLinkDialog: false,
        linkDialogConfig: {},
        sourceLoanData: null,
        loan_btn_text: "去借钱"
      }
    },
    filters: {
      moneyFormat(moneyStr) {
        // 先将数值取两位小数
        let str = (Math.round(moneyStr * 100) / 100).toString()
        // 找到小数点的下标
        let pointIdx = str.indexOf('.')
        // 如果没有小数点
        if (pointIdx < 0) {
          // 将数值进行千位符转换
          str = str.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
          // 添加小数点
          pointIdx = str.length
          str += '.'
        } else { // 如果有小数点
          // 取整数部分, 也可以用 parseInt
          let int = str.substr(0, pointIdx)
          // 整数部分进行千位符转换
          int.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        }
        // 如果没有小数点,用 0 补全
        while (str.length <= pointIdx + 2) {
          str += '0'
        }
        return str
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        isVip: state => state.global.userInfo.isVip,
        clientCode: state => state.global.clientCode,
        source: state => state.global.source,
      }),
      ...mapState('credit', {
        creditStep: state => state.creditStep,
        activeStatus: state => state.creditStep && state.creditStep.activeStatus
      })
    },
    mounted() {
      this.getPageData();
    },
    methods: {
      ...mapActions('base', [
        'set_txUsableLimit', 'set_canLoan',
      ]),
      ...mapActions('credit', ['setCreditStep']),
      goToPay(orderNo) {
        // 去支付页
        this.goLink({
          path: './result-pay',
          query: {
            lno: orderNo
          }
        });
      },
      payNow(id) {
        if (id == '1') {
          if (!this.personId) {
            if (!this.handleVip()) return false
            if (env.isApp()) {
              return this.$nativeBridge.jumpNative('billToCredit');
            } else {
              window.location.href = window.location.origin + "/custom-page/source-credit/#/baseInfo"
            }
          }
          env.isApp() ? this.goLink('/repayment/loan-list') : this.goToDownLoad();
        }
        if (id == '2') {
          env.isApp() ? this.goToCreditwithdrawal() : this.goToDownLoad();
        }
      },
      // 下载
      goToDownLoad() {
        window.location.href = "http://aiyong.szqk-tech.com/qudao/"
      },
      goLoanPage(orderNo, id, funding) {
        // 去下款页
        this.goLink({
          path: './result-loan',
          query: {
            mallOrderId: orderNo,
            loanOrderId: id,
            funding: funding
          }
        });
      },
      handleToMyLoan() {
        if (!this.handleVip()) return false
        this.goLink('/my-loan')
      },
      // 处理会员
      handleVip() {
        if (this.pageDataAll.data && this.pageDataAll.data.needVip && ~~this.pageDataAll.data.needVip === 1) {
          this.linkDialogConfig = {
            dialogText: JSON.parse(this.pageDataAll.data.reminder),
            dialogBtnTex: '开通会员',
            link: window.location.origin + '/custom-page/goodman-member/#/home?from=loan&type=1'
          }
          this.isShowLinkDialog = true
          return false
        }
        return true
      },
      // 获取页面数据，走准入接口
      async getPageData() {
        // 获取额度状态
        const openParams = {
          // userId: 5170197,
          // personId: 700319,
          userId: this.userId,
          personId: this.personId,
          type: 'XJD_TX'
        }
        const openRes = await this.$api.admissionHttp(openParams);
        this.pageDataAll = openRes;
        if (openRes.code === 'sc0') {
          this.productEncash = openRes.data.productEncash || 0; // 总额度
          this.ultimaEncash = openRes.data.ultimaEncash || 0; // 可提现额度
          this.set_txUsableLimit(this.ultimaEncash);
          this.pageData = openRes.data;
          // 顶部通知
          if (!openRes.data.newestLoanOrder || !openRes.data.newestLoanOrder.mallOrderId) {
            this.topStr = '逾期将上报人行征信、百行征信、失信名单';
          }
          else {
            if (openRes.data.newestLoanOrder.orderStatus === '7') {
              // 待支付
              this.topStr = `您有一笔订单已审核通过，完成确认后即可提现`;
            }
            else if ((openRes.data.newestLoanOrder.orderStatus === '1' && openRes.data.newestLoanOrder.isWithdrawal !== 'Y') || openRes.data.newestLoanOrder.orderStatus === '53') {
              // 待提现
              this.topStr = '您的借款已成功放款，请提现到您的银行卡';
            }
            else if ((openRes.data.newestLoanOrder.orderStatus === '1' || openRes.data.newestLoanOrder.orderStatus === '51') && openRes.data.newestLoanOrder.isWithdrawal === 'Y') {
              // 待还款
              this.topStr = '您的借款已发放，具体以银行到账时间为准';
            }
            else {
              this.topStr = '逾期将上报人行征信、百行征信、失信名单';
            }
          }
          // 准入新规
          this.canJoin();
        } else {
          this.set_canLoan(false);
          if (openRes.data) {
            this.productEncash = openRes.data.productEncash || 8000; // 总额度
            this.ultimaEncash = openRes.data.ultimaEncash || 5000; // 可提现额度
          }
          else {
            this.productEncash = 8000; // 总额度
            this.ultimaEncash = 5000; // 可提现额度
          }
          this.canClick = false;
          //0：准入校验通过；800201：用户未实名；800202：不在白名单内；800203：未授信AMFT产品；800204：您暂不满足资格；800206：您的可用额度不足
          if (openRes.code === 'sc800201') {
            this.loan_btn_text = "立即借钱"
            //  2020-09-04 新增授信前会员判断
            // if (this.pageDataAll.data && this.pageDataAll.data.needVip && ~~this.pageDataAll.data.needVip === 1) {
            //   this.linkDialogConfig = {
            //     dialogText: JSON.parse(this.pageDataAll.data.reminder),
            //     dialogBtnTex: '开通会员',
            //     link: window.location.origin + '/custom-page/goodman-member/#/home'
            //   }
            //   this.isShowLinkDialog = true
            //   return false
            // }
          } else if (openRes.code === 'sc800206') {
            this.ultimaEncash = openRes.data.ultimaEncash || 0;
            this.productEncash = openRes.data.productEncash || 0;
          }
        }
      },
      goNext() {
        // 登录后跳转判断
        if (this.userId && this.personId) {
          this.getCreditStep();
        }
        if (this.userId && !this.personId) {
          if (env.isApp()) {
            return this.$nativeBridge.jumpNative('billToCredit');
          } else {
            window.location.href = window.location.origin + "/custom-page/source-credit/#/baseInfo"
          }
        }
      },
      // 获取当前授信进度
      async getCreditStep() {
        const param = {
          idPerson: this.personId,
          userId: this.userId,
          product: 'AMFT'
        };
        await this.setCreditStep(param);
        let path = null;
        switch (this.creditStep.activeStatus) {
          case 0:
            // 视频认证
            path = '/liveAc';
            break;
          case 10:
          case 20:
          case 30:
          case 40:
            // 身份认证
            path = '/identityAc';
            break;
          case 50:
            // 个人信息
            path = '/personInfo';
            break;
          case 60:
            // 银行卡信息
            path = '/bankInfo';
            break;
          case 70:
          // 等待授信结果
          case 1000:
          case 1100:
            // 授信结束
            path = '/creditResult';
            break;
          case 1400:
            this.$toast('当前用户已绑定账号，不可重复申请。');
            break;
        }
        if (path) {
          if (env.isApp()) {
            return this.$nativeBridge.jumpNative('billToCredit');
          } else {
            window.location.href = window.location.origin + "/custom-page/source-credit/#/" + path
          }
        }
      },
      // app获取版本号
      getVersion() {
        const userAgent = navigator.userAgent
        const version = userAgent.substr(-5, 5)
        console.log(version)
        return (version.replace(/\./g, '') + "00")
      },
      // 去借钱
      async goToLoan() {
        // // 判断是否需要去大金贷补件
        // const isNeedToDajin = await this.getDajinStatus()
        // if (isNeedToDajin) {
        //   return this.$router.push({path: "/dajin-loan"})
        // }
        //  需要会员的必须先走会员
        if (this.pageDataAll.data && this.pageDataAll.data.needVip && ~~this.pageDataAll.data.needVip === 1) {
          this.linkDialogConfig = {
            dialogText: JSON.parse(this.pageDataAll.data.reminder),
            dialogBtnTex: '开通会员',
            link: window.location.origin + '/custom-page/goodman-member/#/home?from=loan&type=1'
          }
          this.isShowLinkDialog = true
          return false
        }
        // 准入新规 2019-07-02
        if (!this.canClick && this.noJoinUrl && this.noJoinTxt) {
          this.$messagebox.alert(this.noJoinTxt).then(action => {
            this.goLink(this.noJoinUrl);
          });
          return false;
        }
        // 未授信去授信
        let str = this.pageDataAll.message || '暂不满足条件';
        if (this.pageDataAll.code === 'sc800201' || this.pageDataAll.code === 'sc800203' || (this.pageDataAll.code === 'sc800202' && this.pageDataAll.data.isCreditedAMFT === '0')) {
          // 未授信
          if (!env.isApp()) {
            return this.goNext();
          }
          return this.$nativeBridge.jumpNative('billToCredit');
        } else if (this.pageDataAll.code === 'sc800202') {
          // 非白名单
          str = "提现功能目前正逐步对外开放，敬请留意！";
        }
        else if (this.pageDataAll.code === 'sc800205') {
          // 授信未通过，包含授信失败，授信未完成
          const param = {
            idPerson: this.personId,
            userId: this.userId,
            product: 'AMFT'
          };
          await this.setCreditStep(param);
          if (this.creditStep.activeStatus !== 1000 && this.creditStep.activeStatus !== 1100) {
            this.goNext();
            return false;
          }
          if ( this.creditStep.activeStatus !== 1100) {
            str = "暂不满足条件";
          }
        }
        else if (this.pageDataAll.code === 'sc800202' && this.pageDataAll.isCreditedAMFT === '-1') {
          // 授信失败，非白名单
          str = "暂不满足条件";
        }
        if (!this.canClick) {
          // // 弹框暂不展示
          // this.$messagebox.alert(str, '').then(action => {
          // // 非白名单有跳转地址
          //   // 授信未通过，包含授信失败，授信未完成
          //  this.$router.push({path: "/org-loan-list"})
          // });
          this.$router.push({path: "/org-loan-list"})
          return false;
        }
        let bqsToken
        if (this.getVersion().toString() >= 37000 && env.isApp()) {
          const bqsData = await this.$nativeBridge.requestBqsToken()
          bqsToken = bqsData.token
        }
        else {
          bqsToken = null;
        }
        let params = {
          userId: this.userId,
          operatorCreditNotifyUrl: window.location.origin + '/custom-page/jyc-xjd/#/home',
          openNotifyUrl: window.location.origin + '/custom-page/jyc-xjd/#/home',
          personId: this.personId,
          product: 'AMFT',
          channel: 'H5',
          urlSource: 'AYQ_XJFQ',
          tokenKey: bqsToken || null,
        }
        const res = await this.$api.userRFEResultHttp(params);
        if (res.code === 'sc0') {
          // this.maxLimitLoanAmt = res.data.maxLimitLoanAmt;
          if (res.data.openStatus === '-1') {
            // 未授信，去授信 ----- 爱满分2授信 AMFT授信
            return this.$nativeBridge.jumpNative('billToCredit');
          }
          if (res.data.maxLimitLoanAmt) {
            this.set_txUsableLimit(res.data.maxLimitLoanAmt / 100);
          }
          if (res.data.operatorCreditUrl) {
            // 未开户或未授权
            this.goLink('/open-msg');
          }
          // else if(res.data.creditResult === "P" || res.data.creditResult === "U"){
          else {
            // 初审通过
            this.goLink({
              path: '/loan',
              query: {
                code: res.data.firstTrialSerialNo
              }
            });
          }
          // else if(res.data.creditResult === "J"){
          //   // 初审拒绝
          //   this.$toast("暂不满足条件");
          // }
        }
        else {
          this.$toast(res.message);
        }
      },
      goLink(url) {
        // 跳转页面
        this.$router.push(url);
      },
      // 准入新需求，需对订单状态做校验 2019-07-02
      canJoin() {
        const orderMsg = this.pageDataAll.data.newestLoanOrder;
        this.canClick = true;
        this.set_canLoan(true);
        this.noJoinUrl = '';
        this.noJoinTxt = '';
        if (orderMsg && orderMsg.mallOrderId) {
          if (orderMsg.orderStatus === '7') {
            // 待支付订单
            this.canClick = false;
            this.set_canLoan(false);
            this.noJoinUrl = {
              path: '/result-pay',
              query: {
                lno: orderMsg.mallOrderId,
              }
            };
            this.noJoinTxt = '您有一笔订单已审核通过，完成确认后即可提现';
          }
          else if (orderMsg.orderStatus === '1' && orderMsg.isWithdrawal !== 'Y') {
            // 待提现订单
            this.canClick = false;
            this.set_canLoan(false);
            this.noJoinUrl = {
              path: './result-loan',
              query: {
                mallOrderId: orderMsg.mallOrderId,
                loanOrderId: orderMsg.id
              }
            };
            this.noJoinTxt = '您有1笔借款已放款成功，请提现到您的银行卡';
          }
          // else if(orderMsg.orderStatus === '1' && orderMsg.isWithdrawal === 'Y'){
          //   // 待还款
          //   this.canClick = false;
          //   this.set_canLoan(false);
          //   this.noJoinUrl = '/loan-list';
          //   this.noJoinTxt = '您有未结清合同，请结清后再申请';
          // }
          else if (orderMsg.orderStatus === '6' || orderMsg.orderStatus === '3') {
            // 初审中 或 终审中
            this.canClick = false;
            this.set_canLoan(false);
            this.noJoinUrl = '/loan-list';
            this.noJoinTxt = '借款申请审核中，请耐心等待';
          }
        }
      },
      // 去提额
      goToCreditwithdrawal() {
        window.location.href = window.location.origin + "/custom-page/credit-withdrawal/#/index"
      },
      // 头部状态点击
      topClick() {
        if (this.pageData.newestLoanOrder && this.pageData.newestLoanOrder.orderStatus === '7') {
          this.goToPay(this.pageData.newestLoanOrder.mallOrderId);
        }
        else if (this.pageData.newestLoanOrder && this.pageData.newestLoanOrder.orderStatus === '1' && this.pageData.newestLoanOrder.isWithdrawal !== 'Y') {
          this.goLoanPage(this.pageData.newestLoanOrder.mallOrderId, this.pageData.newestLoanOrder.id, this.pageData.newestLoanOrder.funding);
        }
      },
      //  2020/10/27 大金贷-获取资格-判断去重
      getDajinStatus() {
        return new Promise(resolve => {
          this.$api.applyDuplicateCheck({
            userId: this.userId
          }).then(res => {
            if (res.code === "0" || res.code === "sc0") {
              if (res.data) {
                resolve(true)
              } else {
                resolve(false)
              }
            } else {
              this.$toast(res.message)
            }
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .jyc-xjd {
    width: 100%;
    min-height: auto !important;
    height: auto !important;
    padding-bottom: .98rem;
    p.tips{
      font-size: .22rem;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(168,168,168,1);
      line-height: .32rem;
      padding-left: .26rem;
      margin-top: .26rem;
    }
    .header {
      height: 0.6rem;
      line-height: 0.6rem;
      flex-shrink: 0;
      background: #FFF8ED;
      color: #D1A056;
      font-size: 0.24rem;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: left;
      padding-left: .28rem;
      img{
        width: .44rem;
        display: inline-block;
        margin-right: .1rem;
      }
      .link {
        float: right;
      }
    }
    .content-main {
      width: 100%;
      background-color: transparent;
      .operate-block{
        background-image: url("./images/home-bg.png");
        background-repeat: no-repeat;
        width: 100%;
        min-height: 6rem;
        background-size: 100% 100%;
        text-align: center;
      }
      p {
        text-align: center;
      }
      .p1 {
        padding-top: .44rem;
        font-size: .28rem;
        font-weight:400;
        color:rgba(54,54,54,1);
        line-height: .4rem;
      }
      .p2 {
        font-size: 0.28rem;
        color: #A8A8A8;
        line-height: 0.5rem;
      }
      .p3 {
        font-size: 0.8rem;
        color: #363636;
        line-height: 1.2rem;
        font-weight: 700;
        margin: 0.06rem 0.18rem;
      }
      .p4 {
        font-size: 0.28rem;
        color: #A8A8A8;
        line-height: .4rem;
      }
      .bnt1 {
        width: 5.4rem;
        height: .9rem;
        line-height: .9rem;
        background:linear-gradient(90deg,rgba(225,188,120,1) 0%,rgba(208,158,84,1) 100%);
        border-radius: .44rem;
        display: inline-block;
        margin-top: .28rem;
        color: #fff;
        font-size: 0.36rem;
      }
      .bnt2 {
        width: 5.4rem;
        height: .9rem;
        border: 1px solid #D09E54;
        background: #fff;
        color: #D09E54;
        font-size: 0.36rem;
        margin-top: 0.4rem;
        margin-bottom: 1.39rem;
        display: inline-block;
        .num {
          width: 0.4rem;
          height: 0.4rem;
          text-align: center;
          line-height: 0.4rem;
          color: #fff;
          background: #FF4545;
          border-radius: 50%;
          margin-left: 0.2rem;
        }
      }
      .bnt-dis {
        background: #d5d5dd;
      }
      .no-quota {
        display: flex;
        padding: .3rem .3rem .4rem .3rem;
        .item {
          width: 50%;
          text-align: center;
          img {
            width: 0.9rem;
          }
          p {
            font-size: 0.24rem;
            line-height: 0.28rem;
          }
        }
      }
    }
    .footer {
      text-align: center;
      flex-shrink: 0;
      height: 0.5rem;
      line-height: 0.98rem;
      margin-top: .3rem;
      /*position: fixed;*/
      width: 100%;
      text-align: center;
      /*bottom: .98rem;*/
      .sp {
        color: #D1A056;
        margin: 0 0.1rem;
        font-size: 0.24rem;
      }
    }
    /deep/ .mint-popup {
      border-radius: .1rem;
    }
    .popup-content {
      width: 5.6rem;
      text-align: center;
      padding: .4rem 0;
      img {
        width: 2.14rem;
        height: auto;
      }
      p {
        line-height: 1;
        &:nth-child(1) {
          color: #363636;
          font-size: .36rem;
          font-weight: 600;
        }
        &:nth-child(2) {
          color: #A8A8A8;
          font-size: .24rem;
          margin-top: .24rem;
          margin-bottom: .32rem;
        }
        &:nth-child(4) {
          color: #363636;
          font-size: .3rem;
          margin-top: .08rem;
          margin-bottom: .2rem;
        }
        &:nth-child(5) {
          color: #A8A8A8;
          font-size: .3rem;
        }
      }
    }
    .kf-model {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      background: rgba($color: #000000, $alpha: .6);
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .bg {
        width: 5.6rem;
        height: auto;
        background: #fff;
        overflow: hidden;
        border-radius: 0.1rem;
        .txt {
          padding: 0 0.33rem;
        }
        p {
          color: #363636;
        }
        .tt {
          font-size: 0.28rem;
          font-weight: bold;
          text-align: center;
          line-height: 0.28rem;
          padding: 0.4rem 0;
        }
        .p1 {
          font-size: 0.28rem;
          line-height: 0.28rem;
          margin: 0.4rem 0;
        }
        .p2 {
          font-size: 0.26rem;
          line-height: 0.34rem;
          margin-bottom: 0.4rem;
        }
        .p3 {
          font-size: 0.26rem;
          line-height: 0.26rem;
          margin: 0.3rem 0 0.4rem 0;
        }
        .enter {
          height: 0.82rem;
          border-top: 1px solid #E5E5E5;
          line-height: 0.82rem;
          font-size: 0.3rem;
          text-align: center;
        }
      }
    }
  }
</style>


