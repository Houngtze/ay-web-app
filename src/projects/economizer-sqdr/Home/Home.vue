<template>
  <div class="economizer-home">
    <div class="home-container">
      <page-top></page-top>
      <div class="home-banner" v-if="bannerList && bannerList.length > 0">
        <!-- <img src="../images/banner.png" :onerror="defaultImg" alt=""> -->
        <mt-swipe :auto="4000" :showIndicators="bannerList && bannerList.length > 1">
          <mt-swipe-item v-for="(item,index) in bannerList" :key="index">
            <img :src="item.imgUrl" :onerror="defaultImg" alt="" @click="outLink(item.jumpUrl)">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="home-list" v-if="listData && listData.length">
        <div class="list-tips" v-for="item in listData" :key="item.id" @click="goToDetail(item.activityThemeId)">
          <div class="tips-img">
            <img :src="item.imgUrl" :onerror="defaultImg" alt="">
          </div>
          <div class="tips-content">
            <p>{{item.goodName}}</p>
            <p>{{item.virtualJoinedNum || 0}}/{{item.fullNum || 0}}人正在参与，就差你了</p>
            <div class="price">
              <p class="tips-price">
                ￥{{item.activityPrice}}
                <span class="tips-before_price">￥{{item.goodPrice}}</span>
              </p>
              <button class="luck-draw">免费领取</button>
            </div>
          </div>
        </div>
      </div>
      <div class="home-list-none" v-else>
        <img src="../images/home-list-default.png">
        <p>商品火速上架中，敬请期待</p>
      </div>
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
        listData: [],
        hadJoin: false,
        defaultImg: 'this.src="' + require('../images/default.png') + '"',
        bannerList:[],
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
        name: state => state.global.userInfo.name
      })
    },
    created() {
      this.getListData();
    },
    mounted() {
      // this.$messagebox({
      //   message: '活动升级优化中，敬请期待！',
      //   showCancelButton: false
      // }).then(async (val) => {
      //   if (val === 'confirm') {
      //     if (env.isApp()) {
      //       this.$nativeBridge.jumpToAppIndex()
      //     }
      //   }
      // });
    },
    methods: {
      ...mapActions(["save_ActivityList"]),
      toDetail(id) {
        this.$router.push({path: "/detail", query: {id}});
      },
      goOrderList() {
        if (this.hadJoin) {
          this.$router.push("/order");
        } else {
          return
        }
      },
      async getListData() {
        const listRes = await this.$api.getActivityList({});
        if (listRes.code === '0') {
          this.listData = listRes.data;
          this.save_ActivityList(this.listData);
        }
        const res = await this.$api.getOrderList({userId: this.userId, personId: this.idPerson});
        if (res.code === '0') {
          if (res.data) {
            if (res.data.list.length > 0) {
              this.hadJoin = true;
            } else {
              this.hadJoin = false;
            }
          }
        }
        let bannerData = await this.$api.queryAdertisingListHttp();
        if(bannerData.code === '0' && bannerData.data){
          this.bannerList = bannerData.data;
        }
      },
      goToDetail(acId) {
        // 去详情
        this.$router.push({
          path: '/detail', query: {
            acId
          }
        })
      },
      outLink(url){
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(url)){
          window.location.assign(url);
        }
        else{
          this.$router.push({
            path: '/img-shower', query: {
              url:encodeURI(url)
            }
          })
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "src/style/index.scss";
</style>
<style lang="scss">
  .economizer-home {
    .home-container {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .home-banner {
        width: 100%;
        height: 2.8rem;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .home-list {
        padding: .32rem .3rem;
        .list-tips {
          background-color: #fff;
          border-radius: .16rem;
          & + .list-tips {
            margin-top: .3rem;
          }
          .tips-img {
            width: 100%;
            height: 3.46rem;
            text-align: center;
            img {
              display: inline-block;
              height: 100%;
            }
          }
          .tips-content {
            width: 100%;
            padding: .3rem .24rem .3rem .32rem;
            p {
              &:nth-child(1) {
                font-size: .3rem;
                color: #363636;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
              }
              &:nth-child(2) {
                font-size: .24rem;
                color: #A8A8A8;
                margin-top: .2rem;
                margin-bottom: .3rem;
              }
            }
            .price {
              display: flex;
              align-items: center;
              justify-content: center;
              p {
                flex: 1;
                color: #FF4949;
                font-size: .5rem;
                margin-right: .12rem;
                .tips-before_price {
                  color: #A8A8A8;
                  font-size: .26rem;
                  text-decoration: line-through;
                }
              }
              .luck-draw {
                height: .6rem;
                width: 1.8rem;
                line-height: .6rem;
                border: none;
                text-align: center;
                background:linear-gradient(-90deg,rgba(255,41,41,1),rgba(255,76,47,1));
                color: #fff;
                border-radius: .3rem;
                margin-top: -0.1rem;
                font-size: .26rem;
              }
            }
          }
        }
      }
      .home-list-none{
        padding: 2.74rem 0 0 0;
        text-align: center;
        img{
          width: 1.6rem;
          display: inline-block;
        }
        p {
          color: #ccc;
          font-size: .3rem;
          line-height: .42rem;
          padding-top: .32rem;
          text-align: center;
        }
      }
    }
    .already-involved {
      flex-shrink: 0;
      height: 1.52rem;
      width: 100%;
      background-color: #fff;
      padding: .3rem;
      .already-btn {
        background-color: #FF2929;
        border-radius: .1rem;
        color: #fff;
        text-align: center;
        padding: .3rem 0;
        font-size: .36rem;
      }
    }
  }
</style>

