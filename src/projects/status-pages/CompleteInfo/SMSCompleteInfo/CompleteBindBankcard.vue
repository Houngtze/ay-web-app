<template>
  <div class="base-info">
    <div class="base-info-warn">
      <span>订单就快完成啦，请绑定你的还款银行卡</span>
    </div>
    <div class="base-info-form">
      <ul>
        <li>
          <label>姓名</label>
          <input type="text" disabled v-model="nameConceal" placeholder="请填写您的姓名">
        </li>
        <li>
          <label>身份证号</label>
          <input type="text" disabled maxlength="18" v-model="identConceal" placeholder="请填写您的身份证号">
        </li>
        <li>
          <label>银行卡号</label>
          <input type="text" disabled maxlength="19" v-model="bankCodeConceal" placeholder="请填写您的银行卡号">
        </li>
        <li>
          <label>所属银行</label>
          <input type="text" disabled v-model="bankType" placeholder="请填写您的银行卡所属银行">
        </li>
        <li>
          <label>手机号码</label>
          <input type="tel" v-model="bankPhoneConceal" maxlength="11" placeholder="请输入银行预留手机号">
        </li>
        <li>
          <label>验证码</label>
          <input type="tel" v-model="vCode" maxlength="6" placeholder="请输入手机验证码">
          <span class="base-info-checekcode" v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
          <span class="base-info-checekcode" v-else>重新获取<i v-if="timer > -1">{{timer}}s</i></span>
        </li>
      </ul>
      <p class="warn">该银行卡作为您的默认还款银行卡，分期成功后我们将按照规定的还款时间从该银行进行扣款。</p>
      <div class="term" v-if="funding && funding === 'MIME'">
        <label><input type="checkbox" v-model="termStatic"><i class="icon"></i>本人已阅读并同意</label>
        <span @click="popupVisible = true">《银行卡代扣协议》</span>
      </div>
    </div>
    <div class="base-info-btn">
      <button @click="submitForm">提交</button>
    </div>

    <mt-popup class="term-list" v-model="popupVisible" position="bottom">
      <div class="tt">
        <p class="txt">协议</p>
        <i class="close" @click="popupVisible=false"></i>
      </div>
      <ul class="" v-if="linkArr">
        <li v-for="(item ,index) in linkArr" :key="index" @click="goLink(item.url)">《{{item.title}}》<i class="arrow"></i></li>
      </ul>
    </mt-popup>
  </div>
</template>
<script>

  export default {
    data() {
      return {
        name: null, // 姓名
        ident: null, // 身份证
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
        termStatic: true,
        popupVisible: false,
        orderNo: null,
        ActiveInfo: null,
        agreementCheck: true,
        transactionCode: null, // 短信验证码序列号
        identConceal: null, // 脱敏的身份证号(反显用)
        nameConceal: null,  // 脱敏的姓名(反显用)
        bankPhoneConceal: null, // 脱敏的手机号(反显用)
        bankCodeConceal: null // 脱敏的银行卡号(反显用)
      };
    },
    async created() {
      if (this.$route.query.code) this.code = this.$route.query.code
      this.getAgreements()
      this.getBankcardInfo()
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
      // 获取协议
      async getAgreements() {
        const res = await this.$api.getBindAgreement({
          channel: '4',
          group: 'AYQ_BSBK'
        });
        if (res.code === 'sc0') {
          if (res.data.length) {
            this.linkArr = res.data[0].chiId.map(item => {
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
              "idEnt": this.ident,
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
      // 获取银行名称
      async getBankName(code) {
        console.log(code)
        const param = {
          bankNo: code
        }
        const res = await this.$api.getBankName(param);
        if (res.code === 'sc0') {
          this.bankType = res.data.bankName;
        }
      },
      // 获取授信需要银行卡信息
      async getBankcardInfo() {
        // 获取风控结果
        const param = {
          code: this.code,
          channel: "H5"
        }
        const res = await this.$api.patchApply(param);
        if (res.code === 'sc0') {
          const type = res.data.type.toString()
          /*  type
          *  判断跳转类型
          *  状态（0开户，1受托，2绑卡）
          * */
          if (type === "2") {
            this.name = res.data.name
            this.ident = res.data.ident
            this.bankCode = res.data.bankCode
            this.phone = res.data.bankPhone
            this.funding = res.data.funding
            this.identConceal = res.data.identConceal
            this.nameConceal = res.data.nameConceal
            this.bankPhoneConceal = res.data.bankPhoneConceal
            this.bankCodeConceal = res.data.bankCodeConceal
            this.orderNo = res.data.orderNo
            // 银行卡获取是哪家银行
            this.getBankName(res.data.bankCode)
          }
        } else {
          this.$toast(res.message)
        }
      },
      // 提交表单
      async submitForm() {
        if (!(this.checkPhone() && this.checkVcode())) {
          return;
        }
        const param = {
          "idEnt": this.ident,
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
          this.$router.replace({path: '/complete-result'})
        } else {
          this.$toast(res.message)
        }
      },
      // 跳转链接
      goLink(url) {
        if (url) window.location.href = url
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
              @include bg-image("../../image/icon-camera");
            }
            &.form-icon-bank {
              @include bg-image("../../image/icon-bank");
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
        @include bg-image("../../image/bg-btn");
        &:active {
          @include bg-image("../../image/bg-btn-active");
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
  .term{
    text-align: center;
    font-size: 0.24rem;
    margin: 0;
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
        background: url(../../image/check.png) center no-repeat;
        background-size: 100% 100%;
      }
      input:checked + .icon{
        background-image: url(../../image/checkbox.png);
      }
    }
    span{
      color: #D09E54;
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
        background: url(../../image/close@2x.png) center no-repeat;
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
        background: url(../../image/rower@2x.png) center no-repeat;
        background-size: 100% auto;
        margin-left: 0.2rem;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import "src/style/mint.scss";
</style>
