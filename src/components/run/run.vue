<template>
  <div class="result-page">
    <div class="w-bg page-container">
      <div class="page-icon">
        <img src="./images/run@2x.png">
        <span>{{timer}}</span>
      </div>
      <p class="title">{{pageDefault.title}}</p>
      <div class="content">
        <p v-html="pageDefault.content"></p>
      </div>
      <div class="btn">
        <img src="./images/btn-bg@2x.png">
        <p class="link" @click="refreshResult()">刷新结果</p>
      </div>
    </div>
    <div class="adv" @click="localPage(pageDefault.linkAdv)" v-if="pageDefault.hasAdv">
      <img :src="pageDefault.urlAdv">
    </div>
  </div>
</template>
<script>
export default {
  props: {
    page:{
      type:Object,
    }
  },
  data(){
    return {
      pageDefault:{
        status:'success',
        title:'加速审核中',
        content:'您提交的信息正在加速审核，请耐心等待',
        hasAdv:true,
        urlAdv:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3605131341,2156005759&fm=26&gp=0.jpg',
        // urlAdv:'./images/banner@2x.png',
        linkAdv:'https://www.baidu.com/'
      },
      timer:10,
      setTimer:''
    }
  },
  created(){
    Object.assign(this.pageDefault,this.page);
    this.timerPlayer();
  },
  methods:{
    goPage(link){
      if(link!=''){
        this.$router.replace(link);
      }
    },
    localPage(link){
      if(link!=''){
        window.location.href=link;
      }
    },
    timerPlayer(){
      clearTimeout(this.setTimer);
      this.setTimer=setTimeout(()=>{
        this.timer--;
        if(this.timer>0){
          this.timerPlayer();
        }
        else{
          this.refreshResult();
        }
      },1000);
    },
    refreshResult(){
      console.log('刷新结果');
      this.timer=10;
      this.timerPlayer();
      this.$emit('refreshData');
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes running {
  from{
    opacity: 0;
    transform:rotate(0deg);
  }
  50%{
    opacity: 1;
  }
  to{
    opacity: 0;
    transform:rotate(-360deg);
  }
}
.result-page{
  .w-bg{
    background:#fff;
  }
  .page-container{
    text-align: center;
    padding:0.5rem 0;
    .page-icon{
      width: 1.6rem;
      height: auto;
      display: block;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      img{
        width: 100%;
        height: auto;
        position: relative;
        z-index: 1;
        animation: running 2s linear 0s infinite;
      }
      span{
        position: absolute;
        z-index: 2;
        top: 0;
        left: 0;
        width: 100%;
        display: inline-block;
        text-align: center;
        line-height: 1.6rem;
        color: #d09e54;
        font-size: 0.8rem;
      }
    }
    .title{
      font-size: 0.4rem;
      line-height: 0.4rem;
      margin: 0.2rem 0;
      color:#333;
    }
    .content{
      font-size: 0.24rem;
      line-height: 0.3rem;
      color: #666;
    }
    .btn{
      width: 4.5rem;
      position: relative;
      z-index: 1;
      margin: 0 auto;
      margin-top: 0.4rem;
      img{
        width: 100%;
        height: auto;
        position: relative;
        z-index: 1;
      }
      .link{
        line-height: 0.8rem;
        width: 100%;
        text-align: center;
        font-size: 0.36rem;
        color:#fff;
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
      }
    }
  }
  .adv{
    width: 100%;
    height: auto;
    margin: 0.2rem 0;
    overflow: hidden;
    img{
      width: 100%;
      height: auto;
    }
  }
}
</style>
