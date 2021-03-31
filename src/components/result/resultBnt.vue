<template>
  <div class="result-page">
    <div class="w-bg page-container">
      <img v-if="pageDefault.status=='success'" class="page-icon" src="./images/success@2x.png">
      <img v-else-if="pageDefault.status=='error'" class="page-icon" src="./images/error@2x.png">
      <img v-else-if="pageDefault.status=='failed'" class="page-icon" src="./images/failed@2x.png">
      <img v-else class="page-icon" src="./images/wait@2x.png">
      <p class="title">{{pageDefault.title}}</p>
      <div class="content">
        <p v-html="pageDefault.content"></p>
      </div>
      <div class="btn" v-if="pageDefault.hasHome">
        <img src="./images/btn-bg@2x.png">
        <p class="link" @click="goPage('./')">返回首页</p>
      </div>
      <div class="btn" v-if="pageDefault.hasOtherBtn">
        <img src="./images/btn-bg@2x.png">
        <slot name="other-bnt"></slot>
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
        title:'提交成功，申请已受理',
        content:'预计1个工作日内完成审核；<br/>请稍后查看审核结果',
        hasHome:true,
        hasOtherBtn:false,
        hasAdv:true,
        urlAdv:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3605131341,2156005759&fm=26&gp=0.jpg',
        // urlAdv:'./images/banner@2x.png',
        linkAdv:'https://www.baidu.com/'
      }
    }
  },
  created(){
    Object.assign(this.pageDefault,this.page);
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
