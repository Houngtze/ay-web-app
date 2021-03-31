<template>
<div class="jyc-xjd">
  <div class="content-main" v-html="showHtml">
  </div>
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
      showHtml:null,
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
    if(this.$route.query.index === '1'){
      // 开户
      this.getOpenUrl();
    }
    else if(this.$route.query.index === '2'){
      // 授权
      this.getAuthUrl();
    }
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
        personId: '1549156',
        // personId: this.personId,
        channel: "H5",
        successfulUrl:  window.location.origin + "/custom-page/jyc-xjd/#/patch?mallOrderId="+this.$route.query.mallOrderId, // 成功
        creditType: "SC"
      };
      const res = await this.$api.ersAccountHttp(params);
      if(res.code === 'sc0' && res.data){
        if(res.data.isOpen === '1'){
          this.$toast('该用户已开户');
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
          this.showHtml = res.data.url;

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
          this.showHtml = res.data.html;
        }
      }
      else{
        this.$toast(res.message);
      }
    },
    goLink(url) {
      this.$router.push(url);
    },
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


