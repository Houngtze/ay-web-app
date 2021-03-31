<template>
  <div class="page-register">
    <p class="check-txt">测一测您能贷多少？</p>
    <img class="banner" src="./images/check.png">
    <div class="form-box">
      <p class="fb-tt">验证码登录</p>
      <div class="fb-li"><input type="text" v-model="phone" maxlength="11" placeholder="手机号"></div>
      <div class="fb-li">
        <input type="text" v-model="smsCode" maxlength="6" placeholder="验证码">
        <p class="code-bnt" @click="getVeriCode">{{codeContent}}</p>
      </div>
      <p class="fb-bnt" @click="checkSmsLogin">立即开通</p>
      <p class="trem">
        <label>
          <input v-model="agreeMsg" type="checkbox"><i></i>我已阅读并同意
        </label>
        <span class="link" @click="linkTap('http://aiyong.dafysz.cn/terms/ayq-register.html')">《爱有钱注册协议》</span>
      </p>
    </div>
  </div>
</template>
<script>
import env from "@/helpers/env";
import {mapState, mapActions} from "vuex";
export default {
  data() {
    return {
      codeContent: "获取验证码",
      lockSend: false,
      timer: 60, // 倒计时计数器
      time: "",
      initalState: false, // 获取验证码案件初始状态
      countDownState: false, // 倒计时输入验证码状态
      phone: '',
      smsCode: '',
      agreeMsg: true,
    };
  },
  created() {
  },
  methods: {
    ...mapActions('global/sign', ['updateBaseSignStatus']),
    linkTap(url){
      window.location.href = url;
    },
    // 校验手机号
    checkPhone() {
      const reg = /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/;
      return !reg.test(this.phone);
    },
    // 获取验证码
    getVeriCode() {
      if (this.lockSend) {
        return;
      }
      if (!this.checkPhone()) {
        this.$api.codeSuperMarketHttp({
          codeType: "ayqRegType",
          phone: this.phone
        })
        .then(res => {
          if (!res.$isSuccess) {
            this.$messagebox({
              title: "提示",
              message: "短信下发失败"
            });
          } else {
            this.lockSend = true;
            this.time = setInterval(this.countDown, 1000);
          }
        });
      } else {
        this.$messagebox({
          title: "提示",
          message: "请输入有效的电话的号码"
        });
      }
    },
    // 倒计时
    countDown() {
      if (this.timer > -1) {
        this.initalState = true;
        this.countDownState = true;
        this.codeContent = "重新发送(" + this.timer + "s)";
        this.timer--;
      } else {
        this.lockSend = false;
        this.initalState = false;
        this.reSendCode = true;
        this.countDownState = false;
        this.timer = 60;
        this.codeContent = "重新发送";
        clearInterval(this.time);
      }
    },
    async checkSmsLogin(){
      if (this.checkPhone()) {
        return this.$toast("请填写有效手机号");
      } else if (!this.smsCode) {
        return this.$toast("请输入正确的验证码");
      } else if (!this.agreeMsg) {
        return this.$toast("请阅读并同意协议");
      }
      const param = {
        phone: this.phone,
        codeType: "ayqRegType",
        code: this.smsCode,
        source: this.$route.query.source || null,
      };
      const res = await this.$api.codeCheckSuperMarketHttp(param);
      if (res.code === "sc0") {
        this.updateBaseSignStatus(res.data.userInfo);
        this.linkUrl('/sm-supermarket');
      }
      else{
        this.$toast({
          message: res.message,
          position: "bottom"
        });
      }
    },
    linkUrl(url){
      this.$router.push(url);
    }
  }
};
</script>
<style lang="scss" scoped>
.page-register{
  color: #363636;
  background: #fff;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0.3rem;
  box-sizing: border-box;
  .check-txt{
    text-align: center;
    font-size: 0.7rem;
    font-weight: bold;
    line-height: 1rem;
    margin-top: 0.3rem;
  }
  .banner{
    display: block;
    width: 100%;
    height: auto;
  }
  .form-box{
    width: 100%;
    margin: 0.8rem 0;
    box-sizing: border-box;
    padding: 0.4rem 0.45rem;
    border-radius: 0.1rem;
    box-shadow: 0 0 0.2rem #ccc;
    .fb-tt{
      font-size: 0.36rem;
      font-weight: bold;
      line-height: 0.5rem;
      margin-bottom: 0.4rem;
    }
    .fb-li{
      width: 100%;
      height: 0.9rem;
      overflow: hidden;
      display: flex;
      background: #f3f3f3;
      border-radius: 0.1rem;
      margin-bottom: 0.3rem;
      align-items: center;
      input{
        background: none;
        border: none;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0.2rem;
      }
      .code-bnt{
        width: 1.9rem;
        height: 0.3rem;
        line-height: 0.3rem;
        text-align: center;
        flex-shrink: 0;
        border-left: 0.005rem solid #5277DF;
        color: #5277DF;
      }
      .sending{
        color: #999999;
        border-left-color: #999999;
      }
    }
    .fb-bnt{
      width: 100%;
      height: 0.92rem;
      line-height: 0.92rem;
      border-radius: 0.1rem;
      color: #fff;
      background: #5277DF;
      font-size: 0.36rem;
      text-align: center;
      margin: 0.1rem 0 0.55rem 0;
    }
    .trem{
      text-align: center;
      line-height: 0.3rem;
      input[type="checkbox"]{
        display: none;
      }
      input[type="checkbox"]+i{
        width: 0.29rem;
        height: 0.29rem;
        vertical-align: middle;
        display: inline-block;
        background: center no-repeat;
        background-size: 100% 100%;
        background-image: url(./images/checkbox.png);
        margin: -0.05rem 0.1rem 0 0;
      }
      input[type="checkbox"]:checked + i{
        background-size: 115% 115%;
        background-image: url(./images/select@2x.png);
      }
      .link{
        color: #5277DF;
      }
    }
  }
}
</style>

