<template>
  <div class="page-layout">
    <div class="page-content">
      <div class="banner">
        <div class="scroll-view">
          <ul :class="{transition}">
            <li v-for="(item, index) in list" :key="index">{{item}}</li>
          </ul>
        </div>
      </div>
      <div class="register">
        <mt-field type="text" label="姓名" :attr="{ maxlength: 11,minlength: 2 }" v-model="form.name"
                  placeholder="请输入您本人姓名"></mt-field>
        <mt-field type="text" label="身份证号码" :attr="{ maxlength: 18,minlength: 15 }" v-model="form.identityCard"
                  placeholder="请输入您的身份证号码"></mt-field>
        <mt-field type="tel" label="手机号" :attr="{ maxlength: 11,minlength: 11 }" v-model="form.phone"
                  placeholder="请输入手机号码"></mt-field>
        <mt-field type="tel" label="手机验证码" :attr="{ maxlength: 6, minlength: 6 }" v-model="form.smsCode"
                  placeholder="请输入验证码">
          <label @click="getVeriCode" class="send-code">{{codeContent}}</label>
        </mt-field>
        <!-- <div class="agree-check">
          <label class="agree-checkbox"><input type="checkbox" v-model="agreeMsg"/><i></i></label>
          <span>您已阅读并同意 <label>《爱用商城协议》</label>及<label @click="showRuleDialog">《免费领取保险协议》</label></span>
        </div> -->
        <div class="register-button">
          <button @click="publicDoRegister">马上提现</button>
          <p class="content-des">
            <span>可提现</span>
            <span>额度高</span>
            <span>放款快</span>
          </p>
        </div>
        <div class="apply-content">
          <h3>申请流程</h3>
          <div class="progress" flex-row-between>
            <div class="item">
              <img src="./images/icon1.png">
              <p>输入个人信息</p>
            </div>
            <div class="arrow">
              <img src="./images/arrow.png">
            </div>
            <div class="item">
              <img src="./images/icon2.png">
              <p>系统测试额度</p>
            </div>
            <div class="arrow">
              <img src="./images/arrow.png">
            </div>
            <div class="item">
              <img src="./images/icon3.png">
              <p>完成提现</p>
            </div>

          </div>
          <h3>温馨提示</h3>
          <div class="apply-desc">
            <p>1. 点击“马上提现”即代表您同意<a href="http://aiyong.dafysz.cn/terms/user-registration-protocol.html">《爱用商城注册协议》</a>。</p>
            <p>2.成功提交业务申请，表示您同意领取最高100万出行意外险赠险服务且阅读并同意<a href="http://aiyong.dafysz.cn/sale-m/18090500-zq.html#/intro-detail">《保障内容和相关赠险协议》</a>。</p>
          </div>
        </div>
      </div>
    </div>
    <!-- <RuleDialog :isVisible.sync="showRuleDialogVisible"/> -->
  </div>
</template>
<script>
import env from "@/helpers/env";
import { linkTap } from '@/helpers/utils'

