<template>
  <div class="instert-bank">
    <div class="instert-bank-form">
      <ul>
        <li>
          <label>银行卡号</label>
          <input type="tel" maxlength="21" v-model="bankCode" @blur="checkBankCode" placeholder="请填写您的银行卡号">
        </li>
        <li>
          <label>所属银行</label>
          <input type="text" disabled v-model="bankType" placeholder="请选择所属银行">
        </li>
        <li>
          <label>手机号码</label>
          <input type="tel" v-model="phone" maxlength="11" placeholder="请输入银行预留手机号">
        </li>
        <li>
          <label>验证码</label>
          <input type="tel" v-model="vCode" maxlength="6" placeholder="请输入手机验证码">
          <span class="instert-bank-checekcode" v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
          <span class="instert-bank-checekcode" :class="{checekcodeSelected: timer > -1}" v-else><i v-if="timer > -1">{{timer}}s</i></span>
        </li>
      </ul>
    </div>
    <!-- 收不到验证码提示 -->
    <codeTips :msgId="msgId"/>
    <div class="insert-bank-footer">
      <div class="insert-bank-btn"  @click="submitForm">提交</div>
      <protocol-item
        :linkArr="linkArr"
        @handleStatus="handleStatus">
      </protocol-item>
    </div>
    <picker-pop
      :slotArr="bankList"
      @handleValue="handleValue"
      ref="pickerPop">
    </picker-pop>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PickerPop from "@component/credit/components/PickerPop";
import ProtocolItem from '@component/credit/components/ProtocolItem'
import codeTips from '@component/jxh/components/codeTips'
import {imgCompression} from '@/helpers/utils'

