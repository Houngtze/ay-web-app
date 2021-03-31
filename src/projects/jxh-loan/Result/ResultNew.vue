<template>
  <div class="result-main">
    <div class="result-wait" v-if="showState == 'wait'">
      <div class="wait-warp">
        <div class="icon-box"><img src="./images/wait.png"/></div>
        <div class="num"><span style="font-size: 0.4rem;">¥</span>{{pageData.loanAmt}}</div>
        <div class="text-wait">放款审核中(等额本息)</div>
      </div>
      <div class="text">预计30分钟内到账，请留意放款通知短信，贷款到账后，请及时还款，逾期未还会影响您的个人征信</div>
      <div class="back-button" @click="resultBntClick">返回首页</div>
    </div>
    <div class="result-failed" v-if="showState == 'fail'">
      <div class="failed-msg">
        <div class="icon-box"><img src="./images/failed.png"/></div>
        <div class="text-wait">暂未获批</div>
        <div class="text">根据您的信用，申请以下产品的通过率可达83.32%</div>
      </div>
      <DaoLiu></DaoLiu>
    </div>
    <div v-if="txt != ''" class="mint-indicator" style="">
      <div class="mint-indicator-wrapper" style="padding: 20px;">
        <span class="mint-indicator-spin">
          <div class="mint-spinner-snake"
               style="border-top-color: rgb(204, 204, 204); border-left-color: rgb(204, 204, 204); border-bottom-color: rgb(204, 204, 204); height: 32px; width: 32px;"></div>
        </span>
        <span class="mint-indicator-text" style="">{{txt}}</span>
      </div>
      <div class="mint-indicator-mask"></div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import {Toast} from 'mint-ui';
  import {redirectToLoginPage} from '@/helpers/utils';
  import DaoLiu from '@/components/jxh/components/DaoLiu'

  export default {
    components: {
      DaoLiu
    },
    data() {
      return {
        tabHover: true,
        pageResult: {},
        pageLinkType: '',
        pageData: {},
        running: 5,
        txt: '',
        showState: '',
        cooperatorData: [],
        pageSize: 10,
        pageNum: 1,
        allLoaded: false,
      }
    },
    beforeMount() {
    },
    watch: {},
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
      }),
    },
    created() {
      this.runTime();
    },
    mounted() {
    },
    methods: {
      ...mapActions('loan', [
        'clearData'
      ]),
      async getGiftDetail() {
        const params = {
          orderNo: this.$route.query.orderNo,
        };
        const res = await this.$api.queryOrderDetailHttp(params);
        if (res.code === 'sc0' && res.data) {
          this.pageData = res.data
          this.$nativeBridge.noticeNative({path: "JXH_JQPage"})  // 通知app刷新借钱页面
          // 调用信贷的查询借款订单详情接口，订单的状态如下：0-预进件；1-放款成功；2-放款失败；3-放款中；4-借款申请流程中被拒；5-首付成功；6-终审中；7-终审通过；8-终审拒绝；10-取消订单；11-提前还款；12-逾期；13-强制还款；20-提前结清；21-正常结清；22-逾期结清；23-强制结清；31-初审通过；32-初审拒绝；41-授信申请流程中被拒；99-信用付全额退款',你需要关注的几种状态值，0、5、6、7、8
          if (res.data.orderStatus === '7' && res.data.giftOrderInfo.amount && res.data.giftOrderInfo.amount !== 0) {
            // 终审通过，去支付页面
            this.goLink({
              path: '/result-pay',
              query: {
                lno: this.$route.query.orderNo,
              }
            });
          }
          else if (res.data.orderStatus === '8') {
            // 终审拒绝，留本页面并显示失败信息
            this.showState = 'fail'
          }
          else {
            // 不做改动
            this.showState = 'wait'
          }
        }
      },
      resultBntClick() {
        // 状态组件按钮点击
        this.goLink('/home');
      },
      goLink(url) {
        // 跳转页面
        this.$router.replace(url);
      },
      runTime() {
        this.txt = '审批中' + this.running + 's';
        let timer = setInterval(() => {
          if (this.running > 1) {
            this.running = this.running - 1;
            this.txt = '审批中' + this.running + 's';
          }
          else {
            clearInterval(timer);
            this.running = 5;
            this.txt = '';
            this.getGiftDetail();
          }
        }, 1000);
      },
      linkTap() {
        window.location.href = window.location.origin + '/custom-page/promote-tool/#/login?source=jyc_dc';
      }
    },
    beforeDestroy() {
    }
  }
