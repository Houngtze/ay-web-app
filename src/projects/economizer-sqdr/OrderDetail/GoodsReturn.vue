<template>
  <div class="pub-page">
    <div class="container">
      <div class="bor">
        <i class="cir"></i>
        <span>截图扫码或搜索关注微信公众号【爱用有钱】</span>
      </div>
      <div class="bor">
        <i class="cir"></i>
        <span>在公众号回复【申请退款】，即可填写退货信息</span>
      </div>
      <div class="bor">
        <i class="cir"></i>
        <span>平台核实无误后将在7个工作日内退回用户账户</span>
      </div>
    </div>
    <div class="footer">
      <img src="./../images/er-code.png" class="pic">
      <p>以用情况不予办理退货退款：
        <br>1.用户已中奖，包含但不仅限于一等奖、二等奖等；
        <br>2.不符合退货规则的商品：如部分优惠券已使用等；
        <br>3.其他依法不应办理退货等情况；
        <br>4.该商品活动结束已超过30个工作日。
      </p>
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
    },
    mounted() {
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      goToPage(url){
        this.$router.push(url);
      },
      showModel(){
        this.modelShower = !this.modelShower;
        if(this.showModel){
          // 如果为显示弹框
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
@import "src/style/index.scss";
.pub-page{
  width: 100%;
  height: 100%;
  min-height: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:#fff;
  padding-bottom: 1.98rem;
  .container{
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding:0.4rem;
    .bor{
      border-left: 0.04rem solid #FF2929;
      height: 1.8rem;
    }
    .bor:last-child{
      border-left-color: #fff;
    }
    .txt{
      font-size: 0.3rem;
    }
    .cir{
      width: 0.4rem;
      height: 0.4rem;
      vertical-align: middle;
      margin-left: -0.2rem;
      margin-right: 0.2rem;
      border: 0.1rem solid #FFE9E9;
      border-radius: 0.4rem;
      display: inline-block;
      background: #FF2929;
    }
  }
  .footer{
    padding: 0.2rem;
    font-size: 0.2rem;
    color: #A8A8A8;
    line-height: 0.24rem;
    .pic{
      width: 1.48rem;
      height: 1.48rem;
      float:right;
    }
  }
}
</style>
<style lang="scss">
</style>

