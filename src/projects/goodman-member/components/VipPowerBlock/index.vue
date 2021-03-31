<template>
  <div :class="powerClass" v-if="data">
    <h3>{{powerTitle}}<span @click="toPowerDetail">查看详情<img src="../../images/icon_more-down.png" class="right"/></span></h3>
    <div class="power-items-content">
      <div class="item-wrapper" :style="contentHeight">
        <div v-for="(item, index) in currentList" :key="item.name"
             :class="item.gray ? 'power-item gray' : 'power-item'" @click="toHref(item)">
          <img v-lazy="item.icon" :alt="item.name">
          <p>{{item.name}}</p>
          <span>{{item.title}}</span>
        </div>
      </div>
      <!--<div v-for="(item, index) in currentList.slice(8)" :key="item.name" v-show="isShowMore"-->
           <!--:class="item.gray ? 'power-item gray' : 'power-item'" @click="toHref(item)">-->
        <!--<img v-lazy="item.icon" :alt="item.name">-->
        <!--<p>{{item.name}}</p>-->
        <!--<span>{{item.title}}</span>-->
      <!--</div>-->
      <div class="toggle" @click="toggle">
        <p v-if="!isShowMore">查看所有权益 <img src="../../images/icon_more-down.png"/></p>
        <p v-if="isShowMore">收起 <img class="up" src="../../images/icon_more-down.png"/></p>
      </div>
    </div>
  </div>
</template>

<script>
  import {redirectToLoginPage} from '@/helpers/utils';
  export default {
    name: "vipPower",
    props: ["data", "vipLevel", "userId"],
    data() {
      return {
        isShowMore: false,
        contentHeight: "max-height: 3.24rem",
        currentList: [],
        powerTitle: "开通Ai会员·享海量专属权益"
      }
    },
    watch: {
      data(newVal) {
        if (newVal) {
          this.currentList = this.data.areaList
          this.isShowMore = false
          this.contentHeight = "height: 3.24rem;min-height: auto"
        }
      },
      vipLevel(newVal) {
        switch (newVal) {
          case "experienceVip":
            this.powerTitle = "Ai体验卡会员·体验7天专属权益";
            break;
          case "seasonVip":
            this.powerTitle =  "Ai季卡会员·享海量专属权益";
            break;
          case "yearVip":
            this.powerTitle =  "Ai年卡会员·享海量专属权益";
            break;
          default:
            this.powerTitle =  "开通Ai会员·享海量专属权益"
            break
        }
      }
    },
    mounted() {
      this.currentList = this.data.areaList
    },
    computed: {
      powerClass() {
        return this.vipLevel == "experienceVip" ? "power-block default" : "power-block"
      },
    },
    methods: {
      // 权益详情
      toPowerDetail() {
        this.toHref({
          url: "/custom-page/goodman-member/#/vip-detail/loan"
        })
      },
      // 项点击操作
      toHref(data) {
        if (!data) return
        if (data.needLogin && !this.userId) {
          redirectToLoginPage()
          return false
        }
        if (data.needVip) {
          if (this.vipLevel == "default") {
            return  this.$router.push({path: "/vip-pay"})
          }
        }
        if (data.url){
          if (data.url.indexOf('http') > -1) {
            window.location.href = data.url
          } else {
            window.location.assign(window.location.origin + data.url)
          }
        } else {
          this.$toast("正在规划中，敬请期待")
        }
      },
      toggle() {
        if (!this.isShowMore) {
          this.contentHeight = "min-height: 4.68rem",
          // this.currentList = this.data.areaList
          this.isShowMore = true
        } else {
          this.contentHeight = "height: 3.24rem;min-height: auto"
          // this.currentList = this.data.areaList.slice(0, 8)
          this.isShowMore = false
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .power-block{
    padding: .18rem 0;
    margin: .2rem 0;
    width: auto;
    min-height: 4.76rem;
    background: linear-gradient(180deg, #FAE3B2 0%, #F5C46F 100%);
    border-radius: .24rem;
    position: relative;
    h3{
      font-size: .36rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #6C3D12;
      line-height: 1;
      margin: .18rem 0;
      text-align: center;
      span{
        font-size: .28rem;
        display: inline-block;
        margin-left: .2rem;
        img{
          width: .20rem;
          display: inline-block;
          &.right{
            transform: rotate(-90deg);
          }
        }
      }
    }
    .power-items-content{
      overflow: hidden;
      margin: 0 .2rem ;
      width: auto;
      background: linear-gradient(180deg, #FFF9E7 0%, #F8DAA1 100%);
      border-radius: .2rem;
      padding: 0.1rem .24rem 0 .24rem ;
      .item-wrapper{
        overflow: hidden;
      }
      .power-item{
        text-align: center;
        width: 25%;
        display: inline-block;
        margin-top: .14rem;
        &.gray{
          opacity: .4;
        }
        & img{
          width: .68rem;
          height: .68rem;
          display: inline-block;
        }
        & p{
          font-size: .24rem;
          font-weight:600;
          color: #6C3D12;
          line-height: .34rem;
        }
        & span{
          font-size: .2rem;
          font-weight:500;
          color: #925F20;
          line-height: .28rem;
        }
      }
    }
    .toggle{
      padding: .2rem 0;
      font-size: .24rem;
      color: #6C3D12;
      text-align: center;
      img{
        width: .22rem;
        display: inline-block;
        margin-left: 0.06rem;
        &.up{
          transform: rotate(180deg);
        }
      }
    }
  }
</style>
