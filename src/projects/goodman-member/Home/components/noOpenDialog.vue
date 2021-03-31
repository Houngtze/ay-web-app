<template>
  <div class="dialog">
    <mt-popup v-model="isShowDialog" :closeOnClickModal="false">
      <div class="dialog-content">
        <p>该功能即将上线,请耐心等待哦~</p>
        <h3 @click="closeDialog">我知道了</h3>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  export default {
    name: "DefaultDialog",
    components: {
    },
    props: {
      isShowDialog: {
        required: true,
        type: Boolean,
      },
    },
    methods: {
      closeDialog (){
        this.$emit('onActiveCloseDialog', false)
      },
    }
  }
</script>

<style scoped lang="scss">
.dialog{
  /deep/ .mint-popup{
    background-color: transparent;
  }
}
.dialog-content{
  background-image: url("../../images/home-no-open-dialog.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 5.2rem;
  height: 3.8rem;
  position: relative;
  & p{
    padding-top: 2.24rem;
    font-size: .26rem;
    font-weight:400;
    color:rgba(54,54,54,1);
    line-height: .36rem;
    text-align: center;
  }
  & h3{
    position: absolute;
    bottom: .2rem;
    left: 0;
    text-align: center;
    width: 100%;
    font-size: .34rem;
    font-weight:400;
    color:rgba(54,54,54,1);
    line-height: .48rem;
    padding-top: .2rem;
    border-top: 1px solid rgba(238,238,238,1);
  }
}
</style>
