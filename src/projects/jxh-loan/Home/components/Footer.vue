<template>
<div class="footer">
  <p class="sp" @click="payNow('1')"><i class="icon icon-pay"></i>立即还款</p>
  <p class="sp" style="color:#EEEEEE;">|</p>
  <p class="sp col" @click="kfClick"><i class="icon icon-kf"></i>联系客服</p>
  <div class="kf-model" v-if="kfModel">
    <div class="bg">
      <div class="txt">
        <p class="p1">请拨打客服热线4001868888</p>
        <p class="p2">（时间9:00-18:00）</p>
      </div>
      <p class="enter" @click="kfClick">我知道了</p>
    </div>
  </div>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import env from '@/helpers/env';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
export default {
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
    windowLink(url) {
      window.location.href = url
    },
    payNow(id) {
      if (id == '1') {
        if (env.isApp()) {
          this.goLink('/repayment/loan-list')
        } else {
          window.location.href = "http://jxh.dafysz.cn/jxh-download/"
        }
      }
      if (id == '2') {
        this.goLink('/repayment/loan-list')
      }
    },
    goToDownLoad() {
      // 去下载
      if (env.isIos()) {
        location.href = 'https://itunes.apple.com/us/app/%E7%88%B1%E7%94%A8%E5%95%86%E5%9F%8E-%E5%88%86%E6%9C%9F%E8%B4%AD%E7%89%A9%E9%A2%86%E4%BC%98%E6%83%A0%E5%88%B8/id1315925508?l=zh&ls=1&mt=8';
      } else if (env.isAndroid()) {
        location.href = 'http://t.cn/RuBMdMh';
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
.footer{
  text-align: center;
  flex-shrink: 0;
  height: 0.98rem;
  line-height: 0.98rem;
  display: flex;
  justify-content: center;
  .sp{
    color: #BA9950;
    margin: 0 0.2rem;
    font-size: 0.28rem;
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
    color: #868686;
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
      width: 6rem;
      height: 3.12rem;
      background: #fff;
      border-radius: 0.1rem;
      text-align: center;
      padding: 0.48rem 0 0.48rem 0;
      p{
        color: #363636;
      }
      .p1{
        font-weight: 400;
        font-size: 0.30rem;
        line-height: 0.28rem;
        margin-bottom: 0.12rem;
        font-weight:600;
      }
      .p2{
        font-size: 0.30rem;
        line-height: 0.34rem;
        margin-bottom: 0.48rem;
        font-weight:600;
      }
      .enter{
        width:5.04rem;
        height:0.84rem;
        line-height: 0.84rem;
        background:rgba(186,153,80,1);
        border-radius:0.42rem;
        margin: 0 auto;
        font-size: 0.32rem;
        color:#fff;
      }
    }
  }
}
</style>


