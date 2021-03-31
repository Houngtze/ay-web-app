<template>
    <div class="page-layout">
        <img :src="certificationInfo.certificationPicture" alt="">
        <p>{{certificationInfo.certificationMessage}}</p>
        <button @click="goPromote">去提升信用</button>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex";

    export default {
        name: "credit",
        data() {
            return {
                code: '',
                certificationInfo: {}
            }
        },
        computed: {
            ...mapState({
                isSign: state => state.global.userInfo.isSign,
                userId: state => state.global.userInfo.userId,
                ucAccountId: state => state.global.userInfo.ucAccountId,
                idPerson: state => state.global.userInfo.idPerson,
                ident: state => state.global.userInfo.ident,
                phone: state => state.global.userInfo.phone,
                name: state => state.global.userInfo.name
            })
        },
        methods: {
            // 去提升信用
            goPromote() {
                if (!this.idPerson && this.code !== '001') {
                    return this.$messagebox({
                        title: '',
                        message: '请先完成实名认证',
                        showCancelButton: true
                    }).then(val => {
                        if (val === 'confirm') {
                            this.$router.push('/baseInfo');
                        }
                    });
                }
                switch (this.code) {
                    case '001':
                        this.$router.push('/baseInfo');
                        break;
                    case '002':
                        this.$router.push('/personInfo');
                        break;
                    case '003':
                        this.getOperatorStatus();
                        break;
                    case '004':
                        this.getZhimaCreditInfo();
                        break;
                    case '010':
                        this.checkIsAuthorization();
                        break;
                    default:
                        break;
                }
            },
            // 运营商认证
            async getOperatorStatus() {
                const res = await this.$api.getOperatorStatus({
                    phone: this.phone,
                    name: this.name,
                    ident: this.ident,
                    userId: this.userId,
                    orgType: 'AYSC_AH',
                    source: 'AYSCAPP_XYRZ',
                    clientCode: 'AYSCAPP'
                });
                if (res.code === 'sc0') {
                    window.location.href = res.data;
                } else {
                    this.$toast({
                        message: res.message,
                        position: 'bottom'
                    })
                }
            },
            // 芝麻分认证
            async getZhimaCreditInfo() {
                const res = await this.$api.getZhimaCreditInfo({
                    name: this.name,
                    ident: this.ident,
                    mobile: this.phone,
                    callbackUrl: window.location.origin + '/custom-page/credit-certification/#/index',
                    platform: 'H5',
                    source: 'AYSCAPP_XYRZ'
                });
                if (res.code === 'sc0') {
                    window.location.href = res.data.zhimaCreditUrl;
                } else {
                    this.$toast({
                        message: res.message,
                        position: 'bottom'
                    })
                }
            },
            // 人行征信校验爱满分是否已授权
            checkIsAuthorization() {
                if (this.$route.query.isCredit == 'Y') {
                    this.$router.replace('/authorization');
                } else {
                    this.$messagebox({
                        message: '请完成爱满分授权后再授权',
                        showCancelButton: true
                    }).then(async (val) => {
                        if (val === 'confirm') {
                            this.$nativeBridge.jumpToAmftCredit();
                        } else {
                            this.$router.back();
                        }
                    });
                }
            }
        },
        created() {
            document.title = this.$route.query.name;
            this.code = this.$route.query.code;
            this.certificationInfo = JSON.parse(window.sessionStorage.getItem('certificationInfo'));
        }
    }
</script>

<style scoped lang="scss">
    .page-layout {
        font-size: .36rem;
        padding: 1.2rem .3rem 0;
        text-align: center;
        font-family: PingFangSC;
        background-color: #fff;
        height: 100%;
        img {
            display: inline-block;
            width: 3.6rem;
            height: 3.6rem;
        }
        p {
            color: #363636;
            margin: .4rem 0 1rem;
            line-height: 1;
        }
        button {
            border: none;
            background: linear-gradient(to left, #D09E54, #E1BC78);
            color: #fff;
            padding: .3rem 0;
            width: 100%;
            border-radius: .1rem;
        }
    }
</style>
