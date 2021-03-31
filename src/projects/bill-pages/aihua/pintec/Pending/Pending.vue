<template>
  <SalePageLayout :isFullScreen="true">
    <ai-template :message="pageMessage">
      <img src="./image/audit@2x.png" srcset="./image/audit@3x.png" slot="image">
      <div class="buttom" slot="bottom">
        <p @click="getResult">刷新结果</p>
      </div>
    </ai-template>
  </SalePageLayout>
</template>
<script>
  import SalePageLayout from '@/components/SalePageLayout';
  import AiTemplate from './components/template'
  import { mapState } from "vuex";
  export default {
    components: {
      AiTemplate,
      SalePageLayout
    },
    data() {
      return {
        pageMessage:'加速审核中',
        returnFlag: true
      }
    },
    computed:{
      ...mapState({
        userId: state => state.global.userInfo.userId,
        idPerson: state => state.global.userInfo.idPerson,
        ucAccountId: state => state.global.userInfo.ucAccountId,
      })
    },
    methods: {
      async getResult(){
        if (!this.returnFlag) {
          return
        }
        //获取审核结果
        let params={
          userId:this.userId,
        }
        this.returnFlag = false // lock the button
        const res = await this.$api.operatorCallback(params);
        console.log(JSON.stringify(res))
        if (res.code === 'sc0') {
          if (res.data.activeStatus !== 0) {
            this.$nativeBridge.jumpToAhAuthResult()
          }
        } else {
          this.$toast(res.message)
        }
        this.returnFlag = true
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
      background-image: url(./image/button.png);
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
