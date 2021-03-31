<template>
  <div class="instert-bank">
    <div class="instert-bank-form">
      <ul>
        <li>
          <mt-field type="text"
                    v-model="bankNo" @blur.native.capture="checkBankCode"
                    placeholder="请填写您的银行卡号"
                    label="银行卡号" ></mt-field>
          <i class="form-icon-bank" @click="goBankList"></i>
        </li>
        <li v-show="bankName">
          <img v-lazy="bankIconUrl" class="bank-icon"/>
          <p>{{bankName}}</p>
        </li>
        <li>
          <mt-field type="tel"
                    v-model="bankPhone" @blur="checkBankCode"
                    placeholder="请输入银行预留手机号"
                    :attr="{ maxlength: 11 }"
                    label="手机号码" ></mt-field>
        </li>
        <li>
          <mt-field type="tel"
                    v-model="vCode" @blur="checkBankCode"
                    placeholder="请输入手机验证码"
                    :attr="{ maxlength: 6 }"
                    label="验证码" ></mt-field>
          <span class="instert-bank-checekcode" v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
          <span class="instert-bank-checekcode disable" v-else><span v-if="timer > -1">{{timer}}s</span></span>
        </li>
      </ul>
    </div>
    <!-- 收不到验证码提示 -->
    <codeTips :msgId="msgId"/>
    <div class="insert-bank-footer">
      <div class="insert-bank-btn">
        <button :disabled="!submitBtnStatus" @click="submitForm">提交</button>
      </div>
      <protocol-item
        :linkArr="linkData"
        @handleStatus="handleStatus"
        v-if="isShowTerm">
      </protocol-item>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import ProtocolItem from '../components/ProtocolItem'
import codeTips from '../../components/codeTips'
import {imgCompression} from '@/helpers/utils'

