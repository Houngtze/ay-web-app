<template>
  <p class="tips">
    <span @click="showTips">手机收不到验证码？</span>
  </p>
</template>

<script>
  export default {
    name: "codeTips",
    props: ["msgId", "isService"],
    methods: {
      showTips() {
        if (this.msgId) {
          this.$api.getSmsSendLog({msgId: this.msgId}).then(res => {
            if (res.code === "0") {
              if (res.data && res.data.message) {
                this.$messagebox.alert(res.data.errMessage)
              } else {
                this.showDefaultTips()
              }
            } else {
              this.$toast(res.message)
            }
          })
        } else {
          if (this.isService) {
            this.showDefaultTips()
          } else {
            this.$messagebox.alert("1.银行预留手机号是你在办理该银行卡时所填写的手机号;\n2.由于运营商原因，若你在60秒内未收到短信，请重新获取；\n3.若输入短信验证码后提示无效，请重新获取。")
          }
        }
      },
      showDefaultTips() {
        this.$messagebox({
          title: '',
          message: "请拨打客服热线4001868888\n(时间9:00-18:30)"
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .tips{
    padding: .2rem .32rem;
    color: #BA9950;
    font-size: .26rem;
    line-height: 1;
    width: 100%;
    text-align: left;
  }
</style>
<style>
  .mint-msgbox-message{
    text-align: center;
  }
</style>
