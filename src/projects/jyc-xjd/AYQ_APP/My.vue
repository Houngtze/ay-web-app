<template>
  <div class="page-layout ">
    <!-- 顶部登陆 -->
    <div class="page-header">
      <div class="header-content">
        <p flex-row-center flex-left>
          <img src="./images/user-pic.png"/>
          <span @click="toLogin">{{userName}}</span>
        </p>
      </div>
    </div>
    <!-- 卡片内容 -->
    <div class="page-content">
      <div class="money-block">
        <div class="block-content">
          <div class="desc">
            <p>{{userDesc}}</p>
            <h2>{{formatUsefulMoney(userMoney)}}</h2>
          </div>
          <div class="btn" @click="">
            <button @click="goToLoan">{{userBtnText}}</button>
          </div>
        </div>
      </div>
      <div class="option-block">
        <div class="option-item arrow g-mobile-border" @click="goLink('/my-loan')">
          <img src="./images/icon-myloan.png">
          <span>我的借款</span>
        </div>
        <div class="option-item arrow g-mobile-border" @click="$toast('暂未开放')">
          <img src="./images/icon-mypayback.png">
          <span>我的还款</span>
        </div>
        <div class="option-item arrow g-mobile-border" @click="goLink('/order-list')">
          <img src="./images/icon-myloan.png">
          <span>待支付订单</span>
        </div>
        <div class="option-item arrow" @click="kfClick">
          <img src="./images/icon-customer.png">
          <span>联系客服</span>
        </div>
      </div>
    </div>
    <customer-service-dialog :kfModel="kfModel" @handleCustomerDialog="handleCustomerDialog"></customer-service-dialog>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import customerServiceDialog from '../components/customerServiceDialog'
  import {redirectToLoginPage} from '@/helpers/utils'

  export default {
    name: "My",
    components: {
      customerServiceDialog
    },
    data() {
      return {
        loginName: '立即登录',
        loginDesc: '最高可借额度(元)',
        loginMoney: 20000,
        loginBtnText: '申请额度',
        kfModel: false,
        productEncash:0,
        canClick: false,
        ultimaEncash:0,
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
      userName() {
        return this.userId ? '爱有钱用户' : this.loginName
      },
      userMoney() {
        return this.userId ? this.ultimaEncash : this.loginMoney
      },
      userDesc() {
        return this.userId ? '您的可用额度(元)' : this.loginBtnText
      },
      userBtnText() {
        return this.userId ? '立即提现' : this.loginBtnText
      }
    },
    methods: {
      ...mapActions('global', ['updateUserInfo']),
      formatUsefulMoney(money) {
        return money.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
      },
      goLink(url) {
        url && this.$router.push({path: url})
      },
      handleCustomerDialog(data) {
        this.kfModel = data
      },
      kfClick(){
        this.kfModel = !this.kfModel;
      },
      toLogin() {
        if (!this.userId) {
          redirectToLoginPage()
          return
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
        if(openRes.code === 'sc0') {
          this.productEncash = openRes.data.productEncash; // 总额度
          this.ultimaEncash = openRes.data.ultimaEncash; // 可提现额度
        }
      },
      async goToLoan(){
        this.toLogin()
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
      // app获取版本号
      getVersion () {
        const userAgent = navigator.userAgent
        const version = userAgent.substr(-5, 5)
        console.log(version)
        return (version.replace(/\./g, '') + "00")
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
      }
    }
  }
</script>

<style scoped lang="scss">
  .page-layout{
    width: 100%;
    background: #f2f2f2;
    position: relative;
  }
  .page-header{
    background: #292929;
    & .header-content{
      width: 100%;
      height: 2.4rem;
      padding: .3rem;
      & img{
        width: .7rem;
        height: .7rem;
        display: block;
        margin: .3rem 0;
      }
      & p{
        width: 100%;
        height: .7rem;
        background: #292929;
        color: #fff;
        font-size: .36rem;
        line-height: .5rem;
        & span{
          padding-left: .2rem;
        }
      }
    }
  }
  .page-content {
    .money-block {
      .block-content {
        width: 6.9rem;
        height: 2.2rem;
        background: #fff;
        box-shadow: 0 0.05rem 0.12rem 0px rgba(153, 153, 153, 0.2);
        border-radius: .1rem;
        padding: .46rem .4rem;
        margin: -1.1rem auto 0 auto;
        color: #363636;
        display: flex;
        align-items: center;
        justify-content: left;
      }
      .desc{
        flex: 1;
        & p{
          font-size: .28rem;
          line-height: .4rem;
          margin-bottom: .12rem;
        }
        & h2{
          font-size: .72rem;
          line-height: .86rem;
        }
      }
      .btn{
        & button{
          display: inline-block;
          -webkit-appearance: none;
          border: none;
          background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
          border-radius: 0.1rem;
          width: 2.2rem;
          height: .8rem;
          color: #fff;
          font-size: .3rem;
          font-weight: 400;
          line-height: .42rem;
        }
      }
    }
    .option-block {
      width: 100%;
      padding: .4rem .3rem;
      border-radius: .1rem;
      & .option-item{
        display: flex;
        align-items: center;
        justify-content: left;
        background: #fff;
        padding: .3rem;
        & img{
         width: .54rem;
          height: .54rem;
          display: inline-block;
        }
        & span{
          font-size: .28rem;
          padding-left: .16rem;
          line-height: .4rem;
        }
        &.arrow{
          position: relative;
          padding-right: .26rem;
          &::before {
            content: "";
            display: inline-block;
            height: 0.2rem;
            width: 0.2rem;
            border-width: 0.02rem 0.02rem 0 0;
            border-color: #C8C8C8;
            border-style: solid;
            transform: translate(0, -50%) rotate(45deg);
            position: absolute;
            top: 50%;
            right: .3rem;
          }
        }
      }
    }
  }
</style>
