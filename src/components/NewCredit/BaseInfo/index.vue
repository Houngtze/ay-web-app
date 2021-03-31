<template>
  <div class="base-info">
    <div class="base-info-warn">
      <span>需要您完成实名认证，请填写本人真实信息</span>
      <!-- <img src="" ref="show"> -->
    </div>
    <div class="base-info-form">
      <ul>
        <li>
          <label>姓名</label>
          <input type="text" v-model="name" @blur="checkName" placeholder="请填写您的姓名">
        </li>
        <li>
          <label>身份证号</label>
          <input type="text" maxlength="18" v-model="code" @blur="checkCode" placeholder="请填写您的身份证号">
        </li>
        <li>
          <label>银行卡号</label>
          <input type="text" maxlength="19" v-model="bankCode" @blur="checkBankCode" placeholder="请填写您的银行卡号">
          <i class="form-icon-code" @click="openUpload"></i>
          <input type="file" accept="image/*" capture="camera" @change="fileVal" ref="imgUpload" style="display: none">
        </li>
        <li>
          <label>所属银行</label>
          <input type="text" disabled v-model="bankType" placeholder="请选择所属银行">
          <i class="form-icon-bank" @click="openPop"></i>
        </li>
        <li>
          <label>手机号码</label>
          <input type="text" v-model="phone" maxlength="11" placeholder="请输入银行预留手机号">
        </li>
        <li>
          <label>验证码</label>
          <input type="text" v-model="vCode" maxlength="6" placeholder="请输入手机验证码">
          <span class="base-info-checekcode" v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
          <span class="base-info-checekcode" v-else>重新获取<i v-if="timer > -1">{{timer}}s</i></span>
        </li>
      </ul>
      <span class="warn">录入身份信息仅作为认证使用，不作其他用途，请放心输入</span>
    </div>
    <div class="base-info-btn">
      <button @click="submitForm">提交</button>
      <!-- <p>认证通过后，您可免费领取出行意外险赠险服务</p>
      <p><span class="checkbox" :class="{checked: protocol.isDefault}" @click="changeStatus()"></span>本人已阅读并同意<a :href="protocol.protocolUrl">{{protocol.protocolElucidation}}</a></p> -->
    </div>
    <picker-pop
      :slotArr="bankList"
      @handleValue="handleValue"
      ref="pickerPop">
    </picker-pop>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
