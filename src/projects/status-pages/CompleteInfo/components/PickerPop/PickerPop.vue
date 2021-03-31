<template>
  <div class="mint-bar">
    <mt-popup v-model="popupVisible" position="bottom" class="mint-bar-popup">
      <mt-picker :slots="slots" :show-toolbar="true" :visible-item-count="5" value-key="val" ref="picker">
        <div class="mint-picker-btn">
          <button @click="handleCancle">取消</button>
          <button @click="handleConfirm" class="sure">完成</button>
        </div>
      </mt-picker>
    </mt-popup>
  </div>
</template>
<script>
export default {
  props: ["slotArr"],
  data() {
    return {
      popupVisible: false,
      slots: []
    };
  },
  watch: {
    slotArr: {
      handler(val) {
        this.slots = [
          {
            flex: 1,
            values: [].concat(val),
            textAlign: "center"
          }
        ];
      },
      deep: true
    }
  },
  created() {
    this.slots = [
      {
        flex: 1,
        values: [].concat(this.slotArr),
        textAlign: "center"
      }
    ];
  },
  methods: {
    handleCancle() {
      this.popupVisible = false;
    },
    handleConfirm() {
      const res = this.$refs.picker.getValues()[0];
      const val = res.val;
      const index = res.index;
      this.popupVisible = false
      this.$emit('handleValue', val ,index)
    },
    open() {
      this.popupVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'src/style/index.scss';
.mint-bar-popup {
  width: 100%;
  .mint-picker-btn {
    display: flex;
    width: 100%;
    height: 1rem;
    justify-content: space-between;
    button {
      border: none;
      background: none;
      padding: 0 0.3rem;
      font-size: 0.34rem;
      color: $color-main;
      &.sure {
        color: $color-gold;
      }
    }
  }
}
</style>
<style lang="scss">
@import 'src/style/index.scss';
.mint-bar{
  .picker-toolbar{
    height: 1rem;
    border-bottom: 0.01rem solid $bd-color-main;
  }
  .picker-item{
    height: 0.8rem;
    font-size: 0.3rem;
    color: $color-gray;
    &.picker-selected{
      font-size: 0.38rem;
      color: $color-main;
    }
  }
}

</style>

