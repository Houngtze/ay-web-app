<template>
  <div class="protocol-item">
    <div>
      <label :class="{checked}" @click="checked = !checked"></label>
      <p>
        本人已阅读并同意
        <a
          v-for="(item,index) in linkArr"
          :key="index"
          :href="item.url">
          {{item.title}}
          <span v-if="index < linkArr.length - 1">及</span>
          </a>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['linkArr'],
  data() {
    return {
      checked: true
    }
  },
  watch: {
    checked(val) {
      this.$emit('handleStatus', val)
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
.protocol-item {
  height: 1.1rem;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    label {
      display: block;
      height: 0.28rem;
      width: 0.28rem;
      margin-right: 0.12rem;
      flex-shrink: 0;
      @include bg-image("../image/icon-check");
      background-size: 100% 100%;
      &.checked {
        @include bg-image("../image/icon-checked");
      }
    }
    p {
      font-size: 0.24rem;
      color: $color-gray;
      a {
        color: $color-gold;
        &:visited {
          color: $color-gold;
        }
        span{
          color: $color-gray;
        }
      }
    }
  }
}
</style>
