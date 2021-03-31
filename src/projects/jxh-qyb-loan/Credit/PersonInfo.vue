<template>
  <div class="person-info">
    <progress-bar :activeStep="1" :progressArr="progressArr"></progress-bar>
    <div class="person-info-form">
      <ul>
        <li>
          <mt-field label="紧急联系人" v-model="personInfo.familyName" placeholder="请输入紧急联系人姓名"></mt-field>
        </li>
        <li class="form-phone" style="height: 1.1rem">
          <div>
            <mt-field label="联系人电话" v-model="personInfo.familyPhone" placeholder="请输入联系人电话" type="tel"
                      :attr="{ maxlength: 11 }"></mt-field>
          </div>
        </li>
        <li @click="openPop">
          <mt-field label="关系" v-model="familySelected.familyRelation" placeholder="请选择联系人与您的关系" disabled></mt-field>
          <span class="noVal"></span>
        </li>
      </ul>
      <ul style="margin-top: .18rem">
        <div class="upload-file" @click="selectFile">
          <input ref="uploadFile" type="file"
                 accept="image/png,image/jpg,image/jpeg,application/pdf"
                 name="file"
                 @change="handleSelectFile"
                 style="display: none">
          <div class="left">
            <img src="../images/icon_add@2x.png">
            <div>
              <p>上传附件 <span>(最多上传30份)</span></p>
            </div>
          </div>
          <div class="right" v-if="fileList.length">
            <img src="../images/icon-upload-success.png">
            <span>已上传{{fileList.length}}份</span>
          </div>
        </div>
      </ul>
    </div>
    <div class="page-bottom-btn">
      <button @click="submitForm">下一步</button>
    </div>
    <!-- 联系人选项 -->
    <picker-pop
      :slotArr="slotList"
      @handleValue="handleValue"
      ref="pickerPop">
    </picker-pop>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import {imgCompression, formatDateTime} from '@/helpers/utils'
  import ProgressBar from '@/components/ProgressBar'
  import PickerPop from "@/components/jxh/jxh-credit/components//PickerPop"

  export default {
    name: "PersonInfo",
    components: {
      ProgressBar,
      PickerPop
    },
    data() {
      return {
        progressArr: [
          {text: "身份认证"},
          {text: "个人信息"},
          {text: "分期信息"}
        ],
        slotList: [],
        familySelected: {},
        personInfo: {
          familyName: "",
          familyPhone: "",
          familyRelation: "",
        },
        fileList: []
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        accountId: state =>state.global.userInfo.accountId,
        idPerson: state =>state.global.userInfo.idPerson,
        mobile: state =>state.global.userInfo.phone
      }),
    },
    mounted() {
      this.getPersonInfo()
    },
    methods: {
      // 获取已授信的个人信息
      async getPersonInfo() {
        const res = await this.$api.qybGetPersonInfo({ userId: this.userId })
        if (res.code === "0") {
          if (!res.data) return
          if (res.data.familyName) {
            this.personInfo.familyName = res.data.familyName
            this.personInfo.familyPhone = res.data.familyPhone
            this.personInfo.familyRelation = res.data.familyRelation
          }
        } else {
          this.$toast(res.message)
        }
      },
      // 封装打开pop框的方法
      async openPop() {
        const list = await this.getVocation()
        const arr = list.map((item, index) => {
          return {
            index,
            val: item.typeName
          }
        })
        this.slotList = arr;
        this.$refs.pickerPop.open();
      },
      // 封装获取下拉框数据请求方法
      getVocation() {
        return new Promise(async resolve => {
          const param = {
            optionType: 1,
            userId: this.userId
          }
          const res = await this.$api.jxhCredit.JXHgetPersonInfoOption(param);
          if (res.code === 'sc0' || res.code === '0') {
            resolve(res.data)
          }
        })
      },
      // 封装解析pop框选择的值
      handleValue(val) {
        this.$set(this.familySelected, "familyRelation", val)
      },
      // 选择文件
      selectFile() {
        this.$refs["uploadFile"].dispatchEvent(new MouseEvent('click'))
      },
      async handleSelectFile(ev) {
        ev.stopPropagation();
        let formData = new FormData();
        let selectFiles = ev.target.files;
        if (selectFiles.length > 6) {
          return this.$toast("一次只能选择6个文件")
        }
        if (this.fileList.length + selectFiles.length > 30) {
          return this.$toast("最多只能上传30个附件")
        }

        for (let i = 0; i < selectFiles.length; i++) {
          if (selectFiles[i].name) {
            const fileName = selectFiles[i].name.substring(selectFiles[i].name.lastIndexOf('.') + 1)  // 文件名，此方法为兼容部分手机缺失文件名字段
            if (!["pdf", "png", "jpg"].includes(fileName)) {
              return this.$toast("文件格式错误，仅支持png/jpg/pdf格式的文件")
            }
          }
          let file = selectFiles[i]
          if (selectFiles[i].type !== "application/pdf") {
            file = await imgCompression(selectFiles[i])
          }
          formData.append('files', file);
        }
        formData.append('userId',this.userId);
        const res = await this.$api.uploadFiles(formData)
        if (res.code === 'sc0') {
          if (res.data.imgUrls.length) {
            res.data.imgUrls.forEach(item => {
              if (item.type !== "ERROR") {
                this.fileList.push({
                  url: res.data.imgSrc + '/' +  item.content
                })
              } else {
                this.$toast(item.content)
              }
            })
          }
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
        }
      },
      // 检验姓名
      checkName(name) {
        const reg = /^([\u4e00-\u9fa5]|[\u4e00-\u9fa5]·){2,}$/;
        return !reg.test(name);
      },
      // 校验手机号
      checkPhone(val) {
        const reg = /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/;
        return !reg.test(val);
      },
      // 提交表单
      async submitForm() {
        if (!this.personInfo.familyName || this.checkName(this.personInfo.familyName)) {
          this.$toast('紧急联系人真实姓名有误')
          return;
        } else if (!this.personInfo.familyPhone || this.checkPhone(this.personInfo.familyPhone)) {
          this.$toast('联系人有效的手机号码有误')
          return;
        } else if (!this.familySelected.familyRelation) {
          this.$toast('联系人关系有误')
          return;
        } else if (!this.fileList.length) {
          this.$toast('附件信息有误，请重新上传')
          return;
        }
        const param = {
          familyName: this.personInfo.familyName,
          familyPhone: this.personInfo.familyPhone,
          familyRelation: this.familySelected.familyRelation,
          accessoryList: this.fileList,
          userId: this.userId
        };
        const res = await this.$api.qybSubmitPersonInfo(param);
        if (res.code === 'sc0' || res.code === '0') {
          this.$router.replace({path: "/applyLoan"})
        } else {
          this.$toast(res.message)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/components/jxh/jxh-credit/PersonInfo/personInfo.scss";
  .person-info .person-info-form ul li{
    span{
      @include bg-image('../images/icon-right');
    }
    /deep/ .mint-field{
      width: 100%;
      .mint-cell-text{
        font-size: 0.28rem;
      }
      background-image: none;
      .mint-cell-title{
        width: 1.8rem;
      }
      .mint-cell-wrapper{
        background-image: none;
      }
      input[disabled]{
        color: #363636;
        opacity: 1;
      }
    }
  }
  .upload-file{
    display: flex;
    height: 1.14rem;
    padding: .32rem;
    align-items: center;
    justify-content: space-between;
    .left, .right{
      display: flex;
      align-items: center;
      justify-content: left;
    }
    .left{
      p{
        font-size: .3rem;
        color: #363636;
        span{
          font-size: .24rem;
          color: #A8A8A8;
        }
      }
      img{
        width: .48rem;
        display: inline-block;
        margin-right: .28rem;
      }
    }
    .right{
      span{
        font-size: .3rem;
        color: #A8A8A8;
      }
      img{
        width: .36rem;
        display: inline-block;
        margin-right: .08rem;
      }
    }
  }
  .page-bottom-btn {
    padding: .8rem 0;
    width: 100%;
    text-align: center;
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
</style>
