<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  #app {
    display: flex;
    flex-direction: column;
    width: 100%;
    /*height: calc(100% + constant(safe-area-inset-bottom));*/
    font-family: --apple-system,SF UI Text,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica Neue,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }
  body{
    height: 100%;
  }
  .router-view{
    min-height: inherit !important;
    height: 100% !important;
  }
  #app .page-layout{
    min-height: inherit;
    height: 100%;
    & > div{
      min-height: inherit;
    }
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
