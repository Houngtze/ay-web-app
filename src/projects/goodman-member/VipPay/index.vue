<template>
  <div class="page-layout">
    <!-- 权益 -->
    <vip-power-block :data="powerData" :vipLevel="currentCard.cardType" :userId="userId" v-if="powerData" />
    <vip-loan-adv :isVip="vipLevel"/>
    <!-- 会员卡选择 -->
    <vip-card-selector class="card-selector" ref="vipSelector"
                       :vipListData="vipListData" :userId="userId"
                       @onActiveSelect="getPowerData"
    />
    <!-- 支付按钮 -->
    <div class="vip-pay">
      <button @click="payNow">{{payBtnText}}</button>
      <div class="pay-desc">
        <p>
          <label><input type="checkbox" v-model="termStatic"><i class="icon"></i>已阅读并同意</label>
          <a href="http://aiyong.szqk-tech.com/terms/ai-vip-package-service-deduct-agreement.html">《AI会员服务协议》</a>
        </p>
        <p><span>*</span>会员服务一经开通不支持取消/退款</p>
      </div>
    </div>
    <div class="pay-banner" @click="toSend">
      <img v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-pay-banner.png'">
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import VipPowerBlock from "../components/VipPowerBlock"
  import VipLoanAdv from "../components/VipLoanAdv"
  import VipCardSelector from "../components/VipCardSelector"
  export default {
    name: "index",
    components: {
      VipPowerBlock,
      VipLoanAdv,
      VipCardSelector
    },
    data() {
      return {
        vipLevel: null,
        powerData: null,
        termStatic: true,
        vipListData: null,
        currentCard: null
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
        userName: state => state.global.userInfo.userName
      }),
      ...mapState('vip', {
        pageData: state => state.vipData
      }),
      payBtnText() {
         const price = this.currentCard ? ("￥" +  this.currentCard.cardAmount / 100) : ""
         return this.vipLevel ? price + " 立即续费" : price + " 立即支付"
      }
    },
    async mounted() {
      await this.getVipList()
      this.getPowerData()
    },
    methods: {
      // 获取可以购买VIP卡类型
      getVipList() {
        return new Promise(async resolve => {
          const res = await this.$api.getVipList({
            userId: this.userId
          })
          if (res.code === 'sc0') {
            this.vipListData = res.data
            this.currentCard = res.data.find(item => {
              return item.defaultSelect === 1
            })
              resolve()
          } else {
            this.$toast(res.message)
          }
        })
      },
      async getPowerData(data) {
       if (data) this.currentCard = data
        const res = await this.$api.getVipHomeData({
          userId: this.userId,
          selectedCardType: data ? data.cardType : this.currentCard.cardType
        })
        if (res.code === 'sc0') {
          this.powerData = res.data.content['2']
          this.vipLevel = res.data.vipLevel
        } else {
          this.$toast(res.message)
        }
      },
      // 立即支付
      payNow() {
        if (!this.termStatic) {
          this.$toast("请先勾选Ai会员协议")
          return
        }
        this.$refs.vipSelector.buyHaoRenKa()
      },
      toSend() {
        if (this.vipLevel) {
          this.$router.push({path: "/send-gift"})
        } else {
          this.$toast("请支付成功后领取")
        }
      }
    }
  }
</script>

<style scoped lang="scss">
.page-layout{
  padding: 0 .2rem;
  background-color: #f2f2f2;
}
.vip-pay{
  text-align: center;
  padding: 0 0 .28rem 0;
  button{
    border: none;
    width: 100%;
    height: .92rem;
    background: linear-gradient(90deg, #372F26 0%, #2C251E 100%);
    border-radius: 51px;
    font-size: .32rem;
    color:rgba(255,207,136,1);
    margin-bottom: .3rem;
  }
  .pay-desc{
    color:rgba(168,168,168,1);
    & p{
      text-align: left;
      font-size: .24rem;
      margin-bottom: .2rem;
      line-height: 1;
      span{
        color: #CD3330;
      }
      label{
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
      & a{
        color: #363636;
      }
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
}
.pay-banner{
  width: 100%;
  padding-bottom: .98rem;
  img{
    width: 100%;
  }
}
</style>
