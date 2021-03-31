<template>
<div class="credit-result">
  <p class="p1">您的额度已经获批</p>
  <p class="p2">{{userLimit}}</p>
  <p class="p3">为了您的资金安全,请下载爱用商城APP进行提现操作</p>
  <p class="p4" @click="goToDownLoad">下载APP完成额度提现</p>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
export default {
  components: {
  },
  data(){
    return{
      defaultLimit: "0",
      availablePosLimit: null
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
    this.getActive()
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
    goToDownLoad(){
      // 去下载
      if (this.$check.isIOS()) {
        location.href = 'https://itunes.apple.com/us/app/%E7%88%B1%E7%94%A8%E5%95%86%E5%9F%8E-%E5%88%86%E6%9C%9F%E8%B4%AD%E7%89%A9%E9%A2%86%E4%BC%98%E6%83%A0%E5%88%B8/id1315925508?l=zh&ls=1&mt=8';
      } else if (this.$check.isAndroid()) {
        location.href = 'http://t.cn/RuBMdMh';
      }
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
    }
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
  background: #fff;
  .p1{
    color: #363636;
    font-size: 0.3rem;
    line-height: 0.42rem;
    padding: 1.2rem 0 0.6rem 0;
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
}
</style>


