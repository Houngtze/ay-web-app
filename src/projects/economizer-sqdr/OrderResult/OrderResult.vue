<template>
  <div class="economizer-result">
    <div class="result-header">
      <p class="result-info">中奖名单公布</p>
      <p class="goods-title">商品名称：{{winningList.activityTheme}}</p>
      <p class="my-result" v-if="winningList.chooseStatus === 1" @click.stop="showModel">我的中奖结果</p>
      <table class="model-table">
        <tr>
          <th class="tt" colspan="3">本期一等奖名单<span class="col">（{{winningList.openResultList ? winningList.openResultList.length : 0}}名）</span></th>
        </tr>
        <tr>
          <th>序号</th>
          <th>用户</th>
          <th>中奖编码</th>
        </tr>
        <tr v-for="(item,index) in winningList.openResultList" :key="index">
          <td>{{index+1}}</td>
          <td>{{item.userName}}</td>
          <td>{{item.joinCode}}</td>
        </tr>
      </table>
    </div>
    <div class="result-bottom">
      <div class="bottom-header">参与3次以上获奖概率在 99%以上</div>
      <ul class="bottom-list">
        <li class="list-tips" v-for="item in listData" :key="item.activityThemeId">
          <div class="tips-content">
            <div class="tips-img">
              <img :src="item.imgUrl2" alt="">
            </div>
            <div class="content-title">
              <p>{{item.goodName}}</p>
              <p>{{item.virtualJoinedNum}}/{{item.fullNum}}人正在参与，就差你了</p>
              <div class="tips-bottom">
                <span>￥{{item.activityPrice}}</span>
                <span @click="goBuy(item.activityThemeId)">立即抢购</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="model-shower" v-show="modelShower" @click.stop="showModel">
      <div class="r-m-bg" @click.stop="">
        <div class="tp-bg">
          <p class="t1">中奖啦</p>
          <p class="t2">恭喜您中了{{winningList.resultStatus === 1 ? '一等奖' : '二等奖'}}</p>
        </div>
        <div class="mid-msg">
          <img v-if="winningList.resultStatus === 1" :src="tic">
          <img v-else :src="sic">
          <p class="t3" v-if="winningList.resultStatus === 1">近期将有工作人员与您联系中奖事宜,请保持手机畅通</p>
          <p class="t3" v-else>优惠券将在7个工作日内发放<br>可在爱用商城APP-我的-优惠券查看使用</p>
          <p class="bnt" @click.stop="goPayAgin">查看更多1元好物</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from "vuex";

  export default {
    data() {
      return {
        winningList: [],
        winningStatus: '',
        listData: '',
        modelShower:false,
        tic:require('../images/t-ic.png'),
        sic:require('../images/s-ic.png'),
      };
    },
    filters: {},
    computed: {
      ...mapState({
        isSign: state => state.global.userInfo.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state => state.global.userInfo.idPerson,
        identity: state => state.global.userInfo.identity,
        mobile: state => state.global.userInfo.mobile,
        name: state => state.global.userInfo.name,
        // listData: state => state.activityList.activityList,
      })
    },
    created() {
      this.getData();
    },
    mounted() {
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      goPayAgin() {
        this.$router.push("/home");
      },
      goBuy(id) {
        this.$router.push({path: "/detail", query: {acId: id}});
      },
      async getData() {
        // const res = await this.$api.getLotteryResult({userId: 1510, activityOrderId: 1, activityThemeId: 1, goodId: 1});
        const res = await this.$api.queryActivityResultHttp({
          userId: this.userId,
          activityOrderId: this.$route.query.orderid,
          activityThemeId: this.$route.query.themeid,
        });
        if (res.code === '0') {
          this.winningList = res.data;
        }
        const listRes = await this.$api.getActivityList({});
        if (listRes.code === '0') {
          this.listData = listRes.data;
        }
      },
      showModel(){
        this.modelShower = !this.modelShower;
        if(this.showModel){
          // 如果为显示弹框
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "src/style/index.scss";
</style>
<style lang="scss">
  .economizer-result {
    .result-header {
      background-color: #fff;
      padding: 0rem .3rem .3rem;
      margin-bottom: .2rem;
      .result-info {
        font-size: .48rem;
        text-align: center;
        padding:0.6rem 0;
      }
      .regret-info {
        color: #A8A8A8;
        font-size: .28rem;
        text-align: center;
        margin-bottom: .4rem;
      }
      .win-info {
        display: flex;
        justify-content: flex-start;
        border-radius: .3rem;
        border: .01rem solid #f6f6f6;
        box-shadow: 15px 5px 15px -10px #f6f6f6, -15px 5px 15px -10px #f6f6f6, 0px 15px 15px -10px #f6f6f6;
        margin-bottom: .6rem;
        padding: .3rem;
        img {
          display: inline-block;
          width: 2rem;
          height: auto;
          margin-right: .2rem;
        }
        .win-content {
          padding: .1rem 0;
          p {
            &:nth-child(1) {
              color: #363636;
              font-size: .3rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            &:nth-child(2) {
              color: #A8A8A8;
              font-size: .24rem;
              margin: .1rem 0 .6rem;
            }
            &:nth-child(3) {
              color: #FF4949;
              font-size: .24rem;
            }
          }
        }
      }
      .again-btn {
        border-radius: .1rem;
        color: #fff;
        text-align: center;
        background-color: #FF2929;
        padding: .3rem 0;
      }
    }
    .result-bottom {
      background-color: #fff;
      .bottom-header {
        padding: .3rem;
        border-bottom: .02rem solid #E5E5E5;
      }
      .bottom-list {
        padding: 0 .3rem;
        li + li {
          border-top: .02rem solid #E5E5E5;
        }
        .list-tips {
          padding: .3rem 0;
          .order-status {
            text-align: right;
            font-size: .22rem;
            color: #FF4949;
          }
          .tips-content {
            display: flex;
            justify-content: flex-start;
            .tips-img{
              width: 2rem;
              height: 2rem;
              overflow: hidden;
              margin-right: 0.2rem;
              flex-shrink: 0;
              display: flex;
              align-items: center;
            }
            .content-title {
              width: 100%;
            }
            p {
              &:nth-child(1) {
                color: #363636;
                font-size: .3rem;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                min-height: .95rem;
              }
              &:nth-child(2) {
                color: #A8A8A8;
                font-size: .24rem;
                margin-bottom: .3rem;
              }
            }
            .tips-bottom {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              span {
                &:nth-child(1) {
                  color: #FF4949;
                  font-size: .36rem;
                }
                &:nth-child(2) {
                  font-size: .2rem;
                  display: inline-block;
                  color: #fff;
                  background-color: #FF4949;
                  border-radius: .3rem;
                  padding: .16rem .32rem;
                }
              }
            }
          }
        }
      }
    }
    .model-table{
      border-top: 1px solid #e5e5e5;
      border-left: 1px solid #e5e5e5;
      width:100%;
      color: #aaa;
      margin-top: 0.2rem;
      td,th{
        text-align: center;
        line-height: 0.42rem;
        border-right: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        font-size: 0.24rem;
      }
      .tt{
        color:#363636;
        font-size: 0.28rem;
        line-height: 0.66rem;
      }
      .col{
        color:#FF4949;
      }
    }
    .goods-title{
      font-size: 0.28rem;
      color:#363636;
      line-height: 0.36rem;
    }
    .my-result{
      font-size: 0.22rem;
      color:#FF4949;
      text-align: right;
    }
    .model-shower{
      position: fixed;
      top: 0;
      left: 0;
      z-index: 103;
      width: 100%;
      height: 100%;
      background: rgba($color: #000000, $alpha: .6);
      display: flex;
      justify-content: center;
      align-items: center;
      .r-m-bg{
        width: 5.6rem;
        // height:4.8rem;
        background:#fff;
        border-radius:0.4rem;
        overflow: hidden;
        .tp-bg{
          width:100%;
          height: 1.3rem;
          background:#FF2929;
          text-align:center;
          color: #fff;
          box-sizing: border-box;
          padding-top:0.2rem;
          .t1{
            font-size: 0.36rem;
          }
          .t2{
            font-size: 0.26rem;
          }
        }
        .mid-msg{
          width: 100%;
          padding: 0.37rem 0.3rem 0.3rem;
          img{
            width: 80%;
            height: auto;
            display: block;
            margin: 0 auto;
          }
          .bnt{
            width: 80%;
            height: 0.8rem;
            line-height: 0.8rem;
            color:#fff;
            background:#FF302A;
            border-radius: 0.4rem;
            text-align: center;
            font-size: 0.3rem;
            margin: 0 auto;
            margin-top: 0.2rem;
          }
          .t3{
            color:#A8A8A8;
            font-size: 0.2rem;
            text-align: center;
          }
        }
      }
    }
  }
</style>

