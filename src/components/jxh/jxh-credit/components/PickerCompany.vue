<template>
    <div class="mint-bar">
        <mt-popup v-model="popupVisible" position="bottom" class="mint-bar-popup">
            <div class="search-bar">
                <div class="search">
                    <span class="company-name">公司名称</span>
                    <input type="text" v-model="inpVal" @input="tapSearch" placeholder="请输入公司名称" class="company-btn">
                    <span class="close" @click="handleCancle"></span>
                </div>
                <div class="warn" v-if="slotArr.length === 0">
                    <span>请输入公司关键字进行搜索</span>
                    <span>如：您的公司名为<i>“xxxx”</i>有限公司，<i>“xxxx”</i>将作为关键字</span>
                </div>
            </div>
            <mt-picker v-if="slotArr.length > 0" :slots="slots" :show-toolbar="true" :visible-item-count="5"
                       value-key="val" ref="picker">
                <div class="mint-picker-btn">
                    <button @click="handleConfirm" class="sure">完成</button>
                </div>
            </mt-picker>
        </mt-popup>
    </div>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        props: ['value'],
        data() {
            return {
                popupVisible: false,
                slots: [],
                slotArr: [],
                inpVal: null,
                setTime: null
            };
        },
        watch: {
            slotArr: {
                handler(val) {
                    this.slots = [
                        {
                            flex: 1,
                            values: [].concat(val),
                            textAlign: "center"
                        }
                    ];
                },
                deep: true
            },
            popupVisible(val) {
                if (!val) this.$emit('handleValue', this.inpVal)
            }
        },
        computed: {
            ...mapState({
                userId: state => state.global.userInfo.userId
            })
        },
        created() {
            this.slots = [
                {
                    flex: 1,
                    values: [].concat(this.slotArr),
                    textAlign: "center"
                }
            ];
        },
        methods: {
            handleCancle() {
                this.popupVisible = false;
            },
            handleConfirm() {
                const res = this.$refs.picker.getValues()[0];
                const val = res.val;
                const index = res.index;
                this.inpVal = val
                this.popupVisible = false
            },
            open() {
                this.inpVal = this.value || null
                this.popupVisible = true;
            },
            tapSearch() {
                if (this.setTime) {
                    console.log(new Date())
                    clearTimeout(this.setTime);
                }
                this.setTime = setTimeout(() => {
                    this.searchCompany()
                }, 2000)
            },
            async searchCompany() {
                console.log(new Date())
                const controlerRes = await this.$api.credit.searchCompanyControler({
                    key: 'company_inspection',
                    userId: this.userId
                });
                if (controlerRes.code === 'sc0') {
                    if (controlerRes.data.isOpen) {
                        const param = {
                            searchStr: this.inpVal,
                            userId: this.userId
                        }
                        const res = await this.$api.credit.searchCompanyName(param)
                        if (res.code === 'sc0') {
                            const arr = res.data.map((item, index) => {
                                return {
                                    index,
                                    val: item.companyName
                                }
                            })
                            this.slotArr = arr;
                        }
                    } else {
                        this.$toast({
                            message: '未搜索到相关公司',
                            position: 'bottom'
                        })
                    }
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import '../style/index.scss';

    input::-webkit-search-cancel-button {
        display: none;
    }

    .mint-bar-popup {
        width: 100%;
        .mint-picker-btn {
            display: flex;
            width: 100%;
            height: 1rem;
            justify-content: flex-end;
            button {
                border: none;
                background: none;
                padding: 0 0.3rem;
                font-size: 0.34rem;
                color: $color-main;
                &.sure {
                    color: $color-gold;
                }
            }
        }
        .search-bar {
            display: flex;
            flex-direction: column;
            .search {
                display: flex;
                align-items: center;
                height: 1.1rem;
                .company-name {
                    flex-shrink: 0;
                    width: 1.98rem;
                    text-align: center;
                    font-size: 0.3rem;
                    color: #363636;
                }
                form {
                    width: 100%;
                }
                .company-btn {
                    width: 100%;
                    border: none;
                    caret-color: $color-gold;
                    &::-webkit-input-placeholder {
                        color: $color-gray;
                    }
                }
                .close {
                    flex-shrink: 0;
                    box-sizing: content-box;
                    height: 0.26rem;
                    width: 0.26rem;
                    padding: 0.3rem;
                    @include bg-image('../image/icon-close');
                    background-size: 0.26rem;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            }
            .warn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 3.78rem;
                padding: 0 0.8rem;
                span {
                    font-size: 0.3rem;
                    color: #868686;
                    margin-bottom: 0.26rem;
                    &:last-child {
                        font-size: 0.26rem;
                        color: #a8a8a8;
                        text-align: center;
                        line-height: 0.42rem;
                        i {
                            list-style: none;
                            color: $color-gold;
                        }
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
    @import '../style/index.scss';

    .mint-toast {
        z-index: 9999;
    }

    .mint-bar {
        .picker-toolbar {
            height: 1rem;
            border-bottom: 0.03rem solid $bd-color-main;
        }
        .picker-item {
            height: 0.8rem;
            font-size: 0.3rem;
            color: $color-gray;
            &.picker-selected {
                font-size: 0.38rem;
                color: $color-main;
            }
        }
    }

</style>

