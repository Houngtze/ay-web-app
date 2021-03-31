<template>
  <div class="org-tab" id="orgTab">
    <mt-navbar v-model="activeTab">
      <mt-tab-item :id="'tab_' + index" v-for="(item, index) in tabData" :key="index">{{item}}</mt-tab-item>
    </mt-navbar>
  </div>
</template>

<script>
  export default {
    name: "OrgTab",
    props: ["tab"],
    data() {
      return {
        tabData: null,
        activeTab: "tab_0"
      }
    },
    watch: {
      activeTab(newVal) {
        if (newVal) {
          this.$emit("onActiveTab", newVal)
        }
      }
    },
    mounted() {
      this.tabData = this.tab.map(item => {
        return item.title.tabTitle
      })
    },
  }
</script>

<style scoped lang="scss">
  .org-tab {
    /deep/ .mint-tab-item {
      padding: 0;
      line-height: .98rem;
      & .mint-tab-item-label {
        line-height: .98rem;
        font-size: .3rem;
        color: #333333;
        display: inline-block;
        font-weight: 600;
      }
      &.is-selected {
        border: none;
        & .mint-tab-item-label {
          color: #D09E54;
          line-height: .95rem;
          border-bottom: 0.06rem solid #D09E54;
        }
      }
    }
  }
</style>
a
