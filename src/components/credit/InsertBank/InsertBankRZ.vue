<template>
  <div class="instert-bank">
    <div class="instert-bank-form">
      <ul>
        <li>
          <label>银行卡号</label>
          <input type="text" maxlength="21" v-model="bankCode" @blur="checkBankCode" placeholder="请填写您的银行卡号">
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
          <span class="instert-bank-checekcode" v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
          <span class="instert-bank-checekcode" v-else>重新获取<i v-if="timer > -1">{{timer}}s</i></span>
        </li>
      </ul>
    </div>
    <div class="insert-bank-footer">
      <protocol-item
        :linkArr="linkArr"
        @handleStatus="handleStatus">
      </protocol-item>
      <div class="insert-bank-btn">
        <button :disabled="!checked" @click="submitForm">提交</button>
      </div>
    </div>
    <picker-pop
      :slotArr="bankList"
      @handleValue="handleValue"
      ref="pickerPop">
    </picker-pop>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PickerPop from "../components/PickerPop";
import ProtocolItem from '../components/ProtocolItem'
import {imgCompression} from '@/helpers/utils'
export default {
  components: {
    ProtocolItem,
    PickerPop
  },
  data() {
    return {
      checked: true,
      linkArr: [{
        title: '《银行代扣协议》',
        url: 'http://aiyong.dafysz.cn/terms/account-authoritzation.html'
      }],
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
    }
  },
  computed: {
    ...mapState({
      // 'isSign': state => state.global.sign.isSign,
      userId: state => state.global.userInfo.userId,
      ucAccountId: state => state.global.userInfo.ucAccountId,
      idPerson: state => state.global.userInfo.idPerson,
      name:state => state.global.userInfo.name,
      ident:state => state.global.userInfo.ident,
    })
  },
  created() {
    if (!this.idPerson) {
      // this.$router.replace({path: '/base'})
    }
    this.getBankList();
  },
  methods: {
    // 融资担保新增银行卡 2019-10-22
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
    // 校验银行卡号
    checkBankCode(ev) {
      const reg = /(^\d{15,19}$)/g;
      if (!this.checkVal(reg, this.bankCode)) {
        if (ev) ev.target.focus();
        this.toast("请输入有效的银行卡号");
        return false;
      }
      this.getBankName(this.bankCode)
      return true;
    },
    // 获取银行名称
    async getBankName(code) {
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
        ev.target.focus();
        this.toast("请按正确格式输入验证码");
      }
    },
    async getVcode(val) {
      if (this.phone && this.phone.length == 11) {
        if (this.checkPhone()) {
          const res = await this.$api.base.SendSmsCode({
            phone: this.phone,              //String18374787057手机号码
            userId: this.userId,            //Number1用户Id
            idEnt: this.ident,              //String身份证
            bankNo: this.bankCode,   //String银行卡号
            bankName: this.bankType,//String银行名称
            name: this.name, //String姓名
            funding: this.$route.query.funding,                  //String资金方: BS
            personId: this.idPerson,        //StringpersonId
            orderNo: this.$route.query.orderNo,//String订单号
            codeType: 'XJD',                //String短信类型 ： XJD
          })
          if (res.code === 'sc0') {
            this.sendStatus = true;
            this.vTime = setInterval(this.calcTime, 1000);
          } else if(res.code === 'sc-4001'){
            this.toast("您填写的银行卡已绑定，无需重复操作");
          } else {
            this.toast("短信下发失败");
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
    handleStatus(val) {
      this.checked = val
    },
    // 提交表单
    async submitForm() {
      if (!this.bankCode) {
        this.toast("请填写有效的银行卡号");
        return
      } else if (!this.bankType) {
        this.toast("请选择所属银行");
        return
      } else if (!this.phone) {
        this.toast("请填写手机号码");
        return
      } else if (!this.vCode) {
        this.toast("请填写验证码");
        return
      }
      const param = {
        bankNo: this.bankCode,
        ident: this.ident,
        name: this.name,
        phone: this.phone,
        smsCode: this.vCode,
        ucAccountId: this.ucAccountId,
        userId: this.userId,
        funding: this.$route.query.funding,
      };
      const res = await this.$api.credit.addCreditBankCard(param);
      if (res.code === 'sc0') {
        // 退回上一页
        let backUrl = '/bankInfo';
        if(this.$route.query.bu){
          backUrl = this.$route.query.bu;
        }
        this.$router.replace({path: backUrl});
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },

  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
.instert-bank{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .instert-bank-form{
    height: 100%;
    width: 100%;
    @extend %form;
    ul{
      li{
        i{
          display: block;
          height: 0.46rem;
          width: 0.46rem;
          flex-shrink: 0;
          background-size: 0.40rem;
          background-position: center;
          background-repeat: no-repeat;
          &.form-icon-code{
            @include bg-image('../image/icon-camera');
          }
          &.form-icon-bank{
            @include bg-image('../image/icon-bank');
          }
        }
        .instert-bank-checekcode{
          display: block;
          height: 0.5rem;
          line-height: 0.5rem;
          width: 2rem;
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
  }
  .insert-bank-footer{
    flex-shrink: 0;
    /deep/ .protocol-item{
      height: auto;
    }
    .insert-bank-btn{
      width: calc(100% - 0.6rem);
      height: 0.92rem;
      margin: 0.3rem;
      button{
        @extend %btn;
        @include bg-image('../image/bg-btn');
        &:active{
          @include bg-image('../image/bg-btn-active');
        }
      }
    }

  }
}
</style>
