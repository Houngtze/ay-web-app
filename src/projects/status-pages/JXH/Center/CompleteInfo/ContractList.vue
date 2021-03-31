<template>
  <div class="page-main">
    <div class="list-box">
       <ul>
           <li class="list-item" v-for="(item,index) in contractList" :key="'contractList'+index" @click="previewContract(item.contractUrl)">
               <div>{{item.contractName}}</div>
               <div><img src="../../../image/icon_click@2x.png" /></div>
           </li>
       </ul>
    </div>
    <div class="btn" @click="sumbit">已阅读并确认</div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
    import {redirectToLoginPage} from '@/helpers/utils';
    import env from '@/helpers/env';
  export default {
    name: "JXHContractList",
    data() {
      return {
          isJXHAPP: env.isJXHAPP(),
          contractList: [],
          isFromApp: false,
      }
    },
    beforeRouteEnter (to, from, next) {
        window.document.body.style.backgroundColor = '#ffffff';
        next()
    },
    beforeRouteLeave (to, from, next) {
        window.document.body.style.backgroundColor = '';
        next()
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
      }),
    },
    created(){
        this.jxhGetContractList();
    },
    methods: {
        async previewContract(contractUrl){
            // let index = fileUrl.lastIndexOf('.');
            // let name  = ''
            // if(index !== -1){
            //     name = fileUrl.substring(index + 1);
            // }
            // if(name.toLowerCase() == 'pdf'){
            //    if (this.isJXHAPP) {
            //         this.$nativeBridge.pushAnimation({
            //             url: window.location.origin + '/custom-page/status-pages/#/jxh-previewPdf?fileName=' + fileUrl
            //         })
            //     }else{
            //         this.$router.push({ path: '/jxh-previewPdf', query: { fileName: fileUrl}})
            //     }
            // }
            if (this.isJXHAPP) {
                if(!contractUrl){
                    this.$nativeBridge.pushAnimation({
                        url: contractUrl
                    });
                }else{
                     this.$toast('合同地址错误');
                }
            }else{
                window.location.href = contractUrl;
            }
        },
        async jxhGetContractList(){
            let prams = {
                userId: this.userId,
            }
            const res = await this.$api.jxhGetContractList(prams);
            if (res.result === 'success') {
                this.contractList = res.data;
            }else{
                this.$toast(res.message);
            }
        },
        async sumbit(){
            if (!this.userId) {
                if (this.isJXHAPP){
                    await redirectToLoginPage();
                    return ;
                }
            }
            let prams = {
                orderNo: this.$route.query.orderNo,
            }
            const res = await this.$api.jxhComfirmOrder(prams);
            if (res.result === 'success') {
                if(this.$route.query.origin === 'fromApp'){
                    this.$router.replace('/jxh-messageCompleteInfo');
                }else{
                    window.location.href = window.location.origin + '/custom-page/jxh-loan/#/repayment/loan-list?menuStatic=2';
                }
            }else{
                this.$toast(res.message);
            }            
            
        }
    }
  }
</script>

<style scoped lang="scss">
  .page-main{
        position: relative;
      .list-box{
          background-color: #FFF;
          padding-left: 0.32rem; 
          padding-bottom: 1.42rem;
          .list-item{
              width: 100%;
              height: 1.1rem;
              display: flex;
              align-items: center;
              font-size: 0.3rem;
              color: #363636;
              justify-content: space-between;
              border-bottom: 1px solid #EEEEEE;
              padding-right: 0.32rem; 
              img{
                  width: 0.48rem;        
                }
          }
      }
      .btn{
            width:6.84rem;
            height:0.88rem;
            background:rgba(186,153,80,1);
            border-radius:0.44rem;
            line-height: 0.88rem;
            text-align: center;
            font-size: 0.32rem;
            color: #fff;
            margin: 0 auto;
            position: fixed;
            bottom: 0.32rem;
            left: 0.34rem;
      }
  }

</style>