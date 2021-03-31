<template>
<div class="gold-more">
  <div class="gold-content">
    <div class="top-tt p-padding dis-flex">
      <p class="tt flex-all">会员礼包</p>
      <p class="detail" @click="linkUrl('/golddetail')">详情 >></p>
    </div>
    <div class="p-banner">
      <img v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/promote-tool/GoldMore-banner.png'">
    </div>
    <div class="p-server p-padding">
      <p class="p-tt">服务年限</p>
      <div class="c-radio dis-flex">
        <p :class="years === 1 ? 'selected' : ''" @click="years = 1">一年</p>
        <p :class="years === 2 ? 'selected' : ''" @click="years = 2">二年</p>
        <p :class="years === 3 ? 'selected' : ''" @click="years = 3">三年</p>
      </div>
    </div>
    <mt-field type="text" label="服务金额" v-model="transactionAmount"
                placeholder="请输入金额"></mt-field>
    <div class="p-info">
      <p class="tt p-padding">
        <span class="sp-l">个人信息</span>
        <span class="sp-r">请输入本人真实信息</span>
      </p>
      <div class="register">
        <mt-field type="text" label="姓名" :attr="{ maxlength: 11,minlength: 2 }" v-model="form.name"
                  placeholder="请输入您的姓名"></mt-field>
        <mt-field type="text" label="身份证号码" :attr="{ maxlength: 18,minlength: 15 }" v-model="form.identityCard"
                  placeholder="请输入您本人身份证号"></mt-field>
        <mt-field type="tel" label="手机号" :attr="{ maxlength: 11,minlength: 11 }" v-model="form.phone"
                  placeholder="请输入您本人手机号"></mt-field>
        <mt-field type="tel" label="验证码" :attr="{ maxlength: 6, minlength: 6 }" v-model="form.smsCode"
                  placeholder="填写手机验证码">
          <label @click="getVeriCode" class="send-code">{{codeContent}}</label>
        </mt-field>
      </div>
    </div>
    <div class="mark">
      <label class="check-st"><input type="checkbox" v-model="agreeMsg"/><i></i>您已阅读并同意</label><span @click="linkTap('http://aiyong.dafysz.cn/terms/gold-more.html')">《商城特权礼包服务协议》</span>
    </div>
  </div>
  <div class="bot-sub">
    <p class="price"><span>&yen;</span>{{transactionAmount}}</p>
    <p class="bnt" @click="publicDoRegister">立即购买</p>
  </div>
</div>
</template>
<script>
import {mapState, mapActions} from "vuex";

