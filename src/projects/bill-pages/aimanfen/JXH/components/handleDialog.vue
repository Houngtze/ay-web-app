<template>
  <mt-popup
    v-model="popupVisible"
    :class="$style.container"
    :closeOnClickModal="false"
    popup-transition="popup-fade"
  >
    <div class="dialog-mian">
      <div class="text-box">{{handleInfo.resultText}}</div>
      <div class="handle-box">
        <div class="btn-box" v-if="handleInfo.btnNum == 2">
          <div class="close" @click="close">{{handleInfo.closeloseText}}</div>
          <div class="handle" @click="handleFnc">{{handleInfo.handleBtnText}}</div>
        </div>
        <div class="btn-full-box" v-else>
          <div class="handle" @click="handleFnc">{{handleInfo.handleBtnText}}</div>
        </div>
      </div>
    </div>
  </mt-popup>
</template>


<script>
  import env from '@/helpers/env';
  export default {
    props: {
        popupVisible: {
          type: Boolean,
          default: false
        },
        handleInfo:{
          type: Object,
          handleBtnText: '确定',
          closeloseText: '关闭',
          resultText: '',
          btnNum: 2
        },
    },
    data() {
      return {
        isJXHAPP: env.isJXHAPP(),
      };
    },
    beforeUpdate(){
      this.initialize()
    },
    methods: {
      initialize(){
        
      },
      close() {
        this.$emit('closeHandle',false)
      },
      handleFnc() {
        this.$emit('handleFnc')
      }
    }
  };
</script>

<style lang="scss" scoped>
  .dialog-mian{
    width: 6rem;
    height: 3.12rem;
    box-sizing: border-box;
    padding: 0.48rem;
    .text-box{
      font-size: 0.3rem;
      margin-bottom: 0.48rem;
      line-height:0.42rem;
      text-align: center;
      min-height: 0.84rem;
    }
    .handle-box{
      .btn-box{
        display: flex;
        align-items: center;
        div{
          width: 2.4rem;
          height: 0.84rem;
          line-height: 0.84rem;
          font-size: 0.32rem;
          border-radius:0.42rem;
          text-align: center;
        }
        .close{
          background-color: #fff;
          color: #CCCCCC;
          border:1px solid rgba(204,204,204,1);
          margin-right: 0.24rem;
        }
        .handle{
          background:rgba(186,153,80,1);
          color: #FFF;
        }
      }
      .btn-full-box{
        .handle{
          background:rgba(186,153,80,1);
          color: #FFF;
          width: 5.04rem;
          height: 0.84rem;
          line-height: 0.84rem;
          font-size: 0.32rem;
          border-radius:0.42rem;
          text-align: center;
        } 
      }
    }
  }
</style>
<style module lang="scss">
  .container{
    border-radius: 8px;
  }
</style>