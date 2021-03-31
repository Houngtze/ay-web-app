<template>
  <div class="page-layout">
    <!--&lt;!&ndash; 账单头部 &ndash;&gt;-->
    <!--<div class="page-header" flex-center-center v-if="activeInfo">-->
      <!--<div class="header-content" v-if="activeInfo.createStatus  === 1000">-->
        <!--<p>可用额度（元）</p>-->
        <!--<h3>{{activeInfo.usablePostLimit || 0}}</h3>-->
        <!--<span>总额度{{activeInfo.totalPostLimit || 0}}</span>-->
      <!--</div>-->
      <!--<div class="header-content" v-else>-->
        <!--<p>最高额度（元）</p>-->
        <!--<h3>50000.00</h3>-->
        <!--<span>0首付/大额分期</span>-->
        <!--<button @click="toCredit">立即申请</button>-->
      <!--</div>-->
    <!--</div>-->
    <!-- 账单列表 -->
    <div class="page-content" v-if="billList.length">
      <!--<h3>全部账单</h3>-->
      <div class="bill-content">
        <BillList :billList="billList" @onSelected="handleSelected"/>
      </div>
    </div>
    <!-- 账单底部 -->
    <div class="page-footer g-mobile-border-top">
      <div class="bottom-content" flex-row-between>
        <h2>
          <span>还款金额</span>
          <p v-if="selectItem">
            <span>￥</span>
            <label>{{priceFormat(selectItem.repayMoney)[0]}}</label>
            <span>.{{priceFormat(selectItem.repayMoney)[1]}}</span>
          </p>
        </h2>
        <!--<button @click="toCashier">立即还款</button>-->
        <button :class="selectItem ? '' : 'can-not'" @click="toCashier">立即还款</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import BillList from './components/BillList'
  export default {
    name: "Home",
    components: {
      BillList
    },
    data() {
      return {
        billList: [],
        selectItem: null,
        activeInfo: null,
        currentBillData: []
      }
    },
    computed: {
      ...mapState({
        idPerson: state => state.global.userInfo.idPerson,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        sign: state => state.global.userInfo
      })
    },
    created() {
      this.getBillInfo()
      this.getMoneyFirstMonth()
    },
    methods: {
      // 处理点击项
      handleSelected(data) {
        this.currentBillData = []
        this.selectItem = data
      },
      // 价格格式化
      priceFormat(price) {
        const value = price.toString();
        if (value.indexOf('.') !== -1) {
          return value.split('.');
        } else {
          return [value, '00'];
        }
      },
      // 获取授信状态
      getMoneyFirstMonth() {
        this.$api.getAHPintecFristRepeyment({
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
        this.$api.queryAHPintecRepayments().then(res => {
          if (res.code === 'sc0') {
            this.billList = res.data ? res.data : []
          } else {
            this.$toast(res.message)
          }
        })
      },
      // 去授信
      toCredit() {
        this.$nativeBridge.jumpToCredit()
      },
      // 去还款数据判断，同一合同号下的账单只能换最早一期的账单
      handleRepayment() {
        if (!this.currentBillData.length) {
          this.billList.map(item => {
            if (item.originOrderId === this.selectItem.originOrderId) {
              this.currentBillData.push(item)
            }
          })
        }
        if (new Date(this.selectItem.payDate).getTime() > new Date(this.currentBillData[0].payDate).getTime()) {
          this.$toast({
            message: '该合同上一期未还清，不支持跨期还款，请按照期数依次还'
          })
          return false
        }else {
          return true
        }
      },
      // 去还款
      toCashier() {
        if (!this.selectItem) {
          this.$toast({
            message: '请勾选需要还款的合同'
          })
          return
        }
        // 处理账单数据
        if (!this.handleRepayment()) {
          return false
        }
        // 调起原生
        console.log({
          repayDate: this.selectItem.payDate,
          repayAmt: this.selectItem.repayMoney,
          originOrderId: this.selectItem.originOrderId,
          funding: this.selectItem.funding,
          creditStatus: this.activeInfo.createStatus,
          term: this.selectItem.seq,
          businessType: this.selectItem.businessType
        })
        this.$nativeBridge.jumpToCashier({
          repayDate: this.selectItem.payDate,
          repayAmt: this.selectItem.repayMoney,
          originOrderId: this.selectItem.originOrderId,
          funding: this.selectItem.funding,
          creditStatus: this.activeInfo.createStatus,
          term: this.selectItem.seq,
          businessType: this.selectItem.businessType
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
  .page-header{
    padding: .6rem;
    background-color: #fff;
    & .header-content{
      text-align: center;
    }
    & p{
      font-size: .26rem;
      color: #363636;
    }
    & h3{
      font-size: .72rem;
      color: #363636;
      font-weight: 600;
      line-height: 1;
      margin: .1rem 0 .2rem 0;
    }
    & span{
      font-size: .24rem;
      color: #a8a8a8;
      display: block;
    }
    & button{
      margin-top: .4rem;
      -webkit-appearance: none;
      border: none;
      background-color: transparent;
      @include bg-image('./images/header-btn');
      background-size: 100% 100%;
      width: 4.58rem;
      height: .98rem;
      font-size: .36rem;
      color: #fff;
      padding-bottom: .2rem;
    }
  }
  .page-content{
    padding-bottom: 1.5rem;
    & h3{
      background-color: #f2f2f2;
      line-height: 3;
      font-size: .26rem;
      color: #363636;
      padding-left: .3rem;
    }
  }
  .page-footer{
    z-index: 999;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .98rem;
    background-color: #fff;
    h2{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: .26rem;
      color: #363636;
      padding-left: .3rem;
      & p{
        color: #f63337;
        label{
          font-size: .36rem;
        }
      }
    }
    & button{
      -webkit-appearance: none;
      border: none;
      background-color: transparent;
      @include bg-image('./images/btn');
      color: #fff;
      font-size: .32rem;
      line-height: .98rem;
      width: 3rem;
      &.can-not{
        background-image: none;
        background-color: #d8d8d8;
      }
    }
  }
</style>