// import { credit } from '@/services/api'
import PickerPop from "../components/PickerPop";
import {imgCompression} from '@/helpers/utils'
export default {
  components: {
    PickerPop,
  },
  data() {
    return {
      name: null, // 姓名
      code: null, // 身份证
      bankCode: null, // 银行卡
      bankType: null, //银行类型
      phone: null, // 手机号
      vCode: null, // 验证码
      vMessage: "获取验证码",
      timer: 60, // 倒计时
      vTime: null, // 倒计时计时器
      sendStatus: false, // 验证码发生状态
      bankList: [], // 银行列表
      slots: [],
      // protocol: []
    };
  },
  computed: {
    ...mapState({
      userId: state => state.global.userInfo.userId,
      ucAccountId: state => state.global.userInfo.ucAccountId,
      idPerson: state =>state.global.userInfo.idPerson,
    })
  },
  created() {
    // this.getAgreement();
    this.getBankList();
  },
  methods: {
    ...mapActions('global', ['setIdPerson','updateUserInfo']),
    // 获取银行列表
    getBankList(from) {
      return new Promise(async resovle => {
        const res = await this.$api.credit.getUsableBankList();
        if (res.code === "sc0") {
          const arr = res.data.map((item, index) => {
            return {
              index,
              val: item.dicName
            }
          });
          this.bankList = arr;
          resovle()
        } else if(from){
          this.$toast({
            message: res.message,
            duration: 3000,
            position: 'bottom',
          });
        }
      })
    },
    // 获取协议
    // async getAgreement() {
    //   const param = {
    //     channel: '4',
    //     group: 'KLBX'
    //   }
    //   const res = await this.$api.credit.getAgreement(param)
    //   if (res.code === 'sc0') {
    //     this.protocol = res.data[0].chiId[0]
    //   }
    // },
    // changeStatus() {
    //   if (this.protocol.isDefault === 0) {
    //     this.protocol.isDefault = 1
    //   } else {
    //     this.protocol.isDefault = 0
    //   }
    // },
    checkVal(reg, val) {
      // 当值存在，才正则
      if (val) {
        return reg.test(val);
      } else {
        return true;
      }
    },
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
        if(ev) ev.target.focus();
        this.toast("请填写真实姓名");
        return false;
      }
      return true;
    },
    // 检验身份证
    checkCode(ev) {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!this.checkVal(reg, this.code)) {
        if(ev) ev.target.focus();
        this.toast("请输入有效的身份证号");
         return false;
      }
      return true;
    },
    // 校验银行卡号
    checkBankCode(ev) {
      const reg = /(^\d{15,19}$)/g;
      if (!this.checkVal(reg, this.bankCode)) {
        if(ev) ev.target.focus();
        this.toast("请输入有效的银行卡号");
        return false;
      }
      this.getBankName(this.bankCode)
      return true;
    },
    // 获取银行名称
    async getBankName(code) {
      if (!code) return;
      const param = {
        bankNo: code
      }
      const res = await this.$api.credit.getBankName(param);
      if (res.code === 'sc0') {
        this.bankType = res.data.bankName;
      }
    },
    // 校验手机号
    checkPhone(ev) {
      const reg = /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/;
      if (!this.checkVal(reg, this.phone)) {
        if(ev) ev.target.focus();
        this.toast("请输入有效的手机号码");
        return false;
      }
      return true;
    },
    // 校验验证码
    checkVcode(ev) {
      const reg = /^\d{6}$/;
      if (!this.checkVal(reg, this.vCode)) {
        if(ev) ev.target.focus();
        this.toast("请按正确格式输入验证码");
      }
    },
    async getVcode() {
      if (!this.name) {
        this.toast("请填写您的姓名");
        return
      } else if(!this.code) {
        this.toast("请填写您的身份证号");
        return
      } else if(!this.bankCode) {
        this.toast("请填写有效的银行卡号");
        return
      }
      if (this.phone && this.phone.length == 11) {
        if (this.checkPhone()) {
          const res = await this.$api.base.SendSmsCode({
            codeType: "realName",
            phone: this.phone,
            // codeType 为 realName 时，必传四要素
            idEnt: this.code,
            bankNo: this.bankCode,
            name: this.name,
          })
          if (res.code === 'sc0') {
            this.sendStatus = true;
            this.vTime = setInterval(this.calcTime, 1000);
          } else {
            this.toast("短信下发失败!");
          }
        }
      } else {
        this.toast("请输入手机号码");
      }
    },
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
    // 提交表单
    async submitForm() {
      // if (this.protocol.isChoose) {
      //   if (!this.protocol.isDefault) {
      //     this.toast("请阅读并勾选协议");
      //     return;
      //   }
      // }
      if (!this.name) {
        this.toast("请填写您的姓名");
        return
      } else if(!this.code) {
        this.toast("请填写您的身份证号");
        return
      } else if(!this.bankCode) {
        this.toast("请填写有效的银行卡号");
        return
      } else if(!this.bankType) {
        this.toast("请选择所属银行");
        return
      } else if(!this.phone) {
        this.toast("请填写手机号码");
        return
      } else if(!this.vCode) {
        this.toast("请填写验证码");
        return
      }
      const param = {
        bankNo: this.bankCode,
        ident: this.code,
        name: this.name,
        phone: this.phone,
        smsCode: this.vCode,
        ucAccountId: this.ucAccountId,
        userId: this.userId
      };
      const res = await this.$api.credit.realAuthen(param);
      if (res.code === 'sc0') {
        // 更新idPerson
        this.setIdPerson(res.data.idPerson);
        // 进入活体检测页面
        const idPerson = res.data.idPerson || 0
        await this.updateUserInfo({userId: this.userId, idPerson});
        let returnUrl='/liveAc';
        if(this.$route.query.rtUrl){
          returnUrl =  this.$route.query.rtUrl;
        }
        this.$router.replace({ path: returnUrl });
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },
    // 选择银行
    handleValue(val) {
      this.bankType = val;
    },
    // 打开银行Pop
    async openPop() {
      if (this.bankList.length === 0) {
        await this.getBankList(true)
      }
      this.$refs.pickerPop.open();
    },
    // 上传图片
    openUpload() {
      this.$refs.imgUpload.click();
    },
    async fileVal(ev) {
      let file = ev.target.files[0];
      file = await imgCompression(file);
      let formData=new FormData();
      formData.append('file',file);
      formData.append('name','bankCard');
      formData.append('channel','H5');
      formData.append('product','AMFT');
      formData.append('userId',this.userId);
      const res = await this.$api.credit.fileUpload(formData);
      if (res.code === 'sc0'){
        this.bankCode = res.data.bankNo
        this.getBankName(this.bankCode)
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },
  }
};
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
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
            @include bg-image("../image/icon-camera");
          }
          &.form-icon-bank {
            @include bg-image("../image/icon-bank");
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
          border-left: 0.03rem solid $bd-color-main;
          i {
            display: inline;
            list-style: none;
            color: $color-gray;
          }
        }
      }
    }
    .warn{
      height: 0.78rem;
      line-height: 0.78rem;
      padding: 0 0.3rem;
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
      @include bg-image("../image/bg-btn");
      &:active {
        @include bg-image("../image/bg-btn-active");
      }
    }
    p{
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0.1rem;
      font-size: 0.24rem;
      color: $color-main;
      .checkbox{
        display: block;
        height: 0.28rem;
        width: 0.28rem;
        margin-right: 0.12rem;
        flex-shrink: 0;
        @include bg-image("../image/icon-check");
        background-size: 100%;
        &.checked {
          @include bg-image("../image/icon-checked");
        }
      }
      a {
        color: $color-gold;
        &:visited {
          color: $color-gold;
        }
        span{
          color: $color-gray;
        }
      }
    }
    .protocol-item{
      height: auto;
    }
  }
}
</style>
