<template>
  <div class="mint-bar">
    <mt-popup v-model="popupVisible" position="bottom" class="mint-bar-popup">
      <mt-picker :slots="slots" :show-toolbar="true" @change="onMyAddressChange" :visible-item-count="5" value-key="name" ref="picker">
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
      slots: [],
      data: []
    };
  },
  watch: {
    slotArr: {
      handler(val) {
        this.setSlotArr(val)
      },
      deep: true
    }
  },
  created() {
    this.setSlotArr(this.slotArr)
  },
  methods: {
    setSlotArr(arr) {
      if (arr.length>0) {
        this.slots = [
          {
            flex: 1,
            defaultIndex: 0,    
            values: arr,  //省份数组
            className: 'slot1',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: arr[0].array,
            className: 'slot3',
            textAlign: 'center'
          },
          {
            divider: true,
            content: '-',
            className: 'slot4'
          },
          {
            flex: 1,
            values: arr[0].array[0].array,
            className: 'slot5',
            textAlign: 'center'
          }
        ];
        this.data = [
          {
            name: arr[0].name,
            code: arr[0].code
          },
          {
            name: arr[0].array[0].name,
            code: arr[0].array[0].code
          },
          {
            name: arr[0].array[0].array[0].name,
            code: arr[0].array[0].array[0].code
          },
        ]
      }
    },
    handleCancle() {
      this.popupVisible = false;
    },
    handleConfirm() {
      this.popupVisible = false
      this.$emit('handleAddress', this.data)
    },
    open() {
      this.popupVisible = true;
    },
    onMyAddressChange(picker, values) {
      if (values[0]) {
        picker.setSlotValues(1, values[0].array);
        // console.log(values)
        picker.setSlotValues(2, values[1].array);
        // if (values[1] && values[1].code !== values[0].array[0].code){
        //   picker.setSlotValues(2, values[0].array[0].array);
        // } else {
        //   picker.setSlotValues(2, values[1].array);
        // }
        this.data = values
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
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
@import '../style/index.scss';
.mint-bar{
  .picker-toolbar{
    height: 1rem;
    border-bottom: 0.03rem solid $bd-color-main;
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

