<template>
  <div class="liveAc">
    <progress-bar :index=2></progress-bar>
    <div class="content">
      <h4>正确示意流程</h4>
      <img src="../image/live-example.png">
      <h3>录制时，普通话大声读如下数字</h3>
      <ul class="example-number">
        <li>{{ parseInt(Math.random() * 10) }}</li>
        <li>{{ parseInt(Math.random() * 10) }}</li>
        <li>{{ parseInt(Math.random() * 10) }}</li>
        <li>{{ parseInt(Math.random() * 10) }}</li>
      </ul>
      <p>正对屏幕 录制3~5秒</p>
    </div>
    <div class="live-footer">
      <div class="live-btn">
        <button @click="getAppAuthentication" :disabled="!checked">{{btnMes}}</button>
        <protocol-item
          :linkArr="linkArr"
          @handleStatus="handleStatus">
        </protocol-item>
      </div>
    </div>
  </div>
</template>
<script>
import ProgressBar from '../components/Progress.vue'
import ProtocolItem from '../components/ProtocolItem.vue'
import {mapState, mapActions} from 'vuex'
import {queryToString} from '@/helpers/utils'
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
        url: 'http://3c.dafysz.cn/h5/sales/#/CashRouter/LoanService/CreditGrant'
      },{
        title: '《征信授权书-百行》',
        url: 'http://3c.dafysz.cn/h5/sales/#/BHZX/person'
      }],
      isCb: false, // 是否回调状态
      btnMes: '开始',
      AuthenInfo: {},

    }
  },
  computed: {
    ...mapState({
      userId: state => state.global.userInfo.userId,
      idPerson: state => state.global.userInfo.idPerson,
      source: state => state.global.source,
      creditStartTime: state =>state.credit.creditStartTime,
    }),
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
        const res = await this.$api.jxhCredit.JXHgetThirdAuthConfig({clientCode: "JXHAPP"})
        if (res.code === 'sc0' || res.code === "0") {
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
    async livelogin(data) {
      await this.setCreditStartTime(); // 记录授信开始时间
      const param = {
        webankAppId: data.appId,
        version: data.version, // 接口版本号
        nonce: data.nonceStr, // 随机数
        orderNo: data.orderNo, // 订单号
        url: encodeURIComponent(`${window.location.href.split('/#/')[0]}/#/liveAc`), // 需要第三方提供完整 URL 且做 URL Encode
        userId: data.userId, // 用户 ID
        sign: data.sign // 签名
      }
      const url = `https://ida.webank.com/api/web/livelogin?${queryToString(param)}`
      window.location.replace(url);
    },
    async getQueryInfo() {
      let data = window.location.search;
      data = qs.parse(data);
      const kesArr = Object.keys(data)
      if (kesArr.length === 0) return // 表示非人脸回调
      if (!this.userId) this.$messagebox('当前浏览器不支持，请切换其他浏览器')
      const param = {
        "userId": this.userId,
        "livingScore": data.liveRate,
        "apiType": 202,
        "merchantName": '微众银行',
        "reqOrderCode": data.orderNo,
        "clientCode": "JXHAPP"
      }
      const res = await this.$api.jxhCredit.JXHuploadLivingDetection(param)
      if (res.code === 'sc0' || res.code === '0') {
        this.$toast('视频认证成功')
        this.isCb = true
        this.btnMes = '下一步'
        let url = window.location.href.split('?')[0];
        url = `${url}#/personInfo`;
        window.location.href = url
      } else {
        this.isCb = false
        this.btnMes = '开始'
        this.$toast(res.message)
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
  background-color: #fff;
  .content{
    margin-top: .18rem;
    background-color: #fff;
    width: 100%;
    padding: .36rem 0;
    text-align: center;
    h4{
      color: #D09E54;
      font-size: .24rem;
    }
    h3{
      color: #363636;
      font-size: .3rem;
    }
    p{
      color: #868686;
      font-size: .24rem;
    }
    ul{
      margin: .2rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      li{
        font-size: .3rem;
        width: .54rem;
        height: .54rem;
        line-height: .54rem;
        color: #363636;
        background-color: #eee;
        margin-right: .22rem;
        &:last-child{
          margin-right: 0;
        }
      }
    }
    img{
      display: inline-block;
      width: 4rem;
      height: 4rem;
      margin: .42rem 0 1.03rem 0;
    }
  }
  .live-footer{
    flex-shrink: 0;
    /deep/ .protocol-item{
      height: auto;
    }
    .live-btn{
      padding: 0 .3rem ;
        button{
          -webkit-appearance: none;
          border: none;
          width: 6.9rem;
          height: .92rem;
          margin-bottom: .3rem;
          font-size: .32rem;
          color: #fff;
          border-radius: .1rem;
          background:linear-gradient(270deg,rgba(208,158,84,1) 0%,rgba(225,188,120,1) 100%);
          &[disabled="disabled"]{
            background-color: #ddd;
          }
        }
    }
  }
}
</style>
