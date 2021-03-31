<template>
  <div class="page-layout">
    <!-- 顶部选择器 -->
    <vip-detail-tabbar :detailType="detailType" @onActiveUpdate="updateDetailType" ref="ScrollTabs"/>
    <!-- 动态内容组件 -->
    <component :is="detailComponent" :isVip="isVip" v-if="detailType" class="fadeIn animated"/>
    <!-- 支付按钮 -->
    <div class="pay-btn" @click="toPay">
      <button>
        立即开通¥199/年<span>(季卡仅需79元)</span>
      </button>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import VipDetailTabbar from './components/VipDetailTabbar'

  export default {
    name: "VipDetail",
    components: {
      VipDetailTabbar
    },
    data() {
      return {
        detailType: null,
        detailComponent: null,
        openVipData: null,
        zfbFormHtml: null,
        vipListData: null,
        termStatic: true
      }
    },
    computed: {
      ...mapState('vip', {
        vipData: state => state.vipData
      }),
      isVip() {
        return this.vipData && this.vipData.vip
      }
    },
    watch: {
      detailType(newVal) {
        if (newVal) {
          this.loadComponent(newVal)
          this.$refs.ScrollTabs.scrollTo(newVal)
        }
      }
    },
    async created() {
      // 动态组件，根据获取的页面类型加载不同页面组件
      if (this.$route.params.type) {
        this.detailType = this.$route.params.type
      } else {
        this.$router.replace({path:'/404'})
      }
      if (!this.vipData) this.updateVipData()
    },
    methods: {
      ...mapActions('vip',['updateVipData']),
      // 动态获取组件
      async loadComponent(val) {
        await import(`./components/${val}`).then(async (res) => {
          this.detailComponent = () => import(`./components/${val}`)
        }).catch(() => {
          this.$router.replace({path:'/404'})
        })
      },
      updateDetailType(val) {
        this.detailType = val
        this.$router.replace({path: `/vip-detail/${val}`})
      },
      // 立即支付
      toPay() {
        this.$router.push({path: "/vip-pay"})

      }
    }
  }
</script>

<style scoped lang="scss">
  .page-layout{
    width: 100%;
    height: 100%;
    min-height: inherit;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    & .page-content{
     width: 100%;
      padding-bottom: 1.98rem;
    }
    /deep/ .block-title{
      width: 100%;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: left;
      & span{
        font-size: .3rem;
        font-weight:400;
        color:rgba(54,54,54,1);
        line-height: 1;
        vertical-align: middle;
      }
      & img{
        width: .36rem;
        height: .36rem;
        display: inline-block;
        vertical-align: middle;
        margin-right: .1rem;
      }
    }
    /deep/ .intro-block{
      width: 100%;
      background: #fff;
      padding: .3rem;
      & h2{
        margin-bottom: .2rem;
      }
      & > p.desc{
        font-size: .26rem;
        font-weight:400;
        color: #868686;
        line-height: .42rem;
      }
      &:last-child{
        .block-title{
          & img{
            width: .28rem;
            height: .32rem;
            margin-right: .14rem;
          }
        }
      }
    }
    /deep/ .banner-block{
      width: 100%;
      background-color: #fff;
      img{
        width: 100%;
        min-height: 2rem;
        display: block;
        &[lazy=loading] {
          margin: auto;
          background: url("http://static.ali.szqk-tech.com/images/custom-page/goodman-member/banner-default.png") no-repeat;
          background-size: 100% 100%;
        }
        &[lazy=error] {
          margin: auto;
          background: url("http://static.ali.szqk-tech.com/images/custom-page/goodman-member/banner-default.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .pay-btn{
      position: fixed;
      bottom: 0;
      padding: .22rem;
      width: 100%;
      button{
        border: none;
        width: 100%;
        height: 1rem;
        background: linear-gradient(90deg, #372F26 0%, #2C251E 100%);
        border-radius: .51rem;
        color: #F6DFB9;
        font-size: .36rem;
        span{
          font-size: .24rem;
        }
      }
    }
  }
</style>
