<template>
    <div class="page-layout">
        <base-info-com @submitForm="submitBaseInfo"></base-info-com>
    </div>
</template>

<script>
    import BaseInfoCom from "../../../components/credit/BaseInfo/BaseInfo";
    import {mapState, mapActions} from "vuex";

    export default {
        name: "BaseInfo",
        data() {
            return {}
        },
        computed: {
            ...mapState({
                isSign: state => state.global.userInfo.isSign,
                userId: state => state.global.userInfo.userId,
                ucAccountId: state => state.global.userInfo.ucAccountId,
                idPerson: state => state.global.userInfo.idPerson,
                identity: state => state.global.userInfo.identity,
                phone: state => state.global.userInfo.phone,
                name: state => state.global.userInfo.name
            })
        },
        components: {
            BaseInfoCom
        },
        methods: {
            ...mapActions('global', ['setIdPerson', 'updateUserInfo']),
            async submitBaseInfo(val) {
                const param = {
                    bankNo: val.bankCode,
                    ident: val.code,
                    name: val.name,
                    phone: val.phone,
                    smsCode: val.vCode,
                    ucAccountId: this.ucAccountId,
                    userId: this.userId,
                    source: 'AYSCAPP_XYRZ'
                };
                const res = await this.$api.credit.realAuthen(param);
                if (res.code === 'sc0') {
                    this.$toast({
                        message: res.message,
                        position: 'bottom'
                    });
                    // 更新idPerson
                    this.setIdPerson(res.data.idPerson);
                    const idPerson = res.data.idPerson || 0;
                    await this.updateUserInfo({userId: this.userId, idPerson});
                    this.$router.replace({path: "/index"});
                } else {
                    this.$toast({
                        message: res.message,
                        position: 'bottom'
                    })
                }
            }
        }
    }
</script>

<style scoped lang="scss">

</style>