export default {
  components: {
    ProtocolItem,
    codeTips
  },
  props: ["linkArr"],
  data() {
    return {
      checked: true,
      linkData: [{
        title: '《银行代扣协议》',
        url: 'http://3c.dafysz.cn/h5/sales/#/CashRouter/LoanService/WithholdService'
      }],
      name: "",
      ident: "",
      bankNo: null, // 银行卡
      bankName: null, //银行类型
      bankIconUrl: null, //银行图标
      bankPhone: null, // 手机号
      vCode: null, // 验证码
      vMessage: "获取",
      timer: 60, // 倒计时
      vTime: null, // 倒计时计时器
      sendStatus: false, // 验证码发生状态
      bankList: [], // 银行列表
      slots: [],
      msgId: null,
      isShowTerm: true
    }
  },
  computed: {
    ...mapState({
      userId: state => state.global.userInfo.userId,
      accountId: state => state.global.userInfo.accountId,
      idPerson: state => state.global.userInfo.idPerson
    }),
    ...mapState('credit', {
      bankInfo: state => state.bankInfo,
      idCardInfo: state => state.idCardInfo,
      product: state => state.product || "JXH"
    }),
    submitBtnStatus() {
      return this.bankNo && this.checkPhone(this.bankPhone) && this.checkVcode(this.vCode)
    }
  },
  created() {
    // 协议替换
    if (this.linkArr) {
      this.linkData = this.linkArr
    }
  },
  mounted() {
    if (!this.idCardInfo) {
      this.$router.replace({path: '/identityAc'})
    } else {
      this.bankNo = this.bankInfo && this.bankInfo.bankNo
      this.bankName = this.bankInfo && this.bankInfo.bankName
      this.bankIconUrl = this.bankInfo && this.bankInfo.bankIconUrl
      this.bankPhone = this.bankInfo && this.bankInfo.bankPhone
      this.vCode = this.bankInfo && this.bankInfo.smsCode
    }
    this.isShowTerm = this.$route.meta.isShowTerm
  },
  beforeDestroy() {
    clearInterval(this.vTime);
    this.sendStatus = false;
    this.timer = 60;
    this.vMessage = "";
  },
  methods: {
    ...mapActions('credit',['set_bankInfo']),
    goBankList() {
      this.$router.push({path: "/bankList"})
    },
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
      if (!this.checkVal(reg, this.bankNo)) {
        if (ev) ev.target.focus();
        this.toast("请输入有效的银行卡号");
        return false;
      }
      this.bankNo && this.getBankName(this.bankNo)
      return true;
    },
    // 获取银行名称
    async getBankName(code) {
      const param = {
        bankNo: code
      }
      const res = await this.$api.jxhCredit.JXHgetBankInfo(param);
      if (res.code === 'sc0' || res.code === '0') {
        this.bankName = res.data.bankName;
        this.bankIconUrl = res.data.bankIconUrl || res.data.backgroundUrl;
      } else {
        this.$toast(res.message)
      }
    },
    // 校验手机号
    checkPhone(phone) {
      const reg = /^(13[0-9]|14[579]|15[0-4,5-9]|16[0-9]|17[0-9]|18[0-9]|19[8-9]|166)\d{8}$/;
      if (!this.checkVal(reg, phone)) {
        return false;
      }
      return true;
    },
    // 校验验证码
    checkVcode(code) {
      const reg = /^\d{6}$/;
      if (!this.checkVal(reg, code) || !code) {
        return false;
      }
      return true;
    },
    async getVcode(val) {
      if (this.bankPhone && this.bankPhone.length == 11) {
        if (this.checkPhone()) {
          const res = await this.$api.jxhCredit.JXHsendBankFourSms({
              name: this.idCardInfo.name,
              ident: this.idCardInfo.ident,
              bankNo: this.bankNo,
              userId: this.userId,
              accountId: this.accountId,
              bankPhone: this.bankPhone,
              product: this.product
            })
          if (res.code === 'sc0' || res.code === '0') {
            this.sendStatus = true;
            this.vTime = setInterval(this.calcTime, 1000);
            if (res.data && res.data.msgId) this.msgId = res.data.msgId
          } else {
            this.toast("短信下发失败");
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
        this.vMessage = "重新获取";
      }
    },
    handleStatus(val) {
      this.checked = val
    },
    // 提交表单
    async submitForm() {
      if (!this.bankNo) {
        return this.toast("请填写有效的银行卡号");
      } else if (!this.checkPhone(this.bankPhone)) {
        return this.toast("请填写正确的手机号码");
      } else if (!this.checkVcode(this.vCode)) {
        return this.toast("验证码输入有误");
      }
      const param = {
        bankNo: this.bankNo,
        bankPhone: this.bankPhone,
        smsCode: this.vCode,
        bankIconUrl: this.bankIconUrl,
        bankName: this.bankName
      };
      await this.set_bankInfo(param)
      this.$router.back()
    },

  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
.instert-bank{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .instert-bank-form{
    height: auto;
    width: 100%;
    @extend %form;
    ul{
      li{
        /deep/ .mint-field{
          background-image: none;
          width: 100%;
          font-size: 0.3rem;
          .mint-cell-title{
            width: 1.38rem;
            margin-right: .48rem;
          }
          .mint-cell-wrapper{
            background-image: none;
          }
        }
        .bank-icon{
          width: .5rem;
          height: .5rem;
          display: inline-block;
          margin-right: .12rem;
          border-radius: 50%;
        }
        i{
          display: block;
          height: 0.46rem;
          width: 0.46rem;
          flex-shrink: 0;
          background-size: 0.40rem;
          background-position: center;
          background-repeat: no-repeat;
          &.form-icon-bank{
            @include bg-image('../image/icon-bank');
          }
        }
        .instert-bank-checekcode{
          display: inline-block;
          line-height: 0.5rem;
          padding: 0 .3rem ;
          flex-shrink: 0;
          text-align: right;
          font-size: 0.26rem;
          background:rgba(252,244,231,1);
          border-radius: .3rem;
          color: #BA9950;
          span {
            display: inline;
            list-style: none;
            color: $color-gray;
          }
          &.disable{
            background:rgba(247,247,247,1);
          }
        }
      }
    }
  }
  .insert-bank-footer{
    width: 100%;
    height: 0.88rem;
    text-align: center;
    margin: .8rem 0 .98rem 0;
    /deep/ .protocol-item{
      height: auto;
      color: #A8A8A8;
      a{
        color: #A8A8A8;
      }
    }
    .insert-bank-btn{
      width: calc(100% - 0.6rem);
      height: 0.92rem;
      margin: 0.3rem;
      button{
        -webkit-appearance: none;
        border: none;
        font-size: .32rem;
        color: #fff;
        width: 6.84rem;
        height: .88rem;
        line-height: .88rem;
        border-radius: .44rem;
        background: rgba(186, 153, 80, 1);
        &[disabled="disabled"]{
          background-color: #ddd;
        }
      }
    }
  }
}
</style>
