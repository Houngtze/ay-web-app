<template>
  <div class="top-notice">
    <img src="./images/icon-laba.png" />
    <p>
      <span>{{text}}</span>
      <slot name="extra"></slot>
    </p>
  </div>
</template>

<script>
  export default {
    name: "top-notice",
    props: {
      text: {
        required: true,
        default: ""
      }
    }
  }
</script>

<style scoped lang="scss">
  .top-notice{
    height: 0.6rem;
    line-height: 0.6rem;
    flex-shrink: 0;
    background: #FFF8ED;
    color: #D1A056;
    font-size: 0.24rem;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: left;
    padding-left: .28rem;
    img{
      width: .44rem;
      display: inline-block;
      margin-right: .1rem;
    }
    p{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
