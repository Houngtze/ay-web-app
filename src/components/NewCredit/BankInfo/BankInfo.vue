<template>
  <div class="bank-info">
    <progress-bar :index=3></progress-bar>
    <div class="content" v-show="bankInfo">
      <div class="base-info-form">
        <ul>
          <li>
            <label>姓名</label>
            <input type="text" disabled v-model="bankInfo.bankPerson" placeholder="请填写您的姓名">
          </li>
          <li>
            <label>身份证号</label>
            <input type="text" disabled maxlength="18" v-model="ident" placeholder="请填写您的身份证号">
          </li>
          <li class="arrow" @click="toSelectCard">
            <label>银行卡号</label>
            <input type="text" disabled maxlength="19" v-model="bankInfo.bankNo" placeholder="请填写您的银行卡号">
          </li>
          <li>
            <label>所属银行</label>
            <input type="text" disabled v-model="bankInfo.bankName" placeholder="请填写您的银行卡所属银行">
          </li>
          <li>
            <label>手机号码</label>
            <input type="tel" v-model="bankInfo.bankPhone" maxlength="11" placeholder="请输入银行预留手机号">
          </li>
          <li v-if="smsVerifySwitch">
            <label>验证码</label>
            <input type="tel" v-model="vCode" maxlength="6" placeholder="请输入手机验证码">
            <span class="base-info-checekcode" v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
            <span class="base-info-checekcode" v-else>重新获取<i v-if="timer > -1">{{timer}}s</i></span>
          </li>
        </ul>
        <p class="warn">该银行卡作为您的默认还款银行卡，分期成功后我们将按照规定的还款时间从该银行进行扣款。</p>
      </div>
      <div class="bank-footer">
        <div v-html="ppmContent" v-show="false" ref="formSubmit"></div>
        <protocol-item
          :linkArr="linkArr"
          @handleStatus="handleStatus">
        </protocol-item>
        <div class="bank-btn">
          <button :disabled="!checked" @click="submit">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions} from 'vuex'
import ProgressBar from '../components/Progress'
import ProtocolItem from '../components/ProtocolItem'
import PickerPop from "../components/PickerPop";
import {formatDateTime} from '@/helpers/utils'

