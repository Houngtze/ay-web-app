<template>
  <div class="add-address">
    <div class="container" v-if="address && address.length>0">
      <div class="addr-li" v-for="(item,index) in address" :key="index">
        <div class="addr-msg" @click="selectAddr(item)">
          <p class="name-txt">{{item.custName}}<span class="tel">{{item.phone}}</span></p>
          <p class="addr-txt">{{item.province + item.city + item.region + item.street + item.address}}</p>
        </div>
        <div class="addr-bnt">
          <label @click="setDefaultAddr(item.id)">
            <input class="default-bnt" :value="item.id" v-model="defaultRadio" name="default-bnt" type="radio">
            <i class="icon"></i>默认收货地址
          </label>
          <p @click="editAddr(item)"><i class="icon icon-edit"></i>编辑</p>
        </div>
      </div>
    </div>
    <div class="container no-msg" v-else>
      <img src="./../../images/no-addr.png">
      <p>暂无收货地址</p>
    </div>
    <div class="footer">
      <p class="cont-bnt" @click="goToAddAddr"><img src="./../../images/add-icon.png">新增收货地址</p>
    </div>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from "vuex";
  export default {
    data() {
      return {
        address:[],
        defaultRadio:'',
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
        addrList: state => state.addrList,
        selectedAddr: state => state.selectedAddr,
      }),
    },
    watch:{
      addrList(newList){
        this.address = newList;
        for(let item in this.address){
          this.readDefaultAddr(this.address[item]);
        }
      },
    },
    created() {
      this.getAddrList();
      this.address = this.addrList;
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
        this.$router.push({path:url,query:this.$route.query});
      },
      toast(mes) {
        this.$toast({
          message: mes,
          duration: 1500
        });
      },
      getAddrList(){
        // 获取地址列表
        let params = {
          idPerson: this.idPerson,
          addressType: 5,
          userId: this.userId,
        }
        this.set_AddrList(params);
      },
      selectAddr(item){
        // 选择收货地址
        if(this.$route.query.add){
          return false;
        }
        this.set_SelectedAddr(item);
        this.goTo('/cashier');
      },
      editAddr(item){
        // 编辑收货地址
        this.removeAddressEdit();
        this.setAddressEdit(item);
        this.goTo('/add-address');
      },
      goToAddAddr(){
        // 去新增，清除修改
        this.removeAddressEdit();
        this.goTo('/add-address')
      },
      readDefaultAddr(item){
        if(item.isDefault === 1){
          this.defaultRadio = item.id;
        }
      },
      async setDefaultAddr(newRadio){
        let params = {
          id:newRadio,
          idPerson:this.idPerson,
          userId:this.userId
        }
        let esp = await this.$api.setDefaultAddressHttp(params);
        if(esp.code === 'sc0'){
          this.toast('默认地址设置成功');
        }
        else{
          this.toast(esp.message);
        }
        this.getAddrList();
      },
    }
  };
</script>
<style lang="scss" scoped>
@import "src/style/index.scss";
.add-address{
  color: #363636;
  display: flex;
  flex-direction: column;
  height: 100%;
  .container{
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .addr-li{
      width: 100%;
      background: #fff;
      overflow: hidden;
      padding:0.3rem;
      margin-bottom: 0.2rem;
      .addr-msg{
        padding-bottom: 0.3rem;
        line-height: 0.4rem;
        border-bottom: 0.005rem solid #f5f5f5;
        .name-txt{
          font-size:0.3rem;
          color: #363636;
          .tel{
            margin-left: 0.2rem;
          }
        }
        .addr-txt{
          font-size:0.24rem;
        }
      }
      .addr-bnt{
        padding-top: 0.3rem;
        line-height: 0.32rem;
        display: flex;
        justify-content:space-between;
        vertical-align: middle;
        .icon{
          width: 0.3rem;
          height: 0.3rem;
          vertical-align: middle;
          display:inline-block;
          margin-right: 0.2rem;
          margin-top: -0.08rem;
          background: center no-repeat;
          background-size: 95% auto;
        }
        .icon-edit{
          width: 0.32rem;
          height: 0.32rem;
          background-image: url(./img/edit.png);
        }
        .default-bnt{
          display: none;
        }
        input[type="radio"]+i{
          background-image: url(./img/radio-no.png);
        }
        input[type="radio"]:checked+i{
          background-image: url(./img/add-radio.png);
        }
      }
    }
  }
  .no-msg{
    // background:url(./../images/no-order.png) center no-repeat;
    // background-size:20% auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img{
      width: 30%;
      height: auto;
    }
    p{
      font-size: 0.3rem;
      line-height: 1rem;
      color:#A8A8A8;
    }
  }
  .footer{
    flex-shrink: 0;
    height: 1.2rem;
    // border-top: 0.005rem solid #e5e5e5;
    box-sizing: border-box;
    padding: 0.14rem 0.3rem;
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
    .cont-bnt{
      flex-shrink: 0;
      width: 100%;
      height: .92rem;
      line-height: 0.92rem;
      text-align: center;
      color:#fff;
      background-color: #FF2929;
      font-size: 0.3rem;
      border-radius: 4px;
      img{
        width:0.3rem;
        height: 0.3rem;
        display: inline-block;
        vertical-align: middle;
        margin-right: 0.2rem;
        margin-top: -0.07rem;
      }
    }
  }

}
</style>
<style lang="scss">
</style>

