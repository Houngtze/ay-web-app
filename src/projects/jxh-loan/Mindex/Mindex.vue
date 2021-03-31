<template>
    <div class="main">
      <div class="warp-header" :style="{'opacity': fixed ? 0.95: 1,'position': fixed? 'fixed': 'absolute'}" >
        <span class="w-title">借钱</span>
        <span class="re-href" @click="goBill">交易记录</span>
      </div>
      <div ref="mian" class="model">
        <div class="mian-warp">
          <div class="circle-box">
            <div class="circle">
              <div class="circle-tbox">
                <div class="circle-text">总额度(元)</div>
                <div class="circle-money">{{CreditLimitData.usableLimitTotal}}</div>
              </div>
            </div>
          </div>
          <div class="quota-box">
            <div class="quota-item-box">
                <p>{{CreditLimitData.usableLimitQx}}</p>
                <div class="quota-item-u">
                  <img src="./images/quota-l.png">
                  <span>借款可用额度(元)</span>
                </div>
            </div>
            <div class="line-box"></div>
            <div class="quota-item-box">
                <p>{{CreditLimitData.usableLimitXf}}</p>
                <div class="quota-item-u">
                  <img src="./images/quota-r.png">
                  <span>购物可用额度(元)</span>
                </div>
            </div>
          </div>
          <div class="button-box"   @click.passive="goLink('/home')" v-preventReClick>我要借钱</div>
        </div>
        <div class="service-warp" v-if="showBlock">
          <div class="title">专属服务</div>
          <div class="service-item-warp">
            <div class="service-item-box s-line-r s-line-b" @click="windowLink(creditTestLink)">
              <div class="s-text">
                <p>征信报告</p>
                <span>贷前必查</span>
              </div>
              <img src="./images/report.png">
            </div>
            <div class="service-item-box s-line-b" @click="windowLink(vipLink)">
              <div class="s-text">
                <p>会员权益</p>
                <span>最多省1596元</span>
              </div>
              <img src="./images/vip-service.png">
            </div>
            <div class="service-item-box s-line-r" @click="windowLink(cardLink)">
              <div class="s-text">
                <p>申请信用卡</p>
                <span>立即申请热门卡</span>
              </div>
              <img src="./images/card.png">
            </div>
            <div class="service-item-box" @click="windowLink(BXLink)">
              <div class="s-text">
                <p>保险保障</p>
                <span>意外险限时领取中</span>
              </div>
              <img src="./images/baoxian.png">
            </div>
          </div>
        </div>
        <div class="poster-box" v-if="advertisementData.imgUrl">
          <div class="poster-com">
            <img v-lazy="advertisementData.imgUrl" @click="linkAdvert">
          </div>
        </div>
      </div>

    </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from 'vuex';
  import {debounce} from '@/helpers/utils';

  export default {
    components: {

    },
    data() {
      return {
        cardLink:'https://www.icardfinancial.com/kaduofen_h5/app_cardhome.html?from=singlemessage&isappinstalled=0#/banka/home?qd=lvxinjituan',
        vipLink:  window.location.origin + '/custom-page/status-pages/#/jxh-vip-page',
        creditTestLink: 'https://m.tianxiaxinyong.cn/cooperation/crp-v2/index.html?channel=d1Fha1pvZHBvdWdleXJCNDN4d1V4Zz09',
        BXLink: 'https://aiyong.dafysz.cn/giveuMall/secondStore/release/PN00023030.html?bizType=PN00023030',
        advertisementData: '',
        CreditLimitData: {
          usableLimitTotal: '*****',
          usableLimitQx: '****',
          usableLimitXf: '****',
        },
        isJXHAPP: env.isJXHAPP(),
        fixed: false,
        scrollTopVal: 0,
        showBlock: false,
      }
    },
    watch: {},
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
        accountId: state => state.global.userInfo.accountId,
        clientCode: state => state.global.clientCode,
        source: state => state.global.source,
      }),
      ...mapState('credit', {
        creditStep: state => state.creditStep,
      }),
    },
    mounted() {
      if (this.userId) {
        this.getCreditStep();
        this.getCreditLimit();
      }
      this.getAdvertisement();
      window.addEventListener('scroll',debounce(this.handleScroll,30,true),true);

      this.isAppExaminingInMarket()
    },
    methods: {
      ...mapActions('credit', ['setCreditStep']),
      // 获取授信步骤
      async getCreditStep() {
        // 获取当前授信进度
        const param = {
          userId: this.userId,
          accountId: this.accountId
        };
        await this.setCreditStep(param);
      },
      //获取额度
      getCreditLimit(){
        let json = {
          userId: this.userId
        }
        this.$api.getCreditLimit(json).then(res=>{
          if(res.result === 'success'){
             this.CreditLimitData  = res.data;
          }else{
            this.CreditLimitData = {
              usableLimitTotal: '*****',
              usableLimitQx: '****',
              usableLimitXf: '****',
            }
          }
        });
      },
      //获取广告位
      getAdvertisement(){
        this.$api.toGetAdvertisement({code: "jxh_jQPage"}).then(res=>{
          if(res.result === 'success'){
             this.advertisementData = res.data;
          }
        });
      },
      //广告跳转
      linkAdvert(){
        if(!this.advertisementData.jumpType) {
          return;
        }
        if(this.advertisementData.jumpType == 9){
          window.location.href = this.advertisementData.jumpParam
        }else {
          this.$nativeBridge.jumpNativeForType(
            this.advertisementData.jumpType,
            this.advertisementData.jumpParam || "")
        }
      },
      goLink(url) {
        if(event.target.disabled){
          return
        }
        if (env.isJXHAPP()) {
          if (this.creditStep && this.creditStep.status === 1000) {
            this.$nativeBridge.pushAnimation({
              url: window.location.origin + '/custom-page/jxh-loan/#' + url
            })
          }  else {
            this.$nativeBridge.jumpNative('billToCredit');
          }
        } else {
          if (this.creditStep && this.creditStep.status !== 1000) {
            window.location.href = window.location.origin + '/custom-page/jxh-credit/#/home';
          }  else {
            this.$router.push(url);
          }
        }
      },
      windowLink(url) {
        if (env.isJXHAPP()) {
          this.$nativeBridge.pushAnimation({
            url: url
          })
        } else {
          window.location.href = url;
        }
      },
      goBill() {
        this.windowLink(window.location.origin + '/custom-page/bill-pages/#/aimanfen/jxh-bill');
      },
      handleScroll(e){
        this.scrollTopVal = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
        if(this.scrollTopVal <= 0){
          this.fixed = false;
        }else if(this.scrollTopVal > 0){
          this.fixed = true;
        }else{
           this.fixed = false;
        }
      },
      // 获取app是哪个平台
      getPlatform() {
        if (env.isJXHAPP()) {
          if (env.isIos()) {
            return "iOS"
          }
          if (env.isAndroid()) {
            return "Android"
          }
        }
      },
      // 获取app是否在应用市场审核
      isAppExaminingInMarket() {
        if (env.isJXHAPP()) {
          let parmar = {}
          if(env.isIos()) {
            parmar = {
              "key": "communication",
              "channel": "sc",
              "platform": "iOS"
            }
          }
          this.$api.base.getAppExaminingStatus(parmar, {
            platform: this.getPlatform()
          }).then(res => {
            if (res.code === "sc0") {
              /**
               *  isOpen【Boolean】
               *  true 显示正常；false 审核中
               */
              if (res.data.isOpen) this.showBlock =  res.data.isOpen
            } else {
              this.$toast(res.message)
            }
          })
        }
      }
    },
    beforeDestroy() {
      window.removeEventListener('scroll',this.handleScroll,true);
    }
  }
