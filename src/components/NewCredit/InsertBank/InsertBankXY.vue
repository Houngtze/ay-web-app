<template>
  <div class="instert-bank">
    <div class="instert-bank-form">
      <ul>
        <li>
          <label>付款信用卡</label>
          <input type="text" maxlength="21" v-model="xyCardBand.creditCardNo" @blur="checkBankCode" placeholder="请添加付款信用卡">
        </li>
        <li>
          <label>安全码</label>
          <input type="text" maxlength="3" v-model="xyCardBand.securityCode" placeholder="请输入卡背后的安全码">
          <i class="form-icon-question" @click="bcodeModal = true"></i>
        </li>
        <li>
          <label>有效期</label>
          <input type="text" maxlength="4" v-model="xyCardBand.validityDate" placeholder="请输入有效期（月年）">
          <i class="form-icon-question" @click="fdateModal = true"></i>
        </li>
        <li>
          <label>预留手机号</label>
          <input type="text" v-model="phone" maxlength="11" placeholder="请输入银行预留手机号">
        </li>
        <li>
          <label>验证码</label>
          <input type="text" v-model="vCode" maxlength="6" placeholder="请输入手机验证码">
          <span class="instert-bank-checekcode" v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
          <span class="instert-bank-checekcode" v-else>重新获取<i v-if="timer > -1">{{timer}}s</i></span>
        </li>
      </ul>
    </div>
    <div class="insert-bank-footer">
      <div class="insert-bank-btn">
        <button :disabled="!checked" @click="submitForm">立即提现</button>
      </div>
      <protocol-item
        :linkArr="linkArr"
        @handleStatus="handleStatus">
      </protocol-item>
    </div>
    <div class="ex-modal" v-show="bcodeModal">
      <div class="bg">
        <p class="tt">示例</p>
        <img class="pic" src="./img/bcode.png">
      </div>
      <img class="close" src="./img/close.png" @click="bcodeModal = false">
    </div>
    <div class="ex-modal" v-show="fdateModal">
      <div class="bg">
        <p class="tt">示例</p>
        <img class="pic" src="./img/fdate.png">
      </div>
      <img class="close" src="./img/close.png" @click="fdateModal = false">
    </div>
  </div>
