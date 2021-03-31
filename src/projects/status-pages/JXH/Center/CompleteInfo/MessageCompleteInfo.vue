<template>
  <div class="page-main">
      <div class="photo-warp">
        <div class="title">照片证明</div>
        <div class="photo-box">
            <div class="photo-item" @click="openUpload('loanPaper')">
                <div class="photo-preview-bg"  v-show="!imgPrviewShow">
                    <img  src="../../../image/icon-camera.png"/>
                </div>
                <div class="perview-box" v-show="imgPrviewShow">
                    <img  ref="loanPaperFilelImg"/>
                </div>
                <input type="file" accept="image/*" capture="camera" @change="fileVal($event,'loanPaper')" ref="loanPaperImgUpload"
                           style="display: none">
                <p>贷款告知函</p>
            </div>
            <div class="photo-item" @click="openUpload('imei')">
                <div class="photo-preview-bg"  v-show="!imgPrviewShowIMEI">
                    <img  src="../../../image/icon-camera.png"/>
                </div>
                <div class="perview-box" v-show="imgPrviewShowIMEI">
                    <img  ref="imeiFilelImg"/>
                </div>
                <input type="file" accept="image/*" capture="camera" @change="fileVal($event,'imei')" ref="imeiImgUpload"
                           style="display: none">
                <p>手机盒IMEI码</p>
            </div>
        </div>
      </div>
      <div class="other-warp">
            <div class="title">其他证明</div>
            <div class="form">
                <ul>
                    <li>
                        <label>手机IMEI码</label>
                        <input type="text" v-model="phoneImei"  placeholder="请输入手机IMEI码">
                    </li>
                </ul>
            </div>
      </div>
      <div class="btn" @click="sumbit" v-preventReClick>提交</div>
  </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {imgCompression} from '@/helpers/utils'
    import {local} from '@/helpers/storage';
    import {redirectToLoginPage} from '@/helpers/utils';
    import env from '@/helpers/env';
  export default {
    name: "JXHMessageCompleteInfo",
    data() {
      return {
          isJXHAPP: env.isJXHAPP(),
          phoneImei: '',
          imgPrviewShow: false,
          loanPaper: '',
          imgPrviewShowIMEI: false,
          imeiImg: '',

      }
    },
    computed: {
      ...mapState({
        userId: state => state.global.userInfo.userId,
        isSign: state => state.global.userInfo.isSign,
      }),
    },
    mounted() {
        
    },
    methods: {
        // 打开上传图片
        openUpload(type) {
             if(type === 'loanPaper'){
                this.$refs.loanPaperImgUpload.dispatchEvent(new MouseEvent('click'));
             }else{ 
                this.$refs.imeiImgUpload.dispatchEvent(new MouseEvent('click'));
             }
            
        },
        async fileVal(event,type){
            let file = event.target.files[0];
            file = await imgCompression(file);
            let formData=new FormData();
            formData.append('files',file);
            const res = await this.$api.jxhUploadFiles(formData);
            if (res.code === '0') {
                if(type === 'loanPaper'){
                    this.loanPaper = res.data.imgSrc + '/' +res.data.imgUrls[0].content;
                }else {
                    this.imeiImg = res.data.imgSrc + '/' +res.data.imgUrls[0].content;
                }
                let reader = new FileReader();
                //正式读取文件
                reader.readAsDataURL(file);
                //为文件读取成功设置事件
                reader.onload= (e) => {
                    if(type === 'loanPaper'){
                        this.$refs.loanPaperFilelImg.src = e.target.result;
                        this.imgPrviewShow = true;
                    }else{
                        this.$refs.imeiFilelImg.src = e.target.result;
                        this.imgPrviewShowIMEI = true;
                    }
                };
            } else {
                this.$toast(res.message);
            }
        },
        async sumbit(){
            if (event.target.disabled) { //过滤重复点击
                return;
            }
            if (!this.userId) {
                if (this.isJXHAPP){
                    await redirectToLoginPage();
                    return ;
                }
            }
            if(!this.loanPaper){
                this.$toast('请先上传贷款告知函');
                return;
            }else if(!this.phoneImei){
                this.$toast('请填写手机IMEI码');
                return;
            }
            let prams = {
                userId: this.userId,
                loanPaper: this.loanPaper,
                imei: this.phoneImei,
                imeiImg: this.imeiImg
            }
            const res = await this.$api.submitLoanApply(prams);
            if (res.result === 'success') {
                window.location.href = window.location.origin + '/custom-page/jxh-loan/#/repayment/loan-list';
            }else{
                this.$toast(res.message);
            }
        }
    }
  }
</script>

<style scoped lang="scss">
  .page-main{
      color: #363636;
      .photo-warp{
          background-color: #fff;
          padding: 0.22rem 0 0.32rem 0.32rem;
          margin-top: 0.16rem;
          margin-bottom: 0.16rem;
          .title{
              font-size: 0.32rem;
              font-weight: 600;
              margin-bottom: 0.22rem;
          }
          .photo-box{
              display: flex;
              .photo-item{
                margin-right: 0.5rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                .photo-preview-bg{
                    position: relative;
                    width: 1.6rem;
                    height: 1.6rem;
                    background-color: #F7F7F7;
                    margin-bottom: 0.14rem;
                    img{
                        width: 0.6rem;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                    }
                }
                .perview-box{
                    img{
                        width: 1.6rem;
                        height: 1.6rem;
                    }
                }
                p{
                    font-size: 0.3rem;
                    text-align: center;
                }
              }

          }
      }
      .other-warp{
          background-color: #fff;
          padding: 0.22rem 0 0 0.32rem;
          .title{
                font-size: 0.32rem;
                font-weight: 600;
                border-bottom: 1px solid #EEEEEE;
                padding-bottom: 0.22rem;
          }
        .form{
            background-color: #FFF;
            li{
                width: 100%;
                height: 1.02rem;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #EEE;

            input{
                    color: #000000;
                    border: 0;
                    font-size: 0.30rem;
                    width: 65%;
                }
            input::-webkit-input-placeholder{
                font-size: 0.30rem;
                color:#A8A8A8;
                line-height: normal;
            }
            label{
                width: 1.63rem;
                margin-right: 0.18rem;
                display: inline-block;
                font-size: 0.3rem;
                color:#363636;
                }
            }
        }
      }
      .btn{
            width:6.84rem;
            height:0.88rem;
            background:rgba(186,153,80,1);
            border-radius:0.44rem;
            line-height: 0.88rem;
            text-align: center;
            font-size: 0.32rem;
            color: #fff;
            margin: 0 auto;
            position: fixed;
            bottom: 0.32rem;
            left: 0.34rem;
      }
  }

</style>
