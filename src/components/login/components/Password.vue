<template>
  <div class="psw-view">
    <div class="inp-bar">
      <input class="inp-phone" v-model="phone" type="tel" placeholder="请输入手机号码" maxlength="11" minlength="11" />
      <input class="inp-pws" v-model="psw" type="password" placeholder="请输入8~20位字母、数字组成的密码" />
    </div>
    <footer class="footer-btn">
      <button :disabled="disabled" @click="pwdLogin">立即登录</button>
      <span>提示：密码找回，请下载“爱用商城”APP</span>
    </footer>
  </div>
</template>
<script>
import md5 from 'md5';
import {mapActions} from 'vuex';
import env from '@/helpers/env';
export default {
  props: ['disabled'],
  data() {
    return {
      phone: null,
      psw: null
    }
  },
  methods: {
    ...mapActions('global',['setUserId', 'setToken', 'updateUserInfo']),
    // 校验手机号
    checkPhone() {
      const reg = /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/;
      return reg.test(this.phone)
    },
    // 校验密码
    checkPwd() {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/
      return reg.test(this.psw)
    },
    async pwdLogin() {
      if (!this.checkPhone()) {
        this.$toast("请输入有效的手机号码");
        return
      } else if (!this.checkPwd()) {
        this.$toast("请输入8-16位数字、字母组合密码");
        return
      }
      const param = {
        password: md5(this.psw),
        mobile: this.phone
      }
      let res
      if (env.isJXHLink()) {
        res = await this.$api.JXHpasswordLogin(param);
      } else {
        res = await this.$api.loginWithPwd(param);
      }
      if (res.code === 'sc0' || res.code === '0') {
        this.setUserId(res.data.userId)
        this.setToken(res.data.token)
        await this.updateUserInfo({userId: res.data.userId, idPerson: 0})
        const PAGE_ENTRY = window.location.href;
        if (PAGE_ENTRY && (PAGE_ENTRY.includes('jyc-xjd') || PAGE_ENTRY.includes('jxh'))) {
          this.$router.replace('/home');
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
  }
}
</script>
<style lang="scss" scoped>
@import '../style/extend.scss';
.psw-view{
  .inp-bar{
    @extend %inp-bar;
  }
  .footer-btn{
    @extend %footer-btn;
  }
}
</style>

