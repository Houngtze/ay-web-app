<template>
  <div class="activate" v-if="showContent">
    <div class="header-container">
      <div class="activate-card" :style="{backgroundImage: 'url(' + toptheData.img + ')'}">
        <div class="header-card">
          <div class="card-content">
            <span class="card-top">{{toptheData.title}}</span>
            <span class="card-limit">{{toptheData.subTitle}}</span>
          </div>
          <button @click="toWithdrawalPage">立即提现</button>
        </div>
      </div>
      <div class="activate-entry">
        <div @click="tapOther(item)" data-growing-container :data-growing-title="item.name"
             v-for="(item,index) in buttunData.list" :key="index">
          <img class="icon" :src="item.icon">
          <span>{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="activate-guss">
      <div class="guss-title">猜你喜欢</div>
      <ul class="guss-list">
        <li v-for="(item,index) in middlelowData.list" :key="index" @click="goYouLike(item)" data-growing-container
            :data-growing-title="item.name">
          <div>
            <img :src="item.icon" alt="">
            <span>{{item.name}}</span>
          </div>
          <div class="price-range">
            <p>{{item.borrowLimit}}</p>
            <p>可借额度(元)</p>
          </div>
        </li>
      </ul>
      <div class="swipe-box">
        <mt-swipe :auto="shufflingData.speed">
          <mt-swipe-item v-for="(item,index) in shufflingData.list" :key="index"
                         @click.native="toNewPage(item)">
            <img :src="item.icon" alt="">
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </div>
    <div class="activate-others">
      <div class="title">
        <span>{{borrowData.title}}</span>
        <span>{{borrowData.subTitle}}</span>
      </div>
      <ul class="others-ul">
        <li v-for="(item, index) in borrowData.list"
            @click="toLoanDetail(item)"
            :key="index"
            data-growing-container
            :data-growing-title="item.name">
          <div class="card-title">
            <div>
              <div class="img-box">
                <img :src="item.icon">
              </div>
              <div>
                <span class="product-name">{{item.name}}</span>
                <span v-if="index<3" class="ranking">{{`NO.${index+1}`}}</span>
                <span v-if="item.audit==0" class="ranking">秒批</span>
              </div>
            </div>
            <span class="pass-number">{{item.passNum | formatData}}人已通过</span>
          </div>
          <div class="card-contend">
            <div class="card-contend-left">
              <p>￥{{item.borrowLimit}}</p>
              <p>{{item.title}}</p>
            </div>
            <div class="card-contend-right">
              <button v-if="item.name === '你我贷' && repaymentUrl!==''" data-growing-container
                      :data-growing-title="item.name">立即还款
              </button>
              <button v-else-if="item.name === '你我贷' && repaymentUrl==='' && loanStatusAc === 0" data-growing-container
                      :data-growing-title="item.name">待提现
              </button>
              <button v-else data-growing-container :data-growing-title="item.name">立即申请</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--右侧悬浮-->
    <div class="suggest" @click="toBill" v-if="suspenData">
      <img class="suggest-btn" :src="suspenData.img">
    </div>
    <div>
      <!--APP端显示弹窗-->
      <mt-popup
        v-model="popupVisible"
        popup-transition="popup-fade"
        closeOnClickModal=false
        class="pop-bar"
        v-if="bottomlowData.img">
        <div class="content">
          <div class="close-btn" @click="popupVisible=false">
            <span></span>
          </div>
          <div class="tap-btn">
            <span @click="toNextDetail()" :style="{backgroundImage: 'url(' + bottomlowData.img + ')'}"></span>
          </div>
        </div>
      </mt-popup>
    </div>
    <div class="e-forget-password-content" v-if="forGetPwHtml" v-html="forGetPwHtml" ref="formSubmit"></div>
  </div>
</template>
<script>

  function sum(m, n) {
    return Math.floor(Math.random() * (m - n) + n);
  }

  import env from '@/helpers/env';
  import {mapState, mapActions} from "vuex";
  import {session} from '@/helpers/storage';
  import {redirectToLoginPage} from '@/helpers/utils';
  import {linkTap} from '@/helpers/utils'
  import {Toast} from 'mint-ui';
  import Request from '@/services/request';

  export default {
    data() {
      return {
        companys: [],
        showContent: false,
        setIntv: null,
        popupVisible: true,
        isApp: env.isApp(),
        repaymentUrl: '',
        loanStatusAc: '',
        toptheData: {},
        buttunData: {},
        buttonData: {},
        middlelowData: {},
        shufflingData: {},
        borrowData: {},
        bottomlowData: {},
        suspenData: {},
        showLoading: null,
        forGetPwHtml: null
      };
    },
    filters: {
      formatData(num) {
        const time = new Date(new Date('2018/12/06').setHours(0, 0, 0, 0)) / 1000
        const now = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
        const day = (now - time) / 86400
        for (let i = 0; i < day; i++) {
          const random = 1234
          num += random;
        }
        num = num + '';
        if (!num.includes('.')) {
          num += '.'
        }
        return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ',';
        }).replace(/\.$/, '');
      }
    },
    computed: {
      ...mapState({
        isSign: state => state.global.userInfo.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state => state.global.userInfo.idPerson,
        identity: state => state.global.userInfo.identity,
        mobile: state => state.global.userInfo.mobile,
        name: state => state.global.userInfo.name,
      })
    },
    async created() {
      this.showLoading = Toast({
        className: 'g-mask-toast-loading',
        iconClass: 'g-mask-toast-loading-icon',
        duration: -1,
      });
      // 增加权限导流(授信被拒、授信失败、消费失败、提现失败都停留在贷超，否则导流到现金贷)
      if (this.$route.query.from !== 'xjd') {
        const res = await this.$api.getBackflow({userId: this.userId});
        if (res.code == 'sc0') {
          this.showLoading.close();
          if (!res.data.haveOpen) {
            return this.$nativeBridge.jumpNative('billToCredit');
          }
          if (res.data.creditOpen && res.data.loanOpen && res.data.orderOpen) {
            window.location.replace(window.location.origin + '/custom-page/jyc-xjd/#/home');
          }
        }
      }
      this.getConfigData();
      this.checkParams();
    },
    mounted() {
      if (this.$route.query.source) {
        session.set('source', this.$route.query.source);
      }
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      //立即提现
      async toWithdrawalPage() {
        if (await this.checkedStatus(this.toptheData)) {
          linkTap(this.toptheData.url);
        }
      },
      async getAudit() {
        const res = await this.$api.getAudit({
          userId: this.userId,
          ucAccountId: this.ucAccountId
        });
        if (res.data) {
          if (res.data.totalLimit === 0) {
            this.$nativeBridge.jumpToAppCashLoan({cashLoanStatus: 2});
          } else {
            const {totalLimit} = res.data;
            this.$router.push({path: "/withdrawal", query: {totalLimit}});
          }
        } else {
          this.$toast({
            message: `${res.message}`,
            position: "bottom"
          });
        }
      },
      // 轮播广告
      async toNewPage(item) {
        if (await this.checkedStatus(item)) {
          linkTap(item.url);
        }
      },
      // 跳转详情
      async toLoanDetail(item) {
        if (item.name === "爱用有钱" || item.name === "免息借款" || item.name === '指尖阳光') {
          linkTap(item.url);
          return false
        }
        if (item.needStat) {
          const res = await this.toStat(item)
          if (res) {
            linkTap(item.url);
          }
        } else {
          linkTap(item.url);
        }
        // this.$router.push({path: '/loan', query: {id: item.id, name: item.name}})
      },
      // 九宫格跳转
      async tapOther(item) {
        if (await this.checkedStatus(item)) {
          if (item.jumpType === 1) {
            linkTap(item.url);
          } else if (item.jumpType === 2) {
            if (item.name === '芝麻分') {
              if (env.isApp()) {
                if (!this.isSign) {
                  this.$nativeBridge.jumpToLogin({sourceType: 'JQ_APP'}).then((info) => {
                    this.initSignStatus();
                  });
                } else {
                  let params = {
                    ident: this.identity,
                    mobile: this.mobile,
                    name: this.name,
                    platform: 'android',
                    callbackUrl: window.location.origin + '/custom-page/aiyouqian-home.html#/home',
                  };
                  if (env.isIos()) {
                    params.platform = 'ios';
                  }
                  let zmfData = await new Request().post(item.url, params);
                  if (zmfData.code === 'sc0' || zmfData.code === '0') {
                    if (typeof(zmfData.data) === 'object') {
                      if (zmfData.data.zhimaCreditUrl !== "" && zmfData.data.zhimaCreditUrl !== null) {
                        linkTap(zmfData.data.zhimaCreditUrl);
                      }
                      else {
                        this.bottomToast('已授权芝麻分');
                      }
                    }
                    else {
                      this.bottomToast(zmfData.message);
                    }
                  }
                  else {
                    this.bottomToast(zmfData.message);
                  }
                }
              } else {
                // 非APP
                console.log('非APP');
              }
            }
          } else if (item.jumpType === '3') {
            const param = {
              personId: this.idPerson,
              channelType: env.isApp() ? "IOS" : (env.isAndroid() ? "ANDROID" : "WAP"),
              returnUrl: window.location.origin + '/custom-page/status-pages/#/e-guide-middleware?orderNo=' + this.orderNo
            };
            let res = Request.post('/v2/personCenter/accountActive/getZhimaCreditInfo', param);
            // const res = await statusApi.ef.trsPwdReset(param);
            if (res.code === 'sc0') {
              this.forGetPwHtml = res.data.reSetPassword
              this.$nextTick(() => {
                this.submitForm()
              })
            } else {
              this.$toast(res.message)
            }
          }
        }
      },
      // 猜你喜欢
      async goYouLike(item) {
        if (await this.checkedStatus(item)) {
          linkTap(item.url);
        }
      },
      // 提交表单
      submitForm() {
        this.$refs.formSubmit.querySelector("form").submit();
      },
      // 验证是否登录或实名
      // 2019-08-13 新增验证是否需要统计needStat字段判断走统计
      async checkedStatus(item) {
        if (item.needLogin && !this.isSign) {
          await redirectToLoginPage();
          return false;
        } else if (item.needReal && !this.idPerson) {
          this.$router.push('/baseInfo');
          return false;
        } else if (item.needStat) {
          const res = await this.toStat(item)
          return res;
        } else {
          return true;
        }
      },
      // 统计接口
      async toStat(data) {
        if (!data || !data.url) {
          return this.$toast('数据有误')
        }
        return new Promise(async resolve => {
          const res = await this.$api.postStat({
            url: data.url
          });
          if (res.code === 'sc0') {
            resolve(res)
          } else {
            this.$toast({
              message: res.message,
              position: 'bottom'
            })
            resolve(false)
          }
        })
      },
      // 悬浮
      async toBill() {
        if (await this.checkedStatus(this.suspenData)) {
          linkTap(this.suspenData.url);
        }
      },
      // 弹窗
      async toNextDetail() {
        if (await this.checkedStatus(this.bottomlowData)) {
          linkTap(this.bottomlowData.url);
        }
      },
      bottomToast(str) {
        this.$toast({
          message: str,
          position: 'bottom',
          duration: 3000,
        })
      },
      checkParams() {
        // 获取页面参数
        if (this.$route.query.success && this.$route.query.success == 1) {
          this.bottomToast('授权成功');
        }
        else {
          if (this.$route.query.success && this.$route.query.success !== '' && this.$route.query.success !== null && this.$route.query.success != 1) {
            if (this.$route.query.remark && this.$route.query.remark !== '' && this.$route.query.remark !== null) {
              // 有返回失败提示信息
              this.bottomToast(this.$route.query.remark);
            }
            else {
              if (this.$route.query.success == 2) {
                this.bottomToast('用户取消');
              }
              else if (this.$route.query.success == 4) {
                this.bottomToast('抓取数据中');
              }
              else if (this.$route.query.success == 6) {
                this.bottomToast('页面初始化失败');
              }
              else {
                this.bottomToast('芝麻分授权失败');
              }
            }
          }
        }
      },
      // 获取页面配置数据
      async getConfigData() {
        let res = await this.$api.getConfigData({userId: this.userId});
        if (res.code === 'sc0') {
          this.toptheData = res.data.topthe;
          this.buttunData = res.data.buttun;
          this.middlelowData = res.data.middlelow;
          this.shufflingData = res.data.shuffling;
          this.borrowData = res.data.brrow;
          this.bottomlowData = res.data.bottomlow;
          this.suspenData = res.data.suspen;
          this.showLoading.close();
          this.showContent = true;
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "src/style/index.scss";

  .activate {
    width: 100%;
    color: #363636;
    font-family: PingFang-SC-Regular;
    font-weight: 500;
    p {
      line-height: 1;
    }
    .header-container {
      padding: .32rem 0 .22rem;
      background-color: #ffffff;
      margin-bottom: .2rem;
      .activate-card {
        background-size: 100% 100%;
        min-height: 2.4rem;
        margin: 0 .3rem;
        .header-card {
          padding: 0 .3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 2.4rem;
        }
        .card-content {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          min-height: 1.2rem;
        }
        .card-top {
          font-size: 0.3rem;
          font-weight: 400;
          color: #ffffff;
        }
        .card-limit {
          font-size: .6rem;
          color: #ffffff;
        }
        button {
          padding: 0 .28rem;
          height: .6rem;
          line-height: .6rem;
          border: none;
          background-size: 100%;
          color: #F9AB3B;
          font-weight: bold;
          background-color: #fff;
          font-size: .3rem;
          border-radius: .3rem;
        }
      }
      .activate-entry {
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: .18rem;
        div {
          display: flex;
          width: calc(100% / 5);
          flex-shrink: 0;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          font-size: 0.24rem;
          color: $color-main;
          span {
            font-size: .24rem;
          }
          .icon {
            display: inline-block;
            height: .74rem;
            width: auto;
            background-size: 100%;
            background-repeat: no-repeat;
          }
        }
      }
    }
    .activate-guss {
      background-color: #fff;
      margin-bottom: .2rem;
      padding: .3rem .32rem;
      .guss-title {
        color: #363636;
        font-size: .32rem;
        font-weight: 500;
      }
      .guss-list {
        margin: .2rem 0 .3rem;
        display: flex;
        justify-content: space-between;
        li {
          min-width: 32%;
          min-height: 1.62rem;
          overflow: hidden;
          background-color: #F9F9F9;
          padding: .2rem;
          border-radius: .1rem;
          img {
            display: inline-block;
            width: .5rem;
            height: .5rem;
            vertical-align: middle;
            margin-right: .16rem;
            border-radius: .1rem;
          }
          span {
            color: #333333;
            font-size: .3rem;
            font-weight: 500;
            vertical-align: middle;
          }
          .price-range {
            color: #363636;
            font-size: .24rem;
            p:nth-child(1) {
              margin: .2rem 0 .16rem;
            }
            p:nth-child(2) {
              color: #A8A8A8;
              font-size: .2rem;
            }
          }
        }
      }
      .swipe-box {
        height: 1.2rem;
        line-height: 1.2rem;
      }
    }
    .activate-others {
      height: calc(100% - 3.96rem);
      background-color: #ffffff;
      margin-bottom: .46rem;
      .title {
        padding: 0 .3rem;
        line-height: .8rem;
        font-family: PingFang-SC-Medium;
        border-bottom: .2px solid #eee;
        span {
          &:nth-child(1) {
            font-size: .32rem;
            font-weight: 500;
            margin-right: .18rem;
          }
          &:nth-child(2) {
            font-size: 0.24rem;
            color: #868686;
          }
        }
      }
      .others-ul {
        height: calc(100% - 0.64rem);
        padding-left: .3rem;
        li {
          min-height: 1.7rem;
          padding: .2rem .3rem .2rem 0;
          border-bottom: .2px solid #eee;
          width: 100%;
          &:last-child {
            border: none;
          }
          .card-title {
            display: flex;
            height: 0.5rem;
            justify-content: space-between;
            align-items: center;
            div {
              height: 0.5rem;
              display: flex;
              align-items: center;
              font-size: 0.32rem;
              .img-box {
                height: 0.5rem;
                width: 0.5rem;
                img {
                  width: 100%;
                  height: 100%;
                  border-radius: .1rem;
                }
              }
              .ranking {
                display: inline-block;
                border: .02rem solid #F9AA39;
                color: #F9AA39;
                font-size: .2rem;
                border-radius: .14rem;
                height: .28rem;
                line-height: .28rem;
                width: .7rem;
                text-align: center;
              }
              .product-name {
                white-space: nowrap;
                font-size: .3rem;
                color: #333;
                font-weight: 500;
                margin-left: .16rem;
                margin-right: .12rem;
                display: flex;
                align-items: center;
              }
            }
            .pass-number {
              color: #A8A8A8;
              font-size: .2rem;
            }
            .card-dec {
              display: inline-block;
              padding: 0 0.15rem;
              height: 0.38rem;
              background-color: #eeeeee;
              border-radius: 0.19rem;
              font-size: 0.24rem;
              line-height: 0.38rem;
              color: #666666;
            }
          }
          .card-contend {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: .16rem;
            min-height: 0.6rem;
            height: 100%;
            .card-contend-left {
              min-height: 0.6rem;
              p {
                &:first-child {
                  margin-bottom: .18rem;
                  font-size: 0.32rem;
                  font-weight: 500;
                  color: #363636;
                  margin-right: .14rem;
                }
                &:last-child {
                  font-size: 0.2rem;
                  color: #A8A8A8;
                }
              }
            }
            .card-contend-right {
              height: 100%;
              button {
                line-height: .6rem;
                padding: 0 .22rem;
                border: none;
                background: linear-gradient(to left, #F9AA39, #FFDD4E);
                background-size: 100%;
                color: #fff;
                font-size: 0.3rem;
                border-radius: .1rem;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
    .suggest {
      position: fixed;
      top: 70%;
      right: 0.1rem;
      width: 1.3rem;
      height: 1.3rem;
      z-index: 1000;
      & img {
        width: 100%;
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        &.suggest-btn {
          z-index: 999;
        }
        &.suggest-rotate {
          z-index: 99;
          animation: bg-rotate 7.2s linear infinite;;
        }
      }
      .suggest-bg {
        width: 100%;
        height: 100%;
        @include bg-image('./img/suggest-extract-bg');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
      }
    }
    .pop-bar {
      width: 5rem;
      background: none;
      background-size: 100%;
      .content {
        position: relative;
        display: flex;
        // padding-top: 1.22rem;
        .close-btn {
          position: absolute;
          top: -1.22rem;
          right: 0.68rem;
          span {
            display: inline-block;
            width: 0.7rem;
            height: 1.22rem;
            @include bg-image('./img/pop-icon-close');
            background-size: 100%;
          }
        }
        .tap-btn {
          height: 6.9rem;
          width: 100%;
          align-self: flex-end;
          text-align: center;
          span {
            display: inline-block;
            height: 100%;
            width: 100%;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            line-height: 1.54rem;
            font-size: 0.4rem;
            color: #ffffff;
            font-weight: 500;
          }
        }
      }
    }
  }

  @keyframes bg-rotate {
    from {
      transform: rotate(0deg)
    }
    to {
      transform: rotate(359deg)
    }
  }

  .e-forget-password-content {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
<style lang="scss">
  .activate-toast {
    top: 0.8rem !important;
    // opacity: 0.5;
    padding: 0.04rem 0.08rem !important;
    border-radius: 0.06rem;
    background: #ffa71c;
    max-width: none;
    // width: max-content;
    white-space: nowrap;
  }

  .mint-swipe-indicators .mint-swipe-indicator.is-active {
    background-color: #F9AA39;
  }

  .mint-swipe-indicators {
    position: absolute;
    bottom: -21px;
  }

  .mint-swipe-indicators .mint-swipe-indicator {
    width: .1rem;
    height: .1rem;
    background-color: #fff;
    opacity: 1;
  }
</style>

