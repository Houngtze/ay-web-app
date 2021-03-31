<template>
  <div class="detail">
    <div class="container">
      <page-top :isLink="false" @shower="ruleClick"></page-top>
      <div class="info">
        <div class="pic-shower">
          <img :src="detailData.imgUrl2" :onerror="defaultImg">
        </div>
        <div class="text">
          <h4>{{detailData.activityTheme}}</h4>
          <div class="description">
            <span>{{detailData.activityDesc}}</span>
            <!-- <span>13,888人已中奖</span> -->
            <span class="fr">剩余{{detailData.fullNum-detailData.virtualJoinedNum}}份</span>
          </div>
          <div class="info">
            <div class="price activity-price">
              <p class="amount"><span>￥</span>{{detailData.activityPrice}}</p>
              <p class="origin">&yen;{{detailData.goodPrice}}</p>
            </div>
            <div class="count-time">
              <p>距离活动结束还剩</p>
              <ul>
                <li>{{Countdown.hh}}</li>
                <span>:</span>
                <li>{{Countdown.mm}}</li>
                <span>:</span>
                <li>{{Countdown.ss}}</li>
              </ul>
            </div>
          </div>
          <div class="bor-bot"></div>
        </div>
      </div>
      <div class="progress">
        <div class="description">
          <span>参与进度</span>
          <span class="fr">人满即开团，未满到期退款</span>
        </div>
        <div class="bor">
          <div class="pro" :style="'width:'+detailData.virtualJoinedNum*100/detailData.fullNum+'%;'"></div>
        </div>
        <div class="description biger">
          <span>{{detailData.virtualJoinedNum}}</span>
          <span class="fr">{{detailData.fullNum}}</span>
        </div>
      </div>
      <div class="progress">
        <p class="warm">关注微信公众号【爱用有钱】（aiyongyouqian），第一时间了解 中奖情况</p>
      </div>
      <div class="progress">
        <p class="warm"><img class="qg-img" src="../images/qg-icon.png"></p>
        <p class="qg-txt">1.参与抢购&nbsp;&nbsp;2.好友助力&nbsp;&nbsp;3.等待开奖&nbsp;&nbsp;4.中奖收礼</p>
        <p class="qg-warm">邀请好友参与，额外获得参与码，提高中奖概率！</p>
      </div>
    </div>
    <div v-show="ruleShower" class="footer">
      <p class="cont-txt" @click="goTo('/')">
        <span>更多一元好物</span>
        <img src="../images/more.png" alt="">
      </p>
      <p :class="canBuy?'cont-bnt' : 'cont-bnt dis'" @click="buyNow">立即抢购</p>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from "vuex";
  import PageTop from "../components/PageTop";

  export default {
    components:{
      PageTop
    },
    data() {
      return {
        canBuy:false,
        detailData:{
          activityTheme:null, //活动主题
          start_date:null, //活动开始时间
          end_date:null, //活动结束时间
          open_date:null, //活动开始时间
          status:null, //活动状态：未开始：0;进行中：1;结束：2
          fullNum:null, //满团人数
          joinedNum:null, //已参加人数
          goodName:null, //商品名称
          goodPrice:null, //商品单价
          goodImgUrl:null, //商品展示图片url
          activityDesc:null, //商品描述
          activityId:null, //活动主题ID
        },
        Countdown:{
          hh:'01',
          mm:'02',
          ss:'03',
        },
        screenWith: window.screen.width,
        defaultImg: 'this.src="' + require('../images/default.png') + '"',
        acId:this.$route.query.acId || null ,
        imgA:require('../images/icon-yhq1.png'), //一元图
        imgB:require('../images/icon-yhq2.png'), //二元图
        ruleShower:true
      };
    },
    filters: {
    },
    computed: {
      ...mapState({
        isSign: state => state.global.userInfo.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state =>state.global.userInfo.idPerson,
        identity: state =>state.global.userInfo.identity,
        mobile: state =>state.global.userInfo.mobile,
        name: state =>state.global.userInfo.name,
        topData: status => state.top.topData,
      })
    },
    created() {
      if(this.$route.query.source){
        this.setPageSource(this.$route.query.source);
      }
      this.clearGoodsDetail();
      this.getDetail();
    },
    mounted() {
    },
    methods: {
      ...mapActions("order", ["clearGoodsDetail" ,"setGoodsDetail","setActivityRule"]),
      ...mapActions("addr", ["set_SelectedAddr"]),
      ...mapActions('global/sign', ['setPageSource']),
      handleSwipe(index) {
        this.slideIndex = index + 1
      },
      toast(mes) {
        this.$toast({
          message: mes,
          duration: 1500
        });
      },
      async getDetail(){
        // 获取详情
        if(!this.acId){
          this.toast('页面缺少必要参数，请返回上级页面重新进入');
          return false;
        }
        let res = await this.$api.getActiveDetailHttp({
          activityThemeId:this.acId
        });
        if(res.code === '0' && res.data){
          if(res.data.virtualJoinedNum<res.data.fullNum){
            // 是否已满团
            this.canBuy = true;
          }
          this.detailData = res.data;
          if(this.joinedNum<this.fullNum){}
          this.countTime(this.detailData.endDate);
          this.setActivityRule(res.data.activityRule);
        }
      },
      buyNow(){
        // 立即抢购
        if(!this.canBuy){
          return false;
        }
        if(this.detailData.activityThemeId){
          this.clearGoodsDetail();
          this.set_SelectedAddr(null);
          let params = {
            referrerUserId:this.$route.query.usi,
            recommendOrderId:this.$route.query.ori,
          };
          params = Object.assign(params,this.detailData);
          // this.setGoodsDetail(this.detailData);
          this.setGoodsDetail(params);
          this.goTo('/cashier');
        }
        else{
          this.toast('页面存在错误，请重新进入');
        }
      },
      goTo(link){
        this.$router.push(link);
      },
      // 时间倒计时
      countTime(endTime) {
        let nowTime = (new Date()).getTime();;
        let nt = endTime-nowTime;
        nt = nt/1000
        this.Countdown.hh = this.padStartValue(Math.floor(nt / 60 / 60));
        this.Countdown.mm = this.padStartValue(Math.floor((nt / 60) % 60));
        this.Countdown.ss = this.padStartValue(Math.floor(nt % 60));
        if (nt > 0) {
          setTimeout(() => {
            this.countTime(endTime);
          }, 1000);
        };
      },
      // 数字补全
      padStartValue(val) {
        return val >= 10 ? val : "0" + val;
      },
      ruleClick(val){
        this.ruleShower = !val;
      }
    }
  };
