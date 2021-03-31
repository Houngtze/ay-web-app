<template>
  <div class="economizer-success">
    <div class="success-header">
      <div class="header-content">
        <p class="success-info">成功参与 等待开奖</p>
        <ul>
          <li>{{oTime}}</li>
          <span>:</span>
          <li>{{mTime}}</li>
          <span>:</span>
          <li>{{sTime}}</li>
        </ul>
        <p class="before-end">距离活动结束还有</p>
        <div class="code-info">
          <span>您的参与码为</span>
          <span>*具体中奖以编号为准</span>
        </div>
        <div class="order-code">
          <span v-for="(item,index) in joinCodeList" :key="index">({{index+1}}){{item.joinCode}}</span>
        </div>
        <div class="again-btn" @click="shareAct()">点击邀请获得更多参与码</div>
      </div>
      <p class="und-warm">每邀请一名好友，您额外获得1个参与码，邀请越多中奖概率越高！</p>
    </div>
    <div class="success-bottom">
      <div class="bottom-header">参与3次以上获奖概率在 99%以上</div>
      <ul class="bottom-list">
        <li class="list-tips" v-for="item in listData" :key="item.activityThemeId">
          <div class="tips-content">
            <div class="tips-img">
              <img v-lazy="item.imgUrl2" alt="">
            </div>
            <div class="tips-title">
              <p>{{item.goodName}}</p>
              <p>{{item.virtualJoinedNum}}/{{item.fullNum}}人正在参与，就差你了</p>
              <div class="tips-bottom">
                <span>￥{{item.activityPrice}}</span>
                <span @click="goBuy(item.activityThemeId)">免费领取</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="model-shower" v-show="modelShower">
      <div class="model-bg">
        <div class="tt">
          <i class="close-icon" @click="modelShower = false"></i>
        </div>
        <img src="./../images/share-sc.png">
        <p class="txt">恭喜你分享成功</p>
        <p class="bnt" @click="shareAct()">继续分享</p>
      </div>
    </div>
    <div class="model-shower" v-show="modelShowerShare">
      <div class="model-bg">
        <div class="tt">
          <i class="close-icon" @click="modelShowerShare = false"></i>
        </div>
        <img src="./../images/share-sc.png">
        <p class="txt">恭喜你助力成功</p>
        <span>继续分享可提高中奖率</span>
        <p class="bnt" @click="shareAct()">分享好友提高中奖率</p>
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
        joinCodeList: [],
        oTime: '00',
        mTime: '00',
        sTime: '00',
        timer: null,
        listData: '',
        modelShower:false,
        modelShowerShare: false,
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
      // this.getData();
      this.getPageData();
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      goPayAgin() {
        // this.$router.push("/home");
        this.modelShower = !this.modelShower;
        if(this.modelShower){
          // 如果显示
        }
      },
      goBuy(id) {
        this.$router.push({path: "/detail", query: {acId: id}});
      },
      async getPageData(){
        //新版用订单详情接口
        const res = await this.$api.queryOrderDetailHttp({
          userId: this.userId,
          activityOrderId: this.$route.query.orderId,
          // activityThemeId: this.$route.query.themeId,
          // goodId: this.$route.query.goodId
        });
        if (res.code === '0') {
          this.joinCodeList = res.data.joinCodeList;
          if(res.data.recommendOrderId && res.data.recommendOrderId !== null && !this.$route.query.isList){
            this.modelShowerShare = true;
          }
          this.timer = setInterval(() => {
            let totalTime = res.data.endDate - (new Date()).getTime();
            if (totalTime > 0) {
              totalTime--;
              let o = Math.floor(totalTime / 1000 / 60 / 60);
              let m = Math.floor(totalTime / 1000 / 60 % 60);
              let s = Math.floor(totalTime / 1000 % 60);
              this.oTime = o >= 10 ? o : `0${o}`;
              this.mTime = m >= 10 ? m : `0${m}`;
              this.sTime = s >= 10 ? s : `0${s}`;
            }
          }, 1000);
        }else {
          this.$toast(res.message)
          return
        }
        // 推荐活动
        const listRes = await this.$api.getActivityList({});
        if (listRes.code === '0') {
          this.listData = listRes.data;
        }else {
          this.$toast(listRes.message)
        }
      },
      async getData() {
        const res = await this.$api.getLotteryResult({
          userId: this.userId,
          activityOrderId: this.$route.query.orderId,
          activityThemeId: this.$route.query.themeId,
          goodId: this.$route.query.goodId
        });
        // const res = await this.$api.getLotteryResult({userId: 1510, activityOrderId: 1, activityThemeId: 1, goodId: 1});
        if (res.code === '0') {
          this.joinCodeList = res.data.joinCodeList;
          this.timer = setInterval(() => {
            let totalTime = res.data.openDate - (new Date()).getTime();
            if (totalTime > 0) {
              totalTime--;
              let o = Math.floor(totalTime / 1000 / 60 / 60);
              let m = Math.floor(totalTime / 1000 / 60 % 60);
              let s = Math.floor(totalTime / 1000 % 60);
              this.oTime = o >= 10 ? o : `0${o}`;
              this.mTime = m >= 10 ? m : `0${m}`;
              this.sTime = s >= 10 ? s : `0${s}`;
            }
          }, 1000);
        }else {
          this.$toast(res.message)
          return
        }
        const listRes = await this.$api.getActivityList({});
        if (listRes.code === '0') {
          this.listData = listRes.data;
        } else {
          this.$toast(listRes.message)
        }
      },
      shareAct(){
        // 分享
        let $that = this;
        // 关闭弹框
        if(env.isApp()){
          this.$nativeBridge.share({
            title: '就差你了！一起1元购，点击抢购>>',
            desc: '一元买iPhone手机，省钱聚划算',
            imgUrl: window.location.origin+'/custom-page/economizer-sqdr/static/sqdr-share.png',
            link: window.location.origin+'/custom-page/economizer-sqdr/#/share?usi='+this.userId+'&ori='+this.$route.query.orderId+'&pid='+this.$route.query.themeId,
            onSuccess(res) {
              // this.Toast('分享成功');
              $that.modelShower = !$that.modelShower;
              $that.$api.shareHttp({
                activityThemeId:$that.$route.query.themeId,
                userId:$that.userId,
                activityOrderId:$that.$route.query.orderId,
              });
            },
            onFailure(res) {
              this.Toast('分享失败');
            },
            onCancel(res) {
              this.Toast('取消分享');
            },
          });
        }
        else{
          this.Toast('请在爱用商城APP发起分享获得参与码');
        }
      },
      Toast(msg){
        //底部弹框
        this.$toast({
          message:msg,
          position:'bottom',
        });
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
  .economizer-success {
    color: #363636;
    .success-header {
      background-color: #fff;
      margin-bottom: .2rem;
      padding-bottom: .3rem;
      .header-content{
        padding: .5rem .3rem 0 .3rem;
      }
      .success-info {
        font-size: .48rem;
        margin: .2rem 0 .1rem;
        text-align: center;
        font-weight: 600;
      }
      .before-end {
        text-align: center;
        font-size: .2rem;
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
          padding: .14rem .1rem;
          font-size: .26rem;
        }
        & span {
          margin: 0 .04rem;
          font-size: .3rem;
          font-weight: 600;
        }
      }
      .code-info {
        display: flex;
        justify-content: space-between;
        margin: .5rem 0 .2rem;
        span {
          &:nth-child(1) {
            font-size: .3rem;
          }
          &:nth-child(2) {
            color: #FF3434;
            font-size: .22rem;
          }
        }
      }
      .order-code {
        font-size: .24rem;
        color: #A8A8A8;
        min-height: .95rem;
        /*overflow: hidden;*/
        margin-bottom: .2rem;
        span {
          margin-right: .2rem;
        }
      }
      .again-btn {
        border-radius: .1rem;
        color: #fff;
        text-align: center;
        background-color: #FF2929;
        font-size: .32rem;
        width: 6.9rem;
        height: .92rem;
        line-height: .92rem;
      }
      .und-warm{
        color:#aaaaaa;
        font-size:0.2rem;
        text-align: center;
        line-height: 0.42rem;
        line-height: 1.5;
        margin-top: .2rem;
      }
    }
    .success-bottom {
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
            .tips-title {
              width: 69%;
            }
            .tips-img {
              width: 2rem;
              height: 2rem;
              line-height: 2rem;
              background-color: #FBFBFB;
              margin-right: .2rem;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                display: inline-block;
                width: 2rem;
              }
            }
            p {
              &:nth-child(1) {
                color: #363636;
                font-size: .28rem;
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
                  background:linear-gradient(-90deg,rgba(255,41,41,1),rgba(255,76,47,1));
                  border-radius: .3rem;
                  height: .6rem;
                  width: 1.8rem;
                  line-height: .6rem;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
    .model-shower{
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      z-index: 103;
      top:0;
      left:0;
      width: 100%;
      height:100%;
      .model-bg{
        width: 5.6rem;
        height:4.14rem;
        background:#fff;
        border-radius: 0.2rem;
        text-align: center;
        position: relative;
        img{
          width: 1rem;
          height: 1rem;
          display: inline-block;
          margin:  .4rem 0 .28rem 0;
        }
        .txt{
          font-size: 0.36rem;
          font-weight: 600;
          color:#363636;
          line-height: 1;
          margin-bottom: 0.08rem;
        }
        span{
          display: inline-block;
          font-size: .26rem;
          color:rgba(168,168,168,1);
          margin-bottom: .2rem;
        }
        .bnt{
          width: 4.47rem;
          height: 1.27rem;
          background:rgba(255,255,255,1);
          border-radius: .26rem;
          background:url(./../images/share-btn.png) center no-repeat;
          background-size: 100% 100%;
          color: #fff;
          font-size:.32rem;
          text-align: center;
          padding-top: .25rem;
          display: inline-block;
        }
        .tt{
          width:100%;
        }
        .close-icon{
          position: absolute;
          top: .2rem;
          right: .2rem;
          width: 0.24rem;
          height: 0.24rem;
          display: inline-block;
          overflow: hidden;
          line-height: 0;
          background:url(./../images/close.png) center no-repeat;
          background-size: 95% auto;
        }
      }
    }
  }
</style>

