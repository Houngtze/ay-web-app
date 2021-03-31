<template>
    <div class="page-layout">
        <person-info-com :isShowProgress=false submitText="提交" source="AYSCAPP_XYRZ" @submitForm="submitPersonInfo"></person-info-com>
    </div>
</template>

<script>
    import PersonInfoCom from "../../../components/credit/PersonInfo/PersonInfoA";
    import {mapState, mapActions} from "vuex";

    export default {
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
            PersonInfoCom
        },
        methods: {
            async submitPersonInfo(val) {
                val.source = 'AYSCAPP_XYRZ';
                val.personId = this.idPerson;
                const res = await this.$api.credit.addPersonInfo(val);
                if (res.code === 'sc0') {
                    this.$toast({
                        message: res.message,
                        position: 'bottom'
                    });
                    this.$router.replace({path: '/index'});
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