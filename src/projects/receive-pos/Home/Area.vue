<template>
  <div>
    <div class="mask" @click="togglePopup" @touchmove.stop.prevent></div>
    <div class="address-container">
      <div class="top">
        <div class="top-center">
          所在地区
        </div>
        <div class="top-right" @click="togglePopup">

        </div>
      </div>
      <div class="address">
        <div class="item" v-for="(value, $index) in address" @click="changeSelect($index, value)"
             :class="{selected: index === $index}">{{value.name}}
        </div>
        <div class="item last-item" :class="{selected: index === -1}" @click="changeSelect(-1)" v-if="isShow">请选择</div>
      </div>
      <div class="address-list">
        <div class="list-item" :data-code="value.code" v-for="(value, index) in data " :key="index"
             @click="add(value)"
        >{{value.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  /*
   *选择地址组件
   * 使用方法：
   * 接受父组件参数：
   * multiLevel [number] 地址层级
   * source [array] 修改时的地址数据  array---》 [object] {name: 名称, code: key}
   * callback 选择完成后的回调
   * showAddressPop: 触发显示隐藏
   */
  export default {
    name: 'areaAddress',
    data() {
      return {
        address: [],
        index: -1,
        // 是否重新选
        reElection: false,
        // code的索引记录
        parentIdList: [0],
        data: [],
        cacheData: {},
        addressListDom: '',
        isShow: true,
        isLock: false
      }
    },
    props: ['multiLevel', 'source'],
    async mounted() {
      // 父组有传值要进行合并
      if (this.source && this.source.length !== 0) {
        let parentIdList = []
        this.source.length >= 3 ? (this.isShow = 0) : (this.isShow = true)
        this.address = [].concat(this.source)
        this.address.forEach((value) => {
          parentIdList.push(value.code)
        })
        this.parentIdList = this.parentIdList.concat(parentIdList)
        this.reElection = true
      }
      // 初始化，获取数据
      this.index = 0
      this.addressListDom = document.getElementsByClassName('address-list')[0]
      await this.getAddressData(this.parentIdList[this.index])
    },
    methods: {
      /**
       * 添加一个值（省/市/区）
       * @param {object} event - click
       */
      add(item) {
          if (this.isLock) {
            return
          }
          let data = {
            name: item.name,
            code: item.code
          }
          // 重新选的话清空后面的地址
          if (this.reElection && this.index !== -1) {
            this.reElection = false
            this.address = this.address.slice(0, this.index)
            this.parentIdList = this.parentIdList.slice(0, this.index + 1)
          }
          this.parentIdList.push(data.code)
          this.address.push(data)
          // -1为：请选择，这个的样子控制
          this.index = -1
          this.isShow = 1
          // 组件接受的最大层级
          if (this.address.length >= this.multiLevel) {
            this.doneCallBack()
          } else {
            this.getAddressData(data.code, 1)
          }
      },
      /**
       * 切换地址选择
       * @param {number} index
       * @param {object} value
       */
      changeSelect(index, value) {
        this.index = index
        if (value) {
          this.reElection = true
          // 用当前选择索引的code获取列表
          this.getAddressData(this.parentIdList[index])
        } else {
          // 针对点击了 请选择，这个dom的情况
          this.getAddressData(this.parentIdList[this.parentIdList.length - 1])
        }
      },
      /**
       * 获取服务器数据
       * @param {string} key - code
       * @param {boolean} isDelete
       */
      async getAddressData(key, isDelete) {
        this.isLock = true
        this.addressListDom.scrollTop = 0
        let self = this
        await self.$api.getAddressData({parentId: +key}).then((res) => {
          if (res.result === 'success') {
            // 针对，某些地区没有下一级附属地址，直接返回
            if (!res.data.length) {
              self.doneCallBack()
            } else {
              self.data = res.data
            }
          } else {
            // add事件中，查询失败要将之前添加的删除
            if (isDelete) {
              self.parentIdList.pop()
              self.address.pop()
            }
          }
        })
        this.isLock = false
      },
      togglePopup() {
        this.$emit('showAddressPop')
      },
      doneCallBack() {
        this.$emit('callback', this.address)
        this.togglePopup()
      },
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #000;
    opacity: 0.6;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }

  .address-container {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9999;
    width: 100%;
    background-color: white;
    color: #4A4A4A;
    .top {
      display: -webkit-box;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      padding: 0.2rem 0.4rem 0 0.4rem;
      background-color: #fff;
      color: #4A4A4A;
      .top-center {
        -webkit-box-flex: 1;
        flex-grow: 1;
        text-align: center;
        font-size: .3rem;
      }
      .top-right {
        position: relative;
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 0.3rem;
        text-align: center;
        line-height: 0.3rem;
        color: white;
        overflow: hidden;
        &::after, &::before {
          content: "";
          display: block;
          position: absolute;
          top: 50%;
          border: 0.002rem solid white;
          background-color: white;
          border-radius: 0.05rem;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          width: 0.2rem;
          height: 0.03rem;
        }
        &::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }
      }
    }
    .address {
      font-size: 0.3rem;
      .item {
        color: #4A4A4A;
        margin: 0 0.1rem;
        padding: 0.2rem 0.1rem;
        display: inline-block;
      }
      .selected {
        color: #eed496;
        border-bottom: 0.025rem solid #343434
      }
    }
    .address-list {
      margin: 0rem 0 0 0.2rem;
      height: 6rem;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .list-item {
        font-size: 0.28rem;
        margin: 0.1rem 0;
        padding: 0.1rem 0;
      }
    }
  }
</style>
