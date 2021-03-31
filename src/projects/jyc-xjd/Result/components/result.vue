<template>
  <div class="result-page">
    <div class="w-bg page-container">
      <img v-if="pageDefault.status=='success'" class="page-icon" src="./images/success@2x.png">
      <img v-else-if="pageDefault.status=='error'" class="page-icon" src="./images/error@2x.png">
      <img v-else-if="pageDefault.status=='failed'" class="page-icon" src="./images/failed@2x.png">
      <img v-else class="page-icon" src="./images/wait@2x.png">
      <p v-if="pageDefault.title" class="title">{{pageDefault.title}}</p>
      <div class="content" v-if="pageDefault.content">
        <p v-html="pageDefault.content"></p>
      </div>
      <div class="price">
        <p v-if="pageDefault.price"><span>&yen;</span>{{pageDefault.price}}</p>
      </div>
    </div>
    <!-- <p class="bnt1" v-if="pageDefault.hasBtn" @click="bntClick()">{{pageDefault.bntTxt}}</p> -->
    <p class="bnt1" v-if="pageDefault.hasBtn" @click="localPage(pageDefault.bntLink)">{{pageDefault.bntTxt}}</p>
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
        price:'',
        hasBtn:true,
        hasAdv:false,
        urlAdv:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3605131341,2156005759&fm=26&gp=0.jpg',
        // urlAdv:'./images/banner@2x.png',
        linkAdv:'https://www.baidu.com/',
        bntTxt:'返回首页',
        bntLink:'goHome',
      }
    }
  },
  created(){
    Object.assign(this.pageDefault,this.page);
  },
  watch:{
    page:function(){
      Object.assign(this.pageDefault,this.page);
    }
  },
  methods:{
    bntClick(){
      this.$emit('resultBntClick');
    },
    goPage(link){
      if(link!=''){
        if(link === 'goHome'){
          this.$router.go(-(window.history.length - 1));
        }
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
    overflow: hidden;
    .page-icon{
      width: 1.05rem;
      height: auto;
      display: block;
      margin: 0.4rem auto 0.3rem auto;
    }
    .title{
      font-size: 0.4rem;
      line-height: 0.4rem;
      margin: 0.2rem 0;
      color:#333;
    }
    .content{
      font-size: 0.28rem;
      color: #363636;
      p{
        line-height: 0.5rem;
      }
    }
    .price{
      padding: 0.2rem 0 0.4rem 0;
      p{
        font-size: 0.48rem;
        font-weight: 500;
        line-height: 0.5rem;
        span{
          font-size: 0.4rem;
          vertical-align: bottom;
          line-height: 0.44rem;
          padding-right: 0.1rem;
        }
      }
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
  .bnt1{
    height: 0.92rem;
    // border: 0.05rem solid #D09E54;
    background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
    line-height: 0.91rem;
    color: #fff;
    font-size: 0.36rem;
    border-radius: 0.1rem;
    margin: 0.6rem 0.3rem 0.25rem 0.3rem;
    text-align: center;
  }
}
</style>
