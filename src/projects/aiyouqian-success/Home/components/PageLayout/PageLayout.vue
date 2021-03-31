<template>
  <div class="page-layout">
    <div class="page-header">
      <img src="../../images/success.png">
      <h2>提交成功，申请已受理</h2>
      <p>预计1个工作日内完成审核</p>
      <p>请保持电话畅通，以便工作人员核实信息</p>
      <button @click="goHome">
        <p>返回首页</p>
      </button>
    </div>
    <div class="page-contentn banner">
      <img v-lazy lazy="error">
    </div>
  </div>
</template>

<script>
  import env from '@/helpers/env';
  export default {
    data() {
      return {
        isApp: env.isApp(),
        source: 'App',
      }
    },
    created() {
      this.getSource()
    },
    methods: {
      getSource() {
        const contract = this.$route.query.contract
        const source = contract ? contract.slice(0, 2) : 10;
        switch (parseInt(source)) {
          case 31:
            this.source = 'QIAKE-ETC';
            break;
          case 32:
            this.source = 'QIAKE-AQY';
            break;
          default:
            this.source = 'App';
            break;
        }
      },
      goHome() {
        if (this.isApp) {
          this.$nativeBridge.jumpToAppIndex();
        } else {
          window.location.href = window.location.origin + `/aiyong-shop/#/?sourceFlag=` + this.source
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  /*@import 'src/helpers/style.scss';*/

  .page-layout {
    background: #f2f2f2;
    min-height: inherit;
    padding-bottom: .98rem;
  }

  .page-header {
    background-color: #fff;
    text-align: center;
    position: relative;
    background-size: 100%;
    padding: 24px 15px;
    margin-bottom: .18rem;
    & img {
      width: 1.5rem;
      height: 1.5rem;
      display: inline-block;
      margin-bottom: .2rem;
    }
    & h2 {
      color: #363636;
      font-size: .48rem;
      margin-bottom: .2rem;
      line-height: 1;
    }
    & p {
      color: #a8a8a8;
      font-size: .24rem;
      line-height: 1.5;
    }
    & button {
      -webkit-appearance: none;
      background-image: url("../../images/button.png");
      background-repeat: no-repeat;
      background-color: transparent;
      border: none;
      background-size: 100% 100%;
      width: 4rem;
      height: 1rem;
      margin-top: .5rem;
      & p {
        font-size: .35rem;
        color: #fff;
        margin-top: -.2rem;
      }
    }
  }

  .banner img {
    width: 100%;
    height: 3rem;
    &[lazy=loading] {
      margin: auto;
      background: url("../../images/banner-default.png") no-repeat;
      background-size: 100% 100%;
    }
    &[lazy=error] {
      margin: auto;
      background: url("../../images/banner-default.png") no-repeat;
      background-size: 100% 100%;
    }
  }

</style>
