<template>
  <div class="top-view">
    <div :class="navBarClass">
      <span @click="back" v-if="isShowBackIcon"></span>
      {{title}}
    </div>
    <!-- <p></p> -->
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import env from '@/helpers/env'
  export default {
    props: ['navBarClass'],
    computed:{
      ...mapState({
        title: state => state.global.title,
      }),
      isShowBackIcon() {
        return this.$route.name !== 'ayq-app-home' && this.$route.name !== 'ayq-app-my'
      }
    },
    methods: {
      back() {
        if (env.isApp()) {
          this.$nativeBridge.jumpToListenBack()
        } else {
          this.$router.go(-1);
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '@/style/index.scss';
  .top-view{
    height: calc(0.96rem + constant(safe-area-inset-bottom));
    /*height: 0.96rem;*/
    flex-shrink: 0;
    text-align: center;
    div{
      box-sizing: border-box;
      height: 0.96rem;
      font-size: 0.36rem;
      line-height: 0.96rem;
      color: #363636;
      background: #fff;
      span{
        position: absolute;
        display: inline-block;
        box-sizing: content-box;
        top: 0;
        left: 0;
        height: 0.64rem;
        width: 0.64rem;
        padding: 0.16rem ;
        @include bg-image('../images/icon-back');
        background-size: 0.64rem;
        background-position: 0.16rem;
        background-repeat: no-repeat;
      }
    }
  }
</style>
