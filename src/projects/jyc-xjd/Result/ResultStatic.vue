<template>
<div class="jyc-xjd" v-show="pageResult.status">
  <div class="content-main">
    <result-page :page="pageResult" @resultBntClick="resultBntClick"></result-page>
  </div>
  <footer-link></footer-link>
  <div v-if="txt != ''" class="mint-indicator" style="">
    <div class="mint-indicator-wrapper" style="padding: 20px;">
      <span class="mint-indicator-spin">
        <div class="mint-spinner-snake" style="border-top-color: rgb(204, 204, 204); border-left-color: rgb(204, 204, 204); border-bottom-color: rgb(204, 204, 204); height: 32px; width: 32px;"></div>
      </span>
      <span class="mint-indicator-text" style="">{{txt}}</span>
    </div>
    <div class="mint-indicator-mask"></div>
  </div>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import resultPage from './components/result';
import FooterLink from './../components/NewFooter'
export default {
  components: {
    FooterLink,resultPage
  },
  data(){
    return{
      tabHover:true,
      pageResult: {},
      pageResultWait:{
        status:'wait',
        title:'',
        // content:`您的额度已受理<br>预计在2小时内出审核结果，请耐心等待`,
        content:`审核通过后，需您继续在APP进行提现操作<br>预计在2小时内出审核结果，请留意APP首页提示或短信通知`,
        bntTxt:'返回首页',
        bntLink:'/custom-page/jyc-xjd/#/home',
      },
      pageResultFailed:{
        status:'error',
        title:'',
        content:`您的借款暂未获批<br>根据你的信用，申请以下产品的通过率可达83.32%`,
        bntTxt:'查看更多高通过率的借款产品',
        bntLink: window.location.origin + '/custom-page/promote-tool/#/login?source=jyc_dc'
      },
      pageLinkType:'',
      pageData:'',
      running:5,
      txt:'',
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
    // this.getStatice();
    this.runTime();
  },
  mounted(){
  },
  methods:{
    ...mapActions('loan', [
      'clearData'
    ]),
    async getStatice(){
      const params = {
        orderNo: this.$route.query.giftOrderNo,
        // loanOrderNo:  this.$route.query.orderNo,
        needInterest:0,
        urlChannel:'H5',
        urlSource:'AYQ_XJFQ',
      };
      const res = await this.$api.getOrderDetailHttp(params);
    },
    async getGiftDetail(){
      const params = {
        orderNo: this.$route.query.orderNo,
      };
      const res = await this.$api.queryOrderDetailHttp(params);
      if(res.code === 'sc0' && res.data){
        // 调用信贷的查询借款订单详情接口，订单的状态如下：
        // 0-预进件；1-放款成功；2-放款失败；3-放款中；4-借款申请流程中被拒；5-首付成功；6-终审中；7-终审通过；8-终审拒绝；10-取消订单；11-提前还款；
        // 12-逾期；13-强制还款；20-提前结清；21-正常结清；22-逾期结清；23-强制结清；31-初审通过；32-初审拒绝；41-授信申请流程中被拒；99-信用付全额退款',你需要关注的几种状态值，0、5、6、7、8
        if(res.data.orderStatus === '7' && res.data.giftOrderInfo.amount && res.data.giftOrderInfo.amount!==0){
          // 终审通过，去支付页面
          this.goLink({
            path: '/result-pay',
            query:{
              lno: this.$route.query.orderNo,
            }
          });
        }
        else if(res.data.orderStatus === '8'){
          // 终审拒绝，留本页面并显示失败信息
          // this.pageResult = Object.assign({}, this.pageResultFailed);
        //  2020.10.22 修改跳转，终审失败一律跳转到跟初审失败一样的页面
          this.goLink({
            path: '/loan-failed'
          });
        }
        else{
          // 不做改动
        }
      }
      // else{
      //   this.$toast();
      // }
    },
    resultBntClick(){
      // 状态组件按钮点击
      this.goLink('/home');
    },
    goLink(url) {
      // 跳转页面
      this.$router.replace(url);
    },
    runTime(){
      Object.assign(this.pageResult, this.pageResultWait);
      this.txt = '审批中'+this.running+'s';
      let timer = setInterval(()=>{
        if(this.running > 1){
          this.running = this.running - 1;
          this.txt = '审批中'+this.running+'s';
        }
        else{
          clearInterval(timer);
          this.running = 5;
          this.txt = '';
          this.getGiftDetail();
        }
      },1000);
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
  color: #363636;
  .content-main{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;

    .bnt1{
      height: 0.92rem;
      // border: 0.05rem solid #D09E54;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      line-height: 0.91rem;
      color: #fff;
      font-size: 0.36rem;
      border-radius: 0.15rem;
      margin: 0.6rem 0.3rem 0.25rem 0.3rem;
      text-align: center;
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


