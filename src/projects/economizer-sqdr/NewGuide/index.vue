<template>
  <div class="page-layout">
    <img v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/economizer-sqdr/NewGuide-bg-1.png'">
    <img v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/economizer-sqdr/NewGuide-bg-2.png'">
    <img v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/economizer-sqdr/NewGuide-bg-3.png'">
  </div>
</template>

<script>
  export default {
    name: "index"
  }
</script>

<style scoped lang="scss">
.page-layout{
  width: 100%;
  height: 100%;
  & img{
    width: 100%;
    display: block;
  }
}
</style>