</script>
<style lang="scss" scoped>
@import "src/style/index.scss";
.detail{
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  .container{
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .info {
      background-color: #fff;
      .gradient {
        opacity: 0.34;
        background-image: linear-gradient(-180deg, rgba(255, 255, 255, 0.00) 41%, rgba(0, 0, 0, 0.11) 100%);
        width: 100%;
        height: 0.84rem;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 100;
      }
      .slide {
        width: 100%;
        overflow: hidden;
        padding-bottom: .3rem;
        position: relative;
        /deep/ .mint-swipe {
          width: 100%;
          & img {
            width: 100%;
            display: inline-block;
          }
        }
        .slide-item {
          position: absolute;
          bottom: .2rem;
          right: .3rem;
          width: 0.8rem;
          height: 0.42rem;
          display: -webkit-box;
          display: flex;
          -webkit-box-direction: normal;
          flex-wrap: nowrap;
          -webkit-box-align: center;
          align-items: center;
          -webkit-box-pack: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 0.8rem;
          color: #fff;
          font-size: 0.24rem;
          .curr-item {
            font-size: 0.3rem;
          }
        }
      }
      .pic-shower{
        height: 7.25rem;
        height: 7.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          width: 100%;
          display: block;
        }
      }
      .text {
        padding: .4rem .3rem .2rem .3rem;
        font-family: PingFangSC-Regular;
        position: relative;
        h4 {
          font-size: .32rem;
          color: #363636;
          font-weight: 600;
          line-height: 1.5;
        }
        .description {
          font-size: .24rem;
          color: #868686;
          margin-top: .1rem;
          line-height: 1.5;
        }
        .info{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .price {
            color: #f63337;
            margin-top: .2rem;
            font-weight: 600;
            line-height: 1;
            .symbol {
              font-size: 0.42rem;
            }
            .amount{
              display: flex;
              align-items: flex-end;
              justify-content: left;
              color: #f63337;
              font-size: .48rem;
              line-height: 1;
              & span{
                font-size: .3rem;
                line-height: 1;
              }
            }
            .origin {
              margin-top: .15rem;
              font-size: .24rem;
              color: #a8a8a8;
              font-weight: 500;
              text-decoration: line-through;
            }
          }
          .count-time {
            & p {
              color: #f63337;
              font-size: .24rem;
              margin-bottom: .14rem;
              text-align: center;
            }
            & ul {
              display: flex;
              align-items: center;
              justify-content: center;
              & li {
                line-height: 1;
                background: #363636;
                color: #fff;
                display: inline-block;
                border-radius: .06rem;
                padding: 3px 2px;
                font-size: .26rem;
              }
              & span {
                margin: 0 .04rem;
                font-size: .3rem;
                font-weight: 600;
              }
            }
          }
        }
        .bor-bot{
          border-bottom: 0.005rem solid #E5E5E5;
          height: .2rem;
        }
      }
    }
    .fr{
      float:right;
    }
    .progress{
      padding:.2rem 0.4rem;
      background: #fff;
      .description{
        color:#a8a8a8;
        font-size: 0.24rem;
      }
      .bor{
        width: 100%;
        height: 0.1rem;
        background:#F2F2F2;
        border-radius: 0.1rem ;
        overflow: hidden;
        margin: 0.2rem 0;
        .pro{
          height: 100%;
          background:#FF4B2F;
        }
      }
      .biger{
        font-size: 0.3rem;
      }
      .warm{
        color: #333333;
      }
      .qg-img{
        width: 1.12rem;
        height: auto;
      }
      .qg-txt{
        font-size: 0.24rem;
        font-weight: bold;
        line-height: 0.5rem;
      }
      .qg-warm{
        font-size: 0.22rem;
        color:#FF3B36;
      }
    }
  }
  .footer{
    flex-shrink: 0;
    min-height: 0.92rem;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    border-top: 0.005rem solid #e5e5e5;
    display: flex;
    flex-direction: row;
    border-top: 0.01rem #b1b1b1 solid;
    .cont-txt{
      width: 100%;
      box-sizing: border-box;
      padding: 0.3rem;
      color: #363636;
      vertical-align: middle;
      img{
        margin-left: .2rem;
      }
    }
    .cont-bnt{
      flex-shrink: 0;
      width: 3rem;
      height: .92rem;
      line-height: 0.92rem;
      text-align: center;
      color:#fff;
      background-color: #FF2929;
      font-size: 0.3rem;
    }
    .dis{
      background:#a8a8a8;
    }
  }
}
</style>

