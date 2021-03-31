<template>
  <div class="bank-info">
    <progress-bar :index=3></progress-bar>
    <div class="content">
      <div class="main">
        <div class="bank-bar" @click="cutBank">
          <img :src="bankInfo.bankIconUrl">
          <div class="bank-mes">
            <span :class="'bank-name ' + (bankInfo.isDefault === 1 ? 'bank-default' : '')">{{bankInfo.bankName}}</span>
            <p class="bank-code">**** **** **** <span>{{bankInfo.bankNo && bankInfo.bankNo.substr(-4, 4)}}</span></p>
          </div>
        </div>
        <div class="bank-add" @click="toInsertBank">
          <span>添加新的银行卡</span>
        </div>
      </div>

      <div class="bank-footer">
        <protocol-item
          :linkArr="linkArr"
          @handleStatus="handleStatus">
        </protocol-item>
        <div class="bank-btn">
          <button :disabled="!checked" @click="submit">提交</button>
        </div>
      </div>
      <picker-pop
        :slotArr="bankList"
        @handleValue="handleValue"
        ref="pickerPop">
      </picker-pop>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions} from 'vuex'
import ProgressBar from '../components/Progress'
import ProtocolItem from '../components/ProtocolItem'
import PickerPop from "../components/PickerPop";
import {formatDateTime} from '@/helpers/utils'

export default {
  components: {
    ProgressBar,
    ProtocolItem,
    PickerPop
  },
  data() {
    return {
      checked: true,
      linkArr: [{
        title: '《银行代扣协议》',
        url: 'http://aiyong.dafysz.cn/terms/account-authoritzation.html'
      }],
      bankList: [],
      bankInfoList: [],
      bankInfo: {},
    }
  },
  watch: {
    bankInfoList(val) {
      const arr = val.map((item, index) => {
        const str = `${item.bankName} (${item.bankNo.substr(0, 4)} ******** ${item.bankNo.substr(-4, 4)})`
        return {
          index,
          val: str
        }
      })
      this.bankList = arr;
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
    })
  },
  created() {
    this.getBankInfo();
  },
  methods: {
    async getBankInfo() {
      const param = {
        product: 'AMFT',
        idPerson: this.idPerson,
        userId: this.userId,
        channel: 'H5',
        ucAccountId: this.ucAccountId
      }
      const res = await this.$api.credit.getBankInfo(param)
      if (res.code === 'sc0') {
        this.bankInfoList = res.data.bankInfoList;
        this.setBankInfo()
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },
    setBankInfo() {
      for(let i = 0; i<this.bankInfoList.length; i++) {
        if(this.bankInfoList[i].isDefault === 1) {
          this.bankInfo = this.bankInfoList[i]
          break;
        }
      }
      if (!this.bankInfo.bankName) {
        this.bankInfo = this.bankInfoList[0]
      }
    },
    handleValue(val, index) {
      this.bankInfo = this.bankInfoList[index]
    },
    handleStatus(val) {
      this.checked = val
    },
    toInsertBank() {
      this.$router.push({path: '/insertBank'})
    },
    async submit() {
      if (!this.bankInfo.bankNo) {
        this.$toast({
          message: '请先添加银行卡',
          position: 'bottom'
        })
        return
      }
      const param = {
        bankCode: this.bankInfo.bankCode,
        bankNo: this.bankInfo.bankNo,
        bankName: this.bankInfo.bankName,
        bankPhone: this.bankInfo.bankPhone,
        bankType: this.bankInfo.bankType,
        creditEndTime: formatDateTime('yyyy-mm-dd hh:mm:ss'),
        phone: this.phone,
        channel: 'H5',
        idPerson: this.idPerson,
        type: 2,
        userId: this.userId,
      };
      const res = await this.$api.credit.identityAuthentication(param);
      if (res.code === 'sc0') {
        // 退回上一页
        if (res.data && res.data.activeStatus === '0') {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
          this.$router.replace({path: '/liveAc'})
        } else {
          this.$router.replace({path: '/creditResult'});
        }
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },
    cutBank() {
      this.$refs.pickerPop.open();
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
.bank-info{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .content{
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    .main{
      display: flex;
      height: 100%;
      flex-direction: column;
      .bank-bar{
        display: flex;
        width: 100%;
        height: 1.8rem;
        background-color: $bg-color-white;
        margin-top: 0.18rem;
        padding: 0 0.3rem;
        align-items: center;
        @include bg-image('../image/icon-right');
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
        height: 1.1rem;
        padding: 0 0.3rem;
        margin-top: 0.18rem;
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
            @include bg-image('../image/icon-add');
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
          @include bg-image('../image/bg-btn');
          &:active{
            @include bg-image('../image/bg-btn-active');
          }
        }
      }
    }
  }
}
</style>
