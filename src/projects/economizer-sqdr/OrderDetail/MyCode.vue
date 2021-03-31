<template>
  <div class="pub-page">
    <table>
      <tr>
        <th>序号</th>
        <th>时间</th>
        <!-- <th>用户</th> -->
        <th>参与码</th>
      </tr>
      <tr v-for="(item,index) in pageData.joinCodeList" :key="index">
        <td>{{index+1}}<i v-if="item.source === 'share'" class="frs-icon"></i></td>
        <td>{{returnDate(item.createTime)}}</td>
        <!-- <td>{{item.loginName}}</td> -->
        <td>{{item.joinCode}}</td>
      </tr>
    </table>
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
        pageData:null,
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
        orderDetail: state => state.orderList.orderDetail,
      })
    },
    async created() {
      this.pageData = this.orderDetail;
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
      },
      returnDate(time){
        let nd = new Date(time);
        return nd.getFullYear() +'-'+ (nd.getMonth()+1) +'-' + nd.getDate();
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
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 1.98rem;
  table{
    color: #868686;
    background:#fff;
    width: 100%;
    tr{
      border-top: 0.005rem solid #e5e5e5;
    }
    td,th{
      text-align: center;
      padding: 0 0.1rem;
      font-weight: 500;
      font-size: 0.22rem;
    }
    th{
      font-size: 0.24rem;
    }
    td:first-child,th:first-child{
      text-align: left;
    }
    td:last-child,th:last-child{
      text-align: right;
      line-height:0.6rem;
    }
  }
  .frs-icon{
    width: 0.3rem;
    height: 0.3rem;
    display: inline-block;
    background: url(./../images/frs-icon.png) center no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
    margin-left: 0.1rem;
  }
}
</style>
<style lang="scss">
</style>

