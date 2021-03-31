<template>
    <div class="page-layout">
        <div class="order-container">
            <ul class="order-tab">
                <li :class="index==currentIndex?'active':''" @click="changeTab(index)" v-for="(item,index) in tabList">
                    {{item}}
                </li>
            </ul>
            <div class="rule-content" v-if="currentIndex==0">
                <div class="content-text">
                    <p>免费领取POS机</p>
                    <p>申请步骤：</p>
                    <p>1.活动期间在活动页面申请领取，正确填写相关信息后支付￥30。平台核实无误后会在7个工作日内安排邮寄，请留意快递信息；</p>
                    <p>2.用户收到POS机激活后可关注微信公众号【爱用有钱】,回复【押金】平台核实无误后即可退还；</p>
                    <p>3.如有其它问题，欢迎关注微信公众号【爱用有钱】咨询。</p>

                    <p>重点解答：</p>
                    <p>POS机的作用？</p>
                    <p>急用钱周转不求人，用POS机随用随刷，方便安全。</p>
                    <p>手续费多少？多久到账？</p>
                    <p>当日秒到账收取0.6%手续费+3元；T+1到账收取0.6%手续费。</p>
                </div>
                <p class="bottom-notice">如有其它问题，欢迎关注微信公众号【爱用有钱】咨询</p>
            </div>
            <div class="order-content" v-if="currentIndex==1">
                <div class="no-order" v-if="orderList.length==0">
                    <img src="./img/no-order.png" alt="">
                    <p class="no-text">您还没有相关的订单</p>
                </div>
                <div class="order-list" v-if="true">
                    <div class="list-tips" v-for="(item,index) in orderList" :key="index">
                        <p class="order-status">
                            <span>时间：{{item.createTime | timestampToTime}}</span>
                            <span>{{item.state | dealState}}</span>
                        </p>
                        <div class="tips-content">
                            <div class="img-tip">
                                <img :src="item.img" alt="">
                            </div>
                            <div class="tips-title">
                                <p class="good-title">{{item.title}}</p>
                                <p class="pay-notice" v-if="item.state===0">30分钟未付款，订单将自动取消</p>
                                <div class="pay-btn">
                                    <span>￥{{item.amount}}</span>
                                    <span @click="goNext(item)">{{item.state | dealBtnState}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="bottom-notice">如有其它问题，欢迎关注微信公众号【爱用有钱】咨询</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex";
    import {redirectToLoginPage} from '@/helpers/utils'

    export default {
        data() {
            return {
                tabList: ['规则', '订单记录'],
                currentIndex: 0,
                orderList: [],
                timer: null,
            }
        },
        filters: {
            dealBtnState: function (val) {
                if (val === 0) {
                    return '继续支付'
                } else if (val === 1) {
                    return '查看详情'
                }
            },
            dealState(val) {
                if (val === 0) {
                    return '待支付'
                } else if (val === 1) {
                    return '已支付'
                }
            },
            timestampToTime(timestamp) {
                let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let Y = date.getFullYear();
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                let D = Number(date.getDate()) >= 10 ? date.getDate() : `0${date.getDate()}`;
                let h = Number(date.getHours()) >= 10 ? date.getHours() : `0${date.getHours()}`;
                let m = Number(date.getMinutes()) >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
                let s = date.getSeconds();
                return `${Y}-${M}-${D} ${h}:${m}`;
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
                name: state => state.global.userInfo.name
            })
        },
        methods: {
            // tab切换
            changeTab(idx) {
                this.currentIndex = idx;
            },
            // 处理失效订单
            updateOrderList() {
                this.timer = setInterval(() => {
                    this.orderList.forEach(item => {
                        item.totalTime = item.createTime + 1800000 - (new Date()).getTime();
                        if (item.totalTime > -1000 && item.totalTime < 0) {
                            this.getOrderListdata();
                        }
                    })
                })
            },
            // 获取订单列表
            async getOrderListdata() {
                let params = {
                    uid: this.userId,
                    channel: window.sessionStorage.getItem('source')
                };
                let res = await this.$api.getOrderList(params);
                if (res.code === '0') {
                    this.orderList = res.data.list;
                } else {
                    this.$toast(res.message);
                }
            },
            // 点击订单
            goNext(item) {
                if (item.state === 0) {
                    this.$router.push({path: '/cashier', query: {orderNo: item.orderNo}});
                } else if (item.state === 1) {
                    this.$router.push({path: '/result', query: {result: 1}});
                }
            }
        },
        created() {
            this.getOrderListdata();
            this.updateOrderList();
        },
        beforeDestroy() {
            clearInterval(this.timer);
            this.timer = null;
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                if (from.path == '/result' || from.path == '/cashier') {
                    vm.currentIndex = 1;
                } else {
                    vm.currentIndex = 0;
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    .page-layout {
        height: 100%;
        background-color: #f9f9f9;
        color: #363636;
        .order-container {
            height: 100%;
            overflow: auto;
            .order-tab {
                display: flex;
                justify-content: space-between;
                line-height: .7rem;
                background-color: #fff;
                li {
                    width: 50%;
                    list-style: none;
                    font-size: .3rem;
                    color: #363636;
                    text-align: center;
                    margin: 0 1.1rem;
                }
                .active {
                    color: #FF5E47;
                    border-bottom: .08rem solid #FF5D47;
                }
            }
            .rule-content {
                height: 94%;
                background-color: #fff;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                padding: .26rem .3rem .28rem;
                p {
                    width: 100%;
                    word-break: break-all;
                    &:nth-child(1) {
                        font-size: .3rem;
                        font-weight: bold;
                        margin-bottom: .2rem;
                    }
                    &:nth-child(2) {
                        margin-bottom: .1rem;
                    }
                    &:nth-child(3) {
                        margin-bottom: .2rem;
                    }
                    &:nth-child(4) {
                        margin-bottom: .2rem;
                    }
                    &:nth-child(5) {
                        margin-bottom: .9rem;
                    }
                    &:nth-child(6) {
                        margin-bottom: .1rem;
                    }
                    &:nth-child(8) {
                        margin-bottom: .2rem;
                    }
                }
                .bottom-notice {
                    width: 100%;
                    text-align: center;
                    color: #868686;
                    font-size: .2rem;
                }
            }
            .order-content {
                height: 93%;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                margin-top: .2rem;
                .no-order {
                    text-align: center;
                    img {
                        width: 2.1rem;
                        height: auto;
                        display: inline-block;
                        margin-bottom: .3rem;
                        margin-top: 1.02rem;
                    }
                    .no-text {
                        color: #A8A8A8;
                        font-size: .3rem;
                    }
                }
                .order-list {
                    .list-tips {
                        min-height: 2.6rem;
                        margin-bottom: .2rem;
                        padding: 0 .32rem;
                        background-color: #fff;
                        .order-status {
                            display: flex;
                            justify-content: space-between;
                            line-height: .6rem;
                            font-size: .2rem;
                            span {
                                &:first-child {
                                    color: #A8A8A8;
                                }
                                &:last-child {
                                    color: #FF4949;
                                }
                            }
                        }
                        .tips-content {
                            display: flex;
                            justify-content: space-between;
                            .img-tip {
                                height: 1.8rem;
                                width: 1.8rem;
                                margin-right: .24rem;
                                img {
                                    height: 100%;
                                    width: 100%;
                                    display: inline-block;
                                }
                            }
                            .tips-title {
                                width: 73%;
                                min-height: 1.8rem;
                                display: flex;
                                justify-content: space-between;
                                flex-direction: column;
                                .good-title {
                                    font-size: .28rem;
                                }
                                .pay-notice {
                                    color: #A8A8A8;
                                }
                                .pay-btn {
                                    display: flex;
                                    justify-content: space-between;
                                    span {
                                        &:first-child {
                                            font-size: .28rem;
                                        }
                                        &:last-child {
                                            display: inline-block;
                                            width: 1.3rem;
                                            line-height: .5rem;
                                            border: .02rem solid #e5e5e5;
                                            border-radius: .26rem;
                                            text-align: center;
                                            font-size: .22rem;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .bottom-notice {
                    width: 100%;
                    text-align: center;
                    color: #868686;
                    font-size: .2rem;
                    margin-bottom: .28rem;
                }
            }
        }
    }
</style>