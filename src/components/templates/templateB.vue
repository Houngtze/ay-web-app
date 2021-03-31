<template>
  <div class="temp-view">
    <div class="content-view">
      <span class="icon" :class="{isErr: data.isErr}" v-if="!data.paying"></span>
      <span class="icon paying" v-else></span>
      <span class="mes">{{data.titleMes}}</span>
      <span class="dec" v-if="data.dec">{{data.dec}}</span>
    </div>
    <button class="btn" @click="tapBtn">{{data.btnMes}}</button>
  </div>
</template>
<script>
export default {
  props: ['data'],
  methods: {
    tapBtn() {
      this.$emit('tapBtn')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/index.scss';
.temp-view{
  color: #363636;
  text-align: center;
  .content-view{
    display: flex;
    width: 100%;
    padding: 0.6rem 0;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    .icon{
      height: 1.05rem;
      width: 1.05rem;
      margin-bottom: 0.3rem;
      background-size: 100%;
      background-repeat: no-repeat;
      @include bg-image('./images/icon-suc');
      &.isErr{
        @include bg-image('./images/icon-err');
      }
      &.paying{
        background-image: url("./images/examining.png");
      }
    }
    .mes{
      font-size: 0.34rem;
    }
    .dec{
      font-size: 0.28rem;
      line-height: 0.56rem;
      color: #a8a8a8;
    }
  }
  .btn{
    width: 6.9rem;
    height: 0.92rem;
    display: inline-block;
    margin-bottom: 0.92rem;
    margin-top: 0.92rem;
    border: none;
    color: #ffffff;
    font-size: 0.36rem;
    border-radius: 0.1rem;
    background: linear-gradient(to right, #e0bb75, #d19f55);
    &:active{
      background: linear-gradient(to right, #bf9f64, #b18647);
    }
  }
}
</style>
