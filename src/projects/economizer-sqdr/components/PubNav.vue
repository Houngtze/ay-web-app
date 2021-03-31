<template>
  <div class="pub-nav">
    <router-link :to="{ path: '/home'}" class="nav-li" active-class="nav-li-hover" replace>首页</router-link>
    <router-link :to="{ path: '/new-record'}" class="nav-li" active-class="nav-li-hover" replace>最新揭晓</router-link>
    <router-link :to="{ path: '/order'}" class="nav-li" active-class="nav-li-hover" replace>我参与的</router-link>
  </div>
</template>

<style lang="scss" scoped>
@import "src/style/index.scss";
.pub-nav{
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  min-height:0.92rem;
  background:#fff;
  flex-shrink: 0;
  border-top: 0.0045rem solid #e5e5e5;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .nav-li{
    width: 100%;
    text-align: center;
    color:#a8a8a8;
    line-height: 0.94rem;
    font-size: 0.3rem;
  }
  .nav-li-hover{
    color:#FF2929;
  }
}
</style>
<style lang="scss">
</style>

