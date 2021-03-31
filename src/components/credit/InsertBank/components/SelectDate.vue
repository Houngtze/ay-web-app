<template>
  <div class="select-date">
    <mt-popup class="pop-select-mmyy" :closeOnClickModal="canModal" v-model="shower" position="bottom">
      <div class="bnt-top">
        <span class="sp">年</span>
        <span class="sp"> / </span>
        <span class="sp">月</span>
        <div class="box">
          <p class="bnt" @click="submitSelectDate">确定</p>
          <p class="bnt" @click="closeSelectDate">取消</p>
        </div>
      </div>
      <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
export default {
  props:{
    shower:false,
  },
  data() {
    return {
      canModal:false,
      selectMMYY:false,
      slots: [
        {
          flex: 1,
          values: ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
          className: 'slot3',
          textAlign: 'right'
        }, 
        {
          divider: true,
          content: '/',
          className: 'slot2'
        }, 
        {
          flex: 1,
          values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          className: 'slot1',
          textAlign: 'left'
        }
      ],
      validityDate:null,
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    onValuesChange(picker, values) {
      this.validityDate=values[0]+values[1];
    },
    submitSelectDate(){
      this.$emit('submitSelectDate',this.validityDate);
      this.closeSelectDate();
    },
    closeSelectDate(){
      this.$emit('closeSelectDate');
    }
  }
}
</script>
<style lang="scss" scoped>
.select-date{
  .pop-select-mmyy{
    width: 100%;
    .bnt-top{
      text-align: center;      
      clear:both;
      overflow: hidden;
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      padding: 0.2rem;
      .sp{
        font-size: 0.36rem;
      }
      .box{
        position: absolute;
        right: 0.2rem;
        top: 0.2rem;
        display: flex;
        justify-content: space-between;
        .bnt{
          padding: 0.05rem 0.2rem;
          border: 0.01rem solid #e5e5e5;
          margin: 0 0.05rem; 
        }
      }
    }
  }
}
</style>
