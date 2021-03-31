<template>
  <div class="detail">
    <div class="container">
      <div class="info">
        <div class="pic-shower">
          <!-- <img :src="detailData.goodImgUrl" :onerror="defaultImg"> -->
          <img :src="detailData.imgUrl2" :onerror="defaultImg">
        </div>
        <div class="goods-msg">
          <p class="goods-title"><span class="fr col" style="font-size:0.22rem;" v-if="detailData.chooseStatus == 2" @click="goToPage('/goods-return')">申请退货</span>{{detailData.activityPrice}}元爱用商城优惠券 共<span class="col">{{detailData.goodCount}}</span>张
          </p>
          <p class="goods-des"><img class="t-icon" src="../images/icon-up.png">{{detailData.activityTheme}}</p>
          <p class="goods-warm">参与码：{{detailData.goodCount ? detailData.goodCount : 0}}/个</p>
        </div>
        <dl class="goods-li">
          <dt>时间</dt>
          <dd>{{detailData.createTime | timestampToTime}}</dd>
        </dl>
        <!-- <dl class="goods-li">
          <dt>参与码</dt>
          <dd>
            <span v-for="(item,index) in detailData.joinCodeList" :key="index">{{item.joinCode}}</span>
          </dd>
        </dl> -->
      </div>
      <p class="goods-count"><span class="fr col" @click="goToPage('/my-code')">参与码详情</span>累计参与码共<span class="col">{{detailData.joinCodeList ? detailData.joinCodeList.length : 0}}</span>个,邀请好友越多,中奖率越高</p>
      <div class="code-tab">
        <p :class="codeTab?'tab bor':'tab'" @click="codeTab=true">我的抢购记录</p>
        <p :class="codeTab?'tab':'tab bor'" @click="codeTab=false">我的邀请记录</p>
      </div>
      <div class="man-code" v-if="codeTab">
        <div class="man">
          <p class="count">{{detailData.orderStatus==2?detailData.activityPrice*detailData.goodCount:0}}</p>
          <p class="mark">抢购金额（元）</p>
        </div>
        <div class="code">
          <p class="count">{{detailData.orderStatus==2 ? detailData.goodCount : 0}}</p>
          <p class="mark">获得参与码（个）</p>
        </div>
      </div>
      <div class="man-code" v-if="!codeTab">
        <div class="man">
          <p class="count">{{detailData.inviteOrderList ? detailData.inviteOrderList.length : 0}}</p>
          <p class="mark">成功邀请（人）</p>
        </div>
        <div class="code">
          <p class="count">{{hasCount}}</p>
          <p class="mark">获得参与码（个）</p>
        </div>
      </div>
      <ul class="code-list" v-if="!codeTab">
        <li v-for="(item, index) in detailData.inviteOrderList" :key="index"><span class="fr">{{item.buyCount}}个参与码</span>{{item.userName}}</li>
      </ul>
    </div>
    <div class="footer">
      <p>具体中奖以官方公示为准，敬请期待</p>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from "vuex";
  import PageTop from "../components/PageTop";

  export default {
    components: {
      PageTop
    },
    data() {
      return {
        detailData: {
          activityOrderId: '',
          activityPrice: '',
          activityTheme: '',
          activityThemeId: '',
          createTime: '',
          endDate: '',
          goodId: '',
          goodName: '',
          imgUrl: '',
          joinCodeList: [],
          orderStatus: '',
          resultStatus: '',
          totalTime: '',
        },
        Countdown: {
          hh: '01',
          mm: '02',
          ss: '03',
        },
        screenWith: window.screen.width,
        defaultImg: 'this.src="' + require('../images/default.png') + '"',
        codeTab:true,
        hasCount: 0,
      };
    },
    filters: {
      timestampToTime(timestamp) {
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear();
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        let D = Number(date.getDate())>=10?date.getDate():`0${date.getDate()}`;
        let h = Number(date.getHours())>=10?date.getHours():`0${date.getHours()}`;
        let m = Number(date.getMinutes())>=10?date.getMinutes():`0${date.getMinutes()}`;
        let s = date.getSeconds();
        return  `${Y}-${M}-${D} ${h}:${m}`;
      }
    },
    computed: {
      ...mapState({
        isSign: state => state.global.userInfo.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state => state.global.userInfo.idPerson,
        identity: state => state.global.userInfo.identity,
        mobile: state => state.global.userInfo.mobile,
        name: state => state.global.userInfo.name,
        orderDetail: state => state.orderList.orderDetail,
      }),
    },
    created() {
      // this.detailData = this.orderDetail;
      this.getPageData();
    },
    mounted() {
    },
    methods: {
      ...mapActions(["save_OrderList", "setOrderDetail"]),
      handleSwipe(index) {
        this.slideIndex = index + 1
      },
      goToPage(url){
        this.$router.push(url);
      },
      async getPageData(){
        let pData = await this.$api.queryOrderDetailHttp({
          userId: this.userId,
          activityOrderId: this.$route.query.id,
        });
        if(pData.code === '0' && pData.data){
          this.setOrderDetail(pData.data);
          this.detailData = pData.data;
          // 获得参与码个数
          let count = 0 ;
          for(let i = 0 ; pData.data.inviteOrderList && i < pData.data.inviteOrderList.length ; i++){
            count = count + pData.data.inviteOrderList[i].buyCount;
          }
          this.hasCount = count;
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "src/style/index.scss";

  .detail {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    .container {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .col{
        color: #FF4949;
      }
      .info {
        background-color: #fff;
        padding: 0 0.3rem;
        .pic-shower {
          width: 100%;
          height: 7.5rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            max-height: 7.5rem;
          }
        }
        .goods-msg {
          margin-bottom: 0.25rem;
          .goods-title {
            color: #363636;
            font-size: 0.3rem;
            line-height: 0.7rem;
            .col {
              color: #FF2929;
            }
          }
          .goods-des {
            font-size: 0.24rem;
            color: #363636;
            line-height: 0.7rem;
            .t-icon {
              height: 0.3rem;
              width: auto;
              vertical-align: middle;
              display: inline-block;
              margin-right: 0.1rem;
            }
          }
          .goods-warm {
            line-height: 0.7rem;
            color: #a8a8a8;
            font-size: 0.24rem;
          }
        }
        .goods-li {
          border-top: 0.005rem solid #e5e5e5;
          height: 0.9rem;
          line-height: 0.9rem;
          display: flex;
          dt {
            width: 1.1rem;
            color: #a8a8a8;
            flex-shrink: 0;
          }
          span {
            margin-right: 0.1rem;
            display: inline-block;
          }
        }
      }
      .goods-count{
        border-top: 0.18rem solid #e5e5e5;
        border-bottom: 0.005rem solid #e5e5e5;
        font-size: 0.24rem;
        height: 1rem;
        line-height: 0.8rem;
        padding: 0 0.2rem;
      }
      .code-tab{
        height: 0.9rem;
        border-bottom: 0.005rem solid #e5e5e5;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .tab{
          font-size: 0.3rem;
        }
        .bor{
          border-bottom: 0.06rem solid #EE4646;
        }
      }
      .man-code{
        padding: 0.3rem 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .man,.code{
          width: 50%;
          text-align: center;
        }
        .code{
          border-left: 0.005rem solid #e5e5e5;
        }
        .count{
          font-size: 0.4rem;
          font-weight: bold;
        }
        .mark{
          font-size: 0.22rem;
          color:#A8A8A8;
        }
      }
      .code-list{
        li{
          padding: 0 0.3rem;
          font-size: 0.22rem;
          color: #868686;
          line-height: 0.6rem;
        }
        li:nth-child(2n){
          background: #FFFBFA;
        }
      }
      .fr {
        float: right;
      }
      .progress {
        padding: .2rem 0.4rem;
        background: #fff;
        .description {
          color: #a8a8a8;
          font-size: 0.24rem;
        }
        .bor {
          width: 100%;
          height: 0.1rem;
          background: #F2F2F2;
          border-radius: 0.1rem;
          overflow: hidden;
          margin: 0.2rem 0;
          .pro {
            height: 100%;
            background: #FF4B2F;
          }
        }
        .biger {
          font-size: 0.3rem;
        }
        .warm {
          color: #333333;
        }
      }
    }
    .footer {
      padding: 0.2rem 0.3rem;
      background: #fff;
      text-align: center;
      font-size: 0.24rem;
      color: #a8a8a8;
    }
  }
</style>
<style lang="scss">
</style>

