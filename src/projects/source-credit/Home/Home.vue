<template>
<div class="credit-login">
  <div class="content-main">
    <p class="tips">尾号{{tailNum}}用户成功提现<span>{{money}}</span>元</p>
    <div class="form-box">
      <div class="inp-label">
        <i class="icon icon-id"></i>
        <input class="inp" v-model="phone" type="text" maxlength="11" placeholder="填写手机号领取额度">
      </div>
      <div class="inp-label">
        <i class="icon icon-code"></i>
        <input class="inp" v-model="smsCode" type="text" maxlength="6" placeholder="填写手机号验证码">
        <span class="bnt" @click="getVeriCode">{{codeContent}}</span>
      </div>
      <label class="term-label">
        <input class="check-box" type="checkbox" v-model="agreeMsg">
        <i class="icon-cb"></i>同意<a class="col" style="color: #696969" href="http://3c.dafysz.cn/h5/sales/index.html#/CommonQK/URProtocol">《爱用商城》</a>注册协议
      </label>
      <p class="bnt-bg" @click="checkSmsLogin">立即拿钱</p>
      <p class="ud-txt">今日提现人数：<span class="col">{{personNum}}人</span></p>
    </div>
  </div>
  <div class="footer"></div>
</div>
</template>
<script>
function sum(m, n) {
  return Math.floor(Math.random() * (m - n) + n);
}
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
export default {
  components: {
  },
  data(){
    return{
      personNum:2321,
      tailNum:4591,
      money:3000,
      codeContent: "获取验证码",
      lockSend: false,
      timer: 60, // 倒计时计数器
      time: "",
      initalState: false, // 获取验证码案件初始状态
      countDownState: false, // 倒计时输入验证码状态
      phone: '',
      smsCode: '',
      agreeMsg: true,
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
      ucAccountId: state => state.global.userInfo.ucAccountId,
      clientCode: state => state.global.clientCode,
      source: state => state.global.source,
    }),
    ...mapState('credit',{
      creditStep: state => state.creditStep,
    }),
  },
  async created() {
    this.goNext();
  },
  mounted(){
    // 设置渠道号
    if (this.$route.query.source){
      this.setSource(this.$route.query.source)
    } else {
      this.setSource('AYQ_H5')
    }
    this.getPersonNum();
    this.getRandomNum();
  },
  methods:{
    ...mapActions('global',['setUserId', 'setToken', 'updateUserInfo', 'setSource']),
    ...mapActions('credit',['setCreditStep']),
    goLink(url) {
      // 跳转页面
      this.$router.push(url);
    },
    goNext(){
      // 登录后跳转判断
      if(this.userId && this.personId){
        this.getCreditStep();
      }
      if(this.userId && !this.personId){
        this.goLink('/baseInfo');
      }
    },
    getPersonNum(){
      // 随机获取今日人数
      this.personNum = new Date().getDay() + new Date().getMonth() + new Date().getFullYear() - 1000 + new Date().getHours();
    },
    getRandomNum(){
      // 随机展示提现成功信息
      setTimeout(() => {
        let endNo = Math.floor(Math.random() * 10000)
        if (endNo < 1000) {
          endNo ='0' + endNo.toString();
        }
        this.tailNum = endNo;
        this.money = sum(10, 200) * 100;
        this.getRandomNum();
      }, 3000);
    },
    // 获取验证码
    async getVeriCode() {
      if (this.lockSend) {
        return;
      }
      if (!this.checkPhone()) {
        let param = {
          codeType: 'login',
          phone: this.phone,
        };
        let res = await this.$api.sendSMSCodetHttp(param);
        if (res.code === 'sc0') {
          this.lockSend = true;
          this.time = setInterval(this.countDown, 1000);
        } else {
          this.$messagebox({
            title: "提示",
            message: "短信下发失败"
          });
        }
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
    // 校验手机号
    checkPhone() {
      const reg = /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/;
      return !reg.test(this.phone);
    },
    async checkSmsLogin(){
      // 登录或注册
      if (this.checkPhone()) {
        return this.$toast("请填写有效手机号");
      } else if (!this.smsCode) {
        return this.$toast("请输入正确的验证码");
      } else if (!this.agreeMsg) {
        return this.$toast("请阅读并同意协议");
      }
      const param = {
        mobile: this.phone,
        smsCode: this.smsCode,
        source: this.source || null,
      };
      const res = await this.$api.h5smsLogintHttp(param);
      if (res.code === "sc0") {
        this.setUserId(res.data.userId);
        this.setToken(res.data.token);
        await this.updateUserInfo({userId: res.data.userId, idPerson: 0});
        this.goNext();
      }
      else{
        this.$toast({
          message: res.message,
          position: "bottom"
        });
      }
    },
    async getCreditStep(){
      // 获取当前授信进度
      const param = {
        idPerson: this.personId,
        userId: this.userId,
        product: 'AMFT'
      };
      await this.setCreditStep(param);
      console.log(this.creditStep);
      let path = '';
      switch (this.creditStep.activeStatus) {
        case 0:
          // 视频认证
          path = '/liveAc';
          break;
        case 10:
        case 20:
        case 30:
        case 40:
          // 身份认证
          path = '/identityAc';
          break;
        case 50:
          // 个人信息
          path = '/personInfo';
          break;
        case 60:
          // 银行卡信息
          path = '/bankInfo';
          break;
        case 70:
          // 等待授信结果
        case 1000:
        case 1100:
          // 授信结束
          path = '/creditResult';
          break;
        case 1400:
          this.$toast('当前用户已绑定账号，不可重复申请。');
          break;
      }
      this.goLink(path);
    }
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss" scoped>
.credit-login{
  width: 100%;
  min-height: 100%;
  height: inherit;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  // background-size: 100% 100%;
  .content-main{
    width: 100%;
    height: 11.9rem;
    // min-height: 100%;
    background: url(./../images/page-bg@2x.png) top left no-repeat;
    background-size: 100% auto;
    box-sizing: border-box;
    flex-shrink: 0;
    padding: 3.57rem 0.4rem 0 0.4rem;
    .tips{
      width: 100%;
      height: 0.6rem;
      line-height: 0.6rem;
      background: rgba($color: #ffffff, $alpha: .4);
      text-align: center;
      overflow: hidden;
      border-radius: 0.6rem;
      color: #fff;
      font-size: 0.28rem;
      letter-spacing: 1px;
      span{
        color: #FFEF40;
        font-size: 0.3rem;
      }
    }
    .form-box{
      width: 100%;
      padding: 0.77rem 0.28rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      .inp-label{
        width: 5.8rem;
        height: 0.92rem;
        border: 1px solid #828282;
        border-radius: 0.1rem;
        padding: 0 0.24rem;
        margin-bottom: 0.3rem;
        display: flex;
        align-items: center;
        .icon{
          width: 0.44rem;
          height: 0.44rem;
          flex-shrink: 0;
          background: center no-repeat;
          background-size: 100% 100%;
        }
        .icon-id{
          background-image: url(./../images/icon-id@2x.png);
        }
        .icon-code{
          background-image: url(./../images/icon-code@2x.png);
        }
        .inp{
          width: 100%;
          height: 100%;
          padding: 0.1rem;
          line-height: 0.8rem;
          border: 0;
          background: 0;
          font-size: 0.3rem;
        }
        .bnt{
          width:1.7rem;
          height: 0.5rem;
          flex-shrink: 0;
          background: #FE6536;
          color: #fff;
          text-align: center;
          line-height: 0.54rem;
          font-size: 0.24rem;
          border-radius: 0.5rem;
          overflow: hidden;
        }
      }
      .term-label{
        font-size: 0.22rem;
        color: #686868;
        line-height: 0.22rem;
        input{
          display: none;
        }
        .icon-cb{
          width: 0.26rem;
          height: 0.26rem;
          display: inline-block;
          vertical-align: middle;
          background: url(./../images/check@2x.png) center no-repeat;
          background-size: 100% 100%;
          margin: -0.05rem 0.1rem 0 0;
        }
        input[type="checkbox"]:checked + .icon-cb{
          background-image: url(./../images/checkbox-cheked@2x.png);
        }
      }
      .bnt-bg{
        width: 6.12rem;
        height: 1.18rem;
        text-align: center;
        line-height: 1.2rem;
        background: url(./../images/bnt-bg@2x.png) center no-repeat;
        background-size: 100% 100%;
        color: #fff;
        font-size: 0.4rem;
        font-weight: bold;
        margin: 0.17rem 0 0.25rem 0;
      }
      .ud-txt{
        color: #686868;
        font-size: 0.28rem;
        line-height: 0.3rem;
        .col{
          color:#F43D56;
        }
      }
    }
    .bnt1{
      width: 100%;
    }
  }
  .footer{
    width: 100%;
    height: 100%;
    background: url(./../images/under-bg@2x.png) top center no-repeat;
    background-size: 100% 100%;
  }
}
</style>


