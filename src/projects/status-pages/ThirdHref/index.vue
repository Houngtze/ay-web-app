<template>
  <div class="page-layout">

  </div>
</template>

<script>
  import { Indicator } from 'mint-ui';
  import {mapState} from 'vuex'
  export default {
    name: "index",
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId
      }),
    },
    mounted() {
      Indicator.open();
      const queryLink = (this.$route.query.link && this.$route.query.linkType === "third_href") ? decodeURIComponent(this.$route.query.link) : "";
      if (!queryLink) {
        return this.$toast({
          message: "跳转链接出错",
          duration: -1,
          position: "bottom"
        })
      }
      const { userId } = this
      this.$api.UserStatistics({
        userId,
        url: queryLink
      }).then(res =>{
        if (res.code === 'sc0') {
          window.location.replace(queryLink)
        }
      })
    }
  }
</script>

<style scoped lang="scss">
.page-layout{
  width: 100%;
  height: 100%;
  min-height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
