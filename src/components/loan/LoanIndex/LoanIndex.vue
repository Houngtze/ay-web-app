<template>
  <div class="page-layout">
    <div class="page-content">
      <div class="index-range-block">
        <div class="range-content">
          <p>借多少(元)</p>
          <h1>{{range.value}}</h1>
          <mt-range
            v-model="range.value"
            :min="range.min"
            :max="range.max"
            :step="range.step"
            :bar-height="5">
          </mt-range>
          <div class="range-data" flex-row-between>
            <span style="flex: 1">{{range.min}}</span>
            <span style="flex: 1;text-align: right">{{range.max}}</span>
          </div>
        </div>
      </div>
      <div class="index-limit-block">
        <p>借多久</p>
        <div class="btn-content" flex-row-between v-if="limit">
          <mt-button v-for="(item, index) in limit" @click="setLimit(item)" :key="index"
                     :class="selectedLimit &&  selectedLimit.value === item.value ? 'active' : ''">{{item.text}}个月
          </mt-button>
        </div>
      </div>
      <div class="index-tips" flex-row-center>
        <slot name="index-tips"></slot>
      </div>
      <div class="index-btn">
        <button @click="toNext" v-if="isActiveBtn">去借钱</button>
        <button class="none" v-if="!isActiveBtn">去借钱</button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import env from '@/helpers/env'
  import {redirectToLoginPage} from '@/helpers/utils'

  export default {
    components: {},
    data() {
      return {
        selectedLimit: null,
      }
    },
    props: {
      range: {
        required: true,
        type: Object
      },
      limit: {
        required: true,
        type: Array
      },
      isActiveBtn: {
        required: true,
        type: Boolean
      }
    },
    ...mapState({
      userId: state => state.global.userInfo.userId,
      idPerson: state => state.global.userInfo.idPerson
    }),
    methods: {
      // 借多久选择处理
      setLimit(data) {
        this.selectedLimit = data
      },
      toNext() {
        if (!this.selectedLimit) {
          this.$toast('请选择借款期限')
          return;
        }
        this.$emit('onActiveToNextBtn', {
          limitValue: this.selectedLimit,
          rangeValue: this.range.value
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../style/common.scss';
  .page-layout{
    background-color: #fff;
  }
  .page-content {
    .index-range-block {
      padding: .3rem .3rem .6rem .3rem;
      .range-content {
        border-radius: .2rem;
        box-shadow: 0 .1rem .3rem 0px rgba(4, 0, 0, 0.1);
        padding: .5rem .4rem .4rem .4rem;
        /deep/ .mt-range{
          line-height: .5rem;
          height: .5rem;
          .mt-range-progress {
            background:linear-gradient(270deg,rgba(208,158,84,0.99),rgba(225,188,120,0.99));
          }
          & .mt-range-thumb{
            width: .5rem;
            height: .5rem;
            @include bg-image('./images/range-icon');
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
          & .mt-range-content {
            margin-right: .5rem;
          }
          & .mt-range-runway{
            right: -0.5rem
          }
        }
        & > p{
          font-size: .3rem;
          line-height: 1;
          color: #363636;
          text-align: center;
        }
        & > h1{
          margin: .35rem 0;
          line-height: 1;
          font-weight: 600;
          font-size: .8rem;
          text-align: center;
        }
        & .range-data{
          padding-top: .1rem;
          & span{
            color: #868686;
            font-size: .24rem;
          }
        }
      }
    }
    .index-limit-block {
      text-align: center;
      padding: 0 .3rem 2.8rem .3rem;
      & p{
        font-size: .34rem;
        text-align: left;
        margin-bottom: .3rem;
      }
      button {
        -webkit-appearance: none;
        border: none;
        width: 2rem;
        height: .88rem;
        font-size: 0.28rem;
        line-height: .88rem;
        background-color: #fff;
        border: 1px solid #DFB873;
        border-radius: .12rem;
        color: #363636;
        &.active {
          color: #fff;
          background:linear-gradient(270deg,rgba(208,158,84,0.99),rgba(225,188,120,0.99));
        }
      }
    }
    .index-btn {
      text-align: center;
      width: 100%;
      button {
        height: .92rem;
        -webkit-appearance: none;
        border: none;
        background-color: transparent;
        background-image: url("./images/button.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 90%;
        color: #fff;
        font-size: .36rem;
        &.none{
          background-color: #a8a8a8;
          color: #fff;
          background-image: none;
          border-radius: .1rem;
        }
      }
    }
  }
</style>
