<template>
  <div class="page-market">
    <div class="top-banner" v-if="pageData.credit_top">
      <img class="banner-img" src="./images/banner.png">
      <div class="banner-msg">
        <p class="msg">{{pageData.credit_top.subTitle}}</p>
        <p class="bnt" @click="checkJumpType(pageData.credit_top)">{{pageData.credit_top.title}}</p>
      </div>
    </div>
    <div class="sec-adv" v-if="pageData.credit_button.list && pageData.credit_button.list.length > 0">
      <div v-for="(item, index) in pageData.credit_button.list" :key="index" class="img" @click="checkJumpType(item)"><img :src="item.icon"></div>
    </div>

    <div class="list" v-if="pageData.credit_list.list && pageData.credit_list.list.length > 0">
      <p class="list-tt">{{pageData.credit_list.title}}</p>
      <div class="list-li" v-for="(item, index) in pageData.credit_list.list" :key="index">
        <div class="li-l">
          <div class="info">
            <img class="logo" :src="item.icon">
            <span class="name">{{item.name}}</span>
            <span class="tips">新品</span>
          </div>
          <p class="money">￥{{item.borrowLimit}}</p>
          <p class="msg">{{item.title}}</p>
        </div>
        <div class="li-r">
          <p class="num">{{item.passNum}}人已通过</p>
          <p class="bnt" @click="checkJumpType(item)">立即申请</p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <p>平台仅提供贷款搜索综合服务，具体是否成功以申请产品结果为准</p>
    </div>

    <div ref="formHtml" v-show="noShower" v-html="formInnerHtml"></div>
  </div>
</template>
<script>
import env from "@/helpers/env";
import {mapState, mapActions} from "vuex";
export default {
  data() {
    return {
      noShower: false,
      formInnerHtml: null,
      pageData:{
        credit_top: {
        },
        credit_button: {
          list: [],
        },
        credit_list: {
          list: [],
        }
      }
    };
  },
  computed: {
    ...mapState({
      isSign: state => state.global.sign.isSign,
      userId: state => state.global.sign.userId,
      ucAccountId: state => state.global.sign.ucAccountId,
      idPerson: state => state.global.sign.idPerson,
      identity: state => state.global.sign.identity,
      mobile: state => state.global.sign.mobile,
      name: state => state.global.sign.name,
    })
  },
  created() {
    this.getPageData();
  },
  methods: {
    async getPageData(){
      // 获取页面数据
      let param = {
      };
      const res = await this.$api.creditSuperMarketHttp(param);
      if(res.code === 'sc0'){
        if(res.data !== null){
          this.pageData = {...this.pageData, ...res.data};
        }
      }
    },
    // 验证是否登录或实名
    async checkedStatus(item) {
      if (item.needReal && !this.idPerson) {
        this.$router.push('/baseInfo');
        return false;
      } else {
        return true;
      }
    },
    async checkJumpType(item){
      // 判断跳转类型
      // 1 直接跳转 2 接口返回url跳转 3 接口返回form表单跳转'
      if(await this.checkedStatus(item)){
        if(item.jumpType === 1){
          this.linkTap(item.url);
        }
        else if(item.jumpType === 2){
          // 请求接口，需特殊处理
        }
        else if(item.jumpType === 3){
          // 提交form表单
          if(item.url !== '' && item.url !== null){
            this.formInnerHtml = item.url;
            this.$nextTick(() => {
              this.$refs.formSubmit.querySelector("form").submit();
            })
          }
        }
      }
    },
    linkTap(url){
      // 跳转外部链接
      window.location.href = url;
    }
  }
};
</script>
<style lang="scss" scoped>
.page-market{
  .top-banner{
    position: relative;
    z-index: 1;
    .banner-img{
      width: 100%;
      height: auto;
      position: relative;
      z-index: 1;
    }
    .banner-msg{
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      padding: 0 0.3rem;
      padding-top:3.6rem;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      .msg{
        width: 4.83rem;
        line-height: 0.65rem;
        text-align: center;
        color: #fff;
        font-size: 0.22rem;
      }
      .bnt{
        width: 1.92rem;
        height: 0.79rem;
        color: #5886FB;
        font-size: 0.3rem;
        line-height: 0.65rem;
        text-align: center;
        background: url(./images/tp-bnt.png) center no-repeat;
        background-size: 100% 100%;
        font-weight: bold;
      }
    }
  }
  .sec-adv{
    display: flex;
    justify-content: space-between;
    margin: 0.18rem 0;
    background:#fff;
    padding: 0.2rem 0.3rem;
    .img{
      width: 3.3rem;
      img{
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }
  .list{
    padding-left: 0.4rem;
    background: #fff;
    .list-tt{
      font-size: 0.32rem;
      font-weight: 500;
      height: 0.8rem;
      line-height: 0.8rem;
      border-bottom: 0.005rem solid #f3f3f3;
    }
    .list-li{
      border-bottom: 0.005rem solid #f3f3f3;
      padding: 0.2rem 0;
      padding-right: 0.4rem;
      display: flex;
      justify-content: space-between;
      .info{
        .logo{
          width: 0.5rem;
          height: 0.5rem;
          display: inline-block;
          vertical-align: middle;
        }
        .name{
          font-size: 0.3rem;
          color: #333;
          font-weight: 500;
          line-height: 0.5rem;
          vertical-align: middle;
          margin: 0 0.15rem;
        }
        .tips{
          font-size: 0.2rem;
          line-height: 0.28rem;
          color: #6C95FD;
          padding:0 0.15rem;
          border: 1px solid #6C95FD;
          display: inline-block;
          vertical-align: middle;
          border-radius: 0.15rem;
        }
      }
      .money{
        font-size: 0.32rem;
        line-height: 0.32rem;
        font-weight: 500;
        padding: 0.17rem 0;
      }
      .msg{
        color: #A8A8A8;
        font-size: 0.2rem;
        line-height: 0.2rem;
      }
      .li-r{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
      }
      .num{
        color: #A8A8A8;
        font-size: 0.2rem;
      }
      .bnt{
        width: 1.6rem;
        height: 0.6rem;
        color: #fff;
        background: #4F80FA;
        text-align: center;
        line-height: 0.6rem;
        font-size: 0.3rem;
        font-weight: 400;
        border-radius: 0.1rem;
      }
    }
  }
  .page-footer{
    text-align: center;
    height: 0.82rem;
    p{
      line-height: 0.82rem;
      color: #A8A8A8;
      font-size: 0.22rem;
    }
  }
}
</style>

