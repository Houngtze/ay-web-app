<template>
  <SalePageLayout :isFullScreen="true">
    <ai-template :message="pageMessage">
      <template slot="image">
        <img src="./image/audit@2x.png" srcset="./image/audit@3x.png">
      </template>
      <template slot="bottom">
        <div class="buttom">
          <p @click="refresh">刷新结果</p>
          <span>支付中，请勿重复支付。订单状态预计在30分钟内更新，请稍后查看或进入订单中心查看。如果交易出现异常，支付首付订单，首付款会在3-5个工作日原路返回。</span>
          <span>如果有支付返现，则返现金额将在签收后的7个工作日后打款至还款绑定的银行卡内，退款则取消打款。</span>
        </div>
      </template>
    </ai-template>
  </SalePageLayout>
</template>
<script>
  import SalePageLayout from '@/components/SalePageLayout';
  import AiTemplate from '../components/template'
  import env from '@/helpers/env';
  export default {
    components: {
      AiTemplate,
      SalePageLayout
    },
    data() {
      return {
        pageMessage:'支付中...',
        isApp: env.isApp(),
        source: 'App',
        orderNo: null,
        payChannel: null,
      }
    },
    created() {
      if (!this.$route.query.payChannel || !this.$route.query.orderNo) {
        this.$toast("支付方式或订单号出错")
        return
      } else {
        this.orderNo = this.$route.query.orderNo
        this.payChannel = this.$route.query.payChannel
      }
      this.getSource()
    },
    methods: {
      getSource() {
        const contract = this.$route.query.contract
        const source = contract ? contract.slice(0, 2) : 10;
        switch (parseInt(source)) {
          case 31:
            this.source = 'QIAKE-ETC';
            break;
          case 32:
            this.source = 'QIAKE-AQY';
            break;
          default:
            this.source = 'App';
            break;
        }
      },
      refresh() {
        if (this.isApp) {
          this.$nativeBridge.jumpToAhAuthResult({
            orderNo: this.orderNo,
            payChannel: this.payChannel
          });
        } else {
          window.location.href = window.location.origin + `/aiyong-shop/#/?sourceFlag=${this.source}`
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .buttom{
    display: flex;
    flex-direction: column;
    align-items: center;
    p{
      width: 4rem;
      height: 1rem;
      line-height: 0.8rem;
      margin-top: 0.1rem;
      -webkit-appearance: none;
      background-image: url(/custom-page/img/button.435d9c35.png);
      background-repeat: no-repeat;
      background-color: transparent;
      background-size: 100% 100%;
      background-position: bottom;
      border: none;
      font-size: 0.35rem;
      color: #ffffff;
      &:last-of-type{
        color: #363636;
        background-position: top;
        background-image: url('./image/bg-btn@2x.png');
        background-size: 110% 100%;
        line-height: 0.9rem;
        margin-bottom: 0.3rem
      }
    }
    span{
      font-size: 0.24rem;
      color:#363636;
      line-height: 0.36rem;
      text-align: left;
      display: block;
    }
  }
</style>
