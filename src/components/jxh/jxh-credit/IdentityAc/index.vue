<template>
  <div class="identity-ac">
    <progress-bar :index=1></progress-bar>
    <div class="content">
      <!-- 上传身份证 -->
      <div class="identity-block">
        <p class="warn">请使用本人身份证进行申请，否则将申请失败</p>
        <div class="id-upload-block">
          <div class="full-face upload-item">
            <div class="id-status" @click="handleUpload('idCardFront')">
              <img src="../image/id-front.png" ref="idCardFrontImg">
              <p>
                <label v-show="idFrontStatus"></label>
                <span>{{ idFrontStatus ? "已完成拍摄人像面" : "点击拍摄人像面" }}</span>
              </p>
            </div>
            <input type="file" accept="image/*" capture="camera" @change="uploadIdCardFront" ref="idCardFront">
          </div>
          <div class="reverse upload-item">
            <div class="id-status" @click="handleUpload('idCardBack')">
              <img src="../image/id-back.png" ref="idCardBackImg">
              <p>
                <label v-show="idBackStatus"></label>
                <span>{{ idBackStatus ? "已完成拍摄国徽面" : "点击拍摄国徽面" }}</span>
              </p>
            </div>
            <input type="file" accept="image/*" capture="camera" @change="uploadIdCardBack" ref="idCardBack">
          </div>
        </div>
      </div>
      <!-- 身份证信息 -->
      <div class="id-info-block">
        <div class="info-item">
          <mt-field label="姓名" v-model="name" placeholder="请填写您的姓名"></mt-field>
          <span class="edit"></span>
        </div>
        <div class="info-item">
          <mt-field label="身份证号" v-model="ident" placeholder="请填写您的身份证号"></mt-field>
          <span class="edit"></span>
        </div>

      </div>
      <!-- 银行卡信息 -->
      <div class="bank-info-block" v-if="isShowBankInfo">
        <div class="bank-info" @click="goAddBank" v-if="bankInfo">
          <img v-lazy="bankInfo.bankIconUrl">
          <div class="msg">
            <p class="dt">{{bankInfo.bankName}}</p>
            <p class="no">**** **** **** {{returnCardNo(bankInfo.bankNo)}}</p>
          </div>
        </div>
        <div class="add-bank" @click="goAddBank" v-else>
          <img src="../image/icon_add@2x.png">
          <p>绑定银行卡</p>
        </div>
      </div>
      <div class="identity-footer">
        <div class="identity-btn">
          <button :disabled="!idFrontStatus || !idBackStatus" @click="toNextPage">下一步</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import ProgressBar from '../components/Progress'
import {imgCompression, formatDateTime} from '@/helpers/utils'

function checkName(value) {
  const reg = /^([\u4e00-\u9fa5]|[\u4e00-\u9fa5]·){2,}$/;
  if (!reg.test(value)) {
    return false
  }else {
    return true
  }
}

function checkCode(value) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(value)) {
    return false
  }else {
    return true
  }
}

