<template>
  <div class="page-layout">
    <progress-bar :activeStep="2" :progressArr="progressArr"></progress-bar>
    <!-- 页面内容 -->
    <div class="page-content">
      <ul>
        <h3>资产信息</h3>
        <li @click="openPop('projectName')" class="loan-item">
          <mt-field label="项目名称" v-model="applyForm.projectName"
                    placeholder="请选择" disabled></mt-field>
          <span class="noVal"></span>
        </li>
        <li class="loan-item"><mt-field label="项目地址" v-model="applyForm.projectAddress" placeholder="请输入项目地址"></mt-field></li>
        <li class="loan-item"><mt-field label="资产详情" v-model="applyForm.assetDetails" placeholder="请输入资产详情"></mt-field></li>
        <li class="loan-item"><mt-field label="总价" v-model="applyForm.orderAmount" placeholder="请输入商品总价" type="tel"></mt-field></li>
      </ul>
      <ul>
        <h3>分期信息</h3>
        <li class="loan-item"><mt-field label="首付" v-model="applyForm.downPaymentAmount" placeholder="请输入首付金额" type="tel"></mt-field></li>
        <li class="loan-item"><mt-field label="借款" v-model="applyForm.loanAmount" placeholder="请输入借款金额" type="tel"></mt-field></li>
        <li @click="openPop('paymentNum')" class="loan-item">
          <mt-field label="期数/年" v-model="applyForm.paymentNum"
                    placeholder="请选择" disabled></mt-field>
          <span class="noVal"></span>
        </li>
        <li class="loan-item" v-show="applyForm.effectiveInterestRate"><mt-field label="利率" v-model="applyForm.effectiveInterestRate" disabled></mt-field></li>
        <li class="loan-item" v-show="applyForm.calcType"><mt-field label="还款方式" v-model="applyForm.calcType" disabled></mt-field></li>
      </ul>
    </div>
    <div class="page-bottom-btn">
      <button @click="submitApplyLoan">提交</button>
    </div>
    <!-- 选项 -->
    <picker-pop
      :slotArr="slotList"
      @handleValue="handleValue"
      :title="popTitle"
      ref="pickerPop">
    </picker-pop>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {imgCompression, formatDateTime} from '@/helpers/utils'
  import ProgressBar from '@/components/ProgressBar'
  import PickerPop from "@/components/jxh/jxh-credit/components//PickerPop"

  export default {
    name: "applyLoan",
    components: {
      ProgressBar,
      PickerPop
    },
    data() {
      return {
        slotList: [],
        productOption: [],
        selectType: "projectName",
        progressArr: [
          {text: "身份认证"},
          {text: "个人信息"},
          {text: "分期信息"}
        ],
        applyForm: {
          projectName: "",
          projectAddress: "",
          assetDetails: "",
          effectiveInterestRate: "",
          calcType: "",
          paymentNum: "",
          orderAmount: "",
          loanAmount: "",
          downPaymentAmount: ""
        }
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        accountId: state => state.global.userInfo.accountId,
        idPerson: state => state.global.userInfo.idPerson,
        mobile: state => state.global.userInfo.phone
      }),
      popTitle() {
        return this.selectType === "projectName" ? "项目名称" : "期数"
      }
    },
    mounted() {
      this.getProductData()
    },
    methods: {
      // 封装打开pop框的方法
      async openPop(type) {
        this.selectType = type
        let list = this.productOption, arr
        if (type === "paymentNum") {
          if ((!this.applyForm.projectName)) {
            return this.$toast("请先选择项目")
          }
          list = list.find(item => {
            return item.projectName === this.applyForm.projectName
          })
          arr = list.qybProductItemChilds.map((item, index) => {
            return {
              index,
              val: item.paymentNum
            }
          })
        } else {
          arr = list.map((item, index) => {
            return {
              index,
              val: item.projectName
            }
          })
        }

        this.slotList = arr;
        this.$refs.pickerPop.open();
      },
      // 封装获取下拉框数据请求方法
      async getProductData() {
        const param = {
          optionType: "ZJD",
          userId: this.userId
        }
        const res = await this.$api.qybGetQybProOption(param);
        if (res.code === 'sc0' || res.code === '0') {
          this.productOption = res.data.qybProductItems
        } else {
          this.$toast(res.message)
        }
      },
      // 封装解析pop框选择的值
      handleValue(val, index) {
        if (this.selectType === "projectName") {
          this.$set(this.applyForm, "projectName", val)
          this.$set(this.applyForm, "paymentNum", "")
          this.$set(this.applyForm, "effectiveInterestRate", "")
          this.$set(this.applyForm, "calcType", "")
        } else {
          this.$set(this.applyForm, "paymentNum", val)
          // popup组件限制，只能重新筛选出选择的那一项
          const selectPaymentNum = this.productOption.find(item => {
            return item.projectName === this.applyForm.projectName
          })
          this.$set(this.applyForm, "effectiveInterestRate", selectPaymentNum["qybProductItemChilds"][index].effectiveInterestRate)
          this.$set(this.applyForm, "calcType", selectPaymentNum["qybProductItemChilds"][index].calcType)
        }
      },
      // 校验金额为正整数
      checkMoney(num) {
        const reg = /(^[1-9]\d*$)/
        debugger
        if (!(reg.test(num))) {
          return false
        }
        return true
      },
      async submitApplyLoan() {
        debugger
        if (!this.applyForm.projectName) {
          return this.$toast("请选择项目名称")
        } else if(!this.applyForm.projectAddress) {
          return this.$toast("请输入项目地址")
        } else if(!this.applyForm.assetDetails) {
          return this.$toast("请输入资产详情")
        } else if(!this.applyForm.orderAmount || !this.checkMoney(this.applyForm.orderAmount)) {
          return this.$toast("商品总价输入有误，请输入大于0的整数")
        } else if(!this.applyForm.downPaymentAmount || !this.checkMoney(this.applyForm.downPaymentAmount)) {
          return this.$toast("首付金额输入有误，请输入大于0的整数")
        } else if(!this.applyForm.loanAmount || !this.checkMoney(this.applyForm.loanAmount)) {
          return this.$toast("借款金额输入有误，请输入大于0的整数")
        } else if(!this.applyForm.paymentNum) {
          return this.$toast("请选择期数")
        } else if(!this.applyForm.effectiveInterestRate) {
          return this.$toast("利率出错")
        } else if(!this.applyForm.calcType) {
          return this.$toast("还款方式出错")
        }
        const param = {...this.applyForm, ...{
          term: this.applyForm.paymentNum,
          userId: this.userId
        }}
        const res = await this.$api.qybSubmitLoanApply(param)
        if (res.code === 'sc0' || res.code === "0") {
          this.$router.replace({path: "/creditResult"})
        } else {
          this.$toast(res.message)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/index.scss';

  .page-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    height: inherit;
    overflow-y: auto;
    ul {
      margin-bottom: 0.18rem;
      background-color: #fff;
      h3{
        padding: .22rem .34rem;
        font-size: .32rem;
        color:rgba(54,54,54,1);
        line-height: .44rem;
        font-weight: 600;
      }
      li {
        &.loan-item{
          display: flex;
          height: 1.02rem;
          align-items: center;
          padding: 0 0.3rem;
          border-bottom: 0.01rem solid rgba(238,238,238,1);
          background-color: #fff;
          /deep/ .mint-field{
            background-image: none;
            width: 100%;
            .mint-cell-text{
              font-size: 0.28rem;
            }
            .mint-cell-title{
              width: 1.38rem;
              margin-right: .48rem;
              font-size: 0.3rem;
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
          }
        }
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
