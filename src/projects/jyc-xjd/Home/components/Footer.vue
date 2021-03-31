<template>
<div class="footer">
  <p class="sp" @click="toMyLoan" v-if="isShowMyLoan && personId"><i class="icon icon-pay"></i>我的借款<span class="red" v-if="orderNum">{{orderNum}}</span></p>
  <p class="sp"  v-if="isShowMyLoan && personId">|</p>
  <p class="sp col" @click="kfClick"><i class="icon icon-kf"></i>联系客服</p>
  <div class="kf-model" v-if="kfModel">
    <div class="bg">
      <div class="txt">
        <p class="p1">爱有钱提现相关问题请咨询微信客服</p>
        <p class="p2">微信客服：关注“爱用商城APP”微信公众号</p>
        <p class="p3">服务时间：周一至周日9:00-18:30</p>
      </div>
      <p class="enter" @click="kfClick">我知道了</p>
    </div>
  </div>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
export default {
  props: {
    isShowMyLoan: {
      default: true
    }
  },
  components: {
  },
  data(){
    return{
      tabHover:true,
      productEncash:0,
      ultimaEncash:0,
      kfModel:false,
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
      ucAccountId: state => state.global.userInfo.ucAccountId,
      clientCode: state => state.global.clientCode
    }),
    ...mapState('loan/home', {
      activeStepData: state => state.activeStepData,
      orgType: state => state.orgType,
    })
  },
  created() {
    this.getOrder();
  },
  mounted(){
  },
  methods:{
    goLink(url) {
      // 跳转页面
      this.$router.push(url);
    },
    tapLink(url){
      window.location.href = url;
    },
    linkOnwer(url){
      window.location.href = window.location.origin + url
    },
    kfClick(){
      this.kfModel = !this.kfModel;
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
    },
    toMyLoan() {
      this.$emit("onActiveToMyLoan")
    }
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>// scoped
.footer{
  text-align: center;
  flex-shrink: 0;
  height: 0.98rem;
  line-height: 0.98rem;
  display: flex;
  justify-content: center;
  .sp{
    color: #D1A056;
    margin: 0 0.2rem;
    font-size: 0.24rem;
    display: flex;
    align-items: center;
    .red{
      width: 0.3rem;
      height: 0.3rem;
      overflow: hidden;
      text-align: center;
      line-height: 0.28rem;
      background: #FF0000;
      color: #fff;
      font-size: 0.24rem;
      display: inline-block;
      border-radius: 0.3rem;
      margin-left: 0.1rem;
    }
  }
  .col{
    color: #363636;
  }
  .icon{
    width: 0.32rem;
    height: 0.32rem;
    background: center no-repeat;
    background-size: 100% 100%;
    margin-right: 0.1rem;
  }
  .icon-pay{
    background-image: url(./images/icon-list.png);
  }
  .icon-kf{
    background-image: url(./images/icon-kf.png);
  }
  .kf-model{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba($color: #000000, $alpha: .6);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .bg{
      width: 5.6rem;
      height: auto;
      background: #fff;
      overflow: hidden;
      border-radius: 0.1rem;
      text-align: center;
      p{
        color: #363636;
      }
      .p1{
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.28rem;
        margin: 0.4rem 0;
      }
      .p2{
        font-size: 0.26rem;
        line-height: 0.34rem;
      }
      .p3{
        font-size: 0.26rem;
        line-height: 0.26rem;
        margin: 0.3rem 0 0.4rem 0;
      }
      .enter{
        height: 0.82rem;
        border-top: 1px solid #E5E5E5;
        line-height: 0.82rem;
        font-size: 0.3rem;
      }
    }
  }
}
</style>


