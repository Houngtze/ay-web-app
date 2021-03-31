<template>
  <div class="option-selector" v-if="currentData">
    <h3>{{currentData.selectorTitle}}</h3>
    <div class="option">
      <ul>
        <li v-for="(item, index) in currentData.option" :key="index" @click.passive="select(item)">
          {{item.label}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OptionSelector",
    props: ["data", "selectIndex"],
    data() {
      return {
        currentData: null
      }
    },
    watch: {
      selectIndex(newVal) {
       if (Object.prototype.toString.call(newVal) === "[object Number]") {
         this.currentData = this.data[newVal]
       }
      }
    },
    methods: {
      select(data) {
        const selectData = {
          title: this.currentData.panelTitle,
          label: data.label,
          value: data.value,
          type: this.currentData.type
        }
        this.$emit("onActiveSelect", selectData)
      }
    },
  }
</script>

<style scoped lang="scss">
.option-selector{
  width: 100%;
  min-height: 4rem;
  background: #FFFFFF;
  border-radius: .16rem;
  padding: .28rem;
  h3{
    font-size: .36rem;
    font-weight: 500;
    color: #363636;
    line-height: .5rem;
    text-align: center;
    margin-bottom: .16rem;
  }
  ul{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
  }
  li{
    width: 3.06rem;
    background: #FFFFFF;
    border-radius: .12rem;
    border: .02rem solid #D99C45;
    font-size: .32rem;
    font-weight: 600;
    color: #D99C45;
    line-height: .72rem;
    text-align: center;
    margin-bottom: .28rem;
  }
}
</style>
