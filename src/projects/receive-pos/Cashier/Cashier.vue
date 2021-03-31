<template>
    <div class="page-layout">
        <div class="cashier-header" v-for="(item,index) in detailData" :key="index">
            <div class="good-img">
                <img :src="item.img" alt="">
            </div>
            <div class="good-content">
                <p>{{item.title}}</p>
                <p>￥{{item.amount}}</p>
            </div>
        </div>
        <div class="cashier-center">
            <div class="cashier-way">
                <div>
                    <img src="./img/zfb-icon.png" alt="" class="zfb-icon">
                    <span>支付宝</span>
                </div>
                <img :src="isChecked?require('./img/checked.png'):require('./img/radio-no.png')" alt=""
                     class="checked-icon" @click="isChecked=!isChecked">
            </div>
            <div class="cashier-footer">
                <div>
                <span class="cashier-price">
                    <span class="smaller-font">￥</span>
                    <span>{{payAmount}}.</span>
                    <span class="smaller-font">00</span>
                </span>
                    <span class="cashier-tip">(POS机激活后返还)</span>
                </div>
                <div @click="payNow">立即支付</div>
            </div>
        </div>
        <div ref="fhtml" v-show="false" v-html="fhtml"></div>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex";

    export default {
        data() {
            return {
                fhtml: '',
                detailData: [],
                isChecked: true,
                baseInfo: {},
                orderNo: '',
                payAmount: ''
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
            // 查询机型
            async getDetail() {
                let res = await this.$api.getGoodDetail({
                    model: 'MPOS',
                    channel: window.sessionStorage.getItem('source')
                });
                if (res.code === '0') {
                    this.detailData = res.data.list;
                    this.payAmount = res.data.list[0].amount;
                } else {
                    this.$toast(res.message);
                }
            },
            // 调起支付
            async goPay(orderNo) {
                // 调起支付
                let zfbParams = {
                    orderNo: orderNo,
                    h5NotifyUrl: window.location.origin + '/custom-page/receive-pos/#/result?orderNo=' + orderNo,
                };
                let goToZFB = await this.$api.payByAlipayHttp(zfbParams);
                if (goToZFB.code === 'sc0') {
                    if (goToZFB.data && goToZFB.data && goToZFB.data !== '') {
                        this.fhtml = goToZFB.data;
                        this.$nextTick(() => {
                            this.$refs.fhtml.firstChild.submit();
                        });
                    }
                } else {
                    this.$toast(goToZFB.message);
                }
            },
            // 点击立即支付
            async payNow() {
                if (this.orderNo) {
                    this.goPay(this.orderNo);
                } else {
                    if (!this.isChecked) {
                        return this.$toast('请选择支付方式');
                    }
                    let address = (this.baseInfo.area.province || '') + (this.baseInfo.area.city || '') + (this.baseInfo.area.region || '') + (this.baseInfo.area.street || '') + (this.baseInfo.area.address || '') + this.baseInfo.address;
                    // 保存订单
                    let params = {
                        name: this.baseInfo.name,
                        phone: this.baseInfo.tel,
                        address: address,
                        uid: this.userId,
                        posModel: 'MPOS',
                        channel: window.sessionStorage.getItem('source')
                    };
                    let addOrder = await this.$api.addOrder(params);
                    if (addOrder.code === '0') {

                    } else {
                        this.$toast(addOrder.message);
                    }
                    await this.goPay(addOrder.data);
                }
            }
        },
        created() {
            if (window.sessionStorage.getItem('baseInfo')) {
                this.baseInfo = JSON.parse(window.sessionStorage.getItem('baseInfo'));
            }
            if (this.$route.query.orderNo) {
                this.orderNo = this.$route.query.orderNo;
            }
            this.getDetail();
        }
    }
</script>

<style scoped lang="scss">
    .page-layout {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-family: PingFangSC;
        color: #363636;
        .cashier-header {
            width: 100%;
            height: 2.85rem;
            margin-bottom: .2rem;
            padding: .3rem;
            display: flex;
            justify-content: flex-start;
            background-color: #fff;
            .good-img {
                width: 26%;
                height: 100%;
                text-align: center;
                line-height: 1.8rem;
                img {
                    height: 1.8rem;
                    width: auto;
                }
            }
            .good-content {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                margin-left: .22rem;
                width: 74%;
                height: 100%;
                font-size: .28rem;
                max-height: 1.8rem;
                p {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                }
            }
        }
        .cashier-center {
            background-color: #fff;
            height: 100%;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            .cashier-way {
                display: flex;
                justify-content: space-between;
                padding: .32rem;
                .zfb-icon {
                    width: .54rem;
                    height: .54rem;
                    margin-right: .2rem;
                    vertical-align: middle;
                }
                .checked-icon {
                    width: .38rem;
                    height: .38rem;
                    display: inline-block;
                }
            }
            .cashier-footer {
                line-height: 1rem;
                display: flex;
                justify-content: space-between;
                div {
                    &:first-child {
                        width: 60%;
                        border-top: .02rem solid #e5e5e5;
                        padding-left: .36rem;
                        font-size: .26rem;
                        .cashier-price {
                            color: #363636;
                            font-size: .36rem;
                            .smaller-font {
                                font-size: .26rem;
                                color: #363636;
                            }
                        }
                        .cashier-tip {
                            color: #FE3636;
                            font-size: .24rem;
                            margin-left: .15rem;
                        }
                    }
                    &:last-child {
                        width: 40%;
                        font-size: .32rem;
                        color: #fff;
                        text-align: center;
                        background: linear-gradient(to left, #FF432A, #FF712B);
                    }
                }
            }
        }
    }
</style>