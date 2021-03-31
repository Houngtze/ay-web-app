<template>
  <div class="person-info">
    <progress-bar :index=2></progress-bar>
    <div class="person-info-form">
      <ul>
        <li class="form-li">
          <span>为确保您的爱满分审核通过，请如实填写，如有变更，请更新您的个人信息</span>
        </li>
        <li @click="openPop(tradeArr, 5)">
          <label>所属行业</label>
          <span v-if="trade.typeName">{{trade.typeName}}</span>
          <span v-else class="noVal">请选择</span>
        </li>
        <li @click="openPop(professionArr, 4)">
          <label>职业类型</label>
          <span v-if="profession.typeName">{{profession.typeName}}</span>
          <span v-else class="noVal">请选择</span>
        </li>
        <li>
          <label>公司名称</label>
          <input type="text" v-model="company" placeholder="请输入您的公司名称">
        </li>
        <li class="form-phone">
          <div>
            <label>办公电话</label>
            <input type="text" maxlength="4" placeholder="区号" v-model="companyMobile1">
            <input type="text" maxlength="8" placeholder="座机号码" v-model="companyMobile2">
            <input type="text" maxlength="4" placeholder="分机号" v-model="companyMobile3" >
          </div>
          <span>*示例：0755-84705887-2019</span>
          <span>*请填写真实有效的电话号码，否则将影响审批</span>
        </li>
        <li @click="getAddress('company')">
          <label>工作地区</label>
          <span v-if="companyProvince">{{companyProvince}}</span>
          <span v-else class="noVal">请选择</span>
        </li>
        <li class="form-textarea">
          <textarea rows="2" cols="10" placeholder="请输入详细工作地址" v-model="companyAddress" ></textarea>
        </li>
        <li @click="openPop(incomeArr, 6)">
          <label>收入来源</label>
          <span v-if="income.typeName">{{income.typeName}}</span>
          <span v-else class="noVal">请选择</span>
        </li>
        <li @click="openPopPay">
          <label>工资发放日</label>
          <span v-if="payDay">{{payDay}}</span>
          <span v-else class="noVal">请选择</span>
        </li>
        <li>
          <label>月收入</label>
          <input type="text" placeholder="请输入月收入金额" v-model="profit">
        </li>
      </ul>
      <ul>
        <li class="form-li">
          <span>其他信息</span>
        </li>
        <li @click="openPop(educationArr, 7)">
          <label>学历</label>
          <span v-if="education.typeName">{{liveType.typeName}}</span>
          <span v-else class="noVal">请选择</span>
        </li>
        <li @click="openPop(liveTypeArr, 7)">
          <label>住房情况</label>
          <span v-if="liveType.typeName">{{liveType.typeName}}</span>
          <span v-else class="noVal">请选择</span>
        </li>
        <li @click="getAddress('live')">
          <label>居住地区</label>
          <span v-if="liveProvince">{{liveProvince}}</span>
          <span v-else class="noVal">请选择</span>
        </li>
        <li class="form-textarea">
          <textarea rows="2" cols="10" v-model="liveAddress" placeholder="请输入详细居住地址"></textarea>
        </li>
        <li>
          <label>直系亲属</label>
          <input type="text" v-model="familyName" placeholder="请输入直系亲属联系人姓名">
        </li>
        <li class="form-phone" style="height: 1.1rem">
          <div>
            <label>联系人电话</label>
            <input type="text" maxlength="11" v-model="familyPhone" placeholder="请输入联系人电话">
          </div>
          <span>*请填写真实有效的电话号码，否则将影响审批</span>
        </li>
        <li @click="openPop(familyRelationArr, 8)">
          <label>关系</label>
          <span v-if="familyRelation.typeName">{{familyRelation.typeName}}</span>
          <span v-else class="noVal">请选择联系人与您的关系</span>
        </li>
        <li>
          <label>旁系亲属</label>
          <input type="text" v-model="otherName" placeholder="请输入旁系亲属联系人姓名">
        </li>
        <li class="form-phone" style="height: 1.1rem">
          <div>
            <label>联系人电话</label>
            <input type="text" maxlength="11" v-model="otherPhone" placeholder="请输入联系人电话">
          </div>
          <span>*请填写真实有效的电话号码，否则将影响审批</span>
        </li>
        <li  @click="openPop(otherRelationArr, 9)">
          <label>关系</label>
          <span v-if="otherRelation.typeName">{{otherRelation.typeName}}</span>
          <span v-else class="noVal">请选择联系人与您的关系</span>
        </li>
        <li  @click="openPop(loanUseArr, 10)">
          <label>贷款用途</label>
          <span v-if="loanUse.typeName">{{loanUse.typeName}}</span>
          <span v-else class="noVal">请选择贷款用途</span>
        </li>
      </ul>
      <p class="form-warn">请确保以上信息是真实且有效的，否则将申请失败！</p>
    </div>
    <div class="progress-info-btn">
      <button @click="submitForm">下一步</button>
    </div>
    <picker-pop
      :slotArr="slotList"
      @handleValue="handleValue"
      ref="pickerPop">
    </picker-pop>
    <picker-company
      ref="pickerCompany"
      :value="company"
      @handleValue="handleCompany">
    </picker-company>
    <picker-address
      :slotArr="addressList"
      ref="pickerAddress"
      @handleAddress="handleAddress">
    </picker-address>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import ProgressBar from '../components/Progress'
