<template>
  <div class="vip-adv" @click="toDc">
    <div class="left">
      <h3>会员享分期通道精准推荐特权<img src="../../images/icon-arrow-right-black.png"></h3>
      <ul>
        <li><img src="../../images/loan-adv-icon_1@2x.png" /> 正规机构</li>
        <li><img src="../../images/loan-adv-icon_2@2x.png" />智能推荐</li>
        <li><img src="../../images/loan-adv-icon_3@2x.png" />更高额度</li>
      </ul>
    </div>
    <div class="right">
      <button>{{isVip ? '立即申请' : '开通立享'}}</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: ["isVip"],
    methods: {
      toDc() {
        if(this.isVip){
          window.location.href = window.location.origin + "/custom-page/jyc-xjd/#/org-loan-list"
        } else {
          this.$router.push({path: "/vip-pay"})
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .vip-adv{
    width: auto;
    margin: 0 0 .2rem 0;
    padding: .3rem .26rem;
    background: linear-gradient(90deg, #FBE8C7 0%, #F7D7A4 70%);
    border-radius: .14rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left{
      h3{
        font-weight: 600;
        font-size: .32rem;
        display: inline-flex;
        align-items: center;
        justify-content: left;
        color: #583A18;
        img{
          width: .26rem;
          display: inline-block;
          margin-left: .04rem;
        }
      }
      ul{
        display: inline-flex;
        align-items: center;
        justify-content: left;
        padding-top: 0.08rem;
        li{
          margin-right: .28rem;
          font-size: .24rem;
          color: #583A18;
          display: inline-flex;
          align-items: center;
          font-weight: 500;
          img{
            height: .34rem;
            display: inline-block;
            margin-right: .04rem;
          }
        }
      }
    }
    .right{
      button{
        min-width: 1.44rem;
        border: none;
        line-height: .54rem;
        background: linear-gradient(90deg, #55402E 0%, #3D352E 100%);
        border-radius: .29rem;
        padding: 0 .18rem;
        font-size: .26rem;
        font-family: PingFang-SC-Medium, PingFang-SC;
        color: #FFFFFF;
      }
    }
  }
</style>
