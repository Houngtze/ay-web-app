<template>
  <div class="person-info">
    <progress-bar v-if="isShowProgress" :index=3></progress-bar>
    <div class="person-info-form">
      <ul>
        <li>
          <mt-field label="家庭联系人" v-model="personInfo.familyName" placeholder="请输入家庭联系人姓名"></mt-field>
        </li>
        <li class="form-phone" style="height: 1.1rem">
          <div>
            <mt-field label="联系人电话" v-model="personInfo.familyPhone" placeholder="请输入联系人电话" type="tel"
                      :attr="{ maxlength: 11 }"></mt-field>
          </div>
        </li>
        <li @click="openPop(familyOption, 1)">
          <mt-field label="关系" v-model="familySelected.typeName" placeholder="请选择联系人与您的关系" disabled></mt-field>
          <span class="noVal"></span>
        </li>
      </ul>
      <ul style="margin-top: .18rem">
        <li>
          <mt-field label="其他联系人" v-model="personInfo.otherName" placeholder="请输入其他联系人姓名"></mt-field>
        </li>
        <li class="form-phone" style="height: 1.1rem">
          <div>
            <mt-field label="联系人电话" v-model="personInfo.otherPhone" placeholder="请输入联系人电话" type="tel"
                      :attr="{ maxlength: 11 }"></mt-field>
          </div>
        </li>
        <li @click="openPop(otherRelationOption, 2)">
          <mt-field label="关系" v-model="otherRelationSelected.typeName" placeholder="请选择联系人与您的关系" disabled></mt-field>
          <span class="noVal"></span>
        </li>
      </ul>
      <ul style="margin-top: .18rem">
        <li @click="openPop(professionOption, 3)">
          <mt-field label="职业" v-model="professionSelected.typeName" placeholder="请选择职业" disabled></mt-field>
          <span class="noVal"></span>
        </li>
        <li>
          <mt-field label="公司名称" v-model="personInfo.companyName" placeholder="请输入您的公司名称"></mt-field>
        </li>
        <li @click="getAddress('company')">
          <mt-field label="工作地区" v-model="addressSelected" placeholder="选择省市区" disabled></mt-field>
          <span class="noVal"></span>
        </li>
        <li class="form-textarea">
          <mt-field type="textarea" rows="2" cols="10"
                    v-model="personInfo.companyAddress" placeholder="请输入详细工作地址"></mt-field>
        </li>
        <li @click="openPop(incomeOption, 21)">
          <mt-field label="月收入" v-model="incomeSelected.typeName" placeholder="请选择月收入" disabled></mt-field>
          <span class="noVal"></span>
        </li>
        <li @click="openPop(educationOption, 11)">
          <mt-field label="学历" v-model="educationSelected.typeName" placeholder="请选择学历" disabled></mt-field>
          <span class="noVal"></span>
        </li>
        <li>
          <mt-field label="个人邮箱" v-model="personInfo.email" placeholder="请输入您的个人邮箱"></mt-field>
        </li>
      </ul>
    </div>
    <div class="progress-info-btn">
      <p>请确保以上信息是真实且有效，否则将申请失败！</p>
      <button @click="submitForm">{{submitText}}</button>
    </div>
    <picker-pop
      :slotArr="slotList"
      @handleValue="handleValue"
      ref="pickerPop">
    </picker-pop>
    <picker-address
      :slotArr="addressList"
      ref="pickerAddress"
      @handleAddress="handleAddress">
    </picker-address>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import ProgressBar from '../components/Progress'
  import PickerPop from "../components/PickerPop"
  import PickerCompany from "../components/PickerCompany"
  import PickerAddress from "../components/PickerAddress"
  import {formatDateTime} from '@/helpers/utils'

  export default {
    props: {
      // 按钮文案
      submitText: {
        type: String,
        default: '提交申请'
      },
      // 是否显示流程
      isShowProgress: {
        type: Boolean,
        default: true
      },
      // 是否显示流程
      customJump: {
        type: Boolean,
        default: false
      }
    },
    components: {
      ProgressBar,
      PickerPop,
      PickerCompany,
      PickerAddress
    },
    data() {
      return {
        typeKey: null,
        slotList: [],
        familySelected: {}, // 家庭联系人选择项
        otherRelationSelected: {}, // 其他联系人选择项
        professionSelected: {}, // 职业选择项
        educationSelected: {}, // 学历选择项
        incomeSelected: {}, // 收入选择项

        familyOption: [], // 家庭联系人选项
        otherRelationOption: [], // 其他联系人选项
        professionOption: [], // 职业选项
        educationOption: [], // 学历选项
        incomeOption: [], // 收入选项

        addressList: [], // 地址列表
        addressSelected: "", // 选中的地址

        personInfo: {
          "familyName": "",
          "familyPhone": "",
          "familyRelation": "",
          "otherName": "",
          "otherPhone": "",
          "otherRelation": "",
          "email": "",
          "profession": "",
          "education": "",
          "income": "",
          "companyName": "",
          "companyProvince": "",
          "companyCity": "",
          "companyRegion": "",
          "companyAddress": ""
        }
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        userName: state => state.global.userInfo.userName,
        idPerson: state => state.global.userInfo.idPerson,
        identity: state => state.global.userInfo.identity,
        phone: state => state.global.userInfo.phone,
        name: state => state.global.userInfo.name,
      }),
    },
    created() {
      this.getPersonInfo(); // 获取用户信息返显
      this.refreshMapDetail(); // 刷新当前用户地理位置
    },
    methods: {
      ...mapActions('map', ['refreshMapDetail']),
      // 返显用户信息
      async getPersonInfo() {
        const param = {
          userId: this.userId
        }
        const res = await this.$api.jxhCredit.JXHgetCreditInfo(param)
        if (res.code === 'sc0' || res.code === '0') {
          this.personInfo = res.data
          this.familySelected.typeName = res.data.familyRelation
          this.otherRelationSelected.typeName = res.data.otherRelation
          this.professionSelected.typeName = res.data.profession
          this.educationSelected.typeName = res.data.education
          this.incomeSelected.typeName = res.data.income

        } else {
          this.$toast(res.message)
        }
      },
      // 封装获取下拉框数据请求方法
      getVocation(optionType, from) {
        return new Promise(async resolve => {
          const param = {
            optionType,
            userId: this.userId
          }
          const res = await this.$api.jxhCredit.JXHgetPersonInfoOption(param);
          if (res.code === 'sc0' || res.code === '0') {
            this.switchList(optionType, res.data);
            resolve(res.data)
          } else if (from) {
            this.$toast({
              message: res.message,
              position: 'bottom'
            })
          }
        })
      },
      // 解析对应的下拉框数据
      switchList(type, data) {
        switch (type) {
          case 1:
            // 家庭联系人类型
            this.typeKey = 'family'
            if (data) this.familyOption = data
            break;
          case 2:
            // 其他联系人类型
            this.typeKey = 'otherRelation'
            if (data) this.otherRelationOption = data
            break;
          case 3:
            // 职业类型
            this.typeKey = 'profession'
            if (data) this.professionOption = data
            break;
          case 11:
            // 职业类型
            this.typeKey = 'education'
            if (data) this.educationOption = data
            break;
            case 21:
            // 职业类型
            this.typeKey = 'income'
            if (data) this.incomeOption = data
            break;
        }
      },
      // 封装解析pop框选择的值
      handleValue(val, index) {
        const key = `${this.typeKey}Selected`
        const keys = `${this.typeKey}Option`
        this[key] = this[keys][index]
      },
      // 封装打开pop框的方法
      async openPop(list = [], type) {
        if (list.length === 0) {
          list = await this.getVocation(type, true)
        } else {
          this.switchList(type)
        }
        const arr = list.map((item, index) => {
          return {
            index,
            val: item.typeName
          }
        })
        this.slotList = arr;
        this.$refs.pickerPop.open();
      },
      // 获取公司名称
      handleCompany(data) {
        this.riskCompany.content = data;
        this.company = data;
      },
      // 打开公司pop框
      openPopCom() {
        this.$refs.pickerCompany.open();
      },
      // 获取省市地址信息
      async getAddress(key) {
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
        this.openPopAddress(key)
      },
      // 打开地址pop框
      openPopAddress(key) {
        this.$refs.pickerAddress.open();
      },
      // 解析选中的地址
      handleAddress(data) {
        this.personInfo.companyProvince = data[0].name
        this.personInfo.companyCity = data[1].name
        this.personInfo.companyRegion = data[2].name
        if (this.personInfo.companyProvince) {
          const companyProvince = this.personInfo.companyProvince ? (this.personInfo.companyProvince + "-") : ""
          const companyCity = this.personInfo.companyCity ? (this.personInfo.companyCity + "-") : ""
          const companyRegion = this.personInfo.companyRegion || ""
          this.addressSelected =  companyProvince + companyCity + companyRegion
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
      // 校验邮箱
      checkEmail(val) {
        const reg = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        return !reg.test(val);
      },
      // 提交表单
      async submitForm() {
        if (!this.personInfo.familyName || this.checkName(this.personInfo.familyName)) {
          this.$toast('家庭联系人真实姓名有误')
          return;
        } else if (!this.personInfo.familyPhone || this.checkPhone(this.personInfo.familyPhone)) {
          this.$toast('家庭联系人有效的手机号码有误')
          return;
        } else if (!this.familySelected.typeName) {
          this.$toast('家庭联系人关系有误')
          return;
        } else if (!this.personInfo.otherName || this.checkName(this.personInfo.otherName)) {
          this.$toast('其他联系人真实姓名有误')
          return;
        } else if (this.personInfo.familyName === this.personInfo.otherName) {
          this.$toast('联系人姓名不能重复')
          return;
        } else if (!this.personInfo.otherPhone || this.checkPhone(this.personInfo.otherPhone)) {
          this.$toast('其他联系人有效的手机号码有误')
          return;
        } else if (this.personInfo.familyPhone === this.personInfo.otherPhone) {
          this.$toast('联系人方式手机号不能重复')
          return;
        } else if (!this.otherRelationSelected.typeName) {
          this.$toast('其他联系人关系有误')
          return;
        } if (!this.professionSelected.typeName) {
          this.$toast('请选择您的职业')
          return;
        } else if (!this.personInfo.email || this.checkEmail(this.personInfo.email)) {
          this.$toast('请输入有效的邮箱地址')
          return;
        } else if (!this.personInfo.companyName || this.personInfo.companyName < 4) {
          this.$toast('公司名称有误')
          return;
        } else if (!this.personInfo.companyProvince) {
          this.$toast('请选择您的工作地区')
          return;
        } else if (!this.personInfo.companyAddress || this.personInfo.companyAddress.length < 4) {
          this.$toast('工作地址有误')
          return;
        } else  if (!this.incomeSelected.typeName) {
          this.$toast('请选择月收入')
          return;
        } else if (!this.educationSelected.typeName) {
          this.$toast('请选择学历')
          return;
        }
        const param = {
          ...this.personInfo, ...{
            familyRelation: this.familySelected.typeName,
            otherRelation: this.otherRelationSelected.typeName,
            profession: this.professionSelected.typeName,
            education: this.educationSelected.typeName,
            income: this.incomeSelected.typeName
        }};
        console.log(param)
        const res = await this.$api.jxhCredit.JXHsubmitPersonInfo(param)
        if(res.code === 'sc0'  || res.code === '0') {
          if (this.customJump)  {
            this.$emit('onActivePersonInfo', res);
          } else {
            this.$router.replace({path:'/creditResult'})
          }
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
  @import './personInfo.scss';
  .person-info .person-info-form ul li{
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
</style>
