<template>
<div class="out-base-info">
  <div class="header">
    <img src="./images/banner@2x.png">
  </div>
  <div class="content-main">
    <base-info @submitForm="handlerSubmit"></base-info>
  </div>
</div>
</template>
<script>
import {mapState, mapActions} from 'vuex';
import {Toast} from 'mint-ui';
import {redirectToLoginPage} from '@/helpers/utils';
import baseInfo from '@/components/credit/BaseInfo/BaseInfo';
export default {
  components: {
    baseInfo
  },
  data(){
    return{
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
      clientCode: state => state.global.clientCode,
    }),
  },
  async created() {
  },
  mounted(){
  },
  methods:{
    async handlerSubmit(items){
      console.log(items);
      let params = {
        bankNo: items.bankCode,
        ident: items.code,
        name: items.name,
        phone: items.phone,
        smsCode: items.vCode,
        ucAccountId: this.ucAccountId,
        userId: this.userId,
        productType: 'AMFT',
        source:'QIAKE_SM',
      }
      const res = await this.$api.credit.realAuthen(params);
      
      if (res.code === 'sc0') {
        window.location.replace('/sale-m/18090500-zq.html#/');
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    }
  },
  beforeDestroy() {
  }
}
</script>
<style lang="scss" scoped>
.out-base-info{
  width: 100%;
  min-height: 100%;
  height: inherit;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .header{
    height: 2.82rem;
    flex-shrink: 0;
    overflow: hidden;
    img{
      width: 100%;
      height: auto;
    }
  }
  .content-main{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
    p{
      text-align: center;
    }
    .p1{
      padding-top: 1.19rem;
      color: #363636;
      font-size: 0.32rem;
    }
    .p2{
      font-size: 0.28rem;
      color: #A8A8A8;
      line-height: 0.5rem;
    }
    .p3{
      font-size: 1.2rem;
      color: #363636;
      line-height: 1.2rem;
      font-weight: 500;
      margin: 0.68rem 0;
    }
    .p4{
      font-size: 0.28rem;
      color: #A8A8A8;
    }
    .bnt1{
      width: 100%;
      height: 0.92rem;
      // border: 1px solid #D09E54;
      // background: #D09E54;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      line-height: 0.91rem;
      color: #fff;
      font-size: 0.36rem;
      border-radius: 0.15rem;
      margin-top: 1.39rem;
      // margin: 1.39rem 0;
    }
    .bnt2{
      width: 100%;
      height: 0.92rem;
      border: 1px solid #D09E54;
      background: #fff;
      line-height: 0.91rem;
      color: #D09E54;
      font-size: 0.36rem;
      border-radius: 0.15rem;
      margin-top: 0.4rem;
      margin-bottom: 1.39rem;
      display: flex;
      align-items: center;
      justify-content: center;
      .num{
        width: 0.4rem;
        height: 0.4rem;
        text-align: center;
        line-height: 0.4rem;
        color: #fff;
        background: #FF4545;
        border-radius: 50%;
        margin-left: 0.2rem;
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
    /deep/.mint-popup{
        border-radius: .1rem;
    }
    .popup-content{
        width: 5.6rem;
        text-align: center;
        padding: .4rem 0;
        img{
            width: 2.14rem;
            height: auto;
        }
        p{
            line-height: 1;
            &:nth-child(1){
                color: #363636;
                font-size: .36rem;
                font-weight: 600;
            }
            &:nth-child(2){
                color: #A8A8A8;
                font-size: .24rem;
                margin-top: .24rem;
                margin-bottom: .32rem;
            }
            &:nth-child(4){
                color: #363636;
                font-size: .3rem;
                margin-top: .08rem;
                margin-bottom: .2rem;
            }
            &:nth-child(5){
                color: #A8A8A8;
                font-size: .3rem;
            }
        }
    }
}
</style>