export default {
  components: {
    ProgressBar,
  },
  data() {
    return {
      checked: true,
      linkArr: [],
      checkedArr: [],
      idFrontStatus: false,
      idBackStatus: false,
      ident: null,
      name: null
    }
  },
  computed: {
    ...mapState({
      userId: state => state.global.userInfo.userId,
      accountId: state =>state.global.userInfo.accountId,
      idPerson: state =>state.global.userInfo.idPerson,
      mobile: state =>state.global.userInfo.phone
    }),
    ...mapState('credit', {
      bankInfo: state => state.bankInfo,
      idCardInfo: state => state.idCardInfo
    }),
    // 是否展示绑定银行卡
    isShowBankInfo() {
      return this.idCardInfo && this.idFrontStatus && this.idBackStatus && this.name && this.ident
    }
  },
  activated() {
    this.ident = this.idCardInfo ? this.idCardInfo.ident : ""
    this.name = this.idCardInfo ? this.idCardInfo.name : ""
  },
  watch: {
    idCardInfo(newVal) {
      this.ident = newVal ? newVal.ident : ""
      this.name = newVal ? newVal.name : ""
    }
  },
  methods: {
    ...mapActions('credit',['set_idCardInfo', 'set_bankInfo']),
    // 返回银行卡号码
    returnCardNo(str) {
      return str && str.substr(str.length - 4);
    },
    toast(mes) {
      this.$toast({
        message: mes,
        duration: 1500,
        position: 'bottom'
      });
    },
    // 处理点击上传文件
    handleUpload(uploadName) {
      if (uploadName === 'idCardBack') {
        if (!this.idFrontStatus) {
          return this.$toast('请先拍摄身份证正面照')
        }
      }
      this.$refs[uploadName].dispatchEvent(new MouseEvent('click'))
    },
    // 上传人像面
    uploadIdCardFront(ev) {
      ev.stopPropagation();
      this.uploadIdImg("idCardFront", ev)
    },
    // 上传国徽面
    uploadIdCardBack(ev) {
      ev.stopPropagation();
      this.uploadIdImg("idCardBack", ev)
    },
    // 上传文件接口请求
    async uploadIdImg(uploadName, ev) {
      let file = ev.target.files[0];
      file = await imgCompression(file);
      let formData=new FormData();
      formData.append('file',file);
      formData.append('fileName', uploadName);
      formData.append('userId',this.userId);
      const res = await this.$api.jxhCredit.JXHuploadCreditFile(formData)
      if (res.code === '0') {
        let reader = new FileReader();
        //为文件读取成功设置事件
        reader.onload= (e) => {
          this.$refs[`${uploadName}Img`].src = e.target.result;
        };
        //正式读取文件
        reader.readAsDataURL(file)
        if (uploadName === "idCardFront")  {
          this.idFrontStatus = true
          if(res.data.ident && res.data.name) {
            this.set_idCardInfo({
              ident: res.data.ident,
              name: res.data.name
            })
          } else {
            this.$toast("数据错误： " + JSON.stringify(res.data))
          }
        }
        if (uploadName === "idCardBack")  this.idBackStatus = true
      } else {
        this.toast(res.message)
      }
    },
    checkIdentity() {
      if (!checkName(this.name)){
        this.toast('请填写真实姓名');
        return false
      }
      if (!checkCode(this.ident)){
        this.toast('请输入有效的身份证号');
        return false
      }
      return true
    },
    goAddBank() {
      this.set_idCardInfo({
        ident: this.ident,
        name: this.name
      })
      this.$router.push({path: '/addBank'})
    },
    async toNextPage() {
      if (!this.bankInfo) {
        return this.toast('请先添加银行卡信息');
      }
      if (this.checkIdentity()) {
        const param = {
          ident: this.ident,
          name: this.name,
          bankNo: this.bankInfo.bankNo,
          bankPhone: this.bankInfo.bankPhone,
          smsCode: this.bankInfo.smsCode,
          userId: this.userId,
          accountId: this.accountId,
        };
        const res = await this.$api.jxhCredit.JXHrealNameAuthentic(param);
        if (res.code === 'sc0' || res.code === '0') {
          // 清除页面数据
          this.set_bankInfo(null)
          // 跳转
          this.$router.replace({path: '/liveAc'})
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .identity-ac{
    /deep/ .progress{
      margin-bottom: 0;
    }
  }
.identity-block, .bank-info-block, .id-info-block{
  background-color: #fff;
  width: 100%;
}
.content{
  .warn{
    padding-left: .32rem;
    text-align: left;
    font-size: .28rem;
    font-weight:400;
    color:rgba(168,168,168,1);
    line-height: .4rem;
  }
}
.id-upload-block{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: .26rem .18rem;
  width: 100%;
  & .upload-item{
    width: 3.34rem;
    height: 2.8rem;
    text-align: center;
    background:rgba(255,255,255,1);
    box-shadow:0px 4px 14px 0px rgba(0,0,0,0.06);
    position: relative;
    &:first-child{
      margin-right: .14rem;
    }
    &:last-child{
      margin-left: .14rem;
    }
    input{
      display: none;
      touch-action: none;
    }
    .id-status{
      padding: .5rem 0;
      img{
        width: 2.08rem;
        height: 1.36rem;
        display: inline-block;
        margin-bottom: .24rem;
      }
      p{
        & label{
          width: .3rem;
          height: .3rem;
          background-image: url("../image/icon_finish@2x.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          margin-right: .08rem;
        }
        font-size: .28rem;
        font-weight:400;
        color:rgba(54,54,54,1);
        line-height: .4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
    }

  }
}
.id-info-block{
  padding-left: 0.3rem;
  margin-bottom: .18rem;
  .info-item{
    display: flex;
    height: 1.1rem;
    align-items: center;
    padding-right: 0.3rem;
    border-bottom: 0.01rem solid rgba(238,238,238,1);
    /deep/ .mint-field{
      background-image: none;
      width: 100%;
      .mint-cell-text{
        font-size: 0.28rem;
      }
      .mint-cell-title{
        width: 1.38rem;
        margin-right: .48rem;
      }
      .mint-cell-wrapper{
        background-image: none;
      }
    }
    .edit{
      flex-shrink: 0;
      width: 0.46rem;
      height: 0.46rem;
      background-image: url("../image/icon_edit@2x.png");
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
.bank-info-block {
  width: 100%;
  background-color: #fff;
  .bank-info {
    height: 1.8rem;
    border-radius: 0.1rem;
    display: flex;
    padding: 0 0.34rem 0 0.34rem;
    align-items: center;
    justify-content: left;
    .msg {
      width: 100%;
      color: #363636;
      position: relative;
      z-index: 3;
      .dt {
        font-size: 0.32rem;
      }
      .dd {
        font-size: 0.22rem;
      }
      .no {
        font-size: 0.34rem;
        padding-top: 0.2rem;
      }
    }
    & > img{
      width: .5rem;
      height: .5rem;
      margin-right: .36rem;
      border-radius: 50%;
    }
  }
  .add-bank{
    display: flex;
    height: 1.14rem;
    padding: .32rem;
    align-items: center;
    justify-content: left;
    img{
      width: .48rem;
      display: inline-block;
      margin-right: .22rem;
    }
    p{
      font-size: .3rem;
      color: #363636;
    }
  }
}
.identity-btn{
  width: 100%;
  height: 0.88rem;
  text-align: center;
  margin: 1.66rem 0 .98rem 0;
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
    &[disabled="disabled"]{
      background-color: #ddd;
    }
  }
}
</style>
