<template>
  <SalePageLayout>
    <div class="credit-login">
      <div class="content-main">
        <img class="header" v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/jxh-loan/channel-syx-bg-1.png'">
        <div class="form-box">
          <div class="inp-label">
            <input class="inp" v-model="phone" type="tel" maxlength="11" placeholder="请输入手机号">
          </div>
          <div class="inp-label">
            <input class="inp" v-model="smsCode" type="tel" maxlength="6" placeholder="请输入短信验证码">
            <span class="bnt" @click="getVeriCode">{{codeContent}}</span>
          </div>
          <p class="bnt-bg" @click="checkSmsLogin">注册/登录</p>
          <label class="term-label">
            <input class="check-box" type="checkbox" v-model="agreeMsg">
            <i class="icon-cb"></i>我已阅读并同意
            <a class="col" style="color: #696969" href="http://3c.dafysz.cn/h5/sales/#/JXH/JXHUserRegisterAgreement">
              《吉享花注册协议》
            </a>
            注册协议
          </label>
        </div>
        <img class="footer" v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/jxh-loan/channel-syx-bg-3.png'">
      </div>
    </div>
  </SalePageLayout>

</template>
<script>
function sum(m, n) {
  return Math.floor(Math.random() * (m - n) + n);
}
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import SalePageLayout from '@/components/SalePageLayout'
export default {
  components: {
    SalePageLayout
  },
  data(){
    return{
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
      this.setSource('JXH_CREDIT_H5')
    }
  },
  methods:{
    ...mapActions('global',['setUserId', 'setToken', 'updateUserInfo', 'setSource']),
    ...mapActions('credit',['setCreditStep']),
    goLink(url) {
      // 跳转页面
      this.$router.replace(url);
    },
    goNext(){
      // 登录后跳转判断
      if (this.userId) {
        this.getCreditStep();
      }
    },
    // 获取验证码
    async getVeriCode() {
      if (this.lockSend) {
        return;
      }
      if (!this.checkPhone()) {
        let param = {
          smsType: "login",
          phone: this.phone
        };
        let res = await this.$api.JXHsendSmsCode(param);
        if (res.code === '0') {
          this.lockSend = true;
          this.time = setInterval(this.countDown, 1000);
        } else {
          this.$toast("短信下发失败");
        }
      } else {
        this.$toast("请输入有效的电话号码");
      }
    },
    // 倒计时
    countDown() {
      if (this.timer > -1) {
        this.initalState = true;
        this.countDownState = true;
        this.codeContent = "(" + this.timer + "s)";
        this.timer--;
      } else {
        this.lockSend = false;
        this.initalState = false;
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
        phone: this.phone,
        smsType: "login",
        smsCode: this.smsCode
      };
      const res = await this.$api.JXHsmsLogin(param);
      if (res.code === "0") {
        this.setUserId(res.data.userId);
        await this.updateUserInfo({userId: res.data.userId, idPerson: 0})
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
        accountId: this.ucAccountId
      };
      await this.setCreditStep(param);
      if(!this.creditStep) {
        return false
      }
      let path = '';
      switch (this.creditStep.status) {
        case 0:
        case 10:
        case 20:
        case 30:
          // 身份认证
          path = '/identityAc';
          break;
        case 40:
          // 视频认证
          path = '/liveAc';
          break;
        case 50:
          // 个人信息
          path = '/personInfo';
          break;
        case 70:
          // 等待授信结果
        case 1000:
          // 授信结束
          path = 'jxh-loan';
          break;
        case 1100:
          // 授信结束
          path = '/creditResult';
          break;
      }
      if (path === 'jxh-loan') {
        window.location.href = window.location.origin + '/custom-page/jxh-loan/#/home?urlSource=JXH_XJFQ'
      } else {
        this.goLink(path);
      }
    }
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss" scoped>
.credit-login{
  width: 100%;
  .content-main{
    width: 100%;
    & > img{
      width: 100%;
      max-height: 7.73rem;
      display: block;
    }
    .footer{
      height: 7.26rem;
    }
    .form-box{
      width: 100%;
      height: 6.09rem;
      padding: 1.5rem 1.14rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      background-image: url("http://static.ali.szqk-tech.com/images/custom-page/jxh-loan/channel-syx-bg-2.png");
      background-size: 100% 100%;
      .inp-label{
        width: 5.2rem;
        min-height: 0.94rem;
        border-radius: 0.1rem;
        padding: 0 0 0 .24rem;
        margin-bottom: 0.3rem;
        display: flex;
        align-items: center;
        font-size: .32rem;
        background:rgba(240,236,233, .8);
        color: #9E9E9E;
        .inp{
          width: 100%;
          height: 100%;
          padding: 0.1rem;
          line-height: 0.8rem;
          border: 0;
          background: 0;
          font-size: 0.3rem;
          &::placeholder{
            color: #9E9E9E;
          }
        }
        .bnt{
          width: 2rem;
          color: #ff8643;
          text-align: center;
          font-size: 0.3rem;
          flex-shrink: 0;
          overflow: hidden;
          padding-left: .23rem;
          padding-right: .24rem;
          border-left: 1px solid rgba(204,204,204,1);
        }
      }
      .term-label{
         font-size: 0.2rem;
         color: #686868;
         line-height: 0.22rem;
        text-align: left;
         input{
           display: none;
         }
         .icon-cb{
           width: 0.26rem;
           height: 0.26rem;
           display: inline-block;
           vertical-align: middle;
           background: url(./../images/checkbox-cheked.png) center no-repeat;
           background-size: 100% 100%;
           margin: -0.05rem 0.1rem 0 0;
         }
         input[type="checkbox"]:checked + .icon-cb{
           background-image: url(./../images/check.png);
         }
       }
      .bnt-bg{
        text-align: center;
        width:3.86rem;
        min-height: .76rem;
        background:linear-gradient(90deg,rgba(254,171,69,1),rgba(255,134,67,1));
        border-radius:38px;
        background-size: 100% 100%;
        color: #fff;
        font-size: 0.32rem;
        line-height: .76rem;
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
}
</style>


