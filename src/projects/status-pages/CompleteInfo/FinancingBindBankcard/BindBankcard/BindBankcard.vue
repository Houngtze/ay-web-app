<template>
  <div class="base-info">
    <div class="base-info-warn">
      <span>订单就快完成啦，请绑定你的还款银行卡</span>
    </div>
    <div class="base-info-form">
      <ul>
        <li>
          <label>姓名</label>
          <input type="text" disabled v-model="name" placeholder="请填写您的姓名">
        </li>
        <li>
          <label>身份证号</label>
          <input type="text" disabled maxlength="18" v-model="code" placeholder="请填写您的身份证号">
        </li>
        <li class="arrow" @click="toSelectCard">
          <label>银行卡号</label>
          <input type="text" disabled maxlength="19" v-model="bankCode" placeholder="请填写您的银行卡号">
        </li>
        <li>
          <label>所属银行</label>
          <input type="text" disabled v-model="bankType" placeholder="请填写您的银行卡所属银行">
        </li>
        <li>
          <label>手机号码</label>
          <input type="tel" v-model="phone" maxlength="11" placeholder="请输入银行预留手机号">
        </li>
        <li>
          <label>验证码</label>
          <input type="tel" v-model="vCode" maxlength="6" placeholder="请输入手机验证码">
          <span class="base-info-checekcode" v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
          <span class="base-info-checekcode" v-else>重新获取<i v-if="timer > -1">{{timer}}s</i></span>
        </li>
      </ul>
      <p class="warn">该银行卡作为您的默认还款银行卡，分期成功后我们将按照规定的还款时间从该银行进行扣款。</p>
    </div>
    <div class="base-info-btn">
      <button @click="submitForm">提交</button>
      <!--<protocol-item :linkArr="linkArr" @handleStatus="handleCheckAgreement" style="margin-top: .3rem" v-if="linkArr.length"/>-->
    </div>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  import PickerPop from "../../components/PickerPop/index";
  import ProtocolItem from '../../components/ProtocolItem/index'

  export default {
    components: {
      PickerPop,
      ProtocolItem
    },
    data() {
      return {
        name: null, // 姓名
        code: null, // 身份证
        bankCode: null, // 银行卡
        bankType: null, //银行类型
        phone: null, // 手机号
        vCode: null, // 验证码
        funding: null, // 资金方
        vMessage: "获取验证码",
        timer: 60, // 倒计时
        vTime: null, // 倒计时计时器
        sendStatus: false, // 验证码发生状态
        lockBtn: false, // 按键锁
        bankList: [], // 银行列表
        slots: [],
        linkArr: [],
        orderNo: null,
        ActiveInfo: null,
        agreementCheck: true,
        transactionCode: null, // 短信验证码序列号
        lockSubmit: false
      };
    },
    computed: {
      ...mapState({
        // 'isSign': state => state.global.userInfo.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state => state.global.userInfo.idPerson,
      }),
      ...mapState('bankInfo', {
        bankInfo: state => state.bankInfo
      })
    },
    async created() {
      if (this.$route.query.orderNo) this.orderNo = this.$route.query.orderNo
      this.getBankcardInfo()
      this.getBankList()
    },
    methods: {
      handleCheckAgreement(data) {
        this.agreementCheck = data
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
      // toast
      toast(mes) {
        this.$toast({
          message: mes,
          duration: 1500
        });
      },
      // 检验姓名
      checkName(ev) {
        const reg = /^([\u4e00-\u9fa5]|[\u4e00-\u9fa5]·){2,}$/;
        if (!this.checkVal(reg, this.name)) {
          if (ev) ev.target.focus();
          this.toast("请填写真实姓名");
          return false;
        }
        return true;
      },
      // 检验身份证
      checkCode(ev) {
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!this.checkVal(reg, this.code)) {
          if (ev) ev.target.focus();
          this.toast("请输入有效的身份证号");
          return false;
        }
        return true;
      },
      // 校验银行卡号
      checkBankCode(ev) {
        if (!this.bankCode || this.bankCode.length < 10) {
          return this.toast("请输入有效的银行卡号");
        }
        return true;
      },
      // 校验协议
      checkAgreement() {
        if (!this.agreementCheck) {
          this.toast("请阅读并同意相关协议");
          return false
        }
        return true
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
          if (ev) ev.target.focus();
          this.toast("请按正确格式输入验证码");
          return false
        }
        return true
      },
      // 获取验证码
      getVcode() {
        if (this.phone && this.phone.length == 11) {
          if (this.checkPhone()) {
            /**********************按键锁****************************/
            if (this.lockBtn) {
              return
            }
            this.lockBtn = true
            /********************************************************/
            this.$api.SendSmsCode({
              "codeType": this.funding,
              "phone": this.phone,
              "idEnt": this.code,
              "name": this.name,
              "bankNo": this.bankCode,
              "funding": this.funding,
              "bankPhone": this.phone,
              "orderNo": this.orderNo,
              "idPerson": this.idPerson,
              "personId": this.idPerson,
            })
              .then(res => {
                if (res.code == "sc0" || res.code == "0") {
                  this.sendStatus = true;
                  this.transactionCode = res.data
                  this.vTime = setInterval(this.calcTime, 1000);
                } else {
                  this.toast(res.message);
                }
                this.lockBtn = false
              }).catch((err) => {
              this.lockBtn = false
            });
          }
        } else {
          this.toast("请输入手机号码");
        }
      },
      // 短信倒计时
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
      // 去选择银行卡页面
      toSelectCard() {
        this.$router.push({path: '/bankcard-list'})
      },
      // 获取协议
      async getAgreements() {
        const res = await this.$api.getAgreements();
        if (res.code === 'sc0') {
          if (res.data.length) {
            this.linkArr = res.data.map(item => {
              return {
                title: item.protocolElucidation,
                url: item.protocolUrl
              }
            })
          }
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
        }
      },
      // 获取银行列表
      getBankList(from) {
        return new Promise(async resovle => {
          const res = await this.$api.getUsableBankList();
          if (res.code === "sc0") {
            const arr = res.data.map((item, index) => {
              return {
                index,
                val: item.dicName
              }
            });
            this.bankList = arr;
            resovle()
          } else if (from) {
            this.$toast({
              message: res.message,
              duration: 3000,
              position: 'bottom',
            });
          }
        })
      },
      // 获取授信需要银行卡信息
      getBankcardInfo() {
        if (this.bankInfo) {
          this.name = this.bankInfo.bankPerson
          this.code = this.bankInfo.ident || this.$route.query.ident
          this.bankCode = this.bankInfo.bankNo
          this.bankType = this.bankInfo.bankName
          this.phone = this.bankInfo.bankPhone
          this.funding = this.$route.query.name
        } else {
          this.name = this.$route.query.userName ? decodeURI(this.$route.query.userName) : ""
          this.code = this.$route.query.ident
          this.bankCode = this.$route.query.bankNo
          this.bankType = this.$route.query.bankName ? decodeURI(this.$route.query.bankName) : ""
          this.phone = this.$route.query.bankPhone
          this.funding = this.$route.query.name
        }
      },

      // 提交表单
      async submitForm() {
        if (this.lockSubmit) return
        if (!(this.checkName() &&
          this.checkCode() &&
          this.checkBankCode() &&
          this.checkPhone() && this.checkAgreement() && this.checkVcode())) {
          return;
        }
        this.lockSubmit = true
        const param = {
          "idEnt": this.code,
          "name": this.name,
          "bankNo": this.bankCode,
          "funding": this.funding,
          "bankPhone": this.phone,
          "smsCode": this.vCode,
          "orderNo": this.orderNo,
          "bankName": this.bankType,
          "transactionCode": this.transactionCode
        }
        const res = await this.$api.fundingbind(param);
        if (res.code === 'sc0') {
          this.$router.replace({path: '/e-guide-examine-direct', query: {"orderNo": this.orderNo}})
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
        }
        this.lockSubmit = false
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "src/style/index.scss";

  .base-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: $bg-color-main;
    .base-info-warn {
      flex-shrink: 0;
      height: 0.78rem;
      line-height: 0.78rem;
      padding: 0 0.3rem;
      color: $color-gray;
      font-size: 0.24rem;
    }
    .base-info-form {
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
              @include bg-image("../../../image/icon-camera");
            }
            &.form-icon-bank {
              @include bg-image("../../../image/icon-bank");
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
    .base-info-btn {
      display: flex;
      flex-direction: column;
      width: calc(100% - 0.6rem);
      margin: 0.3rem;
      flex-shrink: 0;
      button {
        @extend %btn;
        height: 0.92rem;
        @include bg-image("../../../image/bg-btn");
        &:active {
          @include bg-image("../../../image/bg-btn-active");
        }
      }
      p {
        text-align: center;
        margin: 0.3rem 0 0.1rem;
        font-size: 0.24rem;
        color: $color-main;
        a {
          color: $color-gold;
          &:visited {
            color: $color-gold;
          }
          span {
            color: $color-gray;
          }
        }
      }
      .protocol-item {
        height: auto;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import "src/style/mint.scss";
</style>
