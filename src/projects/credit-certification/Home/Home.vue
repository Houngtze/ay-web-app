<template>
    <div class="page-layout">
        <div class="layout-container" v-if="showPage">
            <div class="page-header">
                <img v-lazy="pageData.userImgUrl?pageData.userImgUrl:require('../images/default.png')" alt="">
                <div class="user-info">
                    <p>
                        <span>{{pageData.account}}</span>
                        <span>{{pageData.isRealName==='Y'?'已实名':'未实名'}}</span>
                    </p>
                    <p>资料完成度{{pageData.progress}}</p>
                </div>
            </div>
            <div class="page-content">
                <ul class="already-open" v-for="(items,index) in listData" :key="index">
                    <li class="content-tips" v-for="(item,idx) in items" :key="idx"
                        @click="goCertification(item)">
                        <!--:class="index==1 && !showMore?'[fade-enter-active,fade-enter]':'[fade-leave-active,fade-leave-to]'"-->
                        <img :src="item.iconUrl" alt="">
                        <div class="tips-info">
                            <p>{{item.certificationName}}</p>
                            <p>{{item.describe}}</p>
                        </div>
                        <p class="tips-status">
                            <span>{{getStatus(item.isComplete,item.isDredge)}}</span>
                            <img src="../images/right.png" alt="">
                        </p>
                    </li>
                </ul>
                <div @click="showMoreProduct" class="show-more">
                    <span>{{showMore?'展开':'收起'}}</span>
                    <img :src="showMore?require('./img/down.png'):require('./img/up.png')" alt="">
                </div>
            </div>
        </div>
        <div class="page-bottom">
            -点滴信用 重在积累-
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from "vuex";
    import {redirectToLoginPage} from '@/helpers/utils'

    export default {
        name: "Home",
        data() {
            return {
                pageData: {},
                showLoading: null,
                showPage: false,
                listData: [],
                noPassData: [],
                doneData: [],
                showMore: true
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
            // 展开
            showMoreProduct() {
                this.showMore = !this.showMore;
                if (this.showMore) {
                    this.listData.pop(this.noPassData);
                } else {
                    this.listData.push(this.noPassData);
                }
            },
            // 获取配置数据
            async getConfigData() {
                const res = await this.$api.getCreditRelated({phone: this.phone, source: 'AYSCAPP_XYRZ'});
                if (res.code === 'sc0') {
                    this.pageData = res.data;
                    this.noPassData = this.pageData.certificationList.filter((val) => {
                        return val.isDredge === "N";
                    });
                    this.doneData = this.pageData.certificationList.filter((val) => {
                        return val.isDredge !== "N";
                    });
                    this.listData = [this.doneData];
                    this.showPage = true;
                } else {
                    this.$toast({
                        message: res.message,
                        position: 'bottom'
                    })
                }
            },
            // 去认证
            goCertification(item) {
                if ((item.isDredge == 'N' && item.isComplete == 'N') || (item.isDredge == 'Y' && item.isComplete == 'Y')) {
                    return
                }
                if (item.isComplete == 'Z') {
                    return this.$toast('您的认证正在进行中');
                }
                this.$router.push({
                    path: '/credit',
                    query: {code: item.code, name: item.certificationName, isCredit: this.pageData.isCredit}
                });
                window.sessionStorage.setItem('certificationInfo', JSON.stringify(item.certificationInfo));
            },
            // 处理状态
            getStatus(isComplete, isDredge) {
                if (isDredge == 'Y' && isComplete == 'Y') {
                    return '已完成';
                } else if ((isDredge == 'Y' && isComplete == 'N') || (isDredge == 'Y' && isComplete == 'Z')) {
                    return '未完成';
                } else if (isDredge == 'N' && isComplete == 'N') {
                    return '未开通';
                }
            }
        },
        created() {
            if (!this.userId) {
                this.$router.push('/login');
            } else {
                this.getConfigData();
            }
        }
    }
</script>

<style scoped lang="scss">
    .page-layout {
        color: #363636;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        p {
            line-height: 1;
        }
        .page-header {
            background-color: #fff;
            display: flex;
            justify-content: flex-start;
            padding: .76rem .3rem;
            margin-bottom: .18rem;
            .user-info {
                padding: .16rem 0 .16rem .22rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                span {
                    &:nth-child(1) {
                        font-size: .36rem;
                        margin-right: .16rem;
                    }
                    &:nth-child(2) {
                        display: inline-block;
                        padding: .06rem .16rem;
                        color: #DAB26E;
                        border: .02rem solid #DAB26E;
                        border-radius: .26rem;
                        font-size: .24rem;
                    }
                }
                p {
                    &:nth-child(1) {
                        display: flex;
                        align-items: flex-end;
                    }
                    &:nth-child(2) {
                        font-size: .26rem;
                        color: #A8A8A8;
                    }
                }
            }
            img {
                display: inline-block;
                width: 1.1rem;
                height: 1.1rem;
            }
        }
        .page-content {
            .content-tips {
                height: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: .24rem .3rem .24rem 0;
                font-size: .24rem;
                border-bottom: .02rem solid #f3f3f3;
                img {
                    display: inline-block;
                    width: .72rem;
                    height: .72rem;
                }
                .tips-info {
                    width: 75%;
                    height: .72rem;
                    padding-left: .22rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    p {
                        &:nth-child(1) {
                            font-size: .3rem;
                        }
                        &:nth-child(2) {
                            color: #A8A8A8;
                        }
                    }
                }
                .tips-status {
                    color: #DAB26E;
                    img {
                        display: inline-block;
                        width: .12rem;
                        height: .22rem;
                        margin-left: .14rem;
                        vertical-align: middle;
                    }
                }
            }
            .already-open, .wait-open {
                background-color: #fff;
                padding-left: .3rem;
            }
            .show-more {
                line-height: .6rem;
                font-size: .26rem;
                text-align: center;
                color: #868686;
                background-color: #fff;
                span {
                    vertical-align: middle;
                }
                img {
                    height: .14rem;
                    width: auto;
                    margin-left: .06rem;
                    vertical-align: middle;
                }
            }
        }
        .page-bottom {
            width: 100%;
            line-height: .84rem;
            text-align: center;
            color: #A8A8A8;
            font-size: .24rem;
        }
        .fade-enter-active, .fade-leave-active {
            transition: opacity .5s;
        }
        .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
        {
            opacity: 0;
        }
    }
</style>
