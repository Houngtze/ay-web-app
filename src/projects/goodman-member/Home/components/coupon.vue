<template>
  <div class="coupon" @click="vipReceiveCoupon(data.couponCode)">
    <label class="tag">{{data.name}}</label>
    <div class="content">
      <div class="title">
        <h3>
          <strong :class="Number(data.title) > 0 ? 'number' : 'string'">{{data.title}}</strong>
          <span v-if="Number(data.title) > 0">元</span>
        </h3>
        <h3><label>X</label><strong>{{data.subTitle}}</strong><span>张/月</span></h3>
      </div>
      <p>{{data.tag}}</p>
    </div>
    <div class="type" >
      <p>{{supportCardText}}</p>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import env from "@/helpers/env"
  export default {
    name: "coupon",
    props: ["data", "level", "type"],
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        personId: state => state.global.userInfo.idPerson,
        userName: state => state.global.userInfo.userName
      }),
      supportCardText() {
        switch (this.level) {
          case "yearVip":
            return "年卡专享";
            break;
          case "seasonVip":
            return "季卡专享";
            break;
          case "experienceVip":
            return "体验卡专享";
            break;
          default:
            return "年卡专享"
        }
      }
    },
    methods: {
      vipReceiveCoupon(code){
        if (this.level != "default") {
          if (this.type && this.type == "life") {
            if (env.isApp()) {
              return this.$nativeBridge.jumpNativeForType(7, "")
            } else {
              return this.$toast("请在爱用商城app中操作")
            }
          } else {
            this.$api.vipReceiveCoupon({
              userId: this.userId,
              couponCode: code
            }).then(res => {
              if (res.code === "sc0") {
                this.$messagebox({
                  title: '领取成功',
                  message: '您在可以在“我的”-“优惠券”查看生活权益券',
                  confirmButtonText: '去查看',
                  showCancelButton: false
                }).then(action => {
                  return this.$nativeBridge.jumpNativeForType(7, "")
                })
              } else {
                this.$toast(res.message)
              }
            })
          }
        } else {
          this.$router.push({path: "/vip-pay"})
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .coupon {
    margin-top: .2rem;
    width: 3.22rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    label.tag {
      position: absolute;
      left: 0;
      top: 0;
      min-width: .68rem;
      lin-height: .3rem;
      padding: 0 .1rem;
      background: linear-gradient(90deg, #EC6555 0%, #EB4837 100%);
      border-radius: .14rem 0px .14rem 0px;
      color: #fff;
      font-size: .18rem;
    }
    .content {
      min-width: 2.56rem;
      height: 1.6rem;
      background: linear-gradient(148deg, #FEFAF2 0%, #FCF1DA 100%);
      border-radius: .14rem;
      border:0.02rem solid #F6E9D4;
      .title{
        display: inline-flex;
        padding: .42rem .24rem 0 .24rem;
        h3{
          display: inline-flex;
          align-items: flex-end;
          font-size: .44rem;
          color: #CD3330;
          &:last-child{
            color: #653E20;
          }
          strong{
            line-height: 1;
            white-space: nowrap;
            &.string{
              font-size: .28rem;
            }
          }
          span{
            font-size: .2rem;
            line-height: 1.5;
            white-space: nowrap;
          }
          label{
            font-size: .2rem;
            line-height: 1.5;
            margin: 0 0.04rem;
          }
        }
      }
      p{
        padding-left: .24rem;
        padding-bottom: .24rem;
        color: #CD3330;
        font-size: .2rem;
      }
    }
    .type{
      width: .66rem;
      height: 1.6rem;
      background: linear-gradient(180deg, #FBE8C7 0%, #F7D7A4 100%);
      border-radius: .14rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      p{
        font-size: .24rem;
        font-weight: 600;
        width: .24rem;
        line-height: 1.2;
        color: #A57035;
      }
    }
  }
</style>
