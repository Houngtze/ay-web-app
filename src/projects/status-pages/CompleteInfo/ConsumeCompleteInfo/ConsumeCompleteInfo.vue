<template>
  <div class="page-layout">
    <div class="page-header">
      <h2>完成以下认证</h2>
      <h2>可加速审核并提高通过率哦</h2>
      <p>24小时内完成认证才有效哦</p>
    </div>
    <div class="page-content">
      <div class="content-wrap">
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
  </div>
</template>

<script>
  import {mapState} from "vuex";
  export default {
    name: "ConsumeCompleteInfo",
    data() {
      return {
        supplementaryData: null,
        orderNo: null
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson
      })
    },
    created() {
      if (!this.getOrderNo()) return
      if (this.$route.query.upDateId) {
        this.updateSupplementaryStatus(this.$route.query.upDateId)
      }
      this.getSupplementaryData()
    },
    methods: {
      // 获取订单号
      getOrderNo() {
        if (this.$route.query.orderNo) {
          this.orderNo = this.$route.query.orderNo
          return true
        } else {
          this.$toast('订单号出错')
          return false
        }
      },
      // 获取补件信息
      async getSupplementaryData() {
        const params = {
          "userId": this.userId,
          "personId": this.personId,
          "orderNo": this.orderNo
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
          "callbackUrl": window.location.origin + '/custom-page/status-pages/#/consume-complete-info?orderNo=' + this.orderNo + '&upDateId=' + data.id,
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
          window.location.replace(window.location.origin + '/custom-page/status-pages/#/consume-complete-info?orderNo=' + this.orderNo)
        } else {
          this.$toast(res.message)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .page-header{
    padding: .65rem 0 .6rem 0;
    margin-bottom: .18rem;
    background-color: #fff;
    width: 100%;
    & h2{
      font-size: .42rem;
      color:rgba(54,54,54,1);
      line-height: 1.3;
      text-align: center;
    }
    & p{
      font-size: .24rem;
      margin-top: .21rem;
      color:rgba(168,168,168,1);
      text-align: center;
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
            background: linear-gradient(270deg,rgba(201,159,96,0.99),rgba(219,189,129,0.99));
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
</style>
