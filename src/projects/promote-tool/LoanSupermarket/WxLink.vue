<template>
  <div class="page-red">
    <div class="page-one inner-page" v-if="!showPage">
      <img class="bg-img" v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/promote-tool/WxLink-banner1.png'">
      <div class="bnt-one" @click="showClick"></div>
    </div>
    <div class="page-two inner-page" v-else>
      <img class="bg-img" v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/promote-tool/WxLink-banner2.png'">
    </div>
  </div>
</template>
<script>
import env from "@/helpers/env";
export default {
  data() {
    return {
      showPage: this.$route.query.st || false,
    };
  },
  created() {
  },
  methods: {
    linkTap(url){
      this.$router.replace(url);
    },
    showClick(){
      this.showPage = true;
      this.linkTap({
        path:'/wxlink',
        query:{
          st:true
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page-red{
  background: #fff;
  min-height: 100%;
  .inner-page{
    width: 100%;
    position: relative;
    z-index: 1;
    .bg-img{
      width: 100%;
      height: auto;
      display: block;
      position: relative;
      z-index: 1;
    }
    .bnt-one{
      position: absolute;
      z-index: 2;
      top: 6.68rem;
      left: 50%;
      margin-left: -1.2rem;
      width: 2.4rem;
      height: 2.4rem;
      background: url(./images/bnt.png) center no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>

