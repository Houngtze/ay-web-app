<template>
  <div class="page-layout" v-if="pageShow">
    <!-- 数据面板 -->
    <main-panel :data="loanData" @onActiveChange="handleChange"/>
    <!-- 选择器 -->
    <option-selector :selectIndex="currentSelectorIndex" :data="data" @onActiveSelect="handleSelect" v-show="!isShowSubmit"/>
    <!-- 提交 -->
    <div v-show="isShowSubmit" class="submit">
      <template v-if="!submitSuccess">
        <button @click="submitLoan">提交</button>
      </template>
       <template v-else>
        <div class="submit-text">
          <h3><img src="./images/icon_complete@2x.png" />您的信息已提交成功 请耐心等待来电</h3>
          <p>申请过程有任何问题请联系客服咨询</p>
          <p>客服热线：0571-56234930 (服务时间：周一至周五 9:00-18:00)</p>
        </div>
        <button @click="toDc">更多优质放款通道 点击查看 <img src="./images/icon_arrow@2x.png"></button>
    </template>
    </div>
    <!-- 暂无申请资格 -->
    <error-dialog :is-visible.sync="isShowErrorDialog"></error-dialog>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from 'vuex';
  import MainPanel from "./components/MainPanel"
  import OptionSelector from "./components/OptionSelector"
  import ErrorDialog from "./components/ErrorDialog"

  export default {
    name: "Home",
    components: {
      MainPanel,
      OptionSelector,
      ErrorDialog
    },
    data() {
      return {
        data: [
          {
            selectorTitle: "选择贷款额度",
            panelTitle: "贷款额度：",
            type: "money",
            option: [{label: "2万", value: 20000}, {label: "5万", value: 50000}, {label: "10万", value: 100000}, {label: "20万", value: 200000}, {label: "50万", value: 500000}]
          },
          {
            selectorTitle: "选择贷款期限",
            panelTitle: "贷款期限：",
            type: "limit",
            option: [{label: "3年", value: 36}, {label: "2年", value: 24}, {label: "12个月", value: 12}, {label: "6个月", value: 6}, {label: "3个月", value: 3}]
          },
          {
            selectorTitle: "选择信用卡额度",
            panelTitle: "信用卡额度：",
            type: "credit_card_money",
            option: [{label: "30000元以上", value: 30001}, {label: "10000-30000元", value: 30000}, {label: "3000-10000元", value: 10000}, {label: "3000以下", value: 3000}, {label: "无", value: 0}]
          },
          {
            selectorTitle: "是否有本地社保",
            panelTitle: "是否有本地社保：",
            type: "sb_security",
            option: [{label: "连续缴纳3个月", value: 3}, {label: "连续缴纳6个月", value: 6}, {label: "连续缴纳1年", value: 12}, {label: "连续缴纳3年", value: 36}, {label: "连续缴纳5年以上", value: 60}, {label: "无", value: 0}]
          },
          {
            selectorTitle: "是否有本地公积金",
            panelTitle: "是否有本地公积金：",
            type: "sb_fund",
            option: [{label: "连续缴纳3个月", value: 3}, {label: "连续缴纳6个月", value: 6}, {label: "连续缴纳1年", value: 12}, {label: "连续缴纳3年", value: 36}, {label: "连续缴纳5年以上", value: 60}, {label: "无", value: 0}]
          },
          {
            selectorTitle: "名下是否有车产",
            panelTitle: "是否有车产：",
            type: "car",
            option: [{label: "有车，已抵押", value: 1}, {label: "有车，未抵押", value: 2}, {label: "无", value: 0}]
          },
          {
            selectorTitle: "名下是否有房产",
            panelTitle: "是否有房产：",
            type: "house",
            option: [{label: "有房产证，已抵押", value: 1}, {label: "有房产证，未抵押", value: 2}, {label: "无", value: 0}]
          },
          {
            selectorTitle: "名下是否有保单",
            panelTitle: "是否有保单：",
            type: "zy_insurance",
            option: [{label: "有", value: 1}, {label: "无", value: 0}]
          },
          {
            selectorTitle: "是否有微粒贷额度",
            panelTitle: "是否有微粒贷额度：",
            type: "wld_money",
            option: [{label: "1000-3000元", value: 3000}, {label: "5000-10000元", value: 10000}, {label: "10000-30000元", value: 30000}, {label: "30000-50000元", value: 50000}, {label: "50000-100000元", value: 100000}, {label: "无", value: 0}]
          },
        ],
        loanData: [],
        currentSelectorIndex: null,
        isShowSubmit: false,
        submitSuccess: false,
        isShowErrorDialog: false,
        pageShow: true
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        isVip: state => state.global.userInfo.isVip,
        source: state => state.global.source,
      }),
      ...mapState('credit', {
        creditStep: state => state.creditStep,
        activeStatus: state => state.creditStep && state.creditStep.activeStatus
      })
    },
    mounted() {
      this.getPageInit();
      this.currentSelectorIndex = 0
    },
    methods: {
      ...mapActions('credit', ['setCreditStep']),
      async getPageInit() {
        const param = {
          idPerson: this.personId,
          userId: this.userId,
          product: 'AMFT'
        };
        await this.setCreditStep(param);
        if ([1100, 70, 1000].includes(this.creditStep.activeStatus)) {
          this.getApplyStatus()
        } else {
          if (env.isApp()) {
            return this.$nativeBridge.jumpNative('billToCredit');
          } else {
            this.$toast({
              message: '请在爱用商城app中打开',
              duration: -1
            })
            this.pageShow = false
          }
        }
      },
      getApplyStatus() {
        this.$api.applyDuplicateCheck({
          userId: this.userId
        }).then(res => {
          if (res.code === "0" || res.code === "sc0") {
            if (res.data == false) {
              this.isShowErrorDialog = true
            }
          } else {
            this.$toast(res.message)
          }
        })
      },
      submitLoan() {
        let param = {}
        this.loanData.forEach(item => {
          param[item.type] = item.value
        })
        param.userId = this.userId
        this.$api.dajinApply(param).then(res => {
          if (res.code === "0" || res.code === "sc0") {
            this.submitSuccess = true
          } else {
            this.$toast(res.message)
          }
        })
      },
      handleSelect(data) {
        this.$set(this.loanData, this.currentSelectorIndex, data)
        if (this.loanData.length !== this.data.length) {
          if (this.currentSelectorIndex !== (this.loanData.length - 1)) {
            this.currentSelectorIndex = this.loanData.length
          } else {
            this.currentSelectorIndex = this.currentSelectorIndex  + 1
          }
        } else {
          this.isShowSubmit = true
        }
      },
      handleChange(data) {
        this.currentSelectorIndex = data
        this.isShowSubmit = false
      },
      toDc() {
        window.location.href = window.location.origin + "/custom-page/jyc-xjd/#/org-loan-list"
      }
    }
  }
</script>
<style lang="scss" scoped>
.page-layout{
  padding: .3rem;
  width: 100%;
}
  .submit{
    .submit-text{
      width: 100%;
      min-height: 1.8rem;
      background: #FFFFFF;
      border-radius: .16rem;
      text-align: left;
      padding: .29rem .32rem;
      color: #363636;
      margin-bottom: .31rem;
      h3{
        font-size: .32rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: left;
        img{
          display: inline-block;
          margin-right: .05rem;
          width: .4rem;
        }
      }
      p{
        font-size: .22rem;
      }
    }
    button{
      -webkit-appearance: none;
      border: none;
      width: 100%;
      line-height: .9rem;
      background: linear-gradient(90deg, #E1BC78 0%, #D09E54 100%);
      border-radius: .44rem;
      color: #fff;
      font-size: .36rem;
      text-align: center;
      img{
        width: .28rem;
        line-height: .9rem;
        display: inline-block;
      }
    }
  }
</style>


