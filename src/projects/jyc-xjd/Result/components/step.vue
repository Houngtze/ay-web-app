<template>
  <div class="step-page">
    <div class="div-status">
      <div :class="`d-a d-st ${getStep(1)}`">
        <div class="d-icon">
          <div class="inner"></div>
        </div>
      </div>
      <div :class="`d-b d-st ${getStep(2)}`">
        <div class="d-icon">
          <div class="inner"></div>
        </div>
      </div>
      <div :class="`d-c d-st ${getStep(3)}`">
        <div class="d-icon">
          <div class="inner"></div>
        </div>
      </div>
    </div>
    <div class="div-txt">
      <p>审核通过</p>
      <p>开通会员</p>
      <p>提现操作</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    step:{
      type:Object,
    }
  },
  data(){
    return {
    }
  },
  created(){
  },
  methods:{
    getStep(oStep){
      if(oStep<this.step.step){
        return 'success-st';
      }
      else{
        if(oStep === this.step.step){
          if(this.step.status){
            return 'success-st';
          }
          else{
            return 'error-st';
          }
        }
        else{
          return ;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step-page{
  background: #fff;
  height: 1.64rem;
  flex-shrink: 0;
  border-bottom: 0.16rem solid #f2f2f2;
  .div-status{
    display: flex;
    justify-content: center;
    .d-st{
      border-bottom: 0.04rem solid #E5E5E5;
      height: 0.5rem;
      width: 1.64rem;
      flex-shrink: 0;
      display: flex;
      .d-icon{
        width: 0.46rem;
        height: 0.46rem;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 50%;
        padding: 0.05rem;
        margin-top: 0.24rem;
        .inner{
          width: 100%;
          height: 100%;
          background: #e5e5e5;
          border-radius: 50%;
        }
      }
    }
    .d-b{
      justify-content: center;
      width: 2.8rem;
    }
    .d-c{
      justify-content: flex-end;
    }
    .success-st{
      border-color: #D09E54;
      .d-icon{
        background: #f2e3cc;
        .inner{
          background: #D09E54;
        }
      }
    }
    .error-st{
      border-color: #D09E54;
      .d-icon{
        background: #ffcac0;
        .inner{
          background: #FF4B27;
        }
      }
    }
  }
  .div-txt{
    padding:0 0.45rem;
    display: flex;
    justify-content: space-between;
    padding-top: 0.4rem;
    p{
      color: #363636;
    }
  }
}
</style>
