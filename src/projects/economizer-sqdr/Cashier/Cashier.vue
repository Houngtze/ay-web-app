<template>
  <div class="cashier">
    <div class="container">
      <!-- <pay-way></pay-way> -->
      <add-adress v-if="detail.goodType === 'entity'"></add-adress>
      <pay-way v-if="detail.goodType === 'virtual'"></pay-way>
      <div class="bor-bot"></div>
      <div class="goods-list">
        <div class="goods-li">
          <div class="goods-pic" v-if="detail.activityPrice == 1"><img v-lazy="imgA"></div>
          <div class="goods-pic" v-if="detail.activityPrice == 2"><img v-lazy="imgB"></div>
          <div class="goods-msg">
            <div class="msg-txt">
              <p class="g-tt">{{detail.activityPrice}}元爱用商城优惠券</p>
              <p class="g-des">购买越多，中奖概率越高</p>
            </div>
            <div class="g-shop">
              <p class="g-price">&yen;{{detail.activityPrice}}/件</p>
              <div class="g-options">
                <i class="r-icon" @click="count > 1 && count--"></i>
                <input type="number" v-model="count">
                <i class="l-icon" @click="count < (detail.fullNum-detail.joinedNum) && count++"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="goods-li">
          <div class="goods-pic"><img v-lazy="detail.imgUrl2"></div>
          <div class="goods-msg">
            <div class="msg-txt">
              <p class="g-tt"><img class="t-icon" src="../images/icon-up.png">{{detail.activityTheme}}</p>
            </div>
            <div class="g-shop">
              <p class="g-warm">参与码：{{count}}/个</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bor-bot"></div>
      <div class="pay-way" v-if="needPay">
        <label class="pay-way-li">
          <img src="../images/zfb-icon.png">
          <p>支付宝支付</p>
          <input type="radio" checked name="payway">
          <img src="../images/checked.png" alt="" class="checked-img">
        </label>
      </div>
    </div>
    <div class="footer">
      <p class="cont-txt">0元购（免运费）</p>
      <p class="cont-bnt" @click="goToPay">立即支付</p>
    </div>
    <div ref="fhtml" v-show="false" v-html="fhtml"></div>
  </div>
