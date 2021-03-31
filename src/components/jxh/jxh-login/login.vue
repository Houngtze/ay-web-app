<template>
  <div class="page-layout">
    <div class="page-header">
      <h1>注册/登陆</h1>
    </div>
    <div class="form-box">
      <mt-field label="手机号" type="tel" :attr="{ maxlength: 11,minlength: 11 }" placeholder="请输入手机号码" v-model="phone"></mt-field>
      <mt-field label="验证码" type="tel" :attr="{ maxlength: 6, minlength: 6 }" placeholder="请输入验证码" v-model="smsCode" class="code-input">
        <label @click="getVeriCode" class="send-code">{{codeContent}}</label>
      </mt-field>
      <!-- 收不到验证码提示 -->
      <codeTips :msgId="msgId" isService="1" />
    </div>
    <div class="page-footer">
      <div class="login-btn">
        <button :disabled="!isPhoneComplete || !isSmsCodeComplete" @click="checkSmsLogin">注册/登陆</button>
      </div>
      <label class="term-label">
        <input class="check-box" type="checkbox" v-model="agreeMsg">
        <i class="icon-cb"></i>我已阅读并同意
        <template v-if="term.length > 3">
          <span @click="popupVisible = true">《注册等相关协议》</span>
          <!-- 协议弹框 -->
          <term-popup :popupVisible.sync="popupVisible" :term="term" title="协议"></term-popup>
        </template>
        <template v-else>
          <a v-for="(item, index) in term" :key="index" :href="item.link" class="col">
            <template v-if="index > 0">&</template>
            {{item.name}}
          </a>
        </template>
      </label>
    </div>
  </div>

</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import {Toast} from 'mint-ui';
  import {redirectToLoginPage} from '@/helpers/utils';
  import codeTips from '@component/jxh/components/codeTips'
  import termPopup from '@component/jxh/components/termPopup'

  export default {
    components: {codeTips, termPopup},
    props: ["termArr"],
    data() {
      return {
        codeContent: "获取",
        lockSend: false,
        timer: 60, // 倒计时计数器
        time: "",
        initalState: false, // 获取验证码案件初始状态
        countDownState: false, // 倒计时输入验证码状态
        phone: '',
        smsCode: '',
        agreeMsg: true,
        msgId: null,
        popupVisible: false,  // 协议popup
        term: [
          {name: "《注册协议》", link: "http://3c.dafysz.cn/h5/sales/#/JXH/JXHUserRegisterAgreement"},
          {name: "《隐私政策》", link: "http://3c.dafysz.cn/h5/sales/#/JXH/JXHPrivacyPolicy"}
        ]
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        clientCode: state => state.global.clientCode,
        source: state => state.global.source,
      }),
      isPhoneComplete(){
        return this.checkPhone()
      },
      isSmsCodeComplete() {
        return this.checkSmsCode()
      }
    },
    mounted() {
      // 设置渠道号
      if (this.$route.query.source) {
        this.setSource(this.$route.query.source)
      } else {
        this.setSource('JXH_CREDIT_H5')
      }
      if (this.termArr) this.term = [...this.term, ...this.termArr]
    },
    methods: {
      ...mapActions('global', ['setUserId', 'setToken', 'updateUserInfo', 'setSource']),
      // 显示协议列表
      showTermPopup() {

      },
      goLink(url) {
        // 跳转页面
        this.$router.replace(url);
      },
      // 获取验证码
      async getVeriCode() {
        if (this.lockSend) {
          return;
        }
        if (this.checkPhone()) {
          let param = {
            smsType: "login",
            phone: this.phone
          };
          let res = await this.$api.JXHsendSmsCode(param);
          if (res.code === '0') {
            this.lockSend = true;
            this.time = setInterval(this.countDown, 1000);
            this.msgId = (res.data && res.data.msgId) || ""
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
          this.codeContent = this.timer + "s";
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
        return reg.test(this.phone);
      },
      // 校验短信码
      checkSmsCode() {
        const reg = /^\d{6}$/
        return reg.test(this.smsCode)
      },
      async checkSmsLogin() {
        // 登录或注册
        if (!this.checkPhone()) {
          return this.$toast("请填写有效手机号");
        } else if (!this.checkSmsCode()) {
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
          this.$emit("onActiveLogin")
        }
        else {
          this.$toast({
            message: res.message,
            position: "bottom"
          });
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "src/style/mint.scss";
  .page-layout {
    width: 100%;
    height: 100%;
    min-height: inherit;
    background-color: #fff;
  }

  .page-header {
    padding: .1rem .32rem;
    h1 {
      font-size: .6rem;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(54, 54, 54, 1);
      line-height: .84rem;
      margin: 0;
    }
  }

  .form-box {
    padding: .6rem .32rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    /deep/ .mint-field {
      width: 100%;
      height: 1rem;
    }
    /deep/ .mint-cell-wrapper {
      background-image: none;
      border-bottom: .01rem solid #E9E9E9;
      padding: 0;
      .mint-cell-title{
        width: auto;
        margin-right: .32rem;
      }
      .mint-cell-value input::placeholder {
        color: #D9D9D9;
      }
      label.send-code {
        display: inline-block;
        width: 1.2rem;
        height: .6rem;
        line-height: .6rem;
        background: rgba(252, 244, 231, 1);
        border-radius: .3rem;
        font-size: .26rem;
        color: rgba(186, 153, 80, 1);
        text-align: center;
        margin-left: .32rem;
      }
    }
    /deep/ .tips{
      text-align: left;
      padding: .32rem .32rem 0 0;
    }
  }

  .page-footer {
    text-align: center;
    padding: 0 .32rem;
    .login-btn {
      width: 100%;
      height: 0.88rem;
      text-align: center;
      margin: 0 0 .4rem 0;
      button {
        -webkit-appearance: none;
        border: none;
        font-size: .32rem;
        color: #fff;
        width: 6.84rem;
        height: .88rem;
        line-height: .88rem;
        border-radius: .44rem;
        background: rgba(186, 153, 80, 1);
        &[disabled="disabled"] {
          background-color: #ddd;
        }
      }
    }
    .term-label {
      font-size: 0.26rem;
      color: #A8A8A8;
      line-height: 0.22rem;
      text-align: left;
      display: block;
      line-height: 1.5;
      a{
        color: #696969;
        display: inline;
      }
      input {
        display: none;
      }
      .icon-cb {
        width: 0.26rem;
        height: 0.26rem;
        display: inline-block;
        vertical-align: middle;
        background: url(./images/checkbox-cheked.png) center no-repeat;
        background-size: 100% 100%;
        margin: -0.05rem 0.1rem 0 0;
      }
      input[type="checkbox"]:checked + .icon-cb {
        background-image: url(./images/check.png);
      }
    }
  }
</style>


