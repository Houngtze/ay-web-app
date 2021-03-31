<template>
<div class="page-layout">
  <div class="credit-result">
    <!-- 审核成功 -->
    <template  v-if="auditStatus === 1">
      <p class="p1">已获额度(元)</p>
      <p class="p2">{{userLimit}}</p>
      <p class="p3">恭喜您已获得额度</p>
    </template>
    <!-- 审核失败 -->
    <template  v-if="auditStatus === 2">
      <img src="../images/result-fail.png">
      <p class="p4">申请失败</p>
      <p class="p3">商城消费能提升申请通过率哦～</p>
    </template>
    <!-- 审核中 -->
    <template  v-if="auditStatus === 0">
      <img src="../images/result-waiting.png">
      <p class="p4">提交成功</p>
      <p class="p3">审核中，需耐心等待～最快30s完成审核</p>
    </template>
  </div>
  <div class="page-footer" @click="handleClick" v-if="btnText">
    <button>{{btnText}}</button>
  </div>
  <!-- 广告位 -->
  <div class="bottom-bar" v-if="advData && advData.imgUrl && (!advData.skuInfor || !advData.skuInfor.length)">
    <div class="banner">
      <img v-lazy='advData.imgUrl' @click="tapBanner">
    </div>
  </div>
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
      availablePosLimit: null,
      auditStatus: null,
      advData: null,
      btnText: "刷新结果"
    }
  },
  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      idPerson: state => state.global.userInfo.idPerson,
      accountId: state => state.global.userInfo.accountId,
      source: state => state.global.source
    }),
    ...mapState('credit', {
      creditStep: state => state.creditStep
    }),
    userLimit() {
      return this.availablePosLimit || this.defaultLimit
    }
  },
  async created() {
    this.getCreditResult()
  },
  methods:{
    ...mapActions('credit',['setCreditStep']),
    ...mapActions('global',['updateUserInfo']),
    async handleClick(){
      if (this.auditStatus === 1) {
        await this.updateUserInfo({source: this.source})
        window.location.href = window.location.origin + '/custom-page/jxh-loan/#/home'
      } else {
        this.getCreditResult()
      }
    },
    async getCreditResult() {
      const res = await this.$api.jxhCredit.JXHgetCreditResult({userId: this.userId});
      if (res.code === 'sc0' || res.code === '0') {
        this.availablePosLimit = res.data.totalLimit || "8,000"
        this.auditStatus = res.data.auditStatus
        let advCode = ""
        if(res.data.auditStatus === 0) {
          advCode = "jxh_amftcreditWatting"
          this.btnText = "刷新结果"
        } else if(res.data.auditStatus === 1) {
          advCode = "jxh_amftCreditSuccess"
          this.btnText = "去借钱"
        } else {
          this.btnText = null
          advCode = "jxh_amftcreditFail"
          this.creditStep && this.creditStep.rejectDeadline && this.$messagebox({
            title: "提示",
            message: this.creditStep.rejectDeadline
          });
        }
        this.toGetAdvert(advCode)
      } else {
        this.$toast(res.message)
      }
    },
    // 获取广告位子
    async toGetAdvert(advCode) {
      const res = await this.$api.toGetAdvertisement({
        code: advCode,
        personId: this.idPerson
      })
      if (res.code === 'sc0') {
        this.advData = res.data
      } else {
        this.$toast(res.message)
      }
    },
    // 点击广告位
    tapBanner() {
      if (!this.advData.jumpType) return;
      if (this.advData.jumpType === 9 ) {
        window.location.href = this.advData.jumpParam
      } else {
        this.$nativeBridge.jumpNativeForType(
          this.advData.jumpType,
          this.advData.jumpParam || "")
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.page-layout{
  width: 100%;
}
.credit-result{
  width: 100%;
  background: #fff;
  color:rgba(54,54,54,1);
  text-align: center;
  .p1{
    font-size: .3rem;
    line-height: .42rem;
    padding-top: .6rem;
  }
  .p2{
    font-size: .96rem;
    line-height: 1.12rem;
    font-weight: 600;
    margin-top: .2rem;
  }
  .p3{
    color: #A8A8A8;
    font-size: 0.28rem;
    line-height: 0.4rem;
    padding: 0.32rem 0 .6rem 0;
  }
  .p4{
    font-size: .4rem;
    line-height: .56rem;
  }
  img{
    width: 1.48rem;
    height: 1.48rem;
    display: inline-block;
    margin: .56rem 0 .36rem 0;
  }
}
.page-footer {
  text-align: center;
  padding-top: .8rem;
  button{
    -webkit-appearance: none;
    border: none;
    font-size: .32rem;
    color: #fff;
    width: 6.84rem;
    height: .88rem;
    line-height: .88rem;
    border-radius: .44rem;
    background: rgba(186, 153, 80, 1);
  }
}
.bottom-bar{
  margin-top: .8rem;
  width: 100%;
  .banner {
    width: 100%;
    img{
      width: 100%;
      min-height: 3rem;
    }
  }
}
</style>


