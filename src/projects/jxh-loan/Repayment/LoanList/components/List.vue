<template>
<div class="repay-main">
  <div class="jyc-xjd">
    <div class="content-main">
      <div class="list-ul" v-if="listData && listData.length>0">
        <div class="list-li" v-for="(item ,index) in listData" :key="index">
          <div class="tp-msg" v-if="item.product ==='XYG'"> <!-- product=XYG 为信用购的订单 -->
            <div class="left-box">
              <div class="type-name">消费分期</div>
              <p class="p-col order">订单号 {{item.loanApplyNo}}</p>
              <p class="p-col">{{showTimer(item.createTime)}}</p>
            </div>
            <div class="right-box">
              <div class="money">¥{{item.loanAmount}}</div>
              <div class="s-btn" @click.stop="goToPatch(item.loanApplyNo,item.product)" v-if="item.status == 1000">前往开户</div>
              <div class="s-btn" @click.stop="goToContract(item.loanApplyNo)" v-else-if="item.status == 1020">确认合同</div>
              <div class="s-btn" @click.stop="goToReplenishMsg(item.loanApplyNo)" v-else-if="item.status == 1030">补传资料</div>
              <p class="p-col status-text" v-else>{{returnXygStatice(item.status)}}</p>
            </div>
          </div>
          <div class="tp-msg" v-else>
            <div class="left-box">
              <div class="type-name">现金分期</div>
              <p class="p-col order">订单号 {{item.mallOrderId}}</p>
              <p class="p-col">{{showTimer(item.createDate)}}</p>
            </div>
            <div class="right-box">
              <div class="money">¥{{item.loanAmt}}</div>
              <div class="s-btn" @click="goToPatch(item.mallOrderId,item.product)" v-if="item.orderStatus === '3' && item.isShowPatchButton">前往开户</div>
              <div class="s-btn" @click="goToLoan(item.mallOrderId,item.id,item.funding)" v-else-if="(item.orderStatus === '1' && item.isWithdrawal !== 'Y') || item.orderStatus === '53' || item.orderStatus === '50'">立即提现</div>
              <p class="p-col status-text" v-else>{{returnStatice(item.orderStatus, item.isWithdrawal)}}</p>
            </div>
          </div>
          <!--<p class="bnt" @click="goToDownLoad(item.mallOrderId)"  v-if="!isApp">请下载app进行还款</p>-->
          <!-- <p class="bnt" @click="goToPay(item.mallOrderId)" v-else-if="item.orderStatus === '7' && item.orderStatus !== '50'">开通提现加速会员，立即到账</p> -->
        </div>
      </div>
      <div class="list-ul-empty" v-else>
        <img src="./images/empty@2x.png">
        <p>暂无记录</p>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  import env from '@/helpers/env';
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage ,timestampToTime} from '@/helpers/utils';
import { type } from 'os';
export default {
  props: [
    'type'
  ],
  components: {
  },
  data(){
    return{
      tabHover:true,
      productEncash:0,
      ultimaEncash:0,
      listData:[],
      isApp:env.isJXHAPP(),
      total: 0,
    }
  },
  beforeMount(){
  },
  watch:{
    type:{
      handler:function(cos){
        this.getPageData();
      }
    }
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
    this.getPageData();
    this.getTotal()
  },
  mounted(){
  },
  methods:{
    ...mapActions('base', [
      'set_txUsableLimit'
    ]),
    //跳转到确认合同
      goToContract(orderNo){
        window.location.href = window.location.origin + '/custom-page/status-pages/#/jxh-contractList?orderNo='+orderNo;
      },
    //跳转到补存资料
      goToReplenishMsg(){
        window.location.href =  window.location.origin + '/custom-page/status-pages/#/jxh-messageCompleteInfo';
      },
      async getTotal(){
      // 获取全部待还
      if(!this.personId){
        this.$toast('用户未实名');
        return false;
      }
      let params = {
        personId: this.personId,
        businessType: 'JXH'
      };
      let res = await this.$api.queryXjdRemainSumAmtHttp(params);
      if(res.code === 'sc0'){
        this.total = res.data.remainSumAmt;
      }
      else{
        this.$toast(res.message);
      }
    },
    async getPageData(){
      const params = {
        personId: this.personId,
        productCode: 'JXH',
        orderType: 2,
        queryFlag: this.type
        // queryFlag: 1
      }
      const res = await this.$api.queryOrdersListHttp(params);
      if(res.code === 'sc0'){
        this.listData = res.data;
      }
      else{
        this.$toast(res.message);
      }
    },
    goLink(url) {
      // 跳转页面
      this.$router.replace(url);
    },
    goToDetail(id){
      this.$router.replace({
        path: '/loan-detail',
        query:{
          orderNo: id,
        }
      });
    },
    //信用购订单状态转义
    returnXygStatice(str){
      str = str*1;
      // 返回订单状态
      if(str === 60 || str === 70){
        return '审核中';
      }
      else if(str === 1050){
        return '放款成功';
      }else if(str === 1100){
        return '审核拒绝';
      }else if(str === 1200){
        return '已取消';
      }else if(str === 1300){
        return '退货中';
      }else if(str === 1310){
        return '已退货';
      }else if(str === 1320){
        return '退货失败';
      }else if(str === 1400){
        return '已结清';
      }
    },
    returnStatice(str, isWithdrawal){
      str = str*1;
      // 返回订单状态
      if(str === 0){
        return '预进件';
      }
      else if(str === 1 && isWithdrawal === 'Y'){
        return '提现成功';
      }
      else if(str === 1){
        return '放款成功';
      }
      else if(str === 2){
        return '放款失败';
      }
      else if(str === 3){
        return '放款中';
      }
      else if(str === 4){
        return '借款申请流程中被拒';
      }
      else if(str === 5){
        return '首付成功';
      }
      else if(str === 6){
        return '审核中';
      }
      else if(str === 7){
        return '审核通过';
      }
      else if(str === 8){
        return '审核拒绝';
      }
      else if(str === 10){
        return '放款失败';
      }
      else if(str === 11){
        return '提前还款';
      }
      else if(str === 12){
        return '逾期';
      }
      else if(str === 13){
        return '强制还款';
      }
      else if(str === 20){
        return '提前结清';
      }
      else if(str === 21){
        return '正常结清';
      }
      else if(str === 22){
        return '逾期结清';
      }
      else if(str === 23){
        return '强制结清';
      }
      else if(str === 31){
        return '初审通过';
      }
      else if(str === 32){
        return '初审拒绝';
      }
      else if(str === 41){
        return '授信申请流程中被拒';
      }
      else if(str === 50){
        return '提现中';
      }
      else if(str === 51){
        return '提现成功';
      }
      else if(str === 53){
        return '提现失败';
      }
      else if(str === 99){
        return '信用付全额退款';
      }
    },
    goToPay(orderNo){
      // 去借款详情
      this.goLink({
        path:'/result-pay',
        query:{
          lno:orderNo
        }
      });
    },
    showTimer(str){
      return timestampToTime(str,'ymd');
    },
    goToLoan(orderNo,id,funding){
      // 去提现
      this.goLink({
        path:'/result-loan',
        query:{
          mallOrderId:orderNo,
          loanOrderId:id,
          funding:funding
        }
      });
    },
    goToBind(orderNo){
      // 去提现
      this.goLink({
        path:'/bind-bank',
        query:{
          orderNo:orderNo,
        }
      });
    },
    async goToPatch(orderNo,product){
      let params = {
        orderNo: orderNo
      }
      if(product === 'XYG'){
        const res = await this.$api.jxhGetAvailableFundList(params);
        if(res.result === 'success'){
          if(Array.isArray(res.data.funds)){
            if(res.data.funds.length > 2){  //因为返回的数据固定有一个空资方，所以判断资方数量要加1
              // 开户列表
              this.goLink({
                path:'/patch',
                query:{
                  mallOrderId:orderNo,
                  product: product,
                  isSingleFunding: false //是否单资方绑卡
                }
              });
            }else{
              //单个资方跳转单一绑卡页面
              this.goLink({
                path:'/bind-bank',
                query:{
                  orderNo:res.data.orderNo,
                  product:product,
                  funding: res.data.funds[0].channelCode,
                  isSingleFunding: true, //是否单资方绑卡
                }
              });
            }
          }
        }
        else{
          this.$toast(res.message);
        }
      }else{
        this.goLink({
          path:'/patch',
          query:{
            mallOrderId:orderNo,
          }
        });
      }
    },
    goBillDetail(id,product){
      // 去账单详情
      this.$router.replace({
        path:'/repayment/detail',
        query:{
          originOrderId:id,
          product:product,
        }
      });
    },
    goWhere(item){
        // if (this.type === 1) {
        //   if(env.isJXHAPP()){
        //     this.goBillDetail(item.id)
        //   }else{
        //     return false
        //   }
        // }
        // else {
        //   this.goToDetail(item.mallOrderId)
        // }
        this.goBillDetail(item.id,item.product);
    },
    goToDownLoad(){
      window.location.href = "http://jxh.dafysz.cn/jxh-download/"
    }
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss" scoped>// scoped
.repay-main{
  height: inherit;
  min-height: 100%;
    .repay-top-box{
        color: #363636;
        background-color: #fff;
        width: 100%;
        padding: .57rem 0 .47rem 0;
        text-align: center;
        margin-bottom: 0.2rem;
        .repay-text{
            font-size: 0.3rem;
            margin-bottom: 0.3rem;
        }
        .total-num{
            font-size: 0.6rem;
            font-weight: bold;
        }
    }
    .repay-list-box{
        background-color: #fff;
        padding-left: 0.3rem;
        .repay-item{
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #E5E5E5;
            // padding-right: 0.3rem;
            padding: 0.3rem 0.3rem 0.3rem 0;
            .gray{
                color:#A8A8A8;
            }
            .s-text{
                font-size: 0.22rem;
            }
            .m-text{
                color:#363636;
                font-size: 0.3rem;
            }
            .m-b{
                margin-bottom: 0.1rem;
            }
            .item-left{
                width: 60%;
                .overtime{
                    width: 0.92rem;
                    height: 0.32rem;
                    flex-shrink: 0;
                    background: url(./images/yuqi.png)  no-repeat;
                    background-size: 100%;
                    display: inline-block;
                    color: #fff;
                    font-size: 0.22rem;
                    margin-left: 0.11rem;
                    text-align: center;
                    line-height: 0.32rem;
                }
            }
            .item-right{
                display: flex;
                align-items: center;
                text-align: center;
            }
            .arrow{
                width: 0.14rem;
                height: 0.22rem;
                flex-shrink: 0;
                background: url(./../../../images/rower@2x.png) center no-repeat;
                background-size: 100% auto;
                margin-left: 0.1rem;
                display: block;
            }
        }

    }

  .jyc-xjd{
    width: 100%;
    height: inherit;
    min-height: 100%;
    .content-main{
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      .list-ul{
        padding-left: 0.32rem;
        background: #fff;
        .list-li{
          background: #fff;
          border-bottom: 1px solid #eee;
          align-items: center;
          padding: 0.32rem 0.32rem 0.32rem 0;
          .tp-msg{
              display: flex;
              align-items: center;
              justify-content: space-between;
            .left-box{
              font-size: 0.32rem;
              color:#363636;
              .type-name{
                font-weight: 600;
                margin-bottom: 0.12rem;
              }
              .order{
                margin-bottom: 0.12rem;
              }
            }
            .right-box{
              .money{
                font-size: 0.32rem;
                font-weight: 600;
                margin-bottom: 0.12rem;
                padding-left: 0.16rem;
                text-align: right;
              }
              .status-text{
                 margin-top: 0.54rem;
                 text-align: right;
              }
              .s-btn{
                width:1.6rem;
                height:0.6rem;
                background-color: #BA9950;
                border-radius:0.3rem;
                line-height: 0.6rem;
                text-align: center;
                font-size: 0.26rem;
                color: #fff;
                margin-top: 0.32rem;
              }
            }
            .p-col{
              font-size: 0.24rem;
              color: #A8A8A8;
              line-height: 0.34rem;
            }
            .st{
              flex-shrink: 0;
              text-align: right;
            }
            .arrow{
              width: 0.14rem;
              height: 0.22rem;
              flex-shrink: 0;
              background: url(./../../../images/rower@2x.png) center no-repeat;
              background-size: 100% auto;
              margin-left: 0.2rem;
            }
          }
          .msg{
            width: 100%;
            padding-right:0.2rem;
            .p1{
              font-size: 0.32rem;
              color: #363636;
              line-height: 0.44rem;
              margin-bottom: 0.04rem;
              font-weight: 500;
            }
          }
          .bnt{
            flex-shrink: 0;
            width: 6.86rem;
            height: 0.88rem;
            text-align: center;
            line-height: 0.88rem;
            border-radius: 0.44rem;
            background-color: #BA9950;
            color: #fff;
            font-size: 0.32rem;
            margin-top: 0.3rem;
          }
        }
      }
      .list-ul-empty{
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 3.4rem 0;
        img{
          width: 2.1rem;
          height: auto;
        }
        p{
          color: #a8a8a8;
          line-height: 0.42rem;
          padding-top: 0.2rem;
          font-size: 0.3rem;
        }
      }
    }
    .footer{
      text-align: center;
      flex-shrink: 0;
      height: 0.98rem;
      line-height: 0.98rem;
      .sp{
        color: #D1A056;
        margin: 0 0.1rem;
        font-size: 0.24rem;
      }
    }
  }
}

</style>


