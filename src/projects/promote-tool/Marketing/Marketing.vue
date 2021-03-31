<template>
  <div class="register-wrap">
    <div class="register-content">
      <div class="register-button" @click="cashRightNow">立即拿钱</div>
    </div>
  </div>
</template>

<script>
  import {linkTap} from '@/helpers/utils'


  export default {
    data() {
      return {
      }
    },
    methods: {
      async cashRightNow() {
        linkTap('https://52yifu.com.cn/app.php/4387');
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  .register-wrap {
    background-image: url('http://static.ali.szqk-tech.com/images/channel/promote-tool-marketing-bg.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-color: #3177CA;
    height: 100%;
    overflow: auto;
    .register-content {
      margin-top: 6rem;
      padding: .56rem .3rem;
      .register-tel, .register-code {
        width: 100%;
        height: .88rem;
        background-color: #FBFBFB;
        border-radius: .4rem;
        display: flex;
        align-items: center;
        padding: .3rem;
        .code-input{
          display: flex;
          align-items: center;
          justify-content: center;
        }
        input {
          border: none;
          background-color: #FBFBFB;
          width: 70%;
          color: #A8A8A8;
        }
        input::-webkit-input-placeholder {
          color: #A8A8A8;
        }
        span {
          width: 30%;
          color: #222222;
        }
      }
      .register-tel {
        margin-bottom: .3rem;
      }
      .register-code {
        .code-input {
          width: 70%;
          input {
            width: 60%;
            border-right: 1px solid #E5E5E5;
            margin-right: 4%;
          }
          .get-code {
            color: #3477C9;
            width: 36%;
            display: inline-block;
            text-align: center;
          }
        }
      }
      .register-button {
        width: 100%;
        border-radius: .46rem;
        font-size: .36rem;
        font-weight: 600;
        color: #3477C9;
        padding: .3rem 0;
        text-align: center;
        background: #fff;
      }
      .content-des {
        text-align: center;
        img {
          margin-right: .08rem;
        }
        span {
          margin-right: .3rem;
        }
      }
    }
  }
</style>
