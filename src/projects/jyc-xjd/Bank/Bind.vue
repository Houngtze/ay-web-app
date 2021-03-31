<template>
<div class="jyc-xjd">
  <step-shower :step="step"></step-shower>
  <div class="content-main">
    <div class="instert-bank-form">
      <ul>
        <template v-if="bankInfo">
          <li>
            <label>姓名</label>
            <p class="txt">{{bankInfo.bankPerson}}</p>
          </li>
          <li>
            <label>身份证</label>
            <p class="txt">{{bankInfo.ident || ident}}</p>
          </li>
          <li @click="selectBank">
            <label>银行卡号</label>
            <p class="txt">{{bankInfo.bankNo}}</p>
            <i class="icon-rower"></i>
          </li>
          <li>
            <label>所属银行</label>
            <p class="txt">{{bankInfo.bankName}}</p>
          </li>
        </template>
        <li>
          <label>手机号码</label>
          <p class="txt" v-if="pageFunding === 'GSH'">{{phone}}</p>
          <input type="text" v-else class="inp" v-model="phone" maxlength="11" placeholder="请输入银行预留手机号">
        </li>
        <li>
          <label>验证码</label>
          <input type="text" class="inp" v-model="vCode" maxlength="6" placeholder="请输入验证码">
          <span class="instert-bank-checekcode" v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
          <span class="instert-bank-checekcode" v-else>重新获取<i v-if="timer > -1">{{timer}}s</i></span>
        </li>
      </ul>
    </div>
    <p class="p-warm">审核通过后，您的借款将发放到该银行卡，请真实填写，我们将按照规定的还款时间从该银行卡进行扣款。</p>
  </div>
  <div class="footer">
    <p class="bnt1" @click="submitBind">提交</p>
    <div class="term" v-if="protocol && protocol.chiId.length">
      <label><input type="checkbox" v-model="termStatic"><i class="icon"></i>我已阅读并同意签署</label>
      <span v-if="protocol" @click="popupVisible = true">《{{protocol.groupTitle}}》</span>
    </div>
  </div>
  <mt-popup class="term-list" v-model="popupVisible" position="bottom">
    <div class="tt">
      <i class="close" @click="popupVisible=false"></i>
      <p class="txt">协议</p>
    </div>
    <ul class="" v-if="protocol">
      <li v-for="(item ,index) in protocol.chiId" :key="index" @click="tapLink(item.protocolUrl)">《{{item.protocolElucidation}}》</li>
    </ul>
  </mt-popup>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import stepShower from './../Result/components/step';
