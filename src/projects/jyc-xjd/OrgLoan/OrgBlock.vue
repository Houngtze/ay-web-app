<template>
  <div class="org-block">
    <div class="org-title">
      <h2>
        {{data.title.text}}
        <span class="extra" @click="handleClick(data.title.extraUrl)">{{data.title.extra}}</span>
      </h2>
    </div>
    <div class="org-content">
      <div class="org-item" v-for="(item, index) in data.list">
       <div class="left">
           <h3>
             <img v-lazy="item.icon">
             <span>{{item.title}}</span>
           </h3>
          <h3>{{item.text}}</h3>
          <p>{{item.desc}}</p>
       </div>
       <div class="right">
         <span>{{item.label}}</span>
         <button @click="handleClick(item.url)">{{item.btnText}}</button>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OrgBlock",
    props: ["data"],
    methods: {
      handleClick(data) {
        this.$emit("onActiveClick", data)
      },
    }
  }
</script>

<style scoped lang="scss">
.org-block{
  padding: 0 .28rem;
  .org-title{
    margin-bottom: .24rem;
    h2{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: .36rem;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight: 600;
      color:rgba(54,54,54,1);
      line-height: .5rem;
      span{
        font-size: .28rem;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(216,158,65,1);
        line-height: .4rem;
        text-decoration: underline;
      }
    }
  }
  .org-content{
    .org-item{
      width: 100%;
      background:rgba(255,255,255,1);
      border-radius: .16rem;
      padding: .32rem .36rem;
      margin-bottom: .24rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left{
        flex: 2;
        h3{
          display: flex;
          align-items: center;
          justify-content: left;
          font-size: .32rem;
          margin-bottom: .22rem;
          font-weight: 600;
          img{
            width: .48rem;
            display: inline-block;
            margin-right: .18rem;
          }
        }
        p{
          font-size: .24rem;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(54,54,54,1);
          line-height: .34rem;
        }
      }
      .right{
        justify-self: right;
        text-align: right;
        flex: 1;
        span{
          font-size: .22rem;
          line-height: .32rem;
          color: #a8a8a8;
        }
        button{
          -webkit-appearance: none;
          border: none;
          padding: .14rem .26rem;
          min-width: 1.8rem;
          background:linear-gradient(90deg,rgba(225,188,120,1) 0%,rgba(208,158,84,1) 100%);
          border-radius: .35rem;
          font-size: .3rem;
          font-family:PingFang-SC-Medium,PingFang-SC;
          font-weight:500;
          color:rgba(255,255,255,1);
          margin-top: .52rem;
        }
      }
    }
  }
}
</style>
