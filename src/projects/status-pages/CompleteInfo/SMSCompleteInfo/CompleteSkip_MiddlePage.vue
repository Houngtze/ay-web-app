<template>
  <div class="page-layout">
    <h1>页面跳转中...</h1>
    <!-- 开户html -->
    <div v-html="PPM_ConfirmHtml" ref="confirmForm" style="display: none"></div>
  </div>
</template>

<script>

  export default {
    name: "CompleteSkip_MiddlePage",
    data() {
      return{
        code: null,
        patchType: null,
        PPM_ConfirmHtml: null
      }
    },
    created() {
      // 获取code，没有则提示
      this.getCode()
      // 进入页面判断
      this.initPage()
    },
    methods: {
      // 页面初始化接口跳转
      async initPage() {
        if (!this.getCode()) {
          return false
        }
        // 获取风控结果
        const param = {
          code: this.code,
          patchType: this.patchType,
          channel: "H5"
        }
        const res = await this.$api.patchApply(param);
        if (res.code === 'sc0') {
          const type = res.data.type.toString()
          /*  type
          *  判断跳转类型
          *  状态（2绑卡，其余跳转链接）
          * */
          if (type === "2") {
            // 判断是否绑过卡
            if (res.data.isOpen === "2"){
              window.location.replace(res.data.url)
            } else {
              this.$router.replace({path: "/complete-bind-bank", query: {
                  code: this.code
                }})
            }
          } else {
            if (res.data.urlType === "1") {
              this.PPM_ConfirmHtml = res.data.url;
              this.$nextTick(() => {
                this.$refs.confirmForm.querySelector("form").submit();
              });
            } else if (res.data.urlType === "2") {
              window.location.replace(res.data.url)
            }
          }
        } else {
          this.$toast(res.message)
        }
      },
      // 提交ppm表单
      submitPPMForm(){
        // document.getElementById("formId").submit();
        this.$refs.formSubmit.querySelector("form").submit();
      },
      // 订单号判断
      getCode() {
        if (!this.$route.query.code) {
          this.$toast('code码出错')
          return false
        } else {
          this.code = this.$route.query.code
          this.patchType = this.$route.query.patchType
          return true
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .page-layout {
    min-height: 100%;
    width: 100%;
    background-color: #fff;
    overflow: hidden;
    display: flex;
    align-content: center;
    justify-content: center;
    & h1{
      font-size: .5rem;
      margin-top: 70%;
    }
  }
</style>