</template>
<script>
  import {mapState, mapActions} from "vuex";
  import AddAdress from '../components/AddAdress/Shower'
  import PayWay from '../components/AddPayWay/Shower'

  export default {
    components: {
      AddAdress, PayWay
    },
    data() {
      return {
        address: null,
        count: 1,
        detail: {},
        imgA: require('../images/icon-yhq1.png'),
        imgB: require('../images/icon-yhq2.png'),
        fhtml: '',
        locked: false,
        needPay: false
      };
    },
    filters: {},
    computed: {
      ...mapState({
        isSign: state => state.global.userInfo.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state => state.global.userInfo.idPerson,
        identity: state => state.global.userInfo.identity,
        mobile: state => state.global.userInfo.mobile,
        name: state => state.global.userInfo.name,
      }),
      ...mapState('addr', {
        selectedAddr: state => state.selectedAddr,
      }),
      ...mapState('order', {
        goodsDetail: state => state.goodsDetail,
      }),
      ...mapState('payway', {
        selectedPayWay: state => state.selectedPayWay,
        payWayList: state => state.payWayList,
      }),
    },
    watch: {
      count(newValue) {
        newValue = newValue <= 1 ? 1 : newValue.replace ? newValue.replace(/^\D+/, '') : newValue;
        newValue = (newValue === '' || !newValue) ? 1 : newValue
        let maxCount = this.detail.fullNum - this.detail.joinedNum;
        newValue = newValue > maxCount ? maxCount : newValue;
        this.count = parseInt(newValue)
        this.$emit('amount', this.count)
      },
    },
    created() {
      this.address = this.selectedAddr;
      this.detail = this.goodsDetail;
      if (!this.goodsDetail) {
        this.toast('页面数据错误');
      }
    },
    mounted() {

    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      ...mapActions("addr", [
        "set_SelectedAddr", "set_AddrList"
      ]),
      toast(mes) {
        this.$toast({
          message: mes,
          duration: 1500
        });
      },
      async goToPay() {
        if (this.locked) {
          return;
        }
        // 防止用户重复点击
        this.locked = true;
        // 去支付
        if (Number(this.count) < 1) {
          this.toast("商品数量有误");
          return
        }
        let params = {
          userId: this.userId,
          activityThemeId: this.detail.activityThemeId,
          goodCount: this.count,
          referrerUserId:this.detail.referrerUserId,
          recommendOrderId:this.detail.recommendOrderId,
          goodType: this.detail.goodType,
        };
        if (this.detail.goodType === 'entity') {
          if (!this.selectedAddr || this.selectedAddr === '') {
            this.toast('请选择收货地址');
            return false;
          }
          params = Object.assign(params, {
            consignee: this.selectedAddr.custName,
            mobile: this.selectedAddr.phone,
            province: this.selectedAddr.province,
            city: this.selectedAddr.city,
            county: this.selectedAddr.region,
            town: this.selectedAddr.street,
            address: this.selectedAddr.address,
          })
        }
        if (this.needPay && this.detail.goodType === 'virtual') {
          if (!this.selectedPayWay || this.selectedPayWay === '') {
            this.toast('请选择微信或支付宝');
            return false;
          }
          params = Object.assign(params, {
            wechat: this.selectedPayWay.wechat,
            alipayAccount: this.selectedPayWay.alipayAccount,
          })
        }
        let saveRes = await this.$api.saveActivityOrderHttp(params);
        if (saveRes.code === '0') {
          this.$router.replace({
            path: '/success',
            query: {
              "themeId": this.detail.activityThemeId,
              "orderId": saveRes.data.id,
              "goodId": this.detail.goodId
            }
          })
        }
        else {
          this.locked = false;
          this.toast(saveRes.message);
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "src/style/index.scss";

  .cashier {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    .container {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .bor-bot {
        height: 0.18rem;
        background: #f2f2f2;
      }
      .goods-list {
        padding-left: 0.3rem;
        .goods-li {
          display: flex;
          border-bottom: 0.005rem solid #e5e5e5;
          padding: 0.3rem;
          padding-left: 0;
          .goods-pic {
            width: 1.6rem;
            height: 1.6rem;
            flex-shrink: 0;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 1.6rem;
              display: inline-block;
            }
          }
          .goods-msg {
            width: 100%;
            overflow: hidden;
            box-sizing: border-box;
            padding-left: 0.3rem;
            .msg-txt {
              min-height: 1rem;
              .g-tt {
                color: #363636;
                font-size: 0.3rem;
                line-height: 0.48rem;
                .t-icon {
                  display: inline-block;
                  vertical-align: middle;
                  height: 0.38rem;
                  width: auto;
                  margin-right: 0.1rem;
                }
              }
              .g-des {
                color: #a8a8a8;
                font-size: 0.22rem;
              }
            }
            .g-shop {
              display: flex;
              justify-content: space-between;
              .g-price {
                color: #FF4949;
                font-size: 0.36rem;
              }
              .g-warm {
                color: #a8a8a8;
              }
              .g-options {
                width: 1.8rem;
                flex-shrink: 0;
                display: flex;
                justify-content: space-between;
                i {
                  width: 0.5rem;
                  height: 0.5rem;
                  background: center no-repeat;
                  background-size: 100% auto;
                  display: inline-block;
                  flex-shrink: 0;
                }
                .l-icon {
                  background-image: url(../images/add.png);
                }
                .r-icon {
                  background-image: url(../images/reduce.png);
                }
                input {
                  width: 100%;
                  height: 0.5rem;
                  line-height: 0.5rem;
                  background: #f2f2f2;
                  border: 0.05rem solid #fff;
                  border-top-width: 0;
                  border-bottom-width: 0;
                  text-align: center;
                  color: #868686;
                }
              }
            }
          }
        }
      }
      .pay-way {
        padding: 0.3rem;
        .pay-way-li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.2rem;
          .checked-img {
            width: .3rem;
            height: .3rem;
          }
          p {
            font-size: 0.3rem;
            width: 100%;
            box-sizing: border-box;
            padding-left: 0.2rem;
          }
          img {
            width: 0.7rem;
            height: auto;
            flex-shrink: 0;
          }
          input[type="radio"] {
            display: none;
          }
          input[type="radio"] + i {
            width: 0.4rem;
            height: 0.4rem;
            display: inline-block;
            flex-shrink: 0;
            background: url(../components/AddAdress/img/radio-no.png) center no-repeat;
            background-size: 100% auto;
          }
          input[type="radio"]:checked + i {
            background-image: url(../components/AddAdress/img/radio-icon.png);
          }
        }
      }
    }
    .footer {
      flex-shrink: 0;
      height: 0.92rem;
      border-top: 0.005rem solid #e5e5e5;
      display: flex;
      flex-direction: row;
      .cont-txt {
        width: 100%;
        box-sizing: border-box;
        padding: 0.3rem;
      }
      .cont-bnt {
        flex-shrink: 0;
        width: 3rem;
        height: .92rem;
        line-height: 0.92rem;
        text-align: center;
        color: #fff;
        background-color: #FF2929;
        font-size: 0.3rem;
      }
    }
  }
</style>
<style lang="scss">
</style>

