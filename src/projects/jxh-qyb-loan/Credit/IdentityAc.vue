<template>
  <div class="identity-ac">
    <progress-bar :activeStep="0" :progressArr="progressArr"></progress-bar>
    <div class="content">
      <!-- 上传身份证 -->
      <div class="identity-block">
        <p class="warn">请使用本人身份证进行申请，否则将申请失败</p>
        <div class="id-upload-block">
          <div class="full-face upload-item">
            <div class="id-status" @click="handleUpload('idCardFront')">
              <img src="../images/id-front.png" ref="idCardFrontImg">
              <p>
                <label v-show="idFrontStatus"></label>
                <span>{{ idFrontStatus ? "已完成拍摄人像面" : "点击拍摄人像面" }}</span>
              </p>
            </div>
            <input type="file" accept="image/*" capture="camera" @change="uploadIdCardFront" ref="idCardFront">
          </div>
          <div class="reverse upload-item">
            <div class="id-status" @click="handleUpload('idCardBack')">
              <img src="../images/id-back.png" ref="idCardBackImg">
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
      <ul class="id-info-block">
        <li class="info-item">
          <mt-field label="姓名" v-model="name" placeholder="请填写您的姓名" :disabled="!canUploadOrEdit"></mt-field>
          <span class="edit"></span>
        </li>
        <li class="info-item">
          <mt-field label="身份证号" v-model="ident" placeholder="请填写您的身份证号" type="tel" :disabled="!canUploadOrEdit"></mt-field>
          <span class="edit"></span>
        </li>
      <!-- 住址信息 -->
        <li class="info-item" @click="getAddress()">
          <mt-field label="住址信息" v-model="address" placeholder="选择省市区" disabled></mt-field>
          <span class="noVal"></span>
        </li>
        <li class="info-item form-textarea">
          <mt-field type="textarea" rows="2" cols="10"
                    v-model="liveAddress" placeholder="请输入详细住址信息"></mt-field>
        </li>
      </ul>
      <!-- 银行卡信息 -->
      <div class="bank-info-block" v-if="isShowBankInfo">
        <div class="bank-info" @click="goAddBank" v-if="bankInfo && bankInfo.bankNo">
          <img v-lazy="bankInfo.bankIconUrl">
          <div class="msg">
            <p class="dt">{{bankInfo.bankName}}</p>
            <p class="no">**** **** **** {{returnCardNo(bankInfo.bankNo)}}</p>
          </div>
        </div>
        <div class="add-bank" @click="goAddBank" v-else>
          <img src="../images/icon_add@2x.png">
          <p>绑定银行卡</p>
        </div>
      </div>
      <div class="identity-footer">
        <div class="identity-btn">
          <button :disabled="!idFrontStatus || !idBackStatus || !address || !liveAddress" @click="toNextPage">下一步</button>
        </div>
      </div>
    </div>
    <!-- 地址选择 -->
    <picker-address
      :slotArr="addressList"
      ref="pickerAddress"
      @handleAddress="handleAddress">
    </picker-address>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import ProgressBar from '@/components/ProgressBar'
  import PickerAddress from "@/components/jxh/jxh-credit/components/PickerAddress"
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
      PickerAddress
    },
    data() {
      return {
        progressArr: [
          {text: "身份认证"},
          {text: "个人信息"},
          {text: "分期信息"}
        ],
        checked: true,
        linkArr: [],
        checkedArr: [],
        idFrontStatus: false,
        idBackStatus: false,
        ident: null,
        name: null,
        address: null,
        liveAddress: null,
        addressSelected: {
          "liveProvince": "",
          "liveCity": "",
          "liveRegion": "",
        },
        addressList: [],
        canUploadOrEdit: true
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
        creditStep: state => state.creditStep.status,
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
    mounted() {
      // 已提交实名的获取实名信息
      if (this.creditStep >= 30) {
        this.getPersonInfo()
      }
    },
    methods: {
      ...mapActions('credit',['set_idCardInfo', 'set_bankInfo', 'set_personInfo']),
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
      // 获取已授信的个人信息
      async getPersonInfo() {
        const res = await this.$api.qybGetPersonInfo({ userId: this.userId })
        if (res.code === "0") {
          if (!res.data) return
          if (res.data.bankNo) {
            this.set_bankInfo({
              bankPhone: res.data.bankPhone,
              bankNo: res.data.bankNo,
              bankName: res.data.bankName,
              bankIconUrl: res.data.bankIconUrl
            })
          }
          if (res.data.familyName) {
            this.set_personInfo({
              familyName: res.data.familyName,
              familyPhone: res.data.familyPhone,
              familyRelation: res.data.familyRelation
            })
          }
          if (res.data.ident) {
            this.set_idCardInfo({
              ident: res.data.ident,
              name: res.data.name
            })
            this.canUploadOrEdit = false // 已实名过的不准修改实名信息
          }
          this.addressSelected.liveProvince = res.data.liveProvince
          this.addressSelected.liveCity = res.data.liveCity
          this.addressSelected.liveRegion = res.data.liveRegion
          if (res.data.idCardFrontUrl) {
            this.idFrontStatus = true
            this.$refs["idCardFrontImg"].src = res.data.idCardFrontUrl
            this.canUploadOrEdit = false // 已实名过的不准修改实名信息
          }
          if (res.data.idCardBackUrl) {
            this.idBackStatus = true
            this.$refs["idCardBackImg"].src = res.data.idCardBackUrl
            this.canUploadOrEdit = false // 已实名过的不准修改实名信息
          }
        } else {
          this.$toast(res.message)
        }
      },
      // 处理点击上传文件
      handleUpload(uploadName) {
        if (!this.canUploadOrEdit) return this.$toast("您已提交过实名信息，请勿重复提交")
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
        formData.append('fileName', uploadName);
        formData.append('userId',this.userId);
        formData.append('file',file);
        const res = await this.$api.qybuUploadCreditFile(formData)
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
          this.$refs[uploadName].value = ""
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
        if (!this.ident){
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
      // 获取省市地址信息
      async getAddress() {
        if (this.addressList.length === 0) {
          const res = await this.$api.credit.getAddress()
          if (res.code === 'sc0' || res.code === '0') {
            this.addressList = res.data
          } else {
            this.$toast({
              message: res.message,
              position: 'bottom'
            })
            return
          }
        }
        this.openPopAddress()
      },
      // 打开地址pop框
      openPopAddress() {
        this.$refs.pickerAddress.open();
      },
      // 解析选中的地址
      handleAddress(data) {
        this.addressSelected.liveProvince = data[0].name
        this.addressSelected.liveCity = data[1].name
        this.addressSelected.liveRegion = data[2].name
        if (this.addressSelected.liveProvince) {
          const companyProvince = this.addressSelected.liveProvince ? (this.addressSelected.liveProvince + "-") : ""
          const companyCity = this.addressSelected.liveCity ? (this.addressSelected.liveCity + "-") : ""
          const companyRegion = this.addressSelected.liveRegion || ""
          this.address =  companyProvince + companyCity + companyRegion
        }
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
            accountId: this.accountId,
            liveProvince: this.addressSelected.liveProvince,
            liveCity: this.addressSelected.liveCity,
            liveRegion: this.addressSelected.liveRegion,
            liveAddress: this.liveAddress
          };
          const res = await this.$api.qybRealNameAuthentic(param);
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
            background-image: url("../images/icon_finish@2x.png");
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
      &.form-textarea{
        min-height: 1.44rem;
      }
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
        .mint-cell-value input[disabled]{
          color: #363636;
        }
      }
      span{
        flex-shrink: 0;
        width: 0.46rem;
        height: 0.46rem;
        background-repeat: no-repeat;
        background-position: center;
        text-align: left;
        &.noVal{
          background-size: 0.17rem 0.3rem;
          background-image: url("../images/icon-right@2x.png");
        }
        &.edit{
          background-size: 100%;
          background-image: url("../images/icon_edit@2x.png");
        }
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
    text-align: center;
    padding: .66rem 0 .98rem 0;
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
