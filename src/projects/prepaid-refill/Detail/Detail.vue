<template>
    <div class="page-layout">
        <div class="detail-header">
            <p><img src="./img/phone-icon.png" alt=""><span>{{detailData.title}}</span></p>
            <p>{{detailData.denomination}}</p>
            <p>{{dealState()}}</p>
            <ul>
                <li>
                    <span>手机号码</span>
                    <span>{{detailData.phone}}</span>
                </li>
                <li>
                    <span>商品金额</span>
                    <span>{{detailData.denomination}}</span>
                </li>
                <li>
                    <span>优惠金额</span>
                    <span>-{{detailData.discountAmount}}</span>
                </li>
                <li>
                    <span>实付金额</span>
                    <span>{{detailData.theAmount}}</span>
                </li>
            </ul>
        </div>
        <div class="detail-footer">
            <ul>
                <li>
                    <span>订单编号</span>
                    <span>{{detailData.orderNo}}</span>
                </li>
                <li>
                    <span>下单时间</span>
                    <span>{{detailData.createTime}}</span>
                </li>
            </ul>
        </div>
        <div class="detail-other" v-if="detailData.state==1 && detailData.payState==1">
            <div>
                <p>1.扫描微信公众号二维码关注【爱用有钱】</p>
                <p>2.回复“客服”，联系客服发起退款或重新充值</p>
            </div>
            <img src="./img/code.png" alt="">
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex";

    export default {
        data() {
            return {
                detailData: {}
            }
        },
        methods: {
            // 处理订单状态
            dealState() {
                if (this.detailData.state == 1 && this.detailData.payState == 0) {
                    return '已完成';
                } else if (this.detailData.state == 1 && this.detailData.payState == 1) {
                    return '充值失败';
                } else if (this.detailData.state == 1 && this.detailData.payState == 2) {
                    return '充值中';
                }
            },
            // 查询订单详情
            async getOrderDetail() {
                let res = await this.$api.getOrderDetail({orderNo: this.$route.query.id});
                if (res.code) {
                    this.detailData = res.data;
                }
            }
        },
        created() {
            this.getOrderDetail();
        }
    }
</script>

<style scoped lang="scss">
    .page-layout {
        .detail-header {
            background-color: #fff;
            padding-top: .46rem;
            text-align: center;
            color: #363636;
            p {
                line-height: 1;
            }
            p:nth-child(1) {
                font-size: .3rem;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    height: .52rem;
                    width: auto;
                    margin-right: .12rem;
                }
            }
            p:nth-child(2) {
                font-size: .48rem;
                margin: .32rem 0 .28rem;
            }
            p:nth-child(3) {
                font-size: .24rem;
            }
            ul {
                padding: .38rem .3rem 0;
                li {
                    display: flex;
                    justify-content: space-between;
                    line-height: .7rem;
                    font-size: .24rem;
                    span:nth-child(2) {
                        color: #868686;
                    }
                }
            }
        }
        .detail-footer {
            background-color: #fff;
            margin: .18rem 0;
            ul {
                padding: 0 .3rem;
                li {
                    display: flex;
                    justify-content: space-between;
                    font-size: .24rem;
                    line-height: .7rem;
                    span:nth-child(2) {
                        color: #868686;
                    }
                }
            }
        }
        .detail-other {
            height: 1.44rem;
            padding: .22rem .3rem;
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            img {
                height: 100%;
                width: auto;
            }
            p {
                line-height: .5rem;
            }
        }
    }
</style>