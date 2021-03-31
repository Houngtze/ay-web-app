<template>
  <div class="top-view">
    <div>
      <span v-show="showBack" @click="back"></span>
      {{title || '金融科技'}}
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
  props: ['showBack'],
  computed:{
    ...mapState({
      title: state => state.global.title,
    })
  },
  methods: {
    async back() {
      await this.$nativeBridge.jumpToListenBack();
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.top-view{
  flex-shrink: 0;
  flex-basis: 0.96rem;
  height: 0.96rem;
  background-color: #fff;
  div{
    box-sizing: border-box;
    height: 0.96rem;
    border-bottom: 0.03rem solid #e5e5e5;
    font-size: 0.36rem;
    line-height: 0.96rem;
    color: #363636;
    text-align: center;
    span{
      position: absolute;
      display: inline-block;
      box-sizing: content-box;
      top: 0;
      left: 0;
      height: 0.64rem;
      width: 0.64rem;
      padding: 0.16rem ;
      @include bg-image('./images/icon-back');
      background-size: 0.64rem;
      background-position: 0.16rem;
      background-repeat: no-repeat;
    }
  }
}
</style>