</template>
<script>
import { mapState,mapActions } from "vuex";
import PickerPop from "../components/PickerPop";
import ProtocolItem from '../components/ProtocolItem'
import {imgCompression} from '@/helpers/utils'
export default {
  components: {
    ProtocolItem,
    PickerPop,
  },
  data() {
    return {
      selectMMYY:false,
      checked: true,
      linkArr: [{
        title: '《银行代扣协议》',
        url: 'http://aiyong.dafysz.cn/terms/account-authoritzation.html'
      }],
      bankCode: null, // 银行卡
      bankType: null, //银行类型
      phone: null, // 手机号
      vCode: null, // 验证码
      vMessage: "获取验证码",
      timer: 60, // 倒计时
      vTime: null, // 倒计时计时器
      sendStatus: false, // 验证码发生状态
      bankList: [], // 银行列表
      slots: [],
      xyCardBand:{
        creditCardNo:'', // 卡号
        securityCode:'', // 安全码
        validityDate:'', // 有效期
      },
      orderNo: null,
      bcodeModal:false,
      fdateModal:false,
    }
  },
  watch:{
    'xyCardBand.securityCode': {
      handler:function(a){
        this.xyCardBand.securityCode = a.replace(/[^\d]/g,'');
      },
      deep:true,
    },
    'xyCardBand.validityDate': {
      handler:function(a){
        this.xyCardBand.validityDate = a.replace(/[^\d]/g,'');
        if(this.xyCardBand.validityDate*1 > 1299){
          this.xyCardBand.validityDate = this.xyCardBand.validityDate.substr(0,3);
        }
      },
      deep:true,
    },
  },
  computed: {
    ...mapState({
      // 'isSign': state => state.global.sign.isSign,
      userId: state => state.global.userInfo.userId,
      ucAccountId: state => state.global.userInfo.ucAccountId,
      idPerson: state => state.global.userInfo.idPerson,
      name:state => state.global.userInfo.name,
      ident:state => state.global.userInfo.ident,
    }),
    ...mapState('loan', {
      bankInfo: state => state.bankInfo,
      loanData: state => state.loanData,
    }),
  },
  created() {
  },
  methods: {
    ...mapActions('loan', [
      'clearData'
    ]),
    // 获取银行列表
    checkVal(reg, val) {
      // 当值存在，才正则
      if (val) {
        return reg.test(val);
      } else {
        return true;
      }
    },
    toast(mes) {
      this.$toast({
        message: mes,
        duration: 1500
      });
    },
    // 校验银行卡号
    checkBankCode(ev) {
      const reg = /(^\d{15,19}$)/g;
      if (!this.checkVal(reg, this.xyCardBand.creditCardNo)) {
        if (ev) ev.target.focus();
        this.toast("请输入有效的银行卡号");
        return false;
      }
      return true;
    },
    // 校验手机号
    checkPhone(ev) {
      const reg = /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/;
      if (!this.checkVal(reg, this.phone)) {
        if (ev) ev.target.focus();
        this.toast("请输入有效的手机号码");
        return false;
      }
      return true;
    },
    // 校验验证码
    checkVcode(ev) {
      const reg = /^\d{6}$/;
      if (!this.checkVal(reg, this.vCode)) {
        ev.target.focus();
        this.toast("请按正确格式输入验证码");
      }
    },
    async getVcode(val) {
      if (!this.xyCardBand.creditCardNo) {
        this.toast("请填写有效的银行卡号");
        return
      } else if (!this.xyCardBand.securityCode || this.xyCardBand.securityCode.length<3) {
        this.toast("请填写有效的安全码");
        return
      } else if (!this.xyCardBand.validityDate || this.xyCardBand.validityDate.length!=4) {
        this.toast("请填写有效的有效期");
        return
      }
      if (this.phone && this.phone.length == 11) {
        if (this.checkPhone()) {
          const res = await this.$api.extractCheckHttp({
              idNo:this.ident, // 身份证
              bankMobile:this.bankInfo.bankPhone, // 银行卡绑定手机号码
              custName:this.bankInfo.bankPerson, // 持卡人姓名
              creditCardNo:this.xyCardBand.creditCardNo, // 信用卡卡号
              securityCode:this.xyCardBand.securityCode, // 信用卡安全码
              validityDate:this.xyCardBand.validityDate.substr(2,2) + this.xyCardBand.validityDate.substr(0,2), // 信用卡4位有效日期：YYMM
              creditCardMobile:this.phone, // 信用卡绑定手机号码
              transactionAmount:this.loanData.transactionAmount, // 提现金额单位（元）
              bankNo:this.bankInfo.bankNo, // 收款卡号
              creditCardBankCode:'', // 付款信用卡银行编码
              orgType:'TXZF', // 机构：天下支付（TXZF）
              source:'TXZF', // 来源
              platform:'H5', // 渠道，APP_ios、APP_Android、WeChat、H5
              userId: this.userId,
              personId: this.idPerson,
              bankName:this.bankInfo.bankName,
            })
          if (res.code === '0' || res.code === 'sc0') {
            if(res.data.orderNo){
              this.orderNo = res.data.orderNo;
            }
            this.sendStatus = true;
            this.vTime = setInterval(this.calcTime, 1000);
          } else {
            this.toast(res.message);
          }
        }
      } else {
        this.toast("请输入手机号码");
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
    handleStatus(val) {
      this.checked = val
    },
    // 提交表单
    async submitForm() {
      if (!this.xyCardBand.creditCardNo) {
        this.toast("请填写有效的银行卡号");
        return
      } else if (!this.xyCardBand.securityCode || this.xyCardBand.securityCode.length<3) {
        this.toast("请填写有效的安全码");
        return
      } else if (!this.xyCardBand.validityDate || this.xyCardBand.validityDate.length!=4) {
        this.toast("请填写有效的有效期");
        return
      } else if (!this.phone) {
        this.toast("请填写手机号码");
        return
      } else if (!this.orderNo) {
        this.toast("请先获取验证码");
        return
      } else if (!this.vCode) {
        this.toast("请填写验证码");
        return
      }
      const param = {
        orderNo: this.orderNo,
        smsCode: this.vCode,
        userId: this.userId
      };
      const res = await this.$api.extractApplyHttp(param);
      if (res.code === '0' || res.code === 'sc0') {
        this.clearData();
        this.$router.replace({
          path: '/runing',
          query:{
            id:this.orderNo
          }
        });
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },
    closeSelectDate(){
      // 取消选择有效期
      this.selectMMYY = false;
    },
    submitSelectDate(val){
      // 确认选择有效期
      this.xyCardBand.validityDate = val;
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
.instert-bank{
  display: flex;
  flex-direction: column;
  width: 100%;
  .instert-bank-form{
    width: 100%;
    @extend %form;
    ul{
      li{
        i{
          display: block;
          height: 0.46rem;
          width: 0.46rem;
          flex-shrink: 0;
          background-size: 0.40rem;
          background-position: center;
          background-repeat: no-repeat;
          &.form-icon-code{
            @include bg-image('../image/icon-camera');
          }
          &.form-icon-bank{
            @include bg-image('../image/icon-bank');
          }
          &.form-icon-question{
            @include bg-image('../image/question');
          }
        }
        .instert-bank-checekcode{
          display: block;
          height: 0.5rem;
          line-height: 0.5rem;
          width: 2rem;
          flex-shrink: 0;
          text-align: right;
          font-size: 0.3rem;
          color: $color-gold;
          border-left: 0.03rem solid $bd-color-main;
          i {
            display: inline;
            list-style: none;
            color: $color-gray;
          }
        }
      }
    }
  }
  .insert-bank-footer{
    flex-shrink: 0;
    /deep/ .protocol-item{
      height: auto;
    }
    .insert-bank-btn{
      width: calc(100% - 0.6rem);
      height: 0.92rem;
      margin: 0.3rem;
      button{
        @extend %btn;
        @include bg-image('../image/bg-btn');
        &:active{
          @include bg-image('../image/bg-btn-active');
        }
      }
    }

  }
  .ex-modal{
    position: fixed;
    top: 0;
    left:0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: .6);
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction:column;
    .bg{
      width: 5.6rem;
      height: 4.28rem;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border-radius: 0.1rem;
      .tt{
        font-size: 0.28rem;
        padding-bottom: 0.2rem;
      }
      .pic{
        width: 4.1rem;
        height: auto;
      }
    }
    .close{
      width: 0.6rem;
      height: auto;
      margin-top: 0.6rem;
    }
  }
}
</style>
