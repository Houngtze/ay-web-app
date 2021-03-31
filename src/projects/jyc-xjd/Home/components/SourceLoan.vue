<template>
  <div class="source-loan">
    <div class="org-loan item">
      <img v-lazy="'http://static.ali.szqk-tech.com/images/custom-page/jyc-xjd/home-source-loan-banner.png'" alt="banner" @click="toDC">
    </div>
    <div class="adv item">
      <div class="title">
        <label></label>
        <span>为什么使用爱有钱</span>
        <label></label>
      </div>
      <div class="content">
        <div class="adv-item">
          <img src="./images/adv-1.png">
          <p>会员定制</p>
          <span>AI会员专属</span>
        </div>
        <div class="adv-item">
          <img src="./images/adv-2.png">
          <p>额度高</p>
          <span>最高5万额度</span>
        </div>
        <div class="adv-item">
          <img src="./images/adv-3.png">
          <p>审批快</p>
          <span>最快1秒下款</span>
        </div>

      </div>
      <div class="line"></div>
      <div class="title">
        <span>第三方合作机构</span>
      </div>
      <div class="content">
        <div class="adv-item">
          <img src="./images/1@2x.png">
          <p>桔多多</p>
        </div>
        <div class="adv-item">
          <img src="./images/2@2x.png">
          <p>分期易</p>
        </div>
        <div class="adv-item">
          <img src="./images/3@2x.png">
          <p>乐享借</p>
        </div>
        <div class="adv-item">
          <img src="./images/4@2x.png">
          <p>同程金服</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    // 贷超
    name: "SourceLoan",
    methods: {
      toDC() {
        this.$router.push({path: "/org-loan-list"})
      }
    }
  }
</script>

<style scoped lang="scss">
.source-loan{
  padding: 0 .3rem;
  .item{
    margin-top: .3rem;
    width: 100%;
    height: 100%;
    border-radius: .16rem;
    overflow: hidden;
    background-color: #fff;
    & > img{
      width: 100%;
      max-height: 1.8rem;
      display: inline-block;
    }
    &.adv{
      padding: .38rem 0 0 0;
      text-align: center;
      .title{
        width: 100%;
        text-align: center;
        font-size: .32rem;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight: 600;
        color:rgba(54,54,54,1);
        line-height: .44rem;
        label{
          width: 0.08rem;
          height: .16rem;
          background:rgba(220,181,115,1);
          display: inline-block;
          margin: 0 .16rem;
        }
      }
      .content{
        padding: .4rem 0 .3rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        .adv-item{
          flex: 1;
          img{
            width: .8rem;
            display: inline-block;
          }
          p{
            font-size: .26rem;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:600;
            color:rgba(54,54,54,1);
            line-height: .36rem;
          }
          span{
            font-size: .22rem;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(168,168,168,1);
            line-height: .32rem;
          }
        }
      }
      .line{
        width: 6.2rem;
        height: 0.01rem;
        background:rgba(238,238,238,1);
        display: inline-block;
        margin-bottom: .28rem;
      }
      .org-content{
        width: 100%;
        text-align: center;
        margin-top: .24rem;
        img{
          width: 6.32rem;
          display: inline-block;
        }
      }
    }
  }

}
</style>
