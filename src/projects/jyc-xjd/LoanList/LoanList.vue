<template>
<div class="jyc-xjd">
  <div class="content-main">
    <div class="list-ul">
      <div class="list-li" v-for="(item ,index) in listData" :key="index">
        <div class="tp-msg" @click="goToDetail(item.mallOrderId)">
          <div class="msg">
            <p>申请日期：{{showTimer(item.createDate)}}</p>
            <p>订单号：{{item.mallOrderId}}</p>
            <p>借款金额：{{item.loanAmt}}元</p>
          </div>
          <div class="st">{{returnStatice(item.orderStatus, item.isWithdrawal)}}</div>
          <i class="arrow"></i>
        </div>
        <!-- <p class="bnt" @click="goToBind(item.mallOrderId)" v-if="item.isBindCard === false && item.orderStatus !== '50'">绑定收款银行卡</p> -->
        <p class="bnt" @click="goToPatch(item.mallOrderId)" v-if="item.orderStatus === '3' && item.isShowPatchButton">完善放款信息（必要）</p>
        <p class="bnt" @click="goToLoan(item.mallOrderId,item.id,item.funding)" v-else-if="(item.orderStatus === '1' && item.isWithdrawal !== 'Y') || item.orderStatus === '53' || item.orderStatus === '50'">提现到个人账户</p>
        <p class="bnt" @click="goToPay(item.mallOrderId)" v-else-if="item.orderStatus === '7' && item.orderStatus !== '50'">开通提现加速会员，立即到账</p>
        <!--  <p class="bnt">立即提现</p>
        <p class="bnt">重新申请</p>
        <p class="bnt">继续借款</p> -->
      </div>
    </div>
  </div>
  <footer-link></footer-link>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage ,timestampToTime} from '@/helpers/utils';
import FooterLink from './../components/NewFooter'
export default {
  components: {
    FooterLink
  },
  data(){
    return{
      tabHover:true,
      productEncash:0,
      ultimaEncash:0,
      listData:[],
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
      ucAccountId: state => state.global.userInfo.ucAccountId,
      clientCode: state => state.global.clientCode
    }),
  },
  created() {
    this.getPageData();
  },
  mounted(){
  },
  methods:{
    ...mapActions('base', [
      'set_txUsableLimit'
    ]),
    async getPageData(){
      const params = {
        personId: this.personId,
        productCode: 'AMFT',
        orderType: 2
      }
      const res = await this.$api.queryOrdersListHttp(params);
      if(res.code === 'sc0' && res.data){
        this.listData = res.data;
      }
      else{
        this.$toast(res.message);
      }
    },
    goLink(url) {
      // 跳转页面
      this.$router.push(url);
    },
    goToDetail(id){
      this.$router.push({
        path: '/loan-detail',
        query:{
          orderNo: id,
        }
      });
    },
    returnStatice(str, isWithdrawal){
      str = str*1;
      // 返回订单状态
      if(str === 0){
        return '预进件';
      }
      else if(str === 1 && isWithdrawal === 'Y'){
        return '提现成功';
      }
      else if(str === 1){
        return '放款成功';
      }
      else if(str === 2){
        return '放款失败';
      }
      else if(str === 3){
        return '放款中';
      }
      else if(str === 4){
        return '借款申请流程中被拒';
      }
      else if(str === 5){
        return '首付成功';
      }
      else if(str === 6){
        return '审核中';
      }
      else if(str === 7){
        return '审核通过';
      }
      else if(str === 8){
        return '审核拒绝';
      }
      else if(str === 10){
        return '放款失败';
      }
      else if(str === 11){
        return '提前还款';
      }
      else if(str === 12){
        return '逾期';
      }
      else if(str === 13){
        return '强制还款';
      }
      else if(str === 20){
        return '提前结清';
      }
      else if(str === 21){
        return '正常结清';
      }
      else if(str === 22){
        return '逾期结清';
      }
      else if(str === 23){
        return '强制结清';
      }
      else if(str === 31){
        return '初审通过';
      }
      else if(str === 32){
        return '初审拒绝';
      }
      else if(str === 41){
        return '授信申请流程中被拒';
      }
      else if(str === 50){
        return '提现中';
      }
      else if(str === 51){
        return '提现成功';
      }
      else if(str === 53){
        return '提现失败';
      }
      else if(str === 99){
        return '信用付全额退款';
      }
    },
    goToPay(orderNo){
      this.goLink({
        path:'/result-pay',
        query:{
          lno:orderNo
        }
      });
    },
    showTimer(str){
      return timestampToTime(str);
    },
    goToLoan(orderNo,id,funding){
      // 去提现
      this.goLink({
        path:'/result-loan',
        query:{
          mallOrderId:orderNo,
          loanOrderId:id,
          funding:funding
        }
      });
    },
    goToBind(orderNo){
      // 去提现
      this.goLink({
        path:'/bind-bank',
        query:{
          orderNo:orderNo,
        }
      });
    },
    goToPatch(orderNo){
      // 开户列表
      this.goLink({
        path:'/patch',
        query:{
          mallOrderId:orderNo,
        }
      });
    }
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>// scoped
.jyc-xjd{
  width: 100%;
  height: inherit;
  min-height: 100%;
  .header{
    height: 0.6rem;
    line-height: 0.6rem;
    flex-shrink: 0;
    background: #FFF8ED;
    padding: 0 0.3rem;
    color: #D1A056;
    font-size: 0.24rem;
  }
  .content-main{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .list-ul{
      .list-li{
        background: #fff;
        border-bottom: 0.2rem solid #f2f2f2;
        align-items: center;
        padding: 0.3rem 0.3rem 0 0.3rem;
        .tp-msg{
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          padding-bottom: 0.15rem;
          .st{
            flex-shrink: 0;
            color: #D1A056;
          }
          .arrow{
            width: 0.14rem;
            height: 0.22rem;
            flex-shrink: 0;
            background: url(./../images/rower@2x.png) center no-repeat;
            background-size: 100% auto;
            margin-left: 0.2rem;
          }
        }
        .msg{
          width: 100%;
          padding-right:0.2rem;
          p{
            font-size: 0.24rem;
            color: #363636;
            line-height: 0.24rem;
            margin-bottom: 0.15rem;
          }
        }
        .bnt{
          flex-shrink: 0;
          height: 0.92rem;
          text-align: center;
          line-height: 0.92rem;
          border-radius: 0.1rem;
          background:linear-gradient(270deg,rgba(208,158,84,0.99),rgba(225,188,120,0.99));
          color: #fff;
          font-size: 0.36rem;
          margin: 0.1rem 0 0.3rem 0;
        }
      }
    }
  }
  .footer{
    text-align: center;
    flex-shrink: 0;
    height: 0.98rem;
    line-height: 0.98rem;
    .sp{
      color: #D1A056;
      margin: 0 0.1rem;
      font-size: 0.24rem;
    }
  }
}
</style>


