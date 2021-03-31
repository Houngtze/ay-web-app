<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="router-view fadeIn animated"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="router-view fadeIn animated"></router-view>
  </div>
</template>

<style lang="scss">
#app {
  font-family: --apple-system,SF UI Text,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica Neue,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  overflow-y: scroll;
}
body{
  height: 100%;
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
  img{
    &[lazy=error] {
      background-image: url("http://static.ali.szqk-tech.com/images/aiyong-shop/aiyong-product-default.png");
      background-size: 100% 100%;
    }
    &[lazy=loading] {
      background-image: url("http://static.ali.szqk-tech.com/images/aiyong-shop/aiyong-product-default.png");
      background-size: 100% 100%;
    }
  }
</style>
