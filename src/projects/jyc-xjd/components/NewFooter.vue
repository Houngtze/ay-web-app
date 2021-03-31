<template>
<div class="footer">
  <!-- <span class="sp" @click="goLink('/repayment/home')">去还款</span>
  <span class="sp">|</span> -->
  <span class="sp" @click="kfClick">联系客服&gt;&gt;</span>
  <customer-service-dialog :kfModel="kfModel" @handleCustomerDialog="handleCustomerDialog"></customer-service-dialog>
</div>
</template>
<script>
import {mapState} from 'vuex';
import customerServiceDialog from '../components/customerServiceDialog'

export default {
  components: {
    customerServiceDialog
  },
  data(){
    return{
      tabHover:true,
      productEncash:0,
      ultimaEncash:0,
      kfModel:false,
    }
  },
  computed:{
    ...mapState({
      userId: state => state.global.userInfo.userId,
      personId: state => state.global.userInfo.idPerson,
      ucAccountId: state => state.global.userInfo.ucAccountId,
      clientCode: state => state.global.clientCode
    }),
    ...mapState('loan/home', {
      activeStepData: state => state.activeStepData,
      orgType: state => state.orgType,
    })
  },
  methods:{
    goLink(url) {
      // 跳转页面
      this.$router.push(url);
    },
    tapLink(url){
      window.location.href = url;
    },
    linkOnwer(url){
      window.location.href = window.location.origin + url
    },
    kfClick(){
      this.kfModel = !this.kfModel;
    },
    handleCustomerDialog(data) {
      this.kfModel = data
    }
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>// scoped
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
</style>


