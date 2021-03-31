<template>
<div class="jyc-xjd">
  <div class="content-main" v-if="listData && listData.orderStatus">
    <div class="detail-ul">
      <div class="detail-li">
        <p class="label">订单号</p>
        <p class="txt">{{listData.mallOrderId}}</p>
      </div>
      <div class="detail-li">
        <p class="label">申请金额</p>
        <p class="txt">{{listData.loanAmt}}元</p>
      </div>
      <!-- <div class="detail-li">
        <p class="label">日利率</p>
        <p class="txt">{{listData.orderProduct.dayRate*100}}%</p>
      </div> -->
      <div class="detail-li" v-if="listData.isBindCard !== false && listData.withdrawBankInfo &&  listData.withdrawBankInfo.bankCode">
        <p class="label">收款账户</p>
        <p class="txt">
          <!-- <i class="icon"><img :src="listData.withdrawBankInfo.bankIconUrl"></i> -->
          {{listData.withdrawBankInfo.bankName}}({{listData.withdrawBankInfo.bankCode.substring(listData.withdrawBankInfo.bankCode.length-4)}})
        </p>
      </div>
      <div class="detail-li" v-if="listData.isBindCard !== false && listData.withdrawBankInfo">
        <p class="label">借款人</p>
        <p class="txt">{{plusXing(listData.withdrawBankInfo.custName,1,1)}}</p>
      </div>
      <div class="detail-li" v-if="listData.isBindCard !== false && listData.withdrawBankInfo">
        <p class="label">证件号</p>
        <p class="txt">{{plusXing(listData.withdrawBankInfo.custNo,2,4)}}</p>
      </div>
      <div class="detail-li">
        <p class="label">借款用途</p>
        <p class="txt">日常消费</p>
      </div>
      <div class="detail-li">
        <p class="label">状态</p>
        <p class="txt">{{returnStatice(listData.orderStatus, listData.isWithdrawal)}}</p>
      </div>
    </div>
    <!-- <div class="detail-ul" v-if="listData.giftOrderInfo">
      <div class="detail-li">
        <p class="label">爱用Plus会员</p>
        <p class="txt">{{listData.giftOrderInfo.amount/100}}元</p>
      </div>
      <div class="detail-li">
        <p class="label">支付方式
          <span v-if="listData.giftOrderInfo.orderStatus === 1 || listData.giftOrderInfo.orderStatus === 5">({{returnPayType(listData.giftOrderInfo.payType)}})</span><br>
          <span class="sml" v-if="listData.giftOrderInfo.orderStatus === 1 || listData.giftOrderInfo.orderStatus === 5">{{listData.giftOrderInfo.updateTime}}</span>
        </p>
        <p class="txt">{{retrunPayResult(listData.giftOrderInfo.orderStatus)}}</p>
      </div>
    </div> -->
    <!--<div class="failed-msg" v-if="listData.orderStatus === '2' || listData.orderStatus === '10'">-->
      <!--<p>1.抱歉，您的贷款订单因无法匹配资金方导致放款失败。</p>-->
      <!--<p>2.您的会员超值礼包订单可关注微信公众号“爱用商城APP”联系客服申请退款，客服核实完毕后会在3～7个工作日内退回您的账户。</p>-->
    <!--</div>-->
    <!-- <p class="bnt" @click="goToBind(listData.mallOrderId)" v-if="listData.isBindCard === false && listData.orderStatus !== '50'">绑定收款银行卡</p> -->
    <p class="bnt" @click="goToPatch(listData.mallOrderId)" v-if="listData.orderStatus === '3' && listData.isShowPatchButton">完善放款信息（必要）</p>
    <p class="bnt" @click="goToLoan(listData.mallOrderId,listData.id,listData.funding)"
       v-else-if="(listData.orderStatus === '1' && listData.isWithdrawal !== 'Y' && listData.orderStatus !== '50') || listData.orderStatus === '53' && isNeedWithdraw">提现到个人账户</p>
    <p class="bnt" @click="goToPay(listData.mallOrderId)" v-else-if="listData.orderStatus === '7' && listData.orderStatus !== '50'">开通提现加速会员，立即到账</p>
  </div>
  <!--<footer-link></footer-link>-->
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage ,timestampToTime} from '@/helpers/utils';
import FooterLink from './../components/NewFooter';
export default {
  components: {
    FooterLink
  },
  data(){
    return{
      tabHover:true,
      productEncash:0,
      ultimaEncash:0,
      listData:null,
      bankInfo:null,
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
    ...mapState('base',{
      openBankInfo: state => state.openBankInfo,
    }),
    isNeedWithdraw() {
      const  funding = this.listData && this.listData.funding
      switch (funding) {
        case 'FD':
          return false
          break;
        default:
          return true
          break;
      }
    }
  },
  created() {
    this.getPageData();
  },
  mounted(){
  },
  methods:{
    ...mapActions('base', [
      'set_txUsableLimit','set_openBankInfo'
    ]),
    async getPageData(){
      const params = {
        orderNo: this.$route.query.orderNo,
      }
      const res = await this.$api.queryOrderDetailHttp(params);
      if(res.code === 'sc0' && res.data){
        this.listData = res.data;
      }
      else{
        this.$toast(res.message);
      }
      // const bankParams = {
      //   productCode: 'AMFT',
      //   funding: 'JYC_XJD',
      //   personId: this.personId,
      // }
      // const resBank = await this.$api.queryAccountInfoHttp(bankParams);
      // if(resBank.code === 'sc0' && resBank.data){
      //   this.bankInfo = resBank.data;
      //   this.set_openBankInfo(resBank.data);
      // }
      // else{
      //   this.$toast(resBank.message);
      // }
    },
    goLink(url) {
      // 跳转页面
      this.$router.push(url);
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
          funding:funding,
        }
      });
    },
    plusXing (str,frontLen,endLen) {
      var len = str.length-frontLen-endLen;
      var xing = '';
      for (var i=0;i<len;i++) {
        xing+='*';
      }
      if(xing === ''){
        xing = '*';
      }
      return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
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
    returnPayType(item){
      // 返显支付方式
      // 支付方式 -1: 银行卡代扣 0: 爱花 1: 微信 2: 支付宝 3: 京东支付 4: H5支付宝
      // 5: 爱满分 6: 爱满分2 7: 微信公众号支付 8: H5银联支付
      if(item === -1){
        return '银行卡';
      }
      else if(item === 0){
        return '爱花';
      }
      else if(item === 1){
        return '微信';
      }
      else if(item === 2){
        return '支付宝';
      }
      else if(item === 3){
        return '京东支付';
      }
      else if(item === 4){
        return '支付宝';
      }
      else if(item === 5){
        return '爱满分';
      }
      else if(item === 6){
        return '爱满分2';
      }
      else if(item === 7){
        return '微信公众号支付';
      }
      else if(item === 8){
        return '银行卡';
      }
    },
    retrunPayResult(item){
      // 获取支付结果
      //订单状态 0 未支付 1 已支付 2 支付失败 3 超时关单,5后置支付确认支付
      if(item === 0){
        return '未支付';
      }
      else if(item === 1){
        return '已支付';
      }
      else if(item === 2){
        return '未支付';
      }
      else if(item === 3){
        return '未支付';
      }
      else if(item === 5){
        return '已支付';
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
  .content-main{
    width: 100%;
    .detail-ul{
      background: #fff;
      margin-bottom: 0.2rem;
      padding: 0.1rem 0;
      .detail-li{
        line-height: 0.7rem;
        justify-content: space-between;
        align-items: center;
        display: flex;
        padding: 0.1rem 0.3rem;
        font-size: 0.28rem;
        .label{
          flex-shrink: 0;
          color: #A8A8A8;
          .icon{
            width: 0.3rem;
            height: 0.3rem;
            vertical-align: middle;
            display: inline-block;
            margin-right: 0.1rem;
            margin-top: -0.05rem;
            img{
              width: 100%;
              height: auto;
              display: block;
            }
          }
          .sml{
            font-size: 0.24rem;
          }
        }
        .txt{
          width: 100%;
          color: #363636;
          text-align: right;
          .icon{
            width: 0.3rem;
            height: 0.3rem;
            vertical-align: middle;
            display: inline-block;
            margin-right: 0.1rem;
            margin-top: -0.05rem;
            img{
              width: 100%;
              height: auto;
              display: block;
            }
          }
        }
      }
    }
    .failed-msg{
      padding: 0.3rem;
      color: #A8A8A8;
      font-size: 0.24rem;
      line-height: 0.27rem;
    }
    .bnt{
      height: 0.92rem;
      text-align: center;
      line-height: 0.92rem;
      border-radius: 0.1rem;
      background:linear-gradient(270deg,rgba(208,158,84,0.99),rgba(225,188,120,0.99));
      color: #fff;
      font-size: 0.36rem;
      margin: 0.3rem;
    }
  }
}
</style>


