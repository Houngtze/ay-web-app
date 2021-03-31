<template>
  <div :class="'vip-info ' + vipLevel">
    <div :class="'card-block ' + vipLevel">
      <!-- 会员样式 -->
      <template v-if="vipLevel !== 'default'">
        <div class="info">
          <img class="pic" src="../../images/icon_head@2x.png" alt="pic" />
          <section>
            <h3>
              <span>{{userName}}</span>
              <label v-if="isShowVipGift" @click="toSend">会员专属礼品<img src="../../images/icon-arrows-right.png" /></label>
            </h3>
            <img :src="levelImg" alt="level" class="level" />
          </section>
        </div>
        <div class="date">
          <p>预计节省<span>{{discountMoney}}</span>元 有效期至{{validDate}}</p>
          <button @click="toBuy">立即续费</button>
        </div>
      </template>
      <!-- 非会员样式 -->
      <template v-else>
        <div class="default-title">
          <div class="left">
            <img src="../../images/icon-member@2x.png" alt="member" />
            <span>Ai会员</span>
            <label>未开通</label>
          </div>
          <div class="right" @click="toSend">
            开通即送专属礼品<img src="../../images/icon-arrows-right.png" />
          </div>
        </div>
        <div class="default-content">
          <ul>
            <li>
              <img src="../../images/icon_off@2x.png">
              <h3>
                <label>全场5折起</label>
                <span>会员专享</span>
              </h3>
            </li>
            <li>
              <img src="../../images/icon_periodization@2x.png">
              <h3>
                分期通道推荐
                <span>精准推荐</span>
              </h3>
            </li>
          </ul>
        </div>
        <div class="default-button">
          <button @click="toBuy">立即领取</button>
        </div>
      </template>
    </div>
    <!-- 会员广告 -->

  </div>
</template>

<script>
  import {mapState} from 'vuex';
  export default {
    name: "vipInfo",
    props: ["data", "vipLevel"],
    computed: {
      ...mapState({
        userName: state => state.global.userInfo.userName
      }),
      ...mapState('vip', {
        pageData: state => state.vipData
      }),
      isShowVipGift() {
        return this.vipLevel === "seasonVip" || this.vipLevel === "yearVip"
      },
      discountMoney() {
        switch (this.vipLevel) {
          case "experienceVip":
            return "95";
            break;
          case "seasonVip":
            return "5707";
            break;
          case "yearVip":
            return "23784";
            break;
        }
      },
      levelImg() {
        switch (this.vipLevel) {
          case "experienceVip":
            return require("../../images/experience@2x.png");
            break;
          case "seasonVip":
            return require("../../images/season@2x.png");
            break;
          case "yearVip":
            return require("../../images/annual@2x.png");
            break;
        }
      },
      validDate() {
        return this.data && this.data.vip && this.data.validDate.replace("/", ".").replace("/", ".")
      },
    },
    methods: {
      toBuy() {
        this.$router.push({path: "/vip-pay"})
      },
      toSend() {
        if (this.vipLevel != 'default') {
          this.$router.push({path: "/send-gift"})
        } else {
          this.toBuy()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
 .vip-info{
   padding: .2rem 0;
   .card-block {
     width: auto;
     min-height: 2.8rem;
     background-size: 100% 100%;
     /* 默认样式 */
     &.default {
       background-image: url("http://static.ali.szqk-tech.com/images/custom-page/goodman-member/default-login-card.png");
       color: #F6DFB9;
       .default-title{
         display: flex;
         align-items: center;
         justify-content: space-between;
         padding: .2rem .24rem;
         .left{
           display: inline-flex;
           align-items: center;
           justify-content: left;
           img{
             width: .4rem;
             display: inline-block;
             margin-right: 0.03rem;
           }
           span{
             font-size: .26rem;
             margin-right: 0.08rem;
             line-height: 1;
           }
           label{
             font-size: .16rem;
             font-weight: 500;
             color: #2B251E;
             line-height: .22rem;
             padding: 0.02rem .08rem;
             background: #DCC6B0;
             border-radius: .15rem;
           }
         }
         .right{
           font-size: .24rem;
           display: inline-flex;
           align-items: center;
           white-space: nowrap;
           & img {
             height: .2rem;
             display: inline-block;
             margin-left: 0.04rem;
           }
         }
       }
       .default-content{
         padding: 0.08rem .86rem .32rem .86rem;
         ul{
           display: flex;
           align-items: center;
           justify-content: space-between;
           li{
             display: inline-flex;
             align-items: center;
             justify-content: left;
             flex-direction: row;
             img{
               width: .64rem;
             }
             h3{
               display: inline-flex;
               align-items: flex-start;
               justify-content: left;
               flex-direction: column;
               font-size: .28rem;
               text-align: left;
               padding-left: .1rem;
               span{
                 font-size: .2rem;
                 color: #B9AC97;
               }
             }
           }
         }
       }
       .default-button{
         padding-bottom: .3rem;
         text-align: center;
         button{
           background: linear-gradient(90deg, #FBE8C8 0%, #F8DAA3 100%);
           border-radius: .34rem;
           line-height: .68rem;
           border: none;
           -webkit-appearance: none;
           font-size: .32rem;
           padding: 0 1.12rem;
           color: #111111;
           font-weight: 600;
         }
       }
     }
     /* vip样式 */
     &.experienceVip {
       background-image: url("http://static.ali.szqk-tech.com/images/custom-page/goodman-member/experience-card.png");
       color: #182434;
       & > .date button{
         color: #fff;
         background: linear-gradient(90deg, #DCC08F 0%, #C9A974 100%);
       }
     }
     &.seasonVip {
       background-image: url("http://static.ali.szqk-tech.com/images/custom-page/goodman-member/season-card.png");
       color: #182434;
       & > .date button{
          color: #fff;
         background: linear-gradient(90deg, #DCC08F 0%, #C9A974 100%);
       }
     }
     &.yearVip {
       background-image: url("http://static.ali.szqk-tech.com/images/custom-page/goodman-member/annual-card.png");
       color: #FAE5CC;
     }
     & .info {
       width: 100%;
       padding: .43rem .32rem .78rem .4rem;
       display: flex;
       align-items: center;
       justify-content: center;
       .pic{
         width: .76rem;
         display: inline-block;
         margin-right: 0.06rem;
       }
       section{
         flex: 1;
         padding-left: 0.06rem;
         & h3 {
           font-size: .28rem;
           line-height: .4rem;
           display: flex;
           align-items: center;
           justify-content: space-between;
           white-space: nowrap;
           label{
             font-size: .24rem;
             display: inline-block;
             align-items: center;
             white-space: nowrap;
             line-height: .24rem;
             & img {
               height: .2rem;
               line-height: .24rem;
               display: inline-block;
               margin-left: 0.04rem;
             }
           }
         }
         .level{
           width: 1.26rem;
           display: inline-block;
         }
       }
       & p {
         font-size: .24rem;
         line-height: .34rem;
       }
     }
     & .date{
       padding-left: .4rem;
       padding-right: .32rem;
       display: flex;
       align-items: center;
       justify-content: space-between;
       p{
         font-size: .22rem;
         span{
           font-size: .28rem;
           font-weight: 600;
         }
       }
       button{
         -webkit-appearance: none;
         border: none;
         line-height: .5rem;
         background: linear-gradient(90deg, #DCC08F 0%, #C9A974 100%);
         border-radius: .34rem;
         font-size: .24rem;
         color: #000;
         padding: 0 .2rem;
       }
     }
   }
 }
</style>
