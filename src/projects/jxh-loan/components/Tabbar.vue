<template>
    <div flex-row-center class="tab">
        <router-link flex-center-center to="/ayq-app-home" replace active-class="active">
          <div class="icon icon-home"></div>
          <span class="title">借钱</span>
        </router-link>
        <router-link flex-center-center to="/ayq-app-my" replace active-class="active">
          <div class="icon icon-my"></div>
          <span class="title">我的</span>
        </router-link>
    </div>
</template>

<style scoped lang="scss">
  .tab{
    height: .98rem;
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 0.01rem solid #d8d8d8;
    margin: 0 auto;
    background-color: #fff;
  }
  .tab a{
    flex: 1
  }
  .icon{
    width: .44rem;
    height: .44rem;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .title{
    color: #868686;
    font-size: .2rem;
    padding-top: 2px;
  }
  .active .title{
    color: #363636
  }
  .icon-home{
    background-image: url("../images/icon-home@2x.png");
  }
  .icon-my{
    background-image: url("../images/icon-my@2x.png");
  }
  .active {
    & .icon-home {
      background-image: url("../images/icon-home-active@2x.png");
    }
    & .icon-my{
      background-image: url("../images/icon-my-active@2x.png");
    }
  }
</style>
