<template>
  <div class="confirm">
    <div class="data-block">
      <div class="data-header g-mobile-border">
        <slot name="data-header"></slot>
      </div>
      <div class="data-block-content list">
        <ul>
          <li v-for="(item, index) in confirmData.listData" :key="index">
            <p>
              {{item.text}}：{{item.value}}
              <label v-if="item.label">{{item.label}}</label>
            </p>
            <div class="item-btn" v-if="item.isShowBtn"
                 @click="item.onActivateEvent(item.onActivateContent)"></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="bank-info">
      <div class="title">
        <h3>收款银行卡</h3>
      </div>
      <div class="content">
        <div class="main">
          <div class="bank-bar" v-if="defaultBankInfo" @click="openBankPickPop">
            <img v-lazy="bankImg(defaultBankInfo.bankIconUrl)">
            <div class="bank-mes">
              <span :class="'bank-name ' + (defaultBankInfo.isDefault === 1 ? 'bank-default' : '')">{{defaultBankInfo.bankName}}</span>
              <p class="bank-code">**** **** **** <span>{{defaultBankInfo.bankNo && defaultBankInfo.bankNo.substr(-4, 4)}}</span>
              </p>
            </div>
          </div>
          <div class="bank-add" @click="toAppendCard">
            <span>添加新的银行卡</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bank-desc" v-if="confirmData.confirmDesc.text">
      <p>{{confirmData.confirmDesc.text}}</p>
    </div>
    <div class="phone-credit" flex-right>
      <p>手机认证</p>
      <div class="phone-icon">
        <img src="./images/icon-phone-success@2x.png"
             srcset="./images/icon-phone-success@2x.png 2x,./images/icon-phone-success@3x.png 3x">
      </div>
    </div>
    <div class="page-bottom-btn" v-if="confirmData.confirmBtn">
      <button @click="handlerBtn">{{confirmData.confirmBtn.text}}</button>
    </div>
    <div class="agree-check" v-if="confirmData.confirmAgreement">
      <label class="agree-checkbox"><input type="checkbox" v-model="agreeMsg"/><i></i></label>
      <span>我已阅读并同意
        <label @click="toProtocol(item.href)" v-for="(item, index) in confirmData.confirmAgreement" :key="index">
          {{item.text}}
          <span v-if="index !== (confirmData.confirmAgreement.length -1)
          && confirmData.confirmAgreement.length > 1">&</span>
        </label>
      </span>
    </div>
    <picker-pop
      class="bank-card-picker-pop"
      :slotArr="pickerBankInfo"
      @handleValue="handleValue"
      ref="pickerPop" v-if="bankInfo">
    </picker-pop>
  </div>
</template>