import PickerPop from "../components/PickerPop"
import PickerCompany from "../components/PickerCompany"
import PickerAddress from "../components/PickerAddress"
import {formatDateTime} from '@/helpers/utils'
export default {
  components: {
    ProgressBar,
    PickerPop,
    PickerCompany,
    PickerAddress
  },
  data() {
    return {
      slotList: [],
      trade: {}, // 当前行业
      tradeArr: [], // 行业列表
      profession: {}, // 当前职业
      professionArr: [], // 职业列表

      company: null, // 公司
      companyMobile1: null, //区号
      companyMobile2: null, //座机号
      companyMobile3: null, // 分机号
      addressList: [], // 省市列表
      companyA: [], // 包含公司省市区信息
      companyProvince: null, // 公司地址
      companyAddress: null, // 公司详细地址

      income: {}, // 收入来源
      incomeArr: [], // 收入来源列表
      payDay: null, // 发薪日
      payDayArr: [], // 发薪日列表
      profit: null, // 月收入
      addressKey: null, //

      education: {}, // 学历
      educationArr: [], // 学历列表
      liveType: {}, // 住房情况
      liveTypeArr: [], // 住房情况列表
      liveA: [], // 包含住址省市区信息
      liveProvince: null, // 居住地址
      liveAddress: null, // 居住详细地址

      familyName: null, // 家庭联系人
      familyPhone: null,
      familyRelation: {}, //
      familyRelationArr: [], //
      otherName: null, // 旁系联系人
      otherPhone: null,
      otherRelation: {}, //
      otherRelationArr: [], //

      loanUse: {},
      loanUseArr: [], //
    }
  },
  computed: {
    ...mapState({
      userId: state => state.global.userInfo.userId,
      userName: state => state.global.userInfo.userName,
      idPerson: state => state.global.userInfo.idPerson,
      mapDetail: state => state.map.detail
    }),
    companyMobile() {
      let str = ''
      if (this.companyMobile1 && this.companyMobile1.length >2 && !isNaN(this.companyMobile1)) {
        str = this.companyMobile1
        if (this.companyMobile2 && this.companyMobile2.length >6 && !isNaN(this.companyMobile2)) {
          str = `${this.companyMobile1}-${this.companyMobile2}`
          if (this.companyMobile3 && !isNaN(this.companyMobile3)) {
            str = `${this.companyMobile1}-${this.companyMobile2}-${this.companyMobile3}`
            return str
          }
          return str
        }
      }
    }
  },
  methods: {
    // 封装获取下拉框数据请求方法
    getVocation(type, from) {
      return new Promise(async resolve => {
        const param = {
          type,
          userId: this.userId
        }
        const res = await this.$api.credit.getVocation(param);
        if(res.code === 'sc0') {
          this.switchList(type, res.data);
          resolve(res.data)
        } else if(from){
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
        }
      })
    },
    switchList(type, data) {
      switch(type) {
        case 4:
          // 现金贷职业类型
          this.typeKey = 'profession'
          if(data) this.professionArr = data
          break;
        case 5:
          // 现金贷行业类型
          this.typeKey = 'trade'
          if(data) this.tradeArr = data
          break;
        case 6:
          // 现金贷收入类型
          this.typeKey = 'income'
          if(data) this.incomeArr = data
          break;
        case 7:
          // 现金贷住房类型
          this.typeKey = 'liveType'
          if(data) this.liveTypeArr = data
          break;
        case 8:
          // 现金贷直系亲属类型
          this.typeKey = 'familyRelation'
          if(data) this.familyRelationArr = data
          break;
        case 9:
          // 现金贷旁系亲属类型
          this.typeKey = 'otherRelation'
          if(data) this.otherRelationArr = data
          break;
        case 10:
          // 现金贷贷款类型
          this.typeKey = 'loanUse'
          if(data) this.loanUseArr = data
          break;
        case 11:
          // 学历
          this.typeKey = 'education'
          if(data) this.educationArr = data
          break;
      }
    },
    // 封装解析pop框选择的值
    handleValue(val, index) {
      const key = this.typeKey
      const keys = `${key}Arr`
      this[key] = this[keys][index]
    },
    // 封装打开pop框的方法
    async openPop(list = [], type) {
      if(list.length === 0) {
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
      if(this.addressList.length === 0) {
        const res = await this.$api.credit.getAddress()
        if (res.code === 'sc0') {
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
      this.addressKey = key
      this.$refs.pickerAddress.open();
    },
    // 解析选中的地址
    handleAddress(data) {
      this[`${this.addressKey}Province`] = `${data[0].name}-${data[1].name}-${data[2].name}`
      this[`${this.addressKey}A`] = data
    },
    // 发薪日pop框
    openPopPay() {
      let i = 1
      let arr = []
      let arr1 = []
      while (i < 32) {
        arr.push( {
          index: i - 1,
          val: `${i}`
        })
        arr1.push(`${i}`)
        i++
      }
      this.payDayArr = arr1
      this.typeKey = 'payDay'
      this.slotList = arr;
      this.$refs.pickerPop.open();
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
    // 校验收入
    checkProfit(val) {
      const len = val.length;
      val = parseInt(val);
      if (isNaN(val)) {
        return false
      } else if(len > val.toString().length) {
        return false
      }
      return true
    },
    // 提交表单
    async submitForm() {
      if (!this.trade.typeName) {
        this.$toast('请选择您的行业')
        return;
      } else if(!this.profession.typeName) {
        this.$toast('请选择您的职业')
        return;
      } else if(!this.company) {
        this.$toast('请输入您的公司名称')
        return;
      } else if(!this.companyMobile) {
        this.$toast('请按格式填写办公电话')
        return;
      } else if(!this.companyProvince) {
        this.$toast('请选择您的工作地区')
        return;
      } else if(!this.companyAddress) {
        this.$toast('请输入详细工作地址')
        return;
      } else if(!this.income.typeName) {
        this.$toast('请选择您的收入来源')
        return;
      } else if(!this.payDay) {
        this.$toast('请选择您的工资发放日')
        return;
      } else if(!this.profit) {
        this.$toast('请输入您的月收入')
        return;
      } else if(!this.checkProfit(this.profit)) {
        this.$toast('请输入纯数字整数月收入')
        return;
      } else if(!this.education.typeName) {
        this.$toast('请选择您的学历信息')
        return;
      } else if(!this.liveType.typeName) {
        this.$toast('请选择您的住房信息')
        return;
      } else if(!this.liveProvince) {
        this.$toast('请选择您的居住地址')
        return;
      } else if(!this.liveAddress) {
        this.$toast('请输入详细居住地址')
        return;
      } else if(!this.familyName || this.checkName(this.familyName)) {
        this.$toast('请输入直系亲属真实姓名')
        return;
      } else if(!this.familyPhone || this.checkPhone(this.familyPhone)) {
        this.$toast('请输入直系亲属有效的手机号码')
        return;
      } else if(!this.familyRelation.typeName) {
        this.$toast('请选择直系亲属联系人关系')
        return;
      } else if(!this.otherName || this.checkName(this.familyName) || this.familyName === this.otherName) {
        this.$toast('请输入旁系亲属真实姓名')
        return;
      } else if(!this.otherPhone || this.checkPhone(this.otherPhone) || this.familyPhone === this.otherPhone) {
        this.$toast('请输入旁系亲属有效的手机号码')
        return;
      } else if(!this.otherRelation.typeName) {
        this.$toast('请选择旁系亲属联系人关系')
        return;
      }  else if(!this.loanUse) {
        this.$toast('请选择贷款用途')
        return;
      }
      const param = {
        source: 'h5',
        salaryOffDay: this.payDay,
        userId: this.userId,
        industry: this.trade.typeName,
        industryCode: this.trade.personType,
        profession: this.profession.typeName,
        professionCode: this.profession.personType,

        companyName: this.company,
        companyMobile: this.companyMobile,
        companyProviceCode: this.companyA[0] && this.companyA[0].code,
        companyProvince: this.companyA[0] && this.companyA[0].name,
        companyCity: this.companyA[0] && this.companyA[1].name,
        companyCityCode: this.companyA[0] && this.companyA[1].code,
        companyRegion: this.companyA[0] && this.companyA[2].name,
        companyRegionCode: this.companyA[0] && this.companyA[2].code,
        companyAddress: this.companyAddress,

        incomeSource: this.income.typeName,
        incomeCode: this.income.personType,
        income: this.profit,

        education: this.education.typeName,
        educationCode: this.education.personType,
        liveType: this.liveType.typeName,
        liveTypeCode: this.liveType.personType,
        liveProvince: this.liveA[0] && this.liveA[0].name,
        liveProviceCode: this.liveA[0] && this.liveA[0].code,
        liveCity: this.liveA[1] && this.liveA[1].name,
        liveCityCode: this.liveA[1] && this.liveA[1].code,
        liveRegion: this.liveA[2] && this.liveA[2].name,
        liveRegionCode: this.liveA[2] && this.liveA[2].code,
        liveAddress: this.liveAddress,

        familyName: this.familyName,
        familyPhone: this.familyPhone,
        familyRelation: this.familyRelation.typeName,
        familyRelationCode: this.familyRelation.personType,

        otherName: this.otherName,
        otherPhone: this.otherPhone,
        otherRelation: this.otherRelation.typeName,
        otherRelationCode: this.otherRelation.personType,

        loanUse: this.loanUse.typeName,
        loanUseCode: this.loanUse.personType,
      }
      const res = await this.$api.credit.addPersonInfo(param)
      if(res.code === 'sc0') {
        if (res.data && res.data.activeStatus === "0") {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
          return;
        }
        // this.$router.replace({path:'/bankInfo'})
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './personInfo.scss';
.person-info .person-info-form ul li.form-li{
  min-height: 0.78rem;
}
</style>
