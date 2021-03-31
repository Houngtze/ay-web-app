<template>
  <SalePageLayout :isFullScreen="true">
    <ai-template :message="pageMessage">
      <template slot="image">
        <div class="timer-div">
          <img src="./image/audit@2x.png" srcset="./image/audit@3x.png">
          <p class="timer">{{timer}}</p>
        </div>
      </template>
      <template slot="dec">
        <p class="warning">您提交的信息正在加速审核，请耐心等待</p>
      </template>
      <template slot="bottom"> 
        <div class="buttom">
          <p @click="getResult">刷新结果</p>
        </div>
      </template>
    </ai-template>
  </SalePageLayout>
</template>
<script>
import SalePageLayout from '@/components/SalePageLayout';
import AiTemplate from '../components/template'
import { mapState, mapActions } from "vuex";
export default {
  components: {
    AiTemplate,
    SalePageLayout
  },
  data() {
    return {
      pageMessage:'加速审核中',
      timer:10,
      setTimer:'',
      phone:'',
      userId:'',
    }
  },
  computed:{
    ...mapState({
      userId: state => state.global.sign.userId,
      phone: state => state.global.sign.mobile,
    })
  },
  created(){
    this.phone=this.$route.query.p;
    this.userId=this.$route.query.u;
    this.getResult();
  },
  methods: {
    timerPlayer(){
      clearTimeout(this.setTimer);
      let $that=this;
      this.setTimer=setTimeout(()=>{
        this.timer--;
        if($that.timer>0){
          $that.timerPlayer();
        }
        else{
          $that.getResult();
        }
      },1000);
    },
    async getResult(){
      //获取审核结果
      let params={
          phone:this.phone,
          source:'h5',
          userId:this.userId,
      }
      let $that=this;
      const res = await this.$api.getAuditResult(params);
      if(res.code==='sc0'){
        if(res.data.auditStatus===1){
          //审核通过
          // location.href='/custom-page/credit-xyd.html#/examine';
          $that.$router.push({path: '/examine'});
          // console.log('审核通过');
        }
        else if(res.data.auditStatus===3){
          //审核中
          $that.timer=10;
          $that.timerPlayer();          
        }
        else{
          //审核失败
          $that.$router.push({path: '/examine/failed'});
        }
      }
      else{
        // location.href='/custom-page/credit-xyd.html#/faceAC';
          $that.$router.push({path: '/faceAC'});
        // console.log('接口错误');
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.timer-div{
  position: relative;
  img{
    position: relative;
    z-index: 1;
  }
  .timer{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 1.5rem;
    height: 1.5rem;
    text-align: center;
    line-height: 1.5rem;
    color:#d09e54;
    font-size:1rem;
  }
}
.warning{
  font-size: 0.24rem;
  color:#a8a8a8;
  line-height: 0.36rem;
}
.buttom{
  display: flex;
  flex-direction: column;
  align-items: center;
  p{
    width: 4rem;
    height: 1rem;
    line-height: 0.8rem;
    margin-top: 0.5rem;
    -webkit-appearance: none;
    background-image: url(/custom-page/img/button.435d9c35.png);
    background-repeat: no-repeat;
    background-color: transparent;
    background-size: 100% 100%;
    background-position: bottom;
    border: none;
    font-size: 0.35rem;
    color: #ffffff;
  }
  span{
    font-size: 0.24rem;
    color:#363636;
    line-height: 0.36rem;
  }
}
</style>
