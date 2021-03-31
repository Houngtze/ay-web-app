<template>
<div class="credit-result">
  <div class="bg">
    <p class="tt">{{ttTxt}}</p>
    <p class="p1">{{p1Txt}}</p>
    <p class="pu">{{puTxt}}</p>
    <img v-if="showVul" class="loading-gif" src="./images/loading.gif">
    <p v-if="!showVul" class="p2">{{userLimit}}</p>
    <p v-if="!showVul" class="p3">{{p3Txt}}</p>
  </div>
  <p class="p4" v-if="!showVul" @click="goToLoan">补充信息并提现</p>
</div>
</template>
<script>
  import env from '@/helpers/env';
import {mapState, mapActions} from 'vuex';
import { setInterval, setTimeout } from 'timers';
export default {
  components: {
  },
  data(){
    return{
      defaultLimit: "0",
      availablePosLimit: null,
      ttTxt: '您的额度正在审核中',
      p1Txt: '您的额度正在审核',
      puTxt: '系统正在评估，请等待（3s）',
      p3Txt: '该额度即可提现又可消费',
      showVul: true,
      timer: 3,
      intVal: null,
    }
  },
  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      idPerson: state => state.global.userInfo.idPerson,
      ucAccountId: state => state.global.userInfo.ucAccountId,
      source: state => state.global.source
    }),
    ...mapState('credit', {
      activeStatus: state => state.creditStep && state.creditStep.activeStatus
    }),
    userLimit() {
      return this.availablePosLimit || this.defaultLimit
    }
  },
  async created() {
    this.setTimer();
    // if (!this.activeStatus) {
    //   this.$messagebox({
    //     title: '',
    //     message: "授信异常，状态:"+ this.activeStatus,
    //     confirmButtonText: '确定',
    //     showCancelButton: false
    //   }).then(async (val) => {
    //     if (val === 'confirm') {
    //       this.$router.replace({path: '/home'})
    //     }
    //   })
    // }
  },
  methods:{
    ...mapActions('credit',['setCreditStep']),
    async goToLoan(){
      // 去现金分期
      // window.location.href = '/custom-page/jyc-xjd/#/home';

      // 获取当前授信进度 已授信去现金分期，未授信去授信
      await this.getActive();
      let path = null;
      switch (this.activeStatus) {
        case 0:
        case 10:
        case 20:
        case 30:
        case 40:
          // 视频认证
          path = '/liveAc';
          break;
          // // 身份认证
          // path = '/identityAc';
          // break;
        case 50:
          // 个人信息
          path = '/personInfo';
          break;
        case 60:
          // 银行卡信息
          path = '/bankInfo';
          break;
        case 1000:
          break;
        case 70:
          // 等待授信结果
          path = 70;
          break;
        case 1100:
          // 授信结束
          break;
        case 1400:
          this.$toast('当前用户已绑定账号，不可重复申请。');
          break;
      }
      if(path){
        if(path === 70){
          // 未出授信结果
          this.$toast('请耐心等待结果');
        }
        else{
          this.$router.replace(path);
        }
      }
      else{
        window.location.href = '/custom-page/jyc-xjd/#/home';
      }
    },
    setTimer(){
      setTimeout(async ()=>{
        if(this.timer > 1){
          this.timer--;
          this.puTxt = `系统正在评估，请等待（${this.timer}s）`;
          this.setTimer();
        }
        else{
          this.getActive();
          this.showVul = false;
          this.ttTxt = '您的额度已经批核，补充信息后即可提现';
          this.p1Txt = '您的额度已经获批';
          this.puTxt = '经过系统评估，您可借额度为(元)';
        }
      },1000);
    },
    async getActive() {
      // 获取当前授信进度
      const param = {
        idPerson: this.idPerson,
        userId: this.userId,
        product: 'AMFT'
      };
      await this.setCreditStep(param);
      if (this.activeStatus === 1000) {
        this.getUserInfo()
      } else {
        this.defaultLimit = "8,000"
      }
    },
    async getUserInfo() {
      const res = await this.$api.getUserInfo({userId: this.userId, idPerson: this.idPerson, source: this.source});
      if (res.code === 'sc0') {
        this.availablePosLimit = res.data.availablePosLimit || "8,000"
      } else {
        this.$toast(res.message)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.credit-result{
  width: 100%;
  min-height: 100%;
  height: inherit;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
  .bg{
    background: #fff;
    margin-bottom: 0.4rem;
  }
  .tt{
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.3rem;
    background: #FFF8ED;
    color: #D1A056;
    font-size: 0.28rem;
    text-align: left;
  }
  .p1{
    color: #363636;
    font-size: 0.3rem;
    line-height: 0.42rem;
    padding: 0.4rem 0 0.1rem 0;
  }
  .p2{
    color: #363636;
    font-size: 1.2rem;
    line-height: 1.68rem;
    font-weight: bold;
  }
  .p3{
    color: #A8A8A8;
    font-size: 0.24rem;
    line-height: 0.34rem;
    padding: 0.6rem 0 1.2rem 0;
  }
  .p4{
    width: 6.9rem;
    height: 0.92rem;
    line-height: 0.95rem;
    color: #fff;
    background: linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
    font-size: 0.36rem;
    margin: 0 auto;
    border-radius: 0.1rem;
  }
  .pu{
    color: #A8A8A8;
    font-size: 0.24rem;
    line-height: 0.3rem;
    padding-bottom:  0.6rem;
  }
  .loading-gif{
    width: 1rem;
    height: 1rem;
    margin-bottom: 0.6rem;
  }
}
</style>