function sum (m,n){
　return Math.floor(Math.random()*(m - n) + n);
}
export default {
  data() {
    return {
      years: 1, // 1 : 一年 ， 2 ： 二年 ， 3 ： 三年
      form: {
        phone: "", // 手机号码
        name: "", // 姓名
        smsCode: "", // 验证码
        identityCard: "" ,// 身份证
        price: "" ,// 服务金额
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
      ],
      transactionAmount: '',
    };
  },
  created() {
    this.sourceCode = this.$route.query.source || '';
  },
  methods: {
      ...mapActions('global/sign', ['updateBaseSignStatus']),
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
    // 校验服务金额
    checkPrice() {
      const reg = /^[1-9]*[1-9][0-9]*$/;
      return !reg.test(this.transactionAmount);
    },
    // 获取验证码
    getVeriCode() {
      if (this.lockSend) {
        return;
      }
      if (!this.checkPhone()) {
        this.$api
          .sendSMSCodeLimit({
            codeType: "regType",
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
      if (this.checkPrice()) {
        return this.$toast("请填写有效服务金额");
      } else if (this.checkName()) {
        return this.$toast("请填写有效姓名");
      } else if (this.checkCode()) {
        return this.$toast("请填写有效身份证号");
      } else if (this.checkPhone()) {
        return this.$toast("请填写有效手机号");
      } else if (!this.form.smsCode) {
        return this.$toast("请输入正确的验证码");
      } else if (!this.agreeMsg) {
        return this.$toast("请阅读并同意协议");
      }
      const param = {
        status: this.years,
        type:'carInsurance',
        phone: this.form.phone,
        certNo: this.form.identityCard,
        name: this.form.name,
        code: this.form.smsCode,
        chachannel:'JDDSC',
        amount: this.transactionAmount,
        codeType: 'regType',
      };
      const res = await this.$api.storageHttp(param);
      if (res.code === "sc0") {
        // this.updateBaseSignStatus(res.data);
        this.linkUrl('/goldcode');
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
    },
    linkTap(url){
      window.location.href = url;
    }
  }
};
</script>
<style lang="scss" scoped>
.gold-more{
  // display: flex;
  width: 100%;
  // height: 100%;
  overflow: hidden;
  // flex-direction: column;
  background: #f2f2f2;
  color: #363636;
  padding-bottom: 1rem;
  .gold-content{
    // height: 100%;
    // width: 100%;
    // overflow-x: hidden;
    // overflow-y: auto;
    position: relative;
    z-index: 1;
  }
  .bot-sub{
    width: 100%;
    height: 0.98rem;
    // flex-shrink: 0;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2;
    background: #fff;
    display: flex;
    overflow: hidden;
    .bnt{
      width: 3rem;
      height: 0.98rem;
      line-height: 0.98rem;
      background: #D09E54;
      text-align: center;
      color: #fff;
      font-size: 0.32rem;
      flex-shrink: 0;
    }
    .price{
      width: 100%;
      line-height: 0.98rem;
      padding: 0 0.35rem;
      color: #F63337;
      font-size: 0.4rem;
      font-weight: 500;
      span{
        font-size: 0.26rem;
      }
    }
  }
  /deep/ .mint-cell-wrapper{
    padding: 0 0.3rem;
  }
}
.top-tt{
  height: 0.78rem;
  background:#fff;
  p{
    line-height: 0.78rem;
  }
  .detail{
    flex-shrink: 0;
    color: #D0A058;
    font-size: 0.24rem;
  }
  .tt{
    font-size: 0.32rem;
    font-weight: bold;
  }
}
.p-banner{
  img{
    display: block;
  }
}
.p-server{
  background: #fff;
  overflow: hidden;
  .p-tt{
    font-size: 0.3rem;
    line-height: 0.7rem;
  }
  .c-radio{
    justify-content: space-between;
    margin: 0.1rem 0;
    p{
      width: 2.1rem;
      height: 0.6rem;
      text-align: center;
      line-height: 0.6rem;
      font-size: 0.24rem;
      background: #f9f9f9;
      border-radius: 0.1rem;
    }
    .selected{
      color: #D09E54;
      background: #FFFAEF;
      border:0.01rem solid #D09E54;
    }
  }
}
.p-info{
  background: #fff;
  margin-top: 0.18rem;
  .tt{
    height: 0.8rem;
    line-height: 0.8rem;
    border-bottom: 0.01rem solid #e5e5e5;
    .sp-l{
      display: inline-block;
      vertical-align: middle;
      width: 105px;
      font-size: 0.32rem;
      font-weight: bold;
    }
    .sp-r{
      font-size: 0.24rem;
    }
  }
}
.mark{
  margin: 0.35rem;
  text-align: center;
  color: #A8A8A8;
  font-size: 0.24rem;
  line-height: 0.3rem;
  .check-st{
    input[type="checkbox"]{
      visibility: hidden;
      position: absolute;
      z-index: 100000;
      touch-action: none;
    }
    input[type="checkbox"]+i{
      display: inline-block;
      width: 0.28rem;
      height: 0.28rem;
      text-align: center;
      line-height: 0.28rem;
      color: #fff;
      vertical-align: middle;
      border: 0;
      touch-action: none;
      margin: -0.02rem 0.1rem 0 0;
    }
    input[type="checkbox"] + i {
      background: url("./images/checkbox.png");
      background-repeat: no-repeat;
      background-size: 100%;
    }

    input[type="checkbox"]:checked + i {
      background: url("./images/checked.png");
      background-repeat: no-repeat;
      background-size: 100%;
    }
  }
}
.dis-flex{
  display: flex;
}
.p-padding{
  padding: 0 0.3rem;
}
.flex-all{
  width: 100%;
}
.register{
  .send-code{
    color: #D09E54;
    font-size: 0.3rem;
    padding-left: 0.3rem;
    border-left: 0.01rem solid #D09E54;
  }
  .line{
    border-bottom: 0.01rem solid #e5e5e5;
    margin-left: 10px;
    height: 0.05rem;
  }
}
</style>

