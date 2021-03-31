<template>
  <div class="bottom-view">
    <ul>
      <li v-for="(item, index) in btnList" :key="index" :class="{active: index === showIndex, hasbtn: index < btnList.length}" @click="linkPath(item.path)">{{item.name}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['showIndex'],
  data() {
    return {
      btnList: [
        {name: '借钱', path: '/'},
        {name: '还款', path: '/repay'}
      ],
      showBottom: false
    }
  },
  methods: {
    linkPath(path) {
      this.$router.replace(path)
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom-view{
  flex-basis: 0.8rem;
  height: 0.8rem;
  width: 100%;
  border-top: 0.03rem solid #DEDEDE;
  background-color: #ffffff;
  ul{
    display: flex;
    height: 100%;
    width: 100%;
    li{
      flex: 1;
      height: 100%;
      line-height: 0.8rem;
      text-align: center;
      font-size: 0.34rem;
      color: #cccccc;
      &.active{
        color: #D4A55C;
      }
      &.hasbtn{
        border-right: 0.03rem solid #DEDEDE;
      }
    }
  }
}
</style>
