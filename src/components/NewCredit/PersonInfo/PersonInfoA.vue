<template>
  <div class="person-info">
    <progress-bar v-if="isShowProgress" :index=2></progress-bar>
    <div class="person-info-form">
      <ul>
        <li @click="openPop(professionArr, 3)">
          <label>职业</label>
          <span v-if="profession.typeName">{{profession.typeName}}</span>
          <span v-else class="noVal">请选择</span>
        </li>
        <li>
          <label>个人邮箱</label>
          <input type="text" v-model="email" placeholder="请输入您的个人邮箱" @blur="collectInfo('email', riskEmail)"
                 @focus="collectInfo('email', riskEmail, 'start')">
        </li>
        <li @click="openPopCom" v-if="isOpen">
          <label>公司名称</label>
          <span v-if="company">{{company}}</span>
          <span v-else class="noVal">请输入您的公司名称</span>
          <!-- <input type="text" v-model="company" placeholder="请输入您的公司名称"> -->
        </li>
        <li v-else>
          <label>公司名称</label>
          <input type="text" v-model="company" placeholder="请输入您的公司名称">
        </li>
        <li class="form-phone">
          <div>
            <label>办公电话</label>
            <input type="text" maxlength="4" placeholder="区号" v-model="companyMobile1"
                   @blur="collectInfo('areaCode', riskAreaCode)"
                   @focus="collectInfo('areaCode', riskAreaCode, 'start')">
            <input type="text" maxlength="8" placeholder="座机号码" v-model="companyMobile2"
                   @blur="collectInfo('phone', riskPhone)"
                   @focus="collectInfo('phone', riskPhone, 'start')">
            <input type="text" maxlength="4" placeholder="分机号" v-model="companyMobile3"
                   @blur="collectInfo('extensionNumber', riskExtensionNumber)"
                   @focus="collectInfo('extensionNumber', riskExtensionNumber, 'start')">
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
                    <textarea rows="2" cols="10" placeholder="请输入详细工作地址" v-model="companyAddress"
                              @blur="collectInfo('detailAddress', riskCompanyAddress)"
                              @focus="collectInfo('detailAddress', riskCompanyAddress, 'start')"></textarea>
        </li>
      </ul>
      <ul>
        <li class="form-li">
          <span></span>
        </li>
        <li>
          <label>家庭联系人</label>
          <input type="text" v-model="familyName" placeholder="请输入家庭联系人姓名"
                 @blur="collectInfo('homeContact', riskFamilyName)"
                 @focus="collectInfo('homeContact', riskFamilyName, 'start')">
        </li>
        <li class="form-phone" style="height: 1.1rem">
          <div>
            <label>联系人电话</label>
            <input type="text" maxlength="11" v-model="familyPhone" placeholder="请输入联系人电话"
                   @blur="collectInfo('homeContactPhone', riskFamilyPhone)"
                   @focus="collectInfo('homeContactPhone', riskFamilyPhone, 'start')">
          </div>
          <span>*请填写真实有效的电话号码，否则将影响审批</span>
        </li>
        <li @click="openPop(familyRelationArr, 1)">
          <label>关系</label>
          <span v-if="familyRelation.typeName">{{familyRelation.typeName}}</span>
          <span v-else class="noVal">请选择联系人与您的关系</span>
        </li>
      </ul>
      <ul>
        <li class="form-li">
          <span></span>
        </li>
        <li>
          <label>其他联系人</label>
          <input type="text" v-model="otherName" placeholder="请输入其他联系人姓名"
                 @blur="collectInfo('otherContact', riskOtherName)"
                 @focus="collectInfo('otherContact', riskOtherName, 'start')">
        </li>
        <li class="form-phone" style="height: 1.1rem">
          <div>
            <label>联系人电话</label>
            <input type="text" maxlength="11" v-model="otherPhone" placeholder="请输入联系人电话"
                   @blur="collectInfo('otherContactPhone', riskOtherPhone)"
                   @focus="collectInfo('otherContactPhone', riskOtherPhone, 'start')">
          </div>
          <span>*请填写真实有效的电话号码，否则将影响审批</span>
        </li>
        <li @click="openPop(otherRelationArr, 2)">
          <label>关系</label>
          <span v-if="otherRelation.typeName">{{otherRelation.typeName}}</span>
          <span v-else class="noVal">请选择联系人与您的关系</span>
        </li>
      </ul>
      <p class="form-warn">请确保以上信息是真实且有效的，否则将申请失败！</p>
    </div>
    <div class="progress-info-btn">
      <button @click="submitForm">{{submitText}}</button>
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
        default: '下一步'
      },
      // 是否显示流程
      isShowProgress: {
        type: Boolean,
        default: true
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
        profession: {}, // 当前职业
        professionArr: [], // 职业列表

        email: null, // 个人邮箱

        company: null, // 公司
        companyMobile1: null, //区号
        companyMobile2: null, //座机号
        companyMobile3: null, // 分机号
        addressList: [], // 省市列表
        companyA: [], // 包含公司省市区信息
        companyProvince: null, // 公司地址
        companyAddress: null, // 公司详细地址

        addressKey: null, //

        familyName: null, // 家庭联系人
        familyPhone: null,
        familyRelation: {}, //
        familyRelationArr: [], //
        otherName: null, // 旁系联系人
        otherPhone: null,
        otherRelation: {}, //
        otherRelationArr: [], //

        riskRecordInfo: {
          company: [],
          detailAddress: [],
          email: [],
          homeContact: [],
          homeContactPhone: [],
          otherContact: [],
          otherContactPhone: [],
          areaCode: [],
          phone: [],
          extensionNumber: [],
          profession: [],
          homeContactRelation: [],
          otherContactRelation: [],
          workArea: []
        },
        riskCompany: {}, // 风控公司数据
        riskCompanyAddress: {},
        riskEmail: {},
        riskFamilyName: {},
        riskFamilyPhone: {},
        riskOtherName: {},
        riskOtherPhone: {},
        riskAreaCode: {},
        riskPhone: {},
        riskExtensionNumber: {},
        riskProfession: {},
        riskHomeContact: {},
        riskOtherContact: {},
        riskWorkArea: {},
        riskType: null,
        riskTypeKey: null,
        personBaseInfoId: '',
        isOpen: false // 蜂鸟控制开关接口控制是否需要反查公司
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
        source: state => state.global.source,
        mapDetail: state => state.map.detail
      }),
      companyMobile() {
        let str = ''
        if (this.companyMobile1 && this.companyMobile1.length > 2 && !isNaN(this.companyMobile1)) {
          str = this.companyMobile1
          if (this.companyMobile2 && this.companyMobile2.length > 6 && !isNaN(this.companyMobile2)) {
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
    created() {
      this.getPersonInfo(); // 获取用户信息返显
      this.refreshMapDetail(); // 刷新当前用户地理位置
    },
    methods: {
      ...mapActions('map', ['refreshMapDetail']),
      // 返显用户信息
      async getPersonInfo() {
        const param = {
          idPerson: this.idPerson,
          userId: this.userId,
          source: this.source
        }
        const res = await this.$api.credit.getPersonInfo(param)
        if (res.code === 'sc0') {
          const data = res.data;
          this.companyAddress = data.companyAddress;
          this.companyProvince = data.companyProvince ? `${data.companyProvince}-${data.companyCity}-${data.companyRegion}` : null
          this.company = data.companyName;
          this.email = data.email;
          this.familyName = data.familyName;
          this.familyPhone = data.familyPhone;
          this.familyRelation.typeName = data.familyRelation;
          this.otherName = data.otherName;
          this.otherPhone = data.otherPhone;
          this.otherRelation.typeName = data.otherRelation;
          this.profession.typeName = data.vocationName;
          this.companyMobile1 = data.companyMobile ? data.companyMobile.split('-')[0] : null;
          this.companyMobile2 = data.companyMobile ? data.companyMobile.split('-')[1] : null;
          this.companyMobile3 = data.companyMobile ? data.companyMobile.split('-')[2] : null;
          this.personBaseInfoId = res.data.personBaseInfoId;
        }
      },
      // 封装获取下拉框数据请求方法
      getVocation(type, from) {
        return new Promise(async resolve => {
          const param = {
            type,
            userId: this.userId
          }
          const res = await this.$api.credit.getVocation(param);
          if (res.code === 'sc0') {
            this.switchList(type, res.data);
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
          case 3:
            // 职业类型
            this.typeKey = 'profession'
            if (data) this.professionArr = data
            this.riskType = this.riskProfession
            this.riskTypeKey = 'profession'
            this.collectInfo(this.riskTypeKey, this.riskType, 'start')
            break;
          case 1:
            // 家庭联系人类型
            this.typeKey = 'familyRelation'
            if (data) this.familyRelationArr = data
            this.riskType = this.riskHomeContact
            this.riskTypeKey = 'homeContactRelation'
            this.collectInfo(this.riskTypeKey, this.riskType, 'start')
            break;
          case 2:
            // 其他联系人类型
            this.typeKey = 'otherRelation'
            if (data) this.otherRelationArr = data
            this.riskType = this.riskOtherContact
            this.riskTypeKey = 'otherContactRelation'
            this.collectInfo(this.riskTypeKey, this.riskType, 'start')
            break;
        }
      },
      // 封装解析pop框选择的值
      handleValue(val, index) {
        const key = this.typeKey
        const keys = `${key}Arr`
        this[key] = this[keys][index]
        this.collectInfo(this.riskTypeKey, this.riskType)
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
        this.collectInfo('company', this.riskCompany)
        this.company = data;
      },
      // 打开公司pop框
      openPopCom() {
        this.collectInfo('company', this.riskCompany, 'start')
        this.$refs.pickerCompany.open();
      },
      // 获取省市地址信息
      async getAddress(key) {
        if (this.addressList.length === 0) {
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
        this.collectInfo('workArea', this.riskWorkArea, 'start')
        this.$refs.pickerAddress.open();
      },
      // 解析选中的地址
      handleAddress(data) {
        this[`${this.addressKey}Province`] = `${data[0].name}-${data[1].name}-${data[2].name}`
        this[`${this.addressKey}A`] = data
        this.collectInfo('workArea', this.riskWorkArea)
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
        this.riskRecordInfo.userId = this.userId;
        this.riskRecordInfo.userName = this.userName;
        if (!this.profession.typeName) {
          this.$toast('请选择您的职业')
          return;
        } else if (!this.email || this.checkEmail(this.email)) {
          this.$toast('请输入有效的邮箱地址')
          return;
        } else if (!this.company || this.company.length < 4) {
          this.$toast('请输入您的公司名称')
          return;
        } else if (!this.companyMobile) {
          this.$toast('请按格式填写办公电话')
          return;
        } else if (!this.companyProvince) {
          this.$toast('请选择您的工作地区')
          return;
        } else if (!this.companyAddress || this.companyAddress.length < 4) {
          this.$toast('请输入详细工作地址')
          return;
        } else if (!this.familyName || this.checkName(this.familyName)) {
          this.$toast('请输入家庭联系人真实姓名')
          return;
        } else if (!this.familyPhone || this.checkPhone(this.familyPhone)) {
          this.$toast('请输入家庭联系人有效的手机号码')
          return;
        } else if (!this.familyRelation.typeName) {
          this.$toast('请选择家庭联系人关系')
          return;
        } else if (!this.otherName || this.checkName(this.otherName) || this.familyName === this.otherName) {
          this.$toast('请输入其他联系人真实姓名')
          return;
        } else if (!this.otherPhone || this.checkPhone(this.otherPhone) || this.familyPhone === this.otherPhone) {
          this.$toast('请输入其他联系人有效的手机号码')
          return;
        } else if (!this.otherRelation.typeName) {
          this.$toast('请选择其他联系人关系')
          return;
        }
        const param = {
          idEnt: this.identity,
          bankPhone: this.phone,
          bankNo: '',
          name: this.name,
          userId: this.userId,
          vocationName: this.profession.typeName, // 职业类型
          email: this.email,
          companyName: this.company, // 公司名称
          companyMobile: this.companyMobile, // 办公电话
          companyProvince: (this.companyA[0] && this.companyA[0].name) || this.companyProvince.split('-')[0], // 公司省
          companyCity: (this.companyA[0] && this.companyA[1].name) || this.companyProvince.split('-')[1], // 公司市
          companyRegion: (this.companyA[0] && this.companyA[2].name) || this.companyProvince.split('-')[2], // 公司县
          companyAddress: this.companyAddress, // 公司详细地址
          familyName: this.familyName, // 家庭联系人
          familyPhone: this.familyPhone,
          familyRelation: this.familyRelation.typeName,
          // familyRelationCode: this.familyRelation.personType,
          otherName: this.otherName,
          otherPhone: this.otherPhone,
          otherRelation: this.otherRelation.typeName,
          latitude: this.mapDetail.lat,
          longitude: this.mapDetail.lng,
          liveAddress: this.mapDetail.addr ? `${this.mapDetail.province}${this.mapDetail.addr}` : `${this.mapDetail.province}${this.mapDetail.city}${this.mapDetail.district || ''}`,
          riskRecordInfo: this.riskRecordInfo,
          personBaseInfoId: this.personBaseInfoId
        };
        const res = await this.$api.credit.addPersonInfo(param)
        if(res.code === 'sc0') {
          if (res.data && res.data.activeStatus === "0") {
            this.$toast({
              message: res.message,
              position: 'bottom'
            })
            // this.$router.replace({path:'/liveAc'})
            this.$emit('submitForm', param);
            return;
          }
          this.$router.replace({path:'/bankInfo'})
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
        }
      },
      // 采集风控数据
      collectRiskInfo(key, data) {
        const param = {
          content: data.content,
          howLong: data.end - data.start,
          writeTime: data.end
        }
        this.riskRecordInfo[key].push(param)
      },
      // 采集信息
      collectInfo(key, data, type) {
        switch (key) {
          case 'detailAddress':
            data.content = this.companyAddress
            break;
          case 'email':
            data.content = this.email
            break;
          case 'homeContact':
            data.content = this.familyName
            break;
          case 'homeContactPhone':
            data.content = this.familyPhone
            break;
          case 'otherContact':
            data.content = this.otherName
            break;
          case 'otherContactPhone':
            data.content = this.otherPhone
            break;
          case 'areaCode':
            data.content = this.companyMobile1
            break;
          case 'phone':
            data.content = this.companyMobile2
            break;
          case 'extensionNumber':
            data.content = this.companyMobile3
            break;
          case 'profession':
            data.content = this.profession.typeName
            break;
          case 'homeContactRelation':
            data.content = this.familyRelation.typeName
            break;
          case 'otherContactRelation':
            data.content = this.otherRelation.typeName
            break;
          case 'workArea':
            data.content = this.companyProvince
            break;
        }
        if (type === 'start') {
          data.start = formatDateTime()
        } else {
          data.end = formatDateTime()
          // this.riskCompany.end - this.riskCompany.start
          this.collectRiskInfo(key, data)
        }
      },
      // 获取公司校验开关
      async getFnConfigure() {
        const param = {
          key: 'company_inspection',
          userId: this.userId,
        }
        const res = await this.$api.credit.getFnConfigure(param);
        if(res.code === 'sc0' || res.code === '0') {
          this.isOpen = res.data.isOpen;
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import './personInfo.scss';
</style>
