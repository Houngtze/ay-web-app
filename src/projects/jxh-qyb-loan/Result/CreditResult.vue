<template>
<div class="page-layout" v-if="isShowContent">
  <div class="credit-result">
    <!-- 审核通过 -->
    <template  v-if="loanResult === '06'">
      <img src="../images/result-success.png">
      <p class="p4">放款成功</p>
    </template>
    <!-- 审核通过 -->
    <template  v-if="loanResult === '03'">
      <img src="../images/result-success.png">
      <p class="p4">审核通过</p>
      <p class="p3">您的贷款审核已通过，请尽快联系您的销售人员完成之后的流程！</p>
    </template>
    <!-- 提交成功 -->
    <template  v-if="loanResult === '00' || loanResult === '01'">
      <img src="../images/result-waiting.png">
      <p class="p4">提交成功</p>
      <p class="p3">申请已经提交，请保持您的手机畅通，我们的工作人员会及时联系您了解情况并告知进度。</p>
    </template>
    <!-- 申请失败 -->
    <template  v-if="loanResult === '04' || loanResult === '07' || loanResult === '08' ">
      <img src="../images/result-fail.png">
      <p class="p4">申请失败</p>
      <p class="p3">请线下联系销售人员哦</p>
    </template>
  </div>
</div>
</template>
<script>
import {mapState} from 'vuex';
export default {
  components: {
  },
  computed:{
    ...mapState('credit', {
      loanResult: state => state.loanResult
    }),
    isShowContent() {
      return ["00", "01", "03", "04", "06", "07", "08"].includes(this.loanResult)
    }
  },
  mounted() {
    if (!this.isShowContent) {
      this.$messagebox.alert("订单状态出错：LoanResult状态为：" + this.loanResult).then(res => {
        this.handleClick()
      })
    }
  },
  methods: {
    handleClick() {
      this.$router.back(-1)
    }
  }
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
  padding: 0 .32rem;
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
    font-weight: 600;
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


