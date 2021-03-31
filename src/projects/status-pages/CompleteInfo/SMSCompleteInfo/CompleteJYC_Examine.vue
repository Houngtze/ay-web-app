<template>
  <div class="page-layout">
    <!-- 进度条 -->
    <Progress :progressConfig="progress"/>
    <!-- 内容 -->
    <GuideContent :contentTitle="contentTitle" :contentImages="contentImages"
                  :contentBtn="contentBtn" style="margin-top: .18rem;">
      <div class="content-extra" slot="extra">
        <p>
          <label>1</label>
          <span>您提交的信息正在加速审核，请耐心等待；</span>
        </p>
        <p>
          <label>2</label>
          <span>您可以在“我的”—“订单中心”查看该笔交易审核状态；</span>
        </p>
        <p>
          <label>3</label>
          <span>审核通过后，您还需要24小时内在“我的”—“订单中心”核对个人信息；</span>
        </p>
        <p>
          <label>4</label>
          <span>若审核不通过且您支付了首付款，首付款会在3-7个工作日原路退回。</span>
        </p>
      </div>
    </GuideContent>
    <!-- 受托支付html -->
    <div v-html="examineHtml" ref="examineForm" style="display: none" ></div>
  </div>
</template>

<script>
  import Progress from '../../Consume/components/Progress/index'
  import GuideContent from '../../Consume/components/GuideContent/index'

  export default {
    name: "E_Guide_Confirm",
    components: {
      Progress,
      GuideContent
    },
    data() {
      return {
        examineHtml: null,
        code: null,
        patchType: null,
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
          index: 2
        },
        contentImages: {
          src: require('../../image/examining.png')
        },
        contentTitle: {
          text: ['加速审核中...'],
          style: {
            padding: ".77rem 0 0 0",
            fontSize: "0.48rem"
          }
        },
        contentBtn: {
          text: '刷新结果',
          onActive: this.toNext
        }
      }
    },
    created() {
      if (this.$route.query.code) this.code = this.$route.query.code
      if (this.$route.query.patchType) this.patchType = this.$route.query.patchType
    },
    methods: {
      // 下一步
      async toNext() {
        if (!this.code) {
          this.$toast("code出错")
          return false
        }
        this.entrustPay()
      },
      // 受托支付  0 未受托支付 1 已受托支付
      async entrustPay() {
        const param = {
          code: this.code,
          patchType: this.patchType,
          channel: "H5"
        }
        const res = await this.$api.patchApply(param);
        if (res.code === 'sc0') {
          if (res.data.urlType === "1") {
            this.examineHtml = res.data.url
            // 提交E融所开户表单
            this.$nextTick(() => {
              this.submitForm()
            })
          } else {
            window.location.href = res.data.url
            return
          }
        } else {
          this.$toast("表单类型出错, urlType为: "+res.data.urlType)
          return
        }
      },
      // 提交委托支付表单
      submitForm(){
        // document.getElementById("formId").submit();
        this.$refs.examineForm.querySelector("form").submit();
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
  .content-extra{
    margin-top: .62rem;
    padding: 0 .3rem;
    & p {
      font-size: .24rem;
      line-height: 1.5;
      margin-bottom: .1rem;
      display: flex;
      & label{
        padding: 0 0.15rem 0 0.1rem;
        height: .35rem;
        line-height: .35rem;
        background-color: #d8d8d8;
        color: #363636;
        margin-right: 0.12rem;
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
      }
      & span{
        flex: 1;
        color: #868686;
      }
    }
  }
  .e-examine-content{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
