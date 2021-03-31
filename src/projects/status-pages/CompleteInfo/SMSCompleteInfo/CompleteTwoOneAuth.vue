<template>
  <div class="page-layout">
    <!-- 进度条 -->
    <Progress :progressConfig="progress"/>
    <!-- 内容 -->
    <GuideContent :contentTitle="contentTitle" :contentDesc="contentDesc"
                  :contentBtn="contentBtn" style="margin-top: .18rem;"></GuideContent>
    <!-- 开户html -->
    <div  v-html="middlewareHtml" ref="middlewareForm" style="display: none"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Progress from '../../Consume/components/Progress/index'
  import GuideContent from '../../Consume/components/GuideContent/index'

  export default {
    name: "E_Guide_MiddleWare",
    components: {
      Progress,
      GuideContent
    },
    data() {
      return {
        code: null,
        patchType: null,
        middlewareHtml: null,
        progress: {
          textArr: [{
            text: '确认信息',
            extra: null
          },{
            text: '分期授权',
            extra: null
          },{
            text: '订单审核',
            extra: null
          },{
            text: '确认支付',
            extra: null
          }],
          index: 1
        },
        contentTitle: {
          text: ['个人信息确认完成','请牢记密码'],
          style: {
            padding: ".99rem 0 .18rem 0",
            fontSize: "0.48rem"
          }
        },
        contentDesc: {
          text: ['为了保证交易安全，需要确认您的个人信息并授权分期交易','请您在当日24点前确认']
        },
        contentBtn: {
          text: '下一步',
          onActive: this.toNext
        }
      }
    },
    computed: {
      ...mapState({
        idPerson: state => state.global.userInfo.idPerson,
      })
    },
    created() {
      if (this.$route.query.code) this.code = this.$route.query.code
      if (this.$route.query.patchType) this.patchType = this.$route.query.patchType
    },
    methods: {
      // 下一步
      toNext() {
        if (!this.code) {
          this.$toast("code出错")
          return false
        }
        this.repayAuth()
      },
      // 获取二合一授权所需信息
      async repayAuth() {
        // 获取风控结果
        const param = {
          code: this.code,
          patchType: this.patchType,
          channel: "H5"
        }
        const res = await this.$api.patchApply(param);
        if (res.code === 'sc0') {
          if (res.data.urlType === "1") {
            this.middlewareHtml = res.data.url
            // 提交E融所开户表单
            this.$nextTick(() => {
              this.submitForm()
            })
          } else {
            this.$toast(res.message)
            return
          }
        } else {
          this.$toast("表单类型出错, urlType为: "+res.data.urlType)
          return
        }
      },
      // 提交ppm表单
      submitForm(){
        // document.getElementById("formId").submit();
        this.$refs.middlewareForm.querySelector("form").submit();
      },
    }
  }
</script>

<style scoped lang="scss">
  .page-layout{
    height: 100%;
    overflow: hidden;
    background-color: #fff;
  }
  .e-middleware-content{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
