<template>
  <div class="main">
    <div class="card-warp">
      <div class="card-swipe-box">
        <mt-swipe :auto="5000" :speed="speed">
          <mt-swipe-item v-for="item in creditData.top.list" :key="item.id">
            <img :src="item.icon" @click="goLink(item.url)">
          </mt-swipe-item>
          <!-- <mt-swipe-item>
            <img src="./images/baoxian.png">
          </mt-swipe-item> -->
        </mt-swipe>
      </div>
    </div>
    <div class="hot-bank-warp">
      <div class="title-box">
        热门银行
      </div>
      <div class="bank-main">
        <div class="bank-item" v-for="item in bankLists" :key="'bank'+item.id" @click="goLink(item.url)">
          <img class="bank-icon" :src="item.icon">
          <div class="bank-name">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="credit-card-warp"> 
      <div class="title-box" style="margin-bottom: 0;">
        热门信用卡
      </div>
      <div class="creditcard-list">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  :bottomDistance="40" ref="loadmore">
          <div class="creditcard-item" v-for="(item,index) in cardLists " :key="'credit'+index">
            <div class="creditcard-icon">
              <img src="./images/test.jpg">
            </div>
            <div class="creditcard-text">
              <div class="credit-name">招行腾讯视频卡</div>
              <div class="credit-ul-box">
                <ul>
                  <li><i></i>新户刷卡达标 送6个月腾讯视频会员</li>
                  <li><i></i>新户达标领新秀丽双肩包</li>
                </ul>
              </div>
            </div>
          </div>          
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from 'vuex';
  import {redirectToLoginPage} from '@/helpers/utils';

  export default {
    components: {
      
    },
    data() {
      return {
        dd:1,
        bankLists:'',
        cardLists:6,
        allLoaded:false,
        swipeLists: '',
        creditData: {
          // top: {
          //   list:[]
          // }
        },
        speed: 1000,
      }
    },
    watch: {},
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        clientCode: state => state.global.clientCode,
        source: state => state.global.source,
      }),
    },
    created(){
       this.getData();
    },
    mounted() {
     
    },
    methods: {
      getData(){
        this.$api.applyCreditCard({}).then(res=>{
          if(res.result === 'success'){
            console.log(res.data)
            this.creditData = res.data
            this.bankLists = res.data.middle.list
            this.speed = Number(res.data.top.speed)
          
            // this.cardLists = res.data.middle.list
          }
			  })
      },
      loadBottom() {
        this.cardLists +=4;
        // this.$refs.loadmore.onBottomLoaded();
      },
      goLink(url) {
        // 跳转页面
        this.$router.push(url);
      },

    },
    beforeDestroy() {
      
    }
  }
</script>
<style lang="scss" scoped>
.main{
  padding-bottom: .2rem;
}
.card-warp{
  .card-swipe-box{
    width: 100%;
    height: 3rem;
    margin-bottom: 0.18rem;
    img{
      width: 100%;
      // height: 3rem;
    }
  }
}
.title-box{
    width: 100%;
    height: 1rem;
    display: flex;
    align-items: center;
    padding-left: 0.3rem;
    font-size: 0.34rem;
    color: #363636;
    border-bottom: 1px solid #E5E5E5;
    margin-bottom: 0.5rem;
  }
.hot-bank-warp{
  background-color: #fff;
  margin-bottom: 0.18rem;
  .bank-main{
    display: flex;
    flex-wrap: wrap;
    // padding-bottom: 0.45rem;
    padding: 0 0.2rem;
    .bank-item{
      width: 25%;
      // height: 1.7rem;
      display: flex;
      flex-direction: column;
      text-align: center;
      margin-bottom: 0.45rem;
      .bank-icon{
        width: 0.98rem;
        height: 0.98rem;
        margin-bottom: 0.12rem;
        display: block;
        margin: 0 auto;
      }
      .bank-name{
        font-size: 0.28rem;
        color: #363636;
      }
    }
  }
}
.credit-card-warp{
  background-color: #fff;
  .creditcard-list{
    padding-left: 0.3rem;
    .creditcard-item{
      width: 100%;
      min-height: 2.15rem;
      border-bottom: 1px solid #E5E5E5;
      display: flex;
      align-items: center;
      padding: 0.24rem 0;
      padding-right: 0.2rem;
      .creditcard-icon{
        margin-right: 0.48rem;
        img{
          width: 1.88rem;
          height: 1.16rem;
        }
      }
      .creditcard-text{
        .credit-name{
          font-size: 0.28rem;
          color: #363636;
          font-weight:bold;
        }
        .credit-ul-box{
          li{
            font-size: 0.24rem;
            color:#A8A8A8;
            margin-top: 0.15rem;
            i{
              width:.12rem;
              height:.12rem;
              background-color: #B1B1B1;
              border-radius:50%;
              margin-right: 0.11rem;
              display: inline-block;
            }
          }
        }
      }
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


