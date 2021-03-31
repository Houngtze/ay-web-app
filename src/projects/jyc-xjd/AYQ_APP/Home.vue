<template>
  <div class="page-layout">
    <!-- 顶部文字 -->
    <div class="page-header">
      <div class="header-content">
        <p flex-left flex-row-center>
          <img src="./images/notice-icon.png">
          <span>逾期将上报人行征信，百行征信，失信名单</span>
        </p>
      </div>
    </div>
    <!-- 滑块内容 -->
    <div class="page-content">
      <div class="money-block">
        <div class="block-content">
          <p class="title">可借额度(元)</p>
          <h1>{{formatUsefulMoney}}</h1>
          <p class="tips">总额度5000元，日利率低至万5</p>
          <div class="range-block">
            <span>{{rangeValue.min}}</span>
            <random-range :range="rangeConfig" @handleRange="getRangeData" class="range"></random-range>
            <span>{{rangeValue.max}}</span>
          </div>
        </div>
        <div class="button-content">
          <button @click="goToLoan">立即拿钱</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import env from '@/helpers/env'
  import randomRange from '@/components/randomRange'
  import {redirectToLoginPage} from '@/helpers/utils'
  export default {
    name: "index",
    components: {
      randomRange
    },
    data () {
      return {
        rangeConfig: {
          max: 50000,
          min: 1000,
          step: 500,
          value: 30000
        },
        rangeValue: null,
        productEncash:0,
        canClick: false,
        ultimaEncash:0,
        topStr:'',
        topStutce:false,
        pageData: null,
        pageDataAll:{},
        noJoinUrl:null,
        noJoinTxt:null
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
        ucAccountId: state => state.global.userInfo.ucAccountId
      }),
      formatUsefulMoney() {
        return this.rangeValue.value.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
      }
    },
    created () {
      this.rangeValue = this.rangeConfig
      if (!this.userId) {
        this.getPageData();
        this.getLoanList();
      }
    },
    methods: {
      ...mapActions('base', [
        'set_txUsableLimit', 'set_canLoan',
      ]),
      getRangeData(data) {
        this.rangeValue = data
      },
      async goToLoan(){
        if (!this.userId) {
          redirectToLoginPage()
          return
        }
        // 准入新规 2019-07-02
        if(!this.canClick && this.noJoinUrl && this.noJoinTxt){
          this.$messagebox.alert(this.noJoinTxt).then(action => {
            this.goLink(this.noJoinUrl);
          });
          return false;
        }
        // 判断运营商授权 + 聚有财开户
        let str = this.pageDataAll.message || '暂不满足条件';
        if(this.pageDataAll.code === 'sc800203' || (this.pageDataAll.code === 'sc800202' && this.pageDataAll.data.isCreditedAMFT === '0')) {
          // 未授信
          this.$nativeBridge.jumpNative('billToCredit');
          return false;
        } else if(this.pageDataAll.code === 'sc800202') {
          // 非白名单
          str = "提现功能目前正逐步对外开放，敬请留意！";
          if(this.pageDataAll.data.thridH5URL){
            // 非白名单有跳转地址
            window.location.href = this.pageDataAll.data.thridH5URL;
            return false;
          }
        }
        else if((this.pageDataAll.code === 'sc800202' && this.pageDataAll.isCreditedAMFT === '-1') || this.pageDataAll.code === 'sc800205') {
          // 授信失败，非白名单
          str = "暂不满足条件";
        }
        if(!this.canClick){
          this.$messagebox.alert(str,'');
          return false;
        }
        let bqsToken
        if(this.getVersion().toString() >= 37000){
          const bqsData = await this.$nativeBridge.requestBqsToken()
          bqsToken = bqsData.token
        }
        else{
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
        if(res.code === 'sc0'){
          // this.maxLimitLoanAmt = res.data.maxLimitLoanAmt;
          if(res.data.openStatus === '-1'){
            // 未授信，去授信 ----- 爱满分2授信 AMFT授信
            this.$nativeBridge.jumpNative('billToCredit');
            return false;
          }
          if(res.data.maxLimitLoanAmt){
            this.set_txUsableLimit(res.data.maxLimitLoanAmt/100);
          }
          if(res.data.operatorCreditUrl){
            // 未开户或未授权
            this.goLink('./open-msg');
          }
          // else if(res.data.creditResult === "P" || res.data.creditResult === "U"){
          else{
            // 初审通过
            this.goLink('./loan');
          }
          // else if(res.data.creditResult === "J"){
          //   // 初审拒绝
          //   this.$toast("暂不满足条件");
          // }
        }
        else{
          this.$toast(res.message);
        }
      },
      async getPageData(){
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
        if(openRes.code === 'sc0'){
          this.productEncash = openRes.data.productEncash; // 总额度
          this.ultimaEncash = openRes.data.ultimaEncash; // 可提现额度
          this.set_txUsableLimit(this.ultimaEncash);
          this.pageData = openRes.data;
          if(!openRes.data.newestLoanOrder || !openRes.data.newestLoanOrder.mallOrderId){
            this.topStutce = true;
            this.topStr = '根据您最近的信用评分，现已为您开通爱满分提现功能';
          }
          else{
            if(openRes.data.newestLoanOrder.orderStatus === '7'){
              // 待支付
              this.topStutce = true;
              this.topStr = `您的借款已审核通过，完成支付即可提现`;
            }
            else if((openRes.data.newestLoanOrder.orderStatus === '1' && openRes.data.newestLoanOrder.isWithdrawal !== 'Y') || openRes.data.newestLoanOrder.orderStatus === '53'){
              // 待提现
              this.topStutce = true;
              this.topStr = '您的借款已成功放款，请提现到您的银行卡';
            }
            else if((openRes.data.newestLoanOrder.orderStatus === '1' || openRes.data.newestLoanOrder.orderStatus === '51') && openRes.data.newestLoanOrder.isWithdrawal === 'Y'){
              // 待还款
              this.topStutce = true;
              this.topStr = '您的借款已发放，具体以银行到账时间为准';
            }
            else{
              this.topStutce = false;
              this.topStr = '您的额度已经提现成功，去查看您的银行卡';
            }
          }
          // 准入新规
          this.canJoin();
        } else {
          this.set_canLoan(false);
          if(openRes.data){
            this.productEncash = openRes.data.productEncash || 8000; // 总额度
            this.ultimaEncash = openRes.data.ultimaEncash || 5000; // 可提现额度
          }
          else{
            this.productEncash = 8000; // 总额度
            this.ultimaEncash = 5000; // 可提现额度
          }
          this.canClick = false;
          //0：准入校验通过；800201：用户未实名；800202：不在白名单内；800203：未授信AMFT产品；800204：您暂不满足资格；800206：您的可用额度不足
          if(openRes.code === 'sc800201'){
            this.$nativeBridge.jumpNative('billToCredit');
            return false;
          } else if(openRes.code === 'sc800206'){
            this.ultimaEncash = openRes.data.ultimaEncash;
            this.productEncash = openRes.data.productEncash;
          }
        }
      },
      // app获取版本号
      getVersion () {
        const userAgent = navigator.userAgent
        const version = userAgent.substr(-5, 5)
        console.log(version)
        return (version.replace(/\./g, '') + "00")
      },
      goLink(url) {
        // 跳转页面
        this.$router.push(url);
      },
      canJoin(){
        // 准入新需求，需对订单状态做校验 2019-07-02
        const orderMsg = this.pageDataAll.data.newestLoanOrder;
        this.canClick = true;
        this.set_canLoan(true);
        this.noJoinUrl = '';
        this.noJoinTxt = '';
        if(orderMsg && orderMsg.mallOrderId){
          if(orderMsg.orderStatus === '7'){
            // 待支付订单
            this.canClick = false;
            this.set_canLoan(false);
            this.noJoinUrl = {
              path:'/result-pay',
              query:{
                lno:orderMsg.mallOrderId,
              }
            };
            this.noJoinTxt = '您有1笔借款已审核，购买会员后即刻到账';
          }
          else if(orderMsg.orderStatus === '1' && orderMsg.isWithdrawal !== 'Y'){
            // 待提现订单
            this.canClick = false;
            this.set_canLoan(false);
            this.noJoinUrl = {
              path:'./result-loan',
              query:{
                mallOrderId:orderMsg.mallOrderId,
                loanOrderId:orderMsg.id
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
          else if(orderMsg.orderStatus === '6' || orderMsg.orderStatus === '3'){
            // 初审中 或 终审中
            this.canClick = false;
            this.set_canLoan(false);
            this.noJoinUrl = '/loan-list';
            this.noJoinTxt = '借款申请审核中，请耐心等待';
          }
        }
      },
      async getLoanList(){
        const params = {
          personId: this.personId,
          productCode: 'AMFT',
          orderType: 2
        }
        const res = await this.$api.queryOrdersListHttp(params);
        if(res.code === 'sc0' && res.data){
          this.loanList = res.data.length;
          for(let item in res.data){
            if((res.data[item].orderStatus === '1' && res.data[item].isWithdrawal !== 'Y') || res.data[item].orderStatus === '7'){
              this.loanNum = this.loanNum + 1;
            }
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
.page-layout{
  width: 100%;
  background: #fff;
  position: relative;
}
.page-header{
  & .header-content{
    width: 100%;
    height: 2.4rem;
    background: linear-gradient(90deg,rgba(34,34,34,1) 0%,rgba(17,17,17,1) 100%);
    & p{
      width: 100%;
      height: .7rem;
      background: #292929;
      color: #fff;
      font-size: .28rem;
      line-height: .4rem;
      & img{
        width: .7rem;
        display: block;
      }
    }
  }
}
  .page-content{
    .money-block{
      .block-content{
        width: 6.9rem;
        height: 4rem;
        background: #fff;
        box-shadow:0 0.05rem 0.12rem 0px rgba(153,153,153,0.2);
        border-radius: .1rem;
        padding: .4rem .2rem;
        margin: -1.2rem auto 0 auto;
        & p{
          text-align: center;
          color: #363636;
          &.title{
            font-size: .24rem;
            line-height: .34rem;
            margin-bottom: .2rem;
          }
          &.tips{
            font-size: .24rem;
            font-weight:400;
            color: rgba(134,134,134,1);
            line-height: .34rem;
            margin-top: .12rem;
          }
        }
        & h1{
          font-size: 1rem;
          font-weight:500;
          color: rgba(54,54,54,1);
          line-height: 1.2rem;
          text-align: center;
        }
        & .range-block{
          margin-top: .4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          & span{
            font-size: .2rem;
            color: #a8a8a8;
          }
          & .range{
            flex: 1;
            margin: .2rem;
          }
        }
      }
      & .button-content{
        margin-top: 1.2rem;
        width: 100%;
        text-align: center;
        & button{
          display: inline-block;
          -webkit-appearance: none;
          border: none;
          background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
          border-radius: .1rem;
          width: 6.9rem;
          height: .92rem;
          line-height: .92rem;
          color: #fff;
          font-size: .36rem;
          font-weight:400;
          line-height: .5rem;
        }
      }
    }
  }
</style>
