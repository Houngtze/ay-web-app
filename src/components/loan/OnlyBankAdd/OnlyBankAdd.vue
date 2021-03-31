<template>
  <div class="bank-info">
    <div class="content">
      <div class="main">
        <div v-if="bankInfo!=='' && bankInfo!==null" class="bank-bar">
          <img :src="bankInfo.bankIconUrl">
          <div class="bank-mes">
            <span class="bank-name">{{bankInfo.bankName}}</span>
            <p class="bank-code">**** **** **** <span>{{bankInfo.bankNo && bankInfo.bankNo.substr(-4, 4)}}</span></p>
          </div>
        </div>
        <div v-else class="bank-add" @click="toInsertBank">
          <span>添加新的银行卡</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions} from 'vuex'
import nwdApi from '@/services/nwdApi';

export default {
  components: {
  },
  data() {
    return {
      checked: true,
    }
  },
  computed: {
    ...mapState({
      userId: state => state.global.userInfo.userId,
      idPerson: state => state.global.userInfo.idPerson,
      name: state => state.global.userInfo.name,
      ucAccountId: state => state.global.userInfo.ucAccountId,
      phone: state => state.global.userInfo.phone,
      // creditStartTime: state => state.credit.creditStartTime,
    }),
    ...mapState('confirm', {
      bankInfo: state => state.bankInfo,
    })
  },
  created() {
    if(this.bankInfo === '' || this.bankInfo === null){
      this.update_BankInfo();
    }
  },
  methods: {
    ...mapActions('confirm', [
      'update_BankInfo',
    ]),
    async toInsertBank() {
      // 跳转绑卡
      let params={
        personId: this.idPerson,
        return_url: window.location.origin+'/custom-page/loan-nwd/#/addCardRunning',
        productType: 'AYQ_NWD', //要求写死
        userId:this.userId,
      };
      let addBankCard = await nwdApi.bank.refreshToBindCardURLHttp(params);
      if(addBankCard.code==='sc0'){
        if(addBankCard.data.bind_url && addBankCard.data.bind_url!=='' && addBankCard.data.bind_url!==null){
          window.location.href = addBankCard.data.bind_url;
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import './../../credit/style/index.scss';
.bank-info{
  .content{
    flex-direction: column;
    .main{
      display: flex;
      height: 100%;
      flex-direction: column;
      .bank-bar{
        display: flex;
        width: 100%;
        background-color: $bg-color-white;
        padding: 0 0.3rem;
        align-items: center;
        @include bg-image('./../../credit/image/icon-right');
        background-size: 0.14rem 0.22rem;
        background-repeat: no-repeat;
        background-position-y: center;
        background-position-x: calc(100% - 0.3rem);
        img{
          width: 0.54rem;
          height: 0.54rem;
          margin-right: 0.3rem;
        }
        .bank-mes{
          display: flex;
          flex-direction: column;
          .bank-name{
            font-size: 0.3rem;
            color: #363636;
            margin-bottom: 0.24rem;
          }
          p{
            font-size: 0.3rem;
            color: $color-gray;
            span{
              font-size: 0.36rem;
              color: $color-main;
              font-weight: 700;
            }
          }
        }
      }
      .bank-default::after{
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
      .bank-add{
        display: flex;
        padding: 0 0.3rem;
        align-items: center;
        background-color: $bg-color-white;
        span{
          font-size: 0.3rem;
          color: $color-main;
          &::before{
            content: '';
            display: inline-block;
            width: 0.54rem;
            height: 0.54rem;
            @include bg-image('./../../credit/image/icon-add');
            background-size: 100%;
            background-repeat: no-repeat;
            vertical-align: middle;
            margin-right: 0.3rem;
          }
        }
      }
    }
    .bank-footer{
      flex-shrink: 0;
      /deep/ .protocol-item{
        height: auto;
      }
      .bank-btn{
        width: calc(100% - 0.6rem);
        height: 0.92rem;
        margin: 0.3rem;
        button{
          @extend %btn;
          @include bg-image('./../../credit/image/bg-btn');
          &:active{
            @include bg-image('./../../credit/image/bg-btn-active');
          }
        }
      }
    }
  }
}
</style>
