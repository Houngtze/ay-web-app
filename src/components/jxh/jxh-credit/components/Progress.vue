<template>
  <div class="progress">
    <ul>
      <li :class="{actived: index > 0}">
        <div>
          <span class="progress-dot"></span>
          <span class="progress-line"></span>
        </div>
        <span class="progress-item-dec">身份认证</span>
      </li>
      <li :class="{actived: index > 1}">
        <div>
          <span class="progress-line"></span>
          <span class="progress-dot"></span>
          <span class="progress-line"></span>
        </div>
        <span class="progress-item-dec">视频认证</span>
      </li>
      <li :class="{actived: index > 2}">
        <div>
          <span class="progress-line"></span>
          <span class="progress-dot"></span>
        </div>
        <span class="progress-item-dec">个人信息</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    money: {
      type: Number,
      default: 20
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
.progress {
  margin-bottom: .18rem;
  ul {
    display: flex;
    width: 100%;
    background-color: $bg-color-white;
    li {
      display: flex;
      width: 33.3%;
      padding: 0.3rem 0;
      flex-direction: column;
      justify-content: center;
      &:last-child{
        div{
          position: relative;
          justify-content: flex-start;
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
      &.actived{
        div{
          .progress-dot{
            @include bg-image('../image/icon-pg-dot-a');
          }
          .progress-line{
            @include bg-image('../image/icon-pg-line-a');
          }
        }
        span{
          color: $color-gold;
        }
      }
      div{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 0.18rem;
        .progress-dot{
          width: 0.46rem;
          height: 0.46rem;
          @include bg-image('../image/icon-pg-dot');
          background-size: 100%;
        }
        .progress-line{
          width: 1.2rem;
          height: 0.04rem;
          @include bg-image('../image/icon-pg-line');
          background-size: 100%;
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
