<template>
  <div class="page-layout" v-if="data">
    <div class="page-header">
      <img :src="data.banner"/>
      <p>注：借款服务由第三方提供，本平台只负责对优质会员展示及推荐</p>
    </div>
    <div class="page-content">
      <!-- 数据是数组格式，则为tab切换 -->
      <template v-if="isTab">
        <org-tab :tab="data.vip"
                 :class="isToTop ? 'to-top' : 'tab-static'"
                 @onActiveTab="handleTabClick"/>
        <mt-tab-container v-model="activeTab" swipeable>
          <mt-tab-container-item :id="'tab_' + index" v-for="(item, index) in data.vip" :key="index">
            <org-block :data="item" @onActiveClick="toHref" v-if="data.vip" />
          </mt-tab-container-item>
        </mt-tab-container>
      </template>
      <!-- 数据内容单一数组，则列表显示 -->
      <template v-else>
        <org-block :data="data.vip" @onActiveClick="toHref" v-if="data.vip" />
      </template>
      <org-block :data="data.credit" @onActiveClick="toHref" v-if="data.credit" />
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex"
  import OrgBlock from './OrgBlock'
  import OrgTab from './OrgTab'

  export default {
    name: "index",
    components: {OrgBlock, OrgTab},
    data() {
      return {
        data: null,
        activeTab: "tab_0",
        isToTop: false,
        scrollTabOffTop: null
      }
    },
    computed: {
      ...mapState({
        isVip: state => state.global.userInfo.isVip,
        source: state => state.global.userInfo.source
      }),
      isTab() {
        return this.data && Object.prototype.toString.call(this.data.vip) === "[object Array]"
      }
    },
    mounted() {
      if (!this.isVip) {
        if (this.source !== "MGXD") {
          window.location.href = window.location.origin + '/custom-page/goodman-member/#/home'
          return false
        }
      }
      this.getData()
      this.$nextTick(() => {
        this.scrollTabOffTop = document.getElementById("orgTab").offsetTop
        window.addEventListener('scroll', this.scrollTabFixed)
      })
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.scrollTabFixed)
    },
    methods: {
      toHref(url) {
        window.location.href = url
      },
      getData() {
        if (process.env.NODE_ENV !== 'development') {
          fetch('/custom-page/jyc-xjd/static/org_loan.json').then(res=> res.json() ).then(res => {
            this.data = res
          })
        } else {
          this.data = require("../../../../public/static/org_loan")
        }
      },
      handleTabClick(data) {
        this.activeTab = data
      },
      // 处理页面滚动
      getScrollTop() {
        return document.documentElement.scrollTop || document.body.scrollTop;
      },
      // 滚动条吸顶
      scrollTabFixed() {
        if (this.getScrollTop() >= this.scrollTabOffTop) {
          this.isToTop = true;
        } else {
          this.isToTop = false;
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .page-layout {
    width: 100%;
    background-color: #f5f5f5;
    padding-bottom: .98rem;
    .page-header {
      img {
        width: 100%;
        max-height: 3rem;
        display: block;
      }
      p {
        padding: .22rem 0 .14rem .28rem;
        font-size: .22rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(168, 168, 168, 1);
        line-height: .32rem;
      }
    }
    .to-top {
      background-color: #fff;
      position: fixed;
      top: 0;
      z-index: 100;
      width: 100%;
      border-bottom: 1px solid rgba(200, 200, 200, 0.2);
    }
    .tab-static{
      position: relative;
    }
  }
</style>
