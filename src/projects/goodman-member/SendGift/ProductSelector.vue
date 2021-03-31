<template>
  <div class="product-selector">
    <div class="product-list" v-if="productList && productList.length">
      <div :class="selectIndex === index ? 'product-item active' : 'product-item'"
           v-for="(item,index) in productList" :key="index" @click="select(item, index)">
        <div class="band" v-if="item.band">{{item.band}}</div>
        <img :src="item.img" :alt="index" />
        <p>{{item.name}}</p>
        <span>价值￥{{item.price}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ProductSelector",
    props: ["productList"],
    data() {
      return {
        selectIndex: ""
      }
    },
    methods: {
      select(data, index) {
        this.$emit("onActiveSelect", data)
        this.selectIndex = index
      }
    }
  }
</script>

<style scoped lang="scss">
.product-selector{
  width: 6.68rem;
  min-height: 5.33rem;
  background: linear-gradient(-90deg, #D5B276 0%, #EBD8AA 100%);
  border-radius: .18rem;
  margin: .25rem .4rem;
  overflow-x: scroll;
  .product-list{
    display: flex;
    align-items: center;
    justify-content: left;
    flex-direction: row;
    flex-wrap: wrap;
    min-width: 7.9rem;
    padding: .15rem;
    .product-item{
      width: 1.8rem;
      text-align: center;
      background-color: #fff;
      border-radius: .14rem;
      margin: 0 .05rem .13rem .05rem;
      position: relative;
      .band{
        position: absolute;
        top: -.1rem;
        left: -.1rem;
        padding: 2px 5px;
        font-size: .2rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 1;
        background: #CB4436;
        border-radius: 15px 17px 0px 15px;
        z-index: 9999;
      }
      &.active{
        &:after{
          content: '';
          width: 100%;
          height: 100%;
          background-image: url("http://static.ali.szqk-tech.com/images/custom-page/goodman-member/SendGift/select-product.png");
          background-size: 100% 100%;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 99;
        }
      }
      img{
        width: 100%;
        display: inline-block;
      }
      p{
        font-size: .19rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #323232;
        line-height: 1;
        margin: .15rem 0 0 0;
      }
      span{
        font-size: .17rem;
        font-family: PingFang SC;
        font-weight: 600;
        color: #BA1C19;
        display: inline-block;
        line-height: 1;
        margin-bottom: .15rem;
      }
    }
  }
}
</style>
