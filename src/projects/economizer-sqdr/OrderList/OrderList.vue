<template>
  <div class="economizer-order pub-page">
    <div class="address-line" @click="goToPage('/addr-list?add=true')">
      <i class="addr-icon"></i>
      <span class="addr-txt">收货地址</span>
    </div>
    <ul class="order-list mid-div" v-if="orderListData && orderListData.length>0">
      <li class="list-tips" v-for="(item,index) in orderListData" v-if="item.orderStatus != 5" :key="index" @click.stop="goDetail(item)">
        <p class="order-status">
          <span>时间：{{item.createTime | timestampToTime}}</span>
          <span>{{getStatus(0,item.orderStatus,item.chooseStatus, item.isShare)}}</span>
        </p>
        <div class="tips-content">
          <div class="content-img">
            <div class="img-tip">
              <img :src="item.activityPrice==1?require('../images/icon-yhq1.png'):require('../images/icon-yhq2.png')"  :onerror="defaultImg" alt="">
            </div>
            <!--<div class="img-tip">-->
              <!--<img :src="item.imgUrl2"  :onerror="defaultImg" alt="">-->
            <!--</div>-->
          </div>
          <div class="tips-title">
            <p>{{item.goodName}}</p>
            <p v-if="item.orderStatus==0 || item.orderStatus==1">{{item.invalidTime}}失效</p>
            <div class="pay-btn">
              <span v-if="item.orderStatus==2">参与码：{{item.codeList}}</span>
              <span :style="{'opacity':item.orderStatus == 2 && item.chooseStatus == 0 && item.isShare == 1?'0.5':''}"
                    @click.stop="goNext(item.orderStatus,item.chooseStatus,item.activityOrderId,item.activityThemeId,item.goodId, item)">
                {{getStatus(1,item.orderStatus,item.chooseStatus, item.isShare)}}
              </span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="mid-div no-msg" v-else>
      <img src="./../images/no-order.png">
      <p>您还没有相关的订单</p>
    </div>
    <div ref="fhtml" v-show="false" v-html="fhtml"></div>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from "vuex";
  import PubNav from "../components/PubNav";

  export default {
    components:{
      PubNav
    },
    data() {
      return {
        invalidTime: '',
        timer: null,
        orderListData: [],
        fhtml: '',
        defaultImg: 'this.src="' + require('../images/default.png') + '"',
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
        listData: state => state.orderList.orderList
      })
    },
    created() {
      this.getData();
    },
    mounted() {
    },
    methods: {
      ...mapActions(["save_OrderList", "setOrderDetail"]),
      async getData() {
        await this.save_OrderList({userId: this.userId, personId: this.idPerson});
        this.orderListData = JSON.parse(JSON.stringify(this.listData));
        if (this.orderListData && this.orderListData.length > 0) {
          this.orderListData.forEach((item) => {
            item.codeList = '';
            item.joinCodeList.forEach(val => {
              item.codeList += val.joinCode + ' ';
            });
          });
          this.orderListData.forEach((item) => {
            item.totalTime = item.createTime + 1800000 - (new Date()).getTime();
            if (item.totalTime < 0 && (item.orderStatus == 0 || item.orderStatus == 1)){
              item.orderStatus = 5;
            }
          });
          this.timer = setInterval(() => {
            this.orderListData.forEach((item) => {
              item.totalTime = item.createTime + 1800000 - (new Date()).getTime();
              // item.totalTime = item.createTime + 1800000 - (new Date()).getTime();
              if (item.totalTime > 0 && item.orderStatus != 5) {
                let m = Math.floor(item.totalTime / 1000 / 60 % 60);
                let s = Math.floor(item.totalTime / 1000 % 60);
                let mTime = m >= 10 ? m : `0${m}`;
                let sTime = s >= 10 ? s : `0${s}`;
                this.$set(item, 'invalidTime', `${mTime}:${sTime}`);
              }

              if (item.totalTime < 1000 && item.totalTime > 0) {
                this.save_OrderList({userId: this.userId, personId: this.idPerson});
              }
              if (item.totalTime < 0 && (item.orderStatus == 0 || item.orderStatus == 1)){
                item.orderStatus = 5;
              }
            });
          }, 1000);
        }
      },
      getStatus(type, orderStatus, chooseStatus, isShare) {
        // 识别状态
        if(chooseStatus === 2){
          return type === 1 ? '再次购买' : '已过期';
        }
        else if (orderStatus === 0 || orderStatus === 1) {
          // 支付中或待支付
          return type === 1 ? '继续支付' : '待支付';
        } else if (orderStatus === 2 && chooseStatus === 0) {
          // 支付成功 并 未开奖
          return type === 1 ? (isShare === 1 ? '等待开奖' : '立即分享') : (isShare === 1 ? '已分享' : '待分享');
        } else if (chooseStatus === 1 && orderStatus !== 5) {
          // 已开奖 并 不是已失效
          return type === 1 ? '查看结果' : '已开奖';
        } else if (orderStatus === 5) {
          // 已失效
          return type === 1 ? '再次购买' : '已失效';
        }
      },
      async goNext(orderStatus, chooseStatus, orderid, themeid, goodid, item) {
        // 跳转逻辑
        if(chooseStatus === 2){
          // 已过期
          this.$router.push({path: "/home"});
          return false;
        }
        else if (orderStatus == 0 || orderStatus == 1) {
          // 去支付
          let zfbParams = {
            userId: this.userId,
            platform: 'h5',
            activityThemeId: themeid,
            payChannel: 'ALIPAY_H5',
            activityOrderId: orderid,
            h5NotifyUrl: window.location.origin + '/custom-page/economizer-sqdr/#/success?themeId=' + themeid + '&orderId=' + orderid + '&goodId=' + goodid,
          };
          let goToZFB = await this.$api.payByAlipayHttp(zfbParams);
          if (goToZFB.code === '0') {
            if (goToZFB.data && goToZFB.data.formHtml && goToZFB.data.formHtml !== '') {
              this.fhtml = goToZFB.data.formHtml;
              setTimeout(() => {
                this.$refs.fhtml.firstChild.submit();
              }, 100)
            }
          }
          else {
            this.$toast({
              message: goToZFB.message,
              duration: 1500
            });
          }
        } else if (orderStatus == 2 && chooseStatus == 0) {
          if(item.isShare !=1){
            // 待分享
            this.$router.push({
              path:'/success',
              query:{
                themeId:themeid,
                orderId:orderid,
                goodId:goodid,
                isList:true,
              }
            })
          }
          else{
            this.goDetail(item);
          }
          return;
        } else if (chooseStatus == 1 && orderStatus !== 5) {
          this.$router.push({path: "/result", query: {orderid: orderid, themeid: themeid}});
        } else if (orderStatus == 5) {
          this.$router.push({path: "/home"});
        }
      },
      goDetail(item) {
        // this.setOrderDetail(item);
        this.$router.push({path: "/order-detail", query: {id: item.activityOrderId}});
      },
      goToPage(url){
        this.$router.push(url);
      },
    },
    beforeDestroy() {
      clearInterval(this.timer);
      this.timer = null;
    }
  };
