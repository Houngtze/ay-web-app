<template>
<div class="inner-body">
  <div class="header">
    <div class="tp-menu">
      <div class="bnt" @click="innerLink('/repayment/loan-list')">
        <i class="icon icon-loan"></i>
        <p>借款记录</p>
      </div>
      <div class="bnt" @click="innerLink('/repayment/repay-list')">
        <i class="icon icon-repayment"></i>
        <p>还款记录</p>
      </div>
    </div>
  </div>
  <div class="menu">
    <div class="menu-li" @click="innerLink('/order-list')">
      <p>待确认订单</p>
      <span class="red" v-if="orderNum">{{orderNum}}</span>
      <i class="icon"></i>
    </div>
    <div v-if="loanList && loanList.orderStatus === '3' && loanList.isShowPatchButton" class="menu-li" @click="goToPatch(loanList.mallOrderId)">
      <p>待补件订单</p>
      <i class="icon"></i>
    </div>
    <div class="menu-li" @click="kfModel = true">
      <p>联系客服</p>
      <i class="icon"></i>
    </div>
  </div>
  <customer-service-dialog :kfModel="kfModel" @handleCustomerDialog="handleCustomerDialog"></customer-service-dialog>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import customerServiceDialog from './../components/customerServiceDialog'
export default {
  components: {
    customerServiceDialog
  },
  data(){
    return{
      kfModel: false,
      total:'--',
      loanList:null,
      orderNum:null,
    }
  },
  beforeMount(){
  },
  watch:{
  },
  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      personId: state => state.global.userInfo.idPerson,
    }),
  },
  created() {
    this.getTotal();
    this.getLoanList();
    this.getOrder();
  },
  mounted(){
  },
  methods:{
    innerLink(url){
      this.$router.push(url);
    },
    handleCustomerDialog(){
      this.kfModel = false;
    },
    async getTotal(){
      // 获取全部待还
      if(!this.personId){
        this.$toast('用户未实名');
        return false;
      }
      let params = {
        personId: this.personId,
        businessType: 'JXH'
      };
      let res = await this.$api.queryXjdRemainSumAmtHttp(params);
      if(res.code === 'sc0' && res.data){
        this.total = res.data.remainSumAmt;
      }
      else{
        this.$toast(res.message);
      }
    },
    async getLoanList(){
      if(!this.personId){
        this.$toast('用户未实名');
        return false;
      }
      const params = {
        personId: this.personId,
        productCode: 'JXH',
        orderType: 2,
        queryFlag: 2
      }
      const res = await this.$api.queryOrdersListHttp(params);
      if(res.code === 'sc0' && res.data && res.data.length > 0){
        this.loanList = res.data[0];
      }
    },
    goToPatch(orderNo){
      // 去资金方补件
      this.innerLink({
        path:'/patch',
        query:{
          mallOrderId:orderNo,
        }
      });
    },
    async getOrder(){
      const params = {
        userId: this.userId,
        status: 0,
      }
      const res = await this.$api.listGiftOrdersHttp(params);
      if(res.code === 'sc0' && res.data && res.data.length){
        this.orderNum = res.data.length;
      }
    }
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>// scoped
.inner-body{
  width: 100%;
  height: inherit;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;
  flex-direction: column;
  background: #fff;
  .header{
    height: 2.38rem;
    background: url(./images/tp-bg.png) center no-repeat;
    background-size: 100% 100%;
    padding: 0.8rem 0.4rem 0.3rem;
    
    .tp-total{
      height: 1.04rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: #fff;
      font-size: 0.24rem;
      .icon{
        width: 0.14rem;
        height: 0.22rem;
        background: url(./../images/rower-w.png) center no-repeat;
        background-size: 100% 100%;
        margin-left: 0.1rem;
      }
    }
    .tp-menu{
      display: flex;
      justify-content: center;
      align-items: center;
      .bnt{
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .icon{
          width: 0.72rem;
          height: 0.72rem;
          background: center no-repeat;
          background-size: 100% auto;
        }
        .icon-loan{
          background-image: url(./images/icon-b.png);
        }
        .icon-repayment{
          background-image: url(./images/icon-a.png);
        }
        p{
          font-size: 0.32rem;
          line-height: 0.44rem;
          font-weight: 500;
        }
      }
    }
  }
  .menu{
    padding: 0.5rem 0 0 0.3rem;
    .menu-li{
      height: 1.5rem;
      border-bottom: 1px solid #eeeeee;
      display:flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 0.3rem;
      p{
        font-size: 0.32rem;
        font-weight: 500;
        width: 100%;
      }
      .red{
        width: 0.4rem;
        height: 0.4rem;
        overflow: hidden;
        text-align: center;
        line-height: 0.38rem;
        background: #FF0000;
        color: #fff;
        font-size: 0.24rem;
        display: inline-block;
        border-radius: 0.4rem;
        margin-right: 0.1rem;
      }
      .icon{
        width: 0.12rem;
        height: 0.22rem;
        background: url(./../images/rower.png) center no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>


