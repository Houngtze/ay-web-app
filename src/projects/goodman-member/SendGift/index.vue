<template>
  <div class="send-gift">
    <div class="page-header">
      <h2>会员专属权益 精美礼品限时领取!</h2>
      <p>1、2020年8月15日0时到2020年9月29日0时之前购买季卡会员的用户填写信息后赠送指定保温杯（在会员卡有效期之内申请）</p>
      <p>2、2020年9月29日0时到2020年12月31日购买季卡以上会员的用户可选择以下礼品之一</p>
      <product-selector :product-list="productData" @onActiveSelect="handleSelect"/>
    </div>
    <div class="page-content">
      <div class="send-gift-block">
        <h3>———— 领取人信息 ————</h3>
        <div class="field">
          <div class="icon">
            <img src="../images/icon-user.png">
          </div>
          <mt-field type="text" placeholder="填写领取人姓名"
                    :attr="{ maxlength: 11,minlength: 11 }" v-model="form.name" :disabled="isDisable"></mt-field>
        </div>
        <div class="field">
          <div class="icon">
            <img src="../images/icon-phone.png">
          </div>
          <mt-field type="tel" placeholder="填写领取人手机号"
                    :attr="{ maxlength: 11,minlength: 11 }" v-model="form.mobile" :disabled="isDisable"></mt-field>
        </div>
        <div class="field address">
          <div class="icon">
            <img src="../images/icon-address.png">
          </div>
          <mt-field type="text" placeholder="填写领取人收货地址"
                    :attr="{ maxlength: 100,minlength: 11 }" v-model="form.address" :disabled="isDisable"></mt-field>
        </div>
        <p>注：1、赠品14天内发货，如14天仍未发货请咨询客服<br />
          2、扫地机器人仅限年卡会员领取<br />
          3、填写信息以第一次填写为准，多次选择填写无效<br />
        </p>
      </div>
      <div class="send-gift-btn">
        <div class="submit" @click="btnHandle"><span>立即领取</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import ProductSelector from './ProductSelector';

  function checkPhone(value) {
    return /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/.test(value);
  }

  export default {
    components: {
      ProductSelector
    },
    data() {
      return {
        agreeMsg: true, // 同意条款
        form: {
          name: '', // 收件人
          mobile: '', // 手机号码
          address: '', // 地址
        },
        productData: [],
        selectProduct: "",
        isDisable: false
      };
    },
    mounted() {
      this.getData()
    },
    computed: {
      ...mapState('global', {
        userId: state => state.userInfo.userId || '',
        idPerson: state => state.userInfo.idPerson || '',
      }),
      ...mapState('vip', {
        vipData: state => state.vipData
      }),
    },
    methods: {
      getData() {
        if (process.env.NODE_ENV !== 'development') {
          fetch('/custom-page/goodman-member/static/vip-goods.json').then(res=> res.json() ).then(res => {
            this.productData = res.data
          })
        } else {
          this.productData = require("../../../../public/static/vip-goods").data
        }
        this.getVipGiftInfo()
      },
      getVipGiftInfo() {
        this.$api.getVipGiftInfo({
          userId: this.userId
        }).then(res => {
          if (res.code === 'sc0'){
            if (res.data.gift) {
              this.form = {
                ...this.form,
                ...res.data.gift
              }
            }
            if (!res.data.giftFlag) {
              this.isDisable = true
              this.$messagebox({
                title: '提示',
                message: '仅限活动期内开通季卡/年卡的新会员领取',
                confirmButtonText: '立即开通会员',
                showCancelButton: false
              }).then(action => {
                this.$router.push({path: "/vip-pay"})
              })
            }
          }
        })
      },
      handleAddress() {
        this.$messagebox({
          title: '领取成功',
          message: '如需变更领取人信息，请联系在线客服关注“爱用商城APP”微信公众号（周一至周日09:00~18:30）',
          confirmButtonText: '确定',
          cancelButtonText: '关闭',
          showCancelButton: false
        }).then(action => {
          this.$router.back()
        })
      },
      btnHandle() {
        if (!this.form.name || !this.form.mobile || !this.form.address) {
          return this.$toast('收货信息有误，请重新确认');
        }
        if (!checkPhone(this.form.mobile)) {
          return this.$toast('请输入有效的电话的号码');
        }
        if (!this.selectProduct) {
          return this.$toast('请选择您要领取的商品');
        }
        this.$api.fillVipGiftInfo({
          userId: this.userId,
          name: this.form.name,
          mobile: this.form.mobile,
          address: this.form.address,
          productName: this.selectProduct.code
        }).then(res => {
          if (res.result === 'success') {
            this.handleAddress()
          } else {
            this.$toast(res.message)
          }
        })
      },
      handleSelect(data) {
        this.selectProduct = data
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/style/index.scss';
  .send-gift{
    background-color: #121111;
  }
  .page-header {
    width: 100%;
    h2{
      font-size: .48rem;
      font-family: PingFang SC;
      font-weight: 600;
      color: #FAEBD8;
      text-align: center;
      padding: .3rem 0 .17rem 0;
      background: linear-gradient(0deg, #FFF5E2 0%, #F0CB93 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }
    & > p{
      font-size: .22rem;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.6);
      text-align: left;
      padding: 0 .3rem;
    }

  }

  .page-content {
    background: rgba(18, 17, 17, 1);
    padding: 0 .41rem .3rem .41rem;
  }

  .send-gift-block {
    & > h3 {
      font-size: .3rem;
      color: rgba(53, 51, 47, 1);
      line-height: 1;
      text-align: center;
      padding: .33rem 0 .35rem 0;
    }
    & > p {
      font-size: .22rem;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(53,51,47,1);
      padding: .38rem 0 .32rem 0;
      line-height: 1.5;
      text-align: left;
    }
    border-radius: .18rem;
    background-color: #fff;
    padding: 0 .44rem;
    .field {
      border: 1px solid rgba(130, 130, 130, 0.5);
      border-radius: .1rem;
      padding: 0 .24rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: .3rem;
      &.address{
        margin-bottom: 0;
      }
      .icon {
        display: flex;
        align-items: center;
        img {
          width: .37rem;
          display: inline-block;
        }
      }

      /deep/ .mint-field {
        background-image: none;
        flex: 1;
        height: .92rem;
        .mint-cell {
          background-image: none;
        }
        .mint-cell-wrapper {
          background-image: none;
          padding-right: 0;
        }
        input[disabled] {
          color: #A8A8A8;
        }
        textarea{
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

  }
  .send-gift-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #363636;
    margin-top: .3rem;
    margin-bottom: .98rem;
    & div {
      width: 6.68rem;
      height: .94rem;
      background:linear-gradient(0deg,rgba(249,227,193,1),rgba(244,194,123,1));
      border-radius: .47rem;
      line-height: .94rem;
      font-size: .4rem;
      font-weight:bold;
      color:rgba(18,17,17,1);
    }
  }
</style>

