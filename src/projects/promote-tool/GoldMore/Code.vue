<template>
  <div class="page-code">
    <img src="./images/code@2x.png">
    <p class="tt">在此扫码付款</p>
    <p class="warm">长按二维码使用微信支付</p>
  </div>
</template>
<script>
import env from "@/helpers/env";
export default {
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.page-code{
  color: #363636;
  background: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img{
    width: 4.41rem;
    height: auto;
  }
  .tt{
    font-size: 0.48rem;
    margin-top: 0.3rem;
    font-weight: 500;
  }
  .warm{
    color: #a8a8a8;
    font-size: 0.36rem;
  }
}
</style>

