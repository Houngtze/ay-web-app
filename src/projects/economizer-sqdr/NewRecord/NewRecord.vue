<template>
  <div class="pub-page">
    <div class="record-list">
      <div class="record-ul">
        <div class="record-li goods-li" v-for="(item, index) in pageData" :key="index" @click="showModel(item)">
          <div class="img-div"><img :src="item.imgUrl"></div>
          <div class="msg-div">
            <p class="tt">{{item.activityTheme}}</p>
            <p class="timer">揭晓时间：{{returnDate(item.openDate)}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="record-model" v-if="modelShower">
      <div class="r-m-bg">
        <div class="tt">
          <i class="close-icon" @click="modelShower = false"><img src="./../images/close.png"></i>
          <p>中奖名单公布</p>
        </div>
        <div class="mid-div">
          <div class="model-form">
            <p class="lab">商品名称：</p>
            <p class="txt">{{openData.activityTheme}}</p>
          </div>
          <div class="model-form">
            <p class="lab">揭晓时间：</p>
            <p class="txt">{{returnDate(openData.openDate)}}</p>
          </div>
          <table class="model-table">
            <tr class="tt">
              <th colspan="3">本期一等奖名单<span class="col">（{{openData.openResultList.length}}名）</span></th>
            </tr>
            <tr>
              <th>序号</th>
              <th>用户</th>
              <th>中奖编码</th>
            </tr>
            <tr v-for="(item,index) in openData.openResultList" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.userName}}</td>
              <td>{{item.joinCode}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
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
        modelShower:false,
        pageData:null,
        openData:{
          activityTheme:'',
          openDate:'',
          openResultList:[]
        },
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
        topData: state => state.top.topData,
      })
    },
    async created() {
      this.getPageData();
    },
    mounted() {
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      goToPage(url){
        this.$router.push(url);
      },
      async getPageData(){
        let pData = await this.$api.queryFinishedActivityListHttp();
        if(pData.code === '0'){
          this.pageData = pData.data;
        }
      },
      async showModel(item){
        this.modelShower = !this.modelShower;
        if(this.showModel){
          // 如果为显示弹框
          let opData = await this.$api.queryActivityResultHttp({
            userId:this.userId,
            activityThemeId:item.activityThemeId
          });
          if(opData.code === '0' && opData.data){
            this.openData = opData.data;
          }
        }
      },
      returnDate(time){
        let nd = new Date(time);
        return nd.getFullYear() +'-'+ (nd.getMonth()+1) +'-' + nd.getDate();
      }
    }
  };
</script>
<style lang="scss" scoped>
@import "src/style/index.scss";
.pub-page{
  display: flex;
  flex-direction:column;
  width: 100%;
  height: 100%;
  min-height: auto;
  overflow: hidden;
  padding-bottom: 1.98rem;
  .record-list{
    width: 100%;
    height: 100%;
    overflow-x:hidden;
    overflow-y:auto;
    padding: .3rem;
    .record-ul{
      display: flex;
      flex-wrap: wrap;
      // background: #fff;
    }
    .record-li{
      flex-shrink: 0;
      background:#fff;
      width: 3.35rem;
      height: 4.89rem;
      background:rgba(255,255,255,1);
      border-radius: .1rem;
      margin-right: .2rem;
      margin-bottom: .2rem;
    }
    .record-li:nth-child(2n){
      margin-right: 0;
    }
    .goods-li{
      .img-div{
        width: 100%;
        height: 3.35rem;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          width: 3.35rem;
          display: inline-block;
        }
      }
      .msg-div{
        width: 100%;
        padding:0.2rem;
        .tt{
          font-size: 0.26rem;
          color:#363636;
          height: 0.82rem;
          overflow: hidden;
        }
        .timer{
          font-size: 0.22rem;
          color:#a8a8a8;
        }
      }
    }
  }
  .record-model{
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
      height:5.2rem;
      background:#fff;
      border-radius:0.2rem;
      padding: 0 0.3rem;
      padding-bottom: 0.3rem;
      display: flex;
      flex-direction: column;
      .tt{
        text-align: center;
        font-size: 0.36rem;
        height: 1.15rem;
        line-height: .75rem;
        padding: 0.2rem 0;
        flex-shrink: 0;
        .close-icon{
          float:right;
          width: 0.24rem;
          height: 0.24rem;
          display: inline-block;
          overflow: hidden;
          line-height: 0;
          img{
            width: 100%;
          }
        }
      }
      .mid-div{
        height: 100%;
        min-height: inherit;
        overflow-x: hidden;
        overflow-y: auto;
      }
      .model-form{
        display: flex;
        padding-bottom: 0.1rem;
        font-size: 0.24rem;
        .lab{
          width: 1.3rem;
          flex-shrink: 0;
          color:#a8a8a8;
        }
        .txt{
          width: 100%;
          color:#363636;
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
          line-height: 0.5rem;
          border-right: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          font-size: 0.22rem;
        }
        .tt{
          color:#363636;
          font-size: 0.24rem;
        }
        .col{
          color:#FF4949;
        }
      }
    }
  }
}
</style>
<style lang="scss">
</style>

