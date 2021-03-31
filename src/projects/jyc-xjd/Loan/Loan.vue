<template>
<div class="jyc-xjd">
  <div class="content-main">
    <p class="toper-title">根据您的信用评估，最高可借<span v-if="nowSelectPro && nowSelectPro.limitType === 2">{{parseInt(inputQJNom[1])}}元</span></p>
    <!-- <span>（可借金额{{txUsableLimit}}元）</span> -->
    <div class="inp">
      <span>&yen;</span>
      <select v-if="nowSelectPro && nowSelectPro.limitType === 1" v-model="loanAmt">
        <option v-for="(item, index) in loanAmountValOption" :key="index">{{item}}</option>
      </select>
      <input type="tel" v-model="loanAmt" @input="loanAmountVal" placeholder="请输入借款金额" v-else>
      <label v-if="nowSelectPro && nowSelectPro.limitType === 1">▼</label>
      <!-- <p class="all-in" @click="setAllIn">全额借款</p> -->
    </div>
    <div class="mounth" v-if="hasGet">
      <p v-for="(item, index) in loanInfo.productList" :key="index" :class="mouthNum === item.term?'pub-bg bnt selected' : 'pub-bg bnt'" @click="selectMounth(item)">借{{item.term}}个月</p>
    </div>
    <div class="div-li pub-bg">
      <span class="tt">借款用途</span>
      <p class="txt">个人消费</p>
    </div>
    <!--融资担保绑卡银行卡↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓-->
    <div class="div-li pub-bg" v-if="loanInfo.bindCardSwitch">
      <span class="tt">收款账号</span>
      <i class="bank-info" @click="kfModel = true"></i>
      <p class="txt" v-if="rzBankInfo && rzBankInfo.bankNo" @click="goToBind"><i class="icon"><img v-lazy="rzBankInfo.bankIconUrl || ''"></i>{{rzBankInfo.bankName}}（{{rzBankInfo.bankNo.substring(rzBankInfo.bankNo.length-4)}}）</p>
      <p class="txt" v-else @click="goToBind">请选择收款卡</p>
      <i class="arrow"></i>
    </div>
    <!--选定银行卡↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓-->
    <div class="div-li pub-bg" v-else>
      <span class="tt">收款账号</span>
      <i class="bank-info" @click="kfModel = true"></i>
      <p class="txt" v-if="bankInfo && bankInfo.bankNo" @click="BankListLink"><i class="icon"><img v-lazy="bankInfo.bankIconUrl || ''"></i>{{bankInfo.bankName}}（{{bankInfo.bankNo.substring(bankInfo.bankNo.length-4)}}）</p>
      <i class="arrow"></i>
    </div>
    <!-- <div class="div-li pub-bg">
      <span class="tt">会员优惠</span>
      <p class="txt">会员大礼包{{giftPrice}}元</p>
      <p class="txt">爱有钱增值服务礼包</p>
    </div> -->
    <div class="div-li pub-bg" v-if="hasGet" @click="showPayList = true">
      <span class="tt">还款计划</span>
      <p class="txt">每月应还{{payReportData.interestList[0].repayAmt}}元</p>
      <i class="arrow"></i>
    </div>

    <div class="term" v-if="loanInfo && termListData && termListData.length>0">
      <label><input type="checkbox" v-model="termStatic"><i class="icon"></i>我已阅读并同意签署</label>
      <span @click="popupVisible = true">《还款无忧计划服务须知》</span>
    </div>
    <p :class="termStatic ? 'bnt1' : 'bnt1 hov'" @click="subPost">立即提现</p>
    <footer-link></footer-link>
  </div>
  <div class="kf-model" v-if="kfModel">
    <div class="bg">
      <div class="txt">
        <p class="tt">收款账户说明</p>
        <p class="p2">爱有钱借款只能绑定本人的有效银行卡，为确保资金正常到账，请在借款前确认：</p>
        <p class="p2">1.您的收款银行卡账户状态当前有效；<br>2.若收款银行卡为二类户，请确保当天转账金额满足限额要求。</p>
      </div>
      <p class="enter" @click="kfModel = false">我知道了</p>
    </div>
  </div>
  <div class="kf-model" v-if="noPrice">
    <div class="bg">
      <div class="txt">
        <p class="tt">今天额度已满，请明天再来</p>
      </div>
      <p class="enter" @click="goLink('/home')">我知道了</p>
    </div>
  </div>
  <mt-popup class="repay-list" v-model="showPayList" position="bottom">
    <div class="tt">
      <i class="close" @click="showPayList=false"></i>
      <p class="txt">还款计划</p>
    </div>
    <div class="div-ul">
      <div class="div-head">
        <p class="p1">应还总额（元）</p>
        <p class="p2">{{payReportData.totalRepayAmt}}</p>
        <p class="p1">含服务费{{payReportData.totalInterest}}元</p>
        <!-- <p class="p1">日利率{{payReportData.dayRate*100}}%,利息总计{{payReportData.totalInterest}}元</p> -->
      </div>
      <div v-for="(item ,index) in payReportData.interestList" :key="index" class="div-li">
        <div class="l-s">
          <p><span>第{{(index > 8 ? '' : '0')+(index + 1)}}期</span>{{item.payDate}}</p>
          <i>&nbsp;</i>
        </div>
        <div class="r-s">
          <p class="p1">&yen;{{item.repayAmt}}</p>
          <!-- <p class="p2">本金{{item.principal}}元+利息{{(item.repayAmt-item.principal).toFixed(2)}}元</p> -->
        </div>
      </div>
    </div>
  </mt-popup>
  <mt-popup class="term-list" v-model="popupVisible" position="bottom">
    <div class="tt">
      <i class="close" @click="popupVisible=false"></i>
      <p class="txt">协议</p>
    </div>
    <ul class="" v-if="termListData">
      <li v-for="(item ,index) in termListData" :key="index" @click="tapLink(item.feeUrl)">《{{item.feeName}}》<i class="arrow"></i></li>
    </ul>
  </mt-popup>
  <!--导流-->
  <mt-popup
          v-model="popupVisibleDL"
          popup-transition="popup-fade"
          closeOnClickModal=false
          class="pop-bar">
    <div class="popup-content">
     <p>根据您的信用评估</p>
     <p>正为您筛选通过率98.5%的贷款产品</p>
        <img src="../images/jump.png" alt="">
     <p>筛选中...</p>
     <p>{{countDown}}s</p>
    </div>
  </mt-popup>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import { stat, fstat } from 'fs';
