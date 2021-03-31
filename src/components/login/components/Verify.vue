<template>
  <div class="verify-view">
    <div class="inp-bar">
      <input v-model="phone" class="inp-phone" type="tel" placeholder="请输入手机号码" maxlength="11" minlength="11" />
      <div class="verify-bar">
        <input v-model="verifyCode" class="inp-verify" type="tel" maxlength="6" minlength="6" placeholder="请输入验证码" />
        <span v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
        <span v-else>重新获取<span v-if="timer > -1">{{timer}}s</span></span>
      </div>
    </div>
    <footer class="footer-btn">
      <button :disabled="disabled" @click="smsLogin">立即登录</button>
      <span>提示：未注册的手机号码将自动注册为新用户</span>
    </footer>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import env from '@/helpers/env';
export default {
  props: ['disabled'],
  data() {
    return {
      phone: null,
      verifyCode: null,
      vMessage: "获取验证码",
      timer: 60, // 倒计时
      vTime: null, // 倒计时计时器
      sendStatus: false, // 验证码发生状态
    }
  },
  computed: {
    ...mapState({
      source: state => state.global.source
    })
  },
  methods: {
    ...mapActions('global',['setUserId', 'setToken', 'updateUserInfo']),
    // 校验手机号
    checkPhone() {
      const reg = /^(1[3-9])\d{9}$/;
      return reg.test(this.phone)
    },
    async getVcode() {
      if (this.checkPhone()) {
        const param = {
          codeType: "regH5Type",
          smsType: "login",
          phone: this.phone
        }
        let res
        if (env.isJXHLink()) {
          res = await this.$api.JXHsendSmsCode(param)
        } else {
          res = await this.$api.SendSmsCode(param)
        }

        if (res.code === 'sc0' || res.code === '0') {
          this.sendStatus = true;
          this.vTime = setInterval(this.calcTime, 1000);
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          });
        }
      } else {
        this.$toast("请输入有效的手机号码");
      }
    },
    calcTime() {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.vTime);
        this.vTime = null
        this.sendStatus = false;
        this.timer = 60;
        this.vMessage = "重新发送";
      }
    },
    async smsLogin() {
      if (!this.checkPhone()) {
        this.$toast("请输入有效的手机号码");
        return
      } else if(!(this.verifyCode && this.verifyCode.length === 6)) {
        this.$toast("请输入正确的验证码");
        return
      }
      const param = {
        mobile: this.phone,
        phone: this.phone,
        codeType: this.verifyCode,
        smsCode: this.verifyCode,
        source: this.source,
        smsType: "login",
        sendStatus: '1'
      }
      let res
      if (env.isJXHLink()) {
        res = await this.$api.JXHsmsLogin(param);
      } else {
        res = await this.$api.loginWithSms(param);
      }
      if (res.code === '0' || res.code === '0') {
        this.setUserId(res.data.userId)
        this.setToken(res.data.token)
        await this.updateUserInfo({userId: res.data.userId, idPerson: 0})
        const PAGE_ENTRY = window.location.href;
        if (PAGE_ENTRY && (PAGE_ENTRY.includes('jyc-xjd')|| PAGE_ENTRY.includes('jxh'))) {
          this.$router.push('/home');
        } else {
          this.$router.back()
        }
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    }
  },
  beforeDestroy() {
    if(this.vTime) clearInterval(this.vTime);
  }
}
</script>
<style lang="scss" scoped>
@import '../style/extend.scss';
.verify-view{
  .inp-bar{
    @extend %inp-bar;
    .verify-bar{
      display: flex;
      border-bottom: 0.01rem solid $bd-color-main;
      span{
        flex-shrink: 0;
        margin-top: 0.3rem;
        line-height: 0.98rem;
        font-size: 0.3rem;
        color: $color-gold;
      }
    }
  }
  .footer-btn{
    @extend %footer-btn;
  }
}
</style>
