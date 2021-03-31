<template>
  <div class="card-select" v-if="vipListData">
    <div :class="currentCardStyle(item)" v-for="(item, index) in vipListData" :key="index" @click.passive="selectCard(item)">
      <label v-if="item.extraText" class="extra">{{item.extraText}}</label>
      <p>{{item.cardName}}({{item.vipTime}}天)</p>
      <h3>
        <label>￥</label>
        <span>{{item.cardAmount / 100}}</span>
        <label v-if="item.unit">/{{item.unit}}</label>
      </h3>
      <p class="fake-money" v-if="item.originalAmount">￥{{item.originalAmount/ 100}}/{{item.unit}}</p>
      <!--<p v-if="item.buyStatus && item.isBuy">{{ String(item.isBuy) !== '0' && buyStatusText[item.buyStatus]}}</p>-->
    </div>
    <!-- 支付宝提交表单 -->
    <div ref="zfbForm" v-show="false" v-html="zfbFormHtml"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import {redirectToLoginPage} from '@/helpers/utils'
  import env from '@/helpers/env';
  const buyStatusText = {
    1: "",
    2: "",
    3: "(限体验一次)"
  }

  export default {
    name: "VipCardSelector",
    props: ["vipListData"],
    data() {
      return {
        currentCard: null,
        buyStatusText,
        zfbFormHtml: null,
      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson
      }),
      ...mapState('vip', {
        vipFrom: state => state.vipFrom || ""
      })
    },
    watch: {
      vipListData(newVal) {
        if (newVal.length) {
          this.currentCard = newVal.find(item => {
            return item.defaultSelect === 1
          })
        }
      }
    },
    methods: {
      // 选择卡类型
      selectCard(data) {
        if(data) {
          if (this.currentCard && data.cardType === this.currentCard.cardType) return;
          // if (data.buyStatus === 3 && data.isBuy === 2) return;
          this.currentCard = data
          this.$emit("onActiveSelect", data)
        }
      },
      // 选择框样式
      currentCardStyle(data) {
        let cardClass = 'card-item'
        if (this.currentCard && (data.cardType === this.currentCard.cardType)) {
          cardClass = 'card-item active'
        }
        // else if(data.buyStatus === 3 && data.isBuy === 2) {
        //   cardClass = 'card-item disabled'
        // }
        return cardClass
      },

      // 购买
      async buyHaoRenKa() {
        if (!this.userId) {
          redirectToLoginPage()
          return
        }
        if (!this.currentCard) {
          this.$toast('请选择会员卡类型')
          return
        }
        const res = await this.$api.buyHaoRenKa({
          userId: this.userId,
          cardType: this.currentCard.cardType,
          source: this.vipFrom
        })
        if (res.code === 'sc0') {
          if (res.data.isIdentity === 0) {
            this.$messagebox({
              message: '请完成实名之后再完成购买',
              showCancelButton: true
            }).then(async (val) => {
              if (val === 'confirm') {
                this.$router.push({
                  path: '/baseInfo',
                  query: {
                    "rtUrl": "/open-vip"
                  }
                })
              }
            });
          } else {
            this.payVip(res.data)
          }
        } else if (res.code === 'sc3') {
          this.$toast("体验卡只能体验一次哦，请选择别的会员卡购买")
        } else {
          this.$toast(res.message)
        }
      },
      // 支付
      async payVip(data) {
        if (!data || !data.recordNo) {
          this.$toast('支付信息出错')
          return
        }
        if (env.isWeixin()) {
          this.$toast('请在非微信浏览器打开支付')
          return
        }
        const res = await this.$api.getPayString({
          h5NotifyUrl: window.location.origin + '/custom-page/goodman-member/#/home',
          recordNo: data.recordNo
        })
        if (res.code === 'sc0') {
          this.zfbFormHtml = res.data;
          this.$nextTick(() => {
            this.$refs.zfbForm.firstChild.submit();
          });
        } else {
          this.$toast(res.message)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .card-select{
    padding: .08rem 0 .2rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    & .card-item{
      touch-action: none;
      width: 2.22rem;
      min-height: 2.52rem;
      margin-right: .22rem;
      box-shadow: 0px 0.04rem 0.08rem 0px rgba(226, 226, 226, 0.56);
      border-radius: 14px;
      background-color: #fff;
      color: #363636;
      padding: .5rem 0 .3rem 0;
      text-align: center;
      position: relative;
      &:last-child{
        margin-right: 0;
      }
      .extra{
        position: absolute;
        left: -1px;
        top: -.16rem;
        display: inline-block;
        background: linear-gradient(90deg, #EC6555 0%, #EB4837 100%);
        border-radius: .14rem .14rem .14rem 0px;
        color: #fff;
        font-size: .18rem;
        line-height: .4rem;
        padding: 0 5px;
      }
      p{
        font-size: .26rem;
        line-height: .36rem;
        color: #363636;
        font-weight: 600;
        &:last-child{
          color: #F63337;
          line-height: 1;
          margin-top: .12rem;
        }
        &.fake-money{
          color: #a8a8a8;
          font-size: .22rem;
          text-decoration: line-through;
        }
      }
      h3{
        font-size: .48rem;
        margin-top: 0.05rem;
        font-weight: 600;
        color: #CD3330;
        & label{
          font-size: .26rem;
        }
      }
      &.active{
        background:rgba(255,250,239,1);
        border:1px solid rgba(208,158,84,1);
      }
      &.disabled{
        & p:first-child, h3{
          opacity: .3;
        }
      }
    }
  }
</style>
