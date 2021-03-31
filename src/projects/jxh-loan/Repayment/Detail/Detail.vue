<template>
  <div class="inner-body" v-if="pageData">
    <div class="order">
      <div class="order-msg">
        <p>借款单号{{pageData.id}}</p>
        <p>{{pageData.applyTime}}</p>
      </div>
      <div class="loan-msg">
        <div class="inner">
          <div class="txt">
            <p class="p1">借款金额(元)</p>
            <p class="p2">{{pageData.loanAmt}}</p>
          </div>
          <i class="icon" v-if="pageData.shouldRepayCount < 1 && isOrderSettle"></i>
        </div>
        <div class="p3">
          <p>分期期数{{pageData.term}}个月</p>
          <p class="icon" @click="goLoanDetail(pageData.mallOrderId)">详情</p>
        </div>
      </div>
    </div>
    <div class="list-tt">
      <p>还款详情</p>
      <p>剩余<span>{{pageData.shouldRepayCount}}期</span>待还</p>
    </div>
    <div class="list">
      <div class="list-ul">
        <template>
          <div :class="item.finished ? 'list-li dis' : 'list-li'" v-for="(item, index) in pageData.paymentSchedules"
               :key="index">
            <!-- <i class="ck-lab" v-if="item.finished"></i>
            <div class="icon-checkbox" v-else>
            <input type="checkbox" v-model="checkAry" :value="item.seq">
            <i class="icon"></i>
            </div> -->
            <div class="date">
              <p class="p1">{{item.payDate}}</p>
              <p class="p2">{{item.seq}}/{{pageData.term}}期</p>
            </div>
            <div class="pay">
              <p>{{item.shouldRepayAmt}}</p>
              <p v-if="item.finished">已结清</p>
              <p v-else-if="item.remainingDays*1 < 0" class="p2">已逾期</p>
              <p v-else class="p2">剩余{{item.remainingDays}}天</p>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="footer" v-if="isShowRepay">
      <!-- <label class="icon-checkbox" v-if="pageData.shouldRepayCount > 1" @click="setAllCheck">
        <input type="checkbox" v-model="allChecked">
        <i class="icon"></i>全选
      </label> -->
      <p class="total" v-if="checkTotal">合计:{{checkTotal.shouldRepayAmt}}</p>
      <p class="bnt" @click="submitRepay">立即还款</p>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {Toast} from 'mint-ui';
  import env from '@/helpers/env';
  import {redirectToLoginPage} from '@/helpers/utils';

  export default {
    components: {Toast},
    data() {
      return {
        allChecked: false,
        pageData: null,
        checkAry: [],
        allList: [],
        checkedTerm: null,
        isShowRepay: false
      }
    },
    beforeMount() {
    },
    watch: {
      checkAry: function (a) {
        console.log(a);
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
      }),
      // 订单是否结清
      isOrderSettle() {
        if (this.pageData && ['20', '21', '22', '23','1400'].includes(this.pageData.orderStatus)) {
          return true
        }
        return false
      }
    },
    created() {
      this.getBillDetail();
    },
    mounted() {
    },
    methods: {
      async getBillDetail() {
        // 获取账单详情
        if (!this.$route.query.originOrderId) {
          this.$toast('缺少参数，请重新进入页面')
          return false;
        }
        let params = {
          originOrderId: this.$route.query.originOrderId
        }
        if(this.$route.query.product === 'XYG'){
          params.putSource = 'XYG'
        }
        let res = await this.$api.queryXjdBillDetailHttp(params);
        if (res.code === 'sc0' && res.data) {
          if (res.data.shouldRepayCount > 0) {
            this.checkTotal = res.data.paymentSchedules.find(item => {
              return !item.finished
            });
            if (this.checkTotal) {
              this.checkAry = [this.checkTotal.seq];
            }
          }
          this.pageData = res.data;
        }
        else {
          if(!res.message){
            res.message = '网络错误'
          }
          this.$toast(res.message);
        }
      },
      goLoanDetail(id) {
        // 去借款详情
        this.$router.push({
          path: '/loan-detail',
          query: {
            orderNo: id,
            product: this.$route.query.product
          }
        });
      },
      submitRepay() {
        if (env.isJXHAPP()) {
          this.$nativeBridge.jumpNative('billToCashier', {
            repayDate: this.checkTotal.payDate,
            repayAmt: this.checkTotal.shouldRepayAmt,
            originOrderId: this.pageData.id,
            funding: this.pageData.putoutOrg,
            term: this.checkTotal.seq,
            creditStatus: 1000,
            businessType: 'JXH'
          })
        } else {
          this.$toast('请到吉享花APP还款')
        }

      },
    },
    beforeDestroy() {
    }
  }
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>// scoped
.inner-body {
  width: 100%;
  height: inherit;
  min-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background: #f2f2f2;
  .order {
    flex-shrink: 0;
    height: 3.2rem;
    background: #fff;
    padding-left: 0.3rem;
    .order-msg {
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.74rem;
      color: #a8a8a8;
      padding-right: 0.3rem;
    }
    .loan-msg {
      padding: 0.3rem 0;
      padding-right: 0.3rem;
      .inner {
        display: flex;
        justify-content: space-between;
        .icon {
          flex-shrink: 0;
          width: 1.34rem;
          height: 1.12rem;
          background: url(./images/icon-a.png) center no-repeat;
          background-size: 100% auto;
        }
      }
      .p1 {
        font-size: 0.28rem;
        line-height: 0.4rem;
      }
      .p2 {
        font-size: 0.62rem;
        line-height: 0.88rem;
        font-weight: 600;
        margin: 0.06rem 0 0.16rem 0;
      }
      .p3 {
        font-size: 0.24rem;
        line-height: 0.34rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon {
          background: url(./../../images/rower.png) right center no-repeat;
          background-size: auto 50%;
          padding-right: 0.25rem;
        }
      }
    }
  }
  .list-tt {
    flex-shrink: 0;
    height: 0.68rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.3rem;
    color: #868686;
    span {
      color: #363636;
    }
  }
  .footer {
    flex-shrink: 0;
    height: 1rem;
    overflow: hidden;
    background: #fff;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0.3rem;
    position: fixed;
    z-index: 99;
    left: 0;
    bottom: 0;
    .bnt {
      width: 2.2rem;
      height: 1rem;
      background-color: #BA9950;
      text-align: center;
      line-height: 1rem;
      color: #fff;
      font-size: 0.32rem;
      font-weight: 500;
    }
    .total {
      font-size: 0.32rem;
      font-weight: 500;
    }
  }
  .list {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    margin-bottom: 1.98rem;
    .list-ul {
      padding-left: 0.3rem;
      background: #fff;
      .list-li {
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        padding: 0.36rem 0;
        padding-right: 0.3rem;
        .date {
          width: 100%;
          padding: 0 0.2rem;
          .p1 {
            font-size: 0.28rem;
            font-weight: 500;
            line-height: 0.4rem;
          }
          .p2 {
            font-size: 0.24rem;
            color: #a8a8a8;
          }
        }
        .pay {
          flex-shrink: 0;
          text-align: right;
          font-size: 0.32rem;
          .p1 {
            font-size: 0.32rem;
            font-weight: 500;
            line-height: 0.44rem;
          }
          .p2 {
            font-size: 0.22rem;
            color: #a8a8a8;
          }
        }
      }
      .dis {
        .ck-lab {
          flex-shrink: 0;
          width: 0.44rem;
          height: 0.44rem;
          background: url(./images/checkbox-dis.png) center no-repeat;
          background-size: 100% auto;
        }
      }
    }
  }
  .icon-checkbox {
    line-height: 0.44rem;
    input[type="checkbox"] {
      display: none;
    }
    input[type="checkbox"] + .icon {
      width: 0.44rem;
      height: 0.44rem;
      border-radius: 0.44rem;
      border: 0.04rem solid #cbcbcb;
      display: inline-block;
      vertical-align: middle;
      margin-top: -0.05rem;
      margin-right: 0.15rem;
    }
    input[type="checkbox"]:checked + .icon {
      border: none;
      background: url(./images/checkbox.png) center no-repeat;
      background-size: 100% auto;
    }
  }
}
</style>


