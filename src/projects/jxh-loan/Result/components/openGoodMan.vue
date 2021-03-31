<template>
  <div class="member-content no-open">
    <mt-navbar v-model="openGoodManSelect">
      <mt-tab-item id="open">
        <div class="open">
          <span>开通好人卡</span>
          <label>优惠</label>
        </div>
      </mt-tab-item>
      <mt-tab-item id="no-open">放弃优惠,仅提现</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="openGoodManSelect">
      <mt-tab-container-item id="open">
        <div class="good-man-content">
          <div class="good-man-card">
            <div class="left">
              <h3>
                <img src="../images/good-man-card-icon.png">
                <span>好人黑卡</span>
                <label>(含本次提现权益)</label>
              </h3>
              <p>开通黑卡￥299 </p>
            </div>
            <div class="right">
              <h3>
                <label>￥</label>
                <span>1180</span>
              </h3>
              <p>原价¥1280</p>
            </div>
          </div>
          <div class="good-man"></div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="no-open">
        fgg
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
  export default {
    name: "openGoodMan",
    props: ['openGoodManData'],
    data() {
      return {
        openGoodManSelect: 'open'
      }
    }
  }
</script>

<style scoped lang="scss">
  .member-content{
    /deep/ .mint-navbar {
      position: relative;
      &:after{
        height: 1px;
        content: '';
        width: 100%;
        border-bottom: 1px solid #e8e8e8;
        position: absolute;
        bottom: 0;
        right: 0;
        transform: scaleY(0.5);
        z-index: 10;
      }
      & .mint-tab-item{
        color: #868686;
        &.is-selected{
          border: none;
          color: #363636;
          font-weight: 600;
          & .mint-tab-item-label{
            border-bottom: .1rem solid #E1AD5B;
          }
        }
      }
    }
    /deep/ .mint-navbar .mint-tab-item{
      padding: 0;
      & .mint-tab-item-label{
        font-size: .28rem;
        height: 100%;
        padding: .3rem .1rem;
        display: inline-block;
        & .open{
          & label{
            width: .8rem;
            min-height: .38rem;
            background:rgba(253,72,72,1);
            border-radius: .2rem;
            font-size: .24rem;
            color:rgba(255,255,255,1);
            line-height: .34rem;
            margin-left: .1rem;
            padding: 0 .1rem;
          }
        }
      }
    }
  }
  .good-man-content{
    padding: .28rem .3rem .24rem .3rem;
    width: 100%;
    min-height: 4rem;
    background-color: #fff;
    & .good-man-card{
      width: 100%;
      height: 1.44rem;
      background: linear-gradient(270deg,rgba(24,24,24,1) 0%,rgba(51,51,51,1) 100%);
      border-radius: .1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .3rem;
      & p{
        font-size: .24rem;
        color:rgba(255,255,255,0.6);
        line-height: .34rem;
        margin-top: 0.08rem;
      }
      & .left{
        flex: 1;
        & h3{
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: #fff;
          & img{
            width: .32rem;
            height: .3rem;
            display: inline-block;
            margin-right: .12rem;
          }
          & span{
            font-size: .3rem;
          }
          & label{
            font-size: .26rem;
          }
        }
      }
      & .right{
        & h3{
          color: #fff;
          line-height: .4rem;
          & span{
            font-size: .36rem;
          }
          & label{
            font-size: .28rem;
          }
        }
      }
    }
  }
</style>
