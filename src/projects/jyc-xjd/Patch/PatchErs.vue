<template>
<div class="jyc-xjd">
  <div class="content-main">
    <div class="zjf-list" v-if="pageData">
      <div class="tt">
        <p class="p1" v-if="pageData.index === '0'">添加第一放款方</p>
        <p class="p1" v-if="pageData.index === '1'">添加第二放款方</p>
        <p class="p1" v-if="pageData.index === '2'">添加第三放款方</p>
        <p class="p2">添加成功后,您的放款成功率将提升90％</p>
      </div>
      <div class="zjf-ul">
        <div class="zjf-li">
          <i class="icon"><img src="./images/icon-a.png"></i>
          <div class="txt">
            <p class="p1">1.确认个人信息</p>
            <p class="p2">为了资金安全,请确认本人信息</p>
          </div>
          <div class="r-box">
            <p class="bnt" v-if="pageData.openStatus*1 === 0" @click="getOpenUrl">待完成</p>
            <p class="bnt end" v-else>已完成</p>
          </div>
        </div>
        <div class="zjf-li">
          <i class="icon"><img src="./images/icon-b.png"></i>
          <div class="txt">
            <p class="p1">2.提现授权</p>
            <p class="p2">完成授权后即可提现</p>
          </div>
          <div class="r-box">
            <p class="bnt end" v-if="pageData.openStatus*1 === 0">待完成</p>
            <p class="bnt" v-else-if="pageData.openStatus*1 === 1 && pageData.authStatus*1 === 0" @click="getAuthUrl()">待完成</p>
            <p class="bnt end" v-else>已完成</p>
          </div>
        </div>
      </div>
    </div>
    <div ref="postForm" v-show="false" v-if="formHtml" v-html="formHtml"></div>
  </div>
  <footer-link></footer-link>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import FooterLink from './../components/NewFooter';
