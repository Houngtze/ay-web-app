<template>
  <div :class="stateClass" :style="stateStyle">
    <slot/>
  </div>
</template>

<style scoped lang="scss">
  .sale-page-layout {
    display: flex;
    flex-direction: column;
    position: relative;
    --webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;

    width: 100%;
    overflow-x: hidden;

    @media (min-width: 640px) {
      width: 640px;
      margin: 0 auto;
    }
  }
</style>

<script>
  // import throttle from 'lodash.throttle';

  export default {
    props: {
      isFullScreen: Boolean,
    },
    data() {
      return {
        stateStyle: {
          minHeight: 'auto',
        },
      };
    },
    computed: {
      stateClass: {
        get() {
          return [
            'sale-page-layout',
            this.isFullScreen ? 'full-screen' : 'normal-screen',
            'js-g-sale-page-layout',
          ];
        },
      },
    },
    created() {
      // this.handleWindowResize = throttle(this.handleWindowResize, 100);
    },
    beforeMount() {
      // 使用 resize，而非 orientationchange。orientationchange 在不同设备上行为不完全一致
      window.addEventListener('resize', this.handleWindowResize);
    },
    mounted() {
      this.calculateWidthHeight();
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleWindowResize);
    },
    methods: {
      handleWindowResize() {
        this.calculateWidthHeight();
      },
      calculateWidthHeight() {
        // 外部已集成 rem 控制，禁止水平滚动
        // 1. 非全屏场景
        //    width: 100%; height: auto;
        // 2. 全屏场景
        //    width: 100%; height: auto; min-height: 按宽度设计稿推算高度; 在范围有限内尽可能全屏
        // 3. 对于任何模式，设置最大width为640px，已解决 pad/横屏手机的过宽问题

        const LIMIT_CONTENT_WIDTH = 640;
        const DESIGN_RATIO = 750 / 1206;
        const deviceWidth = window.innerWidth;
        const deviceHeight = window.innerHeight;// document.documentElement.clientHeight 有兼容性问题

        let targetMinHeight;
        if (this.isFullScreen) {
          const designHeight = Math.min(deviceWidth, LIMIT_CONTENT_WIDTH) / DESIGN_RATIO;
          const minDesignScaleHeight = designHeight * 0.8;
          const maxDesignScaleHeight = designHeight * 1.25;
          if (deviceHeight >= minDesignScaleHeight && deviceHeight <= maxDesignScaleHeight) {
            targetMinHeight = deviceHeight;
          } else if (deviceHeight < minDesignScaleHeight) {
            targetMinHeight = minDesignScaleHeight;
          } else if (deviceHeight > maxDesignScaleHeight) {
            targetMinHeight = maxDesignScaleHeight;
          } else {
            targetMinHeight = designHeight;
          }
          // 额外容错，减少小数和个位像素偏移
          if (Math.abs(targetMinHeight - deviceHeight) < 10) {
            targetMinHeight = deviceHeight;
          }
          targetMinHeight += 'px';
        } else {
          targetMinHeight = 'auto';
        }

        this.stateStyle = {
          ...this.style,
          minHeight: targetMinHeight,
        };
      },
    },
  };
</script>
