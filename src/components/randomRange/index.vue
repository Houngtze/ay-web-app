<template>
  <div class="range">
    <mt-range
      v-model="range.value"
      :min="range.min"
      :max="range.max"
      :step="range.step"
      :bar-height="5"
    >
    </mt-range>
  </div>
</template>

<script>
  export default {
    name: "moneyRange",
    props: {
      range: {
        required: true,
        type: Object
      }
    },
    computed: {
      rangeValue() {
        return this.range.value
      }
    },
    watch: {
      rangeValue() {
        this.$emit('handleRange', this.range)
      }
    }
  }
</script>

<style scoped lang="scss">
  .range {
    /deep/ .mt-range{
      line-height: .4rem;
      height: .4rem;
      .mt-range-progress {
        background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
        border-radius: 0.04rem;
      }
      & .mt-range-thumb{
        width: .4rem;
        height: .4rem;
        background:rgba(255,255,255,1);
        border-radius: 50%;
        box-shadow:0px 2px 12px 0px rgba(0,0,0,0.12);
      }
      & .mt-range-content {
        margin-right: .4rem;
      }
      & .mt-range-runway{
        right: -0.4rem
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
</style>
