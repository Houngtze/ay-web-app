<template>
<div class="jyc-xjd">
  <ul class="list">
    <li v-for="(item, index) in bankListData" :key="index" @click="setBankInfo(item)">
      <img class="bg-img" :src="item.backgroundUrl">
      <div class="msg">
        <p class="dt">{{item.bankName}}</p>
        <p class="dd">储蓄卡</p>
        <p class="no">**** **** **** {{returnCardNo(item.bankNo)}}</p>
      </div>
      <!-- <div class="mr-bnt" v-if="item.isDefault === 1">
        <p>默认</p>
      </div> -->
    </li>
  </ul>
  <div class="bnt">
    <p @click="goToAdd"><i class="add-icon"></i>添加新的银行卡</p>
  </div>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import FooterLink from './../components/NewFooter'
export default {
  components: {
    FooterLink
  },
  data(){
    return{
      tabHover:true,
      bankListData:[],
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
      ucAccountId: state => state.global.userInfo.ucAccountId,
      clientCode: state => state.global.clientCode
    }),
  },
  created() {
    this.getBankList();
  },
  mounted(){
  },
  methods:{
    ...mapActions('base', [
      'set_bankInfo'
    ]),
    async getBankList() {
      // 获取银行卡列表
      const params = {
        idPerson: this.personId
      }
      const res = await this.$api.credit.getBankInfo(params);
      if(res.code === '0' || res.code === 'sc0'){
        if(res.data){
          this.bankListData = res.data.bankInfoList;
        }
      }
    },
    returnCardNo(str) {
      // 返回银行卡号码
      return str.substr(str.length-4);
    },
    goLink(url) {
      // 跳转页面
      this.$router.replace(url);
    },
    setBankInfo(item){
      this.set_bankInfo(item);
      if(this.$route.query.orderNo === 'loan'){
        this.goLink('loan')
        return false;
      }
      this.goLink({
        path:'bind-bank',
        query:{
          orderNo:this.$route.query.orderNo,
          funding:this.$route.query.funding,
        }
      });
    },
    goToAdd(){
      this.goLink({
        path:'/add-bank',
        query:{
          bu:'/bank-list?orderNo=' + this.$route.query.orderNo + '&funding=' + this.$route.query.funding,
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
  .list{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.3rem;
    li{
      width: 100%;
      height: 2.3rem;
      border-radius: 0.1rem;
      background-color: #a8a8a8;
      margin-bottom: 0.3rem;
      display: flex;
      padding: 0.3rem 0.3rem 0 0.36rem;
      position: relative;
      z-index: 1;
    }
    .icon-b{
      width: 0.75rem;
      height: 0.75rem;
      flex-shrink: 0;
    }
    .bg-img{
      width: 100%;
      height: 100%;
      position:absolute;
      top: 0;
      left: 0;
      z-index: 2;
    }
    .msg{
      width: 100%;
      color: #fff;
      padding-left: 0.95rem;
      position: relative;
      z-index: 3;
      .dt{
        font-size:0.32rem;
      }
      .dd{
        font-size: 0.22rem;
      }
      .no{
        font-size: 0.34rem;
        padding-top: 0.2rem;
      }
    }
    .mr-bnt{
      position: relative;
      z-index: 3;
      p{
        width: 0.6rem;
        height: 0.3rem;
        text-align: center;
        line-height: 0.3rem;
        border: 0.01rem solid #fff;
        border-radius: 0.3rem;
        font-size: 0.18rem;
        color: #fff;
      }
    }
  }
  .bnt{
    width: 100%;
    height: 1.4rem;
    padding: 0.2rem 0.3rem;
    flex-shrink: 0;
    p{
      width: 100%;
      height: 0.92rem;
      background: #D09E54;
      border-radius: 0.05rem;
      color:#fff;
      font-size: 0.36rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .add-icon{
      width: 0.32rem;
      height: 0.32rem;
      background: url(./../images/icon-add.png) center no-repeat;
      background-size: 100% auto;
      margin-right: 0.2rem;
    }
  }
}
</style>