function sum (m,n){
　return Math.floor(Math.random()*(m - n) + n);
}
export default {
  data() {
    return {
      form: {
        phone: "", // 手机号码
        name: "", // 姓名
        smsCode: "", // 验证码
        identityCard: "" // 身份证
      },
      agreeMsg: true,
      timer: 60, // 倒计时计数器
      time: "",
      codeContent: "获取验证码",
      initalState: false, // 获取验证码案件初始状态
      countDownState: false, // 倒计时输入验证码状态
      reSendCode: true, // 重新发送验证码
      lockSend: false,
      showRuleDialogVisible: false,
      sourceCode: null,
      list:[],
      transition: false,
      type: 'kd',
      urlList: [
        {
          type: 'kd',
          url: 'https://microservice.wacai.com/loan/stream/UY9LN1?af=LW25QKSCKHDQLC'
        },{
          type: 'gh',
          url: 'https://shop.haiercash.com/static/gh/page/gouhua.html?source=qianshang_16&td_channelid=qianshang_16'
        }
      ]

    };
  },
  created() {
    this.sourceCode = this.$route.query.source || '';
    if (this.$route.query.type) this.type = this.$route.query.type
    this.init()
  },
  methods: {
    init() {
      let list = [this.getMessage(), this.getMessage()]
      this.list = list
      setInterval(() => {
        setTimeout(() => {
          let list = this.list;
          list.shift()
          list.push(this.getMessage())
          this.transition = false
        },1000)
        this.transition = true
      },2000)
    },
    getMessage() {
      let arr = [135, 136, 137, 138, 139, 147, 130, 131, 132, 155, 156]
      const startNo = arr[parseInt(10*Math.random())]
      let endNo = Math.floor(Math.random()*10000)
      if(endNo<1000){
        endNo+=1000;
      }
      return `${startNo}****${endNo} 成功借款${sum(1,6)*5000}元`
    },
    // 检验姓名
    checkName() {
      const reg = /^([\u4e00-\u9fa5]|[\u4e00-\u9fa5]·){2,}$/;
      return !reg.test(this.form.name);
    },
    // 检验身份证
    checkCode() {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      return !reg.test(this.form.identityCard);
    },
    // 校验手机号
    checkPhone() {
      const reg = /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/;
      return !reg.test(this.form.phone);
    },
    // 获取验证码
    getVeriCode() {
      if (this.lockSend) {
        return;
      }
      if (!this.checkPhone()) {
        this.$api
          .sendSMSCodeLimit({
            codeType: "getTravelInsurances",
            phone: this.form.phone
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
    showRuleDialog() {},
    async publicDoRegister() {
      if (this.checkName()) {
        return this.$toast("请填写有效姓名");
      } else if (this.checkCode()) {
        return this.$toast("请填写有效身份证号");
      } else if (this.checkPhone()) {
        return this.$toast("请填写有效手机号");
      } else if (!this.form.smsCode) {
        return this.$toast("请输入正确的验证码");
      }
      let source = `AYQ_H5_${this.sourceCode}`;
      const param = {
        source,
        identityCard: this.form.identityCard,
        name: this.form.name,
        mobile: this.form.phone,
        userAgent: navigator.userAgent,
        smsCode: this.form.smsCode,
        newChannel: 'newChannel'
      };
      const res = await this.$api.h5ActiveRegist(param);
      if (res.code === "sc0") {
        // window.location.href = "https://microservice.wacai.com/loan/stream/UY9LN1?af=LW25QKSCKHDQLC";
        const data = this.urlList.find(item => {
          if (item.type === this.type)
          return item
        })
        linkTap(data.url)
        return;
      }
      this.$toast({
        message: res.message,
        position: "bottom"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page-layout {
  background: #f2f2f2;
  height: 100%;
}
.banner {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 5.22rem;
  text-align: center;
  background-image: url('./images/banner.png');
  background-size: 100%;
  .scroll-view{
    display: flex;
    width: 4.5rem;
    height: 0.48rem;
    overflow: hidden;
    justify-content: center;
    background:rgba(129,134,255,1);
    border-radius:24px;
    margin-bottom: 0.3rem;
    ul{
      &.transition{
        transition-duration: 1s;
        transition-timing-function:ease;
        margin-top: -0.48rem;
      }
      li{
        height: 0.48rem;
        line-height: 0.48rem;
        color: #ffffff;
        font-size: 0.24rem;
        text-align: center;
      }
    }
  }
}

.page-content {
  background-color: #fff;
  width: 100%;
  padding-bottom: 0.3rem;
}
.register {
  /deep/ .mint-cell-title{
    span{
      font-size: 0.3rem;
      color: #222;
      font-weight: 500;
    }
  }
  /deep/ .mint-cell {
    width: 100%;
    border-radius: 0.5rem;
    padding: 0 0.3rem;
    position: relative;
    input{
      font-size: 0.3rem;
    }
    ::-webkit-input-placeholder{
      color: #999;
    }
    .mint-cell-wrapper{
      padding: 0;
      border-bottom: 0.01rem solid #f3f3f3;
    }
  }
  /deep/ .mint-field-other {
    & label {
      display: inline-block;
      padding: 0.1rem 0.15rem;
      font-size: 0.25rem;
      border: 1px solid #999;
      color: #999;
      margin-left: 0;
    }
  }
  .send-code{
    border:0.01rem solid rgba(153,153,153,1);
    border-radius: 0.08rem;
  }
}

.agree-check {
  padding-top: 0.5rem;
  color: #363636;
  text-align: center;
  p {
    font-weight: 600;
    margin-bottom: 5px;
  }
  span {
    font-size: 0.2rem;
  }
  span a {
    color: #fff;
  }
  & span label {
    color: #3d6ba3;
  }
}

.agree-check {
  text-align: center;
  color: #a8a8a8;
  font-size: 0.2rem;
  margin-top: 0.3rem;
}

.agree-check input[type="checkbox"] {
  visibility: hidden;
  position: absolute;
  z-index: 100000;
  touch-action: none;
}
.agree-check input[type="checkbox"]:checked + i,
.agree-check label i {
  display: inline-block;
  width: 15px;
  height: 15px;
  text-align: center;
  line-height: 15px;
  color: #fff;
  vertical-align: middle;
  margin: -2px 5px 1px 0px;
  border: 0;
  touch-action: none;
}

.agree-check input[type="checkbox"] + i {
  background: url("images/checkbox.png");
  background-repeat: no-repeat;
  background-size: 100%;
}

.agree-check input[type="checkbox"]:checked + i {
  background: url("./images/checked.png");
  background-repeat: no-repeat;
  background-size: 100%;
}
.register > p {
  margin: 0.5rem 5%;
  padding-left: 16px;
  font-size: 16px;
  font-weight: 600;
}
.register-button {
  margin: 0.56rem 0 0.9rem;
  text-align: center;
  & button {
    border: none;
    -webkit-appearance: none;
    background-color: transparent;
    background-image: url("./images/button.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #fff;
    width: 6.24rem;
    height: 1.44rem;
    font-size: 0.3rem;
    padding: 0 0 0.15rem 0;
    border-radius: 0.4rem;
  }
  .content-des{
    width: 100%;
    padding: 0 1.6rem;
    font-size: 0.26rem;
    color: #a8a8a8;
    display: flex;
    justify-content: center;
    span{
      margin-right: 0.3rem;
      &:nth-last-child(){
        margin-right: 0;
      }
      &::before{
        content: '';
        display: inline-block;
        height: 0.25rem;
        width: 0.25rem;
        margin-right: 0.1rem;
        background-image: url('./images/icon-tick@2x.png');
        background-size: 0.25rem;
        vertical-align: text-top;
      }
    }
  }
}
.apply-content {
  & h3 {
    text-align: center;
    font-size: 0.3rem;
    padding-bottom: 0.3rem;
    font-size:0.3rem;
    font-weight:500;
    color:rgba(54,54,54,1);
  }
  & .progress {
    padding-left: 0.65rem;
    padding-right: 0.65rem;
    margin-bottom: 0.88rem;
    div.item {
      font-size: 0.22rem;
      text-align: center;
      & p {
        white-space: nowrap;
        margin-top: 0.18rem;
        width: 1.44rem;
      }
      & img {
        width: 0.81rem;
        height: 0.81rem;
      }
    }
    div.arrow {
      align-self: flex-start;
      margin-top: 0.25rem;
      & img {
        width: 0.41rem;
      }
    }
  }
  & .apply-desc {
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
    background-color: transparent;
    background-image: url("./images/desc-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    & p {
      font-size: 0.24rem;
      color:rgba(54,54,54,1);
      margin-bottom: 0.2rem;
      a{
        color: inherit;
      }
    }
  }
}
</style>

