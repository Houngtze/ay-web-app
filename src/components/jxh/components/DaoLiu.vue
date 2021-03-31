<template>
<div class="result-main">
  <div class="result-failed">
    <div class="daoliu-box">
      <div class="more-button" @click="linkTap">
        <div class="top">查看更多</div>
        <div class="bottom">(高通过率借款产品)</div>
      </div>
      <mt-loadmore  :autoFill="false" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"  :bottomDistance="20" ref="loadmore">
        <div class="daoliu-item"  v-for="(item,index) in cooperatorData" :key="'daoliu'+index">
          <div class="daoliu-item-top">
            <div class="left-box">
              <div class="logo-box">
                <img v-lazy="item.logUrl">
                <div class="logo-title">
                  <div class="title">{{item.pruductName}}</div>
                </div>
              </div>
              <div class="content">{{item.propaganda}}</div>
            </div>
            <div>
               <div class="num">{{item.realApplyNum}}人已申请</div>
            </div>
          </div>
          <div class="daoliu-item-bottom">
            <div class="data-item">
              <div class="data-num">{{handleNum(item.minQuota)}}-{{handleNum(item.maxQuota)}}K</div>
              <div class="data-title">参考额度(元)</div>
            </div>
            <div class="data-item">
              <div class="data-num">{{item.dayRate}}</div>
              <div class="data-title">参考日利率</div>
            </div>
              <div class="sq-button" @click="statisticsRequest(item.id,item.redirectUrl)">申请</div>
          </div>
        </div>
        </mt-loadmore>
        <p v-show="allLoaded" class="no-more">没有更多数据</p>
    </div>
  </div>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
export default {
  components: {
  },
  data(){
    return{
      allLoaded:false,
      cooperatorData: [],
      pageSize: 10,
      pageNum: 1,
      hasOrder: false,
    }
  },
  beforeMount(){
  },
  watch:{
  },
  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      personId: state => state.global.userInfo.idPerson,
    }),
  },
  mounted(){
    this.getLoanCooperationOrgan()
  },
  methods:{
      //流量统计
    async statisticsRequest(id,url){
        const params = {
            cid: id
        };
        const res = await this.$api.statisticsRequestTraffic(params);
        if(url){
            window.location.href = 'https://juejin.im/timeline'
        }
    },
    handleNum(num){
      return num/1000
    },
  async getLoanCooperationOrgan(){
    const params = {
      pageSize: this.pageSize,
      pageNum: this.pageNum,
    };
    const res = await this.$api.getLoanCooperationOrgan(params);
    let data = res.data;
    if(res.result === 'success' && res.data){
        if(this.pageNum == 1){
            if(res.data.length>0){
                this.hasOrder = false
                if(data.length == this.pageSize){
                    this.cooperatorData = data
                }else{
                    this.cooperatorData = data
                    this.allLoaded = true;
                }
            }else{
                    this.hasOrder = true
            }     
        }else{
            if(data.length == this.pageSize){							
                this.cooperatorData = [...this.cooperatorData,...data]
            }else{
                this.cooperatorData = [...this.cooperatorData,...data]
                this.allLoaded = true;
            }
        }        
    }

  }, 
    loadBottom() {
        this.pageNum =  this.pageNum + 1;
        this.getLoanCooperationOrgan()
        this.$refs.loadmore.onBottomLoaded();
    },
    linkTap(){
      window.location.href = window.location.origin + '/custom-page/promote-tool/#/login?source=jyc_dc';
    }
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss" scoped>// scoped
.result-main{
  height: 100%;
    .result-failed{
        .failed-msg{
            padding: 0.4rem 0.82rem 0.43rem 0.82rem;
            background-color: #fff;
            margin-bottom: 0.3rem;
            text-align: center;
            .icon-box{
                margin-bottom: 0.24rem;
                img{
                    width: 1.5rem;
                    height: 1.5rem;
                }
            }
            .text-wait{
              color: #363636;
              font-size: 0.3rem;
              margin-bottom: 0.24rem;
            }
            .text{
              color: #A8A8A8;
              font-size: 0.24rem;
            }
        }
        .daoliu-box{
          // overflow: scroll;
          padding-bottom: 0.25rem;
          height:100vh;
          .no-more{
            text-align: center;
            margin-top: 0.15rem;
            margin-bottom: 0.15rem;
          }
          .more-button{
            width:6.86rem;
            height:0.9rem;
            background-color: #BA9950;
            border-radius:0.44rem;
            color: #fff;
            text-align: center;
            margin: 0 auto;
            margin-bottom: 0.8rem;
            padding-top: 0.06rem;
            .top{
              font-size: 0.32rem;
              line-height:0.44rem
            }
            .bottom{
              font-size: 0.22rem;
              font-weight:400;
              line-height: 0.32rem;
            }
          }
          .daoliu-item{
            background-color: #fff;
            width: 6.9rem;
            min-height: 3.06rem;
            margin: 0 auto;
            margin-bottom: 0.32rem;
            padding: 0.32rem;
            box-shadow:0px 1px 3px 0px rgba(0, 0, 0, 0.2);
            .daoliu-item-top{
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.4rem;
              .num{
                font-size: 0.22rem;
                color:#A8A8A8;
              }
              .logo-box{
                  display: flex;
                  align-items: center;
                  margin-bottom: 0.24rem;
                img{
                  width: 0.48rem;
                  height: 0.48rem;
                }
                .logo-title{
                    margin-left: 0.16rem;
                  .title{
                    color: #363636;
                    font-size: 0.32rem;
                    font-weight: 600;
                  }
                  .content{
                    color: #363636;
                    font-size: 0.24rem;                   
                  }
                }
              }
            }
            .gray-line{
              width:6.7rem;
              height:1px;
              background:rgba(237,241,242,1);
              margin: 0 auto;
            }
            .daoliu-item-bottom{
              display: flex;
              align-items: center;
              justify-content: space-between;
              .sq-button{
                width:1.80rem;
                height:.72rem;
                background-color:#BA9950;
                border-radius:.36rem;
                line-height: .72rem;
                color:#FFFFFF;
                text-align: center;
                font-size: 0.32rem;
              }
              .data-item{
                text-align: center;
                .data-title{
                    color: #A8A8A8;
                    font-size: 0.22rem;                     
                }
                .data-num{
                    color: #363636;
                    font-size: 0.48rem;
                    font-weight: 600;
                }
              }
            }
          }
        }

    }
}
</style>