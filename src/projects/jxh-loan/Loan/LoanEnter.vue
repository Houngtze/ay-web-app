<template>
<div class="jyc-xjd">
  <!-- <div class="content-main" v-if="comfirmLoan"> -->
  <div class="content-main" v-if="comfirmLoan">
    <div class="warp">
      <div class="tp-txt">
        <p class="p1">应还总额（元）</p>
        <p class="p2">{{comfirmLoan.realPayment}}</p>
      </div>
      <div class="msg-ul">
        <div class="msg-li">
          <p class="tt">借款金额</p>
          <p class="val">{{comfirmLoan.loanAmt}}元</p>
        </div>
        <div class="msg-li">
          <p class="tt">借款期限</p>
          <p class="val">{{comfirmLoan.term}}个月</p>
        </div>
        <div class="msg-li">
          <p class="tt">首次还款</p>
          <p class="val">{{comfirmLoan.monthlyPayment}}元<span class="col">{{comfirmLoan.repaymentDate}}</span></p>
        </div>
        <div class="msg-li">
          <p class="tt">收款账户</p>
          <p v-show="bankInfo" class="val">{{bankInfo.bankName}}({{bankInfo.bankNo.substring(bankInfo.bankNo.length-4)}})</p>
        </div>
        <div class="msg-li">
          <p class="tt">借款人</p>
          <p v-if="realName" class="val"> {{plusXing(realName,1,1)}}</p>
        </div>
        <div class="msg-li">
          <p class="tt">证件号</p>
          <p v-if="ident" class="val">{{plusXing(ident,2,4)}}</p>
        </div>
        <div class="msg-li">
          <p class="tt">借款用途</p>
          <p class="val">个人消费</p>
        </div>
      </div>
    </div>
    <p class="bnt2" @click="submiLoan">确认借款</p>
    <div class="term" v-if="termLoan && termLoan.chiId && termLoan.chiId.length>0">
      <label><input type="checkbox" v-model="termStatic"><i class="icon"></i>我已阅读并同意签署</label>
      <span @click="popupVisible = true">《{{termLoan.groupTitle}}》</span>
    </div>
    <footer-link></footer-link>
  </div>
  <mt-popup class="term-list" v-model="popupVisible" position="bottom">
    <div class="tt">
      <i class="close" @click="popupVisible=false"></i>
      <p class="txt">协议</p>
    </div>
    <ul class="" v-if="termLoan && termLoan.chiId && termLoan.chiId.length>0">
      <li v-for="(item ,index) in termLoan.chiId" :key="index" @click="tapLink(item.protocolUrl)">《{{item.protocolElucidation}}》<i class="arrow"></i></li>
    </ul>
  </mt-popup>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {redirectToLoginPage} from '@/helpers/utils';
import FooterLink from './../components/NewFooter';
import env from '@/helpers/env';

export default {
  components: {
    FooterLink
  },
  data(){
    return{
      tabHover: true,
      termStatic: true,
      popupVisible:false,
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
      realName: state => state.global.userInfo.realName,
      ident: state => state.global.userInfo.ident,
    }),
    ...mapState('base',{
      comfirmLoan: state => state.comfirmLoan,
      termLoan: state => state.termLoan,
      bankInfo: state => state.keepBankInfo,
    })
  },
  created() {
    if(!this.comfirmLoan){
      this.$router.back();
    }
  },
  mounted(){
  },
  methods:{
    ...mapActions('base', [
      'clearData','set_KeepBankInfo'
    ]),
    async submiLoan(){
      // 确认借款
      if(!this.termStatic){
        this.$toast('请先阅读并同意协议。');
        return false;
      }
      const params = {
        loanAmount: this.comfirmLoan.loanAmt*1,
        term: this.comfirmLoan.term,
        bankMobile: null,
        bankName: null,
        bankNo: null,
        productCode:'JXH',
        orgType:'JXH',
        productId:this.comfirmLoan.productId,
        platform: 'H5',
        userId: this.userId,
        personId: this.personId,
        monthlyPaymentAmt: this.comfirmLoan.monthlyPayment*1, // 月供金额
        feeList: this.comfirmLoan.feeList,
        bankCardId: this.bankInfo && this.bankInfo.id,
        urlChannel: env.isJXHAPP() ? '0' : '4'
      }
      const res = await this.$api.loanApplyHttp(params);
      if(res.code === 'sc0'){
        this.clearData();
        this.goLink({
          // path:'/result-static',
          path:'/ResultNew',
          query: res.data
        });
      }
      else{
        if(res.code === 'sc31009'){
          // 初审拒绝
          this.goLink('/loan-failed');
          return false;
        }
        this.$toast(res.message);
      }

    },
    goLink(url) {
      // 跳转页面
      this.$router.replace(url);
    },
    tapLink(url){
      window.location.href = url;
    },
    plusXing (str,frontLen,endLen) {
      var len = str.length-frontLen-endLen;
      var xing = '';
      for (var i=0;i<len;i++) {
        xing+='*';
      }
      if(xing === ''){
        xing = '*';
      }
      return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
    }
  },
  beforeDestroy() {
    this.clearData();
    this.set_KeepBankInfo(null);
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
  .content-main{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    color: #363636;
    padding: 0 0.1rem;
    .warp{
      width: 7.3rem;
      height: 10.04rem;
      margin-top: 0.3rem;
      background-image: url('./images/bg.png');
      background-size: cover;
      background-repeat: no-repeat;
      position: relative;
      margin-bottom: 0.6rem;
    }
    .tp-txt{
      width: 6.7rem;
      position: absolute;
      top:.66rem;
      left: .15rem;
      margin-bottom: 0.2rem;
      overflow: hidden;
      padding: 0 0.06rem 0 0.36rem;

      .p1{
        font-size: 0.26rem;
        line-height: 0.3rem;
        margin-bottom: 0.24rem;
        color: #A8A8A8;

      }
      .p2{
        font-size: 0.68rem;
        line-height: 0.68rem;
        border-bottom: 1px solid #EEEEEE;
        padding-bottom: 0.4rem;
        box-sizing: border-box;
        font-family: "TG-TYPE-Bold";
      }
    }
    .msg-ul{
      // padding: 0 0.2rem;
      padding-right: 0.32rem;
      position: absolute;
      top:2.5rem;
      left: .51rem;
      .msg-li{
        width: 6.3rem;
        display: flex;
        align-items: center;
        height: 0.88rem;
        font-size: 0.28rem;
        justify-content: space-between;
        .tt{
          color: #363636;
          flex-shrink: 0;
          width: 1.7rem;
        }
        .val{
           color: #A8A8A8;
           text-align: right;
        }
        .col{
          color: #a8a8a8;
          font-size: 0.26rem;
          margin-left: 0.2rem;
        }
        .icon{
          width: 0.42rem;
          height: 0.42rem;
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
    }
    .bnt2{
      width: 6.86rem;
      height: 0.88rem;
      background-color: #BA9950;
      line-height: 0.88rem;
      color: #fff;
      font-size: 0.32rem;
      border-radius: 0.1rem;
      margin: 0 0.3rem;
      margin-bottom: 0.4rem;
      text-align: center;
      border-radius:.44rem;
    }
    .term{
      text-align: center;
      font-size: 0.24rem;
      margin-bottom: 0.78rem;
      padding: 0 0.3rem;
      label{
        color: #A8A8A8;
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
        color: #D09E54;
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
}
</style>
