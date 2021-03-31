<template>
  <div class="page-layout">
    <div class="home-header">
      <div class="header-img">
        <img src="./img/header-img.png" alt="">
        <div class="header-content">
          <p>当前额度(元）</p>
          <p>{{pageData.isCredit=='N'?'****':personTotalLimit}}</p>
        </div>
      </div>
      <button @click="goBorrowMoney">{{pageData.isCredit=='Y'?'立即提现':'查看额度'}}</button>
    </div>
    <div class="home-content">
      <div class="home-title">认证越多，额度越高哦～</div>
      <ul class="home-list">
        <li class="list-tip" v-for="item in pageData.certificationList">
          <img :src="item.iconUrl" alt="">
          <div class="tips-info">
            <p>{{item.certificationName}}</p>
            <p>{{item.describe}}</p>
          </div>
          <button :class="item.isComplete=='Y' || item.isComplete == 'Z'?'disable-btn':''"
                  @click="goQuotaWithdrawal(item)">
            {{item.isComplete=='Y' || item.isComplete == 'Z'?'已完成':'去提额'}}
          </button>
        </li>
      </ul>
      <div class="home-more">更多提额认证正在加入中...</div>
    </div>
    <div class="home-footer">-点滴信用 重在积累-</div>
    <mt-popup
      v-model="popupVisible"
      popup-transition="popup-fade"
      closeOnClickModal=false
      class="pop-bar">
      <div class="popup-content">
        <p>暂无额度，即将为您开通</p>
        <p>现金额度(元）</p>
        <p>6000</p>
        <p>即将跳转...</p>
        <p>{{countDown}}s</p>
      </div>
    </mt-popup>
    <!-- 公告弹框 -->
    <link-dialog :isShowDialog.sync="isShowLinkDialog" :dialogConfig="linkDialogConfig"/>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import {redirectToLoginPage} from '@/helpers/utils';
  import TopNotice from '@/components/TopNotice';
  import LinkDialog from '@/components/LinkDialog';

  export default {
    name: "Home",
    components: {
      TopNotice,
      LinkDialog
    },
    data() {
      return {
        popupVisible: false,
        countDown: 5,
        certificationList: [],
        pageData: {},
        personTotalLimit: 0,
        num: 1,
        multiplier: 50,
        timer1: null,
        timer2: null,
        linkDialogConfig: {
          dialogText: {
            title: "<h3>公告</h3>",
            content: "<p>8月18号前完成提额任务的用户额度已发放，请注意查收</p><p>1、仅针对优质客户进行信用提额</p><p>2、额度提升仅代表个人信用优化，具体放款结果以第三方审核为准。</p>"
          },
          dialogBtnTex: "我知道了"
        },
        isShowLinkDialog: false
      }
    },
    computed: {
      ...mapState({
        isSign: state => state.global.userInfo.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state => state.global.userInfo.idPerson,
        ident: state => state.global.userInfo.ident,
        phone: state => state.global.userInfo.phone,
        name: state => state.global.userInfo.name
      })
    },
    methods: {
      // 额度递增动画
      countUpLimit() {
        if (this.pageData.personTotalLimit > 5000) {
          this.multiplier = 100;
        } else {
          this.multiplier = 50;
        }
        if (this.personTotalLimit + this.multiplier * this.num < Number(this.pageData.personTotalLimit)) {
          this.timer1 = setTimeout(() => {
            this.num++;
            this.personTotalLimit += (this.multiplier * this.num);
            this.countUpLimit();
          }, 20)
        } else {
          this.personTotalLimit = this.pageData.personTotalLimit;
        }
      },
      // 获取首页数据
      async getCreditIncreaseLimit() {
        let res = await this.$api.getCreditIncreaseLimit({userId: this.userId, source: 'AYSCAPP_XYTE'});
        if (res.code === 'sc0') {
          this.pageData = res.data;
          if (this.pageData.isCredit == 'Y') {
            this.countUpLimit();
          }
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
        }
      },
      // 提交提额
      async goQuotaWithdrawal(item) {
        // 已完成不可点击
        if (item.isComplete == 'Y' || item.isComplete == 'Z') {
          return;
        }
        // 未登录去登录
        if (!this.userId) {
          return redirectToLoginPage()
        }
        // // 未授信引导授信
        //  2020-7-30 去掉授信判断
        // if (this.pageData.isCredit == 'N') {
        //   return this.goCreditGranting();
        // }
        if (item.code == 'YYS') {
          // 运营商
          const res = await this.$api.getOperatorStatus({
            phone: this.phone,
            name: this.name,
            ident: this.ident,
            userId: this.userId,
            orgType: 'AYSC_AH',
            source: 'AYSCAPP_XYTE',
            clientCode: 'AYSCAPP',
            operatorCreditNotifyUrl: window.location.origin + '/custom-page/credit-withdrawal/#/index?code=YYS'
          });
          if (res.code === 'sc0') {
            window.location.href = res.data;
          } else {
            this.$toast({
              message: res.message,
              position: 'bottom'
            })
          }
        } else if (item.code == 'ZMF') {
          // 芝麻分
          const res = await this.$api.getZhimaCreditInfo({
            name: this.name,
            ident: this.ident,
            mobile: this.phone,
            callbackUrl: window.location.origin + '/custom-page/credit-withdrawal/#/index?code=ZMF',
            platform: 'H5',
            source: 'AYSCAPP_XYTE'
          });
          if (res.code === 'sc0') {
            window.location.href = res.data.zhimaCreditUrl;
          } else {
            this.$toast({
              message: res.message,
              position: 'bottom'
            })
          }
        } else if (item.code == 'TXXY') {
          // 天下信用
          window.location.href = "https://m.tianxiaxinyong.cn/cooperation/crp-v2/index.html?channel=WVdVZ0VMRDdnWlpOUHdzZlhBU3NOQT09"
        } else if (item.code == 'VIP') {
          // 会员
          window.location.href = window.location.origin + "/custom-page/goodman-member/#/vip-pay?from=withdrawal&type=1"
        } else if (item.code == 'BX') {
          // 保险
          window.location.href = window.location.origin + "/sale-m/20080300-bx.html"
        } else if (item.code == 'XHED') {
          // 保险
          window.location.href = "https://vip.xiaomifenga.com/h5/#/?code=e4dbc79a3b6aad9cc2f1b96a36ca7d876c862a85d69f5a47"
        } else {
          // 爱满分授信失败则直接跳转授权
          if (this.pageData.creditStatus == 1100) {
            return this.$router.push('/authorization');
          }
          // 判断是否需要活检和OCR认证
          const judgeRes = await this.$api.isNeedFaceOCRVerify({
            userId: this.userId,
            personId: this.idPerson,
            productType: 'AMFT',
          });
          if (judgeRes.data.isNeedFaceOCRVerify) {
            this.$nativeBridge.jumpNative('goToReCredit');
          } else {
            this.$router.push('/authorization');
          }
        }
      },
      // 提交提额
      async increaseQuota(code) {
        let res = await this.$api.commitCreditIncreaseLimit({personId: this.idPerson, code: code});
        if (res.code === 'sc0') {
          this.$router.replace({path: '/index', query: {code: ''}});
          this.getCreditIncreaseLimit();
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
        }
      },
      // 立即提现/查看额度
      goBorrowMoney() {
        if (!this.userId) {
          return redirectToLoginPage()
        }
        if (this.pageData.isCredit == 'N') {
          this.goCreditGranting();
        } else {
          window.location.href = window.location.origin + '/custom-page/jyc-xjd/#/home'
        }
      },
      // 引导授信
      goCreditGranting() {
        // 未授信引导授信
        this.popupVisible = true;
        this.timer1Down();
      },
      // 定时器
      timer1Down() {
        this.timer2 = setTimeout(() => {
          if (this.countDown > 1) {
            this.countDown--;
            this.timer1Down();
          } else {
            clearInterval(this.timer2);
            this.$nativeBridge.jumpNative('billToCredit');
          }
        }, 1000)
      },
      // 顶部通知
      openNotice() {
        this.isShowLinkDialog = true
      }
    },
    created() {
      if (this.$route.query.code) {
        this.increaseQuota(this.$route.query.code);
      } else {
        this.getCreditIncreaseLimit();
      }
    },
    beforeDestroy() {
      clearInterval(this.timer1);
      clearInterval(this.timer2);
    }
  }
</script>

<style scoped lang="scss">
  .page-layout {
    background-color: #F2F2F2;
    position: relative;
    height: 100%;
    /deep/ .kf-model{
      .enter{
        background: #fff;
        color: #D09E54;
        border-top: 0.01rem solid #E5E5E5;
      }
    }
  }
  .home-header {
    text-align: center;
    background-color: #fff;
    padding: .22rem 0 .3rem;
    margin-bottom: .2rem;
    .header-img {
      position: relative;
      img {
        height: 3.28rem;
        width: auto;
      }
      .header-content {
        position: absolute;
        top: 1.38rem;
        width: 100%;
        height: 50%;
        text-align: center;
        p {
          line-height: 1;
          &:nth-child(1) {
            color: #363636;
            font-size: .24rem;
            margin-bottom: .2rem;
          }
          &:nth-child(2) {
            color: #363636;
            font-size: .8rem;
          }
        }
      }
    }
    button {
      display: inline-block;
      width: 3rem;
      height: .8rem;
      line-height: .8rem;
      outline-style: none;
      border-style: none;
      border-radius: .4rem;
      background: linear-gradient(to left, #D09E54, #E1BC78);
      font-size: .36rem;
      color: #fff;
    }
  }

  .home-content {
    background-color: #fff;
    .home-title {
      line-height: .9rem;
      font-size: .3rem;
      padding: 0 .32rem;
      border-bottom: .5px solid #e5e5e5;
      font-family: PingFangSC-Regular;
    }
    .home-list {
      .list-tip {
        height: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 .3rem;
        font-size: .24rem;
        border-bottom: .02rem solid #f3f3f3;
        .disable-btn {
          background: #E5E5E5;
        }
        img {
          display: inline-block;
          width: auto;
          height: .5rem;
        }
        .tips-info {
          width: 75%;
          padding-left: .22rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          p {
            line-height: 1;
            &:nth-child(1) {
              font-size: .3rem;
              margin-bottom: .2rem;
            }
            &:nth-child(2) {
              font-size: .24rem;
              color: #A8A8A8;
            }
          }
        }
        button {
          display: inline-block;
          width: 1.2rem;
          height: .6rem;
          line-height: .6rem;
          outline-style: none;
          border-style: none;
          border-radius: .3rem;
          background: linear-gradient(to left, #D09E54, #E1BC78);
          font-size: .24rem;
          color: #fff;
        }
      }
    }
    .home-more {
      line-height: .9rem;
      color: #868686;
      font-size: .26rem;
      text-align: center;
    }
  }

  .home-footer {
    text-align: center;
    color: #A8A8A8;
    font-size: .24rem;
    margin: .4rem 0 .32rem;
    width: 100%;
  }

  /deep/ .mint-popup {
    border-radius: .1rem;
  }

  .popup-content {
    width: 5.6rem;
    text-align: center;
    padding: .4rem 0;
    img {
      width: 2.14rem;
      height: auto;
    }
    p {
      line-height: 1;
      &:nth-child(1) {
        color: #363636;
        font-size: .36rem;
        font-weight: 600;
      }
      &:nth-child(2) {
        color: #363636;
        font-size: .3rem;
        margin-top: .58rem;
        margin-bottom: .3rem;
      }
      &:nth-child(3) {
        color: #D7AC66;
        font-size: .9rem;
      }
      &:nth-child(4) {
        color: #A8A8A8;
        font-size: .28rem;
        margin-top: .58rem;
        margin-bottom: .15rem;
      }
      &:nth-child(5) {
        color: #A8A8A8;
        font-size: .28rem;
      }
    }
  }
</style>
