<template>
  <div id="app">
    <router-view class="router-view fadeIn animated" />
    <pub-nav v-if="isShowTab" />
  </div>
</template>

<script>
  import PubNav from "./components/PubNav";
  export default {
    components: {
      PubNav
    },
    data() {
      return {
        isShowTab: false
      }
    },
    watch: {
      $route(to) {
        if (to.path === '/home' || to.path ===  '/new-record' || to.path ===  '/order') {
          this.isShowTab = true;
        } else {
          this.isShowTab = false;
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
    min-height: inherit;
    height: 100% ;
    overflow: hidden;
    font-family: --apple-system,SF UI Text,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica Neue,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
    -webkit-animation-duration: .5s;
    animation-duration: .5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  .padding-tabbar{
    padding-bottom: .98rem;
  }
</style>