import { clearTimeout, setTimeout } from 'timers';
import FooterLink from './../components/NewFooter'
export default {
  components: {
    FooterLink
  },
  data(){
    return{
      noPrice:false,
      tabHover:true,
      mouthNum:null,
      loanAmt:null,
      hasGet: false,
      timerPlayer:'',
      oldVal:'',
      loanInfo:{},
      giftPrice:null,
      // bankInfo:{
      //   bankIconUrl:'',
      //   bankNo:'',
      //   bankName:'',
      // },
      kfModel:false,
      showPayList:false,
      payReportData:{
        interestList:[
          {
            repayAmt:0
          }
        ]
      },
      termStatic:true,
      popupVisible:false,
      termListData: null,
      binkCardStatus: this.$route.query.orderNo,
      loanAmountValOption: null,
      firstLoad:true,
      popupVisibleDL:false,//导流
      vTime:null,
      countDown:3,
      inputLimitLoanAmt:null,
      nowSelectPro:null,
      inputQJNom:null,
    }
  },
  beforeMount(){
  },
  watch:{
    loanAmt() {
      // 修改金额
      if(this.nowSelectPro && this.nowSelectPro.limitType === 2){
        // 输入框输入
        this.hasGet = false;
        if(this.loanAmt !== ''){
          clearTimeout(this.timerPlayer);
          this.timerPlayer = setTimeout(()=>{
            this.hasGet = true;
            this.getLoanMsg();
          },1000);
        };
      }
      else if(this.nowSelectPro && this.nowSelectPro.limitType === 1){
        // 下拉框选取
        this.getLoanMsg();
      }
      this.getLoanMsg();
    },
    // 监听选择期数，借款为一期有显示金额选项
    mouthNum(newVal) {
    }
  },
  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      personId: state => state.global.userInfo.idPerson,
    }),
    ...mapState('base',{
      txUsableLimit: state => state.txUsableLimit,
      canLoan: state => state.canLoan,
      bankInfo: state => state.bankInfo,
      rzBankInfo: state => state.rzBankInfo,
      comfirmLoan: state => state.comfirmLoan,
    }),
  },
  created() {
    if(!this.canLoan){
      this.goLink('/home');
      return false;
    }
    this.setAllIn();
    // if(this.comfirmLoan){
    //   this.loanAmt = this.comfirmLoan.loanAmt;
    // }
    // else{
    //   this.setAllIn();
    // }
    // 2019-07-11后补件
    // this.getOpenCard();
    // 2019-08-19新银行卡规则
  },
  mounted(){
  },
  methods:{
    ...mapActions('base', [
      'set_comfirmLoan',
      'set_termLoan',
      'set_openBankInfo',
      'getBankList',
      'getRZBankList',
      'set_KeepBankInfo',
      'set_RZBankInfo',
      'set_bankInfo',
    ]),
    setLoanData(item){
      // 输入模式时，设置区间值及
      this.nowSelectPro = item;
      if(this.nowSelectPro && this.nowSelectPro.limitType === 2){
        this.inputLimitLoanAmt = this.nowSelectPro.limitLoanAmt;
        this.inputQJNom = this.inputLimitLoanAmt.split(',') || null;
      }
    },
    async getLoanMsg(){
      // 获取金融产品，费率等
      // if(this.loanAmt > 3500){
      //   this.$toast("提现金额不超过3500元，请重新输入借款金额");
      //   this.hasGet = false;
      //   return false;
      // }
      // if(this.loanAmt < 1000 || this.loanAmt.toString().indexOf(".") > -1) {
      //   this.$toast("借款金额最低1000，且为整数");
      //   this.hasGet = false;
      //   return false;
      // }
      if(this.inputLimitLoanAmt && this.nowSelectPro && this.nowSelectPro.limitType === 2){
        // 是否有大小区间值
        const ila = this.inputLimitLoanAmt.split(',') || null;
        if(ila){
          if(ila[0] > this.loanAmt*1 || this.loanAmt*1 > ila[1]){
            this.$toast(`提现金额区间为${ila[0]}-${ila[1]}，请重新输入`);
            this.hasGet = false;
            return false;
          }
        }
      }
      if(this.nowSelectPro && this.nowSelectPro.limitType === 2 && this.loanAmt.toString().indexOf(".") > -1){
        this.$toast("借款金额须为整数");
        this.hasGet = false;
        return false;
      }
      const params = {
        personId:this.personId,
        businessType:'AMFT',
        urlSource:'AYQ_XJFQ',
        loanAmt: this.loanAmt*100 || this.txUsableLimit*100,
        urlChannel:'4',
        ultimaEncash: this.txUsableLimit,
        firstTrialSerialNo: this.$route.query.code,
      }
      const res = await this.$api.queryProductHttp(params);
      if(res.code === 'sc0' && res.data){
        // 初审拒绝导流贷超
        // if(res.data.creditResult === 'J'){
        //   this.termStatic = false;
        //   this.popupVisibleDL = true;
        //   this.vTime=setInterval(()=>{
        //     this.countDown--;
        //     if(this.countDown==1){
        //       window.location.replace(window.location.origin+'/custom-page/aiyouqian-home.html#/home?from=xjd');
        //     }
        //   },1000)
        //   return false;
        // }
        this.loanInfo = res.data;
        this.set_termLoan(res.data.contractList[0]);
        // 银行卡信息
        if(res.data.bindCardSwitch){
          // 融资担保
          if(!this.rzBankInfo){
            this.getRZBankList({
              idPerson: this.personId,
              funding:res.data.funding,
              userId:this.userId,
            });
          }
        }
        else{
          // 普通选卡
          if(!this.bankInfo){
            this.getBankList(this.personId);
          }
        }
        if(res.data.productList && res.data.productList.length > 0){
          // this.getGiftBag(res.data.productList[0].term);
          if(!this.mouthNum || this.mouthNum === 0){
            if(res.data.selectedTerm){
              this.mouthNum = res.data.selectedTerm;
            }
            else{
              this.mouthNum = res.data.productList[0].term;
              // this.getPayReport(res.data.productList[0].term);
            }
          }
          for(let item in res.data.productList){
            if(res.data.productList[item].term === this.mouthNum){
              this.setLoanData(res.data.productList[item]);
              this.termListData = res.data.productList[item].feeList;
              this.set_comfirmLoan(res.data.productList[item]);
            }
          }
          if(this.nowSelectPro && this.nowSelectPro.limitType === 1 && !this.loanAmountValOption){
            this.setLoanOption();
          }
          this.getPayReport(this.mouthNum);
        }
        this.hasGet = true;
        this.termStatic =true;
      }
      else{
        this.termStatic = false;
        this.$toast(res.message);
      }
    },
    async getOpenCard(){
      // 获取开户银行
      const params = {
        productCode: 'AMFT',
        funding: 'JYC_XJD',
        personId: this.personId,
        // loanOrderId: '',
      }
      const res = await this.$api.queryAccountInfoHttp(params);
      if(res.code === 'sc0' && res.data){
        this.bankInfo = res.data;
        this.set_openBankInfo(res.data);
      }
    },
    async getPayReport(term){
      // 试算
      if(!this.loanAmt){
        return false;
      }
      const params = {
        businessType: 'AMFT',
        loanAmt: this.loanAmt*100,
        term: term,
        feeList:this.termListData,
      };
      const payReport = await this.$api.trialHttp(params);
      if(payReport.code === 'sc0' && payReport.data){
        this.payReportData = payReport.data;
      }
    },
    loanAmountVal(ev) {
      // 输入验证
      const val = ev.target.value
      const reg = /^[0-9]*[1-9][0-9]*$/
      if (val) {
          if (reg.test(val) && val <= this.txUsableLimit) {
              this.oldVal = val
          } else {
              this.loanAmt = this.oldVal
          }
      } else {
          this.loanAmt = ''
      }
    },
    setLoanOption(){
      // 设置选择框选项
      const nM = this.mouthNum;
      const nD = this.loanInfo.productList;
      let nL = null;
      for(let item in nD){
        if(nD[item].term === this.mouthNum){
          nL = nD[item].limitLoanAmt ? nD[item].limitLoanAmt.split(",") : null;
        }
      }
      if(nL){
        this.loanAmt = nL[nL.length - 1];
        this.loanAmountValOption = nL;
      }
      if(!nL || this.txUsableLimit < nL[0]){
        this.termStatic = false;
        this.noPrice = true;
      }
    },
    selectMounth(item){
      // 选择月份
      this.termStatic = true;
      this.set_comfirmLoan(item);
      this.setLoanData(item);
      this.mouthNum = item.term;
      this.termListData = item.feeList;
      // this.getGiftBag(item.term);
      if(this.nowSelectPro && this.nowSelectPro.limitType === 1){
        // 如果是下拉，则获取当前分期下拉列表
        this.setLoanOption();
      }
      if(this.nowSelectPro && this.nowSelectPro.limitType === 2){
        // 如果是输入，则判断是否要用最新的区间值
        this.setLoanData(item);
        const ila = this.inputLimitLoanAmt.split(',') || null;
        if(ila){
          if(ila[0] > this.loanAmt || this.loanAmt > ila[1]){
            this.loanAmt = parseInt(ila[1]);
          }
        }
      }
      this.getPayReport(item.term);
    },
    async getGiftBag(trem){
      // 获取礼包价格
      const params = {
        loanAmount: this.loanAmt*100,
        productCode: 'AMFT',
        periods: trem,
      }
      const res = await this.$api.getGiftAmounttHttp(params);
      if(res.code === 'sc0' && res.data){
        this.giftPrice = res.data/100;
      } else {
        this.$toast("url:/v2/cashloan/getGiftAmount, message: "+ res.message)
      }
    },
    goLink(url) {
      // 跳转页面
      this.$router.replace(url);
    },
    subPost(){
      if(!this.termStatic){
        return false;
      }
      if(!this.hasGet){
        return false;
      }
      if(!this.loanAmt || (!this.rzBankInfo && this.loanInfo.bindCardSwitch) || (!this.bankInfo && !this.loanInfo.bindCardSwitch)){
        return false;
      }
      if(!this.loanInfo.bindCardSwitch && this.bankInfo && this.bankInfo.bankName === "招商银行"){
        // 禁止招商银行
        this.$toast('暂不支持招商银行提现，请更换');
        return false;
      }
      if(this.loanInfo.bindCardSwitch && this.rzBankInfo && this.rzBankInfo.bankName === "招商银行"){
        // 融资担保 禁止招商银行
        this.$toast('暂不支持招商银行提现，请更换');
        return false;
      }
      if(this.loanInfo.bindCardSwitch){
        this.set_KeepBankInfo(this.rzBankInfo);
      }
      else{
        this.set_KeepBankInfo(this.bankInfo);
      }
      this.goLink('/loan-enter');
    },
    async setAllIn(){
      // let amt = this.txUsableLimit;
      // if(amt > 3500){
      //   amt = 3500;
      // }
      // this.loanAmt = amt;
      await this.getLoanMsg();
      // await this.setLoanOption();
    },
    tapLink(url){
      window.location.href = url;
    },
    BankListLink(){
      // 银行卡列表
      this.goLink({
        path:'bank-list',
        query:{
          orderNo:'loan'
        }
      });
    },
    goToBind(){
      // 融资担保绑卡 ----- 20191022
      this.goLink({
        path:'bank-list-rz',
        query:{
          orderNo:'loan',
          funding: this.loanInfo.funding,
        }
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.vTime);
    clearTimeout(this.timerPlayer);
    this.set_RZBankInfo(null);
    this.set_bankInfo(null);
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
  .header{
    height: 0.6rem;
    line-height: 0.6rem;
    flex-shrink: 0;
    background: #FFF8ED;
    padding: 0 0.3rem;
    color: #D1A056;
    font-size: 0.24rem;
  }
  .content-main{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 0 0.3rem;
    .toper-title{
      font-size: 0.3rem;
      color: #363636;
      padding: 0.4rem 0;
      span{
        color: #D09E54;
        font-size: 0.26rem;
      }
    }
    .inp{
      min-height: 0.74rem;
      line-height: 0.64rem;
      border-bottom: 1px solid #E5E5E5;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 0.1rem;
      margin-bottom: 0.4rem;
      position: relative;
      span{
        color: #363636;
        font-weight: bold;
        font-size: 0.4rem;
        line-height: 0.4rem;
      }
      input{
        width: 100%;
        height: 0.7rem;
        padding:0 0.2rem;
        font-size: 0.6rem;
        background: none;
      }
      input:disabled{
        color:#363636;
      }
      input::-webkit-input-placeholder{
        font-size: 0.6rem;
      }
      & select{
        width: 100%;
        height: .7rem;
        padding: 0 0 0 0.2rem;
        font-size: 0.6rem;
        background: none;
        border: none;
        -webkit-appearance:none;
        -moz-appearance:none;
        appearance:none;
      }
      & label{
        position: absolute;
        right: 0;
      }
      .all-in{
        color: #D1A056;
        border: 1px solid #D1A056;
        flex-shrink: 0;
        height: 0.5rem;
        line-height: 0.48rem;
        font-size: 0.24rem;
        padding: 0 0.2rem;
        border-radius: 0.5rem;
      }
    }
    .pub-bg{
      background: #F9F9F9;
      border-radius: 0.1rem;
      box-sizing: border-box;
      border:1px solid #f9f9f9;
    }
    .mounth{
      padding-bottom: 0.4rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .bnt{
        width: 3.3rem;
        height: 0.8rem;
        text-align: center;
        line-height: 0.78rem;
        font-size: 0.28rem;
        margin-bottom: 0.2rem;
      }
      .selected{
        color: #D09E54;
        border-color: #D09E54;
        background: #FFFAEF;
      }
    }
    .div-li{
      width: 6.9rem;
      height: 0.9rem;
      line-height: 0.88rem;
      margin-bottom: 0.3rem;
      display: flex;
      padding: 0 0.3rem;
      font-size: 0.3rem;
      align-items: center;
      .tt{
        flex-shrink: 0;
        color: #a8a8a8;
      }
      .txt{
        width: 100%;
        text-align: right;
        line-height: 0.88rem;
        color: #363636;
        .icon{
          width: 0.3rem;
          height: 0.3rem;
          vertical-align: middle;
          display: inline-block;
          margin-right: 0.1rem;
          margin-top: -0.05rem;
          img{
            width: 100%;
            height: auto;
            display: block;
          }
        }
      }
      .bank-info{
        width: 0.3rem;
        height: 0.3rem;
        flex-shrink: 0;
        background: url(./../images/bank-icon@2x.png) center no-repeat;
        background-size: 100% auto;
        margin:0 0.5rem 0 0.2rem;
      }
      .arrow{
        width: 0.14rem;
        height: 0.22rem;
        flex-shrink: 0;
        background: url(./../images/rower@2x.png) center no-repeat;
        background-size: 100% auto;
        margin-left: 0.2rem;
      }
    }
    .bnt1{
      width: 100%;
      height: 0.92rem;
      // border: 1px solid #D09E54;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      line-height: 0.91rem;
      color: #fff;
      font-size: 0.36rem;
      border-radius: 0.15rem;
      margin-bottom: 0.3rem;
      text-align: center;
    }
    .hov{
      background: #dddd;
    }
    .term{
      text-align: left;
      font-size: 0.24rem;
      margin: 0.33rem 0;
      padding:0 0.3rem;
      margin-top: 0.9rem;
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
          background: url(./../images/check.png) center no-repeat;
          background-size: 100% 100%;
        }
        input:checked + .icon{
          background-image: url(./../images/checkbox.png);
        }
      }
      span{
        color: #D09E54;
      }
    }
  }
  .kf-model{
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
    .bg{
      width: 5.6rem;
      height: auto;
      background: #fff;
      overflow: hidden;
      border-radius: 0.1rem;
      .txt{
        padding: 0 0.33rem;
      }
      p{
        color: #363636;
      }
      .tt{
        font-size: 0.28rem;
        font-weight: bold;
        text-align: center;
        line-height: 0.28rem;
        padding: 0.4rem 0;
      }
      .p1{
        font-size: 0.28rem;
        line-height: 0.28rem;
        margin: 0.4rem 0;
      }
      .p2{
        font-size: 0.26rem;
        line-height: 0.34rem;
        margin-bottom: 0.4rem;
      }
      .p3{
        font-size: 0.26rem;
        line-height: 0.26rem;
        margin: 0.3rem 0 0.4rem 0;
      }
      .enter{
        height: 0.82rem;
        border-top: 1px solid #E5E5E5;
        line-height: 0.82rem;
        font-size: 0.3rem;
        text-align: center;
      }
    }
  }
  .repay-list{
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: column;
    .tt{
      height: 1rem;
      display: flex;
      text-align: center;
      flex-shrink: 0;
      border-bottom: 1px solid #E5E5E5;
      p{
        line-height: 1rem;
        font-size: 0.34rem;
        font-weight: 400;
        width: 100%;
        padding-right: 1rem;
      }
      .close{
        width: 1rem;
        height: 1rem;
        background: url(./../images/close@2x.png) center no-repeat;
        background-size: 30% auto;
        flex-shrink: 0;
      }
    }
    .div-ul{
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 0 0.3rem;
      .div-head{
        padding: 0.4rem 0;
        border-bottom: 1px solid #E5E5E5;
        margin-bottom: 0.3rem;
        .p1{
          color: #868686;
          font-size: 0.26rem;
          line-height: 0.26rem;
        }
        .p2{
          font-size: 0.68rem;
          color: #363636;
          line-height: 0.68rem;
          margin: 0.4rem 0;
          font-weight: 500;
        }
      }
    }
    .div-li{
      height: 1.72rem;
      display: flex;
      .l-s{
        border-right: 2px solid #D09E54;
        flex-shrink: 0;
        position: relative;
        z-index: 1;
        padding-right: 0.3rem;
        p{
          font-size: 0.28rem;
          line-height: 0.4rem;
          span{
            padding-right: 0.2rem;
          }
        }
        i{
          width: 0.32rem;
          height: 0.32rem;
          background: #D09E54;
          border: 0.1rem solid #fff;
          border-radius: 50%;
          display: inline-block;
          position: absolute;
          right: -0.18rem;
          top: 0;
        }
      }
      .r-s{
        width:50%;
        padding-left: 0.4rem;
        .p1{
          font-size: 0.4rem;
          line-height: 0.4rem;
          color: #363636;
        }
        .p2{
          font-size: 0.24rem;
          color: #A8A8A8;
          padding-top: 0.2rem;
        }
      }
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
        padding-right: 1rem;
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
  .popup-content{
    width: 5.6rem;
    text-align: center;
    padding: .4rem 0;
    img{
      width: 2.14rem;
      height: auto;
    }
    p{
      line-height: 1;
      &:nth-child(1){
          color: #363636;
          font-size: .36rem;
          font-weight: 600;
      }
      &:nth-child(2){
          color: #A8A8A8;
          font-size: .24rem;
          margin-top: .24rem;
          margin-bottom: .32rem;
      }
      &:nth-child(4){
          color: #363636;
          font-size: .3rem;
          margin-top: .08rem;
          margin-bottom: .2rem;
      }
      &:nth-child(5){
          color: #A8A8A8;
          font-size: .3rem;
      }
    }
  }
}
</style>