import stepShower from './../Result/components/step';
import { setTimeout } from 'timers';
export default {
  components: {
    FooterLink,
    stepShower,
  },
  data(){
    return{
      pageData:this.$route.query || null,
      formHtml:null,
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
  created() {
  },
  mounted(){
  },
  methods:{
    ...mapActions('loan', [
      'clearData'
    ]),
    async getOpenUrl(){
      // 获取开户地址
      const params = {
        channelType: "ANDROID",
        returnUrl:  window.location.origin + "/custom-page/jyc-xjd/#/patch?mallOrderId="+this.$route.query.mallOrderId, // 失败
        personId: this.personId,
        funding: this.$route.query.fundingName,
        channel: "H5",
        successfulUrl:  window.location.origin + "/custom-page/jyc-xjd/#/patch?mallOrderId="+this.$route.query.mallOrderId, // 成功
        creditType: "SC"
      };
      const res = await this.$api.ersAccountHttp(params);
      if(res.code === 'sc0' && res.data){
        if(res.data.isOpen === '1'){
          this.$toast('该用户已授权');
          setTimeout(()=>{
            this.$router.push({
              path:'/patch',
              query:{
                mallOrderId: this.$route.query.mallOrderId
              }
            });
          },3000);
        }
        else{
          this.formHtml = res.data.url;
          this.$nextTick(() => {
            this.$refs.postForm.querySelector("form").submit();
          });
        }
      }
      else{
        this.$toast(res.message);
      }
    },
    async getAuthUrl(){
      // 获取二合一授权地址
      const params = {
        channelType: "ANDROID",
        returnUrl:  window.location.origin + "/custom-page/jyc-xjd/#/patch?mallOrderId="+this.$route.query.mallOrderId, // 失败
        personId: this.personId,
        channel: "H5",
        funding: this.$route.query.fundingName,
        successfulUrl:  window.location.origin + "/custom-page/jyc-xjd/#/patch?mallOrderId="+this.$route.query.mallOrderId, // 成功
        creditType: "SC"
      };
      const res = await this.$api.repayAuthHttp(params);
      if(res.code === 'sc0' && res.data){
        if(res.data.status === '1'){
          this.$toast('该用户已授权');
          setTimeout(()=>{
            this.$router.push({
              path:'/patch',
              query:{
                mallOrderId: this.$route.query.mallOrderId
              }
            });
          },3000);
        }
        else{
          this.formHtml = res.data.html;
          this.$nextTick(() => {
            this.$refs.postForm.querySelector("form").submit();
          });
          // this.$refs.postForm.querySelector("form").submit();
        }
      }
      else{
        this.$toast(res.message);
      }
    },
    goLink(url) {
      this.$router.push(url);
    },
    goToHtmlShower(index){
      this.$router.push({
        path:'/ers-html',
        query:{
          index,
          mallOrderId:this.$route.query.mallOrderId
        }
      });
    }
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>// scoped
.jyc-xjd{
  width: 100%;
  height: inherit;
  min-height: 100%;
  // background: #f2f2f2;
  color: #363636;
  .content-main{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    .static-msg{
      background: #fff;
      // border-bottom: 0.2rem solid #f2f2f2;
      text-align: center;
      padding-bottom: 0.2rem;
      margin-bottom: 0.2rem;
      overflow: hidden;
      img{
        width: 1.05rem;
        height: auto;
        display: block;
        margin: 0.4rem auto;
        margin-bottom: 0.24rem;
      }
      p{
        font-size: 0.28rem;
        line-height: 0.28rem;
        margin-bottom: 0.2rem;
      }
      .title{
        font-size: 0.4rem;
        line-height: 0.4rem;
        margin-bottom: 0.4rem;
      }
    }
    .zjf-list{
      background: #fff;
      // border-bottom: 0.2rem solid #f2f2f2;
      padding-bottom: 0.2rem;
      overflow: hidden;
      .tt{
        padding:0.3rem;
        border-bottom: 1px solid #eee;
        .p1{
          font-size: 0.36rem;
          line-height: 0.36rem;
          font-weight: bold;
          padding-bottom: 0.2rem;
        }
        .p2{
          font-size: 0.24rem;
          color: #D1A056;
          line-height: 0.24rem;
        }
      }
      .zjf-ul{
        padding-left: 0.3rem;
        .zjf-position{
          position: relative;
          z-index: 3;
          .mast{
            width: 0.67rem;
            height: 0.67rem;
            background: url(./images/mast.png) center no-repeat;
            background-size: 100% auto;
            position: absolute;
            top: 0;
            right: 0;
          }
        }
        .zjf-li{
          border-bottom: 1px solid #eee;
          display: flex;
          padding: 0.25rem 0;
          align-items: center;
          .r-box{
            width: 1.5rem;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            .bnt{
              width: 1.2rem;
              height: 0.6rem;
              text-align: center;
              line-height: 0.6rem;
              color: #fff;
              background: linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
              border-radius: 0.6rem;
            }
            .end{
              background: #DDDDDD;
            }
            .mast{
              width: 0.67rem;
              height: 0.67rem;
              background: url(./images/mast.png) center no-repeat;
              background-size: 100% auto;
            }
          }
          .txt{
            width: 100%;
            p{
              padding-bottom: 0.2rem;
            }
            p:last-child{
              padding-bottom: 0;
            }
            .p1{
              font-size: 0.3rem;
              line-height: 0.3rem;
            }
            .p2{
              font-size: 0.24rem;
              line-height: 0.24rem;
              color: #A8A8A8;
            }
            .p3{
              font-size: 0.24rem;
              line-height: 0.24rem;
              color: #D09E54;
            }
          }
          .icon{
            width: 0.5rem;
            height: 0.5rem;
            flex-shrink: 0;
            margin-right: 0.2rem;
          }
        }
      }
    }
    .bnt1{
      height: 0.92rem;
      // border: 0.05rem solid #D09E54;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      line-height: 0.91rem;
      color: #fff;
      font-size: 0.36rem;
      border-radius: 0.15rem;
      margin: 0.4rem 0.3rem 0.25rem 0.3rem;
      text-align: center;
    }
  }
}
</style>