<script>
  import PickerPop from "../../credit/components/PickerPop";
  import defaultBank from './images/icon-bank-default@2x.png'

  export default {
    name: "LoanConfirm",
    components: {
      PickerPop
    },
    props: ['hasSelectedData', 'confirmData', 'bankInfo'],
    data() {
      return {
        selectBankIndex: null,
        agreeMsg: true,
        defaultBankInfo: null
      }
    },
    computed: {
      pickerBankInfo() {
        const arr = this.bankInfo.map((item, index) => {
          const str = `${item.bankName} (${item.bankNo.substr(0, 4)} ******** ${item.bankNo.substr(-4, 4)})`
          return {
            index,
            val: str
          }
        })
        return arr
      },
    },
    watch: {
      hasSelectedData(newVal) {
        if (newVal) {
          this.defaultBankInfo = this.hasSelectedData
        }
      },
      selectBankIndex(newVal) {
        this.$emit('onActivateSelect', this.bankInfo[newVal])
        this.defaultBankInfo = this.bankInfo[newVal]
      }
    },
    mounted() {
      this.defaultBankInfo = this.hasSelectedData
    },
    methods: {
      // 银行卡图标
      bankImg(img) {
        return {
          src: img,
          error: defaultBank,
          loading: defaultBank
        }
      },
      toAppendCard() {
        this.$router.push({name: 'append-bank-card'})
      },
      handleValue(val, index) {
        this.selectBankIndex = index
      },
      openBankPickPop() {
        this.$refs.pickerPop.open();
      },
      handlerBtn() {
        if (!this.agreeMsg) {
          this.$toast('请先阅读并同意协议')
          return
        }
        this.confirmData.confirmBtn.onActivateBtn()
      },
      toProtocol(href) {
        window.location.href = href
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../style/common.scss';

  .bank-card-picker-pop {
    /deep/ .mint-picker-btn {
      .sure {
        color: #d09a54;
      }
    }
  }

  .bank-info {
    margin-top: .18rem;
    width: 100%;
    & .title {
      width: 100%;
      line-height: 1;
      padding: .3rem;
      font-size: .32rem;
      background-color: #fff;
    }
    & .content {
      display: flex;
      height: 100%;
      width: 100%;
      flex-direction: column;
      .main {
        .bank-bar {
          display: flex;
          width: 100%;
          height: 1.8rem;
          background-color: #fff;
          margin-top: 0.18rem;
          padding: 0 0.3rem;
          align-items: center;
          @include bg-image('./images/icon-right');
          background-size: 0.14rem 0.22rem;
          background-repeat: no-repeat;
          background-position-y: center;
          background-position-x: calc(100% - 0.3rem);
          img {
            width: 0.54rem;
            height: 0.54rem;
            margin-right: 0.3rem;
          }
          .bank-mes {
            display: flex;
            flex-direction: column;
            .bank-name {
              font-size: 0.3rem;
              color: #363636;
              margin-bottom: 0.24rem;
              display: flex;
              align-items: center;
              justify-content: left;
            }
            p {
              font-size: 0.3rem;
              color: #a8a8a8;
              span {
                font-size: 0.36rem;
                color: #363636;
                font-weight: 700;
              }
            }
          }
        }
        .bank-default::after {
          content: '默认还款';
          display: inline-block;
          vertical-align: bottom;
          width: 1.2rem;
          margin-left: 0.12rem;
          height: 0.32rem;
          line-height: 0.32rem;
          text-align: center;
          border-radius: 0.28rem;
          border: 0.03rem solid #d09a54;
          font-size: 0.18rem;
          white-space: nowrap;
          color: #d09a54;
        }
        .bank-add {
          display: flex;
          height: 1.1rem;
          padding: 0 0.3rem;
          margin-top: 0.18rem;
          align-items: center;
          background-color: #fff;
          span {
            font-size: 0.3rem;
            color: #363636;
            &::before {
              content: '';
              display: inline-block;
              width: 0.54rem;
              height: 0.54rem;
              @include bg-image('./images/icon-add');
              background-size: 100%;
              background-repeat: no-repeat;
              vertical-align: middle;
              margin-right: 0.3rem;
            }
          }
        }
      }
      & .bank-add {
        margin: .18rem 0;
      }
    }
  }

  .bank-desc {
    width: 100%;
    padding: .3rem;
    background-color: #fff;
    color: #363636;
    font-size: .24rem;
  }
  .phone-credit{
    width: 100%;
    padding: .3rem;
    background-color: #fff;
    color: #363636;
    font-size: .3rem;
    line-height: 1;
    & p::after {
      content: '手机运营商';
      display: inline-block;
      vertical-align: bottom;
      padding: 2px 3px;
      margin-left: 0.12rem;
      line-height: 0.32rem;
      text-align: center;
      border-radius: 0.28rem;
      border: 0.03rem solid #d09a54;
      font-size: 0.18rem;
      white-space: nowrap;
      color: #d09a54;
    }
    & .phone-icon{
      width: .4rem;
      & img{
        width: 100%;
      }
    }
  }
</style>

