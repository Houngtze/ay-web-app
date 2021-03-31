<template>
  <div :class="$style.container" :style="{height: height}" ref="container">
    <ul :class="[$style.scroll, $style.list]" :style="{lineHeight: height, height: height}" ref="scrollContainer">
      <li
        v-for="item in navConf"
        :key="item.key"
        :data-key="item.key"
        :class="[$style.item, itemClass, ...(item.key === activeNavKey ? [$style.active, itemActiveClass] : [])]"
        @click.passive="handleClickNav(item)"
      >
        <span>{{item.text}}</span>
        <label v-if="item.extra && isShowLabel">{{item.extra}}</label>
      </li>
    </ul>
  </div>
</template>

<style module lang="scss">

  .container {
    position: relative;
    width: 100%;
  }

  /*
   * https://iamsteve.me/blog/entry/horizontal-scrolling-responsive-menu
   */
  /*
  [1]: All items a forced onto a single line, causing the overflow when necessary.
  [2]: Automatic overflow means a scroll bar won’t be present if it isn’t needed
  [3]: Make it smooth scrolling on iOS devices
  [4]: Hide the ugly scrollbars in Edge until the scrollable area is hovered
  [5]: Hide the scroll bar in WebKit browsers
  */
  .scroll {
    white-space: nowrap; /* [1] */
    overflow-x: auto; /* [2] */
    -webkit-overflow-scrolling: touch; /* [3] */
    -ms-overflow-style: -ms-autohiding-scrollbar; /* [4] */
  }

  /* [5] */
  .scroll::-webkit-scrollbar {
    display: none;
  }

  .list {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    flex-wrap: nowrap;
  }

  .item {
    padding: 0 1em;
    text-align: center;
  }

  .active {
    color: red;
  }

</style>

<script>
  export default {
    props: {
      height: {type: String, default: '2em'},
      activeNavKey: {type: String, required: true},
      navConf: {
        required: true,
        validator(value) {
          return Array.isArray(value) && value.every(item => item.key && item.text);
        },
      },
      onActiveNav: {type: Function, required: true},
      itemClass: String,
      itemActiveClass: String,
      isShowLabel: {type: Boolean, default: true},
    },
    data() {
      return {
        nextKeyViaClick: null,
      };
    },
    watch: {
      activeNavKey(newVal) {
        this.scrollTo(newVal);
      },
    },
    mounted() {
      this.$nextTick(() => {
        const doInitScroll = () => {
          this.scrollTo(this.activeNavKey);
        };
        doInitScroll();
        // 可能尚未渲染完成，重试多次滚动，减少闪烁
        let intervalCount = 0;
        const intervalHandler = setInterval(() => {
          intervalCount++;
          doInitScroll();
          if (intervalCount >= 10) {
            clearInterval(intervalHandler);
          }
        }, 20);
      });
    },
    methods: {
      handleClickNav(item) {
        this.nextKeyViaClick = item.key;
        this.onActiveNav(item.key);
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
    },
  };
</script>
