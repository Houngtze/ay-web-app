<template>
<div class="jyc-xjd">
  <div class="content-main">
    <div class="mwarp">
      <p class="toper-title">借多少</p>
      <p><span class="toper-m" v-if="nowSelectPro && nowSelectPro.limitType === 2">最高可借{{parseInt(inputQJNom[1])}}元</span></p>
      <!-- <span>（可借金额{{txUsableLimit}}元）</span> -->
      <div class="inp">
        <span>&yen;</span>
        <select v-if="nowSelectPro && nowSelectPro.limitType === 1" v-model="loanAmt">
          <option v-for="(item, index) in loanAmountValOption" :key="index">{{item}}</option>
        </select>
        <input type="tel" v-model="loanAmt" @input="watchInput" @blur="loanAmountVal" placeholder="请输入借款金额" v-else>
        <label v-if="nowSelectPro && nowSelectPro.limitType === 1">▼</label>
        <!-- <p class="all-in" @click="setAllIn">全额借款</p> -->
        <!--<button @click="loanAmountVal" v-show="inputOverBtn">完成</button>-->
      </div>
      <div class="mounth" v-if="hasGet">
        <p v-for="(item, index) in loanInfo.productList" :key="index" :class="mouthNum === item.term?' bnt selected' : 'bnt'" @click="selectMounth(item)">借{{item.term}}个月</p>
      </div>
      <div class="div-li pub-bg">
        <span class="tt">借款用途</span>
        <p class="txt" >个人消费</p>
      </div>
      <!--融资担保绑卡银行卡↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓-->
      <div class="div-li pub-bg" v-if="loanInfo.bindCardSwitch">
        <span class="tt">收款账号</span>
        <i class="bank-info" @click="kfModel = true"></i>
        <p class="txt" v-if="rzBankInfo && rzBankInfo.bankNo" @click="goToBind">{{rzBankInfo.bankName}}({{rzBankInfo.bankNo.substring(rzBankInfo.bankNo.length-4)}})</p>
        <p class="txt" v-else @click="goToBind">请选择收款卡</p>
        <i class="arrow"></i>
      </div>
      <!--选定银行卡↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓-->
      <div class="div-li pub-bg" v-else>
        <span class="tt">收款账号</span>
        <i class="bank-info" @click="kfModel = true"></i>
        <p class="txt" v-if="bankInfo && bankInfo.bankNo" @click="BankListLink">{{bankInfo.bankName}}({{bankInfo.bankNo.substring(bankInfo.bankNo.length-4)}})</p>
        <p class="txt" v-else @click="BankListLink">请选择收款卡</p>
        <i class="arrow"></i>
      </div>
      <!-- <div class="div-li pub-bg">
        <span class="tt">会员优惠</span>
        <p class="txt">会员大礼包{{giftPrice}}元</p>
        <p class="txt">爱有钱增值服务礼包</p>
      </div> -->
      <div class="div-li pub-bg" v-if="hasGet" @click="goBill">
        <span class="tt">还款计划</span>
        <p class="txt">每月应还{{payReportData.interestList[0].repayAmt}}元</p>
        <i class="arrow"></i>
      </div>
      <p :class="termStatic ? 'bnt1' : 'bnt1 hov'" @click="subPost">去借钱</p>
      <!-- <div class="term" v-if="loanInfo && termListData && termListData.length>0"> -->
      <div class="term" v-if="hasGet && nowSelectPro && nowSelectPro.feeList">
        <label>
          <input type="checkbox" v-model="termStatic">
          <i class="icon"></i>我已同意并阅读
        </label>
        <span @click="popupVisible = true">《还款无忧计划服务须知》</span>
      </div>
    </div>
    <footer-link class="footer"></footer-link>
  </div>

  <!-- 说明弹框 -->
  <div class="kf-model" v-if="kfModel">
    <div class="bg">
      <div class="txt">
        <p class="tt">收款账户说明</p>
        <p class="p2">吉享花借款只能绑定本人的有效银行卡，为确保资金正常到账，请在借款前确认：</p>
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

  <!-- 还款计划表弹窗 -->
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
  <!-- 协议弹框 -->
  <mt-popup class="term-list" v-model="popupVisible" position="bottom">
    <div class="tt">
      <i class="close" @click="popupVisible=false"></i>
      <p class="txt">协议</p>
    </div>
    <ul class="" v-if="termListData">
      <li v-for="(item ,index) in termListData" :key="index" @click="tapLink(item.feeUrl)">《{{item.feeName}}》<i class="arrow"></i></li>
    </ul>
  </mt-popup>
  <mt-popup v-model="typePopupVisible" position="bottom" class="mint-bar-popup">
    <mt-picker :slots="useList" :show-toolbar="true" :visible-item-count="5" value-key="val" ref="picker">
      <div class="mint-picker-btn">
        <button @click="handleCancle">取消</button>
        <button @click="handleConfirm" class="sure">完成</button>
      </div>
    </mt-picker>
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
import {session} from '@/helpers/storage';
import FooterLink from './../components/NewFooter'
import NavBar from './../components/NavBar';

