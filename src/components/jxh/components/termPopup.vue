<template>
  <mt-popup class="term-list" v-model="popupVisible" position="bottom" :closeOnClickModal="false">
    <div class="tt">
      <i class="close" @click="closePopup"></i>
      <p class="txt">{{title}}</p>
    </div>
    <ul class="" v-if="term.length">
      <li v-for="(item ,index) in term" :key="index" @click="tapLink(item.link)">{{item.name}}<i class="arrow"></i></li>
    </ul>
  </mt-popup>
</template>

<script>
  export default {
    name: "termPopup",
    props: ["popupVisible", "term", "title"],
    methods: {
      tapLink(link) {
        window.location.href = link
      },
      closePopup() {
        this.$emit("update:popupVisible", false)
      }
    }
  }
</script>

<style scoped lang="scss">
  .term-list{
    width: 100%;
    height: 40%;
    text-align: center;
    display: flex;
    flex-direction: column;
    .tt{
      height: 1rem;
      display: flex;
      flex-shrink: 0;
      p{
        line-height: 1rem;
        font-size: 0.34rem;
        font-weight: 400;
        width: 100%;
        padding-right: 1rem;
      }
      .close{
        width: 1rem;
        height: 1rem;
        background: url(../images/close@2x.png) center no-repeat;
        background-size: 30% auto;
        flex-shrink: 0;
      }
    }
    ul{
      height: 100%;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      text-align: left;
      padding-left: 0.3rem;
      border-top: 1px solid #E5E5E5;
    }
    li{
      height: 1rem;
      line-height: 1rem;
      font-size: 0.3rem;
      border-bottom: 1px solid #E5E5E5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 0.3rem;
      .arrow{
        width: 0.14rem;
        height: 0.22rem;
        flex-shrink: 0;
        background: url(../images/rower@2x.png) center no-repeat;
        background-size: 100% auto;
        margin-left: 0.2rem;
      }
    }
  }
</style>
