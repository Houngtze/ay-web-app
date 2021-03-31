<template>
<div class="jyc-xjd">
  <div class="content-main">
    <div class="list-ul">
      <div class="list-li" @click="goLoanListResult()">
        <span class="icon"><img src="./images/my-icon-01.png"></span>
        <p class="txt">借款记录</p>
        <span class="num" v-if="loanNum > 0">{{loanNum}}</span>
        <i class="rower"></i>
      </div>
      <div class="list-li" @click="goLink('/open-msg')">
        <span class="icon"><img src="./images/my-icon-02.png"></span>
        <p class="txt">认证管理</p>
        <i class="rower"></i>
      </div>
      <div class="list-li" @click="goPayListResult()">
        <span class="icon"><img src="./images/my-icon-03.png"></span>
        <p class="txt">待支付订单</p>
        <span class="num" v-if="payNum > 0">{{payNum}}</span>
        <i class="rower"></i>
      </div>
    </div>
    <!-- <p class="bnt1" @click="tapLink()">查看更多借款产品</p> -->
  </div>
  <footer-link></footer-link>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import FooterLink from './../components/NewFooter'
export default {
  components: {
    FooterLink
  },
  data(){
    return{
      tabHover:true,
      payNum:0,
      loanNum:0,
      loanList:0,
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
    this.getPageData();
    this.getLoanList();
  },
  mounted(){
  },
  methods:{
    ...mapActions('loan', [
      'clearData'
    ]),
    async getPageData(){
      // 待支付订单列表数
      const params = {
        userId: this.userId,
        status: 0,
      }
      const res = await this.$api.listGiftOrdersHttp(params);
      if(res.code === 'sc0' && res.data){
        this.payNum = res.data.length;
      }
    },
    async getLoanList(){
      const params = {
        personId: this.personId,
        productCode: 'JXH',
        orderType: 2
      }
      const res = await this.$api.queryOrdersListHttp(params);
      if(res.code === 'sc0' && res.data){
        this.loanList = res.data.length;
        for(let item in res.data){
          if((res.data[item].orderStatus === '1' && res.data[item].isWithdrawal !== 'Y') || res.data[item].orderStatus === '7'){
            this.loanNum = this.loanNum + 1;
          }
        }
      }
    },
    goPayListResult(){
      // 待支付，有则跳，没有不跳
      if(this.payNum < 1){
        this.$toast('暂无待支付订单');
        return false;
      }
      this.goLink('/order-list');
    },
    goLoanListResult(){
      // 借款记录，有则跳，没有不跳
      if(this.loanList < 1){
        this.$toast('暂无借款记录');
        return false;
      }
      this.goLink('/loan-list');
    },
    goLink(url) {
      // 跳转页面
      this.$router.push(url);
    },
    tapLink(url){
      window.location.href = window.location.origin + '/custom-page/promote-tool/#/login?source=jyc_dc';
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
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .list-ul{
      background: #fff;
      padding-left: 0.3rem;
      margin-top: 0.2rem;
      .list-li{
        border-bottom: 1px solid #F3F3F3;
        height: 0.9rem;
        padding-right: 0.3rem;
        display: flex;
        align-items: center;
        .icon{
          flex-shrink: 0;
          width: 0.5rem;
          height: 0.5rem;
          img{
            width: 100%;
            height: auto;
          }
        }
        .txt{
          width: 100%;
          box-sizing: border-box;
          padding: 0 0.2rem;
          line-height: 0.3rem;
          font-size: 0.3rem;
          color: #222;
          .sp{
            color: #A8A8A8;
            font-size: 0.24rem;
          }
        }
        .rower{
          flex-shrink: 0;
          width: 0.16rem;
          height: 0.26rem;
          display: inline-block;
          background: url(./../images/rower.png) center no-repeat;
          background-size: 100% 100%;
        }
        .num{
          flex-shrink: 0;
          width: 0.4rem;
          height: 0.4rem;
          color:#fff;
          font-size: 0.24rem;
          background: #FF4545;
          text-align: center;
          line-height: 0.4rem;
          border-radius: 0.4rem;
          overflow: hidden;
          margin: 0 0.2rem;
        }
      }
    }
    .bnt1{
      height: 0.92rem;
      // border: 0.05rem solid #D09E54;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      line-height: 0.91rem;
      color: #fff;
      font-size: 0.36rem;
      border-radius: 0.15rem;
      margin: 0.6rem 0.3rem;
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