</script>
<style lang="scss" scoped>
.main{
  position: relative;
    .warp-header{
      position: fixed;
      top:0;
      text-align:center;
      width: 100%;
      height: .96rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    .w-title{
      font-size: .36rem;
      color: #333333;
      font-family: PingFangSC-Medium,PingFang SC;
      font-weight: 600;
    }
     .re-href{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: .32rem;
        font-size: .30rem;
        font-family: PingFangSC-Medium,PingFang SC;
        font-weight: 400;
         z-index: 99;
     }
  }
}
.model{
  padding-top: 0.96rem;
}
.mian-warp{
  width: 100%;
  background-color: #fff;
  padding: .28rem .28rem .32rem .28rem;
  margin-bottom: .16rem;
  .circle-box{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: .58rem;
    .circle{
      width: 3.86rem;
      height: 2.84rem;
      background-image: url('./images/circle.png');
      background-size: 100%;
      background-repeat: no-repeat;
      // position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .circle-tbox{
        text-align: center;
        padding-top: 0.6rem;
        .circle-text{
          font-size: .28rem;
        }
       .circle-money{
          font-size: .60rem;
          color:#363636;
          font-family: "TG-TYPE-Bold";
       }
      }
    }
  }
  .quota-box{
    display: flex;
    align-items: center;
    margin-bottom: .6rem;
    justify-content: center;
    p{
      font-size: .4rem;
      color: #363636;
    }
    .line-box{
      width: .02rem;
      height: .78rem;
      background-color: #EEEEEE;
    }
    .quota-item-box{
      width: 3.74rem;
      text-align: center;
      p{
        font-family: "TG-TYPE-Bold";
      }
      .quota-item-u{
        vertical-align: middle;
        img{
          width: .32rem;
          vertical-align: sub;
          margin-right: .05rem;
        }
        span{
          font-size: .26rem;
          color:#C9C9C9;
        }
      }
    }

  }
  .button-box{
    width: 4rem;
    height: .88rem;
    background-color: #BA9950;
    line-height: .88rem;
    font-size: .32rem;
    color:#fff;
    text-align: center;
    border-radius:.44rem;
    margin: 0 auto;
  }
}
.service-warp{
  padding: .32rem;
  width: 100%;
  background-color: #fff;
  margin-bottom: .16rem;
  .title{
    font-size: .32rem;
    color: #363636;
    margin-bottom: .32rem;
    font-weight: 600;
  }
  .service-item-warp{
      width:6.86rem;
      height:2.96rem;
      background:rgba(255,255,255,1);
      box-shadow:0px 4px 12px 0px rgba(0,0,0,0.04);
      border-radius:8px;
      border:1px solid rgba(238,238,238,1);
      display: flex;
      flex-wrap: wrap;
      margin: 0 auto;
        .s-line-r{
          border-right: 1px #EEEEEE solid;
        }
        .s-line-b{
           border-bottom: 1px #EEEEEE solid;
        }
      .service-item-box{
        width: 50%;
        height: 50%;
        display: flex;
        align-items: center;
        padding: .32rem;
        box-sizing: border-box;
        justify-content: space-between;
        .s-text{

        }
        img{
          width: .8rem;
        }
        p{
          font-size: .3rem;
          color: #363636;
        }
        span{
          color:#A8A8A8;
        }
      }
    }
}
.poster-box{
  width: 100%;
  background-color: #fff;
  padding: .32rem;
  .poster-com{
    width: 6.86rem;
    height: 1.76rem;
    margin: 0 auto;
    img{
      width: 6.86rem;
      height: 1.76rem;
      border-radius: 5px;
      object-fit: cover;
    }
  }
}
</style>
<style>
.mint-swipe-indicator{
  width: 8px!important;
  height: 4px!important;
  background-color: #FFF!important;
  border-radius: 5px!important;
  opacity: 1;
}
.mint-swipe-indicator.is-active{
  background-color: #BA9950!important;

}
</style>


