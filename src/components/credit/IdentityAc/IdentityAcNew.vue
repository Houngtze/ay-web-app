<template>
  <div class="identity-ac">
    <div class="content">
      <div class="identity-bar">
        <p class="warn">温馨提示：请按图示要求上传您的身份证照片，确保真实有效。</p>
        <div class="full-face">
          <div v-if="!status1">
            <span class="camera" @click="$refs.taskFullFace.click()"></span>
            <span>请拍摄身份证人像面</span>
          </div>
          <div v-else>
            <span class="camera" style="position:absolute;" @click="$refs.taskFullFace.click()"></span>
            <img ref="faceImg">
          </div>
          <input type="file" accept="image/*" capture="camera" @change="faceVal" ref="taskFullFace" style="display: none">
          
        </div>
        <div class="reverse">
          <div v-if="!status2">
            <span class="camera" @click="openTaskReverse"></span>
            <span>请拍摄身份证国徽面</span>
          </div>
          <div v-else > 
            <span class="camera" style="position:absolute;" @click="$refs.taskReverse.click()"></span>
            <img ref="reverseImg">
          </div>
          <input type="file" accept="image/*" capture="camera" @change="reverseVal" ref="taskReverse" style="display: none">
        </div>
        <div class="reverse">
          <div class="new-bg" v-if="!status3">
            <span class="camera" @click="openTaskHandle"></span>
            <span>请拍摄手持身份证照</span>
          </div>
          <div v-else > 
            <span class="camera" style="position:absolute;" @click="$refs.taskHandle.click()"></span>
            <img ref="handleImg">
          </div>
          <input type="file" accept="image/*" capture="camera" @change="handleIdCard" ref="taskHandle" style="display: none">
        </div>
      </div>
      <div class="identity-footer">
        <div class="identity-btn">
          <button :disabled="!status1 || !status2" @click="openSureIdentity">下一步</button>
        </div>
      </div>
    </div>
    <div class="pop-bar">
      <mt-popup v-model="identityPopVisible" position="bottom" class="mint-bar-popup">
        <div class="confirm-bar">
          <div class="title">
            <span class="close" @click="identityPopVisible = false"></span>
            <span class="warn">请确认信息并保证是本人申请</span>
          </div>
          <ul class="message">
            <li>
              <label>姓名</label>
              <input type="text" placeholder="请输入您的真实姓名" v-model="reName">
              <span class="edit"></span>
            </li>
            <li>
              <label>身份证号</label>
              <input type="text" maxlength="18" placeholder="请输入您的真实身份证号码" v-model="reIdent">
              <span class="edit"></span>
            </li>
          </ul>
          <div class="identity-btn">
            <button :disabled="reName ==='' || reIdent ==='' || !status3 || !checked" @click="toNextPage">下一步</button>
          </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import ProgressBar from '../components/Progress'
import {imgCompression, formatDateTime} from '@/helpers/utils'

function checkName(value) {
  const reg = /^([\u4e00-\u9fa5]|[\u4e00-\u9fa5]·){2,}$/;
  if (!reg.test(value)) {
    return false
  }else {
    return true
  }
}

function checkCode(value) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(value)) {
    return false
  }else {
    return true
  }
}

