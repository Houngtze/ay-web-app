<template>
<div class="result-main">
  <div class="result-failed">
    <div class="failed-msg">
      <div class="icon-box"><img src="./images/failed.png" /></div>
      <div class="text-wait">暂未获批</div>
      <div class="text">您的借款暂未获批</div>
    </div>
  </div>
  <div class="home-btn" @click="goLink('/home')">返回首页</div>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
export default {
  components: {
  },
  data(){
    return{

    }
  },

  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      personId: state => state.global.userInfo.idPerson,
    }),
  },
  mounted(){

  },
  methods:{
    goLink(url) {
      this.$router.replace(url);
    }
  },
}
</script>
<style lang="scss" scoped>// scoped
.result-main{
  height: 100%;
    .result-failed{
        .failed-msg{
            padding: 0.4rem 0.82rem 0.43rem 0.82rem;
            background-color: #fff;
            margin-bottom: 0.3rem;
            text-align: center;
            .icon-box{
                margin-bottom: 0.36rem;
                img{
                    width: 1.4rem;
                    height: 1.4rem;
                }
            }
            .text-wait{
              color: #363636;
              font-size: 0.4rem;
              margin-bottom: 0.1rem;
              font-weight:600;
            }
            .text{
              color: #A8A8A8;
              font-size: 0.28rem;
            }
        }

    }
    .home-btn{
      width:6.84rem;
      height:0.88rem;
      background:rgba(186,153,80,1);
      border-radius:.44rem;
      line-height: 0.88rem;
      color:#fff;
      text-align: center;
      font-size: 0.32rem;
      margin: 0 auto;
      margin-top: 0.8rem;
    }
}
</style>