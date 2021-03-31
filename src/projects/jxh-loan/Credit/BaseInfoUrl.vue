<template>
  <div class="base-page">
    <div class="header">
      <div class="block-content">
        <p class="title">我想借(元)</p>
        <h1>{{formatUsefulMoney}}</h1>
        <p class="tips">3秒放款，10分钟到账</p>
        <div class="range-block">
          <span>{{rangeValue.min}}</span>
          <random-range :range="rangeConfig" @handleRange="getRangeData" class="range"></random-range>
          <span>{{rangeValue.max}}</span>
        </div>
      </div>
    </div>
    <div class="container">
      <base-info :words="pageWords"></base-info>
    </div>
  </div>
</template>

<script>
  import BaseInfo from './components/BaseInfo'
  import randomRange from '@/components/randomRange'
  export default {
    name: "BaseInfoUrl",
    components: {
      BaseInfo,randomRange
    },
    data() {
      return {
        pageWords:{
          underTxt:'请填写真实的个人信息，否则将放款失败',
          bntTxt:'立即申请',
        },
        rangeConfig: {
          max: 50000,
          min: 1000,
          step: 500,
          value: 30000
        },
        rangeValue: null,
      }
    },
    computed:{
      formatUsefulMoney() {
        return this.rangeValue.value.toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
      }
    },
    created(){
      this.rangeValue = this.rangeConfig
    },
    methods: {
      getRangeData(data) {
        this.rangeValue = data
      },
    }
  }
</script>

<style lang="scss" scoped>
.header{
  background: #fff;
  margin-bottom: 0.2rem;
  height: 3.8rem;
  flex-shrink: 0;
  overflow: hidden;
  .block-content{
    background: #fff;
    & p{
      text-align: center;
      color: #363636;
      &.title{
        font-size: .28rem;
        line-height: .30rem;
        margin: .3rem 0;
      }
      &.tips{
        font-size: .24rem;
        font-weight:400;
        color: #a8a8a8;
        line-height: .24rem;
      }
    }
    & h1{
      font-size: 0.8rem;
      font-weight:500;
      color: #363636;
      line-height: 1rem;
      text-align: center;
      margin: 0.2rem 0;
    }
    & .range-block{
      margin-top: .4rem;
      padding: 0 0.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      & span{
        font-size: .2rem;
        color: #a8a8a8;
      }
      & .range{
        flex: 1;
        margin: .2rem;
      }
    }
  }
}
</style>
