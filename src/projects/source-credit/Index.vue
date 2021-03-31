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
      showBack: true,
      showBottom: false,
      showIndex: 0
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/') {
        this.showBack = false;
        this.showBottom = true;
        this.showIndex = 0;
      } else if(to.path ==='/repay') {
        this.showBack = false;
        this.showBottom = true;
        this.showIndex = 1;
      } else {
        this.showBack = true;
        this.showBottom = false;
      }
    }
  },
}
</script>
<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: --apple-system,SF UI Text,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica Neue,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.router-view{
  flex: 1;
  height: 100%;
  overflow-y: auto;
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
</style>