export default {
  components: {
    ProgressBar,
    ProtocolItem,
    PickerPop
  },
  data() {
    return {
      checked: true,
      linkArr: [{
        title: '《银行代扣协议》',
        url: 'http://aiyong.dafysz.cn/terms/account-authoritzation.html'
      }],
      bankList: [],
      bankInfoList: [],
      bankInfo: {},
      vCode: null,
      vMessage: "获取验证码",
      timer: 60, // 倒计时
      vTime: null, // 倒计时计时器
      sendStatus: false, // 验证码发生状态
      ppmContent: null,
      smsVerifySwitch: null,  //  短信开关
      smsNo: null,
      funding: null
    }
  },
  watch: {
  },
  computed: {
    ...mapState({
      userId: state => state.global.userInfo.userId,
      idPerson: state => state.global.userInfo.idPerson,
      name: state => state.global.userInfo.name,
      ucAccountId: state => state.global.userInfo.ucAccountId,
      phone: state => state.global.userInfo.phone,
      ident: state => state.global.userInfo.ident,
      source: state => state.global.source
      // creditStartTime: state => state.credit.creditStartTime,
    }),
    ...mapState('bankInfo', {
      bankInfoCache: state => state.bankInfo
    })
  },
  created() {
    this.getBankInfo();
  },
  methods: {
    async getBankInfo() {
      const param = {
        product: 'AMFT',
        idPerson: this.idPerson,
        userId: this.userId,
        channel: 'H5',
        ucAccountId: this.ucAccountId,
      }
      const res = await this.$api.credit.getBankInfo(param)
      if (res.code === 'sc0') {
        this.bankInfoList = res.data.bankInfoList;
        this.funding = res.data.funding;
        this.smsVerifySwitch = res.data.smsVerifySwitch;
        this.setBankInfo()
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },
    setBankInfo() {
      if (this.bankInfoCache) {
        this.bankInfo = this.bankInfoCache
      } else {
        for(let i = 0; i<this.bankInfoList.length; i++) {
          if(this.bankInfoList[i].isDefault === 1) {
            this.bankInfo = this.bankInfoList[i]
            break;
          }
        }
        if (!this.bankInfo.bankName) {
          this.bankInfo = this.bankInfoList[0]
        }
      }
    },
    handleValue(val, index) {
      this.bankInfo = this.bankInfoList[index]
    },
    handleStatus(val) {
      this.checked = val
    },
    toInsertBank() {
      this.$router.push({path: '/insertBank'})
    },
    // 校验值
    checkVal(reg, val) {
      // 当值存在，才正则
      if (val) {
        return reg.test(val);
      } else {
        return false;
      }
    },
    // 校验手机号
    checkPhone(ev) {
      const reg = /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/;
      console.log(this.checkVal(reg, this.phone))
      if (!this.checkVal(reg, this.phone)) {
        if (ev) ev.target.focus();
        this.toast("请输入有效的手机号码");
        return false;
      }
      return true;
    },
    // toast
    toast(mes) {
      this.$toast({
        message: mes,
        duration: 1500
      });
    },
    // 校验验证码
    checkVcode() {
      const reg = /^\d{6}$/;
      console.log(this.vCode)
      if (!this.checkVal(reg, this.vCode)) {
        this.toast("请按正确格式输入验证码");
        return false;
      }
      return true
    },

    // 获取验证码
    getVcode() {
      if (this.phone && this.phone.length == 11) {
        if (this.checkPhone()) {
          if (!this.bankInfo || !this.bankInfo.bankNo) {
            this.$api.base.SendSmsCode({
              "phone": this.bankInfo.bankPhone,
              "personid": this.idPerson,
              "userId": this.userId,
              "idEnt": this.ident,
              "bankNo": this.bankInfo.bankNo,
              "name": this.bankInfo.bankPerson,
              "productType": "AMFT",
              "funding": this.funding
            }).then(res => {
              if (res.code !== "sc0") {
                this.toast(res.message);
              } else {
                this.sendStatus = true;
                this.vTime = setInterval(this.calcTime, 1000);
                this.smsNo = res.data.smsNo
              }
            });
          } else {
            this.$api.sendMsxfSms({
              "bankPhone": this.bankInfo.bankPhone,
              "idPerson": this.idPerson,
              "userId": this.userId,
              "bankNo": this.bankInfo.bankNo,
              "productType": "AMFT"
            }).then(res => {
              if (res.code !== "sc0") {
                this.toast(res.message);
              } else {
                this.sendStatus = true;
                this.vTime = setInterval(this.calcTime, 1000);
                this.smsNo = res.data.smsNo
              }
            });
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
    // 校验验证码
    checkVcode() {
      const reg = /^\d{6}$/;
      console.log(this.vCode)
      if (!this.checkVal(reg, this.vCode)) {
        this.toast("请按正确格式输入验证码");
        return false;
      }
      return true
    },
    // 提交表单
    async submit() {
      if (!this.bankInfo.bankNo) {
        this.$toast({
          message: '请先添加银行卡',
          position: 'bottom'
        })
        return
      }
      if (!(this.checkVcode() && this.checkPhone())) {
        return
      }
      const param = {
        bankCode: this.bankInfo.bankCode,
        bankNo: this.bankInfo.bankNo,
        bankName: this.bankInfo.bankName,
        bankPhone: this.bankInfo.bankPhone,
        bankType: this.bankInfo.bankType,
        creditEndTime: formatDateTime('yyyy-mm-dd hh:mm:ss'),
        phone: this.phone,
        channel: 'H5',
        idPerson: this.idPerson,
        type: this.smsVerifySwitch ? 1 : 2,
        userId: this.userId,
        product: 'AMFT',
        source: this.source,
        smsCode: this.smsVerifySwitch ?  this.vCode : null,
        smsNo: this.smsNo // 短信码验证码
      };
      const res = await this.$api.credit.identityAuthentication(param);
      if (res.code === 'sc0') {
        this.$emit('BankInfoPageHandle', res)
      } else {
        this.$toast(res.message)
      }
    },
    // 去选择银行卡
    toSelectCard() {
      this.$router.push({path: '/bankList'})
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../style/index.scss';
  .bank-info{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .content{
      display: flex;
      height: 100%;
      width: 100%;
      flex-direction: column;
      .base-info-form {
        margin-top: .18rem;
        @extend %form;
        ul {
          li {
            i {
              display: block;
              height: 0.46rem;
              width: 0.46rem;
              flex-shrink: 0;
              background-size: 0.4rem;
              background-position: center;
              background-repeat: no-repeat;
              &.form-icon-code {
                @include bg-image("./image/icon-camera");
              }
              &.form-icon-bank {
                @include bg-image("./image/icon-bank");
              }
            }
            .base-info-checekcode {
              display: block;
              height: 0.5rem;
              line-height: 0.5rem;
              width: 1.8rem;
              flex-shrink: 0;
              text-align: right;
              font-size: 0.3rem;
              color: $color-gold;
              border-left: 0.01rem solid $bd-color-main;
              i {
                display: inline;
                list-style: none;
                color: $color-gray;
              }
            }
            &.arrow {
              position: relative;
              padding-right: .26rem;
              &::before {
                content: "";
                display: inline-block;
                height: 0.2rem;
                width: 0.2rem;
                border-width: 0.02rem 0.02rem 0 0;
                border-color: #C8C8C8;
                border-style: solid;
                transform: translate(0, -50%) rotate(45deg);
                position: absolute;
                top: 50%;
                right: .3rem;
              }
            }
          }
        }
        .warn {
          line-height: 1.5;
          padding: 0.3rem;
          color: $color-gray;
          font-size: 0.24rem;
        }
      }
      .bank-footer{
        flex-shrink: 0;
        /deep/ .protocol-item{
          height: auto;
        }
        .bank-btn{
          width: calc(100% - 0.6rem);
          height: 0.92rem;
          margin: 0.3rem;
          button{
            @extend %btn;
            @include bg-image('./image/bg-btn');
            &:active{
              @include bg-image('./image/bg-btn-active');
            }
          }
        }
      }
    }
  }
</style>
