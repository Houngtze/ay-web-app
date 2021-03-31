<template>
<div class="jyc-xjd">
  <step-shower :step="step"></step-shower>
  <div class="content-main">
    <!-- 原页面内容组件 -->
    <result-pay-content-default v-if="pageData && pageData.initType === 'default'" :pageData="pageData" @showPopup="showPopup" />
    <!-- 2019-09-08  -->
    <result-pay-content-goods v-if="pageData && pageData.initType === 'goods'" :pageData="pageData" @showPopup="showPopup" />

    <template v-if="pageData && pageData.payMethod === '0'">
    <div class="order-li">
      <p class="txt">支付方式</p>
    </div>
    <label class="pay-label" @click="payMsg = item" v-for="(item ,index) in pageData.payTypeList" :key="index">
      <i class="icon"><img src="./images/zfb-icon.png"></i>
      <p class="txt">{{item.payTypeName}}</p>
      <input type="radio" :value="item.payType" v-model="payRadio">
      <i class="inp"></i>
    </label>
    </template>
    <div class="term" v-if="pageData && pageData.contractList.length">
      <label><input type="checkbox" v-model="termStatic"><i class="icon"></i>我已阅读并同意签署</label>
      <span @click="popupVisible = true">《{{pageData.contractList[0].groupTitle}}》</span>
    </div>
    <p v-if="pageData && pageData.payMethod === '0'" :class="termStatic?'bnt1':'bnt1 cnt'" @click="submitPay">立即支付</p>
    <!-- <p v-if="pageData && pageData.payMethod === '1'" :class="termStatic?'bnt1':'bnt1 cnt'" @click="afterPay">{{submitTxt}}</p> -->
    <p v-if="pageData && pageData.payMethod === '1'" :class="termStatic?'bnt1':'bnt1 cnt'" @click="afterPay">确认并提交</p>

    <footer-link></footer-link>

  </div>

  <mt-popup class="term-list" v-model="popupVisible" position="bottom">
    <div class="tt">
      <p class="txt">协议</p>
      <i class="close" @click="popupVisible=false"></i>
    </div>
    <ul class="" v-if="termUrl">
      <li v-for="(item ,index) in termUrl" :key="index" @click="goLink(item.protocolUrl)">《{{item.protocolElucidation}}》<i class="arrow"></i></li>
    </ul>
  </mt-popup>
  <div class="zfb-form" ref="zfbForm" style="display:none;" v-html="zfbHtml"></div>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {redirectToLoginPage} from '@/helpers/utils';
import FooterLink from './../components/NewFooter'
import stepShower from './components/step'
import ResultPayContentDefault from './components/ResultPayContentDefault';
import ResultPayContentGoods from './components/ResultPayContentGoods';

