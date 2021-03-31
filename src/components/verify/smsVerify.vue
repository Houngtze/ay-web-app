<template>
  <div class="sms-verify-view">
    <input type="tel" v-model="smsCode" maxlength="6" ref="smsCodeRef" @input="inputVal">
    <div class="ipt-view" @click="inpFocus">
      <p v-for="(item, index) in 6" :key="item" class="col">
        <span v-show="smsCode[index]">
          {{smsCode[index]}}
        </span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      smsCode: '', //短信验证码
    }
  },
  methods: {
    inpFocus() {
      this.$refs.smsCodeRef.focus();
    },
    inputVal() {
      if(this.smsCode.length === 6) {
        this.$emit('inputVal', this.smsCode)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sms-verify-view{
  input{
    height: 0.01rem; 
    margin-left: -100%; 
    text-indent: -999em;
  }
  .ipt-view{
    display: flex;
    height: 0.75rem;
    width: 4.32rem;
    background-color: #ffffff;
    border: 0.03rem solid #e1e1e1;
    border-radius: 0.06rem;
    .col{
      display: flex;
      flex: 1;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-size: 0.4rem;
      border-right: 0.03rem solid #e2e2e2;
      &:last-of-type {
        border: none;
      }
    }
  }
}
</style>