export default {
  components: {
    FooterLink,
    NavBar
  },
  data(){
    return{
      inputOverBtn: false, // 输入完成按钮状态
      noPrice:false,
      tabHover:true,
      mouthNum:null,
      loanAmt:null,
      hasGet: false,
      timerPlayer:'',
      oldVal:'',
      loanInfo:{},
      giftPrice:null,
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
      typePopupVisible: false,
      useType:null,
      useList:[{flex: 1, values: ['个人消费', '旅行', '投资'], className: 'slot1', textAlign: 'center'}]
    }
  },
  beforeRouteEnter(to,from,next){
    if(from.name != 'repaymentList'){
      session.set('loanIsAlive',false)
    }else{
      session.set('loanIsAlive',true)
    }
    next()
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
      ...mapState('base', {
        configType:  state => state.configType
      }),
  },
  created() {
    // if(!this.canLoan){
    //   this.goLink('/home');
    //   return false;
    // }
    // this.setAllIn();
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
  activated(){
    if(!session.get('loanIsAlive')){
      this.loanAmt = null
      this.mouthNum  = 0
      this.inputLimitLoanAmt = null
      this.payReportData = {
        interestList:[
          {
            repayAmt:0
          }
        ]
      },
      this.setAllIn();
    }

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
    goBill(){
      // 打开还款计划表
      session.set('payReportData',this.payReportData)
      this.$router.push('repayment-List');
    },
    handleCancle(){
      this.typePopupVisible = false
    },
    handleConfirm(){
        let val = this.$refs.picker.getValues()[0];
        this.useType = val
        this.typePopupVisible = false
    },
    setLoanData(item){
      // 输入模式时，设置区间值及
      this.nowSelectPro = item;
      if(this.nowSelectPro && this.nowSelectPro.limitType === 2){
        this.inputLimitLoanAmt = this.nowSelectPro.limitLoanAmt;
        this.inputQJNom = this.inputLimitLoanAmt ? this.inputLimitLoanAmt.split(',') : null;
      }
    },
    async getLoanMsg(){
      // 获取金融产品，费率等
      if(this.inputLimitLoanAmt && this.nowSelectPro && this.nowSelectPro.limitType === 2){
        // 是否有大小区间值
        const ila = this.inputLimitLoanAmt ? this.inputLimitLoanAmt.split(',') : null;
        if(ila){
          if(ila[0] > this.loanAmt*1 || this.loanAmt*1 > ila[1]){
            this.$toast(`提现金额区间为${ila[0]}-${ila[1]}，请重新输入`);
            this.hasGet = false;
            return false;
          }
        }
      }
      if((this.nowSelectPro && this.nowSelectPro.limitType === 2 && this.loanAmt && this.loanAmt.toString().indexOf(".") > -1)
        || Number(this.loanAmt) % 100 > 0){
        this.$toast("借款金额须为整百的整数");
        this.hasGet = false;
        return false;
      }
      const params = {
        personId:this.personId,
        businessType:'JXH',
        urlSource: this.configType,
        loanAmt: this.loanAmt*100 || this.txUsableLimit*100,
        urlChannel:'4',
        ultimaEncash: this.txUsableLimit,
        firstTrialSerialNo: this.$route.query.code,
      }
      const res = await this.$api.queryProductHttp(params);
      if(res.code === 'sc0' && res.data){
        this.loanInfo = res.data;
        this.set_termLoan(res.data.contractList[0]);
        // 银行卡信息
        if(res.data.bindCardSwitch){
          // 融资担保
          if(!this.rzBankInfo){
            this.getRZBankList({
              idPerson: this.personId,
              funding:res.data.funding,
              userIdF:this.userId,
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
        productCode: 'JXH',
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
        businessType: 'JXH',
        loanAmt: this.loanAmt*100,
        term: term,
        feeList:this.termListData,
        urlSource: this.configType
      };
      const payReport = await this.$api.trialHttp(params);
      if(payReport.code === 'sc0' && payReport.data){
        this.payReportData = payReport.data;
      }
    },
    //监听输入
    watchInput(ev) {
      // 输入验证
      const val = ev.target.value
      if (val) {
        this.inputOverBtn = true
      }
    },
    loanAmountVal() {
      this.inputOverBtn = false
      // 输入验证
      const val = this.loanAmt
      if(!val){
        return;
      }
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
        this.noPrice = false;
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
        const ila = this.inputLimitLoanAmt ? this.inputLimitLoanAmt.split(',') : null;
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
        productCode: 'JXH',
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
        return this.$toast('请输入借款金额');;
      }
      if (!this.bankInfo || !this.bankInfo.bankNo) {
        return this.$toast("请选择收款银行卡")
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
      this.$router.push({
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
  position: relative;
  .footer{
    text-align: center;
    width: 100%;
  }
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
    min-height: inherit;
    padding: 0 0.32rem;
    .toper-title{
      font-size: 0.6rem;
      color: #363636;
      padding: 0.1rem 0;
      font-weight: 600;
      span{
        color: #D09E54;
        font-size: 0.26rem;
      }
    }
    .toper-m{
      color:#A8A8A8;
      font-size: .28rem;
    }
    .inp{
      min-height: 0.74rem;
      line-height: 0.64rem;
      // border-bottom: 1px solid #E5E5E5;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: left;
      margin-top: 0.1rem;
      margin-bottom: 0.32rem;
      position: relative;
      height: 1.28rem;
      box-shadow:0px 1px 0px 0px rgba(238,238,238,1);
      button{
        -webkit-appearance: none;
        color: #D1A056;
        font-size: .3rem;
        border: none;
        background: none;
      }
      span{
        color: #363636;
        font-weight: bold;
        font-size: 0.55rem;
        line-height: 1;
      }
      input{
        width: 100%;
        /*height: 0.56rem;*/
        padding:0 0.2rem;
        font-size: 0.6rem;
        background: none;
        flex: 1;
      }
      input:disabled{
        color:#363636;
      }
      input::-webkit-input-placeholder{
        color:#DEDEDE;
        font-size: 0.4rem;
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
      // background: #F9F9F9;
      border-radius: 0.1rem;
      box-sizing: border-box;
      // border:1px solid #f9f9f9;
    }
    .mounth{
      padding-bottom: 0.1rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .bnt{
        width: 3.34rem;
        height: 0.88rem;
        text-align: center;
        line-height: 0.88rem;
        font-size: 0.28rem;
        margin-bottom: 0.18rem;
        border-radius: .12rem;
        color: #363636;
        background: #FFF;
        border:1px solid #EEEEEE;
      }
      .selected{
        color: #BF9C46;
        border-color: #BF9C46;
        background: #FFF;
        border:1px solid #BF9C46;
      }
    }
    .div-li{
      width: 6.9rem;
      height: 0.88rem;
      line-height: 0.88rem;
      // margin-bottom: 0.3rem;
      display: flex;
      font-size: 0.28rem;
      align-items: center;
      .tt{
        flex-shrink: 0;
        color: #363636;
      }
      .txt{
        width: 100%;
        text-align: right;
        line-height: 0.88rem;
        color: #A8A8A8;
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
        width: 0.38rem;
        height: 0.38rem;
        flex-shrink: 0;
        background: url(./../images/bank-icon.png) center no-repeat;
        background-size: 100% auto;
        margin:0 0.5rem 0 0.2rem;
      }
      .arrow{
        width: 0.34rem;
        height: 0.32rem;
        flex-shrink: 0;
        background: url(./../images/rower@2x.png) center no-repeat;
        background-size: 100% auto;
      }
    }
    .bnt1{
      width: 6.84rem;
      height: 0.88rem;
      line-height: 0.88rem;
      color: #fff;
      font-size: 0.32rem;
      border-radius: 0.15rem;
      margin-top: 0.80rem;
      background-color: #BA9950;
      text-align: center;
      border-radius:.44rem;
      margin-bottom: 0.4rem;
    }
    .hov{
      background: #dddd;
    }
    .term{
      text-align: center;
      font-size: 0.24rem;
      padding:0 0.3rem;
      margin-bottom: 1.12rem;
      label{
        color: #A8A8A8;
        position: relative;
        img{
          width: 0.3rem;
          height: 0.3rem;
          vertical-align: sub;
          margin-right: 0.05rem;
        }
        input{
          // display: none;
          position: absolute;
          width: 0.4rem;
          height: 0.4rem;
          opacity: 0;
        }
        input + .icon{
          width: 0.28rem;
          height: 0.28rem;
          display: inline-block;
          vertical-align: middle;
          margin: -0.05rem 0.1rem 0 0;
          background: url(./../images/icon_disagree@2x.png) center no-repeat;
          background-size: 100% 100%;
        }
        input:checked + .icon{
          background-image: url(./../images/icon_agree@2x.png);
        }
      }
      span{
        color: #363636;
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

<style lang="scss" scoped>
@import '@component/credit/style/index.scss';
.mint-bar-popup {
  width: 100%;
  .mint-picker-btn {
    display: flex;
    width: 100%;
    height: 1rem;
    justify-content: space-between;
    button {
      border: none;
      background: none;
      padding: 0 0.3rem;
      font-size: 0.34rem;
      color: $color-main;
      &.sure {
        // color: $color-gold;
      }
    }
  }
}
</style>
<style lang="scss">
@import '@component/credit/style/index.scss';
.mint-bar{
  .picker-toolbar{
    height: 1rem;
    border-bottom: 0.03rem solid $bd-color-main;
  }
  .picker-item{
    height: 0.8rem;
    font-size: 0.3rem;
    color: $color-gray;
    &.picker-selected{
      font-size: 0.38rem;
      color: $color-main;
    }
  }
}