export default {
  components: {
    FooterLink,
    stepShower,
    ResultPayContentDefault,
    ResultPayContentGoods
  },
  data(){
    return{
      termStatic:true,
      tabHover:true,
      pageData: null,
      popupVisible: false,
      zfbHtml:'',
      step:{
        step:1,
        status:true,
      },
      termUrl:'',
      payRadio:null,
      payMsg:null,
      urlMallOrderId: null,
      termLoan:null,
      termTitle:null,
      cz:true,
      // 倒计时
      running:8,
      submitTxt:null,
      timerPlayer:null,
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
  },
  created() {
    this.getPageData();
    this.getMallOrderNo();
  },
  mounted(){
  },
  methods:{
    ...mapActions('loan', [
      'clearData'
    ]),
    showPopup(data) {
      this.popupVisible = true;
      this.termStatic = data;
    },
    async getPageData(){
      // 初始化
      const params = {
        orderNo: this.$route.query.ono || null,
        loanOrderNo: this.$route.query.lno || null,
        urlChannel:'4',
        urlSource:'AYQ_XJFQ',
      }
      const res = await this.$api.loanInitHttp(params);
      if(res.code === 'sc0' && res.data){
        this.pageData = res.data;
        if(res.data.contractList && res.data.contractList[0] && res.data.contractList[0].chiId){
          this.termTitle = res.data.contractList[0].groupTitle;
          this.termUrl = res.data.contractList[0].chiId;
          if(res.data.payTypeList){
            this.payRadio = res.data.payTypeList[0].payType;
            this.payMsg = res.data.payTypeList[0];
          }
        }
        if(res.data.payMethod === '1'){
          // 倒扣，需加倒计时
          // this.runTime();
        }
      }
      else{
        this.$toast(res.message);
      }
    },
    submitPay(){
      if(!this.termStatic){
        this.$toast('您还未成为提现加速会员，暂无法提现');
        return false;
      }
      // this.popupVisible = true;
      if(this.payRadio === 'ALIPAY_H5'){
        // 支付宝支付
        this.zfbPay();
      }
    },
    goLink(url) {
      window.location.href = url;
    },
    async getMallOrderNo(){
      if(!this.termStatic){
        this.$toast('您还未成为提现加速会员，暂无法提现');
        return false;
      }
      // 获取信贷订单号
      if(this.$route.query.ono && !this.$route.query.lno){
        let lno = await this.$api.giftOrderDetailHttp({
          giftOrderNo:this.$route.query.ono
        });
        if(lno.code = 'sc0' && lno.data){
          this.urlMallOrderId = lno.data.loanOrderNo
        }
      }
      else{
        this.urlMallOrderId = this.$route.query.lno;
      }
    },
    async zfbPay(){
      if(!this.urlMallOrderId){
        // 没有订单号
        this.$toast('订单号不存在');
        return false;
      }
      // 支付。
      const params = {
        payChannel:this.payMsg.payType,
        platform:"H5",
        orderNo:this.pageData.orderNo || null,
        // h5NotifyUrl: window.location.origin + '/custom-page/jyc-xjd/#/pay-success' + str,
        // h5NotifyUrl: window.location.origin + '/custom-page/jyc-xjd/#/patch' + str,
        h5NotifyUrl:  window.location.origin + '/custom-page/jyc-xjd/#/patch?mallOrderId=' + this.urlMallOrderId,
        personId:this.personId,
        userId:this.userId,
      }
      const res = await this.$api.paymentStringHttp(params);
      if(res.code === 'sc0' && res.data !== null){
        this.zfbHtml = res.data.formHtml;
        this.$nextTick(() => {
            this.$refs.zfbForm.firstChild.submit();
        });
      }
      else{
        this.$toast(res.message);
      }
    },
    async afterPay(){
      window.clearInterval(this.timerPlayer);
      console.log(this.urlMallOrderId);
      if(!this.urlMallOrderId){
        // 没有订单号
        this.$toast('订单号不存在');
        return false;
      }
      // 后支付
      const params = {
        openId: null,
        ip: null,
        payChannel: null,
        platform: "H5",
        loanOrderNo: this.urlMallOrderId || null,
        h5NotifyUrl: null,
        userId: this.userId,
        urlSource: 'AYQ_XJFQ',
        urlChannel: '4',
        payMethod: '1',
        selectGoodsSkuCode: (this.pageData && this.pageData.packageGoods) ? this.pageData.packageGoods.skuCode : ""
      };
      const res = await this.$api.confirmPayHttp(params);
      if(res.code === 'sc0'){
        this.$router.replace({
          path: "/patch",
          query: {
            mallOrderId: this.urlMallOrderId
          }
        })
      }
      else{
        this.$toast(res.message);
      }
    },
    runTime(){
      this.submitTxt = '确认并提交（'+this.running+'s）';
      this.timerPlayer = setInterval(this.handleRunTime,1000);
    },
    handleRunTime() {
      if(this.running > 1){
        this.running = this.running - 1;
        this.submitTxt = '确认并提交（'+this.running+'s）';
      }
      else{
        window.clearInterval(this.timerPlayer);
        this.running = 8;
        this.submitTxt = '确认并提交';
        this.afterPay();
      }
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timerPlayer);
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
  background: #fff;
  color: #363636;
  -webkit-overflow-scrolling: touch;
  .content-main{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    background-color: #f2f2f2;
    .order-li{
      border-bottom: 1px solid #E5E5E5;
      height: 0.9rem;
      display: flex;
      align-items: center;
      padding: 0 0.3rem;
      font-size: 0.3rem;
      background-color: #fff;
      margin-top: .18rem;
      .tt{
        color: #A8A8A8;
        flex-shrink: 0;
      }
      .txt{
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
      }
      .link{
        flex-shrink: 0;
        color: #D1A056;
        font-size: 0.24rem;
      }
      .price{
        flex-shrink: 0;
        color: #F22C2C;
        font-size: 0.3rem;
      }
    }
    .pay-label{
      padding: 0.3rem;
      display: flex;
      align-items: center;
      background-color: #fff;
      .icon{
        width: 0.54rem;
        height: 0.54rem;
        flex-shrink: 0;
        img{
          width: 100%;
          height: auto;
        }
      }
      .txt{
        font-size: 0.32rem;
        color: #363636;
        width: 100%;
        padding: 0 0.2rem;
      }
      .inp{
        width: 0.38rem;
        height: 0.38rem;
        flex-shrink: 0;
        background: center no-repeat;
        background-size: 100% auto;
      }
      input[type="radio"]{
        display: none;
      }
      input[type="radio"] + .inp{
        background-image: url(./images/radio-icon-u.png);
      }
      input[type="radio"]:checked + .inp{
        background-image: url(./images/radio-icon.png);
      }
    }
    .bnt1{
      height: 0.92rem;
      // border: 0.05rem solid #D09E54;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      line-height: 0.91rem;
      color: #fff;
      font-size: 0.36rem;
      border-radius: 0.15rem;
      margin: 0.25rem 0.3rem;
      text-align: center;
    }
    .cnt{
      background:#dddddd;
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
  .term-list{
    width: 100%;
    height: 40%;
    text-align: center;
    display: flex;
    flex-direction: column;
    .tt{
      height: 1rem;
      display: flex;
      flex-shrink: 0;
      p{
        line-height: 1rem;
        font-size: 0.34rem;
        font-weight: 400;
        width: 100%;
        padding-left: 1rem;
      }
      .close{
        width: 1rem;
        height: 1rem;
        background: url(./../images/close@2x.png) center no-repeat;
        background-size: 30% auto;
        flex-shrink: 0;
      }
    }
    ul{
      height: 100%;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      text-align: left;
      padding-left: 0.3rem;
      border-top: 1px solid #E5E5E5;
    }
    li{
      height: 1rem;
      line-height: 1rem;
      font-size: 0.3rem;
      border-bottom: 1px solid #E5E5E5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 0.3rem;
      .arrow{
        width: 0.14rem;
        height: 0.22rem;
        flex-shrink: 0;
        background: url(./../images/rower@2x.png) center no-repeat;
        background-size: 100% auto;
        margin-left: 0.2rem;
      }
    }
  }
  /deep/ .icon-check{
    color: #A8A8A8;
    input{
      display: none;
    }
    input + .icon{
      width: 0.28rem;
      height: 0.28rem;
      display: inline-block;
      vertical-align: middle;
      margin: -0.05rem 0.1rem 0 0;
      background: url(./../images/check.png) center no-repeat;
      background-size: 100% 100%;
    }
    input:checked + .icon{
      background-image: url(./../images/checkbox.png);
    }
  }
  .bank-info{
    width: 0.3rem;
    height: 0.3rem;
    flex-shrink: 0;
    background: url(./../images/bank-icon@2x.png) center no-repeat;
    background-size: 100% auto;
    margin-left: 0.2rem;
  }
}
.term{
  text-align: center;
  font-size: 0.24rem;
  margin: 0.33rem 0;
  padding: 0 0.3rem;
  label{
    color: #A8A8A8;
    input{
      display: none;
    }
    input + .icon{
      width: 0.28rem;
      height: 0.28rem;
      display: inline-block;
      vertical-align: middle;
      margin: -0.05rem 0.1rem 0 0;
      background: url(../images/check.png) center no-repeat;
      background-size: 100% 100%;
    }
    input:checked + .icon{
      background-image: url(../images/checkbox.png);
    }
  }
  span{
    color: #D09E54;
  }
}
</style>


