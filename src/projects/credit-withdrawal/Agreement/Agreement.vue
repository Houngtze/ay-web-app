<template>
    <div class="page-layout">
        <div class="agreement-header">
            请阅读并同意以下协议，并将页面内容观看完才能点击按钮
        </div>
        <div class="agreement-content">
            <AgreementContent></AgreementContent>
        </div>
        <div class="agreement-btn" @click="goAgree">
            <button :class="showBtn?'':'close'">同意</button>
        </div>
    </div>
</template>

<script>
    import AgreementContent from './AgreementContent';
    export default {
        components: {
            AgreementContent
        },
        data() {
            return {
                isBottom: false,
                showBtn: false
            }
        },
        watch: {
            isBottom(val) {
                if (val) {
                    this.showBtn = true;
                }
            }
        },
        methods: {
            getScrollTop() {
                return document.documentElement.scrollTop || document.body.scrollTop
            },
            getWinHeight() {
                return document.documentElement.clientHeight || document.body.clientHeight
            },
            getScrollHeight() {
                let bodyScrollHeight = 0;
                let documentScrollHeight = 0;
                if (document.body) {
                    bodyScrollHeight = document.body.scrollHeight
                }
                if (document.documentElement) {
                    documentScrollHeight = document.documentElement.scrollHeight
                }
                // 当页面内容超出浏览器可视窗口大小时，Html的高度包含body高度+margin+padding+border所以html高度可能会大于body高度
                return (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight
            },
            isReachBottom() {
                const scrollTop = this.getScrollTop(); // 获取滚动条的高度
                const winHeight = this.getWinHeight(); // 一屏的高度
                const scrollHeight = this.getScrollHeight(); // 获取文档总高度
                return this.isBottom = scrollTop == parseInt(scrollHeight) - winHeight
            },
            goAgree() {
                if (this.showBtn) {
                    window.sessionStorage.setItem('isAgree', 1);
                    this.$router.back();
                }
            }
        },
        created() {
            // 处理大屏设备文档已展示完全的情况
            this.$nextTick(() => {
                let winHeight = this.getWinHeight();
                let scrollHeight = this.getScrollHeight();
                if (winHeight >= scrollHeight) {
                    this.showBtn = true;
                }
            });
            window.addEventListener("scroll", this.isReachBottom);
        }
    }
</script>

<style scoped lang="scss">
    .page-layout {
        font-family: PingFangSC;
        overflow-y: auto;
        .agreement-header {
            line-height: .6rem;
            background-color: #F2F2F2;
            color: #A8A8A8;
            padding: 0 .3rem;
            font-size: .24rem;
        }
        .agreement-content {
            padding: 0 .3rem .3rem;
            background-color: #fff;
            color: #363636;
            font-size: .24rem;
            margin-bottom: 1.52rem;
            p {
                font-size: .28rem;
                text-align: center;
                line-height: .84rem;
            }
            iframe {
                width: 100%;
                height: 100%;
            }
        }
        .agreement-btn {
            height: 1.52rem;
            width: 100%;
            padding: .3rem;
            background-color: #fff;
            position: fixed;
            bottom: 0;
            z-index: 100;
            button {
                border-style: none;
                color: #fff;
                font-size: .36rem;
                height: 100%;
                border-radius: .1rem;
                background: linear-gradient(to left, #D09E54, #E1BC78);
                width: 100%;
            }
            .close {
                background: #A8A8A8;
            }
        }
    }
</style>
