<template>
  <div class="jyc-xjd">
    <!-- <NavBar :routerVal="'/mindex'"></NavBar> -->
    <p class="header" v-if="topStutce && topStr" @click="topClick">
      <img class="laba" src="./images/common_img_notice@2x.png">
      <!-- <template v-if="pageData">
          <span class="link" v-if="pageData.newestLoanOrder && pageData.newestLoanOrder.orderStatus === '7'">立即操作&gt;&gt;</span>
          <span class="link"
                v-if="pageData.newestLoanOrder && pageData.newestLoanOrder.orderStatus === '1' && pageData.newestLoanOrder.isWithdrawal !== 'Y'">立即提现&gt;&gt;</span>
      </template> -->
      <span @click="topClick">{{topStr}}</span>
    </p>
    <div class="content-main">
      <p class="p1">额度已激活</p>
      <p class="p2">当前最高可借(元)</p>
      <p class="p3">{{ultimaEncash}}</p>
      <!--<p class="p4" v-if="productEncash">总额度{{productEncash}}元，日利率低至万5</p>-->
      <p class="bnt1" @click="goToLoan" v-preventReClick>去借钱</p>
      <!--<p class="bnt1" v-else @click="windowLink('/custom-page/credit-withdrawal/#/index')">去提额</p>-->
      <p class="jie-btn" @click="goLink('/my-loan')">我的借款 <span class="red" v-if="orderNum">{{orderNum}}</span></p>
    </div>
    <footer-link></footer-link>
    <!-- 广告 -->
    <div class="loan-banner" v-if="!ultimaEncash || ultimaEncash == '****'">
      <img v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/jxh-loan/jxh-loan-home-banner.png'"
           @click="goNext"
           alt="home-banner" />
    </div>
    <!-- 开通会员弹框 -->
    <link-dialog :isShowDialog="isShowLinkDialog" :dialogConfig="linkDialogConfig"/>
    <HandleDialog :popupVisible="isShowHandleDialog"  :handleInfo="handleInfo" @closeHandle="close" @handleFnc="handleFnc"/>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from 'vuex';
  import {redirectToLoginPage} from '@/helpers/utils';
  import FooterLink from './components/Footer';
  import LinkDialog from '@/components/LinkDialog';
  import NavBar from './../components/NavBar';
  import HandleDialog from './../components/handleDialog';
  export default {
    components: {
      FooterLink,
      LinkDialog,
      NavBar,
      HandleDialog,
    },
    data() {
      return {
        countDown: 3,
        vTime: null,
        tabHover: true,
        productEncash: 0,
        canClick: false,
        ultimaEncash: 0,
        topStr: '',
        topStutce: true,
        pageData: null,
        pageDataAll: {},
        noJoinUrl: null,
        noJoinTxt: null,
        loanNum: 0,
        isShowLinkDialog: false,
        linkDialogConfig: {},
        orderNum: null,
        isShowHandleDialog: false,
        handleInfo: {
          handleBtnText: '补充并借钱',
          closeloseText: '关闭',
          resultText: '为满足借钱要求，您还需要补充一些个人信息哦',
        },
        firstTrialSerialNo: ''
      }
    },
    beforeMount() {
    },
    watch: {},
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson || state.global.userInfo.personId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        clientCode: state => state.global.clientCode,
        source: state => state.global.source,
      }),
      ...mapState('credit', {
        creditStep: state => state.creditStep,
        activeStatus: state => state.creditStep && state.creditStep.activeStatus
      }),
      ...mapState('base', {
        configType: state => state.configType
      }),
    },
    async created() {
      // 增加权限导流
      this.getPageData();
      this.getOrder();
      // this.getLoanList(); //我的借款数目，2019-08-01修改UI已取消
    },
    methods: {
      ...mapActions('base', [
        'set_txUsableLimit', 'set_canLoan',
      ]),
      ...mapActions('credit', ['setCreditStep']),
      //关闭处理弹窗
      close() {
        this.isShowHandleDialog = false;
      },
      handleFnc() {
         this.isShowHandleDialog = false;
         window.location.href = window.location.origin + '/custom-page/status-pages/#/jxh-personal-info-complete-info?from=jxh-home&code='+ this.firstTrialSerialNo;
      },
      async getOrder() {
        const params = {
          userId: this.userId,
          status: 0,
        }
        const res = await this.$api.listGiftOrdersHttp(params);
        if (res.code === 'sc0' && res.data && res.data.length) {
          this.orderNum = res.data.length;
        }
      },
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
          env.isJXHAPP() ? this.goLink('/repayment/loan-list') : this.goToDownLoad();
        }
        if (id == '2') {
          env.isJXHAPP() ? this.windowLink('/custom-page/credit-withdrawal/#/index') : this.goToDownLoad();
        }
      },
      goToDownLoad() {
        // 去下载
        if (env.isIos()) {
          location.href = 'https://itunes.apple.com/us/app/%E7%88%B1%E7%94%A8%E5%95%86%E5%9F%8E-%E5%88%86%E6%9C%9F%E8%B4%AD%E7%89%A9%E9%A2%86%E4%BC%98%E6%83%A0%E5%88%B8/id1315925508?l=zh&ls=1&mt=8';
        } else if (env.isAndroid()) {
          location.href = 'http://t.cn/RuBMdMh';
        }
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
      async getPageData() {
        // 获取额度状态
        const openParams = {
          userId: this.userId,
          personId: this.personId,
          type: this.configType
        }
        const openRes = await this.$api.admissionHttp(openParams);
        this.pageDataAll = openRes;
        if (openRes.code === 'sc0') {
          this.productEncash = openRes.data.productEncash; // 总额度
          this.ultimaEncash = openRes.data.ultimaEncash; // 可提现额度
          this.set_txUsableLimit(this.ultimaEncash);
          this.pageData = openRes.data;
          if (openRes.data.newestLoanOrder) {
            const orderStatus = String(openRes.data.newestLoanOrder.orderStatus)
            const isWithdrawal = String(openRes.data.newestLoanOrder.isWithdrawal)
            if ((orderStatus === '1' && isWithdrawal !== 'Y') || orderStatus === '53') {
              // 待提现
              this.topStr = '您有 1 笔借款已放款成功， 请提现到您的银行卡， 立即提现 >>';
            }
            else if (orderStatus === '1') {
              if(new Date().getTime() - new Date(openRes.data.newestLoanOrder.tranDate).getTime() < 24*60*60*1000) {
                this.topStr = '您有 1 笔借款已放款成功， 立即查看 >>';
              }
            } else if (orderStatus === '3' || orderStatus === '6') {
              if (openRes.data.newestLoanOrder.isShowPatchButton) {
                this.topStr = '您有 1 笔借款待添加放款方， 请立即添加 >>';
              } else {
                this.topStr = '您有 1 笔借款申请已在审核中， 立即查看 >>';
              }
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
            this.productEncash = openRes.data.productEncash || "*****"; // 总额度
            this.ultimaEncash = openRes.data.ultimaEncash || "****"; // 可提现额度
          }
          else {
            this.productEncash = "*****"; // 总额度
            this.ultimaEncash = "****"; // 可提现额度
          }
          this.canClick = false;
          //0：准入校验通过；800201：用户未实名；800202：不在白名单内；800203：未授信JXH产品；800204：您暂不满足资格；800206：您的可用额度不足
          if (openRes.code === 'sc800201') {
            return this.goNext();
          } else if (openRes.code === 'sc800206') {
            this.ultimaEncash = openRes.data.ultimaEncash || 0;
            this.productEncash = openRes.data.productEncash || 0;
          }
          if (openRes.code === 'sc800005') {
            this.$toast(openRes.message)
          }
        }
      },
      goNext() {
        if (!this.userId) {
          return redirectToLoginPage();
        }
        // 登录后跳转判断
        if (this.userId) {
          this.getCreditStep();
        }
      },
      async getCreditStep() {
        // 获取当前授信进度
        const param = {
          idPerson: this.personId,
          userId: this.userId,
          accountId: this.ucAccountId
        };
        await this.setCreditStep(param);
        let path = null;
        switch (this.creditStep.status) {
          case 0:
          case 10:
          case 20:
          case 30:
            // 身份认证
            path = '/identityAc';
            break;
          case 40:
            // 视频认证
            path = '/liveAc';
            break;
          case 50:
            // 个人信息
            path = '/personInfo';
            break;
          case 70:
          // 等待授信结果
          case 1000:
          case 1100:
            // 授信结束
            path = '/creditResult';
            break;
        }
        if (this.creditStep && this.creditStep.status !== 1000) {
          if (env.isJXHAPP()) {
            this.$nativeBridge.jumpNative('billToCredit');
          } else {
            window.location.href = window.location.origin + '/custom-page/jxh-credit/#' + path
          }
        }
      },
      async goToLoan() {
        if (event.target.disabled) { //过滤重复点击
          return;
        }
        if (!this.userId) {
          return redirectToLoginPage();
        }
        // 去借钱
        if (this.pageDataAll) {
          //  2019-12-09 新增飞贷现金判断
          if (this.pageDataAll.data && this.pageDataAll.data.needVip && ~~this.pageDataAll.data.needVip === 1) {
            this.linkDialogConfig = {
              dialogText: JSON.parse(this.pageDataAll.data.reminder),
              dialogBtnTex: '开通会员',
              link: window.location.origin + '/custom-page/goodman-member/#/home'
            }
            this.isShowLinkDialog = true
            return false
          }
        }
        if (this.pageDataAll.code === 'sc800201') {
          return this.goNext();
        }
        // 准入新规 2019-07-02
        if (!this.canClick && this.noJoinUrl && this.noJoinTxt) {
          this.$messagebox.alert(this.noJoinTxt).then(action => {
            this.goLink(this.noJoinUrl);
          });
          return false;
        }
        // 判断运营商授权 + 聚有财开户
        let str = this.pageDataAll.message || '暂不满足条件';
        if (this.pageDataAll.code === 'sc800203' || (this.pageDataAll.code === 'sc800202' && this.pageDataAll.data.isCreditedJXH === '0')) {
          // 未授信
          return this.goNext();
        } else if (this.pageDataAll.code === 'sc800202') {
          // 非白名单
          str = "提现功能目前正逐步对外开放，敬请留意！";
          if (this.pageDataAll.data.thridH5URL) {
            // 非白名单有跳转地址
            window.location.href = this.pageDataAll.data.thridH5URL;
            return false;
          }
        }
        else if (this.pageDataAll.code === 'sc800205') {
          // 授信未通过，包含授信失败，授信未完成
          const param = {
            idPerson: this.personId,
            userId: this.userId,
            accountId: this.ucAccountId
          };
          await this.setCreditStep(param);
          if (this.creditStep.activeStatus !== 1000 && this.creditStep.activeStatus !== 1100) {
            this.goNext();
            return false;
          }
          str = "暂不满足条件";
        }
        else if (this.pageDataAll.code === 'sc800202' && this.pageDataAll.isCreditedJXH === '-1') {
          // 授信失败，非白名单
          str = "暂不满足条件";
        }
        if (!this.canClick) {
          this.$messagebox.alert(str, '');
          return false;
        }
        let params = {
          userId: this.userId,
          operatorCreditNotifyUrl: window.location.origin + '/custom-page/jxh-loan/#/home',
          openNotifyUrl: window.location.origin + '/custom-page/jxh-loan/#/home',
          personId: this.personId,
          product: 'JXH',
          channel: 'H5',
          urlSource: 'JXH_XJFQ',
          tokenKey: null,
        }
        const res = await this.$api.userRFEResultHttp(params);
        if (res.code === 'sc0') {
          //需要补充补充个人信息资料
          if(this.pageDataAll.data.addDataType == 1){
            this.firstTrialSerialNo = res.data.firstTrialSerialNo
            this.isShowHandleDialog = true;
            return;
          }
          // this.maxLimitLoanAmt = res.data.maxLimitLoanAmt;
          if (res.data.openStatus === '-1') {
            // 未授信，去授信 ----- 爱满分2授信 JXH授信
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
      canJoin() {
        // 准入新需求，需对订单状态做校验 2019-07-02
        const orderMsg = this.pageDataAll.data.newestLoanOrder;
        this.canClick = true;
        this.set_canLoan(true);
        this.noJoinUrl = '';
        this.noJoinTxt = '';
        if (orderMsg && orderMsg.mallOrderId) {
          if (orderMsg.orderStatus === '1' && orderMsg.isWithdrawal !== 'Y') {
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
          // TO DO
          //  需要修改判断是否添加过放款银行卡
          else if (orderMsg.orderStatus === '3' || orderMsg.orderStatus === '6') {
            // 初审中 或 终审中
            this.canClick = false;
            this.set_canLoan(false);
            this.noJoinUrl = {
              path: '/loan-list',
              query: { menuStatic: 2}
            };
            if (orderMsg.isShowPatchButton) {
              this.noJoinTxt = '借款申请审核中，请耐心等待';
            } else {
              this.noJoinTxt = '借款申请审核中，请耐心等待';
            }
          }
        }
      },
      async getLoanList() {
        const params = {
          personId: this.personId,
          productCode: 'JXH',
          orderType: 2
        }
        const res = await this.$api.queryOrdersListHttp(params);
        if (res.code === 'sc0' && res.data) {
          this.loanList = res.data.length;
          for (let item in res.data) {
            if ((res.data[item].orderStatus === '1' && res.data[item].isWithdrawal !== 'Y') || res.data[item].orderStatus === '7') {
              this.loanNum = this.loanNum + 1;
            }
          }
        }
      },
      windowLink(url) {
        window.location.href = url
      },
      linkOnwer(url) {
        window.location.href = window.location.origin + url
      },
      topClick() {
        // 头部状态点击
        const orderData = this.pageData.newestLoanOrder
        if (orderData.orderStatus === '7') {
          this.goToPay(orderData.mallOrderId);
        }
        else if (orderData.orderStatus === '1') {
          if (orderData.isWithdrawal !== 'Y') {
            this.goLoanPage(orderData.mallOrderId, orderData.id, orderData.funding);
          } else {
            this.$router.push({path: '/loan-list', query: { menuStatic: 1}})
          }
        }else if (orderData.orderStatus === '3' || orderData.orderStatus === '6') {
          this.$router.push({path: '/loan-list', query: { menuStatic: 2}})
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.vTime);
    }
  }
</script>
<style lang="scss" scoped>
  .jyc-xjd {
    width: 100%;
    min-height: 100%;
    height: inherit;
    background: #fff;
    .header {
      min-height: 0.7rem;
      // line-height: 0.7rem;
      flex-shrink: 0;
      background: #FFFAF2;
      padding: 0 0.2rem;
      color: #BA9950;
      font-size: 0.26rem;
      display: flex;
      align-items: center;
      .link {
        float: right;
      }
      .laba {
        width: .44rem;
        height: .44rem;
      }
    }
    .content-main {
      width: 100%;
      padding: 0 0.3rem;
      .jie-btn {
        width: 6.84rem;
        height: .88rem;
        margin: 0 auto;
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: .44rem;
        line-height: 0.88rem;
        color: #A8A8A8;
        font-size: 0.32rem;
        margin-top: .40rem;
        position: relative;

        .red {
          width: 0.35rem;
          height: 0.35rem;
          overflow: hidden;
          text-align: center;
          line-height: 0.35rem;
          background: #FF0000;
          color: #fff;
          font-size: 0.22rem;
          display: inline-block;
          border-radius: 100%;
          position: absolute;
          top: 33%;
          right: 34%;

        }
      }
      p {
        text-align: center;
      }
      .p1 {
        padding-top: 1.19rem;
        color: #363636;
        font-size: 0.32rem;
      }
      .p2 {
        font-size: 0.28rem;
        color: #A8A8A8;
        line-height: 0.5rem;
      }
      .p3 {
        font-size: 1.2rem;
        color: #363636;
        line-height: 1.2rem;
        font-weight: 500;
        margin: 0.68rem 0;
      }
      .p4 {
        font-size: 0.28rem;
        color: #A8A8A8;
        margin-bottom: 1.6rem;
      }
      .bnt1 {
        width: 6.84rem;
        height: 0.92rem;
        background-color: #BA9950;
        line-height: 0.91rem;
        color: #fff;
        font-size: 0.32rem;
        border-radius: .44rem;
        margin-top: 1.39rem;
        margin: 0 auto;
      }
      .bnt2 {
        width: 100%;
        height: 0.92rem;
        border: 1px solid #D09E54;
        background: #fff;
        line-height: 0.91rem;
        color: #D09E54;
        font-size: 0.32rem;
        border-radius: 0.15rem;
        margin-top: 0.4rem;
        margin-bottom: 1.39rem;
        display: flex;
        align-items: center;
        justify-content: center;
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
        .item {
          width: 50%;
          text-align: center;
          padding: 0.8rem 0;
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
      height: 0.98rem;
      line-height: 0.98rem;
      padding-bottom: .92rem;
      padding-top: 1.92rem;
      background-color: #fff;
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
  .loan-banner{
    width: 100%;
    img{
      width: 100%;
    }
  }
</style>


