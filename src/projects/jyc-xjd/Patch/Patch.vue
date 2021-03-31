<template>
<div class="jyc-xjd">
  <step-shower :step="step"></step-shower>
  <div class="content-main">
    <div class="static-msg">
      <img src="./images/success@2x.png">
      <p class="title">恭喜您</p>
      <p>您的借款申请已经进入放款流程</p>
      <p>进度为：99.9%</p>
    </div>
    <div class="zjf-list" v-if="this.fromWhere && this.fromWhere.length > 0">
      <div class="tt">
        <i class="icon"></i>
        <span>提现操作</span>
      </div>
      <div class="zjf-ul">
        <div class="zjf-position" v-for="(item, index) in fromWhere" :key="index">
          <i v-if="index === 0" class="mast"></i>
          <div class="zjf-li">
            <div class="txt">
              <p class="p1" v-if="index === 0">添加第一放款方</p>
              <p class="p1" v-if="index === 1">添加第二放款方</p>
              <p class="p1" v-if="index === 2">添加第三放款方</p>
              <template v-if="item.fundingName !== 'ERS'">
                <p class="p2">步骤：绑定银行卡,等待资方放款</p>
                <p class="p3">提现成功率99%</p>
              </template>
              <template v-else>
                <p class="p2">步骤：绑卡-开户-确认提现</p>
                <p class="p3">添加后,提现成功率提升90%</p>
              </template>
            </div>
            <div class="r-box" v-if="item.fundingName !== 'ERS'">
              <p class="bnt" v-if="item.status === 0" @click="goToBind(item)">待完成</p>
              <p class="bnt end" v-else>已完成</p>
            </div>
            <div class="r-box" v-else>
              <p class="bnt" v-if="item.status === 0" @click="goToErsOpen(item, index)">待完成</p>
              <p class="bnt end" v-else>已完成</p>
            </div>
          </div>
        </div>
        <!-- <div class="zjf-li">
          <div class="txt">
            <p class="p1">添加第二放款方</p>
            <p class="p2">步骤：绑卡-开户-确认提现</p>
            <p class="p3">添加后,提现成功率提升80%</p>
          </div>
          <div class="r-box">
            <p class="bnt">待完成</p>
          </div>
        </div> -->
      </div>
    </div>
    <p class="bnt1" @click="goLink('/home')">返回</p>
  </div>
  <footer-link></footer-link>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import FooterLink from './../components/NewFooter';
import stepShower from './../Result/components/step';
import { setTimeout } from 'timers';
export default {
  components: {
    FooterLink,
    stepShower,
  },
  data(){
    return{
      termStatic:true,
      tabHover:true,
      pageData:{},
      popupVisible: false,
      zfbHtml:'',
      step:{
        step:2,
        status:true,
      },
      termUrl:'',
      bntTxt:'查看提现结果',
      fromWhere: null,
      txt: null,
      timer: null,
      running:3,
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
    // this.getFormWhere();
    this.firstStep();
  },
  mounted(){
  },
  methods:{
    ...mapActions('loan', [
      'clearData'
    ]),
    firstStep(){
      // 第一步，倒计时后获取资金方
      this.$indicator.open('加载中...');
      setTimeout(async ()=>{
        await this.getFormWhere();
        this.$indicator.close();
      },3000);
    },
    async getFormWhere(){
      // 获取当前资金方
      const params = {
        orderNo: this.$route.query.mallOrderId,
      };
      const res = await this.$api.orderFundingStatusHttp(params);
      if(res.code === 'sc0' && res.data){
        this.fromWhere = res.data;
      }
      // else{
      //   this.goLink('/loan-list');
      //   this.$toast(res.message);
      // }
    },
    runTime(){
      this.bntTxt = '请绑定收款银行卡('+this.running+'s)';
      this.timer = setInterval(()=>{
        if(this.running > 1){
          this.running = this.running - 1;
          this.bntTxt = '请绑定收款银行卡('+this.running+'s)';
        }
        else{
          clearInterval(this.timer);
          this.running = 3;
          this.bntTxt = null;
          this.goToBind();
        }
      },1000);
    },
    goToBind(item){
      // clearInterval(this.timer);
      this.goLink({
        path:'/bind-bank',
        query:{
          orderNo: this.$route.query.mallOrderId,
          funding: item.fundingName,
        }
      });
    },
    goToErsOpen(item, index){
      // E融所开户
      this.goLink({
        path:'/patch-ers',
        query:{
          index,
          mallOrderId:this.$route.query.mallOrderId,
          ...item
        }
      });
    },
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
  // background: #f2f2f2;
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
      margin-bottom: 0.2rem;
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
      .title{
        font-size: 0.4rem;
        line-height: 0.4rem;
        margin-bottom: 0.4rem;
      }
    }
    .zjf-list{
      background: #fff;
      // border-bottom: 0.2rem solid #f2f2f2;
      padding-bottom: 0.2rem;
      overflow: hidden;
      .tt{
        padding: 0 0.3rem;
        height: 0.92rem;
        line-height: 0.92rem;
        font-size: 0.32rem;
        font-weight: bold;
        border-bottom: 1px solid #eee;
      }
      .zjf-ul{
        padding-left: 0.3rem;
        .zjf-position{
          position: relative;
          z-index: 3;
          .mast{
            width: 0.67rem;
            height: 0.67rem;
            background: url(./images/mast@2x.png) center no-repeat;
            background-size: 100% auto;
            position: absolute;
            top: 0;
            right: 0;
          }
        }
        .zjf-li{
          border-bottom: 1px solid #eee;
          display: flex;
          padding: 0.25rem 0;
          .r-box{
            width: 1.5rem;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            .bnt{
              width: 1.2rem;
              height: 0.6rem;
              text-align: center;
              line-height: 0.6rem;
              color: #fff;
              background: linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
              border-radius: 0.6rem;
            }
            .end{
              background: #DDDDDD;
            }
            .mast{
              width: 0.67rem;
              height: 0.67rem;
              background: url(./images/mast.png) center no-repeat;
              background-size: 100% auto;
            }
          }
          .txt{
            width: 100%;
            p{
              padding-bottom: 0.2rem;
            }
            p:last-child{
              padding-bottom: 0;
            }
            .p1{
              font-size: 0.3rem;
              line-height: 0.3rem;
            }
            .p2{
              font-size: 0.24rem;
              line-height: 0.24rem;
              color: #A8A8A8;
            }
            .p3{
              font-size: 0.24rem;
              line-height: 0.24rem;
              color: #D09E54;
            }
          }
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
  }
}
</style>


