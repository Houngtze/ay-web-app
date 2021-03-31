<template>
  <div class="add-address">
    <div class="form-list">
      <div class="form-items">
        <p class="lab">本人姓名</p>
        <input v-model="username" maxlength="18" type="text" class="inp" placeholder="请输入您的姓名">
      </div>
      <div class="form-items">
        <p class="lab">本人手机号</p>
        <input v-model="phone" type="text" class="inp" maxlength="11" placeholder="请输入您的手机号">
      </div>
      <div class="form-items" @click="showChooseAddress = !showChooseAddress">
        <p class="lab">所在地区</p>
        <span class="inp" v-if="!address.province">请选择</span>
        <span class="inp" v-else>
          {{address.province}}{{address.city}}{{address.region}}{{address.street}}
        </span>
      </div>
      <div class="form-items">
        <p class="lab">收货地址</p>
        <input v-model="addr" type="text" class="inp" placeholder="请输入您的收货地址">
      </div>
    </div>
    <div class="form-bnt">
      <p @click="submitAdd">确认并提交</p>
    </div>
    <p class="form-warm">若您中奖，中奖商品将直接寄到该地址，请确保信息无误，若因若填写有误造成金钱损失由您自行承担。客服会先联系您本人确认信息，请确保</p>
    <area-address @callback="add_address" @showAddressPop="toggle_popup" v-if="showChooseAddress"></area-address>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from "vuex";
  import areaAddress from "./Area";

  export default {
    components:{
      areaAddress
    },
    data() {
      return {
        username:'',
        phone:'',
        addr:'',
        address:{
          province: null,
          city: null,
          region: null,
          street: null,
          address: null
        },
        showChooseAddress: false
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
      ...mapState('edit',{
        edit: state => state.edit,
      }),
    },
    created() {
      if(this.edit && this.edit!=''){
        this.username = this.edit.custName;
        this.phone = this.edit.phone;
        this.addr = this.edit.address;
        this.address.province = this.edit.province;
        this.address.city = this.edit.city;
        this.address.region = this.edit.region;
        this.address.street = this.edit.street;
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      ...mapActions("addr", [
        "set_SelectedAddr","set_AddrList","set_EditAddr"
      ]),
      ...mapActions("edit", [
        "setAddressEdit","removeAddressEdit"
      ]),
      goTo(url){
        this.$router.replace({
          path:url,
          query:this.$route.query
        });
      },
      toast(mes) {
        this.$toast({
          message: mes,
          duration: 1500
        });
      },
      // 校验手机号
      checkPhone (value) {
        return /^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/.test(value)
      },
      checkName (value) {
        const reg = /^([\u4e00-\u9fa5]|[\u4e00-\u9fa5]·){2,}$/
        if (!reg.test(value)) {
          return false
        } else {
          return true
        }
      },
      // 选择地址
      add_address(address) {
        this.address = {
          ...this.address,
          ...{
            province: address[0].name,
            city: address[1].name,
            region: address[2].name,
            street: address[3] ? address[3].name : ''
          }
        }
      },
      async submitAdd(){
        // 保存地址
        if (this.username==='' || !this.checkName(this.username)) {
          this.toast('请输入正确的姓名')
          return
        }
        if (this.phone==='' || !this.checkPhone(this.phone)) {
          this.toast('请输入正确的手机号')
          return
        }
        if (!this.address.province) {
          this.toast('请输入选择地址');
          return;
        }
        if (!this.addr) {
          this.toast('请补充详细收货地址，如街道、门牌号、楼层及房号')
          return
        }
        let params = {
          address:this.addr,
          addressType:'5',
          city:this.address.city,
          custName:this.username,
          idPerson:this.idPerson,
          isDefault:0,
          phone:this.phone,
          province:this.address.province,
          region:this.address.region,
          street:this.address.street,
          userId:this.userId,
        }
        let esp;
        if(this.edit && this.edit!=''){
          params.id = this.edit.id;
          params.isDefault = this.edit.isDefault;
          esp = await this.$api.updateAddressHttp(params);
        }
        else{
          esp = await this.$api.addAddressHttp(params);
        }
        if(esp.code === 'sc0'){
          this.removeAddressEdit();
          let paramsClear = {
            idPerson: this.idPerson,
            addressType: 5,
            userId: this.userId,
          }
          this.set_AddrList(paramsClear);
          this.goTo('/addr-list');
        }
        else{
          this.toast(esp.message);
        }
      },
      // 地址组件开关
      toggle_popup() {
        this.showChooseAddress = !this.showChooseAddress
      },
    }
  };
</script>
<style lang="scss" scoped>
@import "src/style/index.scss";
.add-address{
  width: 100%;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 1rem;
  .form-list{
    padding-left:0.3rem;
    .form-items{
      border-bottom: 0.005rem solid #e5e5e5;
      height: 1.11rem;
      display: flex;
      .lab{
        width: 1.66rem;
        flex-shrink: 0;
        line-height: 1.1rem;
      }
      .inp{
        width: 100%;
        line-height: 1.05rem;
        border: 0;
        box-sizing:border-box;
        height: 1.05rem;
        padding-right: 0.3rem;
      }
      span.inp{
        color:#666;
      }
    }
  }
  .form-warm{
    color: #A8A8A8;
    font-size: 0.22rem;
    padding: 0 0.3rem;
  }
  .form-bnt{
    padding: 0.6rem 0.3rem 0.2rem 0.3rem;
    p{
      width: 100%;
      height: .92rem;
      line-height: 0.92rem;
      text-align: center;
      color:#fff;
      background-color: #FF2929;
      font-size: 0.3rem;
      border-radius: 4px;
    }
  }
}
</style>
<style lang="scss">
</style>

