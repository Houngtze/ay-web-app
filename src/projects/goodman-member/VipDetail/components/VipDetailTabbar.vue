<template>
  <div class="vip-detail-tabbar" ref="container">
    <ul ref="scrollContainer">
      <li :class="currentItemClass(item.type)" @click="selectItem(item.type)" v-for="(item, index) in tabData" :key="index" :data-key="item.type">
        <img :src="item.icon" v-show="!iconChange(item.type)" />
        <img :src="item.icon_active" v-show="iconChange(item.type)" />
        <p>{{item.text}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "VipDetailTabbar",
    props: ['detailType'],
    data() {
      return {
        currentItemType: 'ayq',
        tabData: [
          { type: "loan", text: "爱有钱",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_1@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_1_s@2x.png"
          },
          { type: "org-loan", text: "精选通道",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_2@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_2_s@2x.png"
          },
          { type: "discount", text: "会员折扣",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_3@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_3_s@2x.png"
          },
          { type: "gift", text: "会员礼品",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_4@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_4_s@2x.png"
          },
          { type: "life", text: "生活权益",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_5@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_5_s@2x.png"
          },
          { type: "all-coupon", text: "全品类券",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_6@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_6_s@2x.png"
          },
          { type: "repay-coupon", text: "还款券",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_7@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_7_s@2x.png"
          },
          { type: "free-delivery", text: "会员包邮",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_8@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_8_s@2x.png"
          },
          { type: "bank-card", text: "办理信用卡",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_9@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_9_s@2x.png"
          },
          { type: "credit", text: "查信用",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_10@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_10_s@2x.png"
          },
          { type: "huabei", text: "会员免息",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_11@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_11_s@2x.png"
          },
          { type: "phone-recycling", text: "旧机回收",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_12@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_12_s@2x.png"
          },
          { type: "service", text: "专属客服",
            icon: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_13@2x.png",
            icon_active: "http://static.ali.szqk-tech.com/images/custom-page/goodman-member/vip-detail/icon_13_s@2x.png"
          },
        ]
      }
    },
    mounted() {
      if (this.detailType)  this.currentItemType = this.detailType
    },
    methods: {
      iconChange(type) {
        if(type === this.currentItemType) {
          return true
        }
        return false
      },
      currentItemClass(data) {
        let ItemClass = "tabbar-item"
        if (this.currentItemType === data) {
          ItemClass = "tabbar-item active"
        }
        return ItemClass
      },
      selectItem(data) {
        if (data === this.currentItemType) return
        this.currentItemType = data
        this.$emit("onActiveUpdate", data)
      },
      scrollTo(nextNavKey) {

        const {container, scrollContainer} = this.$refs;
        if (!container || !scrollContainer || typeof scrollContainer.scrollTo !== 'function') {
          // 外部有 nextTick 操作，执行至此可能页面已 unmount
          return;
        }

        const selectedItem = Array.from(scrollContainer.children)
          .find(item => item.getAttribute('data-key') === nextNavKey);
        if (!selectedItem) {
          // 额外容错
          return;
        }

        let scrollOffsetLeft = 0;
        scrollOffsetLeft += selectedItem.offsetLeft + (selectedItem.offsetWidth / 2); // 使得定位起始位置变为视觉中点
        scrollOffsetLeft -= (container.clientWidth / 2); // 整体容器居中

        scrollContainer.scrollTo(scrollOffsetLeft, scrollContainer.scrollTop);
      },
    }
  }
</script>

<style scoped lang="scss">
.vip-detail-tabbar{
  background:linear-gradient(90deg,rgba(39,38,37,1) 0%,rgba(30,29,28,1) 100%);
  height: 1.9rem;
  position: relative;
  width: 100%;
  ul{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    flex-wrap: nowrap;
    white-space: nowrap; /* [1] */
    overflow-x: auto; /* [2] */
    -webkit-overflow-scrolling: touch; /* [3] */
    -ms-overflow-style: -ms-autohiding-scrollbar; /* [4] */
    height: 100%;
  }
  ul::-webkit-scrollbar {
    display: none;
  }

  .tabbar-item{
    text-align: center;
    padding-top: .3rem;
    display: inline-block;
    margin-right: .44rem;
    &:last-child{
      margin-right: .36rem;
      padding-right: .36rem;
      &.active{
        background-position: .1rem 1.6rem;
      }
    }
    &:first-child{
      margin-left: .36rem;
    }
    img{
      width: .8rem;
      display: inline-block;
    }
    p{
      color: #FED18E;
      font-size: .22rem;
      line-height: 1;
      margin-top: .06rem;
    }
    &.active{
      background-image: url("../../images/vip-detail/icon-selected.png");
      background-size: .78rem .12rem;
      background-repeat: no-repeat;
      background-position: center 1.6rem;
    }
  }
}
</style>
