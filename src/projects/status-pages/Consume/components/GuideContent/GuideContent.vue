<template>
  <div class="guide-content">
    <div class="content-title" v-if="contentTitle" :style="contentTitle.style">
      <div v-if="contentImages" class="content-img" :style="contentImages.style">
        <div class="content-img">
          <img :src="contentImages.src"  v-if="contentImages.src">
          <slot name="imgProgress"></slot>
        </div>
      </div>
      <h2 v-for="(item, index) in contentTitle.text" :key="index">{{item}}</h2>
    </div>
    <div class="content-desc" v-if="contentDesc">
      <p v-for="(item, index) in contentDesc.text" :key="index">{{item}}</p>
    </div>
    <div class="content-btn" v-if="contentBtn">
      <mt-button class="btn" @click="btnOnActive" :style="contentBtn.style">{{contentBtn.text}}</mt-button>
    </div>
    <slot name="extra"></slot>
  </div>
</template>

<script>
  export default {
    name: "GuideContent",
    props:['contentTitle', 'contentImages', 'contentDesc', 'contentBtn'],
    methods: {
      btnOnActive() {
        if (this.contentBtn.onActive) {
          this.contentBtn.onActive()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .guide-content{
    background-color: #fff;
    padding-bottom: .5rem;
  }
  .content-img{
    text-align: center;
    img{
      width: 1.5rem;
      height: 1.5rem;
      display: inline-block;
    }
  }
  .content-title{
    color: #363636;
    font-size: .48rem;
    text-align: center;
    & h2{
      text-align: center;
      line-height: .6rem;
    }
  }
  .content-img{
    display: inline-block;
    position: relative;
  }
  .content-desc{
    padding: 0 .5rem;
    & p{
      text-align: center;
      color: #a8a8a8;
      line-height: 1.3;
    }
  }
  .content-btn{
    text-align: center;
    padding-top: .5rem;
    & .btn{
      min-width: 4rem;
      height: .8rem;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      box-shadow:0px 9px 10px 0px rgba(209,160,85,0.25);
      border-radius: .4rem;
      color: rgba(255,255,255,1);
      font-size: .36rem;
    }
  }
</style>
