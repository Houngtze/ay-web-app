<template>
<div class="jyc-xjd">
  <div class="content-main">
    <div class="static-msg">
      <img src="./images/false.png">
      <p>根据您的综合评分</p>
      <p>已匹配优质放款机构为您提供借款服务</p>
      <p class="bnt1" @click="toDC">下一步</p>
    </div>
    <div class="adv-block">
      <img v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/jyc-xjd/home-source-loan-banner.png'" alt="banner" @click="toDC">
    </div>
  </div>
  <footer-link></footer-link>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import FooterLink from './../components/NewFooter'
import stepShower from './components/step'
export default {
  components: {
    FooterLink,
    stepShower
  },
  data(){
    return{
      termStatic:true,
      tabHover:true,
      pageData:{},
      popupVisible: false,
      zfbHtml:'',
      step:{
        step:3,
        status:true,
      },
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
    // this.getPageData();
  },
  mounted(){
  },
  methods:{
    ...mapActions('loan', [
      'clearData'
    ]),
    toDC() {
      // window.location.href = window.location.origin + "/custom-page/dajin-loan/#/home"
      this.$router.push({path: "/org-loan-list"})
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
    .static-msg{
      background: #fff;
      // border-bottom: 0.2rem solid #f2f2f2;
      text-align: center;
      padding-bottom: 0.2rem;
      overflow: hidden;
      img{
        width: 1.5rem;
        display: inline-block;
        margin: 0.4rem auto;
        margin-bottom: 0.24rem;
      }
      p{
        font-size: 0.28rem;
        line-height: 0.28rem;
        margin-bottom: 0.2rem;
      }
    }
    .order-li{
      border-bottom: 1px solid #E5E5E5;
      height: 0.9rem;
      display: flex;
      align-items: center;
      padding: 0 0.3rem;
      font-size: 0.3rem;
      .tt{
        color: #A8A8A8;
        flex-shrink: 0;
      }
      .txt{
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
      }
      .link{
        flex-shrink: 0;
        color: #D1A056;
        font-size: 0.24rem;
      }
      .price{
        flex-shrink: 0;
        color: #F22C2C;
        font-size: 0.3rem;
      }
    }
    .server-list{
      display: flex;
      padding-top: 0.2rem;
      .server-li{
        flex-grow: 1;
        text-align: center;
        img{
          width: 1.8rem;
          height: auto;
        }
        p{
          font-size: 0.2rem;
          line-height: 0.2rem;
        }
      }
    }
    p.bnt1{
      display: inline-block;
      width: 4.4rem;
      height: .8rem;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      box-shadow:0px 9px 10px 0px rgba(209,160,85,0.25);
      border-radius: .4rem;
      font-size: .36rem;
      line-height: .8rem;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      margin-top: .2rem;
      margin-bottom: .5rem;
    }
    .warm-txt{
      color: #A8A8A8;
      font-size: 0.24rem;
      line-height: 0.4rem;
      margin: 0 0.3rem 0.6rem 0.3rem;
      text-align: center;
    }
  }
  .adv-block{
    margin-top: .24rem;
    img{
      width: 100%;
      display: block;
    }
  }
}
</style>
