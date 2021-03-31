<template>
  <div class="main-bar">
    <div class="content">
      <p class="content-title">{{title}}</p>
      <p class="content-money">{{money | formatData}}</p>
      <p class="content-des">
        <span>可提现</span>
        <span>额度高</span>
        <span>放款快</span>
      </p>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: ['title','money'],
  filters: {
    formatData(num) {
      num = num + '';
      if (!num.includes('.')) {
        num += '.'
      }
      return num.replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
        return $1 + ',';
      }).replace(/\.$/, '');
    }
  }
}
</script>

<style lang="scss" scoped>
.main-bar{
  display: flex;
  flex-direction: column;
  height: 100%;
  .content{
    display: flex;
    padding-top: 1.7rem;
    flex-direction: column;
    align-items: center;
    color: #363636;
    .content-title{
      font-size: 0.32rem;
      font-weight: bold;
      margin-bottom: 0.6rem;
    }
    .content-money{
      // position: absolute;
      font-size: 1.2rem;
      font-weight: bolder;
      margin-bottom: 0.8rem;
      font-family: sans-serif;
    }
    .content-des{
      width: 100%;
      padding: 0 1.6rem;
      font-size: 0.26rem;
      color: #a8a8a8;
      margin-bottom: 2.04rem;
      display: flex;
      justify-content: space-around;
      span{
        &::before{
          content: '';
          display: inline-block;
          height: 0.25rem;
          width: 0.25rem;
          margin-right: 0.1rem;
          background-image: url('./images/icon-tick@2x.png');
          background-size: 0.25rem;
          vertical-align: text-top;
        }
      }
    }
  }
}
</style>
