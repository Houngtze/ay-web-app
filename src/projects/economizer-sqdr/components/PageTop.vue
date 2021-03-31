<template>
  <div class="page-top">
    <p>{{topTxt}}</p>
    <span class="r-sid" @click="goRule">活动规则>></span>
    <mt-popup  v-model="popupVisible" class="max-div"  position="right">
      <img src="./../images/close@2x.png" class="close-bnt" @click="popupVisible = !popupVisible">
      <pre>{{activityRule}}</pre>
    </mt-popup>
  </div>
</template>
<script>
  import {mapState, mapActions} from "vuex";

  export default {
    props:{
      isLink:{
        default:true
      }
    },
    data() {
      return {
        topShow:'',
        topNom:0,
        topTxt:'',
        popupVisible:false
      };
    },
    filters: {
    },
    watch:{
      popupVisible:{
        handler:function(e){
          this.$emit('shower',e);
        }
      }
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
        activityRule: state => state.order.activityRule,
      })
    },
    async created() {
      if(!this.topData){
        await this.getData();
      }
      this.topShow = this.topData;
      this.showerTop();
    },
    mounted() {
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      ...mapActions("top", ["setTopData"]),
      async getData(){
        let params = {
          activityThemeId:null,
        }
        let dataTop = await this.$api.queryScrobarOrderListHttp(params);
        if(dataTop.code === '0'){
          this.setTopData(dataTop.data);
          this.topShow = dataTop.data;
        }
        else{
          this.$toast({
            message: dataTop.message,
            duration: 1500
          });
        }
      },
      showerTop(){
        if (!this.topShow) return
        if(this.topNom < this.topShow.length-1){
          let str = this.topShow[this.topNom];
          str = str.userName + '正在参与' + str.activityTheme;
          this.topTxt = str;
          setTimeout(()=>{
            this.topNom ++;
            this.showerTop();
          },3000);
        }
        else{
          let str = this.topShow[0];
          str = str.userName + '正在参与' + str.activityTheme;
          this.topTxt = str;
          setTimeout(()=>{
            this.topNom = 0 ;
            this.showerTop();
          },3000);
        }
      },
      goRule(){
        if(this.isLink){
          this.$router.push('/rule')
        }
        else{
          this.popupVisible =  !this.popupVisible;
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
@import "src/style/index.scss";
.page-top{
  background:#FFF3EA;
  font-size: 0.24rem;
  height: 0.6rem;
  align-items: center;
  color:#DF6421;
  padding: 0 0.28rem;
  display: flex;
  justify-content: space-between;
  p{
    line-height: 0.6rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .r-sid{
    flex-shrink: 0;
    margin-left: 0.1rem;
  }
  img{
    display: inline-block;
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }
  .max-div{
    width: 100%;
    height: 100%;
    padding: 0.3rem;
    color: #333;
    z-index: 999;
    font-size: 0.26rem;
    line-height: 0.34rem;
    .close-bnt{
      float:right;
      width: 0.5rem;
      height: 0.5rem;
      margin-left: 0.1rem;
    }
    pre{
      white-space:pre-wrap;
      word-wrap: break-word;
    }
  }
}
</style>
<style lang="scss">
</style>

