<template>
  <div class="page-layout">
    <!-- 账单头部 -->
    <div class="page-header">
      <!-- 月份选择器 -->
      <month-selector :systemTime="systemTime" @onActiveSetMonth="setMonth"/>
      <!-- 账单头部信息 -->
      <div class="bill-head-info" v-if="hasRepayItems">
        <p>剩余待还 (元）</p>
        <h1>
          {{priceFormat(billListData.repayAmt)[0]}}.{{priceFormat(billListData.repayAmt)[1]}}
          <label v-if="billListData.status === '1'">已逾期</label>
        </h1>
        <p v-if="hasRepayItems">最后还款日<span>{{billListData.payDate || "-"}}</span></p>
      </div>
      <div class="bill-head-info bill-clear" v-if="overRepayItems">
        <img src="./images/bill-clear.png">
        <h2>账单已还清</h2>
        <p>棒棒的，继续保持哦</p>
      </div>
      <div class="bill-head-info bill-clear none" v-if="hasNotRepayItems">
        <img src="./images/none.png">
        <p>暂无账单，去下一单试试吧</p>
        <button @click="toIndex">去逛逛</button>
      </div>

    </div>
    <!-- 账单 -->
    <div class="page-content" v-if="billListData">
      <bill-list :billList="billListData.items || []" @onSelected="handleSelected" />
    </div>
    <!-- 底部按钮 -->
    <div class="page-footer" v-if="hasRepayItems">
      <div :class="'bottom-button ' + isDisable" flex-row-center @click="toCashier">
        立即还款
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import MonthSelector from './components/MonthSelector'
  import BillList from './components/BillList'
  export default {
    name: "Home",
    components: {
      BillList,
      MonthSelector
    },
    data() {
      return {
        billListData: null,
        activeInfo: null,
        systemTime: null,
        currentDate: null,
        isDisable: ""
      }
    },
    computed: {
      ...mapState({
        idPerson: state => state.global.userInfo.idPerson,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        userId: state => state.global.userInfo.userId
      }),
      // 有账单
      hasRepayItems() {
        return  this.billListData && this.billListData.items && this.billListData.items.length && this.billListData.status !== '2'
      },
      // 没有账单
      hasNotRepayItems() {
        return  this.billListData && this.billListData.items && !this.billListData.items.length && this.billListData.status !== '2'
      },
      // 账单已结清
      overRepayItems() {
        return  this.billListData && this.billListData.items && this.billListData.items.length && this.billListData.status === '2'
      }
    },
    created() {
      this.getServerTime()
      // this.getMoneyFirstMonth()
    },
    watch: {
      currentDate(newVal) {
        if (newVal) {
          this.getBillInfo()
        }
      }
    },
    methods: {
      // 获取当前服务器日期
      async getServerTime() {
        await this.$api.getServerTime().then(res => {
          if (res.code === 'sc0') {
            this.systemTime = res.data
          } else {
            this.$toast(res.message)
          }
        })
      },
      // 处理选择的日期
      setMonth(date) {
        this.currentDate = date
      },
      // 价格格式化
      priceFormat(price) {
        const value = price ? price.toString() : "0";
        if (value.indexOf('.') !== -1) {
          return value.split('.');
        } else {
          return [value, '00'];
        }
      },
      // 去首页
      toIndex() {
        this.$nativeBridge.jumpToAppIndex()
      },
      handleSelected() {

      },
      // 获取授信状态
      async getMoneyFirstMonth() {
        await this.$api.getAHPintecFristRepeyment({
          ucAccountId: this.ucAccountId
        }).then(res => {
          if (res.code === 'sc0') {
            this.activeInfo = res.data
          } else {
            this.$toast(res.message)
          }
        })
      },
      // 获取账单
      getBillInfo() {
        this.$api.queryJYBRepaymentList({
          billTime: this.currentDate,
          idPerson: this.idPerson,
          ucAccountId: this.ucAccountId,
          userId: this.userId
        }).then(res => {
          if (res.code === 'sc0') {
            this.billListData = res.data ? res.data : []
            this.isDisable = res.data.repayStatus === 1 ? "" : "disable"
          } else {
            this.$toast(res.message)
          }
        })
      },
      // 去还款
      toCashier() {
        if (!this.billListData.repayStatus)  return
        // 调起原生
        console.log({
          repayDate: this.billListData.payDate,
          repayAmt: this.billListData.repayAmt,
          originOrderId: this.billListData.billId,
          funding: this.billListData.funding,
          businessType: this.billListData.businessType
        })
        this.$nativeBridge.jumpToCashier({
          repayDate: this.billListData.payDate,
          repayAmt: this.billListData.repayAmt,
          originOrderId: this.billListData.billId,
          funding: this.billListData.funding,
          businessType: this.billListData.businessType
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/index.scss';
  /deep/ .mint-toast{
    max-width: 90%;
    display: block;
    & span{
      line-height: 1.5;
    }
  }
  .page-layout{
    height: 100%;
    background-color: #f2f2f2;
  }
  .bill-head-info{
    padding: .6rem 0;
    background-color: #fff;
    text-align: center;
    &.bill-clear{
      padding: .24rem 0;
      &.none{
        background-color: #f2f2f2;
        margin-top: 1rem;
        button {
          -webkit-appearance: none;
          border: none;
          margin-top: .3rem;
          width: 2.2rem;
          height: .66rem;
          line-height: .66rem;
          background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
          color: #fff;
          font-size: .3rem;
          border-radius: .6rem;
        }
        p{
          color:#a8a8a8;
          font-size: .3rem;
          margin-top: .2rem;
        }
        img{
          display: inline-block;
          width: 1.88rem;
          height: auto;
        }
      }
    }
    & p{
      font-size: .26rem;
      color: #363636;
      line-height: 1;
      & span{
        color: #D09E54;
      }
    }
    & img{
      width: 1.5rem;
      display: inline-block;
    }
    & h2{
      font-size: .36rem;
      color: #363636;
      text-align: center;
      margin: .16rem 0 .14rem 0;
    }
    & h1{
      font-size: .72rem;
      color: #363636;
      font-weight: 600;
      line-height: 1;
      margin: .1rem 0 .2rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      & label{
        width: .9rem;
        height: .32rem;
        display: inline-block;
        line-height: .32rem;
        text-align: center;
        margin-left: .12rem;
        font-size: .22rem;
        @include bg-image('./images/label');
        background-size: 100% 100%;
        color: #fff;
      }
    }
  }
  .page-content{
    margin-top: .18rem;
    padding-bottom: 1.5rem;
    & h3{
      background-color: #f2f2f2;
      line-height: 3;
      font-size: .26rem;
      color: #363636;
      padding-left: .3rem;
    }
  }

  .page-footer {
    position: fixed;
    bottom: .3rem;
    left: 0;
    width: 100%;
    padding: .3rem;
    .bottom-button {
      width: 100%;
      height: .92rem;
      border-radius: .1rem;
      -webkit-appearance: none;
      border: none;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      background-size: 100% 100%;
      width: 100%;
      color: #fff;
      font-size: .36rem;
      &.disable{
        background: #a8a8a8;
      }
    }
  }
</style>
