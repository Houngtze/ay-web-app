<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="router-view fadeIn animated"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="router-view fadeIn animated"></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  }
}
</script>
<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: inherit;
  /*height: calc(100% + constant(safe-area-inset-bottom));*/
  font-family: --apple-system,SF UI Text,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica Neue,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body{
  height: 100%;
}
.router-view{
  min-height: inherit !important;
  height: 100% !important;
}
#app .page-layout{
  min-height: auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}
.animated {
  -webkit-animation-duration: .3s;
  animation-duration: .3s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
.padding-tabbar{
  padding-bottom: .98rem;
}
</style>
<style module lang="scss">
  .AYQNavbar {
    color: #fff !important;
    background: #292929 !important
  }
</style>
