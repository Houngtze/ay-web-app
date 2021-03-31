<template>
    <div class="page-layout">
        <div class="success-container">
            <img src="./img/receive-success.png" alt="">
            <p class="first-child">恭喜你领取成功</p>
            <p class="last-child">激活POS机后退还押金</p>
        </div>
        <div class="result-explain">
            <p>邮寄说明：用户支付成功后，平台核实相关信息无误将在7个工作日内邮寄，请留意快递信息。</p>
            <p>返还押金：用户收到POS机激活后可关注微信公众号<span>【爱用有钱】</span>,回复<span>【押金】</span>平台核实无误后即可退还。</p>
            <p>客服咨询：相关客服咨询可关注微信公众号【爱用有钱】直接回复咨询。</p>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex";
    import {redirectToLoginPage} from '@/helpers/utils'
    import {Toast} from 'mint-ui';


    export default {
        data() {
            return {
                orderNo: '',
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
            // 立即支付
            payNow() {
                this.$router.push({path: '/cashier', query: {orderNo: this.orderNo}});
            }
        },
        created() {
            this.orderNo = this.$route.query.orderNo;
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
                if (from.path == '/') {
                    setTimeout(() => {
                        window.sessionStorage.removeItem('baseInfo');
                        window.location.href = window.location.origin + '/custom-page/receive-pos/#/index';
                    }, 3000)
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
        p {
            line-height: 1;
        }
        .success-container, .fail-container {
            background-color: #fff;
            text-align: center;
            img {
                display: inline-block;
                width: 1.06rem;
                height: 1.06rem;
            }
        }
        .success-container {
            overflow: hidden;
            padding-top: .92rem;
            height: 3.9rem;
            .first-child {
                color: #363636;
                font-size: .36rem;
                margin: .3rem 0 .2rem;
            }
            .last-child {
                color: #A8A8A8;
                font-size: .24rem;
            }
        }
        .fail-container {
            height: 4.62rem;
            padding-top: .6rem;
            .first-child {
                color: #363636;
                font-size: .36rem;
                margin: .3rem 0 .2rem;
            }
            .last-child {
                color: #A8A8A8;
                font-size: .24rem;
            }
            button {
                border-style: none;
                color: #fff;
                font-size: .36rem;
                line-height: .8rem;
                border-radius: .46rem;
                background: linear-gradient(to left, #FF432A, #FF712B);
                width: 3rem;
                margin-top: .5rem;
            }
        }
        .result-explain {
            padding: .3rem;
            font-size: .24rem;
            color: #A8A8A8;
            p {
                line-height: 1.6;
                margin-bottom: .1rem;
            }
            span {
                color: #363636;
            }
        }
    }
</style>