</script>
<style lang="scss" scoped>
  .result-main {
    .result-wait {
      height: 100%;
      min-height: inherit;
      .wait-warp{
        text-align: center;
        background-color: #fff;
        padding: 0.56rem 0rem 0.48rem 0rem;
        margin-bottom: 0.32rem;
      }
      .icon-box {
        margin-bottom: 0.36rem;
        img {
          width: 1.48rem;
          height: 1.48rem;
        }
      }
      .text-wait {
        color: #A8A8A8;
        font-size: 0.28rem;
        line-height: 0.4rem;
      }
      .num {
        color: #363636;
        font-size: 0.6rem;
        margin-bottom: 0.08rem;
        line-height: 0.56rem;
      }
      .text {
        color: #A8A8A8;
        font-size: 0.24rem;
        margin-bottom: .8rem;
        padding: 0rem 0.32rem;
      }
      .back-button {
        width: 6.84rem;
        height: .88rem;
        line-height: 0.8rem;
        background-color: #BA9950;
        border-radius: 0.44rem;
        text-align: center;
        font-size: .32rem;
        color: #fff;
        margin: 0 auto;
      }
    }
    .result-failed {
      .failed-msg {
        padding: 0.4rem 0.32rem 0.43rem 0.32rem;
        background-color: #fff;
        margin-bottom: 0.8rem;
        text-align: center;
        .icon-box {
          margin-bottom: 0.24rem;
          img {
            width: 1.5rem;
            height: 1.5rem;
          }
        }
        .text-wait {
          color: #363636;
          font-size: 0.4rem;
          margin-bottom: 0.1rem;
          font-weight: 600;
        }
        .text {
          color: #A8A8A8;
          font-size: 0.28rem;
        }
      }
      .daoliu-box {
        .more-button {
          width: 6.90rem;
          height: 0.92rem;
          background: linear-gradient(270deg, rgba(208, 158, 84, 1) 0%, rgba(225, 188, 120, 1) 100%);
          border-radius: 0.1rem;
          line-height: 0.92rem;
          color: #fff;
          text-align: center;
          font-size: 0.36rem;
          margin: 0 auto;
        }
        .daoliu-item {
          background-color: #fff;
          width: 6.9rem;
          margin: 0 auto;
          margin-bottom: 0.2rem;
          box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
          .daoliu-item-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.3rem;
            .logo-box {
              display: flex;
              align-items: center;
              img {
                width: 0.66rem;
                height: 0.66rem;
              }
              .logo-title {
                margin-left: 0.2rem;
                .title {
                  color: #363636;
                  font-size: 0.3rem;
                }
                .content {
                  color: #868686;
                  font-size: 0.24rem;
                }
              }
            }
            .sq-button {
              width: 1.80rem;
              height: .67rem;
              background: rgba(209, 159, 85, 1);
              box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);
              border-radius: .34rem;
              line-height: .67rem;
              color: #EDF1F2;
              text-align: center;
              font-size: 0.28rem;
            }
          }
          .gray-line {
            width: 6.7rem;
            height: 1px;
            background: rgba(237, 241, 242, 1);
            margin: 0 auto;
          }
          .daoliu-item-bottom {
            display: flex;
            align-items: center;
            padding: 0.3rem;
            justify-content: space-between;
            .data-item {
              text-align: center;
              .data-title {
                color: #868686;
                font-size: 0.24rem;
              }
              .data-num {
                color: #FF0000;
                font-size: 0.24rem;
              }
            }
          }
        }
      }

    }
  }
</style>


