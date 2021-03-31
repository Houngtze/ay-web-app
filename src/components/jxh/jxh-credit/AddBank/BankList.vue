<template>
  <div class="page-layout">
    <ul class="list">
      <li v-for="(item, index) in bankListData" :key="index">
        <img class="bg-img" v-lazy="item.url">
        <p>{{item.bankName}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {
        bankListData: []
      }
    },
    created() {
      this.getBankList();
    },
    methods: {
      async getBankList() {
        // 获取银行卡列表
        const params = {
          enterCode: 8
        }
        const res = await this.$api.jxhCredit.JXHgetSupportBankList(params);
        if (res.code === '0' || res.code === 'sc0') {
          if (res.data) {
            this.bankListData = res.data;
          }
        } else {
          this.$toast(res.message)
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  .page-layout {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    .list {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      li {
        background-color: #fff;
        display: flex;
        height: 1.14rem;
        padding: .32rem;
        align-items: center;
        justify-content: left;
        border-bottom: 0.01rem solid rgba(238,238,238,1);
        img {
          width: .48rem;
          display: inline-block;
          margin-right: .22rem;
        }
        p {
          font-size: .3rem;
          color: #363636;
        }
      }
    }
  }
</style>


