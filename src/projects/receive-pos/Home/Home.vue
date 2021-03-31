<template>
    <div class="page-layout">
        <div class="home-container">
            <img src="./img/home-bg.png" alt="">
            <img src="./img/home-rule.png" alt="" class="rule-img" @click="toRule">
            <div class="home-area">
                <img src="./img/home-title.png" alt="">
                <div class="area-form">
                    <div class="form-item">
                        <span>姓名</span>
                        <input type="text" maxlength="11" minlength="2" placeholder="请输入真实姓名" v-model="baseInfo.name">
                    </div>
                    <div class="form-item">
                        <span>手机号</span>
                        <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="baseInfo.tel">
                    </div>
                    <div class="form-item">
                        <span>POS型号</span>
                        <span class="pos-model">MPOS</span>
                    </div>
                    <div class="form-item">
                        <span>所在地区</span>
                        <span class="choose-area" v-if="!baseInfo.area.province"
                              @click="showChooseAddress = !showChooseAddress">请选择</span>
                        <span class="area-detail" v-else @click="showChooseAddress = !showChooseAddress">{{baseInfo.area.province}}{{baseInfo.area.city}}{{baseInfo.area.region}}{{baseInfo.area.street}}</span>
                    </div>
                    <div class="form-item">
                        <span>收货地址</span>
                        <input type="text" maxlength="100" placeholder="请输入收货地址" v-model="baseInfo.address">
                    </div>
                </div>
                <button @click="receiveNow">立即领取</button>
            </div>
        </div>
        <area-address @callback="add_address" @showAddressPop="toggle_popup" v-if="showChooseAddress"></area-address>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex";
    import {redirectToLoginPage} from '@/helpers/utils'
    import areaAddress from "./Area";

    export default {
        components: {
            areaAddress
        },
        data() {
            return {
                showChooseAddress: false,
                baseInfo: {
                    name: '',
                    tel: '',
                    address: '',
                    area: {
                        province: null,
                        city: null,
                        region: null,
                        street: null,
                        address: null
                    }
                }
            }
        },
        computed: {
            ...mapState({
                isSign: state => state.global.sign.isSign,
                userId: state => state.global.userInfo.userId,
                ucAccountId: state => state.global.userInfo.ucAccountId,
                idPerson: state => state.global.userInfo.idPerson,
                ident: state => state.global.userInfo.ident,
                phone: state => state.global.userInfo.phone,
                userName: state => state.global.userInfo.name
            })
        },
        methods: {
            // 查看规则
            toRule() {
                this.$router.push('/orders');
            },
            // 选择地址
            add_address(address) {
                this.baseInfo.area = {
                    ...this.baseInfo.area,
                    ...{
                        province: address[0].name,
                        city: address[1].name,
                        region: address[2].name,
                        street: address[3] ? address[3].name : ''
                    }
                }
            },
            // 地址组件开关
            toggle_popup() {
                this.showChooseAddress = !this.showChooseAddress
            },
            // 立即领取
            receiveNow() {
                window.sessionStorage.setItem('baseInfo', JSON.stringify(this.baseInfo));
                if (!this.userId) {
                    return this.$router.push('/login');
                }
                if (!new RegExp(/^([\u4e00-\u9fa5]|[\u4e00-\u9fa5]·){2,}$/).test(this.baseInfo.name)) {
                    return this.$toast("请填写有效姓名");
                } else if (!new RegExp(/^(13[0-9]|14[579]|15[0-4,5-9]|17[0135678]|18[0-9]|19[8-9]|166)\d{8}$/).test(this.baseInfo.tel)) {
                    return this.$toast("请填写有效手机号");
                } else if (!this.baseInfo.area.province) {
                    return this.$toast("请选择地区");
                } else if (!this.baseInfo.address) {
                    return this.$toast("请填写收货地址");
                } else {
                    this.$router.push('/cashier');
                }
            }
        },
        created() {
            if (this.$route.query.source) {
                this.source = this.$route.query.source;
                window.sessionStorage.setItem('source', this.$route.query.source);
            }
            if (window.sessionStorage.getItem('baseInfo')) {
                this.baseInfo = JSON.parse(window.sessionStorage.getItem('baseInfo'));
            }
        }
    }
</script>

<style scoped lang="scss">
    .page-layout {
        .home-container {
            position: relative;
            height: 100%;
            width: 100%;
            img {
                display: inline-block;
                width: 100%;
                height: auto;
            }
            .rule-img {
                position: absolute;
                height: .78rem;
                width: 1.38rem;
                right: 0;
                top: .12rem;
            }
            .home-area {
                position: absolute;
                width: 100%;
                height: 50%;
                background: url("./img/home-area.png") no-repeat center;
                background-size: cover;
                top: 30%;
                left: 0;
                z-index: 100;
                text-align: center;
                padding: .58rem .62rem .54rem;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                align-items: center;
                .area-form {
                    width: 100%;
                    margin: .3rem 0 .6rem;
                    .form-item {
                        line-height: 1rem;
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        border-bottom: .02rem solid #e5e5e5;
                        .pos-model, .choose-area, .area-detail {
                            width: 75%;
                            text-align: left;
                        }
                        .choose-area {
                            color: #A8A8A8;
                        }
                        .pos-model {
                            color: #363636;
                        }
                        .area-detail {
                            color: #363636;
                            width: 75%;
                            text-align: left;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        span {
                            color: #363636;
                            font-size: .3rem;
                            font-family: PingFangSC;
                        }
                        input {
                            color: #363636;
                            width: 75%;
                            font-size: .3rem;
                            &::-webkit-input-placeholder {
                                color: #A8A8A8;
                                font-size: .3rem;
                                font-family: PingFangSC;
                            }
                            &::-moz-placeholder {
                                color: #A8A8A8;
                                font-size: .3rem;
                                font-family: PingFangSC;
                            }
                            &::-ms-input-placeholder {
                                color: #A8A8A8;
                                font-size: .3rem;
                                font-family: PingFangSC;
                            }
                        }
                    }
                }
                img {
                    width: 28%;
                    height: auto;
                    display: inline-block;
                }
                button {
                    width: 100%;
                    line-height: .9rem;
                    border-radius: .46rem;
                    background: linear-gradient(to left, #FF432A, #FF712B);
                    border-style: none;
                    color: #fff;
                    font-size: .36rem;
                }
            }
        }
        /deep/ .address {
            .selected {
                color: #FF432A;
            }
        }
    }
</style>