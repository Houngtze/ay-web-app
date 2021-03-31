<template>
  <div class="page-detail">
    <div class="detail-content">
      <p class="p-tt">1.爱用商城优惠券包</p>
      <table class="p-table">
        <tr>
          <td>序号</td>
          <td>数量</td>
          <td>总面值</td>
          <td>优惠券</td>
        </tr>
        <tr v-for="(item, index) in yhqData" :key="index">
          <td>{{index+1}}</td>
          <td>{{item.num}}</td>
          <td>{{item.price}}</td>
          <td>{{item.msg}}</td>
        </tr>
        <tr>
          <td>总价值</td>
          <td colspan="3">1240元</td>
        </tr>
      </table>
      <p class="p-warm">备注：优惠券均为限使用品类的优惠券</p>
      <p class="p-tt">2.爱奇艺会员</p>
      <p class="p-content">深圳洽客将会为您赠送一张爱奇艺黄金会员（月卡）。<br>
爱奇艺会员发放方式：上述爱奇艺会员服务将在成功购买商城特权礼包最迟10个工作日内以短信方式向您的注册手机号码发送,您可获得的爱奇艺视频会员月卡兑换码/激活码，您可凭获取的前述兑换码/激活码前往爱奇艺视频APP激活使用，或在爱奇艺电脑端、公众号（爱奇艺VIP）内进行激活使用。</p>
      <img class="p-img" src="./images/adv-1@2x.png">
      <p class="p-tt">3.出行意外险赠险服务</p>
      <p class="p-content">为回馈购买商城特权礼包的用户，爱用商城之运营主体深圳洽客与保险公司及其代理机构等合作机构（以下统称“服务提供商”，）达成一致，由服务提供商从《赠险产品列表》中择一向您免费提供服务。<br>
可能赠送给您的具体险种由服务提供商根据您购买商城特权礼包的时间顺序实时匹配为准，届时您将收到服务提供商向您发送的有关赠险确认信息。具体赠送险种保障内容和相关赠险协议您可向服务提供商通过网站、电话、短信等方式查询。</p>
      <img class="p-img" src="./images/adv-2@2x.png">
      <p class="p-tt">4.借款人意外伤害保障项目</p>
      <p class="p-content">为回馈购买商城特权礼包的用户，将为您赠送一份借款人意外伤害保障项目，加入包含但不仅限于紫金平台的借款人人身意外伤害保险项目（以下称“保障项目”），保险金额最高为申请消费分期之总金额。</p>
      <p class="p-tt">5.账户安全保障服务</p>
      <p class="p-content">爱用商城之运营主体深圳洽客科技有限公司（以下简称“洽客科技”）作为投保人，以您为被保险人向洽客科技的合作方购买账户安全险，在服务保障期间如出现因被他人盗刷、盗用、复制等非本人主观故意导致您的个人账户资金损失的，您可通过爱用商城合作方获得相应赔偿。<br>
有关账户安全保障服务的具体内容（含保障范围、申请赔偿流程等）详见《账户安全保障服务说明》。</p>
    </div>
    <p class="txt-bottom" @click="linkTap('http://aiyong.dafysz.cn/terms/gold-more.html')">关于产品详情具体可查看《商城特权礼包服务协议》</p>
  </div>
</template>
<script>
import env from "@/helpers/env";
export default {
  data() {
    return {
      yhqData:[
        {
          num:2,
          price:40,
          msg:'满500-20元优惠券',
        },
        {
          num:2,
          price:100,
          msg:'满1000-50元优惠券',
        },
        {
          num:2,
          price:200,
          msg:'满3000-100元优惠券',
        },
        {
          num:2,
          price:300,
          msg:'满5000-150元优惠券',
        },
        {
          num:2,
          price:600,
          msg:'满10000-300元优惠券',
        },
      ],
    };
  },
  created() {
  },
  methods: {
    linkTap(url){
      window.location.href = url;
    }
  }
};
</script>
<style lang="scss" scoped>
.page-detail{
  color: #363636;
  background: #fff;
  .detail-content{
    padding: 0.3rem;
    .p-tt{
      font-size: 0.24rem;
      padding: 0.2rem 0;
    }
    .p-warm{
      color: #A8A8A8;
      font-size: 0.18rem;
    }
    .p-content{
      font-size: 0.22rem;
    }
    .p-img{
      width: 100%;
      height: auto;
      display: block;
      margin: 0.2rem 0;
    }
    .p-table{
      width: 100%;
      border-left: 1px solid #a8a8a8;
      border-top: 1px solid #a8a8a8;
      td{
        border-right: 1px solid #a8a8a8;
        border-bottom: 1px solid #a8a8a8;
        padding: 0.2rem 0;
        text-align: center;
        font-size: 0.2rem;
      }
    }
  }
  .txt-bottom{
    text-align: center;
    color: #A8A8A8;
    font-size: 0.2rem;
    height: 0.56rem;
  }
}
</style>

