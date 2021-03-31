<template>
  <!-- 打开推送 -->
  <div class="open-push" v-if="!isAppPushOpen && isApp">
    <div class="content">
      <div class="left">
        <p>打开消息通知开关</p>
        <span>加速审核并及时接受审核进度信息</span>
      </div>
      <div class="right">
        <button @click="goAppPushSetting">打开</button>
      </div>
    </div>
  </div>
</template>

<script>
  import env from "@/helpers/env";
  export default {
    name: "index",
    data() {
      return {
        isAppPushOpen: false,
        isApp: env.isApp()
      }
    },
    mounted() {
      this.checkAppPush()
    },
    methods: {
      // 检查是否打开app通知
      checkAppPush() {
        if (env.isApp()) {
          this.$nativeBridge.checkAppPush().then(res => {
            if (res && res.code === 'sc0') {
              this.isAppPushOpen = res.data.isAppPushOpen || false
            } else {
              this.$toast(res.message)
            }
          })
        }
      },
      // 打开app通知设置
      goAppPushSetting() {
        this.$nativeBridge.goAppPushSetting().then(res => {
          if (res && res.code !== 'sc0') {
            this.$toast(res.message)
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .open-push{
    padding: 0 .3rem .47rem .3rem;
    width: 100%;
    background-color: #fff;
    .content{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left{
        text-align: left;
        p{
          font-size: .3rem;
          line-height: 1;
          margin-bottom: 0.08rem;
        }
        span{
          font-size: .24rem;
        }
      }
      .right{
        button{
          width: 1.5rem;
          height: .54rem;
          border:1px solid rgba(208,158,84,1);
          border-radius: .27rem;
          font-size: .24rem;
          background: #fff;
          color: rgba(208,158,84,1);
        }
      }
    }
  }
</style>
