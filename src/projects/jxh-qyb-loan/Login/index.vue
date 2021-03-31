<template>
  <Login :termArr="termArr" @onActiveLogin="goNext"/>
</template>
<script>
function sum(m, n) {
  return Math.floor(Math.random() * (m - n) + n);
}
import {mapState, mapActions} from 'vuex';
import Login from "@/components/jxh/jxh-login/login"
export default {
  components: {
    Login
  },
  data(){
    return{
      termArr: [
        {name: "《个人征信授权书》", link: "https://3c.dafysz.cn/h5/sales/#/LD/JKXD_PersonCreditGrant"}
      ]
    }
  },
  beforeMount(){
  },
  mounted(){

  },
  methods:{
    goNext() {
      this.$router.replace({
        path: "/identityAc"
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.credit-login{
  width: 100%;
  .content-main{
    width: 100%;
    & > img{
      width: 100%;
      max-height: 7.73rem;
      display: block;
    }
    .footer{
      height: 7.26rem;
    }
    .form-box{
      width: 100%;
      height: 6.09rem;
      padding: 1.5rem 1.14rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      background-image: url("http://static.ali.szqk-tech.com/images/custom-page/jxh-loan/channel-syx-bg-2.png");
      background-size: 100% 100%;
      .inp-label{
        width: 5.2rem;
        min-height: 0.94rem;
        border-radius: 0.1rem;
        padding: 0 0 0 .24rem;
        margin-bottom: 0.3rem;
        display: flex;
        align-items: center;
        font-size: .32rem;
        background:rgba(240,236,233, .8);
        color: #9E9E9E;
        .inp{
          width: 100%;
          height: 100%;
          padding: 0.1rem;
          line-height: 0.8rem;
          border: 0;
          background: 0;
          font-size: 0.3rem;
          &::placeholder{
            color: #9E9E9E;
          }
        }
        .bnt{
          width: 2rem;
          color: #ff8643;
          text-align: center;
          font-size: 0.3rem;
          flex-shrink: 0;
          overflow: hidden;
          padding-left: .23rem;
          padding-right: .24rem;
          border-left: 1px solid rgba(204,204,204,1);
        }
      }
      .term-label{
         font-size: 0.2rem;
         color: #686868;
         line-height: 0.22rem;
        text-align: left;
         input{
           display: none;
         }
         .icon-cb{
           width: 0.26rem;
           height: 0.26rem;
           display: inline-block;
           vertical-align: middle;
           background: url(../images/checkbox-cheked.png) center no-repeat;
           background-size: 100% 100%;
           margin: -0.05rem 0.1rem 0 0;
         }
         input[type="checkbox"]:checked + .icon-cb{
           background-image: url(../images/check.png);
         }
       }
      .bnt-bg{
        text-align: center;
        width:3.86rem;
        min-height: .76rem;
        background:linear-gradient(90deg,rgba(254,171,69,1),rgba(255,134,67,1));
        border-radius:38px;
        background-size: 100% 100%;
        color: #fff;
        font-size: 0.32rem;
        line-height: .76rem;
        font-weight: bold;
        margin: 0.17rem 0 0.25rem 0;
      }
      .ud-txt{
        color: #686868;
        font-size: 0.28rem;
        line-height: 0.3rem;
        .col{
          color:#F43D56;
        }
      }
    }
    .bnt1{
      width: 100%;
    }
  }
}
</style>


