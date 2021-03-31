<template>
  <div class="page-layout">
    <div class="home-container">
      <div class="home-header">
        <div class="tel-input">
          <input type="tel" placeholder="请输入手机号码" maxlength="11" @keyup="getNumberAttribution"
                 v-model="tel">
        </div>
        <p v-if="tel.length==11" :class="tel==phone?'is-self':'not-self'">
          {{tel==phone?'':'非'}}本人手机号{{placeOwnership}}</p>
      </div>
      <div class="gap"></div>
      <ul class="home-tab">
        <li :class="index==currentIndex?'active':''" @click="changeTab(index)" v-for="(item,index) in tabList"
            :key="index">
          {{item}}
        </li>
      </ul>
      <div class="home-content" v-if="currentIndex==0">
        <ul class="home-denomination">
          <li v-for="(item,index) in goodList" :key="index" @click="choosePrice(index,item)"
              :class="index==priceIndex?'active':''">
            <p>{{item.denomination}}元</p>
            <p>售价 {{item.price}}元</p>
          </li>
        </ul>
        <button @click="goPrepaidNow">立即充值</button>
      </div>
      <div class="home-orders" v-if="currentIndex==1" v-for="(item,index) in orderList" :key="index">
        <div class="tip-box">
          <div class="order-tip" @click="toDetail(item.orderNo)">
            <p class="tip-status">{{dealState(item.state,item.payState)}}</p>
            <div class="tip-content">
              <div class="tip-left">
                <img src="./img/phone-icon.png" alt="">
                <div>
                  <p>{{item.title}}</p>
                  <p>{{timestampToTime(item.createTime)}}</p>
                </div>
              </div>
              <div class="tip-right">{{item.denomination}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-order" v-if="orderList.length==0 && currentIndex==1">
        <img src="./img/no-order.png" alt="">
        <p>您还没有相关的订单</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from "vuex";
  import {timestampToTime} from "@/helpers/utils"

  export default {
    data() {
      return {
        tabList: ['充话费', '订单记录'],
        currentIndex: 0,
        priceIndex: 0,
        rechargePrice: '',
        actualPrice: '',
        tel: '',
        fhtml: '',
        source: '',
        goodId: '',
        goodList: [],
        orderList: [],
        placeOwnership: '',
        isRightArea: ''
      }
    },
    computed: {
      ...mapState({
        isSign: state => state.global.sign.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state => state.global.userInfo.idPerson,
        ident: state => state.global.userInfo.ident,
        phone: state => state.global.userInfo.phone,
        userName: state => state.global.userInfo.name
      })
    },
    methods: {
      timestampToTime,
      // 处理订单状态
      dealState(state, payState) {
        if (state == 1 && payState == 0) {
          return '已完成';
        } else if (state == 1 && payState == 1) {
          return '支付成功充值失败';
        } else if (state == 1 && payState == 2) {
          return '充值中';
        }
      },
      // tab切换
      async changeTab(idx) {
        this.currentIndex = idx;
        if (idx == 1) {
          let res = await this.$api.getOrderList({uid: this.userId});
          if (res.code == '0') {
            this.orderList = res.data.list;
          }
        } else {
          this.getRechargeData();
        }
      },
      // 获取充值面额
      async getRechargeData() {
        let res = await this.$api.getRechargeData({});
        if (res.code == '0') {
          this.rechargePrice = res.data.list[0].denomination;
          this.actualPrice = res.data.list[0].price;
          this.goodId = res.data.list[0].id;
          this.goodList = res.data.list;
        }
      },
      // 获取号码归属地
      async getNumberAttribution() {
        if (this.tel.length == 11) {
          let res = await this.$api.getNumberAttribution({phone: this.tel, uid: this.userId});
          this.isRightArea = res.code;
          if (res.code == '0') {
            this.placeOwnership = `(${res.data})`;
          } else {
            this.placeOwnership = '(请填写正确的手机号)';
          }
        } else {
          this.placeOwnership = '';
        }
      },
      // 立即充值
      goPrepaidNow() {
        if (!this.tel || this.tel.length !== 11) {
          return this.$toast("请填写正确的手机号");
        }
        if (this.isRightArea !== '0') {
          return this.$toast("请填写正确的手机号");
        } else {
          window.sessionStorage.setItem('refillPhone', JSON.stringify({
            phone: this.tel,
            area: this.placeOwnership,
            isRightArea: this.isRightArea
          }));
          window.sessionStorage.setItem('createTime', new Date().getTime() + 900000);
          this.$router.push({
            path: '/cashier',
            query: {price: this.rechargePrice, actual: this.actualPrice, phone: this.tel, id: this.goodId}
          });
        }
      },
      // 选择面额
      choosePrice(index, item) {
        this.priceIndex = index;
        this.rechargePrice = item.denomination;
        this.actualPrice = item.price;
        this.goodId = item.id;
      },
      // 查看订单详情
      toDetail(orderNo) {
        this.$router.push({path: '/detail', query: {id: orderNo}})
      }
    },
    created() {
      if (!this.userId) {
        return this.$router.push('/login');
      }
      if (this.$route.query.type) {
        this.changeTab(this.$route.query.type);
      }
      this.getRechargeData();
    },
    // 第一次进入返显用户手机号，从收银台返回显示上一次输入的手机号
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (from.path == '/cashier') {
          if (window.sessionStorage.getItem('refillPhone')) {
            let refillPhone = JSON.parse(window.sessionStorage.getItem('refillPhone'));
            vm.tel = refillPhone.phone;
            vm.placeOwnership = refillPhone.area;
            vm.isRightArea = refillPhone.isRightArea;
          }
        } else {
          vm.tel = vm.phone;
          vm.getNumberAttribution();
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .page-layout {
    color: #363636;
    height: 100%;
    .home-container {
      height: 100%;
      background-color: #fff;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .home-header {
        height: 1.74rem;
        margin-bottom: .2rem;
        padding: .56rem .3rem .3rem;
        .tel-input {
          border-bottom: .02rem solid #f3f3f3;
          input {
            width: 100%;
            height: .7rem;
            font-size: .48rem;
          }
          input::-webkit-input-placeholder {
            color: #A8A8A8;
            font-size: .36rem;
          }
          input::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #A8A8A8;
            font-size: .36rem;
          }
          input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #A8A8A8;
            font-size: .36rem;
          }
          input:-ms-input-placeholder { /* Internet Explorer 10-11 */
            color: #A8A8A8;
            font-size: .36rem;
          }
        }
        p {
          line-height: .5rem;
        }
        .is-self {
          color: #D09E54;
        }
        .not-self {
          color: #F63337;
        }
      }
      .gap {
        width: 100%;
        height: .18rem;
        background-color: #F2F2F2;
      }
      .home-tab {
        display: flex;
        justify-content: space-between;
        line-height: .7rem;
        background-color: #fff;
        border-bottom: .02rem solid #f3f3f3;
        li {
          width: 50%;
          list-style: none;
          font-size: .3rem;
          color: #363636;
          text-align: center;
          margin: 0 1.1rem;
        }
        .active {
          color: #D09E54;
          border-bottom: .08rem solid #D09E54;
        }
      }
      .home-content {
        padding: .3rem;
        .home-denomination {
          width: 100%;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;
            width: 30%;
            height: 1.3rem;
            padding: .24rem 0;
            background-color: #F9F9F9;
            border-radius: .06rem;
            text-align: center;
            margin-bottom: .3rem;
            p:nth-child(1) {
              font-size: .3rem;
              font-family: PingFangSC-Medium;
            }
            p:nth-child(2) {
              font-size: .22rem;
            }
          }
          .active {
            background-color: #FFFAEF;
            border: .02rem solid #D09E54;
            color: #D09E54;
          }
        }
        button {
          border-style: none;
          color: #fff;
          font-size: .36rem;
          line-height: .8rem;
          border-radius: .1rem;
          background: linear-gradient(to left, #D09E54, #E1BC78);
          width: 100%;
          margin-top: .5rem;
        }
      }
      .home-orders {
        padding: 0 .3rem;
        p {
          line-height: 1;
        }
        .tip-box {
          padding: .3rem 0;
          border-bottom: .02rem solid #F3F3F3;
          .order-tip {
            min-height: .16rem;
            width: 100%;
            background-color: #F9F9F9;
            border-radius: .1rem;
            padding: .22rem .22rem .46rem;
            .tip-status {
              color: #A8A8A8;
              text-align: right;
              font-size: .2rem;
            }
            .tip-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .tip-left {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                div {
                  min-height: .7rem;
                  display: flex;
                  justify-content: space-between;
                  flex-direction: column;
                }
                img {
                  width: auto;
                  height: .7rem;
                  display: inline-block;
                  margin-right: .16rem;
                }
                p:nth-child(1) {
                  font-size: .26rem;
                }
                p:nth-child(2) {
                  font-size: .22rem;
                  color: #A8A8A8;
                }
              }
              .tip-right {
                font-size: .36rem;
                font-family: PingFangSC-Medium;
              }
            }
          }
        }
      }
      .no-order {
        text-align: center;
        img {
          margin: 1.32rem 0 .3rem;
          height: 1.82rem;
          width: auto;
        }
        p {
          color: #A8A8A8;
          font-size: .3rem;
        }
      }
    }
  }
</style>
