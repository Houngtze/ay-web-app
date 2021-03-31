<template>
  <div class="bill-list">
    <ul>
      <li v-for="(item, index) in billList" :key="index" flex-row-between
          class="bill-item g-mobile-border">
        <div class="selected-btn" @click="handleSelect(item)">
          <img v-if="item === selectedItem" src="../../../images/checked@2x.png"
               srcset="../../../images/checked@2x.png 2x, ../../../images/checked@3x.png 3x">
          <img v-else src="../../../images/checkbox@2x.png" srcset="../../../images/checkbox@2x.png 2x, ../../../images/checkbox@3x.png 3x">
        </div>
        <div class="item-content" @click="toBillDetail(item.originOrderId)">
          <p>[{{item.seq}}/{{item.totalSeq}}期] {{item.goodsName}}</p>
          <h3>
            <span>应还金额：￥{{item.repayMoney}}</span>
            <label v-if="item.status === '1'">已逾期</label>
          </h3>
        </div>
        <div class="item-date" @click="toBillDetail(item.originOrderId)">
          <p>还款日</p>
          <p>{{item.payDate}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import env from '@/helpers/env';
  export default {
    name: "BillList",
    props: {
      billList: {
        required: true,
        type: Array
      },
    },
    data() {
      return {
        selectedItem: null
      }
    },
    methods: {
      handleSelect(data) {
        this.selectedItem = data === this.selectedItem ? null : data
        this.$emit('onSelected', this.selectedItem)
      },
      // 去详情
      toBillDetail(originOrderId) {
        if (env.isApp()) {
          this.$nativeBridge.jumpToBillDetail({
            originOrderId: originOrderId
          })
        } else {
          return this.$toast("请在爱用商城app中打开")
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/index.scss';

  .bill-list {
    background-color: #fff;
    padding-left: .3rem;
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
  }

  .bill-item {
    height: 1.4rem;
    padding-right: .3rem;
    align-items: center;
    & .selected-btn {
      margin-right: .2rem;
      & img {
        width: .38rem;
        display: inline-block;
      }
    }
    & .item-content {
      overflow: hidden;
      max-width: 70%;
      padding-right: .3rem;
      justify-self: left;
      flex: 1;
      p {
        font-size: .24rem;
        line-height: 1;
        margin-bottom: .14rem;
        color: #a8a8a8;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      h3 {
        font-size: .3rem;
        color: #363636;
        display: flex;
        align-items: center;
        justify-content: left;
        & label {
          display: inline-block;
          margin-left: .1rem;
          @include bg-image('../../../images/label-later');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          min-width: .9rem;
          padding: 2px 3px;
          white-space: nowrap;
          text-align: center;
          color: #fff;
          font-size: .22rem;
        }
      }
    }
    & .item-date {
      position: relative;
      padding-right: .3rem;
      color: #a8a8a8;
      font-size: .24rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: right;
      & p {
        margin-top: .18rem;
        line-height: 1;
        width: 100%;
        text-align: right;
        white-space: nowrap;
        &:first-child {
          margin-top: 0;
        }
      }
      &::before {
        content: "";
        display: inline-block;
        height: 0.2rem;
        width: 0.2rem;
        border-width: 0.02rem 0.02rem 0 0;
        border-color: #C8C8C8;
        border-style: solid;
        transform: translate(0, -50%) rotate(45deg);
        position: absolute;
        top: 50%;
        right: 0;
      }
    }
  }
</style>