</script>
<style lang="scss" scoped>
  @import "src/style/index.scss";
</style>
<style lang="scss">
.pub-page{
  display: flex;
  flex-direction:column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .mid-div{
    width: 100%;
    height: 100%;
    overflow-x:hidden;
    overflow-y:auto;
  }
  .no-msg{
    // background:url(./../images/no-order.png) center no-repeat;
    // background-size:20% auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2.74rem 0 0 0;
    img{
      width: 30%;
      height: auto;
    }
    p{
      font-size: 0.3rem;
      line-height: 1rem;
      color:#A8A8A8;
    }
  }
  .address-line{
    text-align: center;
    background:#fff;
    line-height: 0.6rem;
    flex-shrink: 0;
    margin-bottom: 0.15rem;
    .addr-icon{
      width: 0.28rem;
      height: 0.32rem;
      display: inline-block;
      background: url('./../images/addr.png') center no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
      margin-right: 0.2rem;
    }
    .addr-txt{
      font-size: 0.24rem;
      color:#363636;
    }
  }
}
  .economizer-order {
    font-family: 'PingFangSC';
    .order-list {
      li + li {
        margin-top: .2rem;
      }
    }
    .list-tips {
      padding: .14rem .3rem;
      background-color: #fff;
      .order-status {
        text-align: right;
        font-size: .22rem;
        display: flex;
        justify-content: space-between;
        margin-bottom: .14rem;
        color: #A8A8A8;
      }
      .tips-content {
        display: flex;
        justify-content: flex-start;
        .content-img {
          height: 1.6rem;
          display: flex;
          justify-content: space-between;
          margin-right: .2rem;
          .img-tip {
            width: 1.6rem;
            background-color: #FBFBFB;
            display: flex;
            align-items: center;
            img {
              width: 100%;
              display: inline-block;
            }
          }
        }
        .tips-title{
          flex: 1;
        }
        p {
          &:nth-child(1) {
            color: #363636;
            font-size: .28rem;
            min-height: .7rem;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          &:nth-child(2) {
            color: #A8A8A8;
            min-height: .35rem;
            font-size: .24rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .pay-btn {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
          span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
            &:first-child{
              flex: 1;
              max-width: 3rem;
              font-size: .24rem;
              color: #a8a8a8;
            }
            &:last-child{
              display: inline-block;
              color: rgba(255,136,133,1);
              font-size: .28rem;
              font-weight: 600;
              width: 1.6rem;
              height: .6rem;
              line-height: .6rem;
              text-align: center;
              border:1px solid rgba(255,136,133,1);
              border-radius: .3rem;
            }
          }
        }
      }
    }
  }
</style>

