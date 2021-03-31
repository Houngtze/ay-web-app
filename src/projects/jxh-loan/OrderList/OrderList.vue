<template>
<div class="jyc-xjd">
  <div class="content-main">
    <div class="list-ul">
      <div class="list-li" v-for="(item ,index) in listData" :key="index">
        <div class="msg">
          <p>申请借款：{{item.amount/100}}元</p>
          <p>申请日期：{{item.createTime}}</p>
          <p>状态：{{returnStatice(item.orderStatus)}}</p>
        </div>
        <!-- <p class="bnt">点击查看</p> -->
        <p class="bnt" @click="goToPay(item.giftOrderNo)" v-if="item.orderStatus === 0">继续操作</p>
        <!-- <p class="bnt">立即提现</p>
        <p class="bnt">重新申请</p>
        <p class="bnt">继续借款</p> -->
      </div>
    </div>
  </div>
  <!--<footer-link></footer-link>-->
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
        userId: this.userId,
        status: this.$route.query.st || 0,
      }
      const res = await this.$api.listGiftOrdersHttp(params);
      if(res.code === 'sc0' && res.data){
        this.listData = res.data;
      }
      else{
        if(!res.data){
          this.$toast('暂无待确认订单');
          this.$router.back();
        }
        else{
          this.$toast(res.message);
        }
      }
    },
    goLink(url) {
      // 跳转页面
      this.$router.push(url);
    },
    returnStatice(str){
      // 返回订单状态
      if(str === 0){
        return '待确认';
      }
      else if(str === 1){
        return '已确认';
      }
      else if(str === 2){
        return '确认失败';
      }
      else if(str === 3){
        return '超时关单';
      }
    },
    goToPay(orderNo){
      this.goLink({
        path:'/result-pay',
        query:{
          ono:orderNo
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
  background: #fff;
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
    padding-left: 0.3rem;
    .list-ul{
      .list-li{
        border-bottom: 1px solid #DCDCDC;
        display: flex;
        align-items: center;
        padding: 0.3rem 0 0.2rem 0;
        padding-right: 0.3rem;
        .msg{
          width: 100%;
          padding-right:0.2rem;
          p{
            font-size: 0.24rem;
            color: #333333;
            line-height: 0.24rem;
            margin-bottom: 0.15rem;
          }
        }
        .bnt{
          flex-shrink: 0;
          padding: 0.15rem 0.25rem;
          border-radius: 1rem;
          background:linear-gradient(270deg,rgba(208,158,84,0.99),rgba(225,188,120,0.99));
          color: #fff;
          font-size: 0.24rem;
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


