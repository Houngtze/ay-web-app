<template>
<div class="repayment-main">
    <div class="total-warp">
        <div class="total-qi">{{payReportData.interestList.length}}期共还金额(元)</div>
        <div class="total-num">{{payReportData.totalRepayAmt}}</div>
        <div class="other">(含费息<span class="other-pay">{{payReportData.totalInterest}}</span>元)</div>
    </div>
    <div class="list-warp">
        <div class="list-box">
            <div class="list-item" v-for="(item,index) in payReportData.interestList" :key="'list'+index">
                <div>
                    <div class="stap">[第{{(index > 8 ? '' : '0')+(index + 1)}}期]</div>
                    <div> <span class="date">{{item.payDate}}</span></div>
                </div>
                <div class="sum-box">
                    <span class="num">{{item.repayAmt}}</span>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {redirectToLoginPage} from '@/helpers/utils';
import env from '@/helpers/env';
import {session} from '@/helpers/storage';
export default {
  components: {
  },
  data(){
    return{
        payReportData: {
            interestList:[]
        },
    }
  },
  watch:{
  },
  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      personId: state => state.global.userInfo.idPerson,
      realName: state => state.global.userInfo.realName,
      ident: state => state.global.userInfo.ident,
    }),
  },
  created() {
      this.payReportData = session.get("payReportData") || {}
  },
  mounted(){
      
  },
  methods:{

  },
}
</script>
<style lang="scss" scoped>
.repayment-main{
    .total-warp{
        background-color: #fff;
        width: 100%;
        // height: 3.10rem;;
        color: #868686;
        padding: .48rem 0 .40rem 0;
        box-sizing: border-box;
        margin-bottom: .16rem;
        text-align: center;
        .total-qi{
            font-size: .28rem;
            margin-bottom: .08rem;
            color: #363636;
        }
        .total-num{
            color: #363636;
            font-size: .62rem;
            margin-bottom: .04rem;
            font-weight: 600;
        }
        .other{
             font-size: .28rem;
             color: #A8A8A8;
            .other-pay{
                color: #BA9950;
            }
        }

    }
    .list-warp{
        .list-box{
            background-color: #fff;
            margin: 0 auto;
            position: relative;
            padding-left: 0.32rem;
            .list-item{
                width: 100%;
                height: 1.6rem;
                border-bottom: 1px solid #EDF1F2;
                padding: 0.38rem 0.3rem 0.2rem 0rem;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .stap{
                font-size: 0.32rem;
                color:#363636;
                margin-bottom: 0.05rem;
            }
            .sum-box{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .num{
                    font-size: 0.40rem;
                    color:#363636;
                }

            }
            .date{
                font-size: 0.28rem;
                color:#A8A8A8;
            }
        }
    }
}
</style>


