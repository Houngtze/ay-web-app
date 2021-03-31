<template>
  <div class="page-layout">
    <div class="vip-middleware-content"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "JXHVipPage",
    data() {
      return {

      }
    },
    computed: {
      ...mapState({
        idPerson: state => state.global.userInfo.idPerson,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        sign: state => state.global.userInfo
      }),
    },
    mounted() {
      this.assembleThirdUrl()
    },
    methods: {
      // 获取账单
      assembleThirdUrl() {
        this.$api.assembleThirdUrl({
          phone: this.sign.mobile,
          userId: this.userId,
          nickname: this.sign.nickname,
          time: new Date().getTime()
        }).then(res => {
          if (res.code === '0') {
            window.location.replace(res.data)
          } else {
            this.$toast(res.message)
          }
        })
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
  .vip-middleware-content{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>