import InsertBank from '@/components/credit/InsertBank/InsertBankXY';
export default {
  components: {
    stepShower, InsertBank
  },
  data(){
    return{
      termStatic:true,
      tabHover:true,
      pageData:null,
      popupVisible: false,
      step:{
        step:2,
        status:true,
      },
      termUrl:'',
      phone: null, // 手机号
      vCode: null, // 验证码
      vMessage: "获取验证码",
      timer: 60, // 倒计时
      vTime: null, // 倒计时计时器
      sendStatus: false, // 验证码发生状态
      transactionCode: null, // 短信流水号
      protocol:null,
      bindBankInfo:null,
      pageFunding:null,
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
      ident: state => state.global.userInfo.ident,
    }),
    ...mapState('base', {
      bankInfo: state => state.bankInfo,
    }),
  },
  async created() {
    this.pageFunding = this.$route.query.funding;
    this.getAgreement();
    if(this.pageFunding === "GSH"){
      await this.getDetail();
      this.set_bankInfo(this.bindBankInfo);
    }
    else{
      if(!this.bankInfo){
        this.getBankList(this.personId);
      }
    }
  },
  mounted(){
  },
  methods:{
    ...mapActions('base', [
      'getBankList','set_bankInfo'
    ]),
    toast(mes) {
      this.$toast({
        message: mes,
        duration: 1500
      });
    },
    async getDetail(){
      // 获取订单详情，取订单详情的银行卡信息
      const params = {
        orderNo: this.$route.query.orderNo,
      }
      const res = await this.$api.queryOrderDetailHttp(params);
      if(res.code === 'sc0' && res.data){
        const info = res.data.withdrawBankInfo;
        this.bindBankInfo = {
          bankPerson: info.custName,
          ident: info.custNo,
          bankNo: info.bankCode,
          bankName: info.bankName,
        }
        this.phone = info.bankMobile;
      }
      else{
        this.$toast(res.message);
      }
    },
    // 校验手机号
    checkPhone(ev) {
      const reg = /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/;
      if (!this.checkVal(reg, this.phone)) {
        if (ev) ev.target.focus();
        this.$toast("请输入有效的手机号码");
        return false;
      }
      return true;
    },
    // 校验验证码
    checkVcode(ev) {
      const reg = /^\d{6}$/;
      if (!this.checkVal(reg, this.vCode)) {
        ev.target.focus();
        this.$toast("请按正确格式输入验证码");
      }
    },
    checkVal(reg, val) {
      // 当值存在，才正则
      if (val) {
        return reg.test(val);
      } else {
        return true;
      }
    },
    async getVcode(val) {
      if (this.phone && this.phone.length == 11) {
        if (this.checkPhone()) {
          const res = await this.$api.bindBankSendCodeHttp({
            phone: this.phone,              //String18374787057手机号码
            userId: this.userId,            //Number1用户Id
            idEnt: this.bankInfo.ident || this.ident,              //String身份证
            bankNo: this.bankInfo.bankNo,   //String银行卡号
            bankName: this.bankInfo.bankName,//String银行名称
            name: this.bankInfo.bankPerson, //String姓名
            funding: this.$route.query.funding,                  //String资金方: BS
            personId: this.idPerson,        //StringpersonId
            orderNo: this.$route.query.orderNo,//String订单号
            codeType: 'XJD',                //String短信类型 ： XJD
          });
          if (res.code === '0' || res.code === 'sc0') {
            this.transactionCode = res.data;
            this.sendStatus = true;
            this.vTime = setInterval(this.calcTime, 1000);
          } else {
            this.$toast(res.message);
          }
        }
      } else {
        this.$toast("请输入手机号码");
      }
    },
    calcTime() {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.vTime);
        this.sendStatus = false;
        this.timer = 60;
        this.vMessage = "重新发送";
      }
    },
    selectBank(){
      if(this.pageFunding === "GSH"){
        return false;
      }
      this.goLink({
        path:'bank-list',
        query:{
          orderNo:this.$route.query.orderNo,
          funding:this.$route.query.funding,
        }
      });
    },
    async submitBind(){
      if(!this.termStatic){
        this.$toast('请阅读并同意协议后再进行提交绑卡');
        return false;
      }
      // 提交绑卡 bindBankSubmitHttp
      const res = await this.$api.bindBankSubmitHttp({
        idEnt: this.bankInfo.ident || this.ident,//String身份证号
        name: this.bankInfo.bankPerson,//String姓名
        bankNo: this.bankInfo.bankNo,//String银行卡号
        funding: this.$route.query.funding,//String资金方 BS
        bankPhone: this.bankInfo.bankPhone,//String银行预留手机
        bankName: this.bankInfo.bankName,//String银行名称
        smsCode: this.vCode,//String短信验证码
        orderNo: this.$route.query.orderNo,//String订单号
        codeType: 'XJD',//StringXJD
        transactionCode: this.transactionCode,//String流水号
      });
      if (res.code === '0' || res.code === 'sc0') {
        this.goLink({
          path: '/patch',
          query:{
            mallOrderId:this.$route.query.orderNo
          }
        });
      } else {
        this.$toast(res.message);
      }
    },
    goLink(url) {
      this.$router.replace(url);
    },
    // 获取协议
    async getAgreement() {
      const param = {
        channel: '4',
        group: 'AYQ_BSBK'
      }
      const res = await this.$api.credit.getAgreement(param)
      if (res.code === 'sc0') {
        this.protocol = res.data[0];
      }
    },
    tapLink(url){
      // 跳转外部
      window.location.href = url;
    }
  },
  beforeDestroy() {
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
  flex-direction: column;
  background: #f2f2f2;
  color: #363636;
  .content-main{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .instert-bank-form{
      padding-left: 0.3rem;
      background: #fff;
      li{
        border-bottom: 1px solid #E5E5E5;
        height: 1.1rem;
        display: flex;
        align-items: center;
        padding-right: 0.3rem;
        label{
          width: 1.65rem;
          flex-shrink: 0;
          color: #363636;
          font-size: 0.3rem;
        }
        .txt{
          font-size: 0.3rem;
          color: #A8A8A8;
          width: 100%;
        }
        .inp{
          font-size: 0.3rem;
          width: 100%;
        }
        .instert-bank-checekcode{
          display: block;
          height: 0.5rem;
          line-height: 0.5rem;
          width: 2rem;
          flex-shrink: 0;
          text-align: right;
          font-size: 0.3rem;
          color: #D09E54;
          border-left: 0.03rem solid #E5E5E5;
          i {
            display: inline;
            list-style: none;
            color: #a8a8a8;
          }
        }
        .icon-rower{
          width: 0.14rem;
          height: 0.22rem;
          flex-shrink: 0;
          background: url(./../images/rower@2x.png) center no-repeat;
          background-size: 100% auto;
          margin-left: 0.2rem;
        }
      }
    }
    .p-warm{
      color:#a8a8a8;
      font-size: 0.24rem;
      padding: 0.3rem;
    }
  }
  .footer{
    text-align: center;
    flex-shrink: 0;
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
    .bnt1{
      height: 0.92rem;
      // border: 0.05rem solid #D09E54;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      line-height: 0.91rem;
      color: #fff;
      font-size: 0.36rem;
      border-radius: 0.15rem;
      margin: 0.4rem 0.3rem 0.25rem 0.3rem;
      text-align: center;
    }
    .warm-txt{
      color: #A8A8A8;
      font-size: 0.24rem;
      line-height: 0.4rem;
      margin: 0 0.3rem 0.6rem 0.3rem;
      text-align: center;
    }
  }
  .term-list{
    width: 100%;
    height:50%;
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
    }
    li{
      height: 1rem;
      line-height: 1rem;
      border-top: 1px solid #E5E5E5;
      font-size: 0.3rem;
    }
  }
  .icon-check{
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
</style>


