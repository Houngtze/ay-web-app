<template>
<div class="jyc-xjd">
  <div class="content-main">
    <div class="list-ul" v-if="listData && listData.length>0">
      <div class="list-li" v-for="(item ,index) in listData" :key="index">
        <div class="tp-msg" @click="goWhere(item)">
          <div class="msg">
            <p class="p1">{{item.loanAmt}}元</p>
            <p class="p-col">订单号 {{item.mallOrderId}}</p>
          </div>
          <div class="st">
            <p>{{showTimer(item.createDate)}}</p>
            <p class="p-col">{{returnStatice(item.orderStatus, item.isWithdrawal)}}</p>
          </div>
          <i class="arrow"></i>
        </div>
        <!-- <p class="bnt" @click="goToBind(item.mallOrderId)" v-if="item.isBindCard === false && item.orderStatus !== '50'">绑定收款银行卡</p> -->
        <p class="bnt" @click="goToPatch(item.mallOrderId)" v-if="item.orderStatus === '3' && item.isShowPatchButton">完善放款信息（必要）</p>
        <p class="bnt" @click="goToLoan(item.mallOrderId,item.id,item.funding)" v-else-if="(item.orderStatus === '1' && item.isWithdrawal !== 'Y') || item.orderStatus === '53' || item.orderStatus === '50'">提现到个人账户</p>
        <p class="bnt" @click="goToPay(item.mallOrderId)" v-else-if="item.orderStatus === '7' && item.orderStatus !== '50'">开通提现加速会员，立即到账</p>
        <p class="bnt" @click="goToDownLoad(item.mallOrderId)" v-else v-show="!isApp">请下载app进行还款</p>
        <!--  <p class="bnt">立即提现</p>
        <p class="bnt">重新申请</p>
        <p class="bnt">继续借款</p> -->
      </div>
    </div>
    <div class="list-ul-empty" v-else>
      <img src="./images/empty@2x.png">
      <p>暂无记录</p>
    </div>
  </div>
</div>
</template>
<script>
  import env from '@/helpers/env';
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage ,timestampToTime} from '@/helpers/utils';
import { type } from 'os';
export default {
  props: [
    'type'
  ],
  components: {
  },
  data(){
    return{
      tabHover:true,
      productEncash:0,
      ultimaEncash:0,
      listData:[],
      isApp:env.isApp()
    }
  },
  beforeMount(){
  },
  watch:{
    type:{
      handler:function(cos){
        this.getPageData();
      }
    }
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
        // personId: 263423,
        productCode: 'AMFT',
        orderType: 2,
        queryFlag: this.type
      }
      const res = await this.$api.queryOrdersListHttp(params);
      if(res.code === 'sc0'){
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
      // 去借款详情
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
    },
    goBillDetail(id){
      // 去账单详情
      this.$router.push({
        path:'/repayment/detail',
        query:{
          originOrderId:id,
        }
      });
    },
    goWhere(item){
        if (this.type === 1) {
          if(env.isApp()){
            this.goBillDetail(item.id)
          }else{
            return false
          }
        }
        else {
          this.goToDetail(item.mallOrderId)
        }
    },
    goToDownLoad(){
      if (env.isIos() && !env.isApp()) {
        return location.href = 'https://itunes.apple.com/us/app/%E7%88%B1%E7%94%A8%E5%95%86%E5%9F%8E-%E5%88%86%E6%9C%9F%E8%B4%AD%E7%89%A9%E9%A2%86%E4%BC%98%E6%83%A0%E5%88%B8/id1315925508?l=zh&ls=1&mt=8';
      } else if (env.isAndroid() && !env.isApp()) {
        return location.href = 'http://t.cn/RuBMdMh';
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
.jyc-xjd{
  width: 100%;
  height: inherit;
  min-height: 100%;
  background: #f2f2f2;
  .content-main{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .list-ul{
      padding-left: 0.3rem;
      background: #fff;
      .list-li{
        background: #fff;
        border-bottom: 1px solid #eee;
        align-items: center;
        padding: 0.3rem 0.3rem 0.3rem 0;
        .tp-msg{
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          .p-col{
            font-size: 0.24rem;
            color: #a8a8a8;
            line-height: 0.34rem;
          }
          .st{
            flex-shrink: 0;
            text-align: right;
          }
          .arrow{
            width: 0.14rem;
            height: 0.22rem;
            flex-shrink: 0;
            background: url(./../../../images/rower@2x.png) center no-repeat;
            background-size: 100% auto;
            margin-left: 0.2rem;
          }
        }
        .msg{
          width: 100%;
          padding-right:0.2rem;
          .p1{
            font-size: 0.32rem;
            color: #363636;
            line-height: 0.44rem;
            margin-bottom: 0.04rem;
            font-weight: 500;
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
          margin-top: 0.3rem;
        }
      }
    }
    .list-ul-empty{
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 3.4rem 0;
      img{
        width: 2.1rem;
        height: auto;
      }
      p{
        color: #a8a8a8;
        line-height: 0.42rem;
        padding-top: 0.2rem;
        font-size: 0.3rem;
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


