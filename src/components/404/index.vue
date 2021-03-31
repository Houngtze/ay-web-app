<template>
  <div class="page-layout">
    <img src="./images/no-products@2x.png">
    <p>[404]页面出错了。。</p>
  </div>
</template>

<script>
  export default {
    name: "index"
  }
</script>

<style scoped lang="scss">
.page-layout{
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 1rem;
  p{
    color: #a8a8a8;
    margin-top: .18rem;
    font-size: .3rem;
  }
  img{
    display: inline-block;
    width: 2rem;
  }
}
</style>
