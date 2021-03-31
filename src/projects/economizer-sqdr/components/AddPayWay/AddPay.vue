<template>
  <div class="add-address">
    <div class="form-list">
      <div class="form-items">
        <p class="lab">本人姓名</p>
        <input type="text" maxlength="18" v-model="form.userName" class="inp" placeholder="请输入您的姓名">
      </div>
      <div class="form-items">
        <p class="lab">本人手机号</p>
        <input type="text" maxlength="11" v-model="form.phone" class="inp" placeholder="请输入您的手机号">
      </div>
      <div class="form-items">
        <p class="lab">微信号</p>
        <input type="text" v-model="form.wechat" class="inp" placeholder="请输入您的微信号">
      </div>
      <div class="form-items">
        <p class="lab">支付宝账户</p>
        <input type="text" v-model="form.alipayAccount" class="inp" placeholder="请输入您的支付宝账户">
      </div>
    </div>
    <div class="form-bnt">
      <p @click="submitPay">确认并提交</p>
    </div>
    <p class="form-warm">若您中奖，中奖商品将直接寄到该地址，请确保信息无误，若因若填写有误造成金钱损失由您自行承担。客服会先联系您本人确认信息，请确保</p>
  </div>
</template>
<script>
  import env from '@/helpers/env';
  import {mapState, mapActions} from "vuex";

  export default {
    data() {
      return {
        form:{
          userName:'',
          phone:'',
          wechat:'',
          alipayAccount:'',
        }
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
        this.form.userName = this.edit.userName;
        this.form.phone = this.edit.phone;
        this.form.wechat = this.edit.wechat;
        this.form.alipayAccount = this.edit.alipayAccount;
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions("global/sign", ["initSignStatus"]),
      ...mapActions("payway", [
        "setSelectedPayWay","setPayWayList"
      ]),
      ...mapActions("edit", [
        "setAddressEdit","removeAddressEdit"
      ]),
      goTo(url){
        this.$router.replace(url);
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
      async submitPay(){
        if(this.form.userName==='' || !this.checkName(this.form.userName)){
          this.toast('请输入正确的姓名');
          return false;
        }
        if(this.form.phone==='' || !this.checkPhone(this.form.phone)){
          this.toast('请输入正确的手机号');
          return false;
        }
        if((!this.form.alipayAccount || this.form.alipayAccount==='') && (!this.form.wechat || this.form.wechat==='')){
          this.toast('请填写微信号或支付宝账号');
          return false;
        }
        let paramsZF = {
          userId:this.userId,
          userName:this.form.userName,
          phone:this.form.phone,
          wechat:this.form.wechat,
          alipayAccount:this.form.alipayAccount,
          isDefault:'0',
          type:'insert',
          id:'',
        };
        if(this.edit && this.edit!=''){
          paramsZF.id = this.edit.id;
          paramsZF.isDefault = this.edit.isDefault;
          paramsZF.type = 'update';
        };
        let eps =await this.$api.socialAccountHttp(paramsZF);
        if(eps.code === '0'){
          let params = {
            userId:this.userId,
            type:'select',
          }
          this.form={...this.edit,...this.form};
          await this.setPayWayList(params);
          await this.setSelectedPayWay(this.form);
          this.goTo('/payway-list');
        }
      }
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

