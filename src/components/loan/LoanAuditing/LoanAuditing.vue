<template>
  <div class="loan-auditing" v-if="auditingResult">
    <div class="auditing-result">
      <div :class="'auditing-img ' + auditingResult.status"></div>
      <h3>{{auditingResult.text}}</h3>
      <p v-if="auditingResult.desc">{{auditingResult.desc}}</p>
    </div>
    <div class="data-block">
      <div class="data-header g-mobile-border">
        <slot name="data-header"></slot>
      </div>
      <div class="data-block-content list" v-if="auditingResult.status !== 'fail'">
        <ul>
          <li v-for="(item, index) in auditingData.listData" :key="index">
            <p>
              {{item.text}}：{{item.value}}
              <label v-if="item.label">{{item.label}}</label>
            </p>
            <div class="item-btn" v-if="item.isShowBtn"
                 @click="item.onActivateEvent(item.onActivateContent)"></div>
          </li>
        </ul>
      </div>
      <div class="data-block-content gird" v-else>
        <div class="item" v-for="(item, index) in auditingData.girdData" :key="index">
          <img :src="Company[item].imgSrc">
          <p>{{Company[item].name}}</p>
        </div>
      </div>
    </div>
    <div class="page-bottom-btn" v-if="auditingResult.status !== 'on'">
      <button @click="handlerBtn">{{auditingBtn[auditingResult.status].text}}</button>
    </div>
    <div class="agree-check" v-if="auditingResult.status === 'success' && auditingAgreement">
      <label class="agree-checkbox"><input type="checkbox" v-model="agreeMsg"/><i></i></label>
      <span>我已阅读并同意
        <label @click="toProtocol(item.protocolUrl)" v-for="(item, index) in auditingAgreement" :key="index">
          《{{item.protocolElucidation}}》
          <span v-if="index !== (auditingAgreement.length -1) && auditingAgreement.length > 1">&</span>
        </label>
      </span>
    </div>
  </div>
</template>

<script>
  import {Company} from "./data";
  export default {
    name: "LoanAuditing",
    data() {
      return {
        Company,
        agreeMsg: true
      }
    },
    props: ['auditingResult', 'auditingData', 'auditingBtn', 'auditingAgreement'],
    methods: {
      handlerBtn() {
        if (this.auditingResult.status === 'success') {
          if (!this.agreeMsg) {
            this.$toast('请先阅读并同意协议')
            return
          }
        }
        this.auditingBtn[this.auditingResult.status].onActivateBtn()
      },
      toProtocol(href) {
        window.location.href = href
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../style/common.scss';
  .loan-auditing{
    & .auditing-result{
      margin-bottom: .18rem;
      background: #fff;
      text-align: center;
      padding: .4rem 0;
      & .auditing-img{
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 1.05rem;
        height: 1.05rem;
        display: inline-block;
        &.success{
          @include bg-image('./images/auditing-success');
        }
        &.fail{
          @include bg-image('./images/auditing-fail');
        }
        &.on{
          @include bg-image('./images/auditing-on');
        }
      }
      & h3{
        font-size: .34rem;
        color: #363636;
        line-height: 1;
        margin-top: .2rem;
      }
      & p{
        font-size: .24rem;
        color: #a8a8a8;
        line-height: 1;
        margin-top: .2rem;
      }
    }
  }

</style>
