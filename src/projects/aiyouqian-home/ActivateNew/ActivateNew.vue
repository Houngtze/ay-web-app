<template>
  <div class="page-layout" v-if="showBody">
    <div class="activate-card common-style">
      <div class="card-content">
        <div class="content-left">
          <p class="card-top">{{topData.title}}</p>
          <p class="card-limit">{{topData.subTitle}}</p>
        </div>
        <button @click="toNewPage(topData,'top')">立即提现</button>
      </div>
      <div class="card-notice">
        <img src="./img/notice.png" alt="">
        <div class="scroll-view">
          <ul :class="{transition}">
            <li v-for="(item, index) in list" :key="index">{{item}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="activate-entry common-style">
      <div @click="toNewPage(item,'button')" v-for="(item,index) in buttonData.list" :key="index" data-growing-container
           :data-growing-title="item.name">
        <img class="icon" :src="item.icon?item.icon:require('./img/default.png')">
        <span>{{item.name}}</span>
      </div>
      <div class="swipe-box">
        <mt-swipe :auto="middleData.speed">
          <mt-swipe-item v-for="(item,index) in middleData.list" :key="index" @click.native="toNewPage(item,'middle')">
            <img :src="item.img" alt="">
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </div>
    <div class="list-title common-style"  v-if="listData.list && listData.list.length>0">
      <span>{{listData.title}}</span>
      <span>{{listData.subTitle}}</span>
    </div>
    <div class="activate-others"  v-if="listData.list && listData.list.length>0">
      <ul class="others-ul">
        <li v-for="(item, index) in listData.list"
            @click="toNewPage(item,'list')"
            :key="index"
            :class="{'top-one': index === 0,'top-two': index === 1, 'top-three': index === 2, 'miaopi': index === 3}"
            data-growing-container
            :data-growing-title="item.name">
          <div class="card-title">
            <div class="tips-img">
              <img :src="item.icon?item.icon:require('./img/default.png')">
              <div class="tips-title">
                <span>{{item.name}}</span>
                <span v-if="item.newProduct==1">新品</span>
                <p>{{item.title}}</p>
              </div>
            </div>
            <span class="total-pass">{{item.passNum}}人已通过</span>
          </div>
          <div class="card-contend">
            <div>
              <p class="price-range">{{item.borrowLimit}}</p>
              <p>可借额度（元）</p>
            </div>
            <div>
              <p>放款速度：{{item.loanSpeed}}分钟</p>
              <p>借款期限：{{item.borrowDeadline}}</p>
            </div>
            <button>立即申请</button>
          </div>
        </li>
      </ul>
      <div class="more-product" @click="goMoreProduct">
        <span>更多产品>></span>
      </div>
    </div>
    <div class="activate-bottom" v-if="bottomData.list && bottomData.list.length>0">
      <div class="bottom-tips" v-for="(item,index) in bottomData.list" :key="index" @click="toNewPage(item,'bottom')"
           data-growing-container
           :data-growing-title="item.name">
        <div>
          <p>{{item.name}}</p>
          <p>{{item.title}}</p>
        </div>
        <img :src="item.icon?item.icon:require('./img/default.png')" alt="">
      </div>
    </div>
  </div>
</template>
<script>

  function sum(m, n) {
    return Math.floor(Math.random() * (m - n) + n);
  }

  import env from '@/helpers/env';
  import {mapState, mapActions} from "vuex";
  import {linkTap} from '@/helpers/utils'
  import {Toast} from 'mint-ui';


  export default {
    data() {
      return {
        list: [],
        isApp: env.isApp(),
        transition: false,
        plantingTimer: null,
        topData: {},
        buttonData: {},
        middleData: {},
        listData: {},
        bottomData: {},
        showBody: false,
        showLoading: null
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
    created() {
      // this.showLoading = Toast({
      //   className: 'g-mask-toast-loading',
      //   iconClass: 'g-mask-toast-loading-icon',
      //   duration: -1,
      // });
      // window.location.replace(window.location.origin + "/custom-page/jyc-xjd/#/home")
      this.getConfigData();
      // this.noticeInit();
      // this.checkParams();
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      // 滚动广告
      noticeInit() {
        let list = [this.getMessage(), this.getMessage()];
        this.list = list;
        this.plantingTimer = setInterval(() => {
          setTimeout(() => {
            let list = this.list;
            list.shift();
            list.push(this.getMessage());
            this.transition = false
          }, 1000);
          this.transition = true
        }, 2000)
      },
      getMessage() {
        let endNo = Math.floor(Math.random() * 10000)
        if (endNo < 1000) {
          endNo += 1000;
        }
        return `尾号${endNo}用户成功下款${sum(1, 6) * 5000}元`
      },
      // 获取页面配置数据
      async getConfigData() {
        const res = await this.$api.getPageConfig({});
        if (res.code == 'sc0') {
          this.topData = res.data.top;
          this.buttonData = res.data.button;
          this.middleData = res.data.middle;
          this.listData = res.data.list;
          this.bottomData = res.data.bottom;
          // this.showLoading.close();
          this.showBody = true;
        }
      },
      // 跳转通用
      async toNewPage(item, type) {
        if (await this.checkedStatus(item)) {
          linkTap(item.url);
        }
      },
      // 更多产品
      goMoreProduct() {
        linkTap(this.listData.url);
      },
      // 验证是否登录或实名
      async checkedStatus(item) {
        if (item.needLogin && !this.isSign) {
          redirectToLoginPage();
          return false;
        } else if (item.needReal && !this.idPerson) {
          this.$router.push('/baseInfo');
          return false;
        } else {
          return true;
        }
      },
      // 提示
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
    },
    beforeDestroy() {
      clearInterval(this.plantingTimer);
      this.plantingTimer = null;
    }
  };
</script>
<style lang="scss" scoped>
  @import "src/style/index.scss";

  .page-layout {
    color: #363636;
    font-family: PingFang-SC-Regular;
    font-weight: 400;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .common-style {
      padding: .3rem;
      background-color: #fff;
      margin-bottom: .18rem;
    }
    .activate-tips {
      width: 100%;
      padding: 0.1rem .3rem;
      background-color: #FFF3E2;
      & p {
        color: #FF3C3C;
        font-size: 0.26rem;
        line-height: 1;
        & span {
          text-decoration: line-through;
          display: inline-block;
          color: #868686;
          font-size: .32rem;
          margin-left: .34rem;
        }
      }
      & div {
        font-size: 0.24rem;
        border-radius: .22rem;
        background-color: #FFD293;
        padding: 0.12rem 0.15rem 0.16rem;
        color: #ffffff;
      }
    }
    .activate-card {
      padding-bottom: .14rem;
      .card-content {
        background: linear-gradient(to left, #D09E54, #E1BC78);
        border-radius: .1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .5rem .3rem;
        box-shadow: 0 4px 15px -2px #D4A65E;
        margin-bottom: .3rem;
        .content-left{
          p{
            line-height: 1;
          }
        }
        .card-top {
          padding-left: 0.1rem;
          display: inline-block;
          font-size: 0.3rem;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: .3rem;
        }
        .card-limit {
          font-size: 0.6rem;
          color: #ffffff;
          font-weight: 600;
        }
        button {
          width: 2rem;
          height: .6rem;
          border: none;
          border-radius: .3rem;
          background-color: #fff;
          background-size: 100%;
          color: #D4A45C;
          font-size: 0.3rem;
          font-weight: bold;
        }
      }
      .card-notice {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          display: inline-block;
          width: .36rem;
          height: .3rem;
        }
        .scroll-view {
          display: flex;
          width: 4.5rem;
          height: 0.48rem;
          overflow: hidden;
          justify-content: center;
          ul {
            width: 100%;
            &.transition {
              transition-duration: 1s;
              transition-timing-function: ease;
              margin-top: -0.48rem;
            }
            li {
              height: 0.48rem;
              line-height: 0.48rem;
              color: #333333;
              font-size: 0.24rem;
              padding-left: .16rem;
            }
          }
        }
      }
    }
    .activate-entry {
      padding: .26rem 0 .3rem;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .icon {
        margin-bottom: .1rem;
      }
      .swipe-box {
        padding: 0 .3rem;
        width: 100%;
        height: 1.2rem;
        line-height: 1.2rem;
        margin: 0;
        .mint-swipe {
          width: 100%;
          margin: 0;
          /deep/ .mint-swipe-items-wrap {
            width: 100%;
            height: 100%;
            .mint-swipe-item {
              width: 100%;
            }
          }
        }
      }
      div {
        display: flex;
        width: 25%;
        flex-shrink: 0;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        font-size: 0.24rem;
        color: $color-main;
        margin-bottom: .4rem;
        .icon {
          display: inline-block;
          height: .8rem;
          width: auto;
          background-size: 100%;
          background-repeat: no-repeat;
        }
      }
    }
    .list-title {
      font-family: PingFang-SC-Medium;
      border-bottom: .2px solid #f3f3f3;
      margin: 0;
      span {
        font-weight: 500;
        color: #363636;
        &:nth-child(1) {
          display: inline-block;
          font-size: 0.32rem;
          margin-right: .16rem;
        }
        &:nth-child(2) {
          font-size: 0.22rem;
        }
      }
    }
    .activate-others {
      height: calc(100% - 3.96rem);
      background-color: #fff;
      margin-bottom: .2rem;
      .others-ul {
        height: calc(100% - 0.64rem);
        li {
          padding: 0.3rem;
          border-bottom: .2px solid #eee;
          .card-title {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            height: 100%;
            margin-bottom: .16rem;
            img {
              width: .7rem;
              height: .7rem;
              border-radius: .1rem;
            }
            .tips-img {
              display: flex;
              justify-content: flex-start;
              .tips-title {
                max-height: .7rem;
                margin-left: .16rem;
                overflow: hidden;
                span {
                  &:nth-child(1) {
                    display: inline-block;
                    color: #333333;
                    font-size: .3rem;
                    font-weight: 500;
                    margin-bottom: .08rem;
                  }
                  &:nth-child(2) {
                    display: inline-block;
                    padding: 0 .16rem;
                    color: #D4B98C;
                    height: .28rem;
                    line-height: .28rem;
                    text-align: center;
                    font-size: .2rem;
                    border: 1px solid #D4B98C;
                    border-radius: .4rem;
                    margin-left: .14rem;
                    vertical-align: top;
                  }
                }
                p {
                  color: #A8A8A8;
                  font-size: .2rem;
                }
              }
            }
            .total-pass {
              color: #A8A8A8;
              font-size: .2rem;
            }
          }
          .card-contend {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            div {
              &:nth-child(2) {
                margin-left: -.3rem;
              }
            }
            .price-range {
              font-size: .3rem;
              font-weight: 600;
            }
            p {
              font-size: .22rem;
            }
            button {
              width: 1.8rem;
              height: .6rem;
              line-height: .6rem;
              border: none;
              border-radius: .1rem;
              background: linear-gradient(to left, #D09E54, #E1BC78);
              background-size: 100%;
              color: #fff;
              font-size: 0.3rem;
              font-family: PingFangSC;
              white-space: nowrap;
            }
          }
        }
      }
      .more-product {
        color: #868686;
        font-size: .24rem;
        text-align: center;
        line-height: .6rem;
        img {
          width: .2rem;
          height: .22rem;
          display: inline-block;
          margin-left: .08rem;
        }
      }
    }
    .activate-bottom {
      padding: .44rem 0 .32rem;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      margin-bottom: .4rem;
      .bottom-tips {
        display: flex;
        justify-content: space-between;
        width: 50%;
        padding: 0 .3rem;
        &:nth-child(1) {
          border-right: .02rem solid #eee;
        }
        div {
          padding: .16rem 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        p {
          &:nth-child(1) {
            color: #363636;
            font-size: .28rem;
          }
          &:nth-child(2) {
            color: #868686;
            font-size: .24rem;
          }
        }
        img {
          display: inline-block;
          width: 1.16rem;
          height: 1.16rem;
        }
      }
    }
  }
</style>
<style lang="scss">
  .mint-swipe-indicators .mint-swipe-indicator.is-active {
    background-color: #E8B260;
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

