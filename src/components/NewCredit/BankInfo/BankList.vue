<template>
  <div class="txzf-home">
    <ul class="list">
      <li v-for="(item, index) in bankListData" :key="index" @click="setBankInfo(item)">
        <img class="bg-img" :src="item.backgroundUrl">
        <div class="msg">
          <p class="dt">{{item.bankName}}</p>
          <p class="dd">储蓄卡</p>
          <p class="no">**** **** **** {{returnCardNo(item.bankNo)}}</p>
        </div>
        <div class="mr-bnt" v-if="item.isDefault === 1">
          <p>默认</p>
        </div>
      </li>
    </ul>
    <div class="bnt">
      <p @click="goLink('/addBank')">添加</p>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from "vuex";

  export default {
    components: {},
    data() {
      return {
        tabHover: true,
        bankListData: [],
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        phone: state => state.global.userInfo.mobile,
        personId: state => state.global.userInfo.idPerson,
        ucAccountId: state => state.global.userInfo.ucAccountId,
      }),
      ...mapState('bankInfo', {
        bankInfo: state => state.bankInfo
      }),
    },
    created() {
      this.getBankList();
    },
    methods: {
      ...mapActions('bankInfo', [
        'set_bankInfo'
      ]),
      async getBankList() {
        // 获取银行卡列表
        const params = {
          idPerson: this.personId,
          userId: this.userId,
          channel: "H5",
          ucAccountId: this.ucAccountId
        }
        const res = await this.$api.getBankInfo(params);
        if (res.code === '0' || res.code === 'sc0') {
          if (res.data) {
            this.bankListData = res.data.bankInfoList;
            // this.setBankInfo(this.bankListData[0]);
          }
        } else {
          this.$toast(res.message)
        }
      },
      returnCardNo(str) {
        // 返回银行卡号码
        return str.substr(str.length - 4);
      },
      goLink(url) {
        // 跳转页面
        this.$router.push(url);
      },
      setBankInfo(item) {
        this.set_bankInfo(item);
        this.$router.go(-1);
      },
    },
    beforeDestroy() {
    }
  }
</script>
<style lang="scss" scoped>
  .txzf-home {
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
      padding: .3rem .3rem .98rem .3rem;
      li {
        width: 100%;
        height: 2.3rem;
        border-radius: 0.1rem;
        background-color: #a8a8a8;
        margin-bottom: 0.3rem;
        display: flex;
        padding: 0.3rem 0.3rem 0 0.36rem;
        position: relative;
        z-index: 1;
      }
      .icon-b {
        width: 0.75rem;
        height: 0.75rem;
        flex-shrink: 0;
      }
      .bg-img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
      }
      .msg {
        width: 100%;
        color: #fff;
        padding-left: 0.95rem;
        position: relative;
        z-index: 3;
        .dt {
          font-size: 0.32rem;
        }
        .dd {
          font-size: 0.22rem;
        }
        .no {
          font-size: 0.34rem;
          padding-top: 0.2rem;
        }
      }
      .mr-bnt {
        position: relative;
        z-index: 3;
        p {
          width: 0.6rem;
          height: 0.3rem;
          text-align: center;
          line-height: 0.3rem;
          border: 0.01rem solid #fff;
          border-radius: 0.3rem;
          font-size: 0.18rem;
          color: #fff;
        }
      }
    }
    .bnt {
      position: fixed;
      bottom: .3rem;
      left: 0;
      width: 100%;
      height: 1.4rem;
      padding: 0.2rem 0.3rem;
      flex-shrink: 0;
      p {
        width: 100%;
        height: 0.92rem;
        background: #D09E54;
        border-radius: 0.05rem;
        color: #fff;
        font-size: 0.36rem;
        line-height: 0.92rem;
        text-align: center;
      }
    }
  }
</style>


