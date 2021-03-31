<template>

  <mt-popup
    v-model="popupVisible"
    :class="$style.container"
    :closeOnClickModal="false"
  >
    <div flex-center-center :class="$style.header" :style="extraStyle && extraStyle.header">
      <h2 v-if="title">{{title}}</h2>
      <h3 v-if="desc">{{desc}}</h3>
      <slot name="headerExtra"></slot>
    </div>
    <div :class="$style.content" :style="extraStyle && extraStyle.content">
      <slot/>
    </div>
    <div :class="$style.footer" :style="extraStyle && extraStyle.footer">
      <mt-button
        type="primary"
        :class="buttonClass"
        v-for="(btn, idx) in buttons"
        :key="idx"
        :disabled="btn.disabled !== undefined && btn.disabled"
        @click="btn.onClick"
        data-growing-container
        :data-growing-title="btn.text"
      >
        {{btn.text}}
      </mt-button>
    </div>
  </mt-popup>

</template>


<script>
  export default {
    props: {
      title: {
        required: false,
        type: String,
      },
      extraStyle: {
        type: Object,
      },
      desc: {
        type: String,
      },
      buttons: {
        required: true,
        // TODO
      },
      buttonClass: {
        type: String,
      },
    },
    data() {
      return {
        popupVisible: true,
      };
    },
  };
</script>

<style module lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    width: 85%;
    min-height: 38.2%;
    margin-top: 5%;
    height: 78%;
    border-radius: 4px;
  }

  .header {
    flex-grow: 0;
    padding: 13px 0 13px;
    border-bottom: 1px #ececec solid;
    text-align: center;
    h2 {
      font-size: 17px;
      color: #363636;
    }
    h3 {
      font-size: 12px;
      color: #a8a8a8;
      margin-top: 6px;
    }
  }

  .content {
    flex-grow: 1;
    overflow: scroll;
    margin-bottom: 71px; // TODO 假定只有一个按钮
  }

  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 15px;
    button {
      // TODO
      width: 100%;
    }
  }
</style>
