<template>
<div class="inner-body">
  <div class="list-ul" v-if="listData && listData.length > 0">
    <div class="list-li" v-for="(item ,index) in listData" :key="index" @click="goBillDetail(item.id)">
      <p class="p1">{{item.loanAmt}}元</p>
      <p class="p2">{{showTimer(item.createDate)}}</p>
      <i class="icon"></i>
    </div>
  </div>
  <mt-popup v-model="popupVisible" class="detail" position="right">
    <div class="content">
      <p class="p-tt">还款支付详情</p>
      <div class="list-li">
        <p class="p1">还款金额</p>
        <p class="p2">1,233.00元</p>
      </div>
      <div class="list-li">
        <p class="p1">支付方式</p>
        <p class="p2">招商银行(3103)</p>
      </div>
      <div class="list-li">
        <p class="p1">借款单号</p>
        <p class="p2">1233445555</p>
      </div>
    </div>
    <i class="close-icon" @click="popupVisible = false"></i>
  </mt-popup>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage, timestampToTime} from '@/helpers/utils';
export default {
  components: {
  },
  data(){
    return{ 
      popupVisible: false,
      listData:null,
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
    this.getPageData();
  },
  mounted(){
  },
  methods:{
    async getPageData(){
      const params = {
        personId: this.personId,
        // personId: 263423,
        productCode: 'AMFT',
        orderType: 2,
        queryFlag: 3
      }
      const res = await this.$api.queryOrdersListHttp(params);
      if(res.code === 'sc0' && res.data && res.data.length > 0){
        this.listData = res.data;
      }
      else{
        if(!res.data || res.data.length < 1){
          this.$router.back();
          this.$toast('暂无还款记录');
        }
        else{
          this.$toast(res.message);
        }
      }
    },
    showTimer(str){
      return timestampToTime(str);
    },
    goBillDetail(id){
      // 去账单详情
      this.$router.push({
        path:'/repayment/detail',
        query:{
          originOrderId:id,
        }
      });
    },
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>// scoped
.inner-body{
  width: 100%;
  height: inherit;
  min-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .list-ul{
    background: #fff;
    padding-left: 0.3rem;
    .list-li{
      border-bottom: 1px solid #e5e5e5;
      padding-right: 0.3rem;
      display: flex;
      height: 1.5rem;
      align-items: center;
      .p1{
        width: 100%;
        font-size: 0.36rem;
        font-weight: 600;
      }
      .p2{
        flex-shrink: 0;
        font-size: 0.28rem;
        color: #a8a8a8;
        padding: 0 0.2rem;
      }
      .icon{
        flex-shrink: 0;
        width: 0.14rem;
        height: 0.22rem;
        background: url(./../../images/rower.png) center no-repeat;
        background-size: 100% auto;
      }
    }
  }
  .detail{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    .content{
      width: 100%;
      padding:0 0.8rem;
      .p-tt{
        font-size: 0.38rem;
        text-align: center;
        line-height: 0.52rem;
        font-weight: 400;
        padding: 1.84rem 0 0.4rem 0;
        border-bottom: 1px solid #e5e5e5;
        width: 100%;
        margin-bottom: 0.4rem;
      }
      .list-li{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.9rem;
        font-size: 0.3rem;
        .p2{
          color: #a8a8a8;
        }
      }
    }
    .close-icon{
      width: 0.42rem;
      height: 0.42rem;
      background: url(./../../images/close@2x.png) center no-repeat;
      background-size: 100% auto;
      margin: 1rem 0;
    }
  }
}
</style>


