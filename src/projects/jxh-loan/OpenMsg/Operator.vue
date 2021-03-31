<template>
<div class="jyc-xjd">
  <div class="content-main" v-if="pageData">
    <p class="top-txt">为了提高审核通过率，确保提现成功，需要您补充以下信息</p>
    <div class="operator">
      <div class="operator-bg"></div>
      <p class="p1">运营商认证</p>
      <p class="p2" v-if="pageData.operatorCreditStatus === '0'">认证后才可激活现金额度</p>
      <p class="p2" v-if="pageData.operatorCreditStatus === '2'">认证中，请耐心等待</p>
    </div>
    <p class="bnt1" v-if="pageData.operatorCreditStatus === '0'" @click="jumpOperator">去认证</p>
    <p class="bnt1" v-if="pageData.operatorCreditStatus === '2'" @click="getPageData">刷新结果</p>
    <!-- <p class="bnt1" v-if="pageData.operatorCreditStatus === '1'">去提现</p> -->
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
      pageData:null,
      popupVisible:true,
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
  async created() {
    await this.setOver();
    await this.getPageData();
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
        operatorCreditNotifyUrl: window.location.origin + '/custom-page/jyc-xjd/#/operator?check=true',
        openNotifyUrl: window.location.origin + '/custom-page/jyc-xjd/#/home',
        personId: this.personId,
        product: 'JXH',
        channel: 'H5',
        urlSource: 'JXH_XJFQ',
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
        if(res.data.operatorCreditStatus === '1'){
          this.goNext();
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
      const params = {
        userId: this.userId,
        operatorCreditNotifyUrl: window.location.origin + '/custom-page/jyc-xjd/#/operator?check=true',
        openNotifyUrl: window.location.origin + '/custom-page/jyc-xjd/#/home',
        personId: this.personId,
        product: 'JXH',
        channel: 'H5',
        urlSource: 'JXH_XJFQ',
        tokenKey: null,
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
    },
    async setOver(){
      // 属于运营商回调页面的话，就提交已提交审核接口
      if(this.$route.query.check){
        const params = {
          userId:this.userId,
          urlSource:'JXH_XJFQ',
          product:'JXH',
          channel:'H5',
        };
        const res = await this.$api.userOperatorsAuthCacheHttp(params);
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
    height: inherit;
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
    .operator{
      display: flex;
      align-items: center;
      flex-direction: column;
      background: #fff;
      .operator-bg{
        width: 2.13rem;
        height: 2.41rem;
        background: url(./images/operator@2x.png) center no-repeat;
        background-size: 100% auto;
        margin: 0.32rem 0 0.23rem 0;
      }
      .p1{
        font-size: 0.36rem;
        line-height: 0.34rem;
        color: #222;
        margin-bottom: 0.23rem;
      }
      .p2{
        color: #a8a8a8;
        line-height: 0.28rem;
        font-size: 0.3rem;
        margin-bottom: 0.4rem;
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
  .cx{
    width: 100%;
    height: 100%;
  }
}
</style>


