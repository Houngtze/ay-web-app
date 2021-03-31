<template>
<div class="jyc-xjd">
  <div class="content-main">
    <p class="top-txt">为了提高审核通过率，确保提现成功，需要您补充以下信息</p>
    <div class="list-ul">
      <div class="list-li" @click="jumpOperator" data-growing-container data-growing-title="运营商认证">
        <span class="icon"><img src="./images/open-icon-02.png"></span>
        <div class="txt">
          <p>运营商认证</p>
          <span class="sp">有助于审核通过</span>
        </div>
        <span class="static col" v-if = "pageData.openStatus !== '-1' && !pageData.operatorCreditUrl">已认证</span>
        <span class="static" v-else>未认证</span>
        <i class="rower"></i>
      </div>
      <!--<div class="list-li" @click="jumpOpen" data-growing-container data-growing-title="聚有财开户">-->
        <!--<span class="icon"><img src="./images/open-icon-01.png"></span>-->
        <!--<div class="txt">-->
          <!--<p>开通提现卡</p>-->
          <!--<span class="sp">提现资金将转入该银行卡</span>-->
        <!--</div>-->
        <!--<span class="static col" v-if = "pageData.openStatus === '1'">已开通</span>-->
        <!--<span class="static" v-else>未开通</span>-->
        <!--<i class="rower"></i>-->
      <!--</div>-->
    </div>
    <p class="bnt1" v-if = "pageData.openStatus === '1' && !pageData.operatorCreditUrl" @click="goNext()">下一步</p>
  </div>
  <footer-link></footer-link>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import FooterLink from './../components/NewFooter'
export default {
  components: {
    FooterLink
  },
  data(){
    return{
      tabHover:true,
      pageData:{},
    }
  },
  beforeMount(){
  },
  watch:{
  },
  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      personId: state => state.global.userInfo.idPerson,
    }),
     ...mapState('base', {
      canLoan: state => state.canLoan,
    }),
  },
  created() {
    this.getPageData();
  },
  mounted(){
  },
  methods:{
    ...mapActions('loan', [
      'clearData'
    ]),
    async getPageData(){
      // 获取用户 运营商认证状态 及 聚有财开户状态
      const params = {
        userId: this.userId,
        operatorCreditNotifyUrl: window.location.origin + '/custom-page/jyc-xjd/#/operator?over=true',
        openNotifyUrl: window.location.origin + '/custom-page/jyc-xjd/#/home',
        personId: this.personId,
        product: 'AMFT',
        channel: 'H5',
        urlSource: 'AYQ_XJFQ',
        needAudit: this.canLoan,
      }
      const res = await this.$api.userRFEResultHttp(params);
      if(res.code === 'sc0'){
        this.pageData = res.data;
        if(res.data.openStatus === '-1'){
          // 未授信
          this.$messagebox.alert('请先激活现金额度').then(action => {
            this.$nativeBridge.jumpNative('billToCredit');
          });
          return false;
        }
      }
    },
    jumpOpen(){
      // 去除开户验证 2019-07-11新需求
      // 跳转聚有财开户
      // if(this.pageData.openStatus === '0' && this.pageData.openUrl){
      //   window.location.href = this.pageData.openUrl;
      // }
      // else{
        if(this.pageData.openStatus === '-1' && !this.pageData.openUrl){
          this.$messagebox.alert('暂不满足条件');
        }
      // }
    },
    jumpOperator(){
      // 跳转授权运营商
      if(this.pageData.operatorCreditUrl){
        window.location.href = this.pageData.operatorCreditUrl;
      }
    },
    goLink(url) {
      // 跳转页面
      this.$router.push(url);
    },
    // app获取版本号
    getVersion () {
      const userAgent = navigator.userAgent
      const version = userAgent.substr(-5, 5)
      console.log(version)
      return (version.replace(/\./g, '') + "00")
    },
    async goToLoan(){
      let bqsToken
      if(this.getVersion().toString() >= 37000){
        const bqsData = await this.$nativeBridge.requestBqsToken()
        bqsToken = bqsData.token
      }
      else{
        bqsToken = null;
      }
      const params = {
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
        // if(res.data.openStatus === '1' && !res.data.operatorCreditUrl){
        if(!res.data.operatorCreditUrl){
          this.goLink({
            path:'/loan',
            query:{
              code: res.data.firstTrialSerialNo
            }
          });
        }
      }
    },
    goNext(){
      if(this.canLoan){
        this.goLink({
          path:'/loan',
          query:{
            code: res.data.firstTrialSerialNo
          }
        });
      }
      else{
        this.goLink('/home');
      }
    }
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>// scoped
.jyc-xjd{
  width: 100%;
  height: inherit;
  min-height: 100%;
  .content-main{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .top-txt{
      background: #FFF8ED;
      height: 0.7rem;
      padding: 0 0.3rem;
      line-height: 0.7rem;
      font-size: 0.26rem;
      color: #FF2F2F;
    }
    .list-ul{
      background: #fff;
      padding-left: 0.3rem;
      // margin-top: 0.2rem;
      .list-li{
        border-bottom: 1px solid #F3F3F3;
        padding: 0.2rem 0;
        padding-right: 0.3rem;
        display: flex;
        align-items: center;
        .icon{
          flex-shrink: 0;
          width: 0.5rem;
          height: 0.5rem;
          img{
            width: 100%;
            height: auto;
          }
        }
        .txt{
          width: 100%;
          box-sizing: border-box;
          padding: 0 0.2rem;
          line-height: 0.3rem;
          font-size: 0.3rem;
          color: #222;
          .sp{
            color: #A8A8A8;
            font-size: 0.24rem;
          }
        }
        .static{
          flex-shrink: 0;
          color: #A8A8A8;
          padding-right: 0.15rem;
        }
        .col{
          color: #D1A056;
        }
        .rower{
          flex-shrink: 0;
          width: 0.16rem;
          height: 0.26rem;
          display: inline-block;
          background: url(./../images/rower.png) center no-repeat;
          background-size: 100% 100%;
        }
        .num{
          flex-shrink: 0;
          width: 0.4rem;
          height: 0.4rem;
          color:#fff;
          font-size: 0.24rem;
          background: #FF4545;
          text-align: center;
          line-height: 0.4rem;
          border-radius: 0.4rem;
          overflow: hidden;
          margin: 0 0.2rem;
        }
      }
    }
    .bnt1{
      height: 0.92rem;
      // border: 1px solid #D09E54;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      line-height: 0.91rem;
      color: #fff;
      font-size: 0.36rem;
      border-radius: 0.15rem;
      margin: 0.6rem 0.3rem;
      text-align: center;
    }
  }
  .footer{
    text-align: center;
    flex-shrink: 0;
    height: 0.98rem;
    line-height: 0.98rem;
    .sp{
      color: #D1A056;
      margin: 0 0.1rem;
      font-size: 0.24rem;
    }
  }
}
</style>


