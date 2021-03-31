<template>
  <div class="progress">
    <ul v-if="progressConfig">
      <li :class="progressConfig.index >= index ? 'active' : ''"
          v-for="(item, index) in progressConfig.textArr"
          :key="index">
        <div>
          <span :class="index > 0 ? 'progress-line' : 'progress-line hidden'"></span>
          <span class="progress-dot"></span>
          <span :class="index < progressConfig.textArr.length
                && index !== (progressConfig.textArr.length - 1)
                ? 'progress-line' : 'progress-line hidden'"></span>
        </div>
        <span class="progress-item-dec">{{item.text}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    progressConfig: {
      required: true,
      type: Object
    },
  }
};
</script>
<style lang="scss" scoped>
@import '../../style/index';
.progress {
  background-color: #f2f2f2;
  padding-bottom: .18rem;
  ul {
    background-color: $bg-color-white;
    display: flex;
    width: 100%;
    padding: 0 .34rem;
    li {
      display: flex;
      flex: 1;
      padding: 0.3rem 0;
      flex-direction: column;
      justify-content: center;
      &:last-child{
        div{
          position: relative;
          .progress-money{
            display: inline-block;
            height: 0.3rem;
            line-height: 0.3rem;
            width: 1.2rem;
            transform: scale(0.8,1);
            position: absolute;
            white-space: nowrap;
            top: -0.2rem;
            left: 0.6rem;
            font-size: 0.18rem;
            color: $color-white;
            border-radius: 0.28rem;
            background-color: #f63337;
          }
        }
      }
      &.active{
        div{
          .progress-dot{
            @include bg-image('./images/icon-pg-dot-a');
          }
          .progress-line{
            @include bg-image('./images/icon-pg-line-a');
          }
        }
        span{
          color: $color-main;
        }
      }
      div{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 0.18rem;
        .progress-dot{
          width: 0.46rem;
          height: 0.46rem;
          @include bg-image('./images/icon-pg-dot');
          background-size: 100%;
        }
        .progress-line{
          flex: 1;
          height: 0.04rem;
          @include bg-image('./images/icon-pg-line');
          background-size: 100%;
          &.hidden{
            visibility: hidden;
          }
        }
      }
      span{
        text-align: center;
        font-size: 0.24rem;
        color: $color-gray;
      }
    }
  }
}
</style>
