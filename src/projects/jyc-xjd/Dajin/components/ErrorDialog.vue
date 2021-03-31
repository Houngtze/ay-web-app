<template>
  <Dialog
    v-if="isVisible"
    title="提示"
    :buttons="buttons"
    buttonClass="g-scoped-event-button"
    :extraStyle="extraStyle"
  >
    <div slot="headerExtra">
      <div class="close-icon" @click="closeDialog">
        <img src="../images/icon_close@2x.png">
      </div>
    </div>
    <div class="dialog-content" >
      <p>您已申请过该产品，去看看其他的吧</p>
    </div>
  </Dialog>

</template>

<script>
  import Dialog from '@/components/Dialog';

  export default {
    name: "ErrorDialog",
    components: {
      Dialog,
    },
    props: {
      isVisible: {
        required: true,
        type: Boolean,
      },
    },
    data() {
      return {
        buttons: [{
          text: '更多优质放款通道 快来看看吧',
          onClick: this.toDc,
        }],
        extraStyle: {
          header: {
            borderBottom: 0,
            paddingTop: '.52rem',
            paddingBottom: "0"
          },
          footer: {
            paddingBottom: '.52rem',
            paddingTop: '0',
            textAlign: 'center',
          },
        },
      };
    },
    methods: {
      closeDialog() {
        this.$emit('update:isVisible', false);
        window.history.back()
      },
      toDc() {
        window.location.href = window.location.origin + "/custom-page/jyc-xjd/#/org-loan-list"
      }
    },
  };
</script>

<style lang="scss" scoped>
  .mint-popup {
    border-radius: 10px;
    min-height: auto;
    height: auto;
   /deep/ .g-scoped-event-button{
     width: 5.6rem;
     line-height: .8rem;
     background: linear-gradient(90deg, #E1BC78 0%, #D09E54 100%);
     border-radius: .4rem;
     color: #fff;
     font-size: .36rem;
    }
  }
  .close-icon{
    position: absolute;
    right:10px;
    top: 10px;
    & img{
      width: .24rem;
      height: .24rem;
    }
  }
  .dialog-content{
    text-align: center;
    margin-bottom: 0.34rem;
    & p{
      color: #363636;
      font-size: .3rem;
      margin-top: .3rem;
      line-height: 1;
    }
    & img{
      display: inline-block;
      width: 1.5rem;
    }
  }
</style>
