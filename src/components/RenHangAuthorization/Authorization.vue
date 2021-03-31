<template>
    <div class="page-layout">
        <div class="authorization-content">
            <div class="authorization-header">
                请完成授权提升信用
            </div>
            <ul class="authorization-form">
                <li>
                    <label>姓名</label>
                    <span type="text">{{form.name}}</span>
                </li>
                <li>
                    <label>身份证</label>
                    <span type="text">{{form.ident}}</span>
                </li>
                <li>
                    <label>银行卡号</label>
                    <span type="text">{{form.bankCardCode}}</span>
                </li>
                <li>
                    <label>所属银行</label>
                    <span type="text">{{form.bankName}}</span>
                </li>
                <li>
                    <label>手机号码</label>
                    <span type="text">{{form.bankPhone}}</span>
                </li>
                <li v-if="form.smsVerifySwitch">
                    <label>验证码</label>
                    <input type="text" v-model="form.vCode" maxlength="6" placeholder="请输入手机验证码"
                           class="check-code-input">
                    <span class="base-info-checekcode" v-if="!sendStatus" @click="getVcode">{{vMessage}}</span>
                    <span class="base-info-checekcode" v-else>重新获取<i v-if="timer > -1">{{timer}}s</i></span>
                </li>
            </ul>
        </div>
        <div class="authorization-bottom">
            <div class="authorization-btn">
                <button @click="goAuthorization">授权</button>
            </div>
            <div class="authorization-agree">
                <img :src="isChecked?require('./img/checked.png'):require('./img/unChecked.png')" alt=""
                     @click="goAgreement">
                <span>已阅读并同意</span>
                <span>《个人征信客户授权协议》</span>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapState, mapActions} from "vuex";

  export default {
    data() {
      return {
        sendStatus: false, // 验证码发生状态
        vMessage: "获取验证码",
        vCode: null, // 验证码
        isChecked: false,
        vTime: null, // 倒计时计时器
        timer: 60,
        locked: true,
        form: {
          name: '',
          ident: '',
          bankCardCode: '',
          bankName: '',
          bankPhone: '',
          vCode: '',
          smsVerifySwitch: ''
        }
      }
    },
    computed: {
      ...mapState({
        isSign: state => state.global.userInfo.isSign,
        userId: state => state.global.userInfo.userId,
        ucAccountId: state => state.global.userInfo.ucAccountId,
        idPerson: state => state.global.userInfo.idPerson,
        ident: state => state.global.userInfo.ident,
        phone: state => state.global.userInfo.phone,
        name: state => state.global.userInfo.name
      })
    },
    methods: {
      // 获取用户反显信息
      async getUserAuthorizationInfo() {
        let res = await this.$api.getUserAuthorization({userId: this.userId});
        if (res.code == 'sc0') {
          this.form = {...res.data};
          if (window.sessionStorage.getItem('vCode')) {
            this.form.vCode = JSON.parse(window.sessionStorage.getItem('vCode'));
          }
        } else {
          this.$toast(res.message);
        }
      },
      // 获取验证码
      async getVcode() {
        if (!this.isChecked) {
          return this.$toast("请阅读并同意相关协议");
        }
        const res = await this.$api.base.SendSmsCode({
          codeType: "ydFourElements",
          phone: this.form.bankPhone,
          userId: this.userId
        });
        if (res.code === 'sc0') {
          this.sendStatus = true;
          this.vTime = setInterval(this.calcTime, 1000);
        } else {
          this.$toast(res.message);
        }
      },
      calcTime() {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.vTime);
          this.sendStatus = false;
          this.timer = 60;
          this.vMessage = "重新发送";
        }
      },
      // 打开阅读协议
      goAgreement() {
        if (this.form.vCode) {
          window.sessionStorage.setItem('vCode', this.form.vCode);
        }
        this.$router.push('/agreement');
      },
      // 提交授权
      async goAuthorization() {
        if (!this.isChecked) {
          return this.$toast("请阅读并同意相关协议");
        }
        if (this.form.smsVerifySwitch && !this.form.vCode) {
          return this.$toast("请输入验证码");
        }
        // 防止用户重复点击
        if (this.locked) {
          this.locked = false;
          let res = await this.$api.postAuthorizationInfo({
            personId: this.idPerson,
            userId: this.userId,
            smsCode: this.form.vCode,
            phone: this.form.bankPhone
          });
          if (res.code == 'sc0') {
            this.$toast('授权成功');
            this.$emit('onActiveResult', res)
          } else {
            this.locked = true;
            this.$toast(res.message);
          }
        }
      }
    },
    created() {
      if (window.sessionStorage.getItem('isAgree')) {
        this.isChecked = true;
      }
      this.getUserAuthorizationInfo();
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (from.path == '/credit') {
          window.sessionStorage.removeItem('isAgree');
          window.sessionStorage.removeItem('vCode');
        }
      })
    }
  }
</script>

<style scoped lang="scss">
    .page-layout {
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .authorization-header {
            line-height: .6rem;
            background-color: #F2F2F2;
            color: #A8A8A8;
            padding: 0 .3rem;
            font-size: .24rem;
        }
        .authorization-form {
            background-color: #fff;
            li {
                line-height: 1.1rem;
                font-size: .3rem;
                margin-left: .3rem;
                & + li {
                    border-top: .5px solid #f3f3f3;
                }
                label {
                    display: inline-block;
                    color: #363636;
                    width: 26.14%;
                }
                span {
                    color: #A8A8A8;
                    width: 73.86%;
                    display: inline-block;
                }
                .check-code-input {
                    width: 45%;
                    color: #A8A8A8;
                    &::-webkit-input-placeholder {
                        color: #A8A8A8;
                    }
                    &::-moz-placeholder { /* Mozilla Firefox 19+ */
                        color: #A8A8A8;
                    }
                    &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                        color: #A8A8A8;
                    }
                    &:-ms-input-placeholder { /* Internet Explorer 10-11 */
                        color: #A8A8A8;
                    }
                }
                i {
                    display: block;
                    height: 0.46rem;
                    width: 0.46rem;
                    flex-shrink: 0;
                    background-size: 0.4rem;
                    background-position: center;
                    background-repeat: no-repeat;
                }
                .base-info-checekcode {
                    display: inline-block;
                    height: 0.5rem;
                    line-height: 0.5rem;
                    width: 24.86%;
                    flex-shrink: 0;
                    text-align: right;
                    font-size: 0.3rem;
                    color: #D09E54;
                    border-left: .5px solid #f3f3f3;
                    i {
                        display: inline;
                        list-style: none;
                        color: #D09E54;
                        font-size: .3rem;
                    }
                }
            }
        }
        .authorization-btn {
            padding: 0 .3rem;
            height: .92rem;
            button {
                width: 100%;
                border-style: none;
                color: #fff;
                font-size: .36rem;
                height: 100%;
                border-radius: .1rem;
                background: linear-gradient(to left, #D09E54, #E1BC78);
            }
        }
        .authorization-agree {
            text-align: center;
            line-height: .88rem;
            img {
                width: .28rem;
                height: .28rem;
                vertical-align: text-bottom;
                margin-right: .12rem;
                display: inline-block;
            }
            &:nth-child(2) {
                color: #A8A8A8;
                font-size: .24rem;
            }
            span:nth-child(3) {
                color: #D09E54;
                font-size: .24rem;
            }
        }
    }
</style>
