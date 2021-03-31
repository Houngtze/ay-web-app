<template>
  <div class="main-panel">
    <template v-if="data && data.length">
      <div v-for="(item, index) in data" :key="index" class="item">
        <div class="point"></div>
        <p>
          {{item.title}}<span>{{item.label}}</span>
        </p>
        <button @click="change(index)">修改</button>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: "MainPanel",
    props: ["data"],
    methods: {
      change(data) {
        this.$emit("onActiveChange", data)
      }
    }
  }
</script>

<style scoped lang="scss">
  .main-panel{
    width: 100%;
    min-height: 7.08rem;
    background: #FFFFFF;
    border-radius: .16rem;
    margin-bottom: .3rem;
    padding: .38rem .32rem;
    .item{
      display: flex;
      align-items: center;
      justify-content: left;
      margin-bottom: .32rem;
      .point{
        width: .16rem;
        height: .16rem;
        background: #FF0028;
        border-radius: 50%;
        display: inline-block;
        margin-right: .16rem;
      }
      p{
        font-size: .28rem;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #363636;
        line-height: .4rem;
        flex: 1;
      }
      button{
        -webkit-appearance: none;
        line-height: .42rem;
        border-radius: .36rem;
        border: .02rem solid #D99C45;
        font-size: .26rem;
        font-weight: 500;
        color: #D99C45;
        padding: 0 .24rem;
        background-color: #fff;
      }
    }
  }
</style>
`
