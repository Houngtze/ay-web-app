<template>
  <div class="templete-bar">
    <div class="content">
      <slot name="image"></slot>
      <h2>{{message}}</h2>
      <slot name="dec"></slot>
      <slot name="bottom"></slot>
    </div>
    <div class="page-contentn banner">
      <img v-lazy lazy="error">
    </div>
  </div>
</template>
<script>
export default {
  props: ['message'],
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.templete-bar{
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: center;
  background-size: 100%;
  .content{
    display: flex;
    width: 100%;
    padding: 0.48rem 0.3rem;
    background-color: #fff;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0.18rem;
    img{
      width: 1.5rem;
      height: 1.5rem;
      display: inline-block;
      margin-bottom: .2rem;
    }
    .message{
      font-size: 0.48rem;
      color: #363636;
    }
    & h2 {
      color: #363636;
      font-size: .48rem;
      margin-bottom: .2rem;
      line-height: 1;
    }
  }
  .banner img {
    width: 100%;
    height: 3rem;
    &[lazy=loading] {
      margin: auto;
      background: url("../image/banner-default.png") no-repeat;
      background-size: 100% 100%;
    }
    &[lazy=error] {
      margin: auto;
      background: url("../image/banner-default.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
