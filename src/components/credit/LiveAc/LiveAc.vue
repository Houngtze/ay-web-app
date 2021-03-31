<template>
  <div class="liveAc">
    <progress-bar :index=0></progress-bar>
    <div class="content">
      <div>
        <span class="icon"></span>
        <span class="message">请正对手机进行人脸识别</span>
      </div>
    </div>
    <div class="live-footer">
      <protocol-item
        :linkArr="linkArr"
        @handleStatus="handleStatus">
      </protocol-item>
      <div class="live-btn">
        <button @click="getAppAuthentication" :disabled="!checked">{{btnMes}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import ProgressBar from '../components/Progress.vue'
import ProtocolItem from '../components/ProtocolItem.vue'
import {mapState, mapActions} from 'vuex'
import qs from 'querystringify';
export default {
  components: {
    ProgressBar,
    ProtocolItem
  },
  data() {
    return {
      checked: true,
      linkArr: [{
        title: '《征信授权书》',
        url: 'http://aiyong.dafysz.cn/terms/personal-authoritzation.html'
      }],
      isCb: false, // 是否回调状态
      btnMes: '开始',
      AuthenInfo: {}
    }
  },
  computed: {
    ...mapState({
      userId: state => state.global.userInfo.userId,
      idPerson: state => state.global.userInfo.idPerson,
      source: state => state.global.source,
      creditStartTime: state =>state.credit.creditStartTime,
    })
  },
  created () {
    this.getQueryInfo()
  },
  methods: {
    ...mapActions('credit', ['setCreditStartTime']),
    async getAppAuthentication() {
      if (this.isCb) {
        if (window.location.href.indexOf('?') !== -1) {
          let url = window.location.href.split('?')[0];
          url = `${url}#/identityAc`;
          window.location.replace(url)
        } else {
          this.$router.replace({path: '/identityAc'});
        }
      } else {
        const res = await this.$api.credit.getAppAuthentication({userId: this.userId})
        if (res.code === 'sc0') {
          this.livelogin(res.data)
          this.AuthenInfo = res.data
        } else {
          this.$toast('视频认证启动失败，请重新重试')
        }
      }
    },
    handleStatus(val) {
      this.checked = val
    },
    livelogin(data) {
      this.setCreditStartTime(); // 记录授信开始时间
      const param = {
        webankAppId: data.appId,
        version: data.version, // 接口版本号
        nonce: data.nonceStr, // 随机数
        orderNo: data.orderNo, // 订单号
        url: encodeURIComponent(`${window.location.origin}/aiyong-shop/#/liveAc`), // 需要第三方提供完整 URL 且做 URL Encode
        userId: data.userId, // 用户 ID
        sign: data.sign // 签名
      }
      const url = `https://ida.webank.com/api/web/livelogin?${qs.stringify(param)}`
      window.location.replace(url);
    },
    async getQueryInfo() {
      let data = window.location.search;
      data = qs.parse(data);
      const kesArr = Object.keys(data)
      if (kesArr.length === 0) return // 表示非人脸回调
      if (!this.userId) this.$messagebox('当前浏览器不支持，请切换其他浏览器')
      const param = {
        apiType: '202',
        channel: 'H5',
        merchantName: '微众银行',
        orderNo: data.orderNo,
        creditStartTime: this.creditStartTime,
        product: 'AMFT',
        value: data.liveRate,
        userId: this.userId,
        idPerson: this.idPerson,
        source: this.source,
      }
      const res = await this.$api.credit.livingDetection(param)
      if (res.code === 'sc0') {
        this.$toast('视频认证成功')
        this.isCb = true
        this.btnMes = '下一步'
        let url = window.location.href.split('?')[0];
        url = `${url}#/identityAc`;
        window.location.href = url
      } else {
        this.isCb = false
        this.btnMes = '开始'
        this.$toast('视频认证失败，请重新认证')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
.liveAc{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .content{
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    div{
      .icon{
        display: block;
        height: 4rem;
        width: 4rem;
        @include bg-image('../image/bg-live');
        background-size: 100%;
        margin-bottom: 0.3rem;
      }
      .message{
        display: block;
        text-align: center;
        color: $color-main;
        font-size: 0.3rem;
      }
    }
  }
  .live-footer{
    flex-shrink: 0;
    /deep/ .protocol-item{
      height: auto;
    }
    .live-btn{
      width: calc(100% - 0.6rem);
        height: 0.92rem;
        margin: 0.3rem;
        button{
          @extend %btn;
          @include bg-image('../image/bg-btn');
          &:active{
            @include bg-image('../image/bg-btn-active');
          }
        }
    }
  }
}
</style>
