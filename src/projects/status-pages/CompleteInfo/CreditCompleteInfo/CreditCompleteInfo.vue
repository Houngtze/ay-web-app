<template>
  <div class="page-layout">
    <div class="page-header">
      <div class="header-wrap">
        <img src="../../image/examine-success.png">
        <p>当前进度为99%</p>
        <p>您的授信申请只剩最后一步了</p>
      </div>
    </div>
    <div class="page-content">
      <div class="content-wrap">
        <h3>请尽快完善以下资料，超时未完成需要申请哦~</h3>
        <div class="content-item g-mobile-border-top" flex-row-between v-for="(item, index) in supplementaryData" :key="index">
          <div class="left">
            <img v-lazy="item.iconUrl">
            <div class="desc">
              <p v-if="item.supplementaryName">{{item.supplementaryName}}</p>
              <span v-if="item.supplementaryDesc">{{item.supplementaryDesc}}</span>
            </div>
          </div>
          <div class="right">
            <button :class="item.status === 0 ? '' : 'disable'" v-text="item.status === 0 ? '去补件' : '已完成'"
                    @click="item.status === 0 && toSupplement(item)"></button>
          </div>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <button>返回首页</button>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "CreditCompleteInfo",
    data() {
      return {
        supplementaryData: null,
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson
      })
    },
    created() {
      if (this.$route.query.upDateId) {
        this.updateSupplementaryStatus(this.$route.query.upDateId)
      }
      this.getSupplementaryData()
    },
    methods: {
      // 获取补件信息
      async getSupplementaryData() {
        const params = {
          "userId": this.userId,
          "personId": this.personId
        }
        const res = await this.$api.querySupplementaryList(params)
        if (res.code === '0') {
          this.supplementaryData = res.data
        } else {
          this.$toast(res.message)
        }
      },
      // 去申请补件
      async toSupplement(data) {
        // 运营商
        const res = await this.$api.rfeApply({
          "userId": this.userId,
          "personId": this.personId,
          "supplementaryType": data.supplementaryType,
          "callbackUrl": window.location.origin + '/custom-page/status-pages/#/credit-complete-info?upDateId=' + data.id,
          "source": "AYSCAPP_XYRZ",
          "platform": "H5"
        });
        if (res.code === '0') {
          window.location.href = res.data.jumpUrl;
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
        }
      },
      // 更新补件信息
      async updateSupplementaryStatus(id) {
        const params = {
          "userId": this.userId,
          "personId": this.personId,
          "id": id
        }
        const res = await this.$api.updateSupplementaryStatus(params)
        if (res.code === '0') {
          window.location.replace(window.location.origin + '/custom-page/status-pages/#/credit-complete-info')
        } else {
          this.$toast(res.message)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .page-layout{
    width: 100%;
    height: inherit;
  }
  .page-header{
    width: 100%;
    height: 3.4rem;
    background-color: #fff;
    margin-bottom: .18rem;
    & .header-wrap{
      padding: .4rem 0;
      text-align: center;
      color: #363636;
      & img{
        width: 1.5rem;
        height: 1.5rem;
        display: inline-block;
      }
      & p{
        line-height: 1;
        font-size: .3rem;
        margin: .29rem 0 .23rem 0;
      }
    }
  }
  .page-content{
    width: 100%;
    background-color: #fff;
    & .content-wrap{
      & h3{
        font-size: .32rem;
        color:rgba(34,34,34,1);
        padding: .39rem .3rem .38rem .3rem;
        font-weight: 600;
      }
      & .content-item{
        padding: .45rem .3rem;
        & .left{
          display: flex;
          align-items: center;
          justify-content: left;
          font-size: .3rem;
          color: #363636;
          & img{
            width: .5rem;
            height: .5rem;
            display: inline-block;
            margin-right: .3rem;
          }
          & p{
            font-size: .3rem;
            color: #363636;
            margin-bottom: .14rem;
          }
          & span{
            font-size: .24rem;
            color: #a8a8a8;
            line-height: 1;
          }
        }
        & .right{
          & button{
            border: none;
            width: 1.2rem;
            height: .6rem;
            background: linear-gradient(270deg,rgba(208,158,84,0.99),rgba(225,188,120,0.99));
            border-radius: .3rem;
            color: #fff;
            font-size: .24rem;
            &.disable{
              background:rgba(229,229,229,1);
            }
          }
        }
      }
    }
  }
  .page-footer{
    width: 100%;
    text-align: center;
    margin-top: 1.66rem;
    & button{
      display: inline-block;
      width: 6.9rem;
      height: .92rem;
      background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
      border-radius: .1rem;
      border: none;
      color: #fff;
      font-size: .36rem;
    }
  }
</style>
