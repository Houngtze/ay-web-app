<template>
  <div class="coupon-block">
    <h3>{{data.areaName}}</h3>
    <div class="coupon-list">
      <coupon :data="item" v-for="(item, index) in data.areaList"
             :key="index"
              :level="level"/>
    </div>
  </div>
</template>

<script>
  import coupon from "./coupon"
  export default {
    name: "vipLifeCoupon",
    props: ["data", "level"],
    components: {coupon},
    computed: {
      advDesc() {
        return this.data && this.data.areaTitle && this.data.areaTitle.indexOf(">") > -1 && this.data.areaTitle.split(">")
      }
    }
  }
</script>

<style scoped lang="scss">
  .coupon-adv{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 1.4rem;
    background: linear-gradient(90deg, #FBE8C7 0%, #F7D7A4 100%);
    border-radius: .14rem;
    padding: .28rem .26rem .3rem .26rem;
    img{
      width: .82rem;
      display: inline-block;
      margin-right: .14rem;
    }
    .desc{
      color: #583A18;
      h4{
        font-size: .3rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: left;
        line-height: .42rem;
        img{
          width: .26rem;
          display: inline-block;
        }
      }
      p{
        font-size: .24rem;
      }
    }
    button{
      min-width: 1.44rem;
      height: .54rem;
      border: none;
      line-height: .54rem;
      background: linear-gradient(90deg, #55402E 0%, #3D352E 100%);
      border-radius: .29rem;
      padding: 0 .18rem;
      font-size: .26rem;
      font-family: PingFang-SC-Medium, PingFang-SC;
      color: #FFFFFF;
    }
  }
  .coupon-list{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    .coupon-more{
      width: 3.22rem;
      height: 1.6rem;
      background: #D8D8D8 linear-gradient(171deg, #FEFAF2 0%, #FCF1DA 100%);
      border-radius: .14rem;
      display: inline-flex;
      text-align: center;
      justify-items: center;
      align-items: center;
      p{
        flex: 1;
        text-align: center;
        font-size: .24rem;
        color: #653E20;
        line-height: .34rem;
      }
    }
  }
</style>
