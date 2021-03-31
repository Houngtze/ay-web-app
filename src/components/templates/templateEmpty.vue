<template>
  <div class="empty-view">
    <div class="content">
      <span class="icon"></span> 
      <span class="title">没有相应记录</span>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
@import '@/style/index.scss';
.empty-view{
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  .content{
    display: flex;
    flex-direction: column;
    .icon{
      width: 2rem;
      height: 1.4rem;
      margin-bottom: 0.3rem;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      @include bg-image('./images/icon-empty');
    }
    .title{
      text-align: center;
      font-size: 0.3rem;
      color: #868686;
    }
  }
}
</style>
