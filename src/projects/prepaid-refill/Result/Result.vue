<template>
    <div class="page-layout">
        <div class="result-container">
            <img src="./img/pay-success.png" alt="">
            <p class="pay-success">支付成功</p>
            <p class="pay-delay">充值稍后到账</p>
            <button @click="toOrderList">完成</button>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex";

    export default {
        data() {
            return {}
        },
        methods: {
            // 跳转订单列表
            toOrderList() {
                this.$router.push({path: '/index', query: {type: 1}});
            }
        },
        created() {

        }
    }
</script>

<style scoped lang="scss">
    .page-layout {
        height: 100%;
        background-color: #fff;
        .result-container {
            text-align: center;
            padding: .4rem .3rem;
            p {
                line-height: 1;
            }
            img {
                height: 1.06rem;
                width: auto;
                display: inline-block;
            }
            .pay-success {
                font-size: .34rem;
                margin: .3rem 0 .2rem;
            }
            .pay-delay {
                font-size: .24rem;
                color: #A8A8A8;
            }
            button {
                border-style: none;
                color: #fff;
                font-size: .36rem;
                line-height: .8rem;
                border-radius: .1rem;
                background: linear-gradient(to left, #D09E54, #E1BC78);
                width: 100%;
                margin-top: .92rem;
            }
        }
    }
</style>