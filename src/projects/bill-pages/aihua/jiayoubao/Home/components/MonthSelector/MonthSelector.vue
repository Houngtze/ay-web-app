<template>
  <div class="month-selector">
    <div class="selector-wrap">
      <button @click="handleSelect('previous')">
        <img src="../../../../images/previous@2x.png" srcset="../../../../images/previous@2x.png 2x, ../../../../images/previous@3x.png 3x">
        {{formatMonth(PreviousMonth, 'm')}}
      </button>
      <h3>{{formatMonth(CurrentMonth, 'y-m')}}</h3>
      <button @click="handleSelect('next')">
        {{formatMonth(NextMonth, 'm')}}
        <img src="../../../../images/next@2x.png" srcset="../../../../images/next@2x.png 2x, ../../../../images/next@3x.png 3x">
      </button>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  export default {
    name: "MonthSelector",
    props: ['systemTime'],
    data() {
      return {
        CurrentMonth: null,
        PreviousMonth: null,
        NextMonth: null
      }
    },
    watch: {
      // 挂载的时候监听systemTime，实时赋值
      systemTime(newVal) {
        if (newVal) {
          this.CurrentMonth = newVal
          this.$emit('onActiveSetMonth', this.formatMonth(newVal))
        }
      },
      // 监听当前月份变化，更改前后月份的值
      CurrentMonth(newVal) {
        if (newVal) {
          this.PreviousMonth = moment(Number(newVal)).subtract(1, 'months').format('x')
          this.NextMonth = moment(Number(newVal)).add(1, 'months').format('x')
        }
      }
    },
    methods: {
      // 处理选择
      handleSelect(type) {
        if (type)  this.monthCalculate(type)
        this.$emit('onActiveSetMonth', this.formatMonth(this.CurrentMonth))
      },
      // 月份计算
      monthCalculate(type) {
        // 前一个月
        if (type === 'previous') {
          this.CurrentMonth = moment(Number(this.CurrentMonth)).subtract(1, 'months').format('x')
        } else if (type === 'next') {
          // 后一个月
          this.CurrentMonth = moment(Number(this.CurrentMonth)).add(1, 'months').format('x')
        } else {
          this.$toast('操作出错')
        }
      },
      // 格式化日期显示
      formatMonth(date, type){
        if (!date) return
        if (type === 'm') {
          // 返回两边的月份
          return new Date(Number(date)).getMonth() + 1 + '月'
        } else if (type === 'y-m') {
          // 返回中间的年份月份
          return new Date(Number(date)).getFullYear() + '年' + (new Date(Number(date)).getMonth() + 1) + '月'
        } else {
          // 默认返回接口需要的参数类型：201811格式
          return new Date(Number(date)).getFullYear() + (new Date(Number(date)).getMonth() + 1 < 10 ?
            '0' + (new Date(Number(date)).getMonth() + 1) : (new Date(Number(date)).getMonth() + 1) + '')
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .month-selector{
    background-color: #f2f2f2;
    width: 100%;
    .selector-wrap{
      width: 100%;
      padding: 0 .3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      & button{
        font-size: .26rem;
        -webkit-appearance: none;
        background-color: transparent;
        border: none;
        width: 1.5rem;
        padding: .25rem 0;
        justify-self: left;
        text-align: left;
        & img{
          width: .16rem;
          height: .16rem;
          display: inline-block;
          margin-right: .15rem;
        }
        &:last-child{
          text-align: right;
          & img{
            margin-left: .15rem;
            margin-right: 0;
          }
        }
      }
      & h3{
        flex: 1;
        text-align: center;
        width: 60%;
      }
    }
  }
</style>
