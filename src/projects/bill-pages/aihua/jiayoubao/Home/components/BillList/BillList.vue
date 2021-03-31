<template>
  <div class="bill-list">
    <ul>
      <li v-for="(item, index) in billList" :key="index" flex-row-between
          class="bill-item g-mobile-border" @click="handleClick(item.originOrderId)" v-if="item.status !== '2'">
        <div class="item-content">
          <p>[{{item.seq}}/{{item.totalSeq}}期] {{item.goodsName}}</p>
          <span>{{item.tranDate}}</span>
        </div>
        <div class="item-amount">
          <p>{{priceFormat(item.totalReturnedAmt)[0]}}.{{priceFormat(item.totalReturnedAmt)[1]}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
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
      // 价格格式化
      priceFormat(price) {
        const value = price.toString();
        if (value.indexOf('.') !== -1) {
          return value.split('.');
        } else {
          return [value, '00'];
        }
      },
      // 处理点击
      handleClick(originOrderId) {
        this.$emit('onSelected', originOrderId)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/index.scss';

  .bill-list {
    background-color: #fff;
    padding-left: .3rem;
  }

  .bill-item {
    height: 1.4rem;
    padding-right: .3rem;
    align-items: center;
    & .item-content {
      overflow: hidden;
      max-width: 70%;
      padding-right: .3rem;
      justify-self: left;
      flex: 1;
      p {
        font-size: .3rem;
        line-height: 1;
        margin-bottom: .14rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      span {
        font-size: .22rem;
        color: #a8a8a8;
      }
    }
    & .item-amount {
      position: relative;
      font-size: .32rem;
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
      &.arrow::before {
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
