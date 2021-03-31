<template>
  <transition name="bounce">
    <div class="kf-model" v-if="isShowDialog">
      <div class="bg">
        <label @click="closeDialog"><img src="./images/close@2x.png"></label>
        <div class="title" v-if="dialogConfig.dialogText.title">
          <h3 v-html="dialogConfig.dialogText.title"></h3>
        </div>
        <div class="txt" v-if="dialogConfig.dialogText.content" v-html="dialogConfig.dialogText.content"></div>
        <p class="enter" @click="toggleDialog">{{dialogConfig.dialogBtnTex}}</p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "customerServiceDialog",
    props: {
      isShowDialog: {
        required: true,
        default: false
      },
      dialogConfig: {
        required: true,
        default: {}
      },
    },
    methods: {
      toggleDialog() {
        if (this.dialogConfig.link) {
          window.location.href = this.dialogConfig.link
        }
        this.closeDialog()
      },
      closeDialog() {
        this.$emit('update:isShowDialog', false)
      }
    }
  }
</script>

<style scoped lang="scss">
  .kf-model{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba($color: #000000, $alpha: .6);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .bg{
      width: 6.42rem;
      height: auto;
      background: #fff;
      overflow: hidden;
      border-radius: 0.26rem;
      text-align: center;
      position: relative;
      & > label{
        position: absolute;
        right: .3rem;
        top: .15rem;
        width: .3rem;
        display: inline-block;
        img{
          width: .3rem;
          display: inline-block;
        }
      }
      /deep/ h3{
        font-size: .34rem;
        color: #363636;
        font-weight: 600;
        line-height: .42rem;
        margin: .4rem 0 .56rem 0;
        text-align: center;
      }
      .txt{
        padding: 0 .6rem .4rem .6rem;
        /deep/ p{
          color: #363636;
          font-weight: 400;
          font-size: 0.28rem;
          line-height: 0.42rem;
          text-align: left;
        }
      }
      .enter{
        line-height: 0.9rem;
        background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
        font-size: 0.3rem;
        color: #fff;
        margin: 0;
      }
    }
  }
  .bounce-enter-active,.bounce-leave-active{
    transition: opacity .5s;
  }
  .bounce-enter,.bounce-to{
    opacity: 0;
  }
  .bounce-enter-active{
    animation: bounce-in .5s;
  }
  .bounce-leave-active{
    animation: bounce-out .5s;
  }
  @keyframes bounce-in {
    10%{
      transform: scale(0);
    }
    50%{
      transform: scale(1.3);
    }
    100%{
      transform: scale(1);
    }
  }
  @keyframes bounce-out {
    10%{
      transform: scale(1);
    }
    50%{
      transform: scale(1.3);
    }
    100%{
      transform: scale(0);
    }
  }
</style>