export default {
  components: {
    ProtocolItem,
    PickerPop,
    codeTips
  },
  data() {
    return {
      checked: true,
      linkArr: [{
        title: '《银行代扣协议》',
        url: 'http://3c.dafysz.cn/h5/sales/#/ZYXJ/WithholdService'
      }],
      bankCode: null, // 银行卡
      bankType: null, //银行类型
      phone: null, // 手机号
      vCode: null, // 验证码
      vMessage: "获取",
      timer: 60, // 倒计时
      vTime: null, // 倒计时计时器
      sendStatus: false, // 验证码发生状态
      bankList: [], // 银行列表
      slots: [],
      codeSe: false,
      msgId: null
    }
  },
  computed: {
    ...mapState({
      // 'isSign': state => state.global.sign.isSign,
      userId: state => state.global.userInfo.userId,
      ucAccountId: state => state.global.userInfo.ucAccountId,
      idPerson: state => state.global.userInfo.idPerson,
      name:state => state.global.userInfo.name,
      ident:state => state.global.userInfo.ident,
    })
  },
  created() {
    if (!this.idPerson) {
      // this.$router.replace({path: '/base'})
    }
    this.getBankList();
  },
  methods: {
    // 获取银行列表
    getBankList(from) {
      return new Promise(async resovle => {
        const res = await this.$api.credit.getUsableBankList();
        if (res.code === "sc0") {
          const arr = res.data.map((item, index) => {
            return {
              index,
              val: item.dicName
            }
          });
          this.bankList = arr;
          resovle()
        } else if(from){
          this.$toast({
            message: res.message,
            duration: 3000,
            position: 'bottom',
          });
        }
      })
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
      if (!this.bankCode) return false
      const reg = /(^\d{15,19}$)/g;
      if (!this.checkVal(reg, this.bankCode)) {
        if (ev) ev.target.focus();
        this.toast("请输入有效的银行卡号");
        return false;
      }
      this.getBankName(this.bankCode)
      return true;
    },
    // 获取银行名称
    async getBankName(code) {
      const param = {
        cardNo: code
      }
      const res = await this.$api.jxhGetBankName(param);
      if (res.result === 'success') {
        this.bankType = res.data.bankName;
      } else {
        this.$toast(res.message)
      }
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
    checkVcode() {
      const reg = /^\d{6}$/;
      if (!this.checkVal(reg, this.vCode)) {
        this.toast("请按正确格式输入验证码");
        return false;
      }
      return true
    },
    async getVcode(val) {
      if (this.phone && this.phone.length == 11) {
        if (this.checkPhone()) {
          const res = await this.$api.jxhSendSmsCode({
              phone: this.phone,
              bankNo: this.bankCode
            })
           if (res.result === 'success') {
            this.sendStatus = true;
            this.vTime = setInterval(this.calcTime, 1000);
            this.msgId = res.data.msgId
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
        this.vMessage = "获取";
      }
    },
    // 选择银行
    handleValue(val) {
      this.bankType = val;
    },
    // 打开银行Pop
    async openPop() {
      if (this.bankList.length === 0) {
        await this.getBankList(true)
      }
      this.$refs.pickerPop.open();
    },
    // 上传图片
    openUpload() {
      this.$refs.imgUpload.click();
    },
    handleStatus(val) {
      this.checked = val
    },
    // 提交表单
    async submitForm() {
      if (!this.bankCode) {
        this.toast("请填写有效的银行卡号");
        return
      } else if (!this.bankType) {
        this.toast("请选择所属银行");
        return
      } else if (!this.phone) {
        this.toast("请填写手机号码");
        return
      } else if (!this.vCode) {
        this.toast("请填写验证码");
        return
      }
      if (!this.checkVcode() || !this.checkPhone()) return false
      this.checkVcode()
      if(!this.checked){
          return this.$toast("请先阅读并同意相关协议");
      }
      const param = {
        bankNo: this.bankCode,
        ident: this.ident,
        name: this.name,
        bankBindPhone: this.phone,
        smsCode: this.vCode,
        ucAccountId: this.ucAccountId,
        userId: this.userId,
        payType: 2,
        bankName: this.bankType
      };
      const res = await this.$api.JxhAddCreditBankCard(param);
       if (res.result === 'success') {
        // 退回上一页
        let backUrl = '/bankInfo';
        if(this.$route.query.bu){
          backUrl = this.$route.query.bu;
        }
        this.$router.replace({path: backUrl});
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },

  }
}
</script>
<style lang="scss" scoped>
@import '@component/credit/style/index.scss';
.instert-bank{
  display: flex;
  flex-direction: column;
  width: 100%;
  .instert-bank-form{
    width: 100%;
    height: auto;
    @extend %form;
    ul{
      li{
        height: 1.02rem;
        border-bottom: 1px solid #EEE;
        input{
          color:#A8A8A8;
          &:disabled{
            background: #fff;
          }
        }
        i{
          display: block;
          height: 0.46rem;
          width: 0.46rem;
          flex-shrink: 0;
          background-size: 0.40rem;
          background-position: center;
          background-repeat: no-repeat;
          &.form-icon-code{
          }
          &.form-icon-bank{
            background-image: url("../images/bank-icon.png");
          }
        }
        .instert-bank-checekcode{
            width:1.20rem;
            height:.60rem;
            background:rgba(252,244,231,1);
            border-radius:.30rem;
            display: block;
            line-height: 0.6rem;
            flex-shrink: 0;
            text-align: center;
            font-size: 0.26rem;
            color: #BA9950;
          i {
            display: inline;
            list-style: none;
            color: $color-gray;
          }
        }
        .checekcodeSelected{
            background:rgba(247,247,247,1);
            color:#A8A8A8;
        }
      }
    }
  }
  .insert-bank-footer{
    flex-shrink: 0;
    margin-top: .98rem;
    /deep/ .protocol-item{
      height: auto;
    }
    .insert-bank-btn{
        width: 6.84rem;
        height: 0.88rem;
        line-height: 0.88rem;
        color: #fff;
        font-size: 0.32rem;
        border-radius: 0.15rem;
        background-color: #BA9950;
        text-align: center;
        border-radius:.44rem;
        margin: 0 auto;
        margin-bottom: 0.4rem;
    }

  }
}
</style>
