<template>
<div class="jyc-xjd">
  <step-shower :step="step"></step-shower>
  <div class="content-main">
    <result-page :page="pageResultWait"></result-page>
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
import { setTimeout } from 'timers';
import resultPage from './components/result';
export default {
  components: {
    FooterLink,
    stepShower,
    resultPage
  },
  data(){
    return{
      pageResultWait:{
        status:'wait',
        title:'审核中',
        content:`您的额度已受理<br>预计在1～2个工作日内出审核结果，请耐心等待`,
        bntTxt:'查看放款结果',
        bntLink:'/custom-page/jyc-xjd/#/loan-list',
      },
      step:{
        step:2,
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
  },
  mounted(){
  },
  methods:{
    ...mapActions('loan', [
      'clearData'
    ]),
    goLink(url) {
      this.$router.push(url);
    },
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
        width: 1.05rem;
        height: auto;
        display: block;
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
    .bnt1{
      height: 0.92rem;
      // border: 0.05rem solid #D09E54;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      line-height: 0.91rem;
      color: #fff;
      font-size: 0.36rem;
      border-radius: 0.15rem;
      margin: 0.4rem 0.3rem 0.25rem 0.3rem;
      text-align: center;
    }
    .warm-txt{
      color: #A8A8A8;
      font-size: 0.24rem;
      line-height: 0.4rem;
      margin: 0 0.3rem 0.6rem 0.3rem;
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
  .term-list{
    width: 100%;
    text-align: center;
    .tt{
      height: 1rem;
      display: flex;
      p{
        line-height: 1rem;
        font-size: 0.34rem;
        font-weight: 400;
        width: 100%;
        padding-right: 1rem;
      }
      .close{
        width: 1rem;
        height: 1rem;
        background: url(./../images/close@2x.png) center no-repeat;
        background-size: 30% auto;
        flex-shrink: 0;
      }
    }
    li{
      height: 1rem;
      line-height: 1rem;
      border-top: 1px solid #E5E5E5;
      font-size: 0.3rem;
    }
  }
  .icon-check{
    color: #A8A8A8;
    input{
      display: none;
    }
    input + .icon{
      width: 0.28rem;
      height: 0.28rem;
      display: inline-block;
      vertical-align: middle;
      margin: -0.05rem 0.1rem 0 0;
      background: url(./../images/check.png) center no-repeat;
      background-size: 100% 100%;
    }
    input:checked + .icon{
      background-image: url(./../images/checkbox.png);
    }
  }
  .bank-info{
    width: 0.3rem;
    height: 0.3rem;
    flex-shrink: 0;
    background: url(./../images/bank-icon@2x.png) center no-repeat;
    background-size: 100% auto;
    margin-left: 0.2rem;
  }
}
</style>


