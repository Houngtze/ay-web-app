<template>
    <div class="page-layout">
        <div class="cashier-container">
            <div class="cashier-header">
                <p>支付剩余时间</p>
                <ul>
                    <li class="time">{{String(mTime).substring(0,1)}}</li>
                    <li class="time">{{String(mTime).substring(1,2)}}</li>
                    <li class="dot">:</li>
                    <li class="time">{{String(sTime).substring(0,1)}}</li>
                    <li class="time">{{String(sTime).substring(1,2)}}</li>
                </ul>
            </div>
            <ul class="cashier-content">
                <li>
                    <span>充值面额</span>
                    <span>￥{{rechargePrice}}</span>
                </li>
                <li>
                    <span>应付金额</span>
                    <span>￥{{actualPrice}}</span>
                </li>
                <li>
                    <span>充值号码</span>
                    <span>{{phone}}</span>
                </li>
            </ul>
        </div>
        <div class="cashier-payway">
            <div class="cashier-way">
                <div>
                    <img src="./img/zfb-icon.png" alt="" class="zfb-icon">
                    <span>支付宝</span>
                </div>
                <img :src="isChecked?require('./img/checked.png'):require('./img/radio-no.png')" alt=""
                     class="checked-icon" @click="isChecked=!isChecked">
            </div>
            <div class="cashier-footer">
                <div class="cashier-price">
                    <span>实付款</span>
                    <p>
                        <span>￥</span>
                        <span class="bigger-font">{{actualPrice}}</span>
                    </p>
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
                isChecked: true,
                payAmount: '',
                rechargePrice: '',
                actualPrice: '',
                phone: '',
                oTime: '',
                mTime: '',
                sTime: '',
                timer: null,
                fhtml: ''
            }
        },
        computed: {
            ...mapState({
                isSign: state => state.global.sign.isSign,
                userId: state => state.global.userInfo.userId,
                ucAccountId: state => state.global.userInfo.ucAccountId,
                idPerson: state => state.global.userInfo.idPerson,
                ident: state => state.global.userInfo.ident,
                tel: state => state.global.userInfo.phone,
                userName: state => state.global.userInfo.name
            })
        },
        methods: {
            // 生成订单
            async payNow() {
                if (!this.isChecked) {
                    return this.$toast('请选择支付方式');
                }
                let params = {
                    id: this.$route.query.id,
                    uid: this.userId,
                    phone: this.phone,
                    price: this.rechargePrice,
                    channel: this.source,
                };
                let res = await this.$api.generateOrder(params);
                if (res.code === '0') {
                    // 调起支付
                    let zfbParams = {
                        orderNo: res.data.orderNo,
                        h5NotifyUrl: window.location.origin + '/custom-page/prepaid-refill/#/result?orderNo=' + res.data.orderNo,
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
                }
            }
        },
        created() {
            this.rechargePrice = this.$route.query.price;
            this.actualPrice = this.$route.query.actual;
            this.phone = this.$route.query.phone;
            let totalTime = window.sessionStorage.getItem('createTime') - (new Date()).getTime();
            this.timer = setInterval(() => {
                if (totalTime > 0) {
                    totalTime -= 1000;
                    let m = Math.floor(totalTime / 1000 / 60 % 60);
                    let s = Math.floor(totalTime / 1000 % 60);
                    this.mTime = m >= 10 ? m : `0${m}`;
                    this.sTime = s >= 10 ? s : `0${s}`;
                } else {
                    this.$router.back();
                }
            }, 1000);
        },
        beforeDestroy() {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
</script>

<style scoped lang="scss">
    .page-layout {
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .cashier-container {
            background-color: #fff;
            .cashier-header {
                height: 1.46rem;
                text-align: center;
                padding: .3rem 0;
                background: linear-gradient(to left, #D09E54, #E1BC78);
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                p {
                    color: #FFFFFF;
                    font-size: .24rem;
                }
                ul {
                    display: flex;
                    justify-content: center;
                    li {
                        font-size: .24rem;
                        line-height: .4rem;
                        margin-right: .1rem;
                    }
                    .time {
                        width: .4rem;
                        height: .4rem;
                        border-radius: .06rem;
                        background-color: #fff;
                    }
                    .dot {
                        color: #fff;
                    }
                }
            }
            .cashier-content {
                li {
                    display: flex;
                    justify-content: space-between;
                    line-height: .7rem;
                    font-size: .24rem;
                    padding: 0 .32rem;
                    span:nth-child(2) {
                        color: #868686;
                    }
                }
            }
        }
        .cashier-payway {
            margin-top: .18rem;
            background-color: #fff;
            height: 73%;
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
                        color: #363636;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        .bigger-font {
                            font-size: .36rem;
                        }
                        p {
                            color: #F63337;
                            margin-left: .1rem;
                        }
                    }
                    &:last-child {
                        width: 40%;
                        font-size: .32rem;
                        color: #fff;
                        text-align: center;
                        background: linear-gradient(to left, #D09E54, #E1BC78);
                    }
                }
            }
        }
    }
</style>