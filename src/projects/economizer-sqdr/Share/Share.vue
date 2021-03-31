<template>
  <div class="pub-page">
    <img src="./../images/share-bg.png">
    <div class="bnt" @click="goToPage()"></div>
    <div class="out-div" v-show="outModel">
      <img src="./../images/share-txt.png">
    </div>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from "vuex";
  import PubNav from "../components/PubNav";
  export default {
    components:{
      PubNav
    },
    data() {
      return {
        modelShower:false,
        outModel:false,
      };
    },
    filters: {
    },
    computed: {
      ...mapState({
        isSign: state => state.global.userInfo.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state =>state.global.userInfo.idPerson,
        identity: state =>state.global.userInfo.identity,
        mobile: state =>state.global.userInfo.mobile,
        name: state =>state.global.userInfo.name,
        topData: state => state.top.topData,
      })
    },
    async created() {
    },
    mounted() {
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      isWeChat() {
        let ua=navigator.userAgent.toLowerCase();
        return /micromessenger/.test(ua);
      },
      isQQ() {
        let ua=navigator.userAgent.toLowerCase();
        return /qq\/([\d]+)/.test(ua);
      },
      isWeiBo(){
        let ua=navigator.userAgent.toLowerCase();
        return /WeiBo/i.test(ua);
      },
      goToPage(url){
        if(this.isWeChat() || this.isWeiBo()){
          this.outModel = true;
        }
        else{
          this.$router.push({
            path:'/detail',
            query:{
              acId:this.$route.query.pid,
              usi:this.$route.query.usi,
              ori:this.$route.query.ori,
              source:'sqdr'
            }
          });
        }
      },
    }
  };
</script>
<style lang="scss" scoped>
@import "src/style/index.scss";
.pub-page{
  width: 100%;
  height: 100%;
  min-height: auto;
  overflow: hidden;
  position: relative;
  background:#D82B39;
  padding-bottom: 1.98rem;
  img{
    width: 100%;
    height: auto;
    position: relative;
    z-index: 1;
  }
  .bnt{
    width: 6.11rem;
    height: 1.83rem;
    background:url(./../images/share-bnt.png) center no-repeat;
    background-size:100% auto;
    position: absolute;
    top: 9.6rem;
    left: 50%;
    margin-left: -3.06rem;
    z-index: 2;
  }
  .out-div{
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.7);
    z-index: 103;
    padding: 0.5rem 1rem;
  }
}
</style>
<style lang="scss">
</style>

