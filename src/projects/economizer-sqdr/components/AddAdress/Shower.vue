<template>
  <div class="add-address">
    <div class="has-addr" @click="goTo('/addr-list')" v-if="address">
      <p class="name-txt">收货人：{{address.custName}}</p>
      <p class="addr-txt">收货地址：{{address.province + address.city + address.region + address.street + address.address}}</p>
    </div>
    <div class="no-addr" @click="goToAddAddr" v-else>
      <i class="add-icon"></i>
      <span class="txt">添加收货地址</span>
    </div>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from "vuex";

  export default {
    data() {
      return {
        address:null,
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
      }),
      ...mapState('addr',{
        selectedAddr: state => state.selectedAddr,
        addrList: state => state.addrList,
      }),
    },
    watch:{
      selectedAddr(newAddr){
        this.address = newAddr;
      }
    },
    created() {
      this.loadAddr();
      this.address = this.selectedAddr;
    },
    mounted() {
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      ...mapActions("addr", [
        "set_SelectedAddr","set_AddrList"
      ]),
      ...mapActions("edit", [
        "setAddressEdit","removeAddressEdit"
      ]),
      goTo(url){
        this.$router.push(url);
      },
      async loadAddr(){
        let params = {
          idPerson: this.idPerson,
          addressType: 5,
          userId: this.userId,
        }
        await this.set_AddrList(params);
        if(!this.selectedAddr || this.selectedAddr === null){
          if(this.addrList && this.addrList.length >0){
            this.set_SelectedAddr(this.addrList[0]);
          }
        }
      },
      goToAddAddr(){
        // 去新增，清除修改
        this.removeAddressEdit();
        this.goTo('/add-address')
      }
    }
  };
</script>
<style lang="scss" scoped>
@import "src/style/index.scss";
.add-address{
  width: 100%;
  height: 2rem;
  background: #fff;
  overflow: hidden;
  box-sizing: border-box;
  padding:0 0.29rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .has-addr{
    background:url(./img/arrow@2x.png) right center no-repeat;
    background-size:auto 30%;
    .name-txt{
      font-size:0.34rem;
      color: #363636;
    }
    .addr-txt{
      font-size:0.24rem;
      color:#A8A8A8;
    }
  }
  .no-addr{
    text-align: center;
    .add-icon{
      vertical-align: middle;
      width: 0.5rem;
      height: 0.5rem;
      background:url(./img/add-address.png) center no-repeat;
      background-size:100% auto;
      display: inline-block;
      margin-right: 0.2rem;
    }
    .txt{
      font-size:0.3rem;
      color: #363636;
      line-height: 0.5rem;
    }
  }
}
</style>
<style lang="scss">
</style>

