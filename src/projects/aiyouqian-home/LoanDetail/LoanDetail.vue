<template>
  <div class="loan-detail">
    <div class="loan-card" data-growing-container :data-growing-title="name">
      <h3 v-if="data.title">{{data.title}}</h3>
      <h3 v-else>最高可借</h3>
      <div class="loan-limit">
        <div class="limit-box">
          <span class="icon-m">￥</span><span>{{data.highest}}</span>
        </div>
      </div>
      <div class="loan-dec">
        <div>
          <span class="number">{{data.borrowLimit}}</span>
          <span class="dec">可借额度(元)</span>
        </div>
        <div>
          <span class="number">{{data.passNum | formatData}}</span>
          <span class="dec">通过人数</span>
        </div>
      </div>
      <button @click="toLoan" data-growing-container :data-growing-title="name">{{data.btnText || '立即提现'}}</button>
    </div>
    <div class="product-detail">
      <p :class="{active}" @click="active = !active">产品详情</p>
      <ul class="loan-ul" v-show="active">
        <li v-for="(item, index) in data.info" :key="index">
          <span>{{item.title}}</span>
          <span>{{item.val}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from "vuex";
  import {linkTap} from '@/helpers/util'

  export default {
    data() {
      return {
        active: false,
        data: {},
        number: 0,
        index: 0,
        name: ''
      }
    },
    filters: {
      formatData(num) {
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
        userId: state => state.global.userInfo.userId,
        isSign: state => state.global.userInfo.isSign,
        idPerson: state => state.global.userInfo.idPerson,
        mobile: state => state.global.userInfo.mobile,
      }),
    },
    mounted() {
      document.setTitle(this.$route.query.name);
      const id = this.$route.query.id;
      this.name = this.$route.query.name;
      this.getLoanDetailData(id);
      // this.init()
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      init() {
        this.number = 24415;
        const time = new Date(new Date('2018/12/06').setHours(0, 0, 0, 0)) / 1000
        const now = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
        const day = (now - time) / 86400
        for (let i = 0; i < day; i++) {
          const random = 1234
          this.number += random;
        }
      },
      // 查询详情数据
      async getLoanDetailData(id) {
        const res = await this.$api.getLoanDetailData({id: id});
        if (res.code === 'sc0' && res.data) {
          this.data = res.data[0];
          this.data.info = [
            {
              title: '额度范围',
              val: this.data.borrowLimit,
            },
            {
              title: '审核时间',
              val: `平均${this.data.audit}分钟`,
            },
            {
              title: '放款时间',
              val: `平均${this.data.loanSpeed}分钟放款`,
            },
            {
              title: '期限范围',
              val: `${this.data.borrowDeadline}个月`,
            },
          ];
        } else {
          this.$toast('该产品已下架')
        }
      },
      toLoan() {
        if (env.isApp()) {
          if (!this.isSign) {
            this.$nativeBridge.jumpToLogin({sourceType: 'JQ_APP'}).then((info) => {
              this.initSignStatus();
            });
            return;
          }
          // if (!this.idPerson) {
          //   this.$router.push({path: '/baseInfo'})
          //   return
          // }
        }
        // else {
        //   if (!this.isSign) {
        //     this.$router.push({path: '/login'})
        //     return
        //   }
        // }
        if (this.data.name === '好易借' && env.isApp()) {
          this.queryIsOldUser()
        } else if (this.data.name === '秒速' && env.isApp()) {
          this.queryMsUser()
        } else if (this.data.name === '惠域U卡' && env.isApp()) {
          // 获取当前用户年龄是否满足[20,44]区间
          this.getUserAge()
        } else if (this.data.name === '苏宁任性贷' && env.isApp()) {
          this.querySnUser()
        } else if (this.data.name === '魔借' && env.isApp()) {
          this.queryMjUser()
        } else {
          window.location.replace(this.data.url);
        }
      },
      // 好易借撞库
      async queryIsOldUser() {
        const param = {
          phoneNo: this.mobile
        }
        const res = await this.$api.queryIsOldUser(param)
        if (res.code === 'sc0') {
          if (res.data.newUrl) {
            linkTap(res.data.newUrl)
            return;
          }
        }
        linkTap(this.data.url)
      },
      async getUserAge() {
        const res = await this.$api.getUserAge({userId: this.userId})
        if (res.code === '0') {
          const age = Number(res.data.age)
          if (age >= 20 && age <= 40) {
            // window.location.href = this.data.url
            linkTap(this.data.url)
            return;
          }
        }
        this.$messagebox.alert('根据您的信息，已为您推荐更合适的平台').then(() => {
          // window.location.href = 'https://microservice.wacai.com/loan/stream/UY9LN1?af=LW25QKSCKHDQLC'
          linkTap('https://microservice.wacai.com/loan/stream/UY9LN1?af=LW25QKSCKHDQLC')
        })
      },
      // 秒速撞库
      async queryMsUser() {
        const param = {
          userId: this.userId
        }
        const res = await this.$api.queryMsUser(param)
        if (res.code === 'sc0') {
          if (res.data.url) {
            linkTap(res.data.url)
            return;
          }
        }
        linkTap(this.data.url)
      },
      // 苏宁联合登录
      async querySnUser() {
        const param = {
          userId: this.userId,
          phoneNo: this.mobile
        }
        const res = await this.$api.querySnUser(param)
        if (res.code === 'sc0' || res.code === '0') {
          if (res.data.snUrl) {
            this.$api.suningFormPost(res.data.snUrl, res.data)
          } else {
            this.$toast(res);
          }
        } else {
          this.$toast(res.message);
        }
      },
      // 魔借撞库
      async queryMjUser() {
        const param = {
          userId: this.userId,
          phoneNo: this.mobile
        }
        const res = await this.$api.queryMjUser(param)
        if (res.code === 'sc0') {
          if (res.data.newUrl) {
            linkTap(res.data.newUrl)
            return;
          }
        }
        this.$toast(res.message);
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "src/style/index.scss";

  .loan-detail {
    height: 100%;
    color: #363636;
    font-family: PingFang-SC-Regular;
    .loan-card {
      height: 7.24rem;
      padding: 0.4rem 0;
      margin-bottom: 0.16rem;
      text-align: center;
      background-color: #ffffff;
      h3 {
        font-size: 0.32rem;
        margin-bottom: 0.4rem;
      }
      .loan-limit {
        margin: 0 auto;
        height: 3.6rem;
        width: 3.6rem;
        line-height: 3.2rem;
        border-radius: 50%;
        /*border: 0.17rem solid #dfb975;*/
        font-family: San-Francisco-Display-Bold;
        color: #363636;
        font-size: 0.6rem;
        font-weight: bold;
        background: linear-gradient(to left, #F9AA39, #FFDD4E);
        position: relative;
        .limit-box {
          height: 3.26rem;
          width: 3.26rem;
          margin: 0.17rem;
          border-radius: 50%;
          background-color: #fff;
          position: absolute;
          .icon-m {
            text-indent: -0.1rem;
            font-size: 0.4rem;
            font-family: San-Francisco-Display-Bold;
          }
        }
      }
      .loan-dec {
        margin-top: 0.3rem;
        height: 0.64rem;
        display: flex;
        div {
          display: flex;
          width: 50%;
          flex-direction: column;
          .number {
            font-size: 0.32rem;
            font-weight: 500;
            margin-bottom: 0.08rem;
          }
          .dec {
            font-size: 0.24rem;
            color: #868686;
          }
        }
      }
      button {
        margin-top: 0.4rem;
        height: 0.8rem;
        width: 4.4rem;
        border: none;
        border-radius: 0.4rem;
        background: linear-gradient(to left, #F9AA39, #FFDD4E);
        font-size: 0.32rem;
        color: #ffffff;
        font-weight: bold;
      }
    }
    .product-detail {
      background: #ffffff;
      p {
        height: 0.88rem;
        padding: 0 0.3rem;
        line-height: 0.88rem;
        font-weight: 500;
        font-size: 0.32rem;
        border-bottom: 0.01rem solid #e5e5e5;
        @include bg-image("../image/icon-down");
        background-repeat: no-repeat;
        background-position-y: center;
        background-position-x: 6.92rem;
        background-size: 0.3rem;
        &.active {
          @include bg-image("../image/icon-up");
        }
      }
      .loan-ul {
        li {
          height: 0.8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0.3rem;
          font-size: 0.28rem;
        }
      }
    }
  }
</style>