export default {
  components: {
    ProgressBar,
  },
  data() {
    return {
      checked: true,
      linkArr: [],
      checkedArr: [],
      status1: false,
      status2: false,
      status3: false,
      identityPopVisible: false,
      protocolPopVisible: false,
      idCardInfo: null,
      reIdent: '',
      reName: '',
      oldName:'',
      oldIdent:'',
    }
  },
  computed: {
    ...mapState({
      userId: state => state.global.userInfo.userId,
      ucAccountId: state =>state.global.userInfo.ucAccountId,
      idPerson: state =>state.global.userInfo.idPerson,
      mobile: state =>state.global.userInfo.phone
    })
  },
  watch: {
    idCardInfo: {
      handler(val) {
        this.reIdent = val.ident,
        this.reName = val.name
      },
      deep: true
    }
  },
  methods: {
    toast(mes) {
      this.$toast({
        message: mes,
        duration: 1500,
        position: 'bottom'
      });
    },
    async faceVal(ev){
      let file = ev.target.files[0];
      file = await imgCompression(file);
      let formData=new FormData();
      formData.append('file',file);
      formData.append('name','idCardFront');
      formData.append('channel','H5');
      formData.append('orgType','TXZF');
      formData.append('userId',this.userId);
      const res = await this.$api.fileUploadHttp(formData)
      if (res.code === 'sc0') {
        this.idCardInfo = res.data
        this.reIdent = res.data.ident
        this.reName = res.data.name
        this.oldName = res.data.name;
        this.oldIdent = res.data.ident;
        this.status1 = true
        let reader = new FileReader();
        //为文件读取成功设置事件
        reader.onload= (e) => {
          this.$refs.faceImg.src = e.target.result;
        };
        //正式读取文件
        reader.readAsDataURL(file)
      } else {
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },
    openTaskReverse() {
      if (!this.status1) {
        this.$toast('请先拍摄身份证正面照')
        return
      }
      this.$refs.taskReverse.click()
    },
    openTaskHandle() {
      if (!this.status1) {
        this.$toast('请先拍摄身份证正面照')
        return
      }
      if (!this.status2) {
        this.$toast('请先拍摄身份证背面照')
        return
      }
      this.$refs.taskHandle.click()
    },
    async reverseVal(ev){
      let file = ev.target.files[0];
      file = await imgCompression(file);
      let formData=new FormData();
      formData.append('file',file);
      formData.append('name','idCardBack');
      formData.append('channel','H5');
      formData.append('orgType','TXZF');
      formData.append('userId',this.userId);
      const res = await this.$api.fileUploadHttp(formData)
      if (res.code === 'sc0') {
        this.status2 = true
        this.idCardInfo.issuer = res.data.issuer
        this.idCardInfo.validBegin = res.data.validBegin
        this.idCardInfo.validEnd = res.data.validEnd
        let reader = new FileReader();
        //为文件读取成功设置事件
        reader.onload= (e) => {
          this.$refs.reverseImg.src = e.target.result;
        };
        //正式读取文件
        reader.readAsDataURL(file)
      } else{
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },
    async handleIdCard(ev){
      let file = ev.target.files[0];
      file = await imgCompression(file);
      let formData=new FormData();
      formData.append('file',file);
      formData.append('name','faceVerify');
      formData.append('channel','H5');
      formData.append('orgType','TXZF');
      formData.append('userId',this.userId);
      const res = await this.$api.fileUploadHttp(formData)
      if (res.code === 'sc0') {
        this.status3 = true
        let reader = new FileReader();
        //为文件读取成功设置事件
        reader.onload= (e) => {
          this.$refs.handleImg.src = e.target.result;
        };
        //正式读取文件
        reader.readAsDataURL(file)
      } else{
        this.$toast({
          message: res.message,
          position: 'bottom'
        })
      }
    },
    // 获取身份信息调用接口
    async openSureIdentity() {
      this.identityPopVisible = true
    },
    checkIdentity() {
      if (!checkName(this.reName)){
        this.toast('请填写真实姓名');
        return false
      }
      if (!checkCode(this.reIdent)){
        this.toast('请输入有效的身份证号');
        return false
      }
      return true
    },
    async toNextPage() {
      if (this.checkIdentity()) {
        this.protocolPopVisible = false;
        this.identityPopVisible = false;
        let param = {
          userId:this.userId,
          orgType:'TXZF',
        };
        if(this.reIdent != this.oldIdent){
          param.reIdent = this.reIdent;
        }
        if(this.reName != this.oldName){
          param.reName = this.reName;
        }
        const res = await this.$api.saveAddIdentInfoHttp(param);
        if (res.code === 'sc0') {
          // 退回上一页
          if (res.data !=null && res.data.activeStatus === '0') {
              this.$toast({
                message: res.message,
                position: 'bottom'
              })
              this.$router.replace({path: '/credit-baseinfo'});
          } 
          else {
            this.$router.replace({path: '/loan'})
          }
        } else {
          this.$toast({
            message: res.message,
            position: 'bottom'
          })
          // this.$router.replace({path: '/liveAc'})
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
%pop-title {
  display: flex;
  flex-direction: column;
  .title{
    display: flex;
    align-items: center;
    height: 1rem;
    border-bottom: 0.03rem solid $bd-color-main;
    .close{
      box-sizing: content-box;
      height: 0.26rem;
      width: 0.26rem;
      padding: 0.3rem;
      @include bg-image('../image/icon-close');
      background-size: 0.26rem;
      background-repeat: no-repeat;
      background-position: center;
    }
    .warn{
      width: 100%;
      text-align: center;
      font-size: 0.34rem;
      color: $color-main;
    }
  }
}
%identity-btn{
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
%checked{
  display: block;
  height: 0.28rem;
  width: 0.28rem;
  margin-right: 0.12rem;
  flex-shrink: 0;
  @include bg-image("../image/icon-check");
  background-size: 100%;
  &.checked {
    @include bg-image("../image/icon-checked");
  }
}
.identity-ac{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .content{
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    background-color: $bg-color-white;
    .identity-bar{
      display: flex;
      height: 100%;
      align-items: center;
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: auto;
      .warn{
        margin-top: 0.46rem;
        font-size: 0.24rem;
        color: $color-gray;
        margin-bottom: 0.24rem;
      }
      .camera{
        display: block;
        height: 1.3rem;
        width: 1.3rem;
        margin-bottom: 0.2rem;
        @include bg-image('../image/icon-camera-b');
        background-size: 100%;
        &:active{
          @include bg-image('../image/icon-camera-a');
        }
        opacity: 0.5;
      }
      .full-face{
        margin-bottom: 0.18rem;
        div{
          display: flex;
          width: 4.7rem;
          height: 3rem;
          margin-bottom: 0.56rem;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          @include bg-image('../image/bg-face');
          background-size: 100%;
          span{
            font-size: 0.3rem;
            color: $color-main;
          }
        }
        img{
          width: 4.7rem;
          height: 3rem;
        }
      }
      .reverse{
        margin-bottom: 0.74rem;
        div{
          display: flex;
          width: 4.7rem;
          height: 3rem;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          @include bg-image('../image/bg-reverse');
          background-size: 100%;
          span{
            font-size: 0.3rem;
            color: $color-main;
          }
        }
        .new-bg{
          @include bg-image('../image/bg-reverse2');
        }
        img{
          width: 4.7rem;
          height: 3rem;
        }
      }
    }
    .identity-footer{
      flex-shrink: 0;
      .identity-btn{
        @extend %identity-btn
      }
    }
  }
  .pop-bar{
    .mint-bar-popup{
      width: 100%;
      .confirm-bar{
        @extend %pop-title;
        .message{
          padding-left: 0.3rem;
          margin-bottom: 0.8rem;
          li{
            display: flex;
            height: 1.1rem;
            align-items: center;
            padding-right: 0.3rem;
            border-bottom: 0.03rem solid $bd-color-main;
            label{
              width: 1.38rem;
              font-size: 0.3rem;
              color: $color-gray;
              flex-shrink: 0;
            }
            input{
              width: 100%;
              border: none;
              caret-color:$color-gold;
              font-size: 0.3rem;
              color: $color-main;
              &::-webkit-input-placeholder{
                color: $color-gray;
              }
              &:disabled{
                background: none;
              }
            }
            .edit{
              flex-shrink: 0;
              width: 0.46rem;
              height: 0.46rem;
              @include bg-image('../image/icon-edit');
              background-size: 100%;
              background-repeat: no-repeat;
              background-position: center;
            }
          }
        }
        .identity-btn{
          @extend %identity-btn
        }
      }
      .protocal-bar{
        display: flex;
        padding: 0 0.3rem;
        font-size: 0.3rem;
        color: $color-main;
        p{
          line-height: 0.48rem;
        };
        .checkbox{
          margin-top: 0.1rem;
          @extend %checked
        }
        .protocal{
          color: $color-gold;
          &:visited {
            color: $color-gold;
          }
          span{
            color: $color-gray;
          }
        }
      }
      .protocol-bar{
        @extend %pop-title;
        .message{
          padding-left: 0.3rem;
          margin-bottom: 0.58rem;
          li{
            display: flex;
            height: 1.1rem;
            align-items: center;
            padding-right: 0.3rem;
            border-bottom: 0.03rem solid $bd-color-main;
            .checkbox{
              @extend %checked
            }
            .protocal{
              color: $color-gold;
              &:visited {
                color: $color-gold;
              }
              span{
                color: $color-gray;
              }
            }
          }
        }
        .identity-btn{
          @extend %identity-btn
        }
      }
    }
  }
}
</style